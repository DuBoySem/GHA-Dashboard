let eventSource = null;

// SSE connection to backend /api/csv_checker
function startSSE() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  eventSource = new EventSource("http://localhost:8000/api/csv_checker");

  eventSource.onmessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error("Failed to parse SSE data:", e);
      return;
    }

    // Broadcast new data to all GitHub tabs
    chrome.tabs.query({ url: "*://github.com/*" }, (tabs) => {
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
    eventSource = null;
    setTimeout(startSSE, 3000); // retry after 3 seconds
  };
}

// REST call to /api/refresh when message type is "REFRESH"
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "REFRESH") {
    fetch("http://localhost:8000/api/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.payload),
    })
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => {
        console.error("/api/refresh request failed:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // required for async sendResponse
  }
});

startSSE();