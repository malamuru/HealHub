const { validationResult } = require("express-validator");
const { body } = require("express-validator");
const model = require("../models/event");

exports.validateId = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid story id");
    err.status = 400;
    return next(err);
  } else {
    return next();
  }
};

exports.validateSignUp = [
  body("firstName", "First name is required").notEmpty().trim().escape(),
  body("lastName", "Last name is required").notEmpty().trim().escape(),
  body("email", "Email is not valid").isEmail().trim().escape().normalizeEmail(),
  body("password", "Password must be atleast 8 characters and atmost 64 characters long ").isLength(
    { min: 8, max: 64 }
  ),
];

exports.validateLogIn = [
  body("email", "Email is not valid").isEmail().trim().escape().normalizeEmail(),
  body("password", "Password must be atleast 8 characters and atmost 64 characters long ").isLength(
    { min: 8, max: 64 }
  ),
];

exports.validateEvent = [
  body("title", "Title is required").notEmpty().trim().escape(),
  body("description", "Details is required").isLength({ min: 10 }).trim().escape(),

  body("startDate", "Start date is required and must be a valid date")
    .notEmpty()
    .isISO8601()
    .toDate(),
  body("endDate", "End date is required and must be a valid date")
    .notEmpty()
    .isISO8601()
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = req.body.startDate;
      if (new Date(endDate) < new Date(startDate)) {
        throw new Error("End date cannot be earlier than start date.");
      }
      return true;
    }),

  body("location", "Location cannot be empty").notEmpty().trim().escape(),
];

exports.validateResult = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error", errorMessages.join(", "));
    return res.redirect(req.originalUrl);
  }
  next();
};

exports.validateRsvp = [
  body("status")
    .custom((value, { req }) => {
      let rsvpValues = ["YES", "NO", "MAYBE"];
      if (!value) {
        throw new Error("RSVP cannot be empty");
      } else {
        if (!rsvpValues.includes(value)) {
          throw new Error("RSVP can only be " + rsvpValues.toString());
        }
      }
      return true;
    })
    .trim()
    .escape(),
];



