
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require("path");
var jade = require("jade");
var app = module.exports = express.createServer();
var _ = require("underscore");

//在这个目录下去找静态资源
app.set('views',  './views/pages');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.locals.moment = require("moment");

// Configuration
app.configure(function(){
  //设置view的默认路径
  app.set('views', __dirname + '/views/pages');
  app.set('view engine', 'jade');
  //表单数据格式化
  app.use(express.bodyParser());
  app.use(express.methodOverride());
//设置静态资源的默认地址
  app.use(express.static(path.join(__dirname, "public")));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var mongoose = require("mongoose");

//连接数据库，使用mongoose时， mongodb 中不需要建立数据库，当你需要连接的数据库不存在时，会自动创建一个出来。
mongoose.connect("mongodb://localhost/movie");
var Movie =require("./models/movie");

app.get("/", function(req, res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log("index error:"+err);
    }

    res.render("index", {
      title:"index 首页",
      layout:false,
      movies: movies
    });
  });
});

app.get("/admin/movie", function(req, res){
  res.render("admin",{
    title:"admin",
    layout:false,
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

//admin从列表页点击更新时将数据填入表单中的跳转路由update
app.get("/admin/update/:id", function(req, res){
  var id = req.params.id;
  if(id){
    Movie.findById(id, function(err, movie){
      res.render("admin", {
        layout:false,
        title:"后台更新页面",
        movie: movie
      });
    });
  }
});

// 创建或修改一部新电影
app.post("/admin/movie/new", function(req, res){

  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  console.log("创建页req.body._id: "+id);

  //如果该电影存在
  if( id != ""){
    console.log("该电影存在");
    Movie.findById(id, function(err, movie){
      if(err){
        console.log(err);
      }
//用另外的对象里面的字段替换调原来的字段
//.extend(原来的对象，新post的对象)
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie){
        if(err){
          console.log(err);
        }
      });
    });
  }

  //如果该电影不存在，创建一部新电影存入数据库
  else{

    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })

    _movie.save(function(err, movie){
        if(err){
          console.log(err);
        }
        //跳转到详情页
         res.redirect("/movie/" + movie._id);
      });
  }
})

//详情页
app.get("/movie/:id", function(req, res){
  var id = req.params.id;

  Movie.findById(id, function(err, movie){
    if(err){
      console.log(err);
    }

    res.render("detail",{
      title:"detail" + movie.title,
      layout:false,
      movie: movie
    });

  });
});

//列表页
app.get("/admin/list", function(req, res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }

    res.render("list", {
      title:"电影列表页",
      layout:false,
      movies: movies
    });

  });
});

app.delete("/admin/list", function(req, res){
  var id = req.query.id;
  console.log("delete id:", id);

  if(id){
    Movie.remove({_id: id}, function(err, movie){
      if (err){
        console.log(err);
      }
      else{
        res.json({success:1});
      }
    })
  }
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

