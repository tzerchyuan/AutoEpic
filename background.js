chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log("The color is green.");
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			// match from within reserve page
			conditions:[new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostEquals: 'www.epicpass.com'},
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
	}]);
	});
});

