exports.toUserActivityDTO = (act) => {
  return {
    id: act.id,
    startedAt: act.startedAt,
    completedAt: act.completedAt,
    userId: act.user ? act.user.id : act.userId,
    activityId: act.activity ? act.activity.id : act.activityId,
  };
};
