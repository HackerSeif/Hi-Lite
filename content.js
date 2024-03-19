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
    const regex = new RegExp(`\\b${escapeRegex(searchText)}\\b`);
    const match = regex.exec(textContent);
    if (!match) return;
    let startIndex = match.index;
    let endIndex = startIndex + searchText.length;
    for (let i = 0; i < textNodes.length; i++) {
        const textNode = textNodes[i];
        if (startIndex < textNode.nodeValue.length) {
            const span = document.createElement('span');
            span.style.color = 'black';
            span.style.fontWeight = '600';
            if (endIndex <= textNode.nodeValue.length) {
                const before = textNode.nodeValue.substring(0, startIndex);
                const matched = textNode.nodeValue.substring(startIndex, endIndex);
                const after = textNode.nodeValue.substring(endIndex);
                textNode.nodeValue = before;
                span.textContent = matched;
                if (after) {
                    const afterNode = document.createTextNode(after);
                    textNode.parentNode.insertBefore(afterNode, textNode.nextSibling);
                }
                textNode.parentNode.insertBefore(span, textNode.nextSibling);
                break;
            } else {
                const before = textNode.nodeValue.substring(0, startIndex);
                const matched = textNode.nodeValue.substring(startIndex);
                textNode.nodeValue = before;
                span.textContent = matched;
                textNode.parentNode.insertBefore(span, textNode.nextSibling);
                endIndex -= textNode.nodeValue.length;
            }
        } else {
            startIndex -= textNode.nodeValue.length;
            endIndex -= textNode.nodeValue.length;
        }
    }
}

function highlightSentences(sentences) {
    sentences.forEach(sentence => {
        highlightTextInNode(document.body, sentence);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'API_RESPONSE') {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.color = 'darkgray';
        });

        const contentValue = message.data && message.data.completion && message.data.completion.message && message.data.completion.message.content 
            ? String(message.data.completion.message.content) 
            : "No content available";
        
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
