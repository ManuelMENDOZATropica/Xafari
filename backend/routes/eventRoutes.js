const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");

// const eventController = require("../controllers/eventController");

// function validateEventCreation() {
//   return checkSchema(
//     {
//       name: {
//         notEmpty: true,
//       },
//       description: {
//         notEmpty: true,
//       },
//       location: {
//         notEmpty: true,
//       },
//       isActive: {
//         isBoolean: true,
//       },
//       isFamiliar: {
//         isBoolean: true,
//       },
//       minAge: {
//         isInt: true,
//       },
//       maxAge: {
//         isInt: true,
//       },
//       eventName: {
//         notEmpty: true,
//       },
//       eventDescription: {
//         notEmpty: true,
//       },
//       startDate: {
//         isDate: true,
//       },
//       endDate: {
//         isDate: true,
//       },
//       eventLocation: {
//         notEmpty: true,
//       },
//       isEventActive: {
//         isBoolean: true,
//       },
//     },
//     ["body"]
//   );
// }

// function validateEventId() {
//   return checkSchema(
//     {
//       id: {
//         notEmpty: true,
//       },
//     },
//     ["params"]
//   );
// }

// function validateEventUpdate() {
//   return checkSchema(
//     {
//       id: {
//         notEmpty: true,
//       },
//       name: {
//         notEmpty: true,
//       },
//       description: {
//         notEmpty: true,
//       },
//       location: {
//         notEmpty: true,
//       },
//       isActive: {
//         isBoolean: true,
//       },
//       isFamiliar: {
//         isBoolean: true,
//       },
//       minAge: {
//         isInt: true,
//       },
//       maxAge: {
//         isInt: true,
//       },
//       eventName: {
//         notEmpty: true,
//       },
//       eventDescription: {
//         notEmpty: true,
//       },
//       startDate: {
//         isDate: true,
//       },
//       endDate: {
//         isDate: true,
//       },
//       eventLocation: {
//         notEmpty: true,
//       },
//       isEventActive: {
//         isBoolean: true,
//       },
//     },
//     ["params", "body"]
//   );
// }

// router.post("/event", validateEventCreation(), eventController.createEvent);
// router.get("/event/:id", validateEventId(), eventController.getEvent);
// router.delete("/event/:id", validateEventId(), eventController.deleteEvent);
// router.post("/event/:id", validateEventUpdate(), eventController.updateEvent);

// // router.get("/xecretos", xecretoController.getAllXecretos);
module.exports = router;
