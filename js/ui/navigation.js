/*
  SubnetLab: Interactive laboratory for extreme IP address subnetting (IPv4/IPv6).
  Copyright (C) 2026 @xorodev (CipherCoreDev)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.

  GitHub: https://github.com/xorodev
  Contact:
    a. Email: corex.dev@proton.me
    b. Telegram: https://t.me/xorodev
*/
(function (global) {
  'use strict';

  const STORAGE_KEY = 'subnetlab.sidebarCollapsed';
  const DESKTOP_QUERY = '(min-width: 960px)';

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function isDesktop() {
    return Boolean(global.matchMedia) && global.matchMedia(DESKTOP_QUERY).matches;
  }

  function persistCollapsed(collapsed) {
    try {
      global.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch (error) {
      /* localStorage no disponible: el estado no persiste entre sesiones */
    }
  }

  function initSidebarNavigation() {
    const root = document.documentElement;
    const sidebar = qs('#app-sidebar');
    const overlay = qs('#sidebar-overlay');
    const primaryToggle = qs('.sidebar-toggle');
    const toggleEls = qsa('[data-action="toggle-sidebar"]');
    const navButtons = qsa('.tab-button', sidebar);
    const pageTitle = qs('#page-title');
    const pageSubtitle = qs('#page-subtitle');

    if (!sidebar) return;

    function isMobileOpen() {
      return sidebar.classList.contains('is-open');
    }

    function isDesktopCollapsed() {
      return root.classList.contains('sidebar-collapsed');
    }

    function updateToggleState() {
      const expanded = isDesktop() ? !isDesktopCollapsed() : isMobileOpen();
      toggleEls.forEach((el) => el.setAttribute('aria-expanded', String(expanded)));
      if (primaryToggle) {
        const label = expanded
          ? 'Ocultar menú de navegación (Ctrl+B)'
          : 'Mostrar menú de navegación (Ctrl+B)';
        primaryToggle.setAttribute('aria-label', label);
        primaryToggle.setAttribute('title', label);
      }
    }

    let lockedScrollY = 0;

    function lockBodyScroll() {
      lockedScrollY = global.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.classList.add('sidebar-locked');
      root.classList.add('scroll-locked');
    }

    function unlockBodyScroll() {
      document.body.classList.remove('sidebar-locked');
      root.classList.remove('scroll-locked');
      document.body.style.top = '';
      global.scrollTo(0, lockedScrollY);
    }

    function openMobileSidebar() {
      sidebar.classList.add('is-open');
      if (overlay) {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add('is-visible'));
      }
      lockBodyScroll();
      updateToggleState();
    }

    function closeMobileSidebar() {
      if (!isMobileOpen()) return;
      sidebar.classList.remove('is-open');
      if (overlay) {
        overlay.classList.remove('is-visible');
        global.setTimeout(() => {
          if (!isMobileOpen()) overlay.hidden = true;
        }, 240);
      }
      unlockBodyScroll();
      updateToggleState();
    }

    function setDesktopCollapsed(collapsed) {
      root.classList.toggle('sidebar-collapsed', collapsed);
      persistCollapsed(collapsed);
      updateToggleState();
    }

    function toggleSidebar() {
      if (isDesktop()) {
        setDesktopCollapsed(!isDesktopCollapsed());
      } else if (isMobileOpen()) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    }

    function updateHeading(button) {
      if (!button) return;
      if (pageTitle) pageTitle.textContent = button.dataset.title || button.textContent.trim();
      if (pageSubtitle) pageSubtitle.textContent = button.dataset.subtitle || '';
    }

    function handleNavClick(button) {
      updateHeading(button);
      if (!isDesktop()) closeMobileSidebar();
    }

    toggleEls.forEach((el) => {
      el.addEventListener('click', (event) => {
        event.preventDefault();
        toggleSidebar();
      });
    });

    navButtons.forEach((button) => {
      button.addEventListener('click', () => handleNavClick(button));
    });

    document.addEventListener('keydown', (event) => {
      const isToggleShortcut = (event.ctrlKey || event.metaKey)
        && !event.shiftKey
        && !event.altKey
        && event.key.toLowerCase() === 'b';

      if (isToggleShortcut) {
        event.preventDefault();
        toggleSidebar();
        return;
      }

      if (event.key === 'Escape' && !isDesktop() && isMobileOpen()) {
        closeMobileSidebar();
      }
    });

    if (global.matchMedia) {
      const desktopQuery = global.matchMedia(DESKTOP_QUERY);
      const handleBreakpointChange = () => {
        if (isDesktop()) closeMobileSidebar();
        updateToggleState();
      };
      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', handleBreakpointChange);
      } else if (desktopQuery.addListener) {
        desktopQuery.addListener(handleBreakpointChange);
      }
    }

    updateToggleState();

    const initialActive = navButtons.find((btn) => btn.classList.contains('is-active')) || navButtons[0];
    updateHeading(initialActive);
  }

  document.addEventListener('DOMContentLoaded', initSidebarNavigation);
})(window);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = 'SubnetLab · v1.1.0';
  } else {
    document.title = 'SubnetLab';
  }
});