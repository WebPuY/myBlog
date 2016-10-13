// 引入需要的模块
var express = require('express'),
 	router = express.Router(),
 	crypto = require('crypto'),
 	mongoose = require('mongoose'),
 	_ = require('underscore'),
 	Movie = require('../models/movie'),
 	Post = require("../models/post"),
 	Diary = require('../models/diary'),
 	User = require('../models/user'),
 	Comment = require('../models/comment');


 // mongoose连接本地数据库
 mongoose.connect('mongodb://localhost/microblog');	



// 主页路由
router.get('/', function(req, res) {
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		res.render('index', {
			title: '闫璞',
			posts: posts,
			user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
		});
	});
});

// 发言路由
router.post("/post",checkLogin);
router.post("/post",function(req,res) {
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.post);
	post.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		// req.flash('success', '发表成功');
		res.redirect('/u/' + currentUser.name);
	});
});

router.get("/u/:user",function(req,res) {
	User.get(req.params.user, function(err, user) {
		if (!user) {
			// req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.get(user.name, function(err, posts) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('user', {
				title: user.name,
				posts: posts,
				user : req.session.user
			});
		});
	});
});

function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '未登入');
		return res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已登入');
		return res.redirect('/');
	}
	next();
}

module.exports = router;
