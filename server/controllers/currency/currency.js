const { getUsdRubRate } = require("./exchangeRate.service");

const getUsdRub = async (req, res) => {
  try {
    const rateData = await getUsdRubRate({
      forceRefresh: req.query.force === "true",
    });

    res.status(200).json({
      success: true,
      ...rateData,
    });
  } catch (error) {
    console.error("Failed to fetch USD/RUB exchange rate:", error);
    res.status(502).json({
      success: false,
      error: "Failed to fetch USD/RUB exchange rate",
    });
  }
};

module.exports = {
  getUsdRub,
};
