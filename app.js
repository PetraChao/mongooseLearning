
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require("path");
var jade = require("jade");
var express = require("express");
var app = express();
var _ = require("underscore");
//在这个目录下去找静态资源
app.set('views',  './views/pages');
app.set('view engine', 'jade');
var multipart = require('connect-multiparty');

//表单数据格式化，将post提交过来的body内容初始化成一个对象
//app.use(express.bodyParser())
app.use(express.json());
app.use(express.urlencoded());
app.use(multipart());

app.locals.moment = require("moment");

// Configuration
app.configure(function(){
  //设置view的默认路径
  app.set('views', __dirname + '/views/pages');
  app.set('view engine', 'jade');

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
  var dbUrl = "mongodb://localhost/movie";
//连接数据库，使用mongoose时， mongodb 中不需要建立数据库，当你需要连接的数据库不存在时，会自动创建一个出来。
mongoose.connect(dbUrl);
//cookieParser能够使req.cookies通过cookieParser读取客户端设置的cookie值，通过res.cookie(name, value [, options])对cookie进行设置，对cookie值进行解析等。
app.use(express.cookieParser());
//初始化数据库
var mongoStore = require("connect-mongo")(express);

//session存储会话信息，存入mongoStore中。此时若为第一次创建session则根据客户端的connect.sid生成sessionid保存在req.sessionId中，并将session对象存储在数据库中。
app.use(express.session({
    secret:"pc movie",
    store: new mongoStore({
        url: dbUrl,
        collection: "sessions"
    })
}));

//引用数据库对象
var Movie =require("./models/movie");
var User = require("./models/user");
var Comment = require("./models/comment");
//pre handle user,预处理所有的页面，如用户已经登录过，从session中取值赋值给本地变量
app.use(function(req, res, next){
  //调用req.session时，cookieParse将connect.sid解析成sessionid,通过sessionid从数据库中查找相应的session值
    if(req.session.user){
      //将session中的值赋值给本地变量
        app.locals.user = req.session.user;
    }
    next();
});
app.get("/", function(req, res){

  Movie.fetch(function(err, movies){
    if(err){
      console.log("index error:"+err);
    }

    res.render("index", {
      title:"pc电影网",
      layout:false,
      movies: movies
    });
  });
});

app.get("/admin/movie", function(req, res){
  res.render("admin",{
    title:"电影录入",
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
  console.log("req.body", req.body);
  if(req.query){
    var movie = JSON.parse(req.query.movieObjString);
    res.render("admin", {
        layout:false,
        title:"修改页面",
        movie: movie
      });
  }
  if(id){
    Movie.findById(id, function(err, movie){
      res.render("admin", {
        layout:false,
        title:"修改页面",
        movie: movie
      });
    });
  }
});

// 创建或修改一部新电影
app.post("/admin/movie/new", function(req, res){
  console.log(req.body);
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;

  //id不为空，则为电影修改，id由td: a(href="../admin/update/#{item._id}") 修改
  //传入给admin页面，由var id = req.body.movie._id;取出将包含movie._id的movie对象从数据库取出
  //通过 req.body.movie._id将发送请求页面的movie取出来 
  
  //修改电影
  if( id != ""){
    console.log("id不为空");
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
        
        //跳转xiugaic
         res.redirect("/movie/update-successfully");
      });

    });
  }
  //如果id不存在，在电影名字相同的情况下进入创建页面，如果不存在创建一部新电影存入数据库
  else{
    var movieTitle = movieObj.title;
    //根据电影名，查询是否存在该电影
    Movie.findOne({'title':movieTitle}, function(err, movie){
      //如果电影存在
      if(movie != null ){
        id = movie._id;
        var movieObjString = encodeURI(JSON.stringify(movieObj));
        console.log(movieObjString);
        res.redirect("/movie/update-page/" + id +"?movieObjString="+movieObjString);
      }
      else{
            //创建新电影
          _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
          });

          //将movie对象存入时，因为mongodb是分布式的，所以就没设计成关系数据库那样自增的主键,,会自动给每一条数据生成一个id
          _movie.save(function(err, movie){
              if(err){
                console.log(err);
              }
              console.log("创建页save movie._id"+movie._id);
              //录入成功
              res.redirect("/movie/new/success/"+ movie._id);
            });
      }
    });

  }
});

// 电影名已经存在，跳转到电影修改页面
app.get("/movie/update-page/:id", function(req, res){
  console.log("电影已经存在页");
  //通过表单传递过来的值
  var movieObjString = req.query.movieObjString;
  console.log(req.query);
  res.render("update-page",{
    layout:false,
    movieId:req.params.id,
    movieObjString:movieObjString
  });

});

// 录入成功页
app.get("/movie/new/success/:id", function(req, res){
  console.log("录入成功页req.params.id："+req.params.id);

  res.render("movie-entry-successfully",{
    layout:false,
    movieId:req.params.id
  });

});

//电影修改成功页
app.get("/movie/update-successfully", function(req, res){
  console.log("电影修改成功页req.params.id："+req.params.id);

  res.render("update-successfully",{
    layout:false,
    movieId:req.params.id
  });

});

//signup用户注册页面
//express.bodyParser()将views/includes/header.jade中form表单提交过来的body内容初始化成一个对象
//直接通过 req.body取得对象值，用“.”的方式取得对象属性值user，属性值在form表单的name中设定的
app.post('/user/signup', function(req,res){
  var _user = req.body.user;
  User.find({name: _user.name}, function(err, user){
    if(err){
      console.log(err);
    }
    if(user.length){
      console.log("user repeat");
      return res.redirect("/signin");
    }
    else{
      var user = new User(_user);
        user.save(function(err, user){
        if(err){
          console.log(err);
        }
        res.redirect("/");
      });
    }
  });
});
//signin page
app.get("/signin", function(req, res){
  res.render("signin", {
    title: "登录页面"
  });
});

//signup page
app.get("/signup", function(req, res){
  res.render("signup", {
    title: "注册页面"
  });
});

//signin
app.post("/user/signin", function(req, res){
    //由header.jade表单 form(method="POST", action="/user/signin")提交而来
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name:name}, function(err, user){
        if(err){
            console.log(err);
        }
        if(!user){
            console.log("用户不存在");
           return  res.redirect("/signup");
        }
        user.comparePassword(password, function(err, isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                console.log("登录成功");
                req.session.user = user;
                return res.redirect("/");
            }
            else{
                console.log("密码不正确");
                return res.redirect("/signin");
            }
        });
    });
});

//logout
app.get("/logout", function(req, res){
    delete req.session.user;
    delete app.locals.user;
    res.redirect("/");
});
//详情页
app.get("/movie/:id", function(req, res){
  var id = req.params.id;
  Movie.findById(id, function(err, movie){
    if(err){
      console.log(err);
    }
    //通过populate方法查询关联表，其中用comment的from字段作为id查询，返回关联user表name属性值
    Comment
    .find({movie: id})
    .populate("from", "name")
    .exec(function(err, comments){
        if(err){
          console.log(err);
        }
        res.render("detail",{
            title:movie.title,
            layout:false,
            movie: movie,
            comments: comments
        });
    });
  });
});


//用户列表页面
app.get("/admin/userlist", function(req, res){
  User.fetch(function(err, users){
    if(err){
      console.log(err);
    }

  res.render("userlist", {
    title:"用户列表页",
    layout:false,
    users:users
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

//提交评论
app.post('/user/comment', function(req,res){
  var _comment = req.body.comment;

  console.log("_comment:", _comment);

  var movieId = _comment.movie;

  var comment = new Comment(_comment);

      console.log("comment:", comment);
   comment.save(function(err, comment){
      if(err){
        console.log("comment error 评论去", err);
      }
      res.redirect("/movie/"+ movieId);
    });
});

app.listen(3000, function(){
  console.log("Express server listening on port 3000");
});