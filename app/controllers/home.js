var express = require('express'),
router = express.Router(),
Twitter = require('twitter'),
client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = function (app) {
	app.use('/', router);
};

router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'QubaTV'
	});
});

router.get('/tweet', function (req, res, next) {
	client.get('statuses/user_timeline', {
		"screen_name": "qubadigital",
		"count": 2
	}, function(error, tweet, response){
		if(error) throw error;
		res.send(tweet[1].text);
	});
});
