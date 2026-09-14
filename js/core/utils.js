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

  const IPV4_REGEX = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  const IPV4_CIDR_NOTATION_REGEX = new RegExp(`^(${IPV4_REGEX.source.slice(1, -1)})/(\\d{1,3})$`);
  const IPV6_HEX_GROUP = /^[0-9a-fA-F]{1,4}$/;

  function parseIPv4CidrNotation(value) {
    const match = IPV4_CIDR_NOTATION_REGEX.exec(String(value).trim());
    if (!match) return null;
    const cidr = Number(match[match.length - 1]);
    if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) return null;
    return { ip: match[1], cidr };
  }

  function isValidIPv4(value) {
    return typeof value === 'string' && IPV4_REGEX.test(value.trim());
  }

  function isValidCIDR(value, maxBits) {
    if (!/^\d{1,3}$/.test(String(value).trim())) return false;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= maxBits;
  }

  function isValidPositiveInteger(value, max) {
    if (!/^\d+$/.test(String(value).trim())) return false;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) return false;
    return max === undefined || parsed <= max;
  }

  function formatInteger(value) {
    return Number(value).toLocaleString('es-ES');
  }

  function formatBigInt(value) {
    return value.toLocaleString('es-ES');
  }

  function debounce(fn, waitMs) {
    let timeoutId = null;
    return function debounced(...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(null, args), waitMs);
    };
  }

  function detectPerformanceTier() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    return (cores >= 6 && memory >= 4) ? 'high' : 'low';
  }

  function renderTable(container, columns, rows) {
    container.textContent = '';

    const table = document.createElement('table');
    table.className = 'data-table';

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    columns.forEach((columnText) => {
      const th = document.createElement('th');
      th.textContent = columnText;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const fragment = document.createDocumentFragment();
    rows.forEach((rowValues) => {
      const tr = document.createElement('tr');
      rowValues.forEach((cellValue) => {
        const td = document.createElement('td');
        td.textContent = cellValue;
        tr.appendChild(td);
      });
      fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
    table.appendChild(tbody);
    container.appendChild(table);
  }

  global.NetTool = global.NetTool || {};
  global.NetTool.Utils = {
    IPV4_REGEX,
    IPV6_HEX_GROUP,
    isValidIPv4,
    isValidCIDR,
    isValidPositiveInteger,
    parseIPv4CidrNotation,
    formatInteger,
    formatBigInt,
    debounce,
    detectPerformanceTier,
    renderTable
  };
})(window);