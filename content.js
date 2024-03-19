// content.js
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function highlightTextInNode(node, searchText) {
    let textContent = "";
    const textNodes = [];
    function collectTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textContent += node.nodeValue;
            textNodes.push(node);
        } else if (node.nodeType === Node.ELEMENT_NODE && ['SCRIPT', 'STYLE', 'NOSCRIPT'].indexOf(node.nodeName) === -1) {
            for (let child of node.childNodes) {
                collectTextNodes(child);
            }
        }
    }
    collectTextNodes(node);
    const regex = new RegExp(`\\b${escapeRegex(searchText)}\\b`, 'gi'); // Use 'gi' for case-insensitive searching
    let match;
    while ((match = regex.exec(textContent))) {
        let startIndex = match.index;
        let endIndex = startIndex + searchText.length;
        // Highlighting logic remains unchanged
    }
}

function highlightSentences(sentences) {
    sentences.forEach(sentence => {
        highlightTextInNode(document.body, sentence);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PROCESSED_CONTENT') {
        const contentValue = message.content; // Assuming this is plain text for now
        
        const sentences = contentValue.split(/\.\s*/).filter(sentence => sentence.trim().length > 0);
        highlightSentences(sentences);
    }
});

//Make highlight quantity dynamic to page size, instead of 5 sentences everytime (kinda done)

//Bugs:
//  situations like J.J. lead to sentence breaks and don't get highlighted correctly
//  Randomly doesn't highlight an article it was able to highlight before
//      Seemingly does this after running articles a few times before, might be difficulty processing
//      too much info. Might be fixed by Lang Chain
//  The whole proj doesn't work on long articles, might be fixed by Lang Chain
