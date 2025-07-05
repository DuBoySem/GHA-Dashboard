let eventSource = null;

// --- SSE CONNECTION event stream to refresh KPIs
// --- works in background
function startSSE() {
  if (eventSource){
    eventSource.close();
    eventSource = null;
  }
  eventSource = new EventSource("http://localhost:8000/api/csv_checker");

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

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
    eventSource.close();
    // retry after a timeout
    setTimeout(startSSE, 3000);
  };
}


// simple REST route to communicate with API from the react injected code
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "REFRESH") {
//     fetch("http://localhost:8000/api/refresh", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(message.payload),
//     })
//       .then((res) => res.json())
//       .then((data) => sendResponse({ success: true, data }))
//       .catch((error) => sendResponse({ success: false, error }));
//
//     return true;
//   }
// });

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

startSSE();
