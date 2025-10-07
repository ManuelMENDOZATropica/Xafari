exports.toUserPreferenceDTO = (pref) => {
  return {
    id: pref.id,
    activityId: pref.activity.activityId,
    rating: pref.rating,
    comment: pref.comment,
    isFavorite: pref.isFavorite,
  };
};
