$(document).ready(function(){

	var handlers = {
		twitter: function(){
			$.get('/tweet', function(tweet) {
				$("page-twitter").attr({
					"profilepic": tweet.profilepic,
					"username": tweet.username,
					"handle": tweet.handle,
					"date": moment(new Date(tweet.date)).format("dddd, h:mmA"),
					"message": htmlDecode(tweet.text),
					"image": tweet.mediaUrl
				});
			});
		},
		donedone: function(){
			$.get('/donedone', function(data) {
				if (data.totalIssues > 0){
					$("page-donedone").attr({
						"title": data.latestIssue.title,
						"project": data.latestIssue.project.name,
						"numberofissues": data.totalIssues
					});
				} else {
					$("page-donedone").attr({
						"title": "",
						"project": "",
						"numberofissues": 0
					});
				}
			});
		},
		quba: function(){
			$.get('/blogpost', function(blogpost) {
				$("page-quba").attr({
					"title": blogpost.title,
					"summary": blogpost.summary,
					"image": blogpost.image
				});
			});
		},
		beanstalk: function(){
			$.get('/beanstalk', function(data) {
				$("page-beanstalk").attr({
					"revision": data.changeset.revision,
					"message": (data.changeset.message.length > 300) ? data.changeset.message.substr(0, 300) + " ..." : data.changeset.message,
					"time": moment(new Date(data.changeset.time)).format("dddd, MMMM Do, h:mm a"),
					"project": data.repository.title,
					"name": data.changeset.author
				});
			});
		},
		pingdom: function(){
			$.get('/pingdom', function(data) {
				$("page-pingdom").attr({
					"checks": JSON.stringify(data.checks.map(function(check){ return {name: check.name, isUp: check.status === "up"}}))
				});
			});
		}
	};

	for (var page in handlers){
		handlers[page]();
	}

	startCarousel();

	function startCarousel(){
		$("body").animate({scrollLeft: $(".pages").children().eq(0).position().left}, 800);
		var currentPage = 0;
		var pageLoopId = setInterval(function(){
			var nextPage = (currentPage + 1 < $(".pages > *").length) ? currentPage + 1 : 0;
			$("body").animate({
				scrollLeft: $(".pages > *").eq(nextPage).position().left
			}, 1100, function(){
				var previousPage = $(".pages > *").eq(currentPage)[0].localName.split("-")[1];
				handlers[previousPage]();
				currentPage = nextPage;
			});
		}, 15000);
	}

	function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	}

});
