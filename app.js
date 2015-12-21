
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var path = require("path");
var jade = require("jade");
var app = module.exports = express.createServer();

//在这个目录下去找静态资源
app.set('views',  './views/pages');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, "bower_components")));
//app.use(app.router);

// Configuration
// app.configure(function(){
//   //设置view的默认路径
//   app.set('views', __dirname + '/views/pages');
//   app.set('view engine', 'jade');
//   //表单数据格式化
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(express.static(__dirname + '/public'));
// });


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

//app.get('/', routes.index);

//app.get("/movie/pages/:id", routes.detail);

app.get("/", function(req, res){
  // res.render("index", {
  //   title:"index",
  //   movies:[{
  //     title:"火星救援",
  //     _id:"1",
  //     poster:"www.fdsafafsafwerew"
  //   },{
  //     title:"火星救援",
  //     _id:"2",
  //     poster:"www.fdsafafsafwerew"
  //   },{
  //     title:"火星救援",
  //     _id:"3",
  //     poster:"www.fdsafafsafwerew"
  //   },{
  //     title:"火星救援",
  //     _id:"4",
  //     poster:"www.fdsafafsafwerew"
  //   },{
  //     title:"火星救援",
  //     _id:"5",
  //     poster:"www.fdsafafsafwerew"
  //   },{
  //     title:"火星救援",
  //     _id:"6",
  //     poster:"www.fdsafafsafwerew"
  //   },{
  //     title:"火星救援",
  //     _id:"7",
  //     poster:"www.fdsafafsafwerew"
  //   },{
  //     title:"火星救援",
  //     _id:"8",
  //     poster:"www.fdsafafsafwerew"
  //   }]
  // });
});

app.get("/movie/:id", function(req, res){
  res.render("detail",{
    title:"detail",
    movie:{
      doctor:"冯小刚",
      country:"美国",
      title:"火星救援",
      year:"2015",
      poster:"www.fasfwergv",
      language:"英语",
      flash:"http://player.youku.com/player.php/sid/XNJAINjc0NTUy/v.swf",
      summary:"火星探索，jack意外被一个人留在火星，在等待救援的时候，一个人在火星上生活"
    }
  });
});

app.get("/admin/movie", function(req, res){
  res.render("admin",{
    title:"admin",
    movie:{
      title:"",
      doctor:"",
      country:"",
      year:"",
      poster:"",
      flash:"",
      summary:"",
      language:""
    }
  });
});

app.get("/admin/list", function(req, res){
  res.render("list",{
    title:"",
    movie:[{
      doctor:"冯小刚",
      _id:1,
      country:"美国",
      title:"火星救援",
      year:"2015",
      poster:"www.fasfwergv",
      language:"英语",
      flash:"http://player.youku.com/player.php/sid/XNJAINjc0NTUy/v.swf",
      summary:"火星探索，jack意外被一个人留在火星，在等待救援的时候，一个人在火星上生活"
    }]
  });
});


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


// var express =require("express");
// var port = process.env.PORT || 3000;
// var app = express.createServer();

// app.set("views", "./views");
// app.set("view engine", "jade");
// app.listen(port);
// console.log("imooc start on port " + port);