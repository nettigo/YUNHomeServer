var message = document.querySelector('#message');
//var timeRange = document.querySelector('#time-range');
//var timeLabel = document.querySelector('.time-label span');
//var timeElapsed = document.querySelector('.time-elapsed span');
//var button = document.querySelector('.button input');

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
	// return parseInt(timeRange.value);
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

function setButtonModeOff(id)
{
	button = document.querySelector('#btn-'+id + '> input');
	button.value = 'Wyłącz';
	button.className = 'off';
}

function setButtonModeOn(id)
{
	button = document.querySelector('#btn-'+id+ '> input');
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

 function toggleButton(id) {
 	button = document.querySelector('#btn-'+id+ '> input');
 	disabled = button.classList.contains('off')
 	if (disabled) {
 		setButtonModeOn(id)
 		turnDeviceOn(id, 0)
 	} else {
 		setButtonModeOff(id)
 		turnDeviceOff(id)
 	}
 }

function turnDeviceOn(device, time, response)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/'+device+'/true', true);
	//xhr.open('GET', url, true);
	xhr.onload = function (e) {
		if (this.status == 200)
		{
			var status = JSON.parse(this.responseText);
			//response(status, false);
		}

		else
		{
			// response(null, true);
		}
	}

	xhr.send();
}

function turnDeviceOff(device,response)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/'+device+'/false', true);
	xhr.onload = function (e) {
		if (this.status == 200)
		{
			var status = JSON.parse(this.responseText);
			//response(status, false);
		}

		else
		{
			//response(null, true);
		}
	}

	xhr.send();
}

function getDeviceStatus(device, response)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/'+device, true);
	xhr.onload = function (e) {
		if (this.status == 200)
		{
			var status = JSON.parse(this.responseText);
			response(device, status, false);

		}

		else
		{
			//response(null, true);
			//TODO - obłsuga braku połączenia
		}
	};

	xhr.onerror = function(e) {
		response(null, true);
	};

	xhr.send();
}

var pumpStatus;

function updateStatus(device, status, error)
{
	if (error)
	{
//		showMessage();
		return;
	}


	if (status) {
		setButtonModeOn(device)
	} else {
		setButtonModeOff(device)
	}

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

function init(arg) {
	arg.forEach(function(k){
		getDeviceStatus(k,updateStatus)
	})
/*
	getPumpStatus(updateStatus);
	setInterval(function () {
		getPumpStatus(updateStatus);
	}, 1000);
*/
}
