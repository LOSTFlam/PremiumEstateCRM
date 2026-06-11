const { Lead } = require("../../model/schema/lead");
const { Property } = require("../../model/schema/property");
const User = require("../../model/schema/user");
const email = require("../../model/schema/email");
const PhoneCall = require("../../model/schema/phoneCall");
const Task = require("../../model/schema/task");
const MeetingHistory = require("../../model/schema/meeting");
const DocumentSchema = require("../../model/schema/document");
const { sendUserConfirmation, sendAdminNotification, sendUserSms } = require("../../services/notificationService");

const { pickAllowedQuery } = require("../../utils/safeQuery");
const { stripDangerousFields } = require("../../utils/stripDangerousFields");

const index = async (req, res) => {
  const query = {
    ...pickAllowedQuery(req.query, ["leadStatus", "leadSource", "createBy", "propertyId"]),
    deleted: false,
  };

  // let result = await Lead.find(query)

  let allData = await Lead.find(query)
    .populate({
      path: "createBy",
      match: { deleted: false }, // Populate only if createBy.deleted is false
    })
    .exec();

  const result = allData.filter((item) => item.createBy !== null);
  res.send(result);
};

const addMany = async (req, res) => {
  try {
    const data = req.body;
    const insertedLead = await Lead.insertMany(data);

    res.status(200).json(insertedLead);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to create Lead" });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { leadStatus } = req.body;
    let result = await Lead.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { leadStatus: leadStatus } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    return res
      .status(200)
      .json({ message: "Status Change Successfully", result });
  } catch (err) {
    // Console statement removed
    return res.status(400).json({ error: "Failed to change status : ", err });
  }
};

const resolveLeadOwner = async (property) => {
  if (property?.createBy) {
    const owner = await User.findOne({ _id: property.createBy, deleted: false }).lean();
    if (owner) return owner;
  }

  return await User.findOne({ deleted: false }).sort({ createdDate: 1 }).lean();
};

const publicInquiry = async (req, res) => {
  try {
    const {
      propertyId,
      fullName,
      name,
      email,
      phoneNumber,
      phone,
      message,
      preferredContact,
      sourcePage,
      collectionSlug,
      propertyName,
      type,
      preferredDate,
      preferredTime,
      source,
    } = req.body;

    const leadName = fullName || name;
    const leadPhone = phoneNumber || phone;

    if (!leadName || !email || !leadPhone) {
      return res.status(400).json({ error: "Missing required lead fields: name, email, phone" });
    }

    const notificationData = {
      userName: leadName,
      userPhone: leadPhone,
      userEmail: email,
      message: message || '',
      propertyName: propertyName || '',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    if (propertyId) {
      const property = await Property.findOne({ _id: propertyId, deleted: false }).lean();
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      const owner = await resolveLeadOwner(property);
      if (!owner) {
        return res.status(400).json({ error: "No available agent found for this listing" });
      }

      const lead = new Lead({
        leadName,
        leadEmail: email,
        leadPhoneNumber: leadPhone,
        leadMobile: leadPhone,
        leadStatus: "pending",
        leadCampaign: "Online",
        leadState: "Open",
        communicationTool: preferredContact === "email" ? "Email" : "WhatsApp",
        listedFor: String(property?.listingStatus || "buy").toLowerCase().includes("rent") ? "Rent" : "Buy",
        associatedListing: property._id,
        assignUser: owner._id,
        leadAssignedAgent: [owner.firstName, owner.lastName].filter(Boolean).join(" ").trim(),
        leadSource: source || "Public Website",
        leadSourceDetails: sourcePage || "Public property page",
        leadSourceChannel: "Website",
        leadSourceMedium: "Organic",
        leadSourceCampaign: collectionSlug || "public-catalog",
        leadMessage: message || "",
        leadNotes: message || "",
        createBy: owner._id,
        createdDate: new Date(),
      });

      await lead.save();
      notificationData.propertyId = property._id.toString();
      notificationData.propertyName = property?.title || property?.name || propertyId;
    } else {
      const lead = new Lead({
        leadName,
        leadEmail: email,
        leadPhoneNumber: leadPhone,
        leadMobile: leadPhone,
        leadStatus: "new",
        leadCampaign: "Online",
        leadState: "Open",
        communicationTool: preferredContact === "email" ? "Email" : "WhatsApp",
        leadSource: source || "Public Website",
        leadSourceDetails: sourcePage || "Website form",
        leadSourceChannel: "Website",
        leadSourceMedium: "Organic",
        leadSourceCampaign: collectionSlug || type || "public-catalog",
        leadMessage: message || "",
        leadNotes: message || "",
        createdDate: new Date(),
      });

      await lead.save();
      notificationData.propertyId = propertyId || '';
      notificationData.propertyName = propertyName || 'General inquiry';
    }

    setImmediate(async () => {
      try {
        await sendUserConfirmation(notificationData);
        await sendUserSms(leadPhone, notificationData);
        await sendAdminNotification(notificationData);
        // Console statement removed
      } catch (notifError) {
        // Console statement removed
      }
    });

    res.status(200).json({ message: "Lead captured successfully" });
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to capture public lead" });
  }
};

const add = async (req, res) => {
  try {
    const payload = stripDangerousFields(req.body);
    payload.createdDate = new Date();
    const user = new Lead(payload);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to create Lead" });
  }
};

const edit = async (req, res) => {
  try {
    let result = await Lead.updateOne(
      { _id: req.params.id },
      { $set: stripDangerousFields(req.body) }
    );
    res.status(200).json(result);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to Update Lead" });
  }
};

const view = async (req, res) => {
  let lead = await Lead.findOne({ _id: req.params.id }).populate(
    "associatedListing"
  );

  if (!lead) return res.status(404).json({ message: "no Data Found." });

  let query = req.query;
  if (query.sender) {
    query.sender = new mongoose.Types.ObjectId(query.sender);
  }
  query.createByLead = req.params.id;

  let Email = await email.aggregate([
    { $match: { createByLead: lead._id } },
    {
      $lookup: {
        from: "Leads", // Assuming this is the collection name for 'leads'
        localField: "createByLead",
        foreignField: "_id",
        as: "createByrefLead",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "sender",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByRef", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByrefLead", preserveNullAndEmptyArrays: true } },
    { $match: { "users.deleted": false } },
    {
      $addFields: {
        senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
        deleted: {
          $cond: [
            { $eq: ["$createByRef.deleted", false] },
            "$createByRef.deleted",
            { $ifNull: ["$createByrefLead.deleted", false] },
          ],
        },
        createByName: {
          $cond: {
            if: "$createByRef",
            then: {
              $concat: [
                "$createByRef.title",
                " ",
                "$createByRef.firstName",
                " ",
                "$createByRef.lastName",
              ],
            },
            else: { $concat: ["$createByrefLead.leadName"] },
          },
        },
      },
    },
    {
      $project: {
        createByRef: 0,
        createByrefLead: 0,
        users: 0,
      },
    },
  ]);

  let phoneCall = await PhoneCall.aggregate([
    { $match: { createByLead: lead._id } },
    {
      $lookup: {
        from: "Leads", // Assuming this is the collection name for 'leads'
        localField: "createByLead",
        foreignField: "_id",
        as: "createByrefLead",
      },
    },

    {
      $lookup: {
        from: "User",
        localField: "sender",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByrefLead", preserveNullAndEmptyArrays: true } },
    { $match: { "users.deleted": false } },
    {
      $addFields: {
        senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
        deleted: "$createByrefLead.deleted",
        createByName: "$createByrefLead.leadName",
      },
    },
    { $project: { createByrefLead: 0, users: 0 } },
  ]);

  let task = await Task.aggregate([
    { $match: { assignToLead: lead._id } },
    {
      $lookup: {
        from: "Leads",
        localField: "assignToLead",
        foreignField: "_id",
        as: "lead",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "createBy",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$lead", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        // assignToName: lead.leadName,
        assignToName: "$lead.leadName",
        createByName: "$users.username",
      },
    },
    { $project: { lead: 0, users: 0 } },
  ]);

  let meeting = await MeetingHistory.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $in: [lead._id, "$attendesLead"] }],
        },
      },
    },
    {
      $lookup: {
        from: "Leads",
        localField: "assignToLead",
        foreignField: "_id",
        as: "lead",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "createBy",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        attendesArray: "$lead.leadEmail",
        createdByName: "$users.username",
      },
    },
    {
      $project: {
        users: 0,
      },
    },
  ]);
  const Document = await DocumentSchema.aggregate([
    { $unwind: "$file" },
    { $match: { "file.deleted": false, "file.linkLead": lead._id } },
    {
      $lookup: {
        from: "User", // Replace 'users' with the actual name of your users collection
        localField: "createBy",
        foreignField: "_id", // Assuming the 'createBy' field in DocumentSchema corresponds to '_id' in the 'users' collection
        as: "creatorInfo",
      },
    },
    { $unwind: { path: "$creatorInfo", preserveNullAndEmptyArrays: true } },
    { $match: { "creatorInfo.deleted": false } },
    {
      $group: {
        _id: "$_id", // Group by the document _id (folder's _id)
        folderName: { $first: "$folderName" }, // Get the folderName (assuming it's the same for all files in the folder)
        createByName: {
          $first: {
            $concat: ["$creatorInfo.firstName", " ", "$creatorInfo.lastName"],
          },
        },
        files: { $push: "$file" }, // Push the matching files back into an array
      },
    },
    { $project: { creatorInfo: 0 } },
  ]);

  res.status(200).json({ lead, Email, phoneCall, task, meeting, Document });
};

const deleteData = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "done", lead });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const lead = await Lead.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", lead });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = {
  index,
  publicInquiry,
  add,
  addMany,
  view,
  edit,
  deleteData,
  deleteMany,
  changeStatus,
};
