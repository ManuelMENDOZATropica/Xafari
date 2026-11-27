const { flattenSubtype } = require("./activity.dto");

exports.toEventDTO = (e) => flattenSubtype(e, "Event", { startDate: e.startDate, endDate: e.endDate });
