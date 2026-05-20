exports.toAchievementDTO = (a) => {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    type: a.type,
    imageUrl: a.imageUrl,
    houseId: a.house ? a.house.id : (a.houseId || null),
    activityId: a.activity ? a.activity.id : (a.activityId || null),
  };
};

exports.toUserAchievementDTO = (ua) => {
  return {
    id: ua.id,
    amount: ua.amount,
    completedAt: ua.completedAt,
    userId: ua.user ? ua.user.id : ua.userId,
    achievementId: ua.achievement ? ua.achievement.id : ua.achievementId,
  };
};
