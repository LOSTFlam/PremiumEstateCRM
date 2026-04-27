const mongoose = require('mongoose');
const User = require('../model/schema/user');
const bcrypt = require('bcrypt');
const { initializeLeadSchema } = require("../model/schema/lead");
const { initializeContactSchema } = require("../model/schema/contact");
const { initializePropertySchema } = require("../model/schema/property");
const { createNewModule } = require("../controllers/customField/customField.js");
const { add: createNewRole } = require("../controllers/roleAccess/roleAccess.js");
const customField = require('../model/schema/customField.js');
const { contactFields } = require('./contactFields.js');
const { leadFields } = require('./leadFields.js');
const { propertiesFields } = require('./propertiesFields.js');
const { defaultRole } = require("./defaultRoles.js");
const seedPipelineStages = require("../scripts/seedPipelineStages.js");
const { connectWithFallback } = require("../utils/mongoConnect");

const initializedSchemas = async () => {
    await initializeLeadSchema();
    await initializeContactSchema();
    await initializePropertySchema();

    const CustomFields = await customField.find({ deleted: false });
    const createDynamicSchemas = async (CustomFields) => {
        for (const module of CustomFields) {
            const { moduleName, fields } = module;

            // Check if schema already exists
            if (!mongoose.models[moduleName]) {
                // Create schema object
                const schemaFields = {};
                for (const field of fields) {
                    schemaFields[field.name] = { type: field.backendType };
                    if (field.ref) schemaFields[field.name] = { type: field.backendType, ref: field.ref };
                }
                // Create Mongoose schema
                const moduleSchema = new mongoose.Schema(schemaFields);
                // Create Mongoose model
                mongoose.model(moduleName, moduleSchema, moduleName);
                // Console statement removed
            }
        }
    };

    createDynamicSchemas(CustomFields);

}

const connectDB = async (DATABASE_URL, DATABASE) => {
    try {
        mongoose.set("strictQuery", false);
        await connectWithFallback({
            primaryUri: DATABASE_URL,
            fallbackUri: process.env.DB_URL_FALLBACK,
            dbName: DATABASE,
            context: "db-connect",
        });

        // const collectionsToDelete = ['abc', 'Report and analytics', 'test', 'krushil', 'bca', 'xyz', 'lkjhg', 'testssssss', 'tel', 'levajav', 'tellevajav', 'Contact'];
        // const db = mongoose.connection.db;
        // console.log(db)
        // for (const collectionName of collectionsToDelete) {
        //     await db.collection(collectionName).drop();
        //     console.log(`Collection ${collectionName} deleted successfully.`);
        // }

        await initializedSchemas();

        /* this was temporary  */
        const mockRes = {
            status: (code) => {
                return {
                    json: (data) => { }
                };
            },
            json: (data) => { }
        };

        // Create default modules
        await createNewModule({ body: { moduleName: 'Leads', fields: leadFields, headings: [], isDefault: true } }, mockRes);
        await createNewModule({ body: { moduleName: 'Contacts', fields: contactFields, headings: [], isDefault: true } }, mockRes);
        await createNewModule({ body: { moduleName: 'Properties', fields: propertiesFields, headings: [], isDefault: true } }, mockRes);

        // Create default role
        // await createNewRole({ body: defaultRole }, mockRes);

        /*  */
        await initializedSchemas();

        let adminExisting = await User.find({ role: 'superAdmin' });
        if (adminExisting.length <= 0) {
            const phoneNumber = process.env.ADMIN_PHONE || '7874263694';
            const firstName = process.env.ADMIN_FIRST_NAME || 'Premium';
            const lastName = process.env.ADMIN_LAST_NAME || 'Estate';
            const username = process.env.ADMIN_EMAIL || 'admin@gmail.com';
            const password = process.env.ADMIN_PASSWORD;
            if (!password) {
                // Console statement removed
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new User({ _id: new mongoose.Types.ObjectId('64d33173fd7ff3fa0924a109'), username, password: hashedPassword, firstName, lastName, phoneNumber, role: 'superAdmin' });
                await user.save();
                // Console statement removed
            }
        } else if (adminExisting[0].deleted === true) {
            await User.findByIdAndUpdate(adminExisting[0]._id, { deleted: false });
            // Console statement removed
        }

        await seedPipelineStages();

        // Console statement removed
    } catch (err) {
        // Console statement removed
    }
}
module.exports = connectDB