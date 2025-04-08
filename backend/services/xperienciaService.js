const Activity = require("../models/activity");
const Xperiencia = require("../models/xperiencia");
const House = require("../models/house");

exports.createXperiencia = async ({
  qrCode,
  isValidable,
  ...activityParams
}) => {
  const xperiencia = await Xperiencia.create(
    {
      qrCode,
      isValidable,
      activity: activityParams,
    },
    {
      include: [
        Activity
      ],
    }
  );

  return xperiencia;
};

exports.getXperiencia = async (id) => {
  let xperiencia = await Xperiencia.findByPk(id, {
    include: [
      Activity
    ],
  });

  return xperiencia;
};

exports.deleteXperiencia = async (id) => {
  const xperiencia = await this.getXperiencia(id);

  if (xperiencia == null) return null;

  const destroyed = await xperiencia.destroy();
  return destroyed;
};

exports.updateXperiencia = async (id, newData) => {
  const xperiencia = await this.getXperiencia(id);

  if (xperiencia == null) return null;
  const updated = await xperiencia.update(newData);
  if (updated != null) {
    await xperiencia.activity.update(newData);
  }
  return updated;
};
