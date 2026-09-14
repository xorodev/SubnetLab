# SubnetLab — Guía de Uso (Modo Offline)

Esta guía está diseñada para usuarios que requieren ejecutar la herramienta en **entornos locales**, sin depender de una conexión constante a internet. Ideal para auditorías de campo o entornos con acceso restringido a la red.

---

## 📑 Tabla de Contenido
- [SubnetLab — Guía de Uso (Modo Offline)](#subnetlab--guía-de-uso-modo-offline)
  - [📑 Tabla de Contenido](#-tabla-de-contenido)
  - [⚙️ Requisitos](#️-requisitos)
  - [🚀 Instrucciones de ejecución](#-instrucciones-de-ejecución)
  - [✨ Características](#-características)
  - [💡 Tips y recomendaciones](#-tips-y-recomendaciones)

---

## ⚙️ Requisitos

- **Navegador:** Cualquier navegador moderno con soporte para ES6+.
- **Espacio en disco:** Mínimo, la herramienta ocupa apenas un par de megabytes.
- **Estructura:** Mantener la integridad de las carpetas `css/` y `js/` con respecto al archivo `index.html`.
- **Conexión a internet (puntual):** No es necesaria para calcular, pero sí para la opción **Exportar PDF**, ya que las librerías de generación de PDF se cargan desde una CDN externa.

---

## 🚀 Instrucciones de ejecución

1. **Descarga:** Obtenga el proyecto clonando el repositorio con Git o descargando el [archivo ZIP](https://github.com/xorodev/SubnetLab/archive/refs/heads/main.zip) desde GitHub.
2. **Extracción:** Si descargó el ZIP, extraiga el contenido en una carpeta local.
3. **Lanzamiento:**
   - Ubíquese en el archivo `index.html` dentro de la raíz del proyecto.
   - Haga doble clic sobre él o arrástrelo a su navegador.

> [!IMPORTANT]
> No es necesario configurar un servidor web local (como Apache o Nginx). La herramienta está diseñada para funcionar directamente mediante el protocolo `file://`.

---

## ✨ Características

- **Disponibilidad:** Funciona sin conexión a internet en cualquier momento para todos los módulos de cálculo (IPv4, IPv6, FLSM, VLSM, Supernetting).
- **Portabilidad:** Al no requerir instalación ni servidor, puede ejecutarse desde cualquier ubicación en disco.

---

## 💡 Tips y recomendaciones

- **Mantenimiento:** Para obtener nuevas funciones o correcciones, deberá descargar la versión más reciente del repositorio periódicamente.
- **Datos de sesión:** Al igual que en el modo online, ningún dato ingresado en los formularios se guarda; se pierde al cerrar o recargar la página. Exporte en formato PDF los resultados que necesite conservar.
> [!TIP]
> **Uso Profesional:** Puede llevar esta carpeta en una unidad USB para tener la herramienta lista y portable, y así realizar cálculos de subnetting durante auditorías o diseños de red en equipos sin acceso a internet (recordando que la exportación en formato PDF sí lo requerirá).

---

Copyright © 2026 @xorodev (CipherCoreDev). Licensed under the GNU General Public License v3.0
