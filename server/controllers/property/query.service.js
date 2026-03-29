const { Contact } = require("../../model/schema/contact");
const PhoneCall = require("../../model/schema/phoneCall");
const Email = require("../../model/schema/email");
const { default: mongoose } = require("mongoose");

const getPropertyContacts = async (propertyId) => {
  const contacts = await Contact.find({ deleted: false });
  return contacts?.filter((contact) => contact.interestProperty?.includes(propertyId));
};

const getPropertyPhoneCalls = async (propertyId) =>
  PhoneCall.aggregate([
    {
      $match: {
        property: { $in: [new mongoose.Types.ObjectId(propertyId)] },
      },
    },
    {
      $lookup: {
        from: "Contacts",
        localField: "createByContact",
        foreignField: "_id",
        as: "contact",
      },
    },
    {
      $lookup: {
        from: "Leads",
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
    {
      $lookup: {
        from: "User",
        localField: "salesAgent",
        foreignField: "_id",
        as: "salesAgent",
      },
    },
    {
      $lookup: {
        from: "Properties",
        localField: "property",
        foreignField: "_id",
        as: "properties",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByrefLead", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$salesAgent", preserveNullAndEmptyArrays: true } },
    { $match: { "users.deleted": false } },
    {
      $addFields: {
        senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
        deleted: {
          $cond: [
            { $eq: ["$contact.deleted", false] },
            "$contact.deleted",
            { $ifNull: ["$createByrefLead.deleted", false] },
          ],
        },
        createByName: {
          $cond: {
            if: "$contact",
            then: {
              $concat: [
                "$contact.title",
                " ",
                "$contact.firstName",
                " ",
                "$contact.lastName",
              ],
            },
            else: { $concat: ["$createByrefLead.leadName"] },
          },
        },
        salesAgentName: {
          $cond: {
            if: { $ne: ["$salesAgent", null] },
            then: { $concat: ["$salesAgent.firstName", " ", "$salesAgent.lastName"] },
            else: "",
          },
        },
      },
    },
    { $project: { contact: 0, createByrefLead: 0, users: 0, salesAgent: 0 } },
  ]);

const getPropertyEmails = async (propertyId) =>
  Email.aggregate([
    {
      $match: {
        property: { $in: [new mongoose.Types.ObjectId(propertyId)] },
      },
    },
    {
      $lookup: {
        from: "Leads",
        localField: "createByLead",
        foreignField: "_id",
        as: "createByrefLead",
      },
    },
    {
      $lookup: {
        from: "Contacts",
        localField: "createByContact",
        foreignField: "_id",
        as: "createByRef",
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
    { $project: { createByRef: 0, createByrefLead: 0, users: 0 } },
  ]);

module.exports = {
  getPropertyContacts,
  getPropertyPhoneCalls,
  getPropertyEmails,
};
