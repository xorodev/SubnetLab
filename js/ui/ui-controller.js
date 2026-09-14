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

  const Utils = global.NetTool.Utils;
  const CoreV4 = global.NetTool.CoreV4;
  const CoreV6 = global.NetTool.CoreV6;
  const Engine = global.NetTool.Engine;
  const PdfExport = global.NetTool.PdfExport;
  const StorageManager = global.NetTool.StorageManager;

  const state = { ipv4: null, ipv6: null, flsm: null, vlsm: null, supernet: null };

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function showError(boxEl, message) {
    boxEl.textContent = message;
    boxEl.hidden = false;
  }

  function clearError(boxEl) {
    boxEl.textContent = '';
    boxEl.hidden = true;
  }

  const SECTION_NAMES = {
    ipv4: 'la "Calculadora IPv4"',
    ipv6: 'la "Calculadora IPv6"',
    flsm: 'el "Cálculo FLSM"',
    vlsm: 'el "Cálculo VLSM"',
    supernet: 'el "Supernetting"'
  };

  function pdfDisabledMessage(target) {
    return `No se puede generar el reporte en PDF de ${SECTION_NAMES[target]} en este momento porque faltan datos por calcular o hay un error en los valores ingresados. Por favor, verifique los datos e inténtelo de nuevo para exportar su resultado.`;
  }

  function pdfEnabledMessage(target) {
    return `¡Todo listo! El reporte de ${SECTION_NAMES[target]} se completó correctamente y ya puede exportarlo en formato PDF.`;
  }

  function toggleExportButton(target, enabled) {
    const btn = qs(`button[data-action="export-pdf"][data-target="${target}"]`);
    const hint = qs(`#${target}-pdf-hint`);
    if (btn) {
      btn.disabled = !enabled;
      btn.title = enabled ? pdfEnabledMessage(target) : pdfDisabledMessage(target);
    }
    if (hint) {
      hint.textContent = enabled ? pdfEnabledMessage(target) : pdfDisabledMessage(target);
      hint.classList.toggle('is-ready', enabled);
    }
  }

  function createTableBlock(heading, columns, rows) {
    const block = document.createElement('div');
    block.className = 'table-block';

    const title = document.createElement('h3');
    title.textContent = heading;

    const scrollWrap = document.createElement('div');
    scrollWrap.className = 'table-scroll';
    Utils.renderTable(scrollWrap, columns, rows);

    block.append(title, scrollWrap);
    return block;
  }

  function switchTab(tabName) {
    qsa('.tab-button').forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.setAttribute('aria-selected', String(isActive));
      btn.classList.toggle('is-active', isActive);
    });
    qsa('.panel').forEach((panel) => {
      panel.hidden = panel.id !== `panel-${tabName}`;
    });
    if (StorageManager) StorageManager.setLastTab(tabName);
  }

  function initTabs() {
    qsa('.tab-button').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
  }

  function runIPv4Calculation() {
    const address = qs('#ipv4-address').value.trim();
    const cidr = qs('#ipv4-cidr').value.trim();
    const errorBox = qs('#ipv4-error');
    const resultsContainer = qs('#ipv4-results');

    if (!address && !cidr) {
      clearError(errorBox);
      resultsContainer.textContent = '';
      toggleExportButton('ipv4', false);
      return;
    }

    clearError(errorBox);

    if (!Utils.isValidIPv4(address)) {
      showError(errorBox, 'La dirección IPv4 ingresada no es válida. Debe tener cuatro octetos separados por puntos, cada uno con un valor entre 0 y 255 (por ejemplo: "192.168.1.10"). Verifique que no falten octetos ni haya caracteres adicionales.');
      resultsContainer.textContent = '';
      toggleExportButton('ipv4', false);
      return;
    }
    if (!Utils.isValidCIDR(cidr, 32)) {
      showError(errorBox, 'El prefijo CIDR ingresado no es válido. Debe ser un número entero comprendido entre 0 y 32, sin decimales ni caracteres adicionales.');
      resultsContainer.textContent = '';
      toggleExportButton('ipv4', false);
      return;
    }

    try {
      const result = CoreV4.calculateIPv4(address, Number(cidr));
      state.ipv4 = result;
      renderIPv4Results(result, resultsContainer);
      toggleExportButton('ipv4', true);
    } catch (error) {
      showError(errorBox, `No fue posible completar el proceso correctamente: ${error.message}. Por favor, vuelva a revisar los datos ingresados e inténtelo nuevamente.`);
      resultsContainer.textContent = '';
      toggleExportButton('ipv4', false);
    }
  }

  function renderIPv4Results(result, container) {
    container.textContent = '';

    container.append(
      createTableBlock('Información General', ['Campo', 'Valor'], [
        ['Dirección IP', result.inputAddress],
        ['Dirección IP (Binario)', result.inputAddressBinary],
        ['Clase de Dirección', result.ipClass],
        ['Ámbito', result.scope],
        ['Prefijo CIDR', `/${result.cidr}`]
      ]),
      createTableBlock('Máscaras', ['Campo', 'Valor'], [
        ['Máscara de Subred (Decimal)', result.subnetMask],
        ['Máscara de Subred (Binario)', result.subnetMaskBinary],
        ['Máscara Wildcard', result.wildcardMask]
      ]),
      createTableBlock('Rango de Red', ['Campo', 'Valor'], [
        ['Dirección de Red', result.networkAddress],
        ['Dirección de Red (Binario)', result.networkBinary],
        ['Dirección de Broadcast', result.broadcastAddress],
        ['Dirección de Broadcast (Binario)', result.broadcastBinary],
        ['Primera IP Utilizable', result.firstUsable],
        ['Última IP Utilizable', result.lastUsable],
        ['Total de Direcciones', Utils.formatInteger(result.totalAddresses)],
        ['Hosts Utilizables', Utils.formatInteger(result.usableHosts)]
      ])
    );
  }

  function runIPv6Calculation() {
    const address = qs('#ipv6-address').value.trim();
    const prefix = qs('#ipv6-prefix').value.trim();
    const errorBox = qs('#ipv6-error');
    const resultsContainer = qs('#ipv6-results');

    if (!address && !prefix) {
      clearError(errorBox);
      resultsContainer.textContent = '';
      toggleExportButton('ipv6', false);
      return;
    }

    clearError(errorBox);

    if (!address) {
      showError(errorBox, 'Ingrese una dirección IPv6 para continuar. Puede utilizar su forma expandida o comprimida, por ejemplo: "2001:db8::1"');
      resultsContainer.textContent = '';
      toggleExportButton('ipv6', false);
      return;
    }
    if (!Utils.isValidCIDR(prefix, 128)) {
      showError(errorBox, 'El prefijo ingresado no es válido. Debe ser un número entero comprendido entre 0 y 128, sin decimales ni caracteres adicionales.');
      resultsContainer.textContent = '';
      toggleExportButton('ipv6', false);
      return;
    }

    try {
      const result = CoreV6.calculateIPv6(address, Number(prefix));
      state.ipv6 = result;
      renderIPv6Results(result, resultsContainer);
      toggleExportButton('ipv6', true);
    } catch (error) {
      showError(errorBox, `No fue posible completar el proceso correctamente: ${error.message}. Por favor, vuelva a revisar el formato de la dirección e inténtelo nuevamente.`);
      resultsContainer.textContent = '';
      toggleExportButton('ipv6', false);
    }
  }

  function renderIPv6Results(result, container) {
    container.textContent = '';

    container.append(
      createTableBlock('Información General', ['Campo', 'Valor'], [
        ['Dirección Comprimida', result.compressedInput],
        ['Dirección Expandida', result.expandedInput],
        ['Ámbito', result.scope],
        ['Prefijo', `/${result.prefix}`]
      ]),
      createTableBlock('Máscaras', ['Campo', 'Valor'], [
        ['Máscara de Subred (Hexadecimal)', result.subnetMaskHex],
        ['Máscara de Subred (Binario)', result.subnetMaskBinary],
        ['Máscara Wildcard (Hexadecimal)', result.wildcardHex],
        ['Máscara Wildcard (Binario)', result.wildcardBinary]
      ]),
      createTableBlock('Rango de Red', ['Campo', 'Valor'], [
        ['Dirección de Red', result.networkAddress],
        ['Última Dirección del Bloque', result.lastAddress],
        ['Primera IP Utilizable', result.firstUsable],
        ['Última IP Utilizable', result.lastUsable],
        ['Total de Direcciones', Utils.formatBigInt(result.totalAddresses)],
        ['Direcciones Utilizables', Utils.formatBigInt(result.usableAddresses)]
      ])
    );
  }

  function runFLSMCalculation() {
    const baseIp = qs('#flsm-base-ip').value.trim();
    const baseCidr = qs('#flsm-base-cidr').value.trim();
    const mode = qs('#flsm-mode').value;
    const value = qs('#flsm-value').value.trim();
    const errorBox = qs('#flsm-error');
    const resultsContainer = qs('#flsm-results');
    const summaryLine = qs('#flsm-summary');

    if (!baseIp && !baseCidr && !value) {
      clearError(errorBox);
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('flsm', false);
      return;
    }

    clearError(errorBox);

    if (!Utils.isValidIPv4(baseIp)) {
      showError(errorBox, 'La dirección de red base no es válida. Ingrese una dirección IPv4 con cuatro octetos separados por puntos, cada uno entre 0 y 255 (por ejemplo: "192.168.0.0").');
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('flsm', false);
      return;
    }
    if (!Utils.isValidCIDR(baseCidr, 32)) {
      showError(errorBox, 'El CIDR base no es válido. Debe ser un número entero comprendido entre 0 y 32.');
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('flsm', false);
      return;
    }
    if (!Utils.isValidPositiveInteger(value)) {
      showError(errorBox, 'La cantidad requerida no es válida. Ingrese un número entero positivo (mayor o igual a 1), ya sea de subredes o de hosts según la opción seleccionada.');
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('flsm', false);
      return;
    }

    try {
      const result = Engine.calculateFLSM(baseIp, Number(baseCidr), Number(value), mode);
      state.flsm = result;
      renderFLSMResults(result, resultsContainer, summaryLine);
      toggleExportButton('flsm', true);
    } catch (error) {
      showError(errorBox, `No fue posible completar el proceso correctamente: ${error.message}. Por favor, debe de ajustar la cantidad solicitada o el tamaño de la red base e inténtelo de nuevo.`);
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('flsm', false);
    }
  }

  function renderFLSMResults(result, container, summaryLine) {
    summaryLine.textContent = `Prefijo original: "/${result.baseCidr}" -> Nuevo prefijo: "/${result.newCidr}" (se toman prestados: ${result.bitsBorrowed} bits) • ${result.subnetsGenerated} subredes generadas • ${Utils.formatInteger(result.hostsPerSubnet)} hosts utilizables por subred`;

    const rows = result.subnets.map((subnet) => [
      String(subnet.subnetIndex),
      `${subnet.networkAddress}/${subnet.cidr}`,
      subnet.subnetMask,
      subnet.broadcastAddress,
      subnet.firstUsable,
      subnet.lastUsable,
      Utils.formatInteger(subnet.usableHosts)
    ]);

    container.textContent = '';
    container.appendChild(createTableBlock('Subredes Generadas', ['#', 'Red', 'Máscara', 'Broadcast', 'Primera IP', 'Última IP', 'Hosts'], rows));
  }

  function collectVLSMRequirements() {
    return qsa('#vlsm-requirements .dynamic-row').map((row) => {
      const hostsRaw = qs('.vlsm-hosts', row).value.trim();
      return {
        label: qs('.vlsm-label', row).value.trim() || '(Sin nombre)',
        hostsRaw,
        hosts: Utils.isValidPositiveInteger(hostsRaw) ? Number(hostsRaw) : NaN
      };
    });
  }

  function runVLSMCalculation() {
    const baseIp = qs('#vlsm-base-ip').value.trim();
    const baseCidr = qs('#vlsm-base-cidr').value.trim();
    const errorBox = qs('#vlsm-error');
    const resultsContainer = qs('#vlsm-results');
    const summaryLine = qs('#vlsm-summary');

    if (!baseIp && !baseCidr) {
      clearError(errorBox);
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('vlsm', false);
      return;
    }

    clearError(errorBox);

    if (!Utils.isValidIPv4(baseIp)) {
      showError(errorBox, 'La dirección de red base no es válida. Ingrese una dirección IPv4 con cuatro octetos separados por puntos, cada uno entre 0 y 255 (por ejemplo: "192.168.0.0").');
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('vlsm', false);
      return;
    }
    if (!Utils.isValidCIDR(baseCidr, 32)) {
      showError(errorBox, 'El CIDR base no es válido. Debe ser un número entero comprendido entre 0 y 32.');
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('vlsm', false);
      return;
    }

    const requirements = collectVLSMRequirements();
    const hasInvalidHosts = requirements.some((req) => !Number.isInteger(req.hosts) || req.hosts < 1);

    if (requirements.length === 0 || hasInvalidHosts) {
      showError(errorBox, 'Cada subred debe indicar una cantidad de hosts válida (un número entero igual o mayor a 1). Vuelva a revisar que ningún campo de hosts esté vacío, en cero o con un valor negativo.');
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('vlsm', false);
      return;
    }

    try {
      const result = Engine.calculateVLSM(baseIp, Number(baseCidr), requirements);
      state.vlsm = result;
      renderVLSMResults(result, resultsContainer, summaryLine);
      toggleExportButton('vlsm', true);
    } catch (error) {
      showError(errorBox, `No fue posible completar el proceso correctamente: ${error.message}. Considere ampliar el prefijo de la red base o reducir los hosts solicitados.`);
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('vlsm', false);
    }
  }

  function renderVLSMResults(result, container, summaryLine) {
    summaryLine.textContent = `Red base: "${result.baseNetwork}/${result.baseCidr}" • ${result.allocations.length} subrede(s) asignadas • ${Utils.formatInteger(result.remainingAddresses)} direcciones restantes en el bloque.`;

    const rows = result.allocations.map((allocation) => [
      allocation.label,
      Utils.formatInteger(allocation.hostsRequested),
      `${allocation.networkAddress}/${allocation.cidr}`,
      allocation.subnetMask,
      allocation.broadcastAddress,
      allocation.firstUsable,
      allocation.lastUsable,
      Utils.formatInteger(allocation.usableHosts),
      Utils.formatInteger(allocation.wastedAddresses)
    ]);

    container.textContent = '';
    container.appendChild(createTableBlock(
      'Asignación VLSM',
      ['Nombre', 'Hosts Solicitados', 'Red', 'Máscara', 'Broadcast', 'Primera IP', 'Última IP', 'Hosts Disponibles', 'Desperdicio'],
      rows
    ));
  }

  function collectSupernetEntries() {
    return qsa('#supernet-entries .supernet-network')
      .map((input) => input.value.trim())
      .filter(Boolean);
  }

  function runSupernetCalculation() {
    const errorBox = qs('#supernet-error');
    const resultsContainer = qs('#supernet-results');
    const summaryLine = qs('#supernet-summary');
    const entries = collectSupernetEntries();

    if (entries.length === 0) {
      clearError(errorBox);
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('supernet', false);
      return;
    }

    clearError(errorBox);

    if (entries.length < 2) {
      showError(errorBox, 'Ingrese al menos dos redes en formato (Dirección_IP/CIDR) para poder calcular una ruta de resumen. Añada una red adicional con el botón de: "+ Añadir red"');
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('supernet', false);
      return;
    }

    for (const entry of entries) {
      if (!Utils.parseIPv4CidrNotation(entry)) {
        showError(errorBox, `El formato de la red "${entry}" no es válido. Utilice el formato (Dirección_IP/CIDR), por ejemplo: "192.168.0.0/24", con octetos entre 0 y 255 y un prefijo entre 0 y 32.`);
        resultsContainer.textContent = '';
        summaryLine.textContent = '';
        toggleExportButton('supernet', false);
        return;
      }
    }

    try {
      const result = Engine.calculateSupernet(entries);
      state.supernet = result;
      renderSupernetResults(result, resultsContainer, summaryLine);
      toggleExportButton('supernet', true);
    } catch (error) {
      showError(errorBox, `No fue posible completar el proceso correctamente: ${error.message}. Por favor, vuelva a revisar las redes ingresadas e inténtelo de nuevo.`);
      resultsContainer.textContent = '';
      summaryLine.textContent = '';
      toggleExportButton('supernet', false);
    }
  }

  function renderSupernetResults(result, container, summaryLine) {
    summaryLine.textContent = result.isExact
      ? `Ruta resumen: "${result.summaryCidr}" • Resumen exacto, sin direcciones sobrantes.`
      : `Ruta resumen: "${result.summaryCidr}" • Incluye ${Utils.formatInteger(result.overheadAddresses)} direcciones adicionales fuera de las redes originales.`;

    const inputRows = result.networks.map((network) => [
      network.original,
      `${CoreV4.intToIPv4(network.networkInt)}/${network.cidr}`,
      CoreV4.intToIPv4(network.broadcastInt),
      Utils.formatInteger(network.totalAddresses)
    ]);

    const summaryRows = [[
      result.summaryDetails.networkAddress,
      `/${result.summaryPrefix}`,
      result.summaryDetails.subnetMask,
      result.summaryDetails.broadcastAddress,
      Utils.formatInteger(result.summaryDetails.totalAddresses)
    ]];

    container.textContent = '';
    container.append(
      createTableBlock('Redes de Entrada (Normalizadas)', ['Entrada', 'Red', 'Broadcast', 'Direcciones'], inputRows),
      createTableBlock('Ruta Resumen (Supernet)', ['Red', 'CIDR', 'Máscara', 'Broadcast', 'Direcciones Totales'], summaryRows)
    );
  }

  function addDynamicRow(container, template) {
    const row = template.cloneNode(true);
    qsa('input', row).forEach((input) => { input.value = ''; });
    container.appendChild(row);
  }

  function initDynamicRowsAndActions() {
    const vlsmContainer = qs('#vlsm-requirements');
    const vlsmTemplate = qs('.dynamic-row', vlsmContainer);
    const supernetContainer = qs('#supernet-entries');
    const supernetTemplate = qs('.dynamic-row', supernetContainer);

    document.addEventListener('click', (event) => {
      const actionEl = event.target.closest('[data-action]');
      if (!actionEl) return;

      const action = actionEl.dataset.action;

      if (action === 'add-vlsm-row') {
        addDynamicRow(vlsmContainer, vlsmTemplate);
      } else if (action === 'add-supernet-row') {
        addDynamicRow(supernetContainer, supernetTemplate);
      } else if (action === 'remove-row') {
        const row = actionEl.closest('.dynamic-row');
        const parent = row.parentElement;
        if (parent.children.length > 1) {
          row.remove();
          if (parent === vlsmContainer) {
            runVLSMCalculation();
          } else if (parent === supernetContainer) {
            runSupernetCalculation();
          }
        }
      } else if (action === 'export-pdf') {
        exportPanelToPDF(actionEl.dataset.target);
      }
    });
  }

  function exportIPv4PDF() {
    const result = state.ipv4;
    if (!result) return;
    PdfExport.downloadReport('Reporte de Cálculo IPv4', [
      {
        heading: 'Información General',
        columns: ['Campo', 'Valor'],
        rows: [
          ['Dirección IP', result.inputAddress],
          ['Dirección IP (Binario)', result.inputAddressBinary],
          ['Clase de Dirección', result.ipClass],
          ['Ámbito', result.scope],
          ['Prefijo CIDR', `/${result.cidr}`]
        ]
      },
      {
        heading: 'Máscaras',
        columns: ['Campo', 'Valor'],
        rows: [
          ['Máscara de Subred', result.subnetMask],
          ['Máscara Binaria', result.subnetMaskBinary],
          ['Wildcard', result.wildcardMask]
        ]
      },
      {
        heading: 'Rango de Red',
        columns: ['Campo', 'Valor'],
        rows: [
          ['Dirección de Red', result.networkAddress],
          ['Broadcast', result.broadcastAddress],
          ['Primera IP Utilizable', result.firstUsable],
          ['Última IP Utilizable', result.lastUsable],
          ['Total de Direcciones', Utils.formatInteger(result.totalAddresses)],
          ['Hosts Utilizables', Utils.formatInteger(result.usableHosts)]
        ]
      }
    ], `report_ipv4.pdf`);
  }

  function exportIPv6PDF() {
    const result = state.ipv6;
    if (!result) return;
    PdfExport.downloadReport('Reporte de Cálculo IPv6', [
      {
        heading: 'Información General',
        columns: ['Campo', 'Valor'],
        rows: [
          ['Dirección Comprimida', result.compressedInput],
          ['Dirección Expandida', result.expandedInput],
          ['Ámbito', result.scope],
          ['Prefijo', `/${result.prefix}`]
        ]
      },
      {
        heading: 'Máscaras',
        columns: ['Campo', 'Valor'],
        rows: [
          ['Máscara de Subred (Hexadecimal)', result.subnetMaskHex],
          ['Máscara de Subred (Binario)', result.subnetMaskBinary],
          ['Máscara Wildcard (Hexadecimal)', result.wildcardHex]
        ]
      },
      {
        heading: 'Rango de Red',
        columns: ['Campo', 'Valor'],
        rows: [
          ['Dirección de Red', result.networkAddress],
          ['Última Dirección del Bloque', result.lastAddress],
          ['Primera IP Utilizable', result.firstUsable],
          ['Última IP Utilizable', result.lastUsable],
          ['Total de Direcciones', Utils.formatBigInt(result.totalAddresses)],
          ['Direcciones Utilizables', Utils.formatBigInt(result.usableAddresses)]
        ]
      }
    ], 'report_ipv6.pdf');
  }

  function exportFLSMPDF() {
    const result = state.flsm;
    if (!result) return;
    const rows = result.subnets.map((subnet) => [
      String(subnet.subnetIndex),
      `${subnet.networkAddress}/${subnet.cidr}`,
      subnet.subnetMask,
      subnet.broadcastAddress,
      subnet.firstUsable,
      subnet.lastUsable,
      Utils.formatInteger(subnet.usableHosts)
    ]);
    PdfExport.downloadReport(`FLSM: ${result.baseNetwork}/${result.baseCidr} -> /${result.newCidr}`, [
      { heading: 'Subredes Generadas', columns: ['#', 'Red', 'Máscara', 'Broadcast', 'Primera IP', 'Última IP', 'Hosts'], rows }
    ], `report_flsm.pdf`);
  }

  function exportVLSMPDF() {
    const result = state.vlsm;
    if (!result) return;
    const rows = result.allocations.map((allocation) => [
      allocation.label,
      Utils.formatInteger(allocation.hostsRequested),
      `${allocation.networkAddress}/${allocation.cidr}`,
      allocation.subnetMask,
      allocation.broadcastAddress,
      allocation.firstUsable,
      allocation.lastUsable,
      Utils.formatInteger(allocation.usableHosts),
      Utils.formatInteger(allocation.wastedAddresses)
    ]);
    PdfExport.downloadReport(`VLSM: ${result.baseNetwork}/${result.baseCidr}`, [
      { heading: 'Asignación VLSM', columns: ['Nombre', 'Hosts Solicitados', 'Red', 'Máscara', 'Broadcast', 'Primera IP', 'Última IP', 'Hosts Disponibles', 'Desperdicio'], rows }
    ], `report_vlsm.pdf`);
  }

  function exportSupernetPDF() {
    const result = state.supernet;
    if (!result) return;
    const inputRows = result.networks.map((network) => [
      network.original,
      `${CoreV4.intToIPv4(network.networkInt)}/${network.cidr}`,
      CoreV4.intToIPv4(network.broadcastInt),
      Utils.formatInteger(network.totalAddresses)
    ]);
    const summaryRows = [[
      result.summaryDetails.networkAddress,
      `/${result.summaryPrefix}`,
      result.summaryDetails.subnetMask,
      result.summaryDetails.broadcastAddress,
      Utils.formatInteger(result.summaryDetails.totalAddresses)
    ]];
    PdfExport.downloadReport(`Supernetting: ${result.summaryCidr}`, [
      { heading: 'Redes de Entrada', columns: ['Entrada', 'Red', 'Broadcast', 'Direcciones'], rows: inputRows },
      { heading: 'Ruta Resumen', columns: ['Red', 'CIDR', 'Máscara', 'Broadcast', 'Direcciones Totales'], rows: summaryRows }
    ], 'report_supernetting.pdf');
  }

  function exportPanelToPDF(target) {
    const exporters = {
      ipv4: exportIPv4PDF,
      ipv6: exportIPv6PDF,
      flsm: exportFLSMPDF,
      vlsm: exportVLSMPDF,
      supernet: exportSupernetPDF
    };
    const exporter = exporters[target];
    if (exporter) exporter();
  }

  function initLiveCalculation() {
    const runnersByFormId = {
      'ipv4-form': runIPv4Calculation,
      'ipv6-form': runIPv6Calculation,
      'flsm-form': runFLSMCalculation,
      'vlsm-form': runVLSMCalculation,
      'supernet-form': runSupernetCalculation
    };

    const debouncedRunners = {};
    Object.keys(runnersByFormId).forEach((formId) => {
      debouncedRunners[formId] = Utils.debounce(runnersByFormId[formId], 350);
    });

    function delegatedInputHandler(event) {
      const form = event.target.closest('form');
      if (form && debouncedRunners[form.id]) {
        debouncedRunners[form.id]();
      }
    }

    document.addEventListener('input', delegatedInputHandler);
    document.addEventListener('change', delegatedInputHandler);

    Object.keys(runnersByFormId).forEach((formId) => {
      const formEl = document.getElementById(formId);
      formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        runnersByFormId[formId]();
      });
    });
  }

  function applyPerformanceTier() {
    const tier = Utils.detectPerformanceTier();
    document.documentElement.classList.add(tier === 'high' ? 'perf-high' : 'perf-low');
  }

  function initExportHints() {
    Object.keys(SECTION_NAMES).forEach((target) => toggleExportButton(target, false));
  }

  function init() {
    applyPerformanceTier();
    initTabs();
    initExportHints();
    initLiveCalculation();
    initDynamicRowsAndActions();
    const savedTab = StorageManager ? StorageManager.getLastTab() : null;
    switchTab(savedTab || 'ipv4');
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);