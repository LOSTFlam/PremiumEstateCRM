const fs = require("fs");
const path = require("path");

const getUploadRoot = () => {
  const configured = process.env.UPLOAD_PATH || "uploads";
  return path.isAbsolute(configured)
    ? configured
    : path.join(process.cwd(), configured);
};

const resolveUploadPath = (...segments) => path.join(getUploadRoot(), ...segments);

const ensureUploadRoot = () => {
  const root = getUploadRoot();
  fs.mkdirSync(root, { recursive: true });
  [
    "Property/PropertyPhotos",
    "Property/virtual-tours-or-videos",
    "Property/floor-plans",
    "Property/property-documents",
    "images",
    "avatars",
    "document",
    "offer-letter",
  ].forEach((segment) => {
    fs.mkdirSync(resolveUploadPath(...segment.split("/")), { recursive: true });
  });
  return root;
};

module.exports = {
  getUploadRoot,
  resolveUploadPath,
  ensureUploadRoot,
};
