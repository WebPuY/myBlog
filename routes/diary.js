var express = require('express'),
	Diary = require('../models/diary'),
	Comment = require('../models/comment'),
	_ = require('underscore'),
	router = express.Router();

//日记页路由
router.get("/diary",checkLogin);
router.get("/diary",function(req,res) {
	Diary.fetch(function(err,diaries){
		if(err){
			console.log(err);
		}
		res.render("diary",{
			title : "首页",
			diaries : diaries,
			user : req.session.user
		});	
	});	
});

//日记详情页路由
router.get("/diary/:id",function(req,res) {
	var id = req.params.id;

	Diary.findById(id,function(err,diary){

		Comment
		.find({diary:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			res.render("diarydetail",{
				title: "详情",
				diary:diary,
				comments:comments,
				user: req.session.user
			});	
		});
	});
});


//日记后台录入页路由
router.get("/admin/diary/edit",function(req,res){
	var user = req.session.user;
	if(!user){
		return res.redirect('/login');
	}
	if(user.role > 0){
		res.render("diaryedit",{
			title : "写日记",
			diary:{
				diarytitle:'',
				diarysummary:'',
				diarycontent:''
			},
			user : user
		});	
	} else {
		console.log('权限不足');
	}
});

//日记更新页路由
// router.post('/admin/update/diary/:id',function(req,res){
// 	var id = req.params.id;
// 	if(id){
// 		Diary.findById(id,function(err,diary){
// 			res.render('diaryadmin',{
// 				title: '后台更新页',
// 				diary: diary
// 			});
// 		});
// 	}
// });

router.post('/admin/diary/edit/new',function(req,res){
	var id = req.body.diary._id;
	var diaryObj=req.body.diary;
	var _diary;

	if(id !== 'undefined'){
		Diary.findById(id,function(err,diary){
			if(err){
				console.log(err)
			}
			_diary=_.extend(diary,diaryObj);
			_diary.save(function(err,diary){
				if(err){
					console.log(err)
				}
				res.redirect('/diary')
			})
		})
	}
	else{
		_diary=new Diary({
			diarytitle:diaryObj.diarytitle,
			diarysummary:diaryObj.diarysummary,
			diarycontent:diaryObj.diarycontent
		})
		_diary.save(function(err,diary){
			if(err){
				console.log(err)
			}
			res.redirect('/diary')
		})
	}
})

//日记列表页路由
router.get("/admin/diary/list",function(req,res) {
	var user = req.session.user;
	console.log(user);
	if(!user){
		return res.redirect('/login');
	}
	if(user.role >= 0){
		Diary.fetch(function(err,diaries){
			if(err){
				console.log(err);
			}
			res.render("diarylist",{
				title : "日记列表",
				diaries:diaries,
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
