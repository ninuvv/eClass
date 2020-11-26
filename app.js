var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');


var db=require('./config/connection')


var indexRouter = require('./routes/index');
var studentRouter = require('./routes/users');
var tutorRouter = require('./routes/tutor');

var exphbs = require('express-handlebars');
const { dirname } = require('path');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



//set templete engine
app.engine('hbs', exphbs({
  defaultLayout: 'layout',layoutsDir:__dirname+'/views/layout/',
  partialsDir:__dirname+'/views/Partial/',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');


//session (install npm i express-session)
app.use(session({secret:"key",cookie:{maxAge:600000}}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static('public'));
app.use(express.static('public/images')); 
 
//db connection
db.Connection((err)=>{
  if (err) console.log("connection error"+err);
  else console.log("DB connected to localhost:27017");
  })


app.use('/', indexRouter);
app.use('/student', studentRouter);
app.use('/tutor', tutorRouter);

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
