const express = require('express');
const app = express();
const db = require('./db');
const morgan = require('morgan');
const fs   = require('fs');
const configs = require('./config');

// routes
const course = require('./routes/course');
const courseChapter = require('./routes/courseChapter');
const courseLecture = require('./routes/courseLecture');
const courseQuiz = require('./routes/courseQuiz');
const user = require('./routes/user');
const auth = require('./auth/AuthController');

global.__root   = __dirname + '/'; 

const morganLogFullFileName = getMorganLoggerFileName();
const accessLogStream       = fs.createWriteStream(morganLogFullFileName, {flags: 'a'});
app.use(morgan('{"remoteAddr":":remote-addr","remoteUser":":remote-user","date":":date","method":":method","url":":url","httpVersion":":http-version","status":":status","resp_cont_len":":res[content-length]","referrer":":referrer","user_agent":":user-agent","response_time":":response-time"}', {stream: accessLogStream}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// route bindings
app.use('/api/users', user);
app.use('/api/auth', auth);
app.use('/api/course',course);
app.use('/api/crs_chapters',courseChapter);
app.use('/api/crs_quiz',courseQuiz);
app.use('/api/crs_lecture',courseLecture);

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

function getMorganLoggerFileName(){
  var morganLogDirectory= configs.MORGAN_LOG_DIRECTORY;
  var current_date      = new Date();
  var file_date_ext     = current_date.getFullYear()+'_'+(current_date.getMonth()+1)+'_'+current_date.getDate();
  var fullFileName      = morganLogDirectory + '/access-'+file_date_ext+'.log';
  return fullFileName;
}


module.exports = app;

