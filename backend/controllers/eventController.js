const eventService = require("../services/eventService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
  ValidationError,
} = require("../utils/errors");

const { toEventDTO } = require("../dto/event.dto");

exports.createEvent = async (req, res, next) => {
  const { startDate, endDate, ...activityParams } = req.body;

  try {
    const event = await eventService.createEvent({
      startDate,
      endDate,
      type: "Event",
      ...activityParams,
    });

    res.status(200).json(toEventDTO(event));
  } catch (err) {
    next(handleSequelizeError(err, "Event"));
  }
};

exports.getEvent = async (req, res, next) => {
  const id = req.params.id;
  try {
    const event = await eventService.getEvent(id);

    if (!event) return next(new ResourceNotFoundError("Event not found"));

    res.status(200).json(toEventDTO(event));
  } catch (err) {
    next(handleSequelizeError(err, "Event"));
  }
};

exports.deleteEvent = async (req, res, next) => {
  const id = req.params.id;
  try {
    const event = await eventService.deleteEvent(id);

    if (!event) return next(new ResourceNotFoundError("Event not found"));

    res.status(200).json(toEventDTO(event));
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

    const newEvent = await eventService.updateEvent(id, newEventData);

    if (!newEvent) return next(new ResourceNotFoundError("Event not found"));

    res.status(200).json(toEventDTO(newEvent));
  } catch (err) {
    next(handleSequelizeError(err, "Event"));
  }
};
