var mongoose = require("mongoose");

var Movieschema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date,
			default: Date.now()
		}
	}
});

Movieschema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
      else {
        this.meta.updateAt = Date.now();
      }
      next();
});

Movieschema.statics = {
  fetch: function (cb){
    return this
      .find({})
      .sort("meta.updateAt")
      .exec(cb);
  },
  findById: function (id, cb){
    return this
      .findOne({_id: id})
      .exec(cb);
  }
}

module.exports = Movieschema;