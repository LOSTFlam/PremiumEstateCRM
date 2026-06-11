const path = require("path");
const { createSecureStorage } = require("../../middlewares/secureUpload");
const { resolveUploadPath } = require("../../utils/uploadPaths");

const avatarUpload = createSecureStorage(resolveUploadPath("avatars"), "images");

module.exports = { avatarUpload };
