// require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const eventRoutes = require("./routes/eventRoutes");
const mainRoutes = require("./routes/mainRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// create app
const app = express();


const port = process.env.PORT || 2000;

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => {
  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
})
.catch((err) => console.log("DB Connection Error:", err.message));


// -------------------------
// Middleware
// -------------------------
app.use(session({
  secret: "jiaru90aerur90ef930iofe",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri
  }),
  cookie: { maxAge: 60 * 60 * 1000 }
}));

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


// Routes
app.use("/events", eventRoutes);
app.use("/", mainRoutes);
app.use("/users", userRoutes);


// 404 handler
app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }
  res.status(err.status);
  res.render("error", { error: err });
});
