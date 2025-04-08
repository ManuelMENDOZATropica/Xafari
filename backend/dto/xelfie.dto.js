exports.toXelfieDTO = (xelfie) => {
  return {
    id: xelfie.id,
    house: xelfie.house,
    coordinates: xelfie.coordinates,
  };
};

exports.toUserXelfieDTO = (userXelfie) => {
  return {
    xelfieId: userXelfie.xelfieId,
    takenAt: userXelfie.takenAt,
    downloadable: !!userXelfie.downloadable,
  };
};
