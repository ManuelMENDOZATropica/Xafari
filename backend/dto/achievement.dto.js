exports.toAchievementDTO = (a) => {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    type: a.type,
    imageUrl: a.imageUrl,
    houseId: a.house.id,
    activityId: a.activity.id,
  };
};

exports.toUserAchievementDTO = (ua) => {
  return {
    achievementId: ua.achievementId.toString(),
    earnedAt: ua.earnedAt,
  };
};
