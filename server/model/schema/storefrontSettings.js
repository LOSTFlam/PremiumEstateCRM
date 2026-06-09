const mongoose = require("mongoose");

const presetSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "all",
    },
    status: {
      type: String,
      default: "all",
    },
    minPrice: {
      type: String,
      default: "",
    },
    maxPrice: {
      type: String,
      default: "",
    },
    bedrooms: {
      type: String,
      default: "all",
    },
    bathrooms: {
      type: String,
      default: "all",
    },
    onlyWithPhotos: {
      type: Boolean,
      default: false,
    },
    onlyRich: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      default: "all",
    },
    featuredCollection: {
      type: String,
      default: "",
    },
    sortBy: {
      type: String,
      default: "latest",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const storefrontSettingsSchema = new mongoose.Schema({
  singletonKey: {
    type: String,
    default: "default",
    unique: true,
  },
  presets: {
    type: [presetSchema],
    default: [],
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports = mongoose.model(
  "StorefrontSettings",
  storefrontSettingsSchema,
  "StorefrontSettings",
);
