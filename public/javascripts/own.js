(function(){
	var nava = $("#navul li a");
	nava.click(function(){
		var _this = $(this);
		_this.parent().addClass('active').siblings().removeClass();
	});
})()