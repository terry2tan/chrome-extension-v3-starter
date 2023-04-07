// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.
// Listen for messages from the content script
let selectedText = 'empty';

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message);
  if (message.type === 'content' && message.content ) {
    selectedText = await chatGpt(message.content); // Wait for the Promise to resolve
    console.log(`Selected text: ${selectedText}`);
    chrome.runtime.sendMessage({type:'background', content: selectedText});
    // Do something with the selected text
  } else if (message.type === 'popup') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'mouseup', content: 'Hello from the background script!'});
    });
    console.log("mouseup!!!")
  } 
})

