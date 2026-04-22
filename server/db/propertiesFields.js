const propertiesFields = [
    {
      "name": "name",
      "label": "Name",
      "type": "text",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": true,
      "isView": false,
      "options": [],
      "validation": [
        {
          "require": true,
          "message": ""
        }
      ]
    },
    {
      name: "lrNo",
      label: "L.R. NO. ",
      type: "text",
      fixed: true,
      delete: false,
      belongsTo: null,
      backendType: "String",
      editable: false,
      isTableField: true,
      options: [],
      validation: [
        {
          require: true,
          message: "",
        },
      ],
    },
    {
      "name": "status",
      "label": "Status",
      "type": "select",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": true,
      "isView": false,
      "options": [
        {
          "name": "Available",
          "value": "Available"
        },
        {
          "name": "Booked",
          "value": "Booked"
        },
        {
          "name": "Sold",
          "value": "Sold"
        },
        {
          "name": "Blocked",
          "value": "Blocked"
        }
      ],
      "validation": [
        {
          "message": "Invalid type value for Lead Status",
          "formikType": "String"
        },
        {
          "require": true,
          "message": ""
        }
      ]
    },
    // {
    //   "name": "Unit",
    //   "label": "Unit ",
    //   "type": "text",
    //   "fixed": true,
    //   "isDefault": false,
    //   "editable": false,
    //   "delete": false,
    //   "belongsTo": null,
    //   "backendType": "Mixed",
    //   "isTableField": false,
    //   "isView": false,
    //   "validation": [
    //     {
    //       "require": true,
    //       "message": ""
    //     }
    //   ]
    // },
    {
      "name": "Floor",
      "label": "Floor",
      "type": "number",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false,
      "validation": [
        {
          "require": true,
          "message": ""
        }
      ]
    },
    {
      "name": "yearBuilt",
      "label": "Year Built",
      "type": "number",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false
    },
    {
      "name": "propertyDescription",
      "label": "Property Description",
      "type": "text",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false
    },
    {
      "name": "parking",
      "label": "Parking",
      "type": "radio",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false,
      "options": [
        {
          "name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "value": "No"
        }
      ]
    },
    {
      "name": "flooringType",
      "label": "Flooring Type",
      "type": "text",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false
    },
    {
      "name": "location",
      "label": "Location",
      "type": "text",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false
    },
    {
      "name": "Facility",
      "label": "Facility",
      "type": "text",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false
    },
    {
      "name": "propertyPhotos",
      "label": "Property Photos",
      "type": "photo",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "Array",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "numberofBedrooms",
      "label": "Bedrooms",
      "type": "number",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "Number",
      "isTableField": true,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "numberofBathrooms",
      "label": "Bathrooms",
      "type": "number",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "Number",
      "isTableField": true,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "propertyType",
      "label": "Property Type",
      "type": "select",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": true,
      "isView": true,
      "options": [
        { "name": "House", "value": "House" },
        { "name": "Apartment", "value": "Apartment" },
        { "name": "Land", "value": "Land" },
        { "name": "Commercial", "value": "Commercial" }
      ],
      "validation": []
    },
    {
      "name": "squareFootage",
      "label": "Area (sq ft)",
      "type": "number",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": true,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "lotSize",
      "label": "Lot Size",
      "type": "text",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "yearBuilt",
      "label": "Year Built",
      "type": "number",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "Number",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "updatedDate",
      "label": "Updated Date",
      "type": "date",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Date",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "createdDate",
      "label": "Published Date",
      "type": "date",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Date",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "heatingAndCoolingSystems",
      "label": "Heating & Cooling",
      "type": "textarea",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "parkingAvailability",
      "label": "Parking",
      "type": "text",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    },
    {
      "name": "unitType",
      "label": "Available Unit Types",
      "type": "textarea",
      "fixed": false,
      "isDefault": false,
      "editable": true,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": false,
      "isView": true,
      "options": [],
      "validation": []
    }
  ];
exports.propertiesFields = propertiesFields;