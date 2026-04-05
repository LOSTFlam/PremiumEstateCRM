const mongoose = require("mongoose");

const fetchSchemaFields = async () => {
    const CustomFieldModel = mongoose.model("CustomField");
    return await CustomFieldModel.find({ moduleName: "Properties" });
};

const unitTypeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    sqm: {
        type: String,
    },
    executive:{
        type: String,
    },
    order: {
        type: Number,
    },
    price: {
        type: String,
    },
});

const flatSchema = new mongoose.Schema({
    flateName: { type: Number },
    status: { type: String },
    unitType: { type: String },
});

const floorSchema = new mongoose.Schema({
    floorNumber: { type: Number },
    flats: [flatSchema],
});

const propertySchema = new mongoose.Schema({
    // //1. basicPropertyInformation:
    // propertyType: String,
    // propertyAddress: String,
    // listingPrice: String,
    // squareFootage: String,
    // numberofBedrooms: Number,
    // numberofBathrooms: Number,
    // yearBuilt: Number,
    // propertyDescription: String,
    // //2. Property Features and Amenities:
    // lotSize: String,
    // parkingAvailability: String,
    // appliancesIncluded: String,
    // heatingAndCoolingSystems: String,
    // flooringType: String,
    // exteriorFeatures: String,
    // communityAmenities: String,
    // //3. Media and Visuals:
    propertyPhotos: [],
    virtualToursOrVideos: [],
    floorPlans: [],
    propertyDocuments: [],
    // //4. Listing and Marketing Details:
    // listingStatus: String,
    // listingAgentOrTeam: String,
    // listingDate: String,
    // marketingDescription: String,
    // multipleListingService: String,
    // //5. Property History:
    // previousOwners: Number,
    // purchaseHistory: String,
    // //6. Financial Information:
    // propertyTaxes: String,
    // homeownersAssociation: String,
    // mortgageInformation: String,
    // //7. Contacts Associated with Property:
    // sellers: String,
    // buyers: String,
    // photo: String,
    // propertyManagers: String,
    // contractorsOrServiceProviders: String,
    // //8. Property Notes and Comments:
    // internalNotesOrComments: String,
    unitType: {
        type: [unitTypeSchema],
        default: [],
    },
    units: {
        type: [floorSchema],
        default: [],
    },
    verificationStatus: {
        type: String,
        default: "pending",
        index: true,  // Index for filtering by verification status
    },
    verificationScore: {
        type: Number,
        default: 0,
    },
    verificationNotes: {
        type: String,
        default: "",
    },
    verificationChecklist: {
        type: [String],
        default: [],
    },
    verificationUpdatedAt: {
        type: Date,
        default: null,
    },
    verificationUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    seoTitle: {
        type: String,
        default: "",
    },
    seoDescription: {
        type: String,
        default: "",
    },
    seoKeywords: {
        type: String,
        default: "",
    },
    publicSlug: {
        type: String,
        default: "",
        unique: true,  // Unique index for public slug
        sparse: true,  // Allow null/empty values
        index: true,
    },
    featuredCollections: {
        type: [String],
        default: [],
    },
    deleted: {
        type: Boolean,
        default: false,
        index: true,  // Index for soft-delete filtering
    },
    updatedDate: {
        type: Date,
        default: Date.now,
        index: true,  // Index for sorting by update date
    },
    createdDate: {
        type: Date,
        index: true,  // Index for sorting by creation date
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,  // Index for filtering by agent/creator
    },
}, {
    // Enable text search on specific fields
    timestamps: true,  // Automatically manage createdAt/updatedAt
});

// Compound indexes for common query patterns
propertySchema.index({ deleted: 1, createdDate: -1 });  // Active properties by date
propertySchema.index({ deleted: 1, verificationStatus: 1 });  // Properties by verification status
propertySchema.index({ createBy: 1, deleted: 1 });  // Properties by agent
propertySchema.index({ publicSlug: 1, deleted: 1 });  // Public lookup by slug
propertySchema.index({ propertyType: 1, deleted: 1 });  // Filter by property type
propertySchema.index({ listingStatus: 1, deleted: 1 });  // Filter by listing status

const initializePropertySchema = async () => {
    const schemaFieldsData = await fetchSchemaFields();
    schemaFieldsData[0]?.fields?.forEach((item) => {
        propertySchema.add({ [item.name]: item?.backendType });
    });
};

const Property = mongoose.model("Properties", propertySchema, "Properties");
module.exports = { Property, initializePropertySchema };
