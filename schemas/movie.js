//这个文件用来定义数据库字段和操作 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	downloadurl:String,
	year: String,
	category: {type:ObjectId,ref:'Category'},
	meta: {
		createAt: {
			type:Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

MovieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

MovieSchema.statics = {
	fetch: function(cb){
		return this
		.find({})
		.sort('meta.createAt')
		.exec(cb)
	},
	findById: function(id,cb){
		return this
		.findOne({_id: id})
		.exec(cb)
	}
};

module.exports = MovieSchema