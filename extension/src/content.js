//é enforcing utf-8 encoding
const shadowHost = document.createElement("div");
shadowHost.id = "gha-dashboard-shadow-host"; 
document.body.appendChild(shadowHost);

const shadowRoot = shadowHost.attachShadow({ mode: "open" });

// inject a container for React
const container = document.createElement("div");
container.id = "gha-dashboard-root";
document.body.appendChild(container);


// inject bundled dashboard app from dashboard.js
const script = document.createElement("script");
script.src = chrome.runtime.getURL("bundle.js");
document.body.appendChild(script);

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = chrome.runtime.getURL("bundle.css");
shadowRoot.appendChild(styleLink);

//forward message to dashboard
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("posted message from content.js",msg)
  window.postMessage({ source: "BACKGROUND_SCRIPT", ...msg }, "*");
});

//forward message to background script
window.addEventListener("message", (event)=>{
  //avoid edge cases
  if(event.source!==window) return;
  if(event.data.source!=="GHA_DASHBOARD") return;
  chrome.runtime.sendMessage(event.data.message)
})
