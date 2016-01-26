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
		"count": 2
	}, function(error, tweet, response){
		if(error)
			console.log(error);

		res.send(tweet[1].text);
	});
});

router.get("/blogpost", function (req, res, next) {
	var url = "http://www.quba.co.uk/blog";
	request(url, function(error, response, html){
		if(error) return;
		var $ = cheerio.load(html);
		url = "http://www.quba.co.uk" + $(".blog-list > *:nth-child(1) .title a").attr("href");
		request(url, function(error, response, html){
			if(error) return;
			$ = cheerio.load(html);
			res.send({
				title: $(".blog-post-detail h1").text().trim(),
				summary: $(".blog-post-detail .summary").text().trim()
			});
		});
	});
});


//document.querySelector(".blog-list > *:nth-child(1) .title a").innerText
