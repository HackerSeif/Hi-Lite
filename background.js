chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractText,
    }, async (results) => {
        if (chrome.runtime.lastError || !results || !results.length) {
            console.error(chrome.runtime.lastError?.message || "No results returned");
            return;
        }

        let messages = [{
            "role": "user",
            "content": results[0].result
        }];

        console.log("Sending these messages to the server:", messages);

        try {
            const response = await fetch("http://localhost:3000", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            let contentValue = data && data.completion && data.completion.message && data.completion.message.content 
                ? String(data.completion.message.content) 
                : "No content available";

            chrome.tabs.sendMessage(tab.id, { type: 'API_RESPONSE', data: data }).catch((error) => {
                console.error("Could not send message to content script:", error);
            });

        } catch (error) {
            console.error("Error posting to server:", error);
        }
    });
});

function extractText() {
    let text = '';
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(paragraph => text += paragraph.innerText + '\n');
    return text.trim();
}
