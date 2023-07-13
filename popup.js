// popup.js

document.getElementById("start-inspection").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "Inspection" });
    });
  });
  
  
  