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

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initCacheManager() {
    const StorageManager = global.NetTool && global.NetTool.StorageManager;
    const overlay = qs('#cache-modal-overlay');
    const modal = qs('#cache-modal');

    if (!StorageManager || !overlay || !modal) return;

    const openTriggers = qsa('[data-action="open-cache-modal"]');
    const closeTriggers = qsa('[data-action="close-cache-modal"]');
    const clearButton = qs('#cache-clear-btn');
    const sizeValueEl = qs('#cache-size-value');
    const sizeCountEl = qs('#cache-size-count');
    const feedbackEl = qs('#cache-feedback');
    const unavailableEl = qs('#cache-unavailable-notice');

    let lastFocusedElement = null;
    let lockedScrollY = 0;
    let closeTimeoutId = null;

    function isOpen() {
      return !modal.hidden && modal.classList.contains('is-visible');
    }

    function getFocusableElements() {
      return qsa('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
        .filter((el) => !el.disabled && el.getClientRects().length > 0);
    }

    function lockBodyScroll() {
      lockedScrollY = global.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.classList.add('cache-modal-locked');
      document.documentElement.classList.add('scroll-locked');
    }

    function unlockBodyScroll() {
      document.body.classList.remove('cache-modal-locked');
      document.documentElement.classList.remove('scroll-locked');
      document.body.style.top = '';
      global.scrollTo(0, lockedScrollY);
    }

    function clearFeedback() {
      if (!feedbackEl) return;
      feedbackEl.hidden = true;
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('is-success', 'is-empty');
    }

    function showFeedback(message, tone) {
      if (!feedbackEl) return;
      feedbackEl.textContent = message;
      feedbackEl.hidden = false;
      feedbackEl.classList.toggle('is-success', tone === 'success');
      feedbackEl.classList.toggle('is-empty', tone === 'empty');
    }

    function renderUsage() {
      const usage = StorageManager.getUsage();
      if (sizeValueEl) sizeValueEl.textContent = StorageManager.formatBytes(usage.bytes);
      if (sizeCountEl) {
        sizeCountEl.textContent = usage.count === 1
          ? '¡1 elemento almacenado!'
          : `¡${usage.count} elementos almacenados!`;
      }
      if (clearButton) clearButton.disabled = usage.count === 0;
      return usage;
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function openModal() {
      if (closeTimeoutId) {
        global.clearTimeout(closeTimeoutId);
        closeTimeoutId = null;
      }
      if (isOpen()) return;
      lastFocusedElement = document.activeElement;
      clearFeedback();
      const availableNow = StorageManager.isAvailable();
      if (unavailableEl) unavailableEl.hidden = availableNow;
      renderUsage();
      overlay.hidden = false;
      modal.hidden = false;
      requestAnimationFrame(() => {
        overlay.classList.add('is-visible');
        modal.classList.add('is-visible');
      });
      lockBodyScroll();
      document.addEventListener('keydown', handleKeydown);
      const focusable = getFocusableElements();
      if (focusable.length > 0) focusable[0].focus();
    }

    function closeModal() {
      if (!isOpen()) return;
      overlay.classList.remove('is-visible');
      modal.classList.remove('is-visible');
      document.removeEventListener('keydown', handleKeydown);
      unlockBodyScroll();
      closeTimeoutId = global.setTimeout(() => {
        overlay.hidden = true;
        modal.hidden = true;
        closeTimeoutId = null;
      }, 240);
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    openTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        trigger.classList.remove('is-spinning');
        void trigger.offsetWidth;
        trigger.classList.add('is-spinning');
        if (document.documentElement.classList.contains('perf-high')) {
          global.setTimeout(openModal, 150);
        } else {
          openModal();
        }
      });
      trigger.addEventListener('animationend', () => {
        trigger.classList.remove('is-spinning');
      });
      trigger.addEventListener('mouseenter', () => {
        trigger.classList.add('is-hovering');
      });
      trigger.addEventListener('mouseleave', () => {
        trigger.classList.remove('is-hovering');
      });
    });

    closeTriggers.forEach((trigger) => {
      trigger.addEventListener('click', closeModal);
    });

    if (clearButton) {
      clearButton.addEventListener('animationend', () => {
        clearButton.classList.remove('is-clearing');
      });

      clearButton.addEventListener('click', () => {
        const usageBefore = renderUsage();
        if (usageBefore.count === 0) {
          showFeedback('La caché ya está vacía. No hay datos locales que limpiar.', 'empty');
          return;
        }
        const freedBytes = usageBefore.bytes;
        const removedCount = StorageManager.clearAll();
        renderUsage();
        const freedLabel = StorageManager.formatBytes(freedBytes);
        const itemsLabel = removedCount === 1 ? 'elemento' : 'elementos';
        showFeedback(`¡Caché limpiada correctamente! Se liberaron: ${freedLabel} (${removedCount} ${itemsLabel}).`, 'success');
        clearButton.classList.remove('is-clearing');
        void clearButton.offsetWidth;
        clearButton.classList.add('is-clearing');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initCacheManager);
})(window);