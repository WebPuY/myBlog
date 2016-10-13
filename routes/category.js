var express = require('express'),
	Category = require('../models/category'),
	_ = require('underscore'),
	router = express.Router();


//电影后台分类录入页路由
router.get("/admin/category",function(req,res) {
	var user = req.session.user;
	console.log(user);
	// if(!user){
	// 	return res.redirect('/login');
	// }
	// if(user.role > 0){
		res.render("category_admin",{
			title : "后台分类录入页",
            category:{},
			user : user
		});	
	// } else {
	// 	console.log('权限不足');
	// }
});

//后台录入的数据路由
router.post('/admin/category/new',function(req,res){
	// console.log(req.body.category);
	var _category = req.body.category;

    var category = new Category(_category);

    category.save(function(err,category){
        if(err){
            console.log(err)
        }
        res.redirect('/admin/category/list')
    })
})

//电影分类列表页路由
router.get("/admin/category/list",function(req,res) {
	var user = req.session.user;
	console.log(user);
	if(!user){
		return res.redirect('/login');
	}
	if(user.role >= 0){
		Category.fetch(function(err,categories){
			if(err){
				console.log(err);
			}
			res.render("categorylist",{
				title : "电影分类列表",
				categories:categories,
				user : user
			});		
		});	
	} 
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
