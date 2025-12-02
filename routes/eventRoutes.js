const express = require("express");
const model = require("../models/event");
const controller = require("../controllers/eventController");
const { fileUpload } = require("../middleware/fileUpload");
const { isLoggedIn, isHost, isNotHost } = require("../middleware/auth");
const {
  validateId,
  validateEvent,
  validateResult,
  validateRsvp,
} = require("../middleware/validator");

const router = express.Router();

//GET/events: send all events to the user

router.get("/", controller.index);

//GET/events/new: send html form for creating a new event

router.get("/new", isLoggedIn, controller.new);

//POST/events: create a new event

router.post("/", isLoggedIn, fileUpload, validateEvent, validateResult, controller.create);

//GET/events/:id: send details of event identified by id
router.get("/:id", validateId, controller.show);

//GET /events/:id/edit: send html form for editing an existing event
router.get("/:id/edit", isLoggedIn, validateId, isHost, controller.edit);

//PUT /events/:id: update the event identified by id
router.put(
  "/:id",
  isLoggedIn,
  validateId,
  fileUpload,
  isHost,
  validateEvent,
  validateResult,
  controller.update
);

//DELETE /events/:id: delete the event identified by id
router.delete("/:id", isLoggedIn, validateId, isHost, controller.delete);

// POST /events/:id/rsvp: creates/updates rsvp for an event identified by id
router.post(
  "/:id/rsvp",
  isLoggedIn,
  validateId,
  isNotHost,
  validateRsvp,
  validateResult,
  controller.updateRsvp
);

module.exports = router;
