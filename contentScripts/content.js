
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

  // Convert the RGB color to hex format
  const hexColor = rgbToHex(fontProperties.color);
  
  div.innerHTML = `
    <p>Primary Family<br/> ${fontProperties.fontPrimaryFamily}</p>
    <hr/>
    <p>Font Family<br/> ${fontProperties.fontFamily}</p>
    <hr/>
    <div class="size">
      <p>Size<br/> ${fontProperties.fontSize}</p>
      <p>Weight<br/> ${fontProperties.fontWeight}</p>
      <p>Height<br/>${fontProperties.lineHeight}</p>
      <div>
      <div class="color-box">
      <p> Color </p>
      <div style="display:flex;align-items:center;justify-content:center; flex-direction:row-reverse;">
      <span class="color-palette" style="background-color: ${fontProperties.color};"></span>
      <p>${hexColor}</p>
    </div>
      </div>

      
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

// Helper function to convert RGB color to hex format
function rgbToHex(rgbColor) {
  const rgbValues = rgbColor.match(/\d+/g);
  if (rgbValues) {
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  }
  return rgbColor;
}

// Helper function to convert RGB component to hex
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

//clear the text-inspection from the screen
function clearFontProperties() {
  const div = document.getElementById("text-inspector");
  if (div) {
    div.remove();
  }
}
