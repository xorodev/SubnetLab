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

  const root = document.documentElement;

  function setViewportHeightVariable() {
    const viewport = global.visualViewport;
    const height = (viewport && viewport.height) || global.innerHeight || root.clientHeight;
    if (!height) return;
    root.style.setProperty('--app-vh', `${height * 0.01}px`);
  }

  setViewportHeightVariable();

  if (global.visualViewport) {
    global.visualViewport.addEventListener('resize', setViewportHeightVariable);
  }
  global.addEventListener('resize', setViewportHeightVariable);
  global.addEventListener('orientationchange', setViewportHeightVariable);
})(window);