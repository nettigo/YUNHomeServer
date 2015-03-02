var express = require('express');
var ejs = require('ejs');

var path = require('path');
var fs = require('fs');

var app = express();

function readConfig()
{
  var configPath = path.join(__dirname, 'buttons.json');
  var jsonSource = fs.readFileSync(configPath);
  var config = JSON.parse(jsonSource);

  return config;
}

var config = readConfig();


app.get('/', function (req, res) {
  var templatePath = path.join(__dirname, 'template.html');
  var templateSource = fs.readFileSync(templatePath, {encoding: 'utf8'});
  var htmlSource = ejs.render(templateSource, {devices: config});
  res.send(htmlSource);
});

app.get('/:device', function (req, res) {
  var device = req.params.device;
  var state = config[device].state;
  res.send(state);
});

app.get('/:device/:state', function (req, res) {
  var device = req.params.device;
  var state = req.params.state;
  config[device].state = state;
  var command = config[device].msg + ' ' + state
  console.log(command);
  res.send("OK");
});

var server = app.listen(8080);
