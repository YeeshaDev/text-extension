// popup.js

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "Inspection" });
});


chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "ActivateHighlight" });
});
/*document.getElementById("highlight-toggle").addEventListener("change", () => {
  const isChecked = document.getElementById("highlight-toggle").checked;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "Highlighting", isEnabled: isChecked });
  });
});*/
  
  