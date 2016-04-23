//引入mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
//建造schema
var CommentSchema = new Schema({
	//建立关联数据的索引
	movie:{type:ObjectId, ref:"Movie"},
	from:{type:ObjectId, ref:"User"},
	content: String,
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

CommentSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
      else {
        this.meta.updateAt = Date.now();
      }
      next();
});

CommentSchema.statics = {
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

module.exports = CommentSchema;