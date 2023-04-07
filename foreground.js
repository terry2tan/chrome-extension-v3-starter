// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

console.log("This prints to the console of the page (injected only if the page url matched)")
let selectedText = '';

document.addEventListener('mouseup', function(event) {
        
    selectedText = window.getSelection().toString().replace(/\n/g, "");
        
    const charCount = selectedText.length;
    
    if (charCount > 0) {
        const span = document.createElement("span");
        span.innerText = ` (${charCount} chars)`;
        if (charCount > 1000) {
            span.style.color = "red";
        } else {
            span.style.color = "green";
        }
        // span.style.fontSize = "12px";
        const range = window.getSelection().getRangeAt(0);
        const endNode = range.endContainer;
        const endOffset = range.endOffset;
        const newRange = document.createRange();
        newRange.setStart(endNode, endOffset);
        newRange.setEnd(endNode.parentNode, endNode.parentNode.childNodes.length);
        newRange.insertNode(span); // This line inserts the span element at the end of the selected text.
        console.log(selectedText + " (" + charCount + " chars)");
        
        document.addEventListener("selectionchange", function(event){
            if (!window.getSelection().toString()) {
                span.remove();
            }
        });
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("foreground:"+message);
    if (message.type === 'mouseup') {
        chrome.runtime.sendMessage({type:'content', content: selectedText});
    }
});
    
    