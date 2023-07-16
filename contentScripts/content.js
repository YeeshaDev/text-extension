chrome.runtime.onMessage.addListener(message => {
  if (message.action === "Inspection") {
    const elements = document.querySelectorAll("*");

    for (const element of elements) {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseout", handleMouseOut);
    }
  }
});
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
  let fontFamilyText = `Font Family: ${fontProperties.fontFamily}`;
if (isGoogleFont(fontProperties.fontFamily)) {
  fontFamilyText += " (Google Font)";
}

const lineHeightText = fontProperties.lineHeight === "normal" ? "Line Height<br/> normal" : `Line Height<br/> ${fontProperties.lineHeight}`;
  div.innerHTML = 
                     ` 
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
                     
                     `
                     ;
                     document.body.appendChild(div);
                   }
                   
                   function clearFontProperties() {
                     const div = document.getElementById("text-inspector");
                     if (div) {
                       div.remove();
                     }
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
                    const genericFonts = [
                      "serif",
                      "sans-serif",
                      "monospace",
                      "cursive",
                      "fantasy",
                    ];
                    return genericFonts.includes(fontFamily.toLowerCase());
                  }
                  
                  