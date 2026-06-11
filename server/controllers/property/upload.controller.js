const { Property } = require("../../model/schema/property");
const { createSecureStorage } = require("../../middlewares/secureUpload");
const { resolveUploadPath } = require("../../utils/uploadPaths");

const createStorage = (uploadDir, fileType) => createSecureStorage(uploadDir, fileType);

const mapUploadedFiles = (req, routePrefix, includeFilename = false) =>
  req?.files.map((file) => ({
    ...(includeFilename ? { filename: file.filename } : {}),
    img: `/api/property/${routePrefix}/${file.filename}`,
    createOn: new Date(),
  }));

const createUploadHandler = ({ field, routePrefix }) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const files = mapUploadedFiles(req, routePrefix, field === "propertyDocuments");

    const filter = { _id: id };
    if (req.user?.role !== "superAdmin") {
      filter.createBy = req.user?.userId;
    }

    const result = await Property.updateOne(filter, {
      $push: { [field]: { $each: files } },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Property not found or access denied" });
    }

    res.send("File uploaded successfully.");
  } catch (err) {
    res.status(400).json({ error: `Failed to upload ${field}` });
  }
};

const upload = createStorage(resolveUploadPath("Property", "PropertyPhotos"), "images");
const virtualTours = createStorage(resolveUploadPath("Property", "virtual-tours-or-videos"), "videos");
const FloorPlansStorage = createStorage(resolveUploadPath("Property", "floor-plans"), "floorPlans");
const PropertyDocumentsStorage = createStorage(
  resolveUploadPath("Property", "property-documents"),
  "documents"
);

const propertyPhoto = createUploadHandler({
  field: "propertyPhotos",
  routePrefix: "property-photos",
});

const VirtualToursorVideos = createUploadHandler({
  field: "virtualToursOrVideos",
  routePrefix: "virtual-tours-or-videos",
});

const FloorPlans = createUploadHandler({
  field: "floorPlans",
  routePrefix: "floor-plans",
});

const PropertyDocuments = createUploadHandler({
  field: "propertyDocuments",
  routePrefix: "property-documents",
});

module.exports = {
  upload,
  virtualTours,
  FloorPlansStorage,
  PropertyDocumentsStorage,
  propertyPhoto,
  VirtualToursorVideos,
  FloorPlans,
  PropertyDocuments,
};
