var express = require('express');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/'; 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

var CourseController = require(__root + 'course/CourseController');
app.use('/api/course',CourseController);

var CourseChapterController = require(__root + 'course/courseChapterController');
app.use('/api/crs_chapters',CourseChapterController);

var CourseQuizController = require(__root + 'course/courseQuizController');
app.use('/api/crs_quiz',CourseQuizController);

var courseLectureController = require(__root + 'course/courseLectureController');
app.use('/api/crs_lecture',courseLectureController);

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
});

module.exports = app;

