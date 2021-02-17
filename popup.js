let changeColor = document.getElementById('changeColor');
let selectDiv = document.getElementById('selectDiv');

let resorts = ["STEVENS PASS", "PARK CITY"]

chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
	changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
	let color = element.target.value;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{code: 'document.body.style.backgroundColor = "' + color +'";'});
	});
};

var dateElement = document.getElementById("date");
dateElement.oninput = function(element) {
	console.log(dateElement.value);
	chrome.storage.sync.set({date: dateElement.value});
}

var nameElement = document.getElementById("name");
nameElement.oninput = function(element) {
	console.log(nameElement.value);
	chrome.storage.sync.set({name: nameElement.value});
}

var confirmButton = document.getElementById("confirm");
confirmButton.onclick = function() {
	// validate that everything is selected
	// check from storage if everything is set
	chrome.storage.sync.get('date', function(data) {
		if (data.date == null || data.date == undefined) {
			alert('Date is undefined');
		}
	});
	chrome.storage.sync.get('resort', function(data) {
		if (data.resort == null || data.resort == undefined) {
			alert('Resort is undefined.');
		}
	});
	chrome.storage.sync.get('name', function(data) {
		if (data.name == null || data.name == undefined) {
			alert('Name is undefined');
		}
	});
	reserve();
}

var clearButton = document.getElementById("clear");
clearButton.onclick = function() {
	console.log('clearing all states');
	chrome.storage.sync.clear();
	syncAllFields();
}

window.onload = function(element) {
	// programmatically add selection
	var selectElement = document.createElement("select");
	selectElement.id = "select";
	for (var i=0; i < resorts.length; i++) {
		var option = document.createElement("option");
		option.value = resorts[i];
		option.text = resorts[i];
		selectElement.appendChild(option);
	}
	selectDiv.appendChild(selectElement);

	selectElement.onchange = function(element) {
		console.log(selectElement.value);
		chrome.storage.sync.set({resort: selectElement.value})
	}

	// sync all the input values to storage values
	syncAllFields();
	dateElement.setAttribute("min", getTodayDate());
};

var syncAllFields = function() {
	syncDate();
	syncResort();
	syncName();
}

var syncDate = function() {
	var dateElement = document.getElementById("date");
	chrome.storage.sync.get('date', function(data) { 
		if (data.date == null || data.date == undefined) {
			dateElement.value = getTodayDate();
		}
		else {
			dateElement.value = data.date;
		}
	});
}

var syncName = function() {
	var nameElement = document.getElementById("name");
	chrome.storage.sync.get('name', function(data) { 
		if (data.name == null || data.name == undefined) {
			nameElement.value = "";
		}
		else {
			nameElement.value = data.name;
		}
	});
}

var syncResort = function() {
	var selectElement = document.getElementById("select");
	chrome.storage.sync.get('resort', function(data) { selectElement.value = data.resort });
}

var getTodayDate = function() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if(dd<10){
	dd='0'+dd
	} 
	if(mm<10){
	mm='0'+mm
	} 
	today = yyyy+'-'+mm+'-'+dd;
	return today;
}