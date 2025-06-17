exports.toXelfieDTO = (xelfie) => {
  return {
    id: xelfie.id,
    name: xelfie.activity.name,
    description: xelfie.activity.description,
    location: xelfie.activity.location,
    type: "Xelfie",
    isActive: xelfie.activity.isActive,
    minAge: xelfie.activity.minAge,
    maxAge: xelfie.activity.maxAge,
  };
};

exports.toUserXelfieDTO = (userXelfie) => {
  return {
    xelfieId: userXelfie.xelfieId,
    takenAt: userXelfie.takenAt,
    downloadable: !!userXelfie.downloadable,
  };
};
