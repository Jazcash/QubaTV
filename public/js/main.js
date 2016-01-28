$(document).ready(function(){
	setTweet();
	setDoneDone();
	setQuba();

	$("body").animate({scrollLeft: $(".pages").children().eq(0).position().left}, 800);
	var currentPage = 0;
	var pageLoopId = setInterval(function(){
		var nextPage = (currentPage + 1 < $(".pages > *").length) ? currentPage + 1 : 0;
		$("body").animate({
			scrollLeft: $(".pages > *").eq(nextPage).position().left
		}, 1100, function(){
			var previousPage = $(".pages > *").eq(currentPage)[0].localName.split("-")[1];
			switch(previousPage){
				case "twitter":
					setTweet();
					break;
				case "donedone":
					setDoneDone();
					break;
				case "quba":
					setQuba();
					break;
				default:
					break;
			}
			currentPage = nextPage;
		});
	}, 15000);

	function setTweet(){
		$.get('/tweet', function(tweet) {
			$("page-twitter").attr("message", htmlDecode(tweet.text));
			$("page-twitter").attr("image", tweet.mediaUrl);
		});
	}

	function setDoneDone(){
		$.get('/donedone', function(issue) {
			$("page-donedone").attr("title", issue.title);
			$("page-donedone").attr("project", issue.project.name);
		});
	}

	function setQuba(){
		$.get('/blogpost', function(blogpost) {
			$("page-quba").attr("title", blogpost.title);
			$("page-quba").attr("summary", blogpost.summary);
			$("page-quba").attr("image", blogpost.image);
		});
	}

	function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	}
});
