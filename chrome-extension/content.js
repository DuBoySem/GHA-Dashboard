function handleCiCdClick(e, triggerEl) {
  e.preventDefault();

  // Always deselect all tabs
  document.querySelectorAll('.UnderlineNav-item').forEach(el => {
    el.classList.remove('selected', 'js-selected-navigation-item');
    el.removeAttribute('aria-current');
  });

  // Remove previously injected CI/CD placeholder if any
  const existingPlaceholder = document.querySelector('#ci-cd-placeholder');
  if (existingPlaceholder) existingPlaceholder.remove();

  // Force re-select even if already selected
  triggerEl.classList.add('selected', 'js-selected-navigation-item');
  triggerEl.setAttribute('aria-current', 'page');

  // Reinject the placeholder content
  const appMain = document.querySelector('.application-main');
  if (appMain) {
    appMain.innerHTML = `
      <div class="application-main" data-commit-hovercards-enabled="" data-discussion-hovercards-enabled="" data-issue-and-pr-hovercards-enabled="" data-project-hovercards-enabled="">
        <div itemscope="" itemtype="http://schema.org/SoftwareSourceCode" class="">
          <main id="js-repo-pjax-container">
            <div id="repository-container-header" data-turbo-replace="" hidden=""></div>
            <turbo-frame id="repo-content-turbo-frame" target="_top" data-turbo-action="advance" class="">
              <div id="repo-content-pjax-container" class="repository-content ">
                <div id="ci-cd-placeholder" style="padding:2rem;">
                  <h1 style="font-size: 24px;">CI/CD Metrics</h1>
                  <p>This is a placeholder for future dashboard content.</p>
                </div>
              </div>
            </turbo-frame>
          </main>
        </div>
      </div>
    `;

    // Re-attach the CI/CD click listener
    const newCiCdTab = document.querySelector('[data-tab-item="ci-cd-tab"]');
    if (newCiCdTab) {
      newCiCdTab.addEventListener('click', (ev) => handleCiCdClick(ev, newCiCdTab));
    }
  }

  // Optionally reset header (clearing existing one)
  const repoHeader = document.querySelector('#repository-container-header');
  if (repoHeader) {
    repoHeader.textContent = '';
  }
}

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
    const handleClick = (e) => handleCiCdClick(e, tab);
    tab.className = 'UnderlineNav-item no-wrap js-responsive-underlinenav-item';
    tab.id = 'cicd-tab';
    tab.href = '#';
    tab.removeAttribute('data-pjax');
    tab.removeAttribute('data-turbo-frame');
    tab.setAttribute('data-tab-item', 'ci-cd-tab');
    tab.setAttribute('data-selected-links', '/satnam-walia/gha-dashboard-pipeline');
    tab.setAttribute('data-analytics-event', JSON.stringify({
      category: "Underline navbar",
      action: "Click tab",
      label: "CI/CD",
      target: "UNDERLINE_NAV.TAB"
    }));
    tab.setAttribute('data-view-component', 'true');

    tab.addEventListener('click', handleClick);

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
      dropdownLink.href = '#';
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

      dropdownLink.addEventListener('click', handleClick);
    }

    if (insightsTab) {
      // Mirror Insights tab's visibility and structure for CI/CD tab
      const ciItem = document.createElement('li');
      ciItem.className = 'd-inline-flex';
      ciItem.setAttribute('data-view-component', 'true');

      // Copy classes and attributes for consistency
      // Removed: tab.classList.add('js-selected-navigation-item');
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

    const currentPath = window.location.pathname;
    const expectedPath = `/${owner}/${repo}`;
    if (currentPath === expectedPath) {
      handleCiCdClick(new MouseEvent('click'), tab);
    }
  })();
} catch (error) {
  console.error("Error injecting CI/CD tab:", error);
}