document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	  chrome.runtime.sendMessage(
		{ action: "extractText", tabId: tabs[0].id },
		function (response) {
		  if (response.error) {
			console.error(response.error);
			return;
		  }
		  document.getElementById('extractedText').value = response;
		}
	  );
	});
  });
  
