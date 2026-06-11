const express = require("express");
const homepageContent = require("./homepageContent");
const { auth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/public", homepageContent.publicIndex);
router.get("/", auth, homepageContent.index);
router.put("/edit", auth, homepageContent.edit);

module.exports = router;
