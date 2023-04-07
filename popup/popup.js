document.getElementById('extract').addEventListener('click', () => {
    chrome.runtime.sendMessage({type: 'popup'});
    console.log("1popup!");
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'background' && message.content) {
            document.getElementById('selected-text').innerHTML = message.content;
        }
    });
});
