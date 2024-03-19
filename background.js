// background.js
chrome.action.onClicked.addListener((tab) => {
    const articleUrl = tab.url;
    fetch("http://localhost:3000/process-article", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleUrl })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.content) {
            console.error("No content available after processing");
            return;
        }
        chrome.tabs.sendMessage(tab.id, { type: 'PROCESSED_CONTENT', content: data.content }).catch((error) => {
            console.error("Could not send message to content script:", error);
        });
    })
    .catch(error => {
        console.error("Error fetching processed article content:", error);
    });
});