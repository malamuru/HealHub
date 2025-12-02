// require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const eventRoutes = require("./routes/eventRoutes");
const mainRoutes = require("./routes/mainRoutes");
const userRoutes = require("./routes/userRoutes");
const multer = require("multer");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// create app
const app = express();

// configure app
let port = 2000;
let host = "localhost";
app.set("view engine", "ejs");
const mongoUri =
  "mongodb+srv://malamuru:Sathyamnk@cluster0.u382v.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0";


// connect to MongoDB using Mongoose
mongoose
  .connect(mongoUri)
  .then(() => {
    // start the server
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

// mount middleware

app.use(
  session({
    secret: "jiaru90aerur90ef930iofe",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://malamuru:Sathyamnk@cluster0.u382v.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0",
    }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.userName = req.session.userName || null;
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

// set up routes
app.use("/events", eventRoutes);
app.use("/", mainRoutes);
app.use("/users", userRoutes);

// handle 404 errors
app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

// error-handling middleware
app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }
  res.status(err.status);
  res.render("error", { error: err });
});