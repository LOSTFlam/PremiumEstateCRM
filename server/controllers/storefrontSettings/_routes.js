const express = require("express");
const storefrontSettings = require("./storefrontSettings");
const { auth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/public", storefrontSettings.publicIndex);
router.get("/", auth, storefrontSettings.index);
router.put("/edit", auth, storefrontSettings.edit);

module.exports = router;
