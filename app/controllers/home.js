var express = require("express"),
router = express.Router(),
Twitter = require("twitter"),
cheerio = require("cheerio"),
request = require("request"),
client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = function (app) {
	app.use("/", router);
};

router.get("/", function (req, res, next) {
	res.render("index", {
		title: "QubaTV"
	});
});

router.get("/tweet", function (req, res, next) {
	client.get("statuses/user_timeline", {
		"screen_name": "qubadigital",
		"exclude_replies": true,
		"count": 5
	}, function(error, _tweet, response){
		if(error)
			console.log(error);
		_tweet = _tweet[0];
		var text = _tweet.text;
		var mediaUrl = ("media" in _tweet.entities) ? _tweet.entities.media[0]["media_url"] : "";
		var tweet = {
			text: text,
			mediaUrl: mediaUrl
		}
		res.send(tweet);
	});
});

router.get("/blogpost", function (req, res, next) {
	var url = "http://www.quba.co.uk/blog";
	request(url, function(error, response, html){
		if(error) return;
		var $ = cheerio.load(html);
		var image = "http://www.quba.co.uk" + $(".blog-list > *:nth-child(1) img").attr("src");
		url = "http://www.quba.co.uk" + $(".blog-list > *:nth-child(1) .title a").attr("href");
		request(url, function(error, response, html){
			if(error) return;
			$ = cheerio.load(html);
			res.send({
				title: $(".blog-post-detail h1").text().trim(),
				summary: $(".blog-post-detail .summary").text().trim(),
				image: image
			});
		});
	});
});

router.get("/donedone", function (req, res, next) {
	var username = process.env.DONEDONE_USERNAME,
		apikey = process.env.DONEDONE_APIKEY;
	var url = "https://"+username+":"+apikey+"@quba.mydonedone.com/issuetracker/api/v2/issues/all_closed_and_fixed.json?take=1";
	console.log(url);
	request(url, function(error, response, html){
		if(error) return
		var results = JSON.parse(response.body);
		res.send(results.issues[0]);
	});
});
