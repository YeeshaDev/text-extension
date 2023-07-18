
// Font Inspection Feature
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "Inspection") {
    activateTextInspection();
  }
});

function activateTextInspection() {
  const elements = document.querySelectorAll("*");

  for (const element of elements) {
    element.addEventListener("mouseover", handleMouseOver);
    element.addEventListener("mouseout", handleMouseOut);
  }
}

function handleMouseOver(event) {
  const target = event.target;
  const fontProperties = {
    fontPrimaryFamily: getPrimaryFontFamily(getComputedStyle(target).fontFamily),
    fontFamily: getComputedStyle(target).fontFamily,
    fontSize: getComputedStyle(target).fontSize,
    fontWeight: getComputedStyle(target).fontWeight,
    lineHeight: getComputedStyle(target).lineHeight,
    color: getComputedStyle(target).color,
  };

  displayFontProperties(fontProperties);
}

function handleMouseOut() {
  clearFontProperties();
}

function displayFontProperties(fontProperties) {
  const div = document.createElement("div");
  div.id = "text-inspector";
  div.setAttribute("data-tooltip", "");
  let fontFamilyText = `Font Family: ${fontProperties.fontPrimaryFamily}`;
  if (isGoogleFont(fontProperties.fontPrimaryFamily)) {
    fontFamilyText += " (Google Font)";
  }

  const lineHeightText =
    fontProperties.lineHeight === "normal"
      ? "Line Height<br/> normal"
      : `Line Height<br/> ${fontProperties.lineHeight}`;
  div.innerHTML = `
    <p>Primary Font Family:<br/> ${fontProperties.fontPrimaryFamily}</p>
    <hr/>
    <div class="size">
      <p>Size<br/> ${fontProperties.fontSize}</p>
      <p>Weight<br/> ${fontProperties.fontWeight}</p>
      <p>${lineHeightText}</p>
    </div>
    <hr/>
    <div>
      <p class="color-box"> Color:<br/> 
        <span class="color-palette" style="background-color: ${fontProperties.color};"></span>
        ${fontProperties.color}
      </p>
    </div>
  `;
  document.body.appendChild(div);
}



function isGoogleFont(fontFamily) {
  // Check if the font family is a Google Font
  return fontFamily.toLowerCase().includes("google");
}

function getPrimaryFontFamily(fontFamily) {
  // Remove any generic font families
  const fontFamilies = fontFamily.split(",");
  const primaryFontFamily = fontFamilies.find(family => !isGenericFont(family))?.trim();
  return primaryFontFamily || "";
}

function isGenericFont(fontFamily) {
  // Check if the font family is a generic font family
  const genericFonts = ["serif", "sans-serif", "monospace", "cursive", "fantasy"];
  return genericFonts.includes(fontFamily.toLowerCase());
}

// Highlight Text Feature
let selectedText = null;

document.addEventListener("mouseup", handleMouseUp);

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
  tooltip.style.left = `${rect.left}px`;

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
  clearFontProperties()
  
}

function handleCopyButtonClick(event) {
  event.stopPropagation();
  copySelectedText();
  clearFontProperties()
  
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
  if (selection ) {
    showTooltip();
  } else {
    hideTooltip();
  }
});

document.addEventListener("mousedown", function(event) {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed && tooltip ) {
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

function clearFontProperties() {
  const div = document.getElementById("text-inspector");
  if (div) {
    div.remove();
  }
}

