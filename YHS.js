var express = require('express');
var auth = require('basic-auth');

var path = require('path');
var https = require('https');
var fs = require('fs');
var readline = require('readline');

var isPumpWork = false
var pumpStartTime;
var pumpWorkTime;

var swig = require('swig');
var cons = require('consolidate');
var nconf = require('nconf');

nconf.use('file', { file: './config.json' });
nconf.load();


var pump = {
	start: function () {
		process.stdout.write('on\n');
	},

	stop: function () {
		process.stdout.write('off\n');
	}
};

var timer = {
	timerId: null,

	start: function (timeToStop, onEnd) {
		this.timerId = setTimeout(onEnd, timeToStop);
	},

	stop: function () {
		clearTimeout(this.timerId);
	}
};


function start(timeToStop)
{
	if (isPumpWork)
		return;

	pump.start();
	isPumpWork = true;
	pumpStartTime = new Date();
	pumpWorkTime = timeToStop;
	timer.start(timeToStop, stop);
}

function stop()
{
	pump.stop();
	isPumpWork = false;
	timer.stop();
}

function updateTime(timeToStop)
{
	timer.stop();
	pumpStartTime = new Date();
	pumpWorkTime = timeToStop;
	timer.start(timeToStop, stop);
}

function getTimeToStop()
{
	if (!isPumpWork)
		return 0;

	var timeNow = new Date();
	var timeFromStart = timeNow.getTime() - pumpStartTime.getTime();
	return pumpWorkTime - timeFromStart;
}

function getPumpState_JSON()
{
	var minutes = (getTimeToStop() / 60000) | 0;
	var state = {
		'isPumpOn': isPumpWork,
		'timeToStop': minutes
	};

	return JSON.stringify(state);
}

var app = express();

// Static files in /
app.use(express.static(path.join(__dirname, 'public')));

// simple http auth in all urls
app.use(function (req, res, next){
	var user = auth(req);

	if (!user || (user.name != 'root' || user.pass != 'ntg arduino'))
	{
		res.set('WWW-Authenticate', 'Basic realm="Zaloguj się"');
		return res.status(401).end();
	}

	else
	{
		return next();
	}
});

// URL Events
app.get('/pump', function (req, res){
	res.send(getPumpState_JSON());
});

app.get('/pump/start/:time', function (req, res) {
	var time = parseInt(req.params.time);
	if (!time || time == 0 || time > 120)
	{
		res.send(getPumpState_JSON());
		return;
	}

	var time_ms = time * 60000;
	if (!isPumpWork)
		start(time_ms);

	else
		updateTime(time_ms);

	res.send(getPumpState_JSON());
});

app.get('/pump/stop', function (req, res){
	stop();
	res.send(getPumpState_JSON());
});

app.get('/t', function(req, res){
	cons.swig('./templates/index.html', {"sections":nconf.get("interface")}, 
		function(err, html){
			if (err) throw err;
			res.send(html);
			}
		);
})

// SSL Config
var options = {
	key: fs.readFileSync(path.join(__dirname, 'key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

// Run https sever
https.createServer(options, app).listen(1234);

// Reading commands from Arduino
arduinoFeedback = readline.createInterface({
	input: process.stdin,
	output: null,
	terminal: false
});

arduinoFeedback.on('line', function(line) {
	// Tu co ma robić po odebraniu linii danych
	console.log('Linia odebrana');
});
