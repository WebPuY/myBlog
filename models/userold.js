var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.role = user.role;
}

module.exports = User;

User.prototype.save = function save(callback){
	//存入MongoDB的文档
	var user = {
		name:this.name,
		password:this.password,
		role:this.role
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取user集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//为 name 属性添加索引
			collection.insert(user,{safe:true},function(err,user){
				mongodb.close();
				console.log(12121);
				callback(err,user);
			});
		});
	});
}

User.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 查找 name 属性为 username 的文档
			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
				if (doc) {
				// 封装文档为 User 对象
					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};

