exports.toEventDTO = (event) => {
  return {
    id: event.id,
    startDate: event.startDate,
    endDate: event.endDate,
    name: event.activity ? event.activity.name : null,
    description: event.activity ? event.activity.description : null,
    location: event.activity ? event.activity.location : null,
    type: "Event",
    isActive: event.activity ? event.activity.isActive : null,
    minAge: event.activity ? event.activity.minAge : null,
    maxAge: event.activity ? event.activity.maxAge : null,
    activity: event.activity ? {
      id: event.activity.id,
      name: event.activity.name,
      description: event.activity.description,
      location: event.activity.location,
      type: event.activity.type,
      isActive: event.activity.isActive,
      minAge: event.activity.minAge,
      maxAge: event.activity.maxAge,
    } : null
  };
};
