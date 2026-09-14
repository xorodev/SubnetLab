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

  function expandLastGroupIfIPv4(groups) {
    const last = groups[groups.length - 1];
    if (last && last.includes('.')) {
      if (!global.NetTool.Utils.IPV4_REGEX.test(last)) {
        throw new Error('El segmento IPv4-mapeado dentro de la dirección IPv6 no es válido.');
      }
      const octets = last.split('.').map(Number);
      const highGroup = ((octets[0] << 8) | octets[1]).toString(16);
      const lowGroup = ((octets[2] << 8) | octets[3]).toString(16);
      groups.splice(groups.length - 1, 1, highGroup, lowGroup);
    }
    return groups;
  }

  function expandIPv6(rawInput) {
    const input = rawInput.trim().toLowerCase();

    if (input.includes(':::')) {
      throw new Error('Formato IPv6 inválido: la compresión "::" se encuentra repetida.');
    }
    const doubleColonCount = (input.match(/::/g) || []).length;
    if (doubleColonCount > 1) {
      throw new Error('Formato IPv6 inválido: solo se permite una compresión "::"');
    }

    const hasCompression = input.includes('::');
    let head = input;
    let tail = '';

    if (hasCompression) {
      const parts = input.split('::');
      head = parts[0];
      tail = parts[1];
    }

    const headGroups = head.length ? head.split(':') : [];
    const tailGroups = tail.length ? tail.split(':') : [];

    expandLastGroupIfIPv4(headGroups);
    expandLastGroupIfIPv4(tailGroups);

    [...headGroups, ...tailGroups].forEach((group) => {
      if (!global.NetTool.Utils.IPV6_HEX_GROUP.test(group)) {
        throw new Error(`Grupo hexadecimal inválido: "${group}"`);
      }
    });

    const missingGroups = 8 - headGroups.length - tailGroups.length;

    if (!hasCompression && missingGroups !== 0) {
      throw new Error('La dirección IPv6 debe tener exactamente 8 grupos, o utilizar "::" para comprimirla correctamente.');
    }
    if (hasCompression && missingGroups < 1) {
      throw new Error('La compresión "::" no representa ningún grupo omitido y es redundante.');
    }

    const zeroGroups = hasCompression ? new Array(missingGroups).fill('0') : [];
    const fullGroups = [...headGroups, ...zeroGroups, ...tailGroups];

    if (fullGroups.length !== 8) {
      throw new Error('¡No fue posible expandir la dirección IPv6 a 8 grupos!');
    }

    return fullGroups.map((group) => parseInt(group, 16));
  }

  function groupsToBigInt(groups) {
    return groups.reduce((acc, group) => (acc << 16n) + BigInt(group), 0n);
  }

  function bigIntToGroups(bigValue) {
    const groups = [];
    let remaining = bigValue;
    for (let i = 0; i < 8; i++) {
      groups.unshift(Number(remaining & 0xFFFFn));
      remaining >>= 16n;
    }
    return groups;
  }

  function compressIPv6(groups) {
    const hexGroups = groups.map((group) => group.toString(16));

    let bestStart = -1;
    let bestLength = 0;
    let currentStart = -1;
    let currentLength = 0;

    for (let i = 0; i < hexGroups.length; i++) {
      if (hexGroups[i] === '0') {
        if (currentStart === -1) currentStart = i;
        currentLength++;
        if (currentLength > bestLength) {
          bestLength = currentLength;
          bestStart = currentStart;
        }
      } else {
        currentStart = -1;
        currentLength = 0;
      }
    }

    if (bestLength < 2) {
      return hexGroups.join(':');
    }

    const before = hexGroups.slice(0, bestStart);
    const after = hexGroups.slice(bestStart + bestLength);
    const compressed = `${before.join(':')}::${after.join(':')}`;
    return compressed === '::' ? '::' : compressed;
  }

  function bigIntToIPv6(bigValue) {
    return compressIPv6(bigIntToGroups(bigValue));
  }

  function bigIntToBinaryGroups(bigValue) {
    return bigIntToGroups(bigValue).map((group) => group.toString(2).padStart(16, '0')).join(':');
  }

  function bigIntToFullHexGroups(bigValue) {
    return bigIntToGroups(bigValue).map((group) => group.toString(16).padStart(4, '0')).join(':');
  }

  function cidrToMaskBigInt(prefix) {
    if (prefix === 0) return 0n;
    const fullMask = (1n << 128n) - 1n;
    return (fullMask >> BigInt(128 - prefix)) << BigInt(128 - prefix);
  }

  function isWithinBlockV6(ipBig, ownPrefix, blockAddress, blockPrefix) {
    if (ownPrefix < blockPrefix) return false;
    const blockMask = cidrToMaskBigInt(blockPrefix);
    const blockBig = groupsToBigInt(expandIPv6(blockAddress));
    return (ipBig & blockMask) === (blockBig & blockMask);
  }

  function getIPv6Scope(ipBig, ownPrefix) {
    if (isWithinBlockV6(ipBig, ownPrefix, '::', 128)) return 'No Especificada (RFC 4291)';
    if (isWithinBlockV6(ipBig, ownPrefix, '::1', 128)) return 'Loopback (RFC 4291)';
    if (isWithinBlockV6(ipBig, ownPrefix, '::ffff:0:0', 96)) return 'IPv4-Mapeada (RFC 4291)';
    if (isWithinBlockV6(ipBig, ownPrefix, '64:ff9b::', 96)) return 'Traducción NAT64 (RFC 6052)';
    if (isWithinBlockV6(ipBig, ownPrefix, '2001:db8::', 32)) return 'Documentación (RFC 3849)';
    if (isWithinBlockV6(ipBig, ownPrefix, '3fff::', 20)) return 'Documentación (RFC 9637)';
    if (isWithinBlockV6(ipBig, ownPrefix, '2002::', 16)) return 'Transición 6to4 (RFC 3056)';
    if (isWithinBlockV6(ipBig, ownPrefix, 'fc00::', 7)) return 'Unicast Única Local / ULA (RFC 4193)';
    if (isWithinBlockV6(ipBig, ownPrefix, 'fe80::', 10)) return 'Link-Local (RFC 4291)';
    if (isWithinBlockV6(ipBig, ownPrefix, 'ff00::', 8)) return 'Multicast (RFC 4291)';
    if (isWithinBlockV6(ipBig, ownPrefix, '2000::', 3)) return 'Unicast Global (RFC 3587)';
    return 'Reservada (IANA)';
  }

  function calculateIPv6(ipStr, prefix) {
    const groups = expandIPv6(ipStr);
    const ipBig = groupsToBigInt(groups);
    const maskBig = cidrToMaskBigInt(prefix);
    const fullMask128 = (1n << 128n) - 1n;
    const wildcardBig = maskBig ^ fullMask128;
    const networkBig = ipBig & maskBig;
    const lastAddressBig = networkBig | wildcardBig;
    const hostBits = 128 - prefix;
    const totalAddresses = 2n ** BigInt(hostBits);

    return {
      inputAddress: ipStr.trim(),
      prefix,
      compressedInput: bigIntToIPv6(ipBig),
      expandedInput: groups.map((group) => group.toString(16).padStart(4, '0')).join(':'),
      scope: getIPv6Scope(networkBig, prefix),
      subnetMaskHex: bigIntToFullHexGroups(maskBig),
      subnetMaskBinary: bigIntToBinaryGroups(maskBig),
      wildcardHex: bigIntToFullHexGroups(wildcardBig),
      wildcardBinary: bigIntToBinaryGroups(wildcardBig),
      networkAddress: bigIntToIPv6(networkBig),
      lastAddress: bigIntToIPv6(lastAddressBig),
      firstUsable: bigIntToIPv6(networkBig),
      lastUsable: bigIntToIPv6(lastAddressBig),
      totalAddresses,
      usableAddresses: totalAddresses,
      networkBig,
      lastAddressBig
    };
  }

  global.NetTool = global.NetTool || {};
  global.NetTool.CoreV6 = {
    expandIPv6,
    groupsToBigInt,
    bigIntToGroups,
    compressIPv6,
    bigIntToIPv6,
    bigIntToFullHexGroups,
    cidrToMaskBigInt,
    getIPv6Scope,
    calculateIPv6
  };
})(window);