var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  name: {
    //设定name是唯一的
    unique: true,
    type: String
  },
  password: String,
  // 0: nomal user 普通用户
  // 1: verified user 通过验证的用户
  // 2: professonal user 完整用户
  // >10: admin 管理员
  // >50: super admin 超级管理员
  role: {
    type: Number, 
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.pre('save', function(next) {
  
  //将当前的module赋值给user
  var user = this

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  //加密处理
//生成一个随机的盐，SALT_WORK_FACTOR为计算强度
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)
      //加盐后的生成相应加盐的hash值，保存到user.password中
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    //在app.js中UserSchema的实例对象
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema