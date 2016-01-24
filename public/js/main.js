$(document).ready(function(){

	setTweet();
	setDoneDone();
	setQuba();

	// $("body").animate({scrollLeft: $(".pages").children().eq(0).position().left}, 800);
	// var currentPage = 0;
	// var pageLoopId = setInterval(function(){
	// 	var nextPage = (currentPage + 1 < $(".pages > *").length) ? currentPage + 1 : 0;
	// 	$("body").animate({
	// 		scrollLeft: $(".pages > *").eq(nextPage).position().left
	// 	}, 800, function(){
	// 		var previousPage = $(".pages > *").eq(currentPage)[0].localName.split("-")[1];
	// 		switch(previousPage){
	// 			case "twitter":
	// 				setTweet();
	// 				break;
	// 			case "donedone":
	// 				setDoneDone();
	// 				break;
	// 			case "quba":
	// 				setQuba();
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 		currentPage = nextPage;
	// 	});
	// }, 3000);

	function setTweet(){
		$.get('/tweet', function(data) {
			$("page-twitter").attr("message", data);
		});
	}

	function setDoneDone(){

	}

	function setQuba(){

	}
});
