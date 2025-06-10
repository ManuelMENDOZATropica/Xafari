exports.toUserActivityDTO = (act) => {
  return {
    id: act.id,
    startedAt: act.startedAt,
    completedAt: act.completedAt,
    userId: act.user.id,
    activityId: act.activity.id,
  };
};
