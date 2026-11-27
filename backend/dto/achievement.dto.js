exports.toAchievementDTO = (a) => ({
  id: a.id,
  name: a.name,
  description: a.description,
  type: a.type,
  imageUrl: a.imageUrl,
  houseId: a.houseId || null,
  activityId: a.activityId || null,
});

exports.toUserAchievementDTO = (ua) => ({
  id: ua.id,
  userId: ua.userId,
  achievementId: ua.achievementId,
  amount: ua.amount,
  completedAt: ua.completedAt,
});
