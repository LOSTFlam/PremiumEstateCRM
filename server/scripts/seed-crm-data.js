const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config();

const User = require("../model/schema/user");
const Account = require("../model/schema/account");
const { connectWithFallback } = require("../utils/mongoConnect");

const now = new Date();
const CONTACTS_TARGET = Number(process.env.SEED_CONTACTS || 300);
const LEADS_TARGET = Number(process.env.SEED_LEADS || 200);
const PROPERTIES_TARGET = Number(process.env.SEED_PROPERTIES || 50);
const USERS_TARGET = Number(process.env.SEED_USERS || 12);
const ACCOUNTS_TARGET = Number(process.env.SEED_ACCOUNTS || 40);

const PHOTO_LIBRARY = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600",
  "https://images.unsplash.com/photo-1600607687644-c7f34b5ab5b3?w=1600",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1600",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1600",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600",
];

const FIRST_NAMES = [
  "Ivan","Nikita","Maksim","Artem","Roman","Ilya","Sergey","Dmitry","Pavel","Andrey",
  "Elena","Anna","Maria","Olga","Sofia","Alina","Ekaterina","Irina","Natalia","Polina"
];
const LAST_NAMES = [
  "Ivanov","Petrov","Sidorov","Smirnov","Kuznetsov","Popov","Lebedev","Morozov","Volkov","Sokolov",
  "Romanova","Orlova","Kiseleva","Fedorova","Mikhailova","Voronova","Belova","Tarasova","Nikolaeva","Andreeva"
];
const CITIES = ["Moscow", "Saint Petersburg", "Kazan", "Sochi", "Yekaterinburg", "Krasnodar"];
const INDUSTRIES = ["Investment", "Private Capital", "Development", "Property Management", "Tech", "Retail"];
const PROPERTY_TYPES = ["Apartment", "House", "Land", "Commercial"];
const PROPERTY_STATUSES = ["Available", "Active", "New", "Booked", "Sold"];
const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Hot",
  "Warm",
  "Cold",
  "Won",
  "Lost",
];

const randomFrom = (arr, indexSeed = 0) => arr[(indexSeed + Math.floor(Math.random() * arr.length)) % arr.length];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const slugify = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const buildPhotoSet = (offset = 0, count = 4) => {
  const selected = Array.from({ length: count }).map((_, idx) => PHOTO_LIBRARY[(offset + idx) % PHOTO_LIBRARY.length]);
  return selected;
};

const mapPhotos = (urls = [], date = new Date()) =>
  urls.map((img) => ({
    img,
    createOn: date,
  }));

const buildUsers = () => {
  const base = [{ email: "admin@gmail.com", firstName: "Premium", lastName: "Admin", role: "superAdmin" }];
  const extra = Array.from({ length: Math.max(USERS_TARGET - 1, 3) }).map((_, idx) => ({
    email: `agent${idx + 1}@premiumestatecrm.com`,
    firstName: randomFrom(FIRST_NAMES, idx),
    lastName: randomFrom(LAST_NAMES, idx),
    role: "user",
  }));
  return [...base, ...extra];
};

const buildAccounts = () =>
  Array.from({ length: ACCOUNTS_TARGET }).map((_, idx) => ({
    name: `Account ${idx + 1} ${randomFrom(CITIES, idx)}`,
    city: randomFrom(CITIES, idx),
    industry: randomFrom(INDUSTRIES, idx),
  }));

const buildContacts = () =>
  Array.from({ length: CONTACTS_TARGET }).map((_, idx) => {
    const firstName = randomFrom(FIRST_NAMES, idx);
    const lastName = randomFrom(LAST_NAMES, idx + 3);
    return {
      firstName,
      lastName,
      email: `contact.${idx + 1}@premiumestatecrm.com`,
      phone: `79${String(100000000 + idx).slice(0, 9)}`,
    };
  });

const buildProperties = () =>
  Array.from({ length: PROPERTIES_TARGET }).map((_, idx) => {
    const type = randomFrom(PROPERTY_TYPES, idx);
    const city = randomFrom(CITIES, idx);
    const bedrooms = type === "Land" ? 0 : randInt(1, 6);
    const bathrooms = type === "Land" ? 0 : randInt(1, 4);
    const area = type === "Land" ? randInt(600, 2200) : randInt(55, 560);
    const name = `${city} ${type} ${idx + 1}`;
    return {
      name,
      propertyAddress: `${city}, District ${randInt(1, 25)}, building ${randInt(1, 150)}`,
      listingPrice: String(randInt(120000, 5500000)),
      propertyType: type,
      listingStatus: randomFrom(PROPERTY_STATUSES, idx),
      squareFootage: String(area),
      numberofBedrooms: bedrooms,
      numberofBathrooms: bathrooms,
      lotSize: `${randInt(4, 25)} acres`,
    };
  });

async function upsertUsers() {
  const passwordPlain = process.env.ADMIN_PASSWORD || "changeme123";
  const hashedPassword = await bcrypt.hash(passwordPlain, 10);

  const userSeeds = buildUsers();
  const users = [];
  for (const seed of userSeeds) {
    const username = seed.email.toLowerCase();
    const user = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          username,
          email: username,
          firstName: seed.firstName,
          lastName: seed.lastName,
          role: seed.role,
          deleted: false,
          updatedDate: now,
        },
        $setOnInsert: {
          password: hashedPassword,
          createdDate: now,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    users.push(user);
  }
  return users;
}

async function seedData() {
  try {
    await connectWithFallback({
      primaryUri: process.env.DB_URL || "mongodb://127.0.0.1:27017",
      fallbackUri: process.env.DB_URL_FALLBACK || "",
      dbName: process.env.DB || "PremiumEstateDB",
      context: "seed-crm-data",
    });

    const users = await upsertUsers();
    const admin = users.find((u) => u.role === "superAdmin") || users[0];
    const agents = users.filter((u) => String(u._id) !== String(admin._id));
    const accountSeeds = buildAccounts();
    const contactSeeds = buildContacts();
    const propertySeeds = buildProperties();

    const accounts = [];
    const contactsCollection = mongoose.connection.db.collection("Contacts");
    const leadsCollection = mongoose.connection.db.collection("Leads");
    const propertiesCollection = mongoose.connection.db.collection("Properties");
    for (let i = 0; i < accountSeeds.length; i += 1) {
      const seed = accountSeeds[i];
      const owner = agents[i % agents.length] || admin;
      const account = await Account.findOneAndUpdate(
        { name: seed.name, deleted: false },
        {
          $set: {
            name: seed.name,
            industry: seed.industry,
            billingCity: seed.city,
            shippingCity: seed.city,
            website: "https://premiumestatecrm.local",
            type: "Customer",
            rating: "Hot",
            assignUser: owner._id,
            createBy: admin._id,
            modifiedBy: admin._id,
            modifiedDate: now,
          },
          $setOnInsert: {
            createdDate: now,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
      accounts.push(account);
    }

    const properties = [];
    for (let i = 0; i < propertySeeds.length; i += 1) {
      const seed = propertySeeds[i];
      const owner = agents[i % agents.length] || admin;
      const photoUrls = buildPhotoSet(i % PHOTO_LIBRARY.length, 4);
      const photos = mapPhotos(photoUrls, now);
      const publicSlug = seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Use native collection to bypass strict schema limitations
      // (Property fields are dynamically extended via custom fields at runtime)
      await propertiesCollection.updateOne(
        { publicSlug, deleted: false },
        {
          $set: {
            ...seed,
            propertyDescription: "Modern turnkey property with premium finishing and strong investment potential.",
            marketingDescription: "Verified listing with high quality media and legal-ready documentation.",
            propertyPhotos: photos,
            // Backup metadata stored in DB for resiliency
            propertyPhotoSources: photoUrls,
            propertyPhotoBackup: photoUrls.map((url, idx) => ({
              sourceUrl: url,
              ordinal: idx + 1,
              capturedAt: now,
              checksumHint: slugify(url).slice(0, 32),
            })),
            floorPlans: photos.slice(0, 1),
            propertyDocuments: [{ img: "https://example.com/docs/property-brochure.pdf", createOn: now }],
            verificationStatus: "verified",
            verificationScore: 90 + i,
            featuredCollections: ["verified", "family-homes"],
            updatedDate: now,
            createBy: owner._id,
          },
          $setOnInsert: {
            createdDate: now,
            publicSlug,
            deleted: false,
          },
        },
        { upsert: true }
      );
      // eslint-disable-next-line no-await-in-loop
      const property = await propertiesCollection.findOne({ publicSlug, deleted: false });
      if (property) properties.push(property);
    }

    for (let i = 0; i < contactSeeds.length; i += 1) {
      const seed = contactSeeds[i];
      const owner = agents[i % agents.length] || admin;
      const linkedProperty = properties[i % properties.length];
      const linkedAccount = accounts[i % accounts.length];

      // eslint-disable-next-line no-await-in-loop
      await contactsCollection.updateOne(
        { email: seed.email, deleted: false },
        {
          $set: {
            firstName: seed.firstName,
            lastName: seed.lastName,
            email: seed.email,
            phoneNumber: seed.phone,
            physicalAddress: linkedProperty?.propertyAddress,
            leadStatus: "Active",
            notesandComments: `Interested in ${linkedProperty?.name}`,
            tagsOrLabelsForcategorizingcontacts: "buyer,priority",
            interestProperty: linkedProperty ? [linkedProperty._id] : [],
            accountName: linkedAccount?.name,
            createBy: owner._id,
            updatedDate: now,
          },
          $setOnInsert: {
            createdDate: now,
            deleted: false,
          },
        },
        { upsert: true }
      );
    }

    for (let i = 0; i < LEADS_TARGET; i += 1) {
      const seed = contactSeeds[i];
      const owner = agents[i % agents.length] || admin;
      const property = properties[i % properties.length];
      const leadSeed = seed || contactSeeds[i % contactSeeds.length];

      // eslint-disable-next-line no-await-in-loop
      await leadsCollection.updateOne(
        { leadEmail: `lead.${i + 1}.${leadSeed.email}`, deleted: false },
        {
          $set: {
            leadName: `${leadSeed.firstName} ${leadSeed.lastName}`,
            leadEmail: `lead.${i + 1}.${leadSeed.email}`,
            leadPhoneNumber: leadSeed.phone,
            leadSource: randomFrom(["Website", "Referral", "Instagram", "Facebook Ads", "Portal"], i),
            leadStatus: randomFrom(LEAD_STATUSES, i),
            leadCampaign: randomFrom(
              ["Spring Premium Campaign", "Urban Buyers Q2", "Luxury Villas", "Investors Pipeline"],
              i
            ),
            leadScore: randInt(35, 98),
            leadNotes: `Interested in ${property?.name}`,
            leadOwner: owner?._id,
            interestProperty: property?._id,
            createBy: owner._id,
            updatedDate: now,
          },
          $setOnInsert: {
            createdDate: now,
            deleted: false,
          },
        },
        { upsert: true }
      );
    }

    console.log(
      `[seed:all] Done. Users: ${users.length}, Accounts: ${accounts.length}, Contacts: ${contactSeeds.length}, Leads: ${LEADS_TARGET}, Properties: ${properties.length}`
    );
  } catch (error) {
    console.error("[seed:all] Failed:", error?.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

seedData();

