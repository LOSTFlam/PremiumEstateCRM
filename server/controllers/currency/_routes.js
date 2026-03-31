const express = require("express");
const currency = require("./currency");

const router = express.Router();

router.get("/usd-rub", currency.getUsdRub);

module.exports = router;
