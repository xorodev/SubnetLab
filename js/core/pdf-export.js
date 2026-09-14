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

  function drawLogoIcon(doc, x, y, size) {
    const scale = size / 24;
    const pX = (v) => x + v * scale;
    const pY = (v) => y + v * scale;

    doc.setDrawColor(22, 62, 82);
    doc.setFillColor(22, 62, 82);
    doc.setLineWidth(1.6 * scale);

    doc.line(pX(9), pY(3), pX(15), pY(3));
    doc.line(pX(10), pY(3), pX(10), pY(7.2));
    doc.line(pX(14), pY(3), pX(14), pY(7.2));
    doc.line(pX(10), pY(7.2), pX(4.5), pY(17.5));
    doc.line(pX(14), pY(7.2), pX(19.5), pY(17.5));
    doc.line(pX(4.5), pY(17.5), pX(6.2), pY(20.5));
    doc.line(pX(19.5), pY(17.5), pX(17.8), pY(20.5));
    doc.line(pX(6.2), pY(20.5), pX(17.8), pY(20.5));

    doc.setLineWidth(1.3 * scale);
    doc.line(pX(12), pY(11), pX(8.5), pY(16.5));
    doc.line(pX(12), pY(11), pX(15.5), pY(16.5));
    doc.line(pX(8.5), pY(16.5), pX(15.5), pY(16.5));

    doc.circle(pX(12), pY(11), 1.5 * scale, 'F');
    doc.circle(pX(8.5), pY(16.5), 1.5 * scale, 'F');
    doc.circle(pX(15.5), pY(16.5), 1.5 * scale, 'F');
  }

  function drawHeader(doc, reportTitle, marginX) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 50;

    const titleText = 'SubnetLab';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(18, 28, 40);
    doc.text(titleText, marginX, cursorY);

    const logoSize = 22;
    const logoX = pageWidth - marginX - logoSize;
    const logoY = cursorY - 16;

    drawLogoIcon(doc, logoX, logoY, logoSize);

    cursorY += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(90, 100, 112);
    doc.text(reportTitle, marginX, cursorY);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    cursorY += 16;
    doc.setFontSize(9);
    doc.text(`Fecha del reporte: ${formattedDate}, a las ${formattedTime}.`, marginX, cursorY);

    cursorY += 10;
    doc.setDrawColor(206, 213, 220);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);

    return cursorY + 20;
  }

  function drawFooter(doc, marginX) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalPages = doc.internal.getNumberOfPages();
  
    const linkUrl = 'https://www.gnu.org/licenses/gpl-3.0.txt';
  
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 158, 168);
  
      const y = pageHeight - 20;
      let x = marginX;
  
      doc.setFont('helvetica', 'bold');
      doc.text('SubnetLab', x, y);
      x += doc.getTextWidth('SubnetLab');
  
      doc.setFont('helvetica', 'normal');
      doc.text(' • ', x, y);
      x += doc.getTextWidth(' • ');
  
      doc.setFont('helvetica', 'bold');
  
      const licenseText = 'Software Libre bajo licencia ';
      const licenseLinkText = 'GNU GPLv3.0';
  
      doc.text(licenseText, x, y);
      x += doc.getTextWidth(licenseText);
  
      doc.setTextColor(8, 145, 178);
      doc.text(licenseLinkText, x, y);
      const linkWidth = doc.getTextWidth(licenseLinkText);
  
      doc.setDrawColor(8, 145, 178);
      doc.setLineWidth(0.5);
      doc.line(x, y + 2, x + linkWidth, y + 2);
  
      doc.link(
        x,
        y - 6,
        linkWidth,
        8,
        { url: linkUrl }
      );
  
      doc.setTextColor(150, 158, 168);
  
      const pageLabel = 'Página ';
      const pageNumber = `${page}`;
      const ofLabel = ' de ';
      const totalLabel = `${totalPages}`;
  
      const totalWidth =
        doc.getTextWidth(pageLabel) +
        doc.getTextWidth(pageNumber) +
        doc.getTextWidth(ofLabel) +
        doc.getTextWidth(totalLabel);
  
      x = pageWidth - marginX - totalWidth;
  
      doc.setFont('helvetica', 'normal');
      doc.text(pageLabel, x, y);
      x += doc.getTextWidth(pageLabel);
  
      doc.setFont('helvetica', 'bold');
      doc.text(pageNumber, x, y);
      x += doc.getTextWidth(pageNumber);
  
      doc.setFont('helvetica', 'normal');
      doc.text(ofLabel, x, y);
      x += doc.getTextWidth(ofLabel);
  
      doc.setFont('helvetica', 'bold');
      doc.text(totalLabel, x, y);
    }
  }

  function buildDocument(reportTitle, sections, fileName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    const cleanTitle = fileName ? fileName.replace(/\.pdf$/i, '') : reportTitle;

    doc.setProperties({
      title: cleanTitle,
      subject: reportTitle,
      author: 'SubnetLab v1.0.0',
      creator: '@xorodev (CipherCoreDev)',
      keywords: 'report'
    });

    const marginX = 40;
    let cursorY = drawHeader(doc, reportTitle, marginX);

    sections.forEach((section) => {
      if (cursorY > doc.internal.pageSize.getHeight() - 120) {
        doc.addPage();
        cursorY = 50;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(18, 28, 40);
      doc.text(section.heading, marginX, cursorY);
      cursorY += 10;

      doc.autoTable({
        startY: cursorY,
        head: [section.columns],
        body: section.rows,
        margin: { left: marginX, right: marginX },
        styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 5, textColor: [40, 48, 58] },
        headStyles: { fillColor: [22, 62, 82], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [244, 247, 249] },
        theme: 'grid'
      });

      cursorY = doc.lastAutoTable.finalY + 30;
    });

    drawFooter(doc, marginX);
    return doc;
  }

  function downloadReport(reportTitle, sections, fileName) {
    const doc = buildDocument(reportTitle, sections, fileName);
    doc.save(fileName);
  }

  global.NetTool = global.NetTool || {};
  global.NetTool.PdfExport = { downloadReport };
})(window);