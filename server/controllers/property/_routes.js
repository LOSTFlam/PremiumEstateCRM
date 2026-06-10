const express = require("express");
const property = require("./property.facade");
const { auth, authorize } = require("../../middlewares/auth");
const { propertyValidation } = require("../../middlewares/validation");

const router = express.Router();

router.get("/public", property.publicIndex);
router.get("/public/slug/:slug", property.publicViewBySlug);
router.get("/public/:id", property.publicView);

router.get("/", auth, property.index);
router.post("/add", auth, propertyValidation.create, property.add);
router.post("/add-units/:id", auth, property.addUnits);
router.put("/edit-unit/:id", auth, property.editUnit);
router.post("/delete-unit-type/:id", auth, property.deleteUnitType);
router.post("/change-unit-status/:id", auth, property.changeUnitStatus);
router.post("/addMany", auth, property.addMany);
router.post(
  "/genrate-offer-letter/:id",
  auth,
  property.offerLetterStorage.fields([
    { name: "salesManagerSign", maxCount: 1 },
    { name: "buyerImage", maxCount: 1 },
  ]),
  property.genrateOfferLetter
);

router.get("/moderation-queue", auth, authorize("superAdmin"), property.moderationQueue);
router.put("/submit/:id", auth, property.submitForReview);
router.put("/withdraw/:id", auth, property.withdrawFromReview);
router.put("/verify/:id", auth, authorize("superAdmin"), property.verifyListing);
router.get("/view/:id", auth, property.view);
router.put("/edit/:id", auth, propertyValidation.update, property.edit);
router.delete("/delete/:id", auth, propertyValidation.delete, property.deleteData);
router.post("/deleteMany", auth, property.deleteMany);
router.post(
  "/update-unit-type/:id/:unitid/:newUnitType",
  auth,
  property.updateUnitTypeId
);
router.post(
  "/add-property-photos/:id",
  auth,
  property.upload.array("property", 10),
  property.propertyPhoto
);
router.post(
  "/add-virtual-tours-or-videos/:id",
  auth,
  property.virtualTours.array("property", 10),
  property.VirtualToursorVideos
);
router.post(
  "/add-floor-plans/:id",
  auth,
  property.FloorPlansStorage.array("property", 10),
  property.FloorPlans
);
router.post(
  "/add-property-documents/:id",
  auth,
  property.PropertyDocumentsStorage.array("property", 10),
  property.PropertyDocuments
);

router.use(
  "/property-documents",
  express.static("uploads/Property/property-documents")
);
router.use("/offer-letter", express.static("uploads/offer-letter"));
router.use("/floor-plans", express.static("uploads/Property/floor-plans"));
router.use(
  "/virtual-tours-or-videos",
  express.static("uploads/Property/virtual-tours-or-videos")
);
router.use(
  "/property-photos",
  express.static("uploads/Property/PropertyPhotos")
);
// router.post('/file', property.upload.array('file', 10), property.file)
// router.post('/file', property.upload.single('file'), property.file)

module.exports = router;
