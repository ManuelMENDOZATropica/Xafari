exports.toAchievementDTO = (a) => {
  return {
    id: a.id,
    title: a.title,
    type: a.type,
    iconUrl: a.iconUrl,
    house: a.house,
  };
};

exports.toUserAchievementDTO = (ua) => {
  return {
    achievementId: ua.achievementId.toString(),
    earnedAt: ua.earnedAt,
  };
};
