var express = require('express'),
	Movie = require('../models/movie'),
	Category = require('../models/category'),
	_ = require('underscore'),
	router = express.Router();

//推荐页路由
router.get("/reco",checkLogin);
router.get("/reco",function(req,res) {
	Category
		.find({})
		.populate({path:'movies',options:{limit:5}})
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}
			res.render("reco",{
				title : "推荐",
				categories : categories,
				user : req.session.user
			});	
		});
});

//推荐详情页路由
router.get("/movie/:id",function(req,res) {
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		res.render("moviedetail",{
			title: "详情",
			movie:movie,
			user: req.session.user
		});	
	});
});

//电影后台录入页路由
router.get("/admin/movie",function(req,res) {
	var user = req.session.user;
	if(!user){
		return res.redirect('/login');
	}
	if(user.role > 0){
		Category.find({},function(err,categories){

			res.render("movieadmin",{
				title : "录入",
				categories:categories,
				movie:{},
				user : user
			});	
		});
	} else {
		console.log('权限不足');
	}
});

// 后台更新页路由
router.post('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title: '后台更新页',
				movie: movie
			});
		});
	}
});

//后台录入的数据路由
router.post('/admin/movie/new',function(req,res){
	console.log(req.body.movie);
	var id = req.body.movie._id;
	console.log(id);
	var movieObj=req.body.movie;
	console.log(movieObj);
	var _movie;

	//非新加的电影没有id
	if( id ){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			//underscore模块的extend方法可以将两个对象的字段重合
			_movie=_.extend(movie,movieObj);
			console.log(_movie);
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/reco')
			})
		})
	}
	else{
		_movie=new Movie(movieObj)
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/reco')
		})
	}
})

//电影列表页路由
router.get("/admin/list",function(req,res) {
	var user = req.session.user;
	console.log(user);
	if(!user){
		return res.redirect('/login');
	}
	if(user.role >= 0){
		Movie.fetch(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render("movielist",{
				title : "电影列表",
				movies:movies,
				user : user
			});		
		});	
	} 
});

//list页删除按钮路由
router.delete("/admin/list",function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			} else {
				res.json({success:1});
			}
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
