//event listener for update SSE state styling
const sseState = document.getElementById("sse-state")

document.getElementById("startBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "START_SSE" });
});

document.getElementById("stopBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "STOP_SSE" });
});
//listen to SSE updates from the background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SSE_STATUS_CHANGED") {
    updateStatus(msg.isRunning);
  }
});

function updateStatus(isRunning){
  if(isRunning){
    sseState.textContent = "SSE Running";
    sseState.classList.remove("stopped");
    sseState.classList.add("running");
  }
  else{
    sseState.textContent = "SSE Stopped";
    sseState.classList.remove("running");
    sseState.classList.add("stopped");
  }
}

// for getting the SSE state on popup display/load
chrome.runtime.sendMessage({ action: "GET_SSE_STATUS" }, (response) => {
  if (response && typeof response.isRunning === "boolean") {
    updateStatus(response.isRunning);
  }
});
