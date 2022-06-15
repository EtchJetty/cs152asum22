var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

const layouts = require("express-ejs-layouts");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
const axios = require("axios");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
app.use(connectLiveReload());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(layouts);
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/simpleform", (req, res, next) => {
  res.locals.active = " simpleform";
  res.render("simpleform");
});

app.post("/simpleform", (req, res, next) => {
  // res.json(req.body);
  const {username, age, height} = req.body;

  res.locals.username = username;
  res.locals.age = age;
  res.locals.ageInDays = age * 365;
  res.locals.height = height;
  res.locals.heightCm = height * 2.54;
  res.locals.version = "1.0.2";
  res.locals.active = " simpleform";
  res.render("simpleformresult");
});

app.get("/bmi", (req, res, next) => {
  res.locals.active = " bmi";
  res.render("bmi");
});

app.post("/bmi", (req, res, next) => {
  // res.json(req.body);
  const {weight, height} = req.body;
  res.locals.height = height;
  res.locals.weight = weight;
  res.locals.bmi = weight / (height ** 2 * 703);
  res.locals.active = " bmi";
  res.render("bmiresult");
});

app.get("/dist", (req, res, next) => {
  res.locals.active = " dist";
  res.render("dist");
});

app.post("/dist", (req, res, next) => {
  // res.json(req.body);
  const {coordx, coordy, coordz} = req.body;
  res.locals.coordx = coordx;
  res.locals.coordy = coordy;
  res.locals.coordz = coordz;
  res.locals.resulted = Math.sqrt(coordx * coordx + coordy * coordy + coordz * coordz);
  res.locals.active = " dist";
  res.render("distresult");
});

const family = [
  {name: "Tim", age: 66},
  {name: "Caitlin", age: 27},
  {name: "Ryan", age: 23},
];

app.get('/showFamily',
  (req,res,next) => {
    res.locals.family = family;
    res.render('showFamily');
  })

app.get('/apidemo/:email',
  async (req,res,next) => {
    const email = req.params.email;
    const response = await axios.get('https://www.cs.brandeis.edu/~tim/cs103aSpr22/courses20-21.json')
    console.dir(response.data.length)
    res.locals.courses = response.data.filter((c) => c.instructor[2]==email+"@brandeis.edu")
    res.render('showCourses')
    //res.json(response.data.slice(100,105));
  })

app.get('/githubInfo/:githubId',
  async (req,res,next) => {
    const id = req.params.githubId;
    const response = await axios.get('https://api.github.com/users/'+id+'/repos')
    console.dir(response.data.length)
    res.locals.repos = response.data
    res.render('showRepos')
    //res.json(response.data.slice(100,105));
  })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.active = " error";

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
