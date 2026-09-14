# Changelog — SubnetLab

## 🛠️ Parche de interfaz y mantenimiento — 2026-09-14

Parche de mantenimiento enfocado en correcciones de alineación visual y actualización del número de versión a **v1.0.1**.

### 🐛 Correcciones de UI
- **Pie de página (Footer):** Se corrigió la alineación horizontal del aviso de privacidad (`.footer-privacy`) para que permanezca centrado en pantallas anchas y monitores de alta resolución.

### 🔧 Mantenimiento
- **Control de versión:** Actualización global de las referencias a la versión **v1.0.1** en la barra lateral, títulos dinámicos del navegador (`js/ui/navigation.js`), `index.html` y la documentación general (`README.md`).

---

## ✨ Lanzamiento inicial — 2026-09-14
Primera versión estable de **SubnetLab**, un laboratorio interactivo para el subnetting extremo de direcciones IP, pensado tanto para usuarios sin experiencia previa como para **ingenieros de redes**.

### 🧮 Módulos
- **Calculadora IPv4:** máscaras, rangos de red y clase de dirección para bloques IPv4.
- **Calculadora IPv6:** expansión, compresión y cálculo de rango de bloques.
- **FLSM:** división de una red base en subredes de tamaño fijo (por número de subredes o por hosts requeridos).
- **VLSM:** asignación de subredes de tamaño variable según los hosts requeridos por cada una.
- **Supernetting:** resumen de múltiples redes en una sola ruta CIDR.

### 🚀 Funcionalidades
- **Exportación en formato PDF** de los resultados, disponible de forma individual en cada módulo.
- **Modo claro/oscuro** con persistencia de preferencia.
- **Navegación lateral colapsable** (`Ctrl+B`) para maximizar el área de trabajo.

### 🔒 Seguridad y privacidad
- Política de seguridad de contenido (CSP) estricta, sin conexiones salientes de datos (`connect-src 'none'`).
- Ningún dato ingresado en los formularios (direcciones IP, prefijos, hosts) se almacena; se descarta automáticamente al recargar o cerrar la página.
- Solo se guarda localmente, en el navegador, la última pestaña visitada y la preferencia de tema visual.
