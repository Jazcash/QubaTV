var express = require("express"),
router = express.Router(),
Twitter = require("twitter"),
cheerio = require("cheerio"),
request = require("request"),
moment = require("moment"),
fs = require("fs"),
config = {};

try {
    stats = fs.lstatSync("config.json");
    if (stats.isFile()) {
        config = JSON.parse(fs.readFileSync("config.json"));
    }
} catch(e){
    console.log("No config.json file found - exiting".error);
    process.exit(1);
}

var client = new Twitter({
	consumer_key: config.twitter_consumer_key,
	consumer_secret: config.twitter_secret_key,
	access_token_key: config.twitter_access_token,
	access_token_secret: config.twitter_access_token_secret,
});

module.exports = function (app) {
	app.use("/", router);
};

router.get("/", function (req, res, next) {
	res.render("index", {
		title: "QubaTV",
		polymerPages: fs.readdirSync("public/polymer"),
		polymerNames: fs.readdirSync("public/polymer").map(function(item){ return item.split("-")[1].split(".")[0]; })
	});
});

router.get("/tweet", function (req, res, next) {
	client.get("statuses/user_timeline", {
		"screen_name": "qubadigital",
		"exclude_replies": true,
		"count": 5
	}, function(error, _tweet, response){
		if(error){
			console.log(error);
			return;
		}
		_tweet = _tweet[0];
		var tweet = {
			date: _tweet["created_at"],
			username: _tweet.user.name,
			handle: _tweet.user["screen_name"],
			profilepic: _tweet.user["profile_image_url"].replace("_normal", ""),
			text: _tweet.text,
			mediaUrl: ("media" in _tweet.entities) ? _tweet.entities.media[0]["media_url"] : "",
		};
		res.send(tweet);
	});
});

router.get("/blogpost", function (req, res, next) {
	var url = "http://www.quba.co.uk/blog";
	request(url, function(error, response, html){
		if(error){
			console.log(error);
			return;
		}
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
	var url = "https://"+config.donedone_username+":"+config.donedone_apikey+"@quba.mydonedone.com/issuetracker/api/v2/global_custom_filters.json";
	request(url, function(error, response, html){
	    if (error){
	        console.log(error);
	        return;
	    }
	    var filterId = JSON.parse(response.body)[0].id;
	    var today = moment();
	    var tomorrow = moment(today).add(1, 'day');
	    url = "https://"+config.donedone_username+":"+config.donedone_apikey+"@quba.mydonedone.com/issuetracker/api/v2/activity/issues_by_global_custom_filter/"+filterId+".json?from_date="+today.format("Y-M-D")+"&until_date="+tomorrow.format("Y-M-D")+"&take=500";
	    request(url, function(error, response, html){
	        if (error){
	            console.log(error);
	            return;
	        }
	        var fixedIssues = JSON.parse(response.body);
	        res.send({
	        	totalIssues: fixedIssues.length,
	        	latestIssue: fixedIssues[0]
	        });
	    });
	});
});

router.get("/beanstalk", function(req, res, next){
	var url = "https://"+config.beanstalk_username+":"+config.beanstalk_apikey+"@quba.beanstalkapp.com/api";
	request(url + "/changesets.json?per_page=1", function(error, response, html){
	    if (error){
	        console.log(error);
	        return;
	    }
	    changeset = JSON.parse(response.body)[0]["revision_cache"];
	    request(url + "/repositories/"+changeset["repository_id"]+".json", function(error, response, html){
	        if (error){
	            console.log(error);
	            return;
	        }
	        repository = JSON.parse(response.body).repository;
	        res.send({
                changeset: changeset,
                repository: repository,
            });
	    });
	});
});
