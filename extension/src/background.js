let eventSource = null;
let runningSSE = false;

// --- SSE CONNECTION event stream to refresh KPIs
// --- works in background
function startSSE() {
  if (eventSource){
    eventSource.close();
    eventSource = null;
  }
  eventSource = new EventSource("http://localhost:8000/api/csv_checker");
  runningSSE = true;
  notifyPopup()

  eventSource.onmessage = (event) => {
    let data;
    try{
      data = JSON.parse(event.data);
    }
    catch(e){
      console.log("failed to fetch data fron event stream: ",e);
      return;
    }
    //TODO make sure no errors generated
    //TODO add a way to determine the repo that is receiving data
    //sends new data to all github tabs open
    chrome.tabs.query({ url: "*://github.com/*" }, (tabs) => {
      console.log("event stream from background.js")
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          type: "KPI_STREAM",
          payload: data,
        });
      }
    });
  };
  console.log("SSE connection started")

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
    eventSource.close();
    eventSource = null;
    runningSSE = false;
    notifyPopup();
    // retry after a timeout
    // setTimeout(startSSE, 3000);
  };
}
function stopSSE() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log("SSE stopped");
  }
  runningSSE=false;
  notifyPopup();
}

//notifies popup.html of SSE state
function notifyPopup() {
  chrome.runtime.sendMessage({ type: "SSE_STATUS_CHANGED", isRunning: runningSSE });
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_SSE") {
    startSSE();
  } else if (message.action === "STOP_SSE") {
    stopSSE();
  }
  else if(message.action === "GET_SSE_STATUS"){
    sendResponse({isRunning: runningSSE})
  }
  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "REFRESH") {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/api/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message.payload),
        });
        const data = await res.json();
        sendResponse({ success: true, data });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true;
  }
});

