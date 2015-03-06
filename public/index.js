// var message = document.querySelector('#message');
//var timeRange = document.querySelector('#time-range');
//var timeLabel = document.querySelector('.time-label span');
//var timeElapsed = document.querySelector('.time-elapsed span');
//var button = document.querySelector('.button input');

function getButtonDOM(id) {
	return document.querySelector('#obj-id-'+id + ' .button > input');
}

function getTimeRangeDOM(id) {
	return document.querySelector('#obj-id-'+id+' .time-range');
}
function showMessage(obj_id)
{
	message = document.querySelector('#message-'+obj_id);
	if (message.classList.contains('close'))
		message.classList.remove('close');
}

function hideMessage(obj_id)
{
	message = document.querySelector('#message-'+obj_id);
	if (!message.classList.contains('close'))
		message.classList.add('close');
}

function setTime(obj_id,time)
{
	timeLabel = getTimeRangeDOM(obj_id)
	timeLabel.innerHTML = time;
}

function getTime(obj_id)
{
	timeRange = getTimeRangeDOM(obj_id)
	return parseInt(timeRange.value);
}

function setTimeElapsed(obj_id,time)
{
	timeElapsed = document.querySelector('#obj-id-'+obj_id+' .time-elapsed span');
	timeElapsed.innerHTML = time;
}

function showTimeElapsed(obj_id)
{
	timeElapsed = document.querySelector('#obj-id-'+obj_id+' .time-elapsed span');
	if (timeElapsed.parentElement.classList.contains('hide'))
		timeElapsed.parentElement.classList.remove('hide');
}

function hideTimeElapsed(obj_id)
{
	timeElapsed = document.querySelector('#obj-id-'+obj_id+' .time-elapsed span');
	if (!timeElapsed.parentElement.classList.contains('hide'))
		timeElapsed.parentElement.classList.add('hide');
}


function setButtonModeOff(id)
{
	button = getButtonDOM(id);
	button.value = 'Wyłącz';
	button.className = 'off';
}

function setButtonModeOn(id)
{
	button = getButtonDOM(id)
	button.value = 'Włącz';
	button.className = 'on';
}

function setModeDeviceOn(obj_id)
{
	setButtonModeOff(obj_id);
	showTimeElapsed(obj_id);
}

function setModeDeviceOff(obj_id)
{
	setButtonModeOn(obj_id);
	hideTimeElapsed(obj_id);
}

 function toggleButton(id) {
 	button = getButtonDOM(id)
 	disabled = button.classList.contains('off')
 	//wyłączone? to ustaw przycisk w 'do włączenia' a urządzenie wyłącz
 	if (disabled) {
 		setButtonModeOn(id)
 		turnDeviceOff(id, 0)
 	} else {
 		setButtonModeOff(id)
 		turnDeviceOn(id)
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

var pumpStatus={};
//Jeżeli urządzenie jest włączone to zmień przycisk na 'do wyłączenia'
function updateStatus(device, status, error)
{
	if (error)
	{
		showMessage(device);
		return;
	}

	pumpStatus[device]=status
	if (status) {
		setButtonModeOff(device)
	} else {
		setButtonModeOn(device)
	}

}

function toggleDeviceStatus(device)
{
	if (pumpStatus[device])
	{
		turnDeviceOff(device,updateStatus(device));
		setModeDeviceOff(device);
	}

	else
	{
		var workTime = getTime(device);
		turnDeviceOn(device,workTime, updateStatus);
		setModeDeviceOn(device);
		setTimeElapsed(device,workTime);
	}
}

function init(arg) {
	arg.forEach(function(k){
		getDeviceStatus(k,updateStatus)
		setInterval(function () {
			getDeviceStatus(k,updateStatus);
	}, 2000);
		btn = getButtonDOM(k)
		btn.onclick = function(){toggleDeviceStatus(k)}
	})
/*
	getPumpStatus(updateStatus);
	setInterval(function () {
		getPumpStatus(updateStatus);
	}, 1000);
*/
}
