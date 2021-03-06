var message = document.querySelector('#message');
var timeRange = document.querySelector('#time-range');
var timeLabel = document.querySelector('.time-label span');
var timeElapsed = document.querySelector('.time-elapsed span');
var button = document.querySelector('.button input');

function showMessage()
{
	if (message.classList.contains('close'))
		message.classList.remove('close');
}

function hideMessage()
{
	if (!message.classList.contains('close'))
		message.classList.add('close');
}

function setTime(time)
{
	timeLabel.innerHTML = time;
}

function getTime()
{
	return parseInt(timeRange.value);
}

function setTimeElapsed(time)
{
	timeElapsed.innerHTML = time;
}

function showTimeElapsed()
{
	if (timeElapsed.parentElement.classList.contains('hide'))
		timeElapsed.parentElement.classList.remove('hide');
}

function hideTimeElapsed()
{
	if (!timeElapsed.parentElement.classList.contains('hide'))
		timeElapsed.parentElement.classList.add('hide');
}

function setButtonModeOff()
{
	button.value = 'Wyłącz';
	button.className = 'off';
}

function setButtonModeOn()
{
	button.value = 'Włącz';
	button.className = 'on';
}

function setModePumpOn()
{
	setButtonModeOff();
	showTimeElapsed();
}

function setModePumpOff()
{
	setButtonModeOn();
	hideTimeElapsed();
}

function turnPumpOn(time, response)
{
	var xhr = new XMLHttpRequest();
	var url = '/pump/start/' + time;
	xhr.open('GET', url, true);
	xhr.onload = function (e) {
		if (this.status == 200)
		{
			var status = JSON.parse(this.responseText);
			response(status, false);
		}

		else
		{
			response(null, true);
		}
	}

	xhr.send();
}

function turnPumpOff(response)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/pump/stop', true);
	xhr.onload = function (e) {
		if (this.status == 200)
		{
			var status = JSON.parse(this.responseText);
			response(status, false);
		}

		else
		{
			response(null, true);
		}
	}

	xhr.send();
}

function getPumpStatus(response)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/pump', true);
	xhr.onload = function (e) {
		if (this.status == 200)
		{
			var status = JSON.parse(this.responseText);
			response(status, false);
		}

		else
		{
			response(null, true);
		}
	};

	xhr.onerror = function(e) {
		response(null, true);
	};

	xhr.send();
}

var pumpStatus;

function updateStatus(status, error)
{
	if (error)
	{
		showMessage();
		return;
	}

	hideMessage();
	pumpStatus = status;
	if (status.isPumpOn)
		setModePumpOn();

	else
		setModePumpOff();

	setTimeElapsed(status.timeToStop);
}

function togglePumpStatus()
{
	if (!pumpStatus)
		return;

	if (pumpStatus.isPumpOn)
	{
		turnPumpOff(updateStatus);
		setModePumpOff();
	}

	else
	{
		var workTime = getTime();
		turnPumpOn(workTime, updateStatus);
		setModePumpOn();
		setTimeElapsed(workTime);
	}
}

function init() {
	getPumpStatus(updateStatus);
	setInterval(function () {
		getPumpStatus(updateStatus);
	}, 1000);
}

timeRange.onchange = function () {
	setTime(getTime());
};

timeRange.oninput = function () {
	setTime(getTime());
};

button.onclick = function () {
	togglePumpStatus();
};