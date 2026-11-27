// CRUD común para los tipos de actividad (Xelfie, Xperiencia, Xecreto, Event):
// cada uno es una fila en `activities` + una fila en su tabla con activityId.
const database = require("../config/database");
const { Activity, House } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

const ACTIVITY_FIELDS = ["name", "description", "location", "isActive", "minAge", "maxAge", "houseId"];

function split(data, subFields) {
  const activity = {};
  const sub = {};
  for (const k of ACTIVITY_FIELDS) if (data[k] !== undefined) activity[k] = data[k];
  for (const k of subFields) if (data[k] !== undefined) sub[k] = data[k];
  return { activity, sub };
}

module.exports = function makeSubtypeService({ Model, type, label, subFields = [], include = [], afterWrite }) {
  const fullInclude = [Activity, ...include];

  const get = (id, transaction) => Model.findByPk(id, { include: fullInclude, transaction });

  async function assertHouse(houseId, transaction) {
    if (houseId === undefined || houseId === null) return;
    const house = await House.findByPk(houseId, { attributes: ["id"], transaction });
    if (!house) throw new ResourceNotFoundError("House not found");
  }

  return {
    get,
    list: (where) => Model.findAll({ include: fullInclude, where, order: [["createdAt", "ASC"]] }),

    create: (data) =>
      database.transaction(async (transaction) => {
        const { activity, sub } = split(data, subFields);
        await assertHouse(activity.houseId, transaction);
        const act = await Activity.create({ ...activity, type }, { transaction });
        const row = await Model.create({ ...sub, activityId: act.id }, { transaction });
        if (afterWrite) await afterWrite(row, data, transaction);
        return get(row.id, transaction);
      }),

    update: (id, data) =>
      database.transaction(async (transaction) => {
        const row = await get(id, transaction);
        if (!row) throw new ResourceNotFoundError(`${label} not found`);
        const { activity, sub } = split(data, subFields);
        await assertHouse(activity.houseId, transaction);
        if (Object.keys(sub).length) await row.update(sub, { transaction });
        if (Object.keys(activity).length && row.activity) {
          await row.activity.update(activity, { transaction });
        }
        if (afterWrite) await afterWrite(row, data, transaction);
        return get(id, transaction);
      }),

    remove: (id) =>
      database.transaction(async (transaction) => {
        const row = await get(id, transaction);
        if (!row) throw new ResourceNotFoundError(`${label} not found`);
        await row.destroy({ transaction });
        if (row.activity) await row.activity.destroy({ transaction });
        return row;
      }),
  };
};

module.exports.ACTIVITY_FIELDS = ACTIVITY_FIELDS;
