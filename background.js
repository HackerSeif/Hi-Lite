chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: modifiedExtractText,
    });
});

async function modifiedExtractText() {
    let text = '';
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(paragraph => text += paragraph.innerText + '\n');
    const chunkedText = chunkText(text.trim(), 2000); // Chunk text every 2000 characters

    chunkedText.forEach(async (chunk, index) => {
        // Send each chunk to the server with a delay to prevent overload
        setTimeout(async () => {
            try {
                const response = await fetch("http://localhost:3000", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: [{"role": "user", "content": chunk}] })
                });
    
                if (!response.ok) throw new Error('Network response was not ok');
    
                const data = await response.json();
    
                chrome.runtime.sendMessage({ type: 'API_RESPONSE', data: data, index });
            } catch (error) {
                console.error("Error posting to server:", error);
            }
        }, index * 1000); // Delay to manage load
    });
}

function chunkText(text, length) {
    let chunks = [];
    while (text.length > 0) {
        let chunk = text.substring(0, length);
        text = text.substring(length);
        chunks.push(chunk);
    }
    return chunks;
}