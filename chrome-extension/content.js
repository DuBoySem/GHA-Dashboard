try {
  console.log("🔥 CI/CD extension loaded 22");
  // Always update the stored repo URL for context, regardless of page
  localStorage.setItem('gha_repo_url', window.location.pathname.split('/').slice(1, 3).join('/'));
  (function () {
    console.log("🔥 Injecting CI/CD tabs", window.location.pathname);
    // const isRepoRoot = /^\/[^/]+\/[^/]+\/?$/.test(window.location.pathname);
    // if (!isRepoRoot) return;

    const navBar = document.querySelector('ul.UnderlineNav-body');
    if (!navBar) {
      console.warn("⚠️ CI/CD tab: navbar not found");
      return;
    }
    // Prevent tab from being injected in Insights sidebar
    // if (window.location.pathname.includes('/graphs/')) return;

    // Prevent duplication
    // if (document.querySelector('#cicd-tab')) return;

    const [_, owner, repo] = window.location.pathname.split('/');
    const tab = document.createElement('a');
    tab.className = 'UnderlineNav-item no-wrap js-responsive-underlinenav-item';
    tab.id = 'cicd-tab';
    tab.href = `/${owner}/${repo}`;
    tab.setAttribute('data-tab-item', 'ci-cd-tab');
    tab.setAttribute('data-selected-links', '/satnam-walia/gha-dashboard-pipeline');
    tab.setAttribute('data-pjax', '#repo-content-pjax-container');
    tab.setAttribute('data-turbo-frame', 'repo-content-turbo-frame');
    tab.setAttribute('data-analytics-event', JSON.stringify({
      category: "Underline navbar",
      action: "Click tab",
      label: "CI/CD",
      target: "UNDERLINE_NAV.TAB"
    }));
    tab.setAttribute('data-view-component', 'true');
    // tab.target = '_blank';
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove selected class from all tabs
      document.querySelectorAll('.UnderlineNav-item').forEach(el => {
        el.classList.remove('selected', 'js-selected-navigation-item');
      });

      // Deselect the default selected nav item (e.g., Code)
      const defaultSelected = document.querySelector('.UnderlineNav-item.selected');
      if (defaultSelected) {
        defaultSelected.classList.remove('selected', 'js-selected-navigation-item');
      }

      // Add selected classes to CI/CD tab
      tab.classList.add('selected', 'js-selected-navigation-item');

      // Hide selection on Code tab when CI/CD is selected
      const codeTab = document.querySelector('a[data-tab-item="i0code-tab"]');
      if (codeTab) {
        codeTab.removeAttribute('aria-current');
        codeTab.classList.remove('selected', 'js-selected-navigation-item');
      }

      const contentArea = document.querySelector('#repo-content-pjax-container');
      if (contentArea) {
        contentArea.innerHTML = `
          <div id="ci-cd-placeholder" style="padding:2rem;">
            <h1 style="font-size: 24px;">CI/CD Metrics</h1>
            <p>This is a placeholder for future dashboard content.</p>
          </div>
        `;
      }

      const repoHeader = document.querySelector('#repository-container-header');
      if (repoHeader) {
        repoHeader.textContent = ''; // remove previous header content
      }
    });

    // tab.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   // if (document.querySelector('#gha-dashboard-frame')) return;
    //   // const iframe = document.createElement('iframe');
    //   // iframe.id = 'gha-dashboard-frame';
    //   // iframe.src = `http://localhost:5173`;
    //   // iframe.style = 'position:fixed;top:60px;right:20px;width:420px;height:80vh;z-index:10000;border:1px solid #ccc;border-radius:6px;background:white;';
    //   // document.body.appendChild(iframe);
    //   const [_, owner, repo] = window.location.pathname.split('/');
    //   // Navigate to dashboard view like GitHub's native tab content
    //   window.location.pathname = `/${owner}/${repo}/actions/dashboard`;
    // });
    //tab.href = `https://gha-dashboard.vercel.app?repo=${owner}/${repo}`;
    tab.innerHTML = `
      <svg class="octicon" aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
        <path fill-rule="evenodd" d="M3 2.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0v-9a.5.5 0 01.5-.5zm4.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5z"></path>
      </svg>
      <span data-content="CI/CD">CI/CD</span>
    `;

    const insightsTab = Array.from(navBar.querySelectorAll('a')).find(a => a.textContent.trim() === 'Insights');

    const dropdownUl = document.querySelector('.UnderlineNav-actions ul[role="menu"]');
    if (dropdownUl && !document.querySelector('#cicd-tab-dropdown')) {
      const newDropdownLi = document.createElement('li');
      newDropdownLi.className = 'ActionListItem';
      newDropdownLi.setAttribute('data-menu-item', 'ci-cd-tab');
      newDropdownLi.setAttribute('role', 'none');
      newDropdownLi.setAttribute('data-view-component', 'true');

      const dropdownLink = document.createElement('a');
      dropdownLink.className = 'ActionListContent ActionListContent--visual16';
      dropdownLink.id = 'cicd-tab-dropdown';
      dropdownLink.href = `/${owner}/${repo}`;
      dropdownLink.setAttribute('role', 'menuitem');
      dropdownLink.setAttribute('tabindex', '-1');
      dropdownLink.setAttribute('data-view-component', 'true');

      dropdownLink.innerHTML = `
        <span class="ActionListItem-visual ActionListItem-visual--leading">
          <svg class="octicon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
            <path d="M3 2.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0v-9a.5.5 0 01.5-.5zm4.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5z"></path>
          </svg>
        </span>
        <span class="ActionListItem-label">CI/CD</span>
      `;

      newDropdownLi.appendChild(dropdownLink);
      const insightsItem = Array.from(dropdownUl.children).find(
        (li) => li.getAttribute('data-menu-item') === 'i7insights-tab'
      );
      const settingsItem = Array.from(dropdownUl.children).find(
        (li) => li.getAttribute('data-menu-item') === 'i8settings-tab'
      );

      if (insightsItem && insightsItem.nextSibling) {
        dropdownUl.insertBefore(newDropdownLi, insightsItem.nextSibling);
      } else if (settingsItem) {
        dropdownUl.insertBefore(newDropdownLi, settingsItem);
      } else {
        dropdownUl.appendChild(newDropdownLi);
      }

      dropdownLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.UnderlineNav-item').forEach(el => {
          el.classList.remove('selected', 'js-selected-navigation-item');
        });

        const defaultSelected = document.querySelector('.UnderlineNav-item.selected');
        if (defaultSelected) {
          defaultSelected.classList.remove('selected', 'js-selected-navigation-item');
        }

        tab.classList.add('selected', 'js-selected-navigation-item');

        const codeTab = document.querySelector('a[data-tab-item="i0code-tab"]');
        if (codeTab) {
          codeTab.removeAttribute('aria-current');
          codeTab.classList.remove('selected', 'js-selected-navigation-item');
        }

        const contentArea = document.querySelector('#repo-content-pjax-container');
        if (contentArea) {
          contentArea.innerHTML = `
            <div id="ci-cd-placeholder" style="padding:2rem;">
              <h1 style="font-size: 24px;">CI/CD Metrics</h1>
              <p>This is a placeholder for future dashboard content.</p>
            </div>
          `;
        }

        const repoHeader = document.querySelector('#repository-container-header');
        if (repoHeader) {
          repoHeader.textContent = '';
        }
      });
    }

    if (insightsTab) {
      // Mirror Insights tab's visibility and structure for CI/CD tab
      const ciItem = document.createElement('li');
      ciItem.className = 'd-inline-flex';
      ciItem.setAttribute('data-view-component', 'true');

      // Copy classes and attributes for consistency
      tab.classList.add('js-selected-navigation-item');
      tab.style.visibility = insightsTab.style.visibility === 'hidden' ? 'hidden' : 'visible';

      ciItem.appendChild(tab);

      const li = insightsTab?.closest('li');
      if (li && li.parentElement) {
        li.parentElement.insertBefore(ciItem, li.nextSibling);
      } else {
        navBar.appendChild(ciItem);
      }
    } else if (!insightsTab) {
      const fallbackItem = document.createElement('li');
      fallbackItem.className = 'd-inline-flex';
      fallbackItem.setAttribute('data-view-component', 'true');
      fallbackItem.appendChild(tab);
      navBar.appendChild(fallbackItem);
    }
  })();
} catch (error) {
  console.error("Error injecting CI/CD tab:", error);
}