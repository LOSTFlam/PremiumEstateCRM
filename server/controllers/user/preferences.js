const User = require("../../model/schema/user");
const Lead = require("../../model/schema/lead");
const { sanitizeUser } = require("./auth.service");
const { invalidateUserCache } = require("../../middlewares/auth");

const MAX_FAVORITES = 24;
const MAX_COMPARE = 3;
const MAX_RECENT = 12;
const MAX_SEARCHES = 12;
const MAX_PROPERTY_NOTES = 24;
const MAX_NOTE_LENGTH = 500;

const normalizeIdList = (ids, max) => {
  if (!Array.isArray(ids)) return [];
  return Array.from(new Set(ids.map(String).filter(Boolean))).slice(0, max);
};

const normalizeRecent = (items) => {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  const next = [];

  for (const item of items) {
    const propertyId = String(item?.propertyId || item || "").trim();
    if (!propertyId || seen.has(propertyId)) continue;
    seen.add(propertyId);
    next.push({
      propertyId,
      viewedAt: item?.viewedAt ? new Date(item.viewedAt) : new Date(),
    });
    if (next.length >= MAX_RECENT) break;
  }

  return next;
};

const normalizeSearches = (searches) => {
  if (!Array.isArray(searches)) return [];
  return searches.filter(Boolean).slice(0, MAX_SEARCHES);
};

const normalizePropertyNotes = (notes) => {
  if (!notes || typeof notes !== "object") return {};
  const next = {};

  Object.entries(notes).forEach(([propertyId, note]) => {
    const id = String(propertyId || "").trim();
    const text = String(note || "").trim().slice(0, MAX_NOTE_LENGTH);
    if (!id || !text) return;
    next[id] = text;
  });

  return Object.fromEntries(Object.entries(next).slice(0, MAX_PROPERTY_NOTES));
};

const normalizeBuyerProfile = (profile = {}) => ({
  budgetMin: profile.budgetMin != null && profile.budgetMin !== ""
    ? Number(profile.budgetMin)
    : null,
  budgetMax: profile.budgetMax != null && profile.budgetMax !== ""
    ? Number(profile.budgetMax)
    : null,
  preferredCity: String(profile.preferredCity || "").trim().slice(0, 120),
  propertyTypes: Array.isArray(profile.propertyTypes)
    ? profile.propertyTypes.map(String).filter(Boolean).slice(0, 6)
    : [],
  bedroomsMin: profile.bedroomsMin != null && profile.bedroomsMin !== ""
    ? Number(profile.bedroomsMin)
    : null,
  contactMethod: ["phone", "email", "whatsapp"].includes(profile.contactMethod)
    ? profile.contactMethod
    : "phone",
  about: String(profile.about || "").trim().slice(0, 1000),
});

const normalizeNotifications = (notifications = {}) => ({
  emailUpdates: notifications.emailUpdates !== false,
  newListings: notifications.newListings !== false,
  priceChanges: Boolean(notifications.priceChanges),
});

const buildPreferences = (existing = {}, body = {}) => ({
  favoritePropertyIds: body.favoritePropertyIds !== undefined
    ? normalizeIdList(body.favoritePropertyIds, MAX_FAVORITES)
    : normalizeIdList(existing.favoritePropertyIds, MAX_FAVORITES),
  comparePropertyIds: body.comparePropertyIds !== undefined
    ? normalizeIdList(body.comparePropertyIds, MAX_COMPARE)
    : normalizeIdList(existing.comparePropertyIds, MAX_COMPARE),
  recentlyViewed: body.recentlyViewed !== undefined
    ? normalizeRecent(body.recentlyViewed)
    : normalizeRecent(existing.recentlyViewed),
  savedSearches: body.savedSearches !== undefined
    ? normalizeSearches(body.savedSearches)
    : normalizeSearches(existing.savedSearches),
  propertyNotes: body.propertyNotes !== undefined
    ? normalizePropertyNotes(body.propertyNotes)
    : normalizePropertyNotes(existing.propertyNotes),
  buyerProfile: body.buyerProfile !== undefined
    ? normalizeBuyerProfile(body.buyerProfile)
    : normalizeBuyerProfile(existing.buyerProfile),
  notifications: body.notifications !== undefined
    ? normalizeNotifications(body.notifications)
    : normalizeNotifications(existing.notifications),
});

const getPreferences = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId, deleted: false }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const preferences = buildPreferences(user.preferences || {});

    res.status(200).json({
      preferences,
      avatarUrl: user.avatarUrl || "",
    });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId, deleted: false }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const preferences = buildPreferences(user.preferences || {}, req.body || {});

    await User.updateOne(
      { _id: req.user.userId, deleted: false },
      { $set: { preferences } }
    );

    res.status(200).json({ preferences });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId, deleted: false }).populate({
      path: "roles",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email } = req.body || {};
    const update = {};

    if (firstName !== undefined) update.firstName = String(firstName).trim();
    if (lastName !== undefined) update.lastName = String(lastName).trim();
    if (phoneNumber !== undefined) update.phoneNumber = String(phoneNumber).trim();
    if (email !== undefined) update.email = String(email).trim().toLowerCase();

    const user = await User.findOneAndUpdate(
      { _id: req.user.userId, deleted: false },
      { $set: update },
      { new: true }
    ).populate({ path: "roles" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    invalidateUserCache(String(req.user.userId));
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file?.filename) {
      return res.status(400).json({ message: "No avatar file uploaded" });
    }

    const avatarUrl = `/api/user/avatar/${req.file.filename}`;

    const user = await User.findOneAndUpdate(
      { _id: req.user.userId, deleted: false },
      { $set: { avatarUrl } },
      { new: true }
    ).populate({ path: "roles" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    invalidateUserCache(String(req.user.userId));
    res.status(200).json({ avatarUrl, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId, deleted: false },
      { $set: { avatarUrl: "" } },
      { new: true }
    ).populate({ path: "roles" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    invalidateUserCache(String(req.user.userId));
    res.status(200).json({ avatarUrl: "", user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const getInquiries = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId, deleted: false }).lean();
    if (!user?.email) {
      return res.status(200).json({ inquiries: [] });
    }

    const email = String(user.email).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const inquiries = await Lead.find({
      leadEmail: { $regex: new RegExp(`^${email}$`, "i") },
      deleted: false,
    })
      .sort({ createdDate: -1 })
      .limit(30)
      .lean();

    res.status(200).json({ inquiries });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreferences,
  updatePreferences,
  getMe,
  updateMe,
  updateAvatar,
  deleteAvatar,
  getInquiries,
  MAX_FAVORITES,
  MAX_COMPARE,
  MAX_RECENT,
  MAX_SEARCHES,
};
