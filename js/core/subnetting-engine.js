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

  const CoreV4 = global.NetTool.CoreV4;

  function calculateFLSM(baseIp, baseCidr, requiredValue, mode) {
    const baseIpInt = CoreV4.ipv4ToInt(baseIp);
    const baseMaskInt = CoreV4.cidrToMaskInt(baseCidr);
    const baseNetworkInt = (baseIpInt & baseMaskInt) >>> 0;

    let newCidr;

    if (mode === 'hosts') {
      let hostBits = 0;
      while ((Math.pow(2, hostBits) - 2) < requiredValue) {
        hostBits++;
        if (hostBits > 32) throw new Error('¡La cantidad de hosts solicitada no es soportada por el protocolo IPv4!');
      }
      newCidr = 32 - hostBits;
    } else {
      const bitsNeeded = requiredValue <= 1 ? 0 : Math.ceil(Math.log2(requiredValue));
      newCidr = baseCidr + bitsNeeded;
    }

    if (newCidr > 32 || newCidr < baseCidr) {
      throw new Error('¡La cantidad solicitada excede el espacio de las direcciones disponibles en la red base!');
    }

    const subnetSize = Math.pow(2, 32 - newCidr);
    const generatedSubnets = Math.pow(2, newCidr - baseCidr);
    const subnets = [];

    for (let index = 0; index < generatedSubnets; index++) {
      const subnetNetworkInt = (baseNetworkInt + (index * subnetSize)) >>> 0;
      const details = CoreV4.calculateIPv4FromInts(subnetNetworkInt, newCidr);
      subnets.push(Object.assign({ subnetIndex: index + 1 }, details));
    }

    return {
      baseNetwork: CoreV4.intToIPv4(baseNetworkInt),
      baseCidr,
      newCidr,
      bitsBorrowed: newCidr - baseCidr,
      subnetsGenerated: generatedSubnets,
      hostsPerSubnet: subnets[0].usableHosts,
      subnets
    };
  }

  function calculateVLSM(baseIp, baseCidr, requirements) {
    const baseIpInt = CoreV4.ipv4ToInt(baseIp);
    const baseMaskInt = CoreV4.cidrToMaskInt(baseCidr);
    const baseNetworkInt = (baseIpInt & baseMaskInt) >>> 0;
    const baseWildcardInt = (~baseMaskInt) >>> 0;
    const baseBroadcastInt = (baseNetworkInt | baseWildcardInt) >>> 0;

    const sortedRequirements = requirements
      .map((requirement, originalIndex) => Object.assign({ originalIndex }, requirement))
      .sort((a, b) => b.hosts - a.hosts);

    let cursorInt = baseNetworkInt;
    const allocations = [];

    for (const requirement of sortedRequirements) {
      let hostBits = 0;
      while ((Math.pow(2, hostBits) - 2) < requirement.hosts) {
        hostBits++;
        if (hostBits > 32) throw new Error(`No es posible asignar ${requirement.hosts} hosts a: "${requirement.label}"`);
      }

      const blockSize = Math.pow(2, hostBits);
      const newCidr = 32 - hostBits;
      const alignedStart = Math.ceil(cursorInt / blockSize) * blockSize;
      const broadcastCandidate = alignedStart + blockSize - 1;

      if (broadcastCandidate > baseBroadcastInt) {
        throw new Error(`Espacio insuficiente en: "${CoreV4.intToIPv4(baseNetworkInt)}/${baseCidr}" para asignar "${requirement.label}" (${requirement.hosts} hosts).`);
      }

      const details = CoreV4.calculateIPv4FromInts(alignedStart, newCidr);
      allocations.push(Object.assign({
        label: requirement.label,
        hostsRequested: requirement.hosts,
        wastedAddresses: (blockSize - 2) - requirement.hosts,
        originalIndex: requirement.originalIndex
      }, details));

      cursorInt = alignedStart + blockSize;
    }

    allocations.sort((a, b) => a.originalIndex - b.originalIndex);

    return {
      baseNetwork: CoreV4.intToIPv4(baseNetworkInt),
      baseCidr,
      remainingAddresses: (baseBroadcastInt - cursorInt) + 1,
      allocations
    };
  }

  function calculateSupernet(entries) {
    const parsed = entries.map((entry) => {
      const [ipPart, cidrPart] = entry.split('/');
      const cidr = Number(cidrPart);
      const ipInt = CoreV4.ipv4ToInt(ipPart);
      const maskInt = CoreV4.cidrToMaskInt(cidr);
      const networkInt = (ipInt & maskInt) >>> 0;
      const wildcardInt = (~maskInt) >>> 0;
      const broadcastInt = (networkInt | wildcardInt) >>> 0;
      return {
        original: entry.trim(),
        networkInt,
        broadcastInt,
        cidr,
        totalAddresses: Math.pow(2, 32 - cidr)
      };
    });

    const minStart = Math.min(...parsed.map((item) => item.networkInt));
    const maxEnd = Math.max(...parsed.map((item) => item.broadcastInt));

    let summaryPrefix = 0;
    let summaryNetworkInt = 0;

    for (let prefix = 32; prefix >= 0; prefix--) {
      const maskInt = CoreV4.cidrToMaskInt(prefix);
      const candidateNetwork = (minStart & maskInt) >>> 0;
      const wildcardInt = (~maskInt) >>> 0;
      const candidateBroadcast = (candidateNetwork | wildcardInt) >>> 0;
      if (candidateBroadcast >= maxEnd) {
        summaryPrefix = prefix;
        summaryNetworkInt = candidateNetwork;
        break;
      }
    }

    const summaryDetails = CoreV4.calculateIPv4FromInts(summaryNetworkInt, summaryPrefix);
    const sumOfInputAddresses = parsed.reduce((acc, item) => acc + item.totalAddresses, 0);
    const overheadAddresses = summaryDetails.totalAddresses - sumOfInputAddresses;

    return {
      networks: parsed,
      summaryPrefix,
      summaryCidr: `${summaryDetails.networkAddress}/${summaryPrefix}`,
      summaryDetails,
      overheadAddresses,
      isExact: overheadAddresses === 0
    };
  }

  global.NetTool = global.NetTool || {};
  global.NetTool.Engine = { calculateFLSM, calculateVLSM, calculateSupernet };
})(window);