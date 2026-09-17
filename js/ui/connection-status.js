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

  const BANNER_AUTO_HIDE_MS = 15000;
  const BANNER_EXIT_MS = 245;

  let hideTimeoutId = null;
  let exitTimeoutId = null;

  function clearPendingHide() {
    if (hideTimeoutId !== null) {
      global.clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }
  }

  function clearPendingExit() {
    if (exitTimeoutId !== null) {
      global.clearTimeout(exitTimeoutId);
      exitTimeoutId = null;
    }
  }

  function isPdfLibraryLoaded() {
    return typeof global.jspdf !== 'undefined';
  }

  function getOfflineMessage() {
    return isPdfLibraryLoaded()
      ? 'Sin conexión a internet. Los cálculos seguirán funcionando con normalidad, ya que se ejecutan localmente en su navegador. La exportación en formato PDF sigue disponible, ya que la librería necesaria ya se encuentra cargada en esta sesión.'
      : 'Sin conexión a internet. Los cálculos seguirán funcionando con normalidad, ya que se ejecutan localmente en su navegador. La exportación en formato PDF no está disponible en este momento, ya que requiere una librería externa que aún no ha podido descargarse.';
  }

  function getOnlineMessage() {
    return 'Conexión a internet restablecida. Todas las funciones de SubnetLab, incluyendo la exportación en formato PDF, se encuentran disponibles nuevamente.';
  }

  function initConnectionStatus() {
    const banner = document.getElementById('connection-banner');
    const textEl = document.getElementById('connection-banner-text');
    const closeButton = document.getElementById('connection-banner-close');
    if (!banner || !textEl) return;

    function showBanner() {
      clearPendingExit();
      banner.hidden = false;
      global.requestAnimationFrame(() => {
        banner.classList.add('is-visible');
      });
    }

    function hideBanner() {
      clearPendingHide();
      clearPendingExit();
      banner.classList.remove('is-visible');
      exitTimeoutId = global.setTimeout(() => {
        banner.hidden = true;
        exitTimeoutId = null;
      }, BANNER_EXIT_MS);
    }

    function handleOffline() {
      clearPendingHide();
      banner.classList.remove('is-online');
      banner.classList.add('is-offline');
      textEl.textContent = getOfflineMessage();
      showBanner();
      hideTimeoutId = global.setTimeout(hideBanner, BANNER_AUTO_HIDE_MS);
    }

    function handleOnline() {
      clearPendingHide();
      banner.classList.remove('is-offline');
      banner.classList.add('is-online');
      textEl.textContent = getOnlineMessage();
      showBanner();
      hideTimeoutId = global.setTimeout(hideBanner, BANNER_AUTO_HIDE_MS);
    }

    if (closeButton) {
      closeButton.addEventListener('click', hideBanner);
    }

    global.addEventListener('offline', handleOffline);
    global.addEventListener('online', handleOnline);

    if (global.navigator && global.navigator.onLine === false) {
      handleOffline();
    }
  }

  document.addEventListener('DOMContentLoaded', initConnectionStatus);
})(window);