const Activity = require("../models/activity");
const EventModel = require("../models/event");

exports.createEvent = async ({ startDate, endDate, ...activityParams }) => {
  const event = await EventModel.create(
    {
      startDate,
      endDate,
      activity: activityParams,
    },
    {
      include: [Activity],
    }
  );

  return event;
};

exports.getEvent = async (id) => {
  let event = await EventModel.findByPk(id, {
    include: [Activity],
  });

  return event;
};

exports.getAllEvents = async () => {
  const events = await EventModel.findAll({
    include: [Activity],
  });

  return events;
};

exports.deleteEvent = async (id) => {
  const event = await this.getEvent(id);

  if (event == null) throw new ResourceNotFoundError("Resource not found");

  const destroyed = await event.destroy();
  return destroyed;
};

exports.updateEvent = async (id, newData) => {
  const event = await this.getEvent(id);

  if (event == null) throw new ResourceNotFoundError("Resource not found");

  const updated = await event.update(newData);
  if (updated != null) {
    await event.activity.update(newData);
  }
  return updated;
};
