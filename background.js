let messages = [];

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function extractText() {
            let text = '';
            const paragraphs = document.querySelectorAll('article p');
            paragraphs.forEach((paragraph) => {
                text += paragraph.innerText + '\n';
            });
            return text;
        },
    }, async (results) => {
        if (chrome.runtime.lastError || !results || !results.length) {
            console.error(chrome.runtime.lastError || "No results returned");
            return;
        }
        
        // Get the value (text) entered by the user
        let messageText = results[0].result;
        // Create a new message object for the entered text
        let newMessage = { "role": "user", "content": `${messageText}` }
        // Add the new message to the messages array
        messages.push(newMessage);

        // Make a POST request to the server with the message
        fetch("http://localhost:3000", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            // Extract the assistant's response from the server's response
            let newAssistantMessage = { "role": "assistant", "content": `${data.completion.content}` }
            // Add the assistant's message to the messages array
            messages.push(newAssistantMessage);
            console.log(newAssistantMessage);
        })
        .catch(error => {
            console.error("Error posting to server:", error);
        });
    });
});
