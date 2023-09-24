chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
	  target: { tabId: tab.id },
	  function: extractText,
	}, (results) => {
	  if (chrome.runtime.lastError || !results || !results.length) {
		console.error(chrome.runtime.lastError || "No results returned");
		return;
	  }
	  console.log(results[0].result);
	});
  });
  
  function extractText() {
	let text = '';
	const paragraphs = document.querySelectorAll('article p');
	paragraphs.forEach((paragraph) => {
	  text += paragraph.innerText + '\n';
	});
	return text;
  }
  
