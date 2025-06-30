import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

export default function App() {
  useEffect(() => {
    const nav = document.querySelector("ul.UnderlineNav-body");
    if (!nav) return;

    const turboFrameSelector = "turbo-frame#repo-content-turbo-frame";
    let currentPanelId = "dashboard-panel";

    const renderPanel = () => {
      const turboFrame = document.querySelector(turboFrameSelector);
      if (!turboFrame) return;

      // dont display if already active
      if (document.getElementById(currentPanelId)) return;

      turboFrame.innerHTML = "";

      //panel that contains dashboard
      const dashboardPanelRoot = document.createElement("div");
      dashboardPanelRoot.id = currentPanelId;
      turboFrame.appendChild(dashboardPanelRoot);

      const root = createRoot(dashboardPanelRoot);
      root.render(
        <div className="dashboard-container">
          <h2>Dashboard</h2>
          <p>placeholder for dashboard</p>
        </div>
      );
    };

    // dont duplicate <li> list items
    if (!nav.querySelector("dashboard-tab")) {
      const dashboardTab = document.createElement("li");
      dashboardTab.id = "dashboard-tab";
      dashboardTab.className = "d-flex";
      dashboardTab.innerHTML = `<a style="cursor:pointer;" class="UnderlineNav-item">Dashboard</a>`;
      dashboardTab.addEventListener("click", () => {
        renderPanel();
      });
      nav.appendChild(dashboardTab);
    }

    // observe page refreshe 
    const observeGitHub = () => {
      const main = document.querySelector("main");
      if (!main) return;

      const observer = new MutationObserver(() => {
        const navPresent = document.querySelector("ul.UnderlineNav-body");
        const dashboardTabPresent = document.querySelector("#dashboard-tab");
        if (navPresent && !dashboardTabPresent) {
          // page got refreshed, render our tab element
          App();
        }
      });

      observer.observe(main, { childList: true, subtree: true });
    };

    observeGitHub();
  }, []);

  return null;
}
