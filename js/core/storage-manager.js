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

  const PREFIX = 'subnetlab.';
  const TAB_KEY = `${PREFIX}lastTab`;
  const VALID_TABS = ['ipv4', 'ipv6', 'flsm', 'vlsm', 'supernet'];

  function isAvailable() {
    try {
      const testKey = `${PREFIX}__probe__`;
      global.localStorage.setItem(testKey, '1');
      global.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getLastTab() {
    try {
      const value = global.localStorage.getItem(TAB_KEY);
      return VALID_TABS.indexOf(value) !== -1 ? value : null;
    } catch (error) {
      return null;
    }
  }

  function setLastTab(tabName) {
    if (VALID_TABS.indexOf(tabName) === -1) return false;
    try {
      global.localStorage.setItem(TAB_KEY, tabName);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getAppKeys() {
    const keys = [];
    try {
      for (let i = 0; i < global.localStorage.length; i += 1) {
        const key = global.localStorage.key(i);
        if (typeof key === 'string' && key.indexOf(PREFIX) === 0) {
          keys.push(key);
        }
      }
    } catch (error) {
      return [];
    }
    return keys;
  }

  function getUsage() {
    const keys = getAppKeys();
    let bytes = 0;
    keys.forEach((key) => {
      let value = '';
      try {
        value = global.localStorage.getItem(key) || '';
      } catch (error) {
        value = '';
      }
      bytes += (key.length + value.length) * 2;
    });
    return { bytes, count: keys.length, keys };
  }

  function clearAll() {
    const keys = getAppKeys();
    let removed = 0;
    keys.forEach((key) => {
      try {
        global.localStorage.removeItem(key);
        removed += 1;
      } catch (error) {
        removed += 0;
      }
    });
    return removed;
  }

  function formatBytes(bytes) {
    const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
    if (safeBytes < 1024) return `${safeBytes} B`;
    const kb = safeBytes / 1024;
    if (kb < 1024) return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  global.NetTool = global.NetTool || {};
  global.NetTool.StorageManager = {
    PREFIX,
    TAB_KEY,
    VALID_TABS,
    isAvailable,
    getLastTab,
    setLastTab,
    getUsage,
    clearAll,
    formatBytes
  };
})(window);