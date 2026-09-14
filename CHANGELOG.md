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
