exports.toXperienciaDTO = (xp) => {
  return {
    id: xp.id,
    qrCode: xp.qrCode,
    isValidable: xp.isValidable,

    name: xp.activity.name,
    description: xp.activity.description,
    location: xp.activity.location,
    type: "Xperiencia",
    isActive: xp.activity.isActive,
    minAge: xp.activity.minAge,
    maxAge: xp.activity.maxAge,
  };
};
