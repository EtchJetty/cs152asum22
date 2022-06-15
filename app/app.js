var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts)
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/showFamily", (req, res, next) => {
  res.locals.family = family;
  res.render("showFamily");
});

app.get("/apidemo/:email", async (req, res, next) => {
  const email = req.params.email;
  const response = await axios.get("https://www.cs.brandeis.edu/~tim/cs103aSpr22/courses20-21.json");
  console.dir(response.data.length);
  res.locals.courses = response.data.filter((c) => c.instructor[2] == email + "@brandeis.edu");
  res.locals.active = " apidemo";
  res.render("showCourses");
  //res.json(response.data.slice(100,105));
});

app.get("/githubInfo", async (req, res, next) => {
  const response = await axios.get("https://api.github.com/users/etchjetty/repos");
  console.dir(response.data.length);
  res.locals.repos = response.data;
  res.locals.active = " githubInfo";
  res.render("showRepos");
  //res.json(response.data.slice(100,105));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
