//引入mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
//建造schema
var Movieschema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	category: {
                    type: ObjectId,
                    ref: "Category"
               },
	pv:{
                    type: Number,
                    default: 0
	},
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
      .exec(cb);
  },
  findById: function (id, cb){
    return this
      .findOne({_id: id})
      .exec(cb);
  }
}

module.exports = Movieschema;