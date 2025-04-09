exports.toEventDTO = (event) => {
  return {
    id: event.id,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
  };
};
