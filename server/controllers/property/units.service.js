const { Property } = require("../../model/schema/property");
const { default: mongoose } = require("mongoose");

const buildApartmentData = (floorCount, unitData) => {
  const apartmentData = [];

  for (let i = 1; i <= floorCount; i += 1) {
    const floorUnits = unitData?.map((item, index) => ({
      flateName: i * 100 + (index + 1),
      status: "Available",
      unitType: item?._id,
    }));

    apartmentData.push({
      floorNumber: i,
      flats: floorUnits,
    });
  }

  return apartmentData;
};

const addApartmentData = (oldUnits, newUnitTypeId) =>
  oldUnits?.map((item, i) => ({
    ...item,
    flats: [
      ...item.flats,
      {
        flateName: (i + 1) * 100 + (item?.flats?.length + 1),
        status: "Available",
        unitType: newUnitTypeId,
      },
    ],
  }));

const findPropertyAndFloor = async (id, floor, unit) => {
  const property = await Property.findById(id).lean();
  if (!property) return { error: "Property not found" };

  const selectedFloor = property?.units?.find(
    (item) => item?._id?.toString() === floor?._id?.toString(),
  );
  if (!selectedFloor) return { error: "Floor not found" };

  const flatIndex = selectedFloor?.flats?.findIndex(
    (item) => item?._id?.toString() === unit?._id?.toString(),
  );
  if (flatIndex === -1) return { error: "Flat not found" };

  return { selectedFloor, flatIndex };
};

const addUnitsToProperty = async (id, units, type) => {
  let result;

  if (type === "A") {
    const newUnit = units;
    const property = await Property.findById(id).lean();
    newUnit.order = (property?.unitType?.length || 0) + 1;
    newUnit._id = new mongoose.Types.ObjectId();

    result = await Property.updateOne({ _id: id }, { $push: { unitType: newUnit } });

    const updatedProperty = await Property.findById(id).lean();

    if (updatedProperty?.units && updatedProperty?.units?.length > 0) {
      const newUnits = addApartmentData(updatedProperty?.units, newUnit?._id);
      await Property.updateOne({ _id: id }, { $set: { units: newUnits } });
    } else {
      const flates = buildApartmentData(updatedProperty?.Floor, updatedProperty?.unitType);
      result = await Property.updateOne({ _id: id }, { $set: { units: flates } });
    }
  }

  if (type === "E") {
    const updatedProperty = await Property.findById(id).lean();

    const unitTypeLookup = units?.reduce((acc, curr) => {
      acc[curr?._id] = curr?.order;
      return acc;
    }, {});

    const updatedUnits = updatedProperty?.units.map((unit) => {
      const sortedFlats = [...unit?.flats].sort(
        (a, b) => unitTypeLookup[a?.unitType] - unitTypeLookup[b?.unitType],
      );

      return {
        ...unit,
        flats: unit?.flats.map((flat, index) => ({
          ...flat,
          status: sortedFlats?.[index]?.status,
          unitType: sortedFlats?.[index]?.unitType,
        })),
      };
    });

    result = await Property.updateOne(
      { _id: id },
      { $set: { unitType: units, units: updatedUnits } },
    );
  }

  return result;
};

module.exports = {
  buildApartmentData,
  addApartmentData,
  findPropertyAndFloor,
  addUnitsToProperty,
};
