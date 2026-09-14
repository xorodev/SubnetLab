# SubnetLab — Guía de Uso (Modo Online)

Esta guía está dirigida a usuarios que prefieren utilizar la herramienta de forma **automática y centralizada** mediante la infraestructura de **GitHub Pages**. Esta modalidad permite realizar cálculos de subnetting desde cualquier dispositivo con acceso a internet, manteniendo siempre la versión más reciente de la herramienta.

---

## 📑 Tabla de Contenido
- [SubnetLab — Guía de Uso (Modo Online)](#subnetlab--guía-de-uso-modo-online)
  - [📑 Tabla de Contenido](#-tabla-de-contenido)
  - [🚀 Instrucciones de acceso](#-instrucciones-de-acceso)
  - [✨ Características](#-características)
  - [💡 Tips y recomendaciones](#-tips-y-recomendaciones)

---

## 🚀 Instrucciones de acceso

1. **Acceder al enlace oficial:** Ingrese a la [URL](https://xorodev.github.io/SubnetLab) de GitHub Pages proporcionada en el repositorio oficial de @xorodev.
2. **Selección de módulo:** Elija el módulo que necesita desde el menú lateral (IPv4, IPv6, FLSM, VLSM o Supernetting).
3. **Persistencia de preferencias:** Su tema visual (claro/oscuro) y el último módulo visitado se guardan automáticamente en el **LocalStorage** de su navegador para la próxima visita.

> [!NOTE]
> Al ser una aplicación web estática (Client-side), sus datos de red (direcciones IP, prefijos, hosts) nunca viajan a servidores externos; los cálculos se ejecutan exclusivamente en su navegador.

---

## ✨ Características

- **Actualización continua:** Siempre utiliza la última versión publicada de la herramienta.
- **Sin instalación:** Ideal para consultas y auditorías rápidas en cualquier equipo con navegador.
- **Compatibilidad:** Optimizado para navegadores modernos (Chromium, Firefox, Edge).
- **Exportación en formato PDF:** Cada módulo permite descargar un reporte con los resultados del cálculo.

---

## 💡 Tips y recomendaciones

- **Resultados importantes:** Como los datos ingresados no se guardan entre sesiones, exporte a PDF cualquier cálculo que necesite conservar antes de cerrar la pestaña.
- **Múltiples subredes (VLSM/Supernetting):** Puede añadir o eliminar filas de requerimientos dinámicamente antes de calcular; revise que todos los campos estén completos para evitar errores de validación.

> [!WARNING]
> **Cambios de red:** Los resultados generados son cálculos matemáticos sobre el direccionamiento solicitado. La aplicación de estos cambios en dispositivos reales (routers, switches, servidores DHCP) es responsabilidad del usuario y debe validarse según las políticas de su red.

---

Copyright © 2026 @xorodev (CipherCoreDev). Licensed under the GNU General Public License v3.0
