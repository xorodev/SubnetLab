<div align="center">

# SubnetLab — Laboratorio de Subnetting

[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat)](https://www.gnu.org/licenses/gpl-3.0.txt)
[![Release](https://img.shields.io/badge/Version-v1.0.0--release-blue?style=flat)](https://github.com/xorodev/SubnetLab/releases/tag/v1.0.0-release)
![Platform](https://img.shields.io/badge/Platform-Web-06b6d4?logo=googlechrome&logoColor=white&style=flat)
![Status](https://img.shields.io/badge/Status-In%20maintenance-orange?style=flat)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-181717?style=flat&logo=github&logoColor=white)](https://xorodev.github.io/SubnetLab)

</div>

<div align="center">
  <img 
    src="assets/icons/subnetlab_icon.svg"
    alt="SubnetLab Logo"
    width="200"
    style="border: 2px solid #1a7fff; border-radius: 20px; padding: 20px; background: #080d18;"
  >
</div>

<br>

> **SubnetLab** es una **herramienta web** diseñada para realizar **subnetting extremo sobre direcciones IP** de manera rápida, visual y precisa, tanto para quienes se inician en redes como para **ingenieros de redes** que necesitan resultados exactos en entornos profesionales.

La plataforma permite **calcular, dividir y resumir bloques de direcciones IPv4 e IPv6** mediante una **interfaz de alto rendimiento**, sin necesidad de instalación ni conocimientos previos avanzados. Todos los cálculos se ejecutan **localmente en el navegador**, garantizando que ningún dato de red introducido se transmita a servidores externos.

<div align="center">

Lenguajes de programación utilizados:

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
</div>

---

## 📑 Tabla de Contenidos
- [SubnetLab — Laboratorio de Subnetting!](#subnetlab--laboratorio-de-subnetting)
  - [🧮 Módulos Disponibles](#-módulos-disponibles)
  - [🚀 Inicio Rápido](#-inicio-rápido)
    - [Recomendación](#recomendación)
  - [📝 Licencia](#-licencia)
  - [🛠️ Soporte](#️-soporte)
  - [⚡ Contribuciones](#-contribuciones)

---

## 🧮 Módulos Disponibles

| Módulo | Descripción |
|---|---|
| **Calculadora IPv4** | Máscaras, rangos de red y clase de dirección para bloques IPv4. |
| **Calculadora IPv6** | Expansión, compresión y rango de bloques para direcciones IPv6. |
| **FLSM** | Divide una red base en subredes de igual tamaño (Máscara de Longitud Fija). |
| **VLSM** | Asigna subredes de tamaño variable según los hosts requeridos (Máscara de Longitud Variable). |
| **Supernetting** | Resume múltiples redes en una sola ruta CIDR. |

Cada módulo permite **exportar los resultados en formato PDF** de forma individual.

---

## 🚀 Inicio Rápido
> [!NOTE]
> Para aprender a utilizar la herramienta y conocer las **modalidades de ejecución** (como la versión online, y la versión offline), consulte la [Guía de Uso](./docs/USAGE.md).

### Recomendación
> [!WARNING]
> **SubnetLab** es una herramienta de apoyo y cálculo. Se recomienda **verificar los resultados críticos** antes de aplicarlos en un entorno de producción, especialmente en diseños VLSM o resúmenes de Supernetting sobre infraestructura en uso.

---

## 📝 Licencia

Este proyecto está bajo la licencia **GNU General Public License v3.0 (GPLv3)**.  
Consulte el archivo [LICENSE](./LICENSE) para conocer los términos completos.

---

## 🛠️ Soporte

Este proyecto se proporciona **tal cual** y puede **actualizarse con el tiempo**.  
Si encuentra errores, tiene dudas o sugerencias de mejora, puede **abrir un [issue](https://github.com/xorodev/SubnetLab/issues)** en GitHub.

---

## ⚡ Contribuciones

**Las contribuciones son bienvenidas.** Puede colaborar siguiendo estos pasos:

1. Hacer un fork del repositorio.
2. Crear una rama para su mejora (`git checkout -b my-branch`).
3. Realizar los cambios respetando la estructura modular del proyecto (`js/core` para lógica de cálculo, `js/ui` para interfaz).
4. Enviar un pull request.

---

Copyright © 2026 @xorodev (CipherCoreDev). Licensed under the GNU General Public License v3.0
