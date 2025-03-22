const eventService = require("../services/eventService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
  ValidationError,
} = require("../utils/errors");

exports.createEvent = async (req, res, next) => {
  const { startDate, endDate, minAge, maxAge, ...activityParams } = req.body;

  if (!isNaN(minAge) && !isNaN(maxAge) && minAge >= maxAge) {
    return next(new ValidationError("Age limits are not valid"));
  }

  try {
    const event = await eventService.createEvent({
      startDate,
      endDate,
      type: "Event",
      ...activityParams,
    });

    res.json({
      event: event.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Event"));
  }
};

exports.getEvent = async (req, res, next) => {
  const id = req.params.id;
  try {
    const event = await eventService.getEvent(id);

    if (!event) return next(new ResourceNotFoundError("Event not found"));

    res.json({
      event: event.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Event"));
  }
};

exports.deleteEvent = async (req, res, next) => {
  const id = req.params.id;
  try {
    const event = await eventService.deleteEvent(id);

    if (!event) return next(new ResourceNotFoundError("Event not found"));

    res.json({
      event: event.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Event"));
  }
};

exports.updateEvent = async (req, res, next) => {
  const id = req.params.id;

  try {
    const newEventData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.description ? { description: req.body.description } : {}),
      ...(req.body.location ? { location: req.body.location } : {}),
      ...(req.body.type ? { type: req.body.type } : {}),
      ...(req.body.isActive ? { isActive: req.body.isActive } : {}),
      ...(req.body.minAge ? { minAge: req.body.minAge } : {}),
      ...(req.body.maxAge ? { maxAge: req.body.maxAge } : {}),
      ...(req.body.startDate ? { startDate: req.body.startDate } : {}),
      ...(req.body.endDate ? { endDate: req.body.endDate } : {}),
    };

    if (
      !isNaN(newEventData.minAge) &&
      !isNaN(newEventData.maxAge) &&
      newEventData.minAge >= newEventData.maxAge
    ) {
      return next(new ValidationError("Age limits are not valid"));
    }

    const newEvent = await eventService.updateEvent(id, newEventData);

    if (!newEvent) return next(new ResourceNotFoundError("Event not found"));

    res.json({
      event: newEvent.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Event"));
  }
};
