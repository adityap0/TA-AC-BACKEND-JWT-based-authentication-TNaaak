var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var auth = require("./middlewares/auth");
var session = require("express-session");
var MongoStore = require("connect-mongo");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var userRouter = require("./routes/user");
var profileRouter = require("./routes/profiles");
var articlesRouter = require("./routes/articles");
var tagsRouter = require("./routes/tags");

var app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/node-conduit",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log(err ? err : "Connected");
  }
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session Middleware
app.use(
  session({
    secret: "conduit-session",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/node-conduit",
    }),
  })
);

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/tags", tagsRouter);
app.use(auth.loggedInUser);
app.use(auth.userInfo);
app.use(auth.validateToken);
app.use("/api/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
