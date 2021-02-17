chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log("The color is green.");
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			// only show on the reservation page (this guarantees user logged in)
			conditions:[new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {
					hostEquals: 'www.epicpass.com',
					pathContains: 'plan-your-trip/lift-access/reservations.aspx'
				},
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
	}]);
	});
});

