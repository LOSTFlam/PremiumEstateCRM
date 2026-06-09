const mongoose = require("mongoose");

const createIndexes = async () => {
  try {
    // Console statement removed

    const Property = mongoose.model("Property");
    const Lead = mongoose.model("Lead");
    const Contact = mongoose.model("Contact");
    const Task = mongoose.model("Task");
    const Meeting = mongoose.model("Meeting");
    const Email = mongoose.model("Email");
    const Invoice = mongoose.model("Invoice");
    const Quotes = mongoose.model("Quotes");
    const Opportunity = mongoose.model("Opportunity");

    await Property.collection.createIndex({ status: 1, deleted: 1 });
    await Property.collection.createIndex({ category: 1, status: 1 });
    await Property.collection.createIndex({ price: 1 });
    await Property.collection.createIndex({ "address.city": 1, "address.country": 1 });
    await Property.collection.createIndex({ createdAt: -1 });
    await Property.collection.createIndex({ agent: 1 });
    await Property.collection.createIndex({ title: "text", description: "text" });
    // Console statement removed

    await Lead.collection.createIndex({ status: 1, deleted: 1 });
    await Lead.collection.createIndex({ assignedTo: 1 });
    await Lead.collection.createIndex({ priority: 1, status: 1 });
    await Lead.collection.createIndex({ email: 1 });
    await Lead.collection.createIndex({ createdAt: -1 });
    await Lead.collection.createIndex({ firstName: "text", lastName: "text", email: "text" });
    // Console statement removed

    await Contact.collection.createIndex({ type: 1, deleted: 1 });
    await Contact.collection.createIndex({ email: 1 });
    await Contact.collection.createIndex({ firstName: "text", lastName: "text", email: "text" });
    // Console statement removed

    await Task.collection.createIndex({ status: 1, assignedTo: 1 });
    await Task.collection.createIndex({ dueDate: 1 });
    await Task.collection.createIndex({ priority: 1 });
    // Console statement removed

    await Meeting.collection.createIndex({ status: 1, assignedTo: 1 });
    await Meeting.collection.createIndex({ startTime: 1 });
    // Console statement removed

    await Email.collection.createIndex({ leadId: 1 });
    await Email.collection.createIndex({ contactId: 1 });
    await Email.collection.createIndex({ sentDate: -1 });
    // Console statement removed

    await Invoice.collection.createIndex({ status: 1 });
    await Invoice.collection.createIndex({ leadId: 1 });
    await Invoice.collection.createIndex({ dueDate: 1 });
    // Console statement removed

    await Quotes.collection.createIndex({ status: 1 });
    await Quotes.collection.createIndex({ leadId: 1 });
    // Console statement removed

    await Opportunity.collection.createIndex({ status: 1, assignedTo: 1 });
    await Opportunity.collection.createIndex({ stage: 1 });
    await Opportunity.collection.createIndex({ expectedCloseDate: 1 });
    // Console statement removed

    // Console statement removed
  } catch (error) {
    // Console statement removed
  }
};

if (require.main === module) {
  require("dotenv").config();
  const db = require("../db/config");
  const DATABASE_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
  const DATABASE = process.env.DB || "PremiumEstateDB";

  db(DATABASE_URL, DATABASE);

  mongoose.connection.on("connected", async () => {
    // Console statement removed
    await createIndexes();
    process.exit(0);
  });

  mongoose.connection.on("error", (err) => {
    // Console statement removed
    process.exit(1);
  });
}

module.exports = { createIndexes };
