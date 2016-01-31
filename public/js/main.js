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
	// 	}, 1100, function(){
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
	// }, 7500);

	function setTweet(){
		$.get('/tweet', function(tweet) {
			$("page-twitter").attr({
				"profilepic": tweet.profilepic,
				"username": tweet.username,
				"handle": tweet.handle,
				"date": moment(new Date(tweet.date)).format("dddd, hA"),
				"message": htmlDecode(tweet.text),
				"image": tweet.mediaUrl
			});
		});
	}

	function setDoneDone(){
		$.get('/donedone', function(issue) {
			$("page-donedone").attr({
				"title": issue.title,
				"project": issue.project.name,
				"fixer": issue.fixer.name
			});
		});
	}

	function setQuba(){
		$.get('/blogpost', function(blogpost) {
			$("page-quba").attr({
				"title": blogpost.title,
				"summary": blogpost.summary,
				"image": blogpost.image
			});
		});
	}

	function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	}
});
