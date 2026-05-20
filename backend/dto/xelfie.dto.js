exports.toXelfieDTO = (xelfie) => {
  return {
    id: xelfie.id,
    name: xelfie.activity ? xelfie.activity.name : null,
    description: xelfie.activity ? xelfie.activity.description : null,
    location: xelfie.activity ? xelfie.activity.location : null,
    type: "Xelfie",
    isActive: xelfie.activity ? xelfie.activity.isActive : null,
    minAge: xelfie.activity ? xelfie.activity.minAge : null,
    maxAge: xelfie.activity ? xelfie.activity.maxAge : null,
    activity: xelfie.activity ? {
      id: xelfie.activity.id,
      name: xelfie.activity.name,
      description: xelfie.activity.description,
      location: xelfie.activity.location,
      type: xelfie.activity.type,
      isActive: xelfie.activity.isActive,
      minAge: xelfie.activity.minAge,
      maxAge: xelfie.activity.maxAge,
    } : null
  };
};

exports.toUserXelfieDTO = (userXelfie) => {
  return {
    id: userXelfie.id,
    userId: userXelfie.userId,
    xelfieId: userXelfie.xelfieId,
    xelfieUrl: userXelfie.xelfieUrl,
    takenAt: userXelfie.takenAt,
    downloadable: !!userXelfie.downloadable,
  };
};
