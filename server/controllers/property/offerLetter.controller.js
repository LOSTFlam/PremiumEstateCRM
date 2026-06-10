const path = require("path");
const multer = require("multer");
const ejs = require("ejs");
let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  puppeteer = null;
}
const moment = require("moment");
const { default: mongoose } = require("mongoose");
const { Lead } = require("../../model/schema/lead");
const { Contact } = require("../../model/schema/contact");
const { Property } = require("../../model/schema/property");
const quotes = require("../../model/schema/quotes");
const { ensureUploadDir, buildUniqueFilename, getOrdinalSuffix } = require("./utils");
const { findPropertyAndFloor } = require("./units.service");
const { resolveUploadPath } = require("../../utils/uploadPaths");

const getOfferLetterDir = () => resolveUploadPath("offer-letter");

const offerLetterStorage = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const uploadDir = getOfferLetterDir();
      ensureUploadDir(uploadDir);
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      const uploadDir = getOfferLetterDir();
      cb(null, buildUniqueFilename(uploadDir, file.originalname));
    },
  }),
});

const genrateOfferLetter = async (req, res) => {
  try {
    if (!puppeteer) {
      return res?.status(503)?.json({ error: "PDF generation is not available on this server (puppeteer not installed)" });
    }
    const { id } = req?.params;
    const unit = JSON.parse(req?.body?.unit);
    unit.status = "Booked";
    const floor = JSON.parse(req?.body?.floor);
    const url = req.protocol + "://" + req.get("host");

    const buyerImageUrl = `${url}/api/property/offer-letter/${req?.files?.buyerImage?.[0]?.filename}`;
    const salesManagerSignUrl = `${url}/api/property/offer-letter/${req?.files?.salesManagerSign?.[0]?.filename}`;
    const property = await Property.findById(id).lean();

    let purchaser = "";
    if (req?.body?.lead) {
      const lead = await Lead.findOne({ _id: new mongoose.Types.ObjectId(req?.body?.lead) }).lean();
      purchaser = lead?.leadName;
    }

    if (req?.body?.contact) {
      const contact = await Contact.findOne({ _id: new mongoose.Types.ObjectId(req?.body?.contact) }).lean();
      purchaser = contact?.fullName;
    }

    const unitType = property?.unitType?.find(
      (item) => item?._id?.toString() === unit?.unitType?.toString(),
    );

    const description = `SALE OF ${property?.name} ${unitType?.name} APARTMENT NUMBER ${unit?.flateName} ON ${floor?.floorNumber}${getOrdinalSuffix(floor?.floorNumber)} FLOOR IN ${property?.location} APARTMENT ON L.R. NO. ${property?.lrNo || "-"}. `;
    const templatePath = path.join(__dirname, "templates", "offerLetter.ejs");

    const footerTemplate = `
        <hr style="border: 1px solid #000; margin: 0;">
      <div style="font-size: 15px; text-align: center; width: 100%; margin-top: 5px;">
        <div style="border-top: 2px solid #000; margin-bottom: 5px; padding-top: 5px;">
          <span style="font-weight: bold;">ZUQRUF DEVELOPERS</span>
        </div>
        <span style="font-size: 12px;">Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`;

    const htmlContnet = await ejs.renderFile(templatePath, {
      ...req?.body,
      property,
      installments: JSON.parse(req?.body?.installments),
      description,
      unitPrice: unitType?.price,
      buyerImageUrl,
      salesManagerSignUrl,
      footerContain: "",
      purchaser,
      currentDate: moment().format("DD/MM/yyyy"),
    });

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContnet, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      footerTemplate,
    });

    const { selectedFloor, flatIndex, error } = await findPropertyAndFloor(id, floor, unit);
    if (error) return res?.status(404)?.json({ error });

    selectedFloor.flats[flatIndex] = unit;

    await Property.updateOne(
      { _id: id, "units._id": floor?._id },
      { $set: { "units.$.flats": selectedFloor?.flats } },
    );

    if (req.body.lead) {
      const lead = await Lead.findOne({ _id: new mongoose.Types.ObjectId(req?.body?.lead) }).lean();

      const contactFeild = new Contact({
        fullName: lead?.leadName,
        email: lead?.leadEmail,
        phoneNumber: lead?.leadPhoneNumber,
        campaign: lead?.leadCampaign,
        state: lead?.leadState,
        communicationTool: lead?.communicationTool,
        listedFor: lead?.listedFor,
        interestProperty: [lead?.associatedListing],
        deleted: false,
        createBy: req?.user?.userId,
        createdDate: new Date(),
      });

      await contactFeild.save();
    }

    await browser.close();

    const offerLatterFeiledPayload = {
      category: req.body.category,
      accountName: req?.body?.accountName,
      bank: req?.body?.bank,
      branch: req?.body?.branch,
      accountNumber: req?.body?.accountNumber,
      swiftCode: req?.body?.swiftCode,
      salesManagerSign: req?.body?.salesManagerSign,
      buyerImage: req?.body?.buyerImage,
      description: req?.body?.description,
      unitPrice: req?.body?.unitPrice,
      amount: req?.body?.amount,
      property: id,
      installments: JSON.parse(req?.body?.installments),
      createBy: req?.user?.userId,
    };

    if (offerLatterFeiledPayload?.category === "lead") {
      offerLatterFeiledPayload.lead = req?.body?.lead;
    } else if (offerLatterFeiledPayload?.category === "contact") {
      offerLatterFeiledPayload.contact = req?.body?.contact;
    }

    const offerLatterFeild = new quotes(offerLatterFeiledPayload);
    await offerLatterFeild.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=offer-letter.pdf");
    res.end(pdfBuffer);
  } catch (err) {
    console?.error("Failed to generate offer letter:", err);
    res?.status(400)?.json({ error: "Failed to generate offer letter" });
  }
};

module.exports = {
  offerLetterStorage,
  genrateOfferLetter,
};
