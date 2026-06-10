const { Property } = require("../../model/schema/property");
const { slugify, normalizePropertyMedia } = require("./utils");
const {
  getPropertyContacts,
  getPropertyPhoneCalls,
  getPropertyEmails,
} = require("./query.service");
const { cleanupPropertyFiles } = require("../../services/mediaService");

const resolveUniqueSlug = async (input, excludedId = null) => {
  const baseSlug = slugify(input || "property");
  let slug = baseSlug || "property";
  let suffix = 1;

  while (true) {
    const existing = await Property.findOne({
      publicSlug: slug,
      ...(excludedId ? { _id: { $ne: excludedId } } : {}),
    })
      .select("_id")
      .lean();

    if (!existing) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
};

const buildOwnershipFilter = (req, id) => {
  // $ne:true also covers legacy documents that miss the "deleted" flag
  const filter = { _id: id, deleted: { $ne: true } };
  // Non-super admins may only manage their own listings
  if (req.user?.role !== "superAdmin") {
    filter.createBy = req.user?.userId;
  }
  return filter;
};

const index = async (req, res) => {
  const query = { ...req.query, deleted: { $ne: true } };

  // Enforce ownership for non-super admins (server-side security)
  // Super admin may query any creator via ?createBy=...
  if (req.user?.role !== "superAdmin") {
    query.createBy = req.user?.userId;
  }

  const allData = await Property.find(query)
    .populate({
      path: "createBy",
      match: { deleted: false },
    })
    .lean();

  // Do not drop properties when creator is deleted/missing;
  // admin should still see and be able to manage them.
  res.send(allData.map(normalizePropertyMedia));
};

const add = async (req, res) => {
  try {
    req.body.createdDate = req.body.createdDate || new Date();
    req.body.updatedDate = req.body.updatedDate || new Date();
    // Explicitly publish the listing so it is always visible in the catalog
    req.body.deleted = false;
    // Always set creator from the authenticated user (never trust client input)
    req.body.createBy = req.user?.userId;

    const slugSource = req.body.publicSlug || req.body.name || req.body.propertyAddress || "property";
    req.body.publicSlug = await resolveUniqueSlug(slugSource);

    const property = new Property(req.body);
    await property.save();
    res.status(200).json(property);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const addMany = async (req, res) => {
  try {
    const insertedProperty = await Property.insertMany(req.body);
    res.status(200).json(insertedProperty);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const edit = async (req, res) => {
  try {
    const ownershipFilter = buildOwnershipFilter(req, req.params.id);
    const property = await Property.findOne(ownershipFilter).lean();

    if (!property) {
      return res.status(404).json({ message: "no Data Found." });
    }

    // Never allow reassigning the listing owner from the client
    delete req.body.createBy;

    if (req.body.publicSlug || req.body.name || req.body.propertyAddress) {
      const slugSource =
        req.body.publicSlug ||
        req.body.name ||
        req.body.propertyAddress ||
        property.publicSlug ||
        property.name ||
        property.propertyAddress;
      req.body.publicSlug = await resolveUniqueSlug(slugSource, req.params.id);
    }

    if (!req.body.updatedDate) {
      req.body.updatedDate = new Date();
    }

    const result = await Property.updateOne(
      ownershipFilter,
      { $set: req.body },
    );

    if (req?.body?.Floor !== undefined && req?.body?.Floor !== property?.Floor) {
      const currentFloor = Number(property?.Floor);
      const nextFloor = Number(req?.body?.Floor);

      if (currentFloor > nextFloor) {
        const reducedUnits = property?.units?.slice(0, nextFloor);
        await Property.updateOne({ _id: req.params.id }, { $set: { units: reducedUnits } });
      }
    }

    res.status(200).json(result);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to Update Property" });
  }
};

const view = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findOne({ _id: id });

  if (!property) {
    return res.status(404).json({ message: "no Data Found." });
  }

  const filteredContacts = await getPropertyContacts(id);
  const phoneCall = await getPropertyPhoneCalls(id);
  const Emails = await getPropertyEmails(id);

  res.status(200).json({ property, filteredContacts, phoneCall, Emails });
};

const deleteData = async (req, res) => {
  try {
    // Soft delete is a single atomic update — no transaction required
    // (transactions also break on standalone MongoDB without a replica set)
    const property = await Property.findOneAndUpdate(
      buildOwnershipFilter(req, req.params.id),
      { $set: { deleted: true, updatedDate: new Date() } },
      { returnDocument: "before" },
    ).lean();

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Clean up files after the update; failures are non-critical
    let cleanupResult;
    try {
      cleanupResult = await cleanupPropertyFiles(property);
    } catch (cleanupError) {
      cleanupResult = { error: "File cleanup failed, will be handled by periodic cleanup" };
    }

    res.status(200).json({
      message: "Property deleted successfully",
      cleanup: cleanupResult,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete property" });
  }
};

const deleteMany = async (req, res) => {
  try {
    const propertyIds = req.body;
    const manyFilter = { _id: { $in: propertyIds } };
    if (req.user?.role !== "superAdmin") {
      manyFilter.createBy = req.user?.userId;
    }

    // Get all properties to clean up associated files (ownership enforced)
    const properties = await Property.find(manyFilter).lean();

    // Soft delete is an atomic updateMany — no transaction required
    const result = await Property.updateMany(manyFilter, {
      $set: { deleted: true, updatedDate: new Date() },
    });

    // Clean up files after the update; failures are non-critical
    const cleanupResults = [];
    for (const property of properties) {
      try {
        const cleanupResult = await cleanupPropertyFiles(property);
        cleanupResults.push({ id: property._id, cleanup: cleanupResult });
      } catch (cleanupError) {
        cleanupResults.push({
          id: property._id,
          cleanup: { error: "File cleanup failed, will be handled by periodic cleanup" },
        });
      }
    }

    res.status(200).json({
      message: "Properties deleted successfully",
      deletedCount: result.modifiedCount,
      cleanup: cleanupResults,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete properties" });
  }
};

const verifyListing = async (req, res) => {
  try {
    const update = {
      verificationUpdatedAt: new Date(),
      verificationUpdatedBy: req.user.userId,
    };

    [
      "verificationStatus",
      "verificationScore",
      "verificationNotes",
      "seoTitle",
      "seoDescription",
      "seoKeywords",
      "publicSlug",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    });

    if (update.publicSlug) {
      update.publicSlug = await resolveUniqueSlug(update.publicSlug, req.params.id);
    }

    if (Array.isArray(req.body.verificationChecklist)) {
      update.verificationChecklist = req.body.verificationChecklist;
    }

    if (Array.isArray(req.body.featuredCollections)) {
      update.featuredCollections = req.body.featuredCollections;
    }

    const result = await Property.updateOne(
      { _id: req.params.id },
      { $set: update },
    );

    res.status(200).json(result);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to verify listing" });
  }
};

module.exports = {
  index,
  add,
  addMany,
  edit,
  view,
  deleteData,
  deleteMany,
  verifyListing,
};
