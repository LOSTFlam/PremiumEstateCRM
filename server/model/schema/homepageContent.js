const mongoose = require("mongoose");

const homepageContentSchema = new mongoose.Schema({
  singletonKey: {
    type: String,
    default: "default",
    unique: true,
  },
  visibility: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  locales: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
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
  "HomepageContent",
  homepageContentSchema,
  "HomepageContent",
);
