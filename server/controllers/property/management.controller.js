const { Property } = require("../../model/schema/property");
const User = require("../../model/schema/user");
const {
  MODERATION_STATUS,
  normalizeModerationStatus,
  stripModerationFields,
} = require("../../constants/moderation");
const { invalidateUserCache } = require("../../middlewares/auth");
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
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const now = new Date();
    req.body.createdDate = req.body.createdDate || now;
    req.body.updatedDate = req.body.updatedDate || now;
    req.body.deleted = false;
    req.body.createBy = req.user.userId;

    if (req.body.listingPrice !== undefined && req.body.listingPrice !== null) {
      req.body.listingPrice = String(req.body.listingPrice);
    }
    if (req.body.squareFootage !== undefined && req.body.squareFootage !== null) {
      req.body.squareFootage = String(req.body.squareFootage);
    }

    const slugSource = req.body.publicSlug || req.body.name || req.body.propertyAddress || "property";
    req.body.publicSlug = await resolveUniqueSlug(slugSource);

    if (!Array.isArray(req.body.propertyPhotos) || !req.body.propertyPhotos.length) {
      const { buildPhotoSet } = require("../../utils/propertyStockImages");
      req.body.propertyPhotos = buildPhotoSet(
        req.body.propertyType,
        req.body.publicSlug || req.body.name,
        3
      );
    }

    req.body = stripModerationFields(req.body);
    if (req.user.role === "superAdmin") {
      req.body.verificationStatus =
        normalizeModerationStatus(req.body.verificationStatus) || MODERATION_STATUS.APPROVED;
    } else {
      req.body.verificationStatus = MODERATION_STATUS.DRAFT;
      req.body.rejectionReason = "";
    }
    if (req.user.role !== "superAdmin" && req.body.listingStatus === "Blocked") {
      req.body.listingStatus = "Available";
    }

    const property = new Property(req.body);
    await property.save();
    res.status(201).json(normalizePropertyMedia(property.toObject()));
  } catch (err) {
    const details = err?.errors
      ? Object.values(err.errors).map((item) => item?.message).filter(Boolean)
      : undefined;
    res.status(400).json({
      error: "Failed to create Property",
      message: err?.message || "Failed to create Property",
      details,
    });
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
    req.body = stripModerationFields(req.body);

    if (req.user?.role !== "superAdmin") {
      const currentStatus = normalizeModerationStatus(property.verificationStatus);
      if (currentStatus === MODERATION_STATUS.PENDING) {
        return res.status(403).json({
          message: "Listing is under moderation and cannot be edited",
        });
      }
      if (req.body.listingStatus === "Blocked") {
        delete req.body.listingStatus;
      }
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

const submitForReview = async (req, res) => {
  try {
    const ownershipFilter = buildOwnershipFilter(req, req.params.id);
    const property = await Property.findOne(ownershipFilter).lean();

    if (!property) {
      return res.status(404).json({ message: "no Data Found." });
    }

    const currentStatus = normalizeModerationStatus(property.verificationStatus);
    if (![MODERATION_STATUS.DRAFT, MODERATION_STATUS.REJECTED].includes(currentStatus)) {
      return res.status(400).json({
        message: "Only draft or rejected listings can be submitted for review",
      });
    }

    const now = new Date();
    await Property.updateOne(ownershipFilter, {
      $set: {
        verificationStatus: MODERATION_STATUS.PENDING,
        moderationSubmittedAt: now,
        rejectionReason: "",
        updatedDate: now,
      },
    });

    res.status(200).json({ message: "Listing submitted for moderation" });
  } catch (err) {
    res.status(400).json({ error: "Failed to submit listing for review" });
  }
};

const withdrawFromReview = async (req, res) => {
  try {
    const ownershipFilter = buildOwnershipFilter(req, req.params.id);
    const property = await Property.findOne(ownershipFilter).lean();

    if (!property) {
      return res.status(404).json({ message: "no Data Found." });
    }

    if (normalizeModerationStatus(property.verificationStatus) !== MODERATION_STATUS.PENDING) {
      return res.status(400).json({ message: "Only pending listings can be withdrawn" });
    }

    const now = new Date();
    await Property.updateOne(ownershipFilter, {
      $set: {
        verificationStatus: MODERATION_STATUS.DRAFT,
        updatedDate: now,
      },
    });

    res.status(200).json({ message: "Listing withdrawn from moderation" });
  } catch (err) {
    res.status(400).json({ error: "Failed to withdraw listing" });
  }
};

const moderationQueue = async (req, res) => {
  try {
    const status = req.query.status || MODERATION_STATUS.PENDING;
    const query = {
      deleted: { $ne: true },
      verificationStatus: { $in: [status, "review"] },
    };

    const listings = await Property.find(query)
      .populate({
        path: "createBy",
        match: { deleted: false },
        select: "firstName lastName username email phoneNumber role isBlocked",
      })
      .sort({ moderationSubmittedAt: -1, updatedDate: -1 })
      .lean();

    res.status(200).json(listings.map(normalizePropertyMedia));
  } catch (err) {
    res.status(500).json({ error: "Failed to load moderation queue" });
  }
};

const blockListingOwner = async (userId, reason, blockedBy) => {
  if (!userId) return;
  const now = new Date();
  await User.updateOne(
    { _id: userId, role: { $ne: "superAdmin" } },
    {
      $set: {
        isBlocked: true,
        blockReason: String(reason || "").trim(),
        blockedAt: now,
        blockedBy,
      },
    }
  );
  invalidateUserCache(String(userId));
};

const verifyListing = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      deleted: { $ne: true },
    })
      .populate({
        path: "createBy",
        select: "firstName lastName username email role isBlocked",
      })
      .lean();

    if (!property) {
      return res.status(404).json({ message: "no Data Found." });
    }

    const now = new Date();
    const decision = String(req.body.decision || "").trim().toLowerCase();
    const rejectionReason = String(req.body.rejectionReason || "").trim();
    const blockUser = Boolean(req.body.blockUser);
    const blockListing = req.body.blockListing !== false;
    const userBlockReason = String(req.body.userBlockReason || rejectionReason || "").trim();

    const update = {
      verificationUpdatedAt: now,
      verificationUpdatedBy: req.user.userId,
      moderationReviewedAt: now,
      moderationReviewedBy: req.user.userId,
      updatedDate: now,
    };

    if (decision === "approve") {
      update.verificationStatus = MODERATION_STATUS.APPROVED;
      update.rejectionReason = "";
      if (property.listingStatus === "Blocked") {
        update.listingStatus = "Available";
      }
    } else if (decision === "reject") {
      if (!rejectionReason) {
        return res.status(400).json({
          message: "Rejection reason is required",
        });
      }
      update.verificationStatus = MODERATION_STATUS.REJECTED;
      update.rejectionReason = rejectionReason;
      if (blockListing) {
        update.listingStatus = "Blocked";
      }
    } else if (req.body.verificationStatus) {
      update.verificationStatus = normalizeModerationStatus(req.body.verificationStatus);
      if (update.verificationStatus === MODERATION_STATUS.REJECTED && rejectionReason) {
        update.rejectionReason = rejectionReason;
      }
      if (update.verificationStatus === MODERATION_STATUS.APPROVED) {
        update.rejectionReason = "";
      }
    }

    [
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

    await Property.updateOne({ _id: req.params.id }, { $set: update });

    if ((decision === "reject" && blockUser) || req.body.blockUserOnly) {
      const ownerId = property.createBy?._id || property.createBy;
      await blockListingOwner(ownerId, userBlockReason, req.user.userId);
    }

    const refreshed = await Property.findById(req.params.id).lean();
    res.status(200).json(normalizePropertyMedia(refreshed));
  } catch (err) {
    res.status(400).json({ error: "Failed to verify listing", message: err?.message });
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
  submitForReview,
  withdrawFromReview,
  moderationQueue,
  verifyListing,
};
