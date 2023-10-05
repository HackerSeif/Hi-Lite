# Hi-Lite

1. background.js:
   - Set up a Chrome extension to execute scripts when clicked.
   - Extract paragraphs from the active tab.
   - Send the extracted content to an API endpoint (`http://localhost:3000`).
   - Handle API response and pass the response to a content script.

2. content.js:
   - Function to highlight specific text in the DOM.
   - Listen for messages from the background script and process the response.
   - Change the color of all the elements on the page.
   - Split the returned content into sentences and highlight each sentence on the page.

3. index.js:
   - Set up an Express server.
   - Configure and initialize OpenAI's API.
   - Handle POST requests, send messages to OpenAI, and return the response.

4. manifest.json:
   - Define the Chrome extension's properties, permissions, and scripts.

5. package.json:
   - Defines the project's metadata and dependencies.