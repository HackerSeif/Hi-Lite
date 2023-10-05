let messages = [];

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function extractText() {
            let text = '';
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach((paragraph) => {
                text += paragraph.innerText + '\n';
            });
            
            return text.trim(); // Added trim to remove any trailing new lines
        },
    }, async (results) => {
        if (chrome.runtime.lastError || !results || !results.length || results[0].error) {
            console.error(chrome.runtime.lastError || results[0].error || "No results returned");
            return;
        }

        // Get the value (text) entered by the user and ensure it's a string
        let messageText = String(results[0].result);
        // Create a new message object for the entered text
        let newMessage = { "role": "user", "content": messageText };
        // Add the new message to the messages array
        messages.push(newMessage);

        // Ensure messages' content only contains strings
        for (let i = 0; i < messages.length; i++) {
            if (typeof messages[i].content !== 'string') {
                // Convert non-string content to a string
                messages[i].content = String(messages[i].content);
            }
        }
        console.log("Sending these messages to the server:", messages);

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
            // Extract the assistant's response from the server's response and ensure it's a string
            let contentValue = data && data.completion && data.completion.message && data.completion.message.content 
            ? String(data.completion.message.content) 
            : "No content available";
            let newAssistantMessage = { "role": "assistant", "content": contentValue };        
            // Add the assistant's message to the messages array
            messages.push(newAssistantMessage);
            console.log(`message content: ${data.completion.message.content}`);

            // Send the API's response to the content script to handle the color-changing logic
            chrome.tabs.sendMessage(tab.id, { type: 'API_RESPONSE', data: data });

        })
        .catch(error => {
            console.error("Error posting to server:", error);
        });
    });
});


// the problem is that 'messages' is not a string, it appears as [object Object] or
// the text is just not getting extracted from the webpage

/* HACKATHON CODE: 
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
*/