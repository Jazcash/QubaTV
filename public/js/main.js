$(document).ready(function(){
	setTweet();
	setDoneDone();
	setQuba();
	setBeanstalk();

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
		$.get('/donedone', function(data) {
			$("page-donedone").attr({
				"title": data.latestIssue.title,
				"project": data.latestIssue.project.name,
				"numberofissues": data.totalIssues
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

	function setBeanstalk(){
		$.get('/beanstalk', function(data) {
			console.log(data);
			$("page-beanstalk").attr({
				"revision": data.changeset.revision,
				"message": data.changeset.message,
				"time": moment(new Date(data.changeset.time)).format("dddd, MMMM Do, h:mm a"),
				"project": data.repository.title,
				"name": data.user["first_name"]
			});
		});
	}

	function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	}
});
