chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "ActivateHighlight") {
      activateHighlight();
    }
  });
  
  function activateHighlight() {
    let selectedText = null;
  
    document.addEventListener("mouseover", handleMouseUp);
  
    function handleMouseUp() {
      const text = window.getSelection().toString().trim();
      if (text !== "") {
        selectedText = text;
        showTooltip();
      } else {
        hideTooltip();
      }
    }
  
    let tooltip = null;
  
    function showTooltip() {
      clearFontProperties();
      if (tooltip) {
        return; // Return early if the tooltip is already displayed
      }
  
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const tooltipHeight = rect.height; // Adjust the height of the tooltip as needed
  
      tooltip = document.createElement("div");
      tooltip.id = "highlight-tooltip";
      tooltip.innerHTML = `
        <button id="highlight-btn">Highlight</button>
        <button id="copy-btn">Copy</button>
      `;
  
      tooltip.style.top = `${tooltipHeight}px`; // Position the tooltip at the bottom of the selected text
      tooltip.style.right = `${rect.right}px`;
  
      document.body.appendChild(tooltip);
  
      const highlightButton = tooltip.querySelector("#highlight-btn");
      const copyButton = tooltip.querySelector("#copy-btn");
  
      highlightButton.addEventListener("click", handleHighlightButtonClick);
      copyButton.addEventListener("click", handleCopyButtonClick);
  
      const highlightedText = document.createElement("span");
      range.surroundContents(highlightedText);
    }
  
    function handleHighlightButtonClick(event) {
      event.stopPropagation();
      highlightSelectedText();
      clearFontProperties();
    }
  
    function handleCopyButtonClick(event) {
      event.stopPropagation();
      copySelectedText();
      clearFontProperties();
    }
  
    function highlightSelectedText() {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      range.surroundContents(span);
    }
  
    function copySelectedText() {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText !== "") {
        const dummyInput = document.createElement("input");
        dummyInput.value = selectedText;
        document.body.appendChild(dummyInput);
        dummyInput.select();
        document.execCommand("copy");
        document.body.removeChild(dummyInput);
      }
    }
  
    function hideTooltip() {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
      selectedText = null;
    }
  
    document.addEventListener("selectionchange", function() {
      const selection = window.getSelection();
      if (selection) {
        showTooltip();
      } else {
        hideTooltip();
      }
    });
  
    document.addEventListener("mousedown", function(event) {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        if (
          event.clientX < tooltipRect.left ||
          event.clientX > tooltipRect.right ||
          event.clientY < tooltipRect.top ||
          event.clientY > tooltipRect.bottom
        ) {
          hideTooltip();
        }
      }
    });
  }
  