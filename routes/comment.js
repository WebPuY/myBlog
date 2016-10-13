var express = require('express'),
	Comment = require('../models/comment'),
	router = express.Router();


router.post("/user/comment",checkLogin);
router.post('/user/comment',function(req,res){
	var _comment = req.body.comment;
	var diaryId = _comment.diary;

	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}

			comment.reply.push(reply);
			comment.save(function(err,comment){
				if(err){
					console.log(err)
				}
				res.redirect('/diary/'+diaryId);
			});
		})
	} else {
		var comment = new Comment(_comment);

		comment.save(function(err,comment){
			if(err){
				console.log(err)
			}
			res.redirect('/diary/'+diaryId);
		});
	}

})

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
