$(window).on('beforeunload', function(){
	$("body").scrollLeft(0);
});

$(document).ready(function(){
	var currentPage = 0;
	var pageLoopId = setInterval(function(){
		if ($(".pages").children().eq(currentPage + 1).length > 0){
			$("body").animate({scrollLeft: $(".pages").children().eq(currentPage + 1).position().left}, 800);
			currentPage++;
		} else {
			$("body").animate({scrollLeft: $("page-twitter").position().left}, 800);
			currentPage = 0;
		}
	}, 5000);
});
