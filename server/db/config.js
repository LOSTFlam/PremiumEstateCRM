const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/schema/user");
const { initializeLeadSchema } = require("../model/schema/lead");
const { initializeContactSchema } = require("../model/schema/contact");
const { initializePropertySchema } = require("../model/schema/property");
const { createNewModule } = require("../controllers/customField/customField");
const customField = require("../model/schema/customField");
const { contactFields } = require("./contactFields");
const { leadFields } = require("./leadFields");
const { propertiesFields } = require("./propertiesFields");
const seedPipelineStages = require("../scripts/seedPipelineStages");

const NOOP_RESPONSE = Object.freeze({
  status: () => ({
    json: () => undefined,
  }),
  json: () => undefined,
});

const DEFAULT_MODULES = [
  { moduleName: "Leads", fields: leadFields },
  { moduleName: "Contacts", fields: contactFields },
  { moduleName: "Properties", fields: propertiesFields },
];

const createDynamicSchemas = async (customFields) => {
  for (const moduleDefinition of customFields) {
    const { moduleName, fields } = moduleDefinition;

    if (mongoose.models[moduleName]) {
      continue;
    }

    const schemaDefinition = {};

    for (const field of fields) {
      schemaDefinition[field.name] = field.ref
        ? { type: field.backendType, ref: field.ref }
        : { type: field.backendType };
    }

    mongoose.model(moduleName, new mongoose.Schema(schemaDefinition), moduleName);
  }
};

const initializeSchemas = async () => {
  await initializeLeadSchema();
  await initializeContactSchema();
  await initializePropertySchema();

  const customFields = await customField.find({ deleted: false });
  await createDynamicSchemas(customFields);
};

const ensureDefaultModules = async () => {
  for (const moduleDefinition of DEFAULT_MODULES) {
    await createNewModule(
      {
        body: {
          ...moduleDefinition,
          headings: [],
          isDefault: true,
        },
      },
      NOOP_RESPONSE
    );
  }
};

const ensureAdminUser = async () => {
  const existingAdmin = await User.findOne({ role: "superAdmin" });

  if (!existingAdmin) {
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId("64d33173fd7ff3fa0924a109"),
      username: process.env.ADMIN_EMAIL || "admin@gmail.com",
      password: hashedPassword,
      firstName: process.env.ADMIN_FIRST_NAME || "Premium",
      lastName: process.env.ADMIN_LAST_NAME || "Estate",
      phoneNumber: process.env.ADMIN_PHONE || "7874263694",
      role: "superAdmin",
    });

    await user.save();
    return;
  }

  if (existingAdmin.deleted) {
    await User.findByIdAndUpdate(existingAdmin._id, { deleted: false });
  }
};

const connectDB = async (databaseUrl, databaseName) => {
  mongoose.set("strictQuery", false);

  await mongoose.connect(databaseUrl, { dbName: databaseName });
  await initializeSchemas();
  await ensureDefaultModules();
  await initializeSchemas();
  await ensureAdminUser();
  await seedPipelineStages();

  return mongoose.connection;
};

module.exports = connectDB;
