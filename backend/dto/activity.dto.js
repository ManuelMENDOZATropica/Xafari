exports.toUserActivityDTO = (act) => {
  return {
    activityId: act.activityId,
    type: act.type,
    metadata: act.metadata,
    timestamp: act.timestamp,
  };
};
