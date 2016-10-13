var express = require('express'),
	User = require('../models/user.js'),
   	router = express.Router();

// 注册页路由
router.get("/reg",function(req,res) {
	res.render("reg",{
		title : "用户注册"
	});
});

router.post("/user/reg",function(req,res) {
	var _user = req.body.user;
	var name = _user.name;

	User.findByName(name, function(err, user)  {
		if(err){
			console.log(err);
		}

		if(!user){
			var user = new User(_user);
			
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				console.log(user);
				res.redirect('/login');
			});
		} else {
			console.log('已经注册过');
			return res.redirect('/reg');	
		}
	});
});

// 登录页路由
router.get("/login",function(req,res) {
	res.render("login",{
		title:"用户登入",
	});
});

router.post("/login",function(req,res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findByName(name,function(err,user){
		if(err){console.log(err);}

		if(!user){
			return res.redirect('/reg');
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){console.log(err)}
			if(isMatch){
				req.session.user = user;
				return res.redirect('/diary');
			} else {
				console.log('Password is not matched')
				return res.redirect('/login');
			}
		});
	});
});

// 登出页路由
router.get("/logout",checkLogin);
router.get("/logout",function(req,res) {
	req.session.user = null;
	res.redirect('/');
});

function checkLogin(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next) {
	if (req.session.user) {
		return res.redirect('/');
	}
	next();
}
module.exports = router;
