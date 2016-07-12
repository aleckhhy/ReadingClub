var mongoose = require('mongoose');

//var dbURI = 'mongodb://localhost/RClub';
var dbURI='mongodb://aleckhao:mlab2016@ds025379.mlab.com:25379/aleckdb'
mongoose.connect(dbURI);

//连接事件
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// 当应用重启或终止的时候 关闭连接
Shutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// nodemon 重启 
process.once('SIGUSR2', function () {
    Shutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// 应用终止
process.on('SIGINT', function () {
    Shutdown('app termination', function () {
        process.exit(0);
    });
});


// For Heroku app termination
//process.on('SIGTERM', function () {
//    gracefulShutdown('Heroku app shutdown', function () {
//        process.exit(0);
//    });
//});

require('./books.js');