// Campos públicos de una actividad.
exports.toActivityDTO = (a) =>
  a
    ? {
        id: a.id,
        name: a.name,
        description: a.description,
        location: a.location,
        type: a.type,
        isActive: a.isActive,
        minAge: a.minAge,
        maxAge: a.maxAge,
        houseId: a.houseId || null,
      }
    : null;

// Fila de un subtipo (xelfie/xperiencia/xecreto/evento) aplanada con su actividad.
exports.flattenSubtype = (row, type, extra = {}) => {
  const activity = exports.toActivityDTO(row.activity);
  return {
    id: row.id,
    activityId: activity ? activity.id : row.activityId,
    name: activity ? activity.name : null,
    description: activity ? activity.description : null,
    location: activity ? activity.location : null,
    type,
    isActive: activity ? activity.isActive : null,
    minAge: activity ? activity.minAge : null,
    maxAge: activity ? activity.maxAge : null,
    houseId: activity ? activity.houseId : null,
    ...extra,
    activity,
  };
};

exports.toUserActivityDTO = (ua) => ({
  id: ua.id,
  userId: ua.userId,
  activityId: ua.activityId,
  startedAt: ua.startedAt,
  completedAt: ua.completedAt,
});
