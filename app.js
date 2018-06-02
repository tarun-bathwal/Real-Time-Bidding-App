var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var index = require('./routes/index');
var users = require('./routes/users');
var checkAuth=require('./middlewares/check-auth');

var CronJob = require('cron').CronJob;


  

var app = express();


var io = socket_io();
//io.set('transports', ['websocket']);
app.io = io;
var flag=0;

new CronJob('* * 1 * * *', function(){
  if(flag==0)
    require('./socket')(app);
  flag=1;
 },null,true);




app.get('/', function (req, res) {
  
  // res.sendFile(__dirname + '/frontend/home.html');
    res.render('home');
  
});

//db connection
var db=require('./config/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use('/storage/product_images',express.static('storage/product_images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'libs')));

//CORS protection (Cross origin request serve)
app.use(function (req,res,next) {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Origin','Origin, X-Requested-With, Content_Type,Accept,Authorization');

    if(req.method==='OPTIONS'){
        req.header('Access-Control-Allow-Origin', 'PUT,POST,PATCH,GET,DELETE');
        return res.status(200).json({});
    }
    'use strict';
    req.io=io;
    next();
});

//Routes middleware
app.use('/', index);
app.use('/', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
