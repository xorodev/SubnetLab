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

  const STORAGE_KEY = 'subnetlab.theme';

  function persistTheme(theme) {
    try {
      global.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* localStorage no disponible: el tema no persiste entre sesiones */
    }
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateToggleLabel(button, theme) {
    const label = theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  }

  function initThemeToggle() {
    const button = document.querySelector('[data-action="toggle-theme"]');
    if (!button) return;

    updateToggleLabel(button, currentTheme());

    button.addEventListener('click', () => {
      const nextTheme = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      persistTheme(nextTheme);
      updateToggleLabel(button, nextTheme);
    });
  }

  document.addEventListener('DOMContentLoaded', initThemeToggle);
})(window);