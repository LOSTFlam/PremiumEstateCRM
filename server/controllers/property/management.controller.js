const { Property } = require("../../model/schema/property");
const { slugify } = require("./utils");
const {
  getPropertyContacts,
  getPropertyPhoneCalls,
  getPropertyEmails,
} = require("./query.service");

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

const index = async (req, res) => {
  const query = req.query;
  query.deleted = false;

  const allData = await Property.find(query)
    .populate({
      path: "createBy",
      match: { deleted: false },
    })
    .exec();

  const result = allData.filter((item) => item.createBy !== null);
  res.send(result);
};

const add = async (req, res) => {
  try {
    req.body.createdDate = new Date();

    const slugSource = req.body.publicSlug || req.body.name || req.body.propertyAddress || "property";
    req.body.publicSlug = await resolveUniqueSlug(slugSource);

    const property = new Property(req.body);
    await property.save();
    res.status(200).json(property);
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const addMany = async (req, res) => {
  try {
    const insertedProperty = await Property.insertMany(req.body);
    res.status(200).json(insertedProperty);
  } catch (err) {
    console.error("Failed to create Property :", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const edit = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();

    if (!property) {
      return res.status(404).json({ message: "no Data Found." });
    }

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
      { _id: req.params.id },
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
    console.error("Failed to Update Property:", err);
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
    const property = await Property.findByIdAndUpdate(req.params.id, {
      deleted: true,
    });
    res.status(200).json({ message: "done", property });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const property = await Property.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } },
    );
    res.status(200).json({ message: "done", property });
  } catch (err) {
    res.status(404).json({ message: "error", err });
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
    console.error("Failed to verify listing:", err);
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
