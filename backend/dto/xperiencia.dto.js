exports.toXperienciaDTO = (xp) => {
  return {
    id: xp.id,
    qrCode: xp.qrCode,
    isValidable: xp.isValidable,
    name: xp.activity ? xp.activity.name : null,
    description: xp.activity ? xp.activity.description : null,
    location: xp.activity ? xp.activity.location : null,
    type: "Xperiencia",
    isActive: xp.activity ? xp.activity.isActive : null,
    minAge: xp.activity ? xp.activity.minAge : null,
    maxAge: xp.activity ? xp.activity.maxAge : null,
    activity: xp.activity ? {
      id: xp.activity.id,
      name: xp.activity.name,
      description: xp.activity.description,
      location: xp.activity.location,
      type: xp.activity.type,
      isActive: xp.activity.isActive,
      minAge: xp.activity.minAge,
      maxAge: xp.activity.maxAge,
    } : null
  };
};
