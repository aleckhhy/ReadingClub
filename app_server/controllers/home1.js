//var db = require('../models/db.js');
//var mongoose = require('mongoose');
var request = require('request');


var apiOptions = {
    server : "http://localhost:3000"
};


function info(res, status) {
    var title, content;
    if (status === 404) {
        title = "404, 页面没有找到";
        content = "亲，页面飞走了...";
    } else if (status === 500) {
        title = "500, 内部错误";
        content = "尴尬...，发生错误";
    } else {
        title = status + ", 有什么不对劲";
        content = "某些地方可能有些错误";
    }
    res.status(status);
    res.render('info', {
        title : title,
        content : content,
        status: status,
    });
};

//var Bookmodel = mongoose.model('Book');
//var Topicmodel = mongoose.model('Topic');

//module.exports.init = function (req, res) {
//    mongoose.model('Book').find().exec(function (err, objs) {
//        //if (err) {
//        //    res.render('error', {
//        //        message: err.message,
//        //        error: err
//        //    });
//        //    return;
//        //}
//        //if (objs.length) {
            
//            for (var i = 0; i < books.length; i++) {
//                var taget = new Bookmodel(books[i]);//创建一个模型
//                taget.save(function (err) {//保存。
//                    console.log(err);
//                });
//            }
            
//            for (var i = 0; i < topics.length; i++) {
//                var taget = new Topicmodel(topics[i]);
//                console.log('topic create');
//                taget.save(function (err) {
//                    console.log(err);
//                });
//            }
//            res.send('初始化完成...');
//        //}
        
//        res.render('info', { title: '添加完成'});
//        //res.render('books', { title: 'Books', topics: objs });
//    });
//    };


//module.exports.index = function (req, res) { 
//    res.render('index', { title: 'Index', topics: topics});
//};

module.exports.index = function (req, res) {
    var requestOptions, path;
    path = "/api/topics";
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
    }
    request(requestOptions, function (err, response, body) {
        if (response.statusCode == 200) {
            res.render('index', { title: 'Index', topics: body });
        } else { 
            res.render('error', { message: err.message, error: err });
        }

    });
};

//module.exports.books = function (req, res) {
//    //res.render('books', { title: 'Books' });
//    res.render('books', { title: 'Books', books: books });
//};

module.exports.bookcreateview = function (req, res) {
    res.render('bookCreate', { title: '新增推荐图书' });
};

module.exports.doBookCreate = function (req, res) {
    var requestOptions, path, postdata;
    path = "/api/book";
    postdata = {
        title: req.body.title,
        info: req.body.info,
        ISBN: req.body.ISBN,
        brief: req.body.brief,
        tags: req.body.tags,
        img: req.body.img,
        rating: req.body.rating,
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata,
    };
    request(requestOptions, function (err, response, body) {
        console.log("body.name", body.name, response.statusCode);
        if (response.statusCode == 201) {
            res.redirect("/detail/" + body._id);
        } 
        else if (response.statusCode == 400 && body.name && body.name == "ValidationError") {
            res.render('bookCreate', { title: '新增推荐图书', error: "val" });
        }
        else {
            console.log("body.name", body.name);
            info(res, response.statusCode);
        }
    });
};

module.exports.books = function (req, res) {
    var requestOptions, path;
    path = "/api/books";
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
    }
    request(requestOptions, function (err, response, body) {
        if (response.statusCode == 200) {
            res.render('books', { title: 'Books', books: body });
        } else {
            res.render('error', { message: err.message, error: err });
        }
    });
};



module.exports.detail = function (req, res) {
    var requestOptions, path;
    path = "/api/book/" + req.params.id;
    requestOptions = {
        url: apiOptions.server + path ,
        method: "GET",
        json: {},
    }
    request(requestOptions, function (err, response, body) {
        if (response.statusCode == 200) {
            res.render('detail', { title: body.title, book: body });
        } else {
            res.render('info', err);
        }
    });
   
};

module.exports.delete = function (req, res) {
    var requestOptions, path;
    path = "/api/book/" + req.params.id;
    requestOptions = {
        url: apiOptions.server + path,
        method: "delete",
        json: {},
    };
    request(requestOptions, function (err, response, body) {
        if (response.statusCode == 204) {
            res.json(1);
        } 
        else {
            res.json(0);
        }
    });
};

module.exports.about = function (req, res) {
    res.render('about', { title: 'About' });
};


var fs = require('fs');
var formidable = require('formidable');
module.exports.uploadImg = function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = './../public/upload/temp/';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 3 * 1024 * 1024;   //文件大小
    
    form.parse(req, function (err, fields, files) {
        console.log(files);
        if (err) {
            console.log(err);
            return res.json(0);
        }
        for (var key in files) {
            console.log(files[key].path);
            var extName = ''; //后缀名
            switch (key.type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                case 'image/x-png':
                default:
                    extName = 'png';
                    break;
            }
            var avatarName = (new Date()).getTime() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            
            fs.renameSync(files[key].path, newPath); //重命名
            return res.json("/upload/temp/" + avatarName);
        }
    });
 
};

//module.exports.info = function (req, res) {
//    res.render('info', { title: '完成' });
//};



//var books = [
//    {
//        id: 0,
//        title: "深入浅出Node.js",
//        info: "朴灵 / 人民邮电出版社 / 2013-12-1 / CNY 69.00",
//        rating: 5,
//        img: "https://img3.doubanio.com/mpic/s27269296.jpg",
//        tags: ["node", "深入浅出"],
//        brief: '本书从不同的视角介绍了 Node 内在的特点和结构。由首章Node 介绍为索引，涉及Node 的各个方面，主要内容包含模块机制的揭示、异步I/O 实现原理的展现、异步编程的探讨、内存控制的介绍、二进制数据Buffer 的细节、Node 中的网络编程基础、Node 中的Web 开发、进程间的消息传递、Node 测试以及通过Node 构建产品需要的注意事项。最后的附录介绍了Node 的安装、调试、编码规范和NPM 仓库等事宜。本书适合想深入了解 Node 的人员阅读。'
//        ,ISBN: 9787115335500
//    },
//    {
//        id: 1,
//        title: "程序员修炼之道 : 从小工到专家",
//        info: "Andrew Hunt、David Thomas / 马维达 / 电子工业出版社 / 2005-1 / 48.00元",
//        rating: 5,
//        img: "https://img3.doubanio.com/mpic/s3957863.jpg",
//        tags: ["程序人生", "软件开发"],
//        brief: '《程序员修炼之道》由一系列的独立的部分组成，涵盖的主题从个人责任、职业发展，直到用于使代码保持灵活、并且易于改编和复用的各种架构技术。利用许多富有娱乐性的奇闻轶事、有思想性的例子以及有趣的类比，全面阐释了软件开发的许多不同方面的最佳实践和重大陷阱。无论你是初学者，是有经验的程序员，还是软件项目经理，本书都适合你阅读。'
//        ,ISBN: 9787505397194
//    },
//    {
//        id: 2,
//        title: "Getting MEAN with Mongo, Express, Angular, and Node",
//        info: "Simon Holmes / Manning Publications / 2015-11-26 / USD 44.99",
//        rating: 4,
//        img: "https://img3.doubanio.com/mpic/s27676844.jpg",
//        tags: ["node", "web开发", "编程"],
//        brief: 'MEAN栈开发,比较详尽的的应用开发书籍'
//        , ISBN: 9781617292033
//    }
//];


//var topics = [
//    {
//        title: "书山有路第十一期：程序员修炼之道-第二章-注重实效的途径--第五天",
//        type: "读书",
//        visitedCount: 80,
//        commentCount: 2,
//        createdOn: '2016/5/15 21:32',
//        author: 'stoneniqiu',
//        img: 'http://upload.jianshu.io/users/upload_avatars/133630/d5370e672fd4.png?imageMogr/thumbnail/90x90/quality/100'
//    },
//    {
//        title: "《明朝那些事儿》之闲言散语",
//        type: "书评",
//        visitedCount: 180,
//        commentCount: 20,
//        createdOn: '2016/5/15 21:32',
//        author: '卡卡卡萨布兰卡 ',
//        img: 'http://upload.jianshu.io/users/upload_avatars/1675188/2d0810ccc03d.jpg?imageMogr/thumbnail/90x90/quality/100'
//    },
//    {
//        title: "有《程序员修炼之道》高清版吗？",
//        type: "求书",
//        visitedCount: 90,
//        commentCount: 1,
//        createdOn: '2016/5/15 21:32',
//        author: '吾不知 ',
//        img: 'http://upload.jianshu.io/users/upload_avatars/1125491/3910f3825f73.jpg?imageMogr/thumbnail/90x90/quality/100',
//    },
//    {
//        title: "《国富论》-读书笔记",
//        type: "书评",
//        visitedCount: 180,
//        commentCount: 20,
//        createdOn: '2016/5/15 21:32',
//        author: '寻海 '
//        ,img: 'http://upload.jianshu.io/users/upload_avatars/133630/d5370e672fd4.png?imageMogr/thumbnail/90x90/quality/100'
//    },
//    {
//        title: "《高效人士的七个习惯》读书笔记",
//        type: "书评",
//        visitedCount: 180,
//        commentCount: 20,
//        createdOn: '2016/5/15 21:32',
//        author: '书虫纪庆 ',
//        img: 'http://upload.jianshu.io/users/upload_avatars/1429280/454c495361f9.jpg?imageMogr/thumbnail/90x90/quality/100'
//    },
//    {
//        title: "《css揭秘》这本书如何",
//        type: "求索",
//        visitedCount: 58,
//        commentCount: 3,
//        createdOn: '2016/5/15 21:32',
//        author: 'Watery_D_Lotus ',
//        img: 'http://upload.jianshu.io/users/upload_avatars/1449533/a2d98762484a.jpg?imageMogr/thumbnail/90x90/quality/100'
//    }
//];


//res.render('books', { title: 'Books', books: books });