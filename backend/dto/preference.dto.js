exports.toUserPreferenceDTO = (pref) => {
  return {
    id: pref.id,
    userId: pref.userId,
    activityId: pref.activityId,
    rating: pref.rating,
    comment: pref.comment,
    isFavorite: pref.isFavorite,
  };
};

