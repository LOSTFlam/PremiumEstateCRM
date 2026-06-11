export const PROPERTY_EDIT_SECTIONS = {
  hero: {
    fields: [
      { key: "name", type: "text", labelKey: "publicListing.propertyName" },
      { key: "listingPrice", type: "text", labelKey: "publicListing.price" },
      { key: "dealType", type: "select", labelKey: "publicListing.dealType", options: ["sale", "rent"] },
      { key: "listingStatus", type: "text", labelKey: "publicListing.status" },
      { key: "propertyAddress", type: "text", labelKey: "publicListing.address" },
      {
        key: "marketingDescription",
        type: "textarea",
        labelKey: "publicListing.marketingDescription",
        rows: 4,
      },
      {
        key: "propertyDescription",
        type: "textarea",
        labelKey: "publicListing.propertyDescription",
        rows: 4,
      },
    ],
  },
  features: {
    fields: [
      { key: "numberofBedrooms", type: "number", labelKey: "publicListing.bedrooms" },
      { key: "numberofBathrooms", type: "number", labelKey: "publicListing.bathrooms" },
      { key: "squareFootage", type: "text", labelKey: "publicListing.area" },
      { key: "propertyType", type: "text", labelKey: "publicListing.propertyType" },
      { key: "listingDate", type: "date", labelKey: "publicListing.listingDate" },
      { key: "lotSize", type: "text", labelKey: "publicListing.lotSize" },
      { key: "parkingAvailability", type: "text", labelKey: "publicListing.parkingAvailability" },
      {
        key: "heatingAndCoolingSystems",
        type: "textarea",
        labelKey: "publicListing.engineeringTitle",
        rows: 3,
      },
      { key: "flooringType", type: "textarea", labelKey: "publicListing.finishTitle", rows: 3 },
      { key: "unitType", type: "text", labelKey: "publicListing.unitTypes" },
    ],
  },
  about: {
    fields: [
      {
        key: "marketingDescription",
        type: "textarea",
        labelKey: "publicListing.marketingDescription",
        rows: 4,
      },
      {
        key: "propertyDescription",
        type: "textarea",
        labelKey: "publicListing.propertyDescription",
        rows: 4,
      },
      {
        key: "communityAmenities",
        type: "textarea",
        labelKey: "publicListing.lifestyleTitle",
        rows: 3,
      },
    ],
  },
  amenities: {
    fields: [
      { key: "communityAmenities", type: "textarea", labelKey: "publicListing.amenitiesTitle", rows: 3 },
      { key: "appliancesIncluded", type: "textarea", labelKey: "publicListing.appliancesIncluded", rows: 3 },
      { key: "exteriorFeatures", type: "textarea", labelKey: "publicListing.exteriorFeatures", rows: 3 },
      { key: "heatingAndCoolingSystems", type: "textarea", labelKey: "publicListing.engineeringTitle", rows: 3 },
      { key: "flooringType", type: "textarea", labelKey: "publicListing.finishTitle", rows: 3 },
    ],
  },
  highlights: {
    fields: [
      { key: "propertyType", type: "text", labelKey: "publicListing.type" },
      { key: "squareFootage", type: "text", labelKey: "publicListing.area" },
      { key: "lotSize", type: "text", labelKey: "publicListing.lotSize" },
    ],
  },
};
