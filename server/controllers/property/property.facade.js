const publicController = require("./public.controller");
const managementController = require("./management.controller");
const unitsController = require("./units.controller");
const uploadController = require("./upload.controller");
const offerLetterController = require("./offerLetter.controller");

module.exports = {
  ...publicController,
  ...managementController,
  ...unitsController,
  ...uploadController,
  ...offerLetterController,
};
