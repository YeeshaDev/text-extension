// background.js

chrome.action.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, { action: "Inspection" });
  });
  
  chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "ActivateHighlight" });
  });