exports.toEventDTO = (event) => {
  return {
    id: event.id,
    startDate: event.startDate,
    endDate: event.endDate,
    name: event.activity.name,
    description: event.activity.description,
    location: event.activity.location,
    type: "Event",
    isActive: event.activity.isActive,
    minAge: event.activity.minAge,
    maxAge: event.activity.maxAge,
  };
};
