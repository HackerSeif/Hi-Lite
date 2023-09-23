chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "extractText") {
	  chrome.scripting.executeScript({
		target: { tabId: message.tabId },
		function: extractText,
	  }, (results) => {
		if (chrome.runtime.lastError || !results || !results.length) {
		  sendResponse({ error: chrome.runtime.lastError || "No results returned" });
		  return;
		}
		sendResponse(results[0].result);
	  });
	}
	return true;  // Will respond asynchronously.
  });
  
  function extractText() {
	let text = '';
	const paragraphs = document.querySelectorAll('article p');
	paragraphs.forEach((paragraph) => {
	  text += paragraph.innerText + '\n';
	});
	return text;
  }
