const { Property } = require("../../model/schema/property");
const {
  addUnitsToProperty,
  findPropertyAndFloor,
} = require("./units.service");

const deleteUnitType = async (req, res) => {
  try {
    const { id } = req.params;
    const { unitTypeId } = req.body;
    const updatedProperty = await Property.findByIdAndUpdate(
      { _id: id },
      { $pull: { unitType: { _id: unitTypeId } } },
      { new: true },
    );
    res.status(200).json(updatedProperty);
  } catch (error) {
    // Console statement removed
    res.status(400).json({ error: "Failed to delete unit type" });
  }
};

const addUnits = async (req, res) => {
  try {
    const { id } = req.params;
    const { units, type } = req.body;

    const result = await addUnitsToProperty(id, units, type);
    res.status(200).json(result);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to update units" });
  }
};

const editUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Property.updateOne(
      { _id: id, "unitType._id": req?.body?._id },
      { $set: { "unitType.$": req?.body } },
    );

    res.status(200).json(result);
  } catch (err) {
    // Console statement removed
    res.status(400).json({ error: "Failed to edit unit" });
  }
};

const updateUnitTypeId = async (req, res) => {
  try {
    const { id, unitid, newUnitType } = req.params;
    const updatedUnitTypeId = await Property.updateOne(
      { _id: id, "units.flats._id": unitid },
      { $set: { "units.$[].flats.$[flat].unitType": newUnitType } },
      {
        arrayFilters: [{ "flat._id": unitid }],
        new: true,
      },
    );
    res.status(200).json(updatedUnitTypeId);
  } catch (error) {
    // Console statement removed
    res.status(400).json({ error: "Failed to update unit type id" });
  }
};

const changeUnitStatus = async (req, res) => {
  try {
    const { id } = req?.params;
    const { floor, unit } = req?.body;

    const { selectedFloor, flatIndex, error } = await findPropertyAndFloor(id, floor, unit);
    if (error) return res?.status(404)?.json({ error });

    selectedFloor.flats[flatIndex] = unit;

    const result = await Property.updateOne(
      { _id: id, "units._id": floor?._id },
      { $set: { "units.$.flats": selectedFloor?.flats } },
    );

    res?.status(200)?.json(result);
  } catch (err) {
    console?.error("Failed to change unit status:", err);
    res?.status(400)?.json({ error: "Failed to change unit status" });
  }
};

module.exports = {
  deleteUnitType,
  addUnits,
  editUnit,
  updateUnitTypeId,
  changeUnitStatus,
};
