const multer = require("multer");
const { Property } = require("../../model/schema/property");
const { ensureUploadDir, buildUniqueFilename } = require("./utils");

const createStorage = (uploadDir) =>
  multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        ensureUploadDir(uploadDir);
        cb(null, uploadDir);
      },
      filename(req, file, cb) {
        cb(null, buildUniqueFilename(uploadDir, file.originalname));
      },
    }),
  });

const mapUploadedFiles = (req, routePrefix, includeFilename = false) =>
  // Store relative URLs so images keep working regardless of the host
  // the site is served from (domain, IP, localhost, proxy, etc.)
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
    // Enforce ownership for non-super admins
    if (req.user?.role !== "superAdmin") {
      filter.createBy = req.user?.userId;
    }

    const result = await Property.updateOne(
      filter,
      { $push: { [field]: { $each: files } } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Property not found or access denied" });
    }

    res.send("File uploaded successfully.");
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: `Failed to upload ${field}` });
  }
};

const upload = createStorage("uploads/Property/PropertyPhotos");
const virtualTours = createStorage("uploads/Property/virtual-tours-or-videos");
const FloorPlansStorage = createStorage("uploads/Property/floor-plans");
const PropertyDocumentsStorage = createStorage("uploads/Property/property-documents");

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
