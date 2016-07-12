var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');

require('./app_api/models/db.js');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'jade');
//设置路由忽略大小写，更多的设置可以参考官方文档：http://www.expressjs.com.cn/4x/api.html#app.settings.table
app.set('case sensitive routing', true)

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));//日志，在开发环境下用彩色输出响应状态，会显示请求方式，响应时间和大小。
app.use(bodyParser.json());//解析json请求。
app.use(bodyParser.urlencoded({ extended: false }));//解析form请求（含有key-value键值对），false表示value的类型是string或array，为true表示任意类型。
app.use(cookieParser());//解析cookie
app.use(require('stylus').middleware(path.join(__dirname, 'public')));//使用stylus做css预编译，并指定路径。
app.use(express.static(path.join(__dirname, 'public')));//静态文件路径

app.use('/', routes);
app.use('/api', routesApi);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
