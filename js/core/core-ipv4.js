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

  function ipv4ToInt(ip) {
    return ip.trim().split('.').reduce((acc, octet) => (acc * 256) + Number(octet), 0) >>> 0;
  }

  function intToIPv4(intValue) {
    return [24, 16, 8, 0].map((shift) => (intValue >>> shift) & 0xFF).join('.');
  }

  function intToBinaryOctets(intValue) {
    return [24, 16, 8, 0]
      .map((shift) => ((intValue >>> shift) & 0xFF).toString(2).padStart(8, '0'))
      .join('.');
  }

  function cidrToMaskInt(cidr) {
    return cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
  }

  function getIPv4Class(firstOctet) {
    if (firstOctet === 0) return 'A (Red Actual, RFC 791)';
    if (firstOctet === 127) return 'A (Loopback)';
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    return 'E (Experimental/Reservada)';
  }

  function isWithinBlock(networkInt, networkCidr, blockAddress, blockCidr) {
    if (networkCidr < blockCidr) return false;
    const blockMask = cidrToMaskInt(blockCidr);
    return (networkInt & blockMask) === (ipv4ToInt(blockAddress) & blockMask);
  }

  function getIPv4Scope(networkInt, networkCidr) {
    if (isWithinBlock(networkInt, networkCidr, '255.255.255.255', 32)) return 'Broadcast Limitado (RFC 919)';
    if (isWithinBlock(networkInt, networkCidr, '0.0.0.0', 8)) return 'Red Actual (RFC 791)';
    if (isWithinBlock(networkInt, networkCidr, '10.0.0.0', 8)) return 'Privada (RFC 1918)';
    if (isWithinBlock(networkInt, networkCidr, '100.64.0.0', 10)) return 'CGNAT (RFC 6598)';
    if (isWithinBlock(networkInt, networkCidr, '127.0.0.0', 8)) return 'Loopback (RFC 1122)';
    if (isWithinBlock(networkInt, networkCidr, '169.254.0.0', 16)) return 'Link-Local / APIPA (RFC 3927)';
    if (isWithinBlock(networkInt, networkCidr, '172.16.0.0', 12)) return 'Privada (RFC 1918)';
    if (isWithinBlock(networkInt, networkCidr, '192.0.0.0', 24)) return 'Asignaciones de Protocolo IETF (RFC 6890)';
    if (isWithinBlock(networkInt, networkCidr, '192.0.2.0', 24)) return 'Documentación TEST-NET-1 (RFC 5737)';
    if (isWithinBlock(networkInt, networkCidr, '192.88.99.0', 24)) return 'Relay Anycast 6to4 (RFC 3068, en desuso)';
    if (isWithinBlock(networkInt, networkCidr, '192.168.0.0', 16)) return 'Privada (RFC 1918)';
    if (isWithinBlock(networkInt, networkCidr, '198.18.0.0', 15)) return 'Pruebas de Rendimiento (RFC 2544)';
    if (isWithinBlock(networkInt, networkCidr, '198.51.100.0', 24)) return 'Documentación TEST-NET-2 (RFC 5737)';
    if (isWithinBlock(networkInt, networkCidr, '203.0.113.0', 24)) return 'Documentación TEST-NET-3 (RFC 5737)';
    if (isWithinBlock(networkInt, networkCidr, '224.0.0.0', 4)) return 'Multicast (RFC 5771)';
    if (isWithinBlock(networkInt, networkCidr, '240.0.0.0', 4)) return 'Reservada para Uso Futuro (RFC 1112)';
    return 'Pública';
  }

  function calculateIPv4FromInts(networkInt, cidr) {
    const maskInt = cidrToMaskInt(cidr);
    const wildcardInt = (~maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;
    const hostBits = 32 - cidr;
    const totalAddresses = Math.pow(2, hostBits);

    let usableHosts;
    let firstUsableInt;
    let lastUsableInt;

    if (cidr === 32) {
      usableHosts = 1;
      firstUsableInt = networkInt;
      lastUsableInt = networkInt;
    } else if (cidr === 31) {
      usableHosts = 2;
      firstUsableInt = networkInt;
      lastUsableInt = broadcastInt;
    } else {
      usableHosts = totalAddresses - 2;
      firstUsableInt = (networkInt + 1) >>> 0;
      lastUsableInt = (broadcastInt - 1) >>> 0;
    }

    return {
      networkInt,
      broadcastInt,
      maskInt,
      wildcardInt,
      cidr,
      totalAddresses,
      usableHosts,
      firstUsableInt,
      lastUsableInt,
      networkAddress: intToIPv4(networkInt),
      broadcastAddress: intToIPv4(broadcastInt),
      subnetMask: intToIPv4(maskInt),
      subnetMaskBinary: intToBinaryOctets(maskInt),
      wildcardMask: intToIPv4(wildcardInt),
      firstUsable: intToIPv4(firstUsableInt),
      lastUsable: intToIPv4(lastUsableInt),
      networkBinary: intToBinaryOctets(networkInt),
      broadcastBinary: intToBinaryOctets(broadcastInt)
    };
  }

  function calculateIPv4(ipStr, cidr) {
    const ipInt = ipv4ToInt(ipStr);
    const maskInt = cidrToMaskInt(cidr);
    const networkInt = (ipInt & maskInt) >>> 0;
    const base = calculateIPv4FromInts(networkInt, cidr);

    return Object.assign({}, base, {
      inputAddress: ipStr.trim(),
      inputAddressInt: ipInt,
      inputAddressBinary: intToBinaryOctets(ipInt),
      ipClass: getIPv4Class(ipInt >>> 24),
      scope: getIPv4Scope(networkInt, cidr)
    });
  }

  global.NetTool = global.NetTool || {};
  global.NetTool.CoreV4 = {
    ipv4ToInt,
    intToIPv4,
    intToBinaryOctets,
    cidrToMaskInt,
    getIPv4Class,
    getIPv4Scope,
    calculateIPv4,
    calculateIPv4FromInts
  };
})(window);