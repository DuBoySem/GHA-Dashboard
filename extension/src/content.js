
// Inject a container for React
const container = document.createElement("div");
container.id = "gha-dashboard-root";
document.body.appendChild(container);

// Inject bundled React app
const script = document.createElement("script");
script.src = chrome.runtime.getURL("bundle.js");
document.body.appendChild(script);
