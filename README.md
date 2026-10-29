# 🚀 Scripts de Tampermonkey para Productividad Laboral

Colección de scripts personalizados para la extensión [Tampermonkey](https://www.tampermonkey.net/) diseñados para optimizar, automatizar y facilitar tareas repetitivas en el entorno de trabajo. 

> ⚠️ **Nota:** Estos scripts están pensados para uso interno y para mejorar el flujo de trabajo personal. Úsalos bajo tu propia responsabilidad y respeta las políticas de uso de las herramientas de tu empresa.

## ✨ Funcionalidades Principales

Este repositorio contiene los siguientes scripts:

| Script | Descripción | URL de destino (`@match`) |
| :--- | :--- | :--- |
| 📝 **[Nombre del Script 1]** | [Ej: Autocompleta formularios de reporte, añade atajos de teclado, etc.] | `*://*.tuempresa.com/reports*` |
| 🎨 **[Nombre del Script 2]** | [Ej: Mejora la interfaz de usuario, oculta elementos molestos, modo oscuro, etc.] | `*://*.tuempresa.com/dashboard*` |
| ⚡ **[Nombre del Script 3]** | [Ej: Extrae datos de la tabla actual y los exporta a CSV automáticamente.] | `*://*.tuempresa.com/data*` |

*(Añade o quita filas en esta tabla según los scripts que tengas)*

---

## 📦 Dependencias y Requisitos Previos

Para que estos scripts funcionen, no necesitas instalar librerías de Node.js, pero sí necesitas el siguiente software base:

1. **Navegador Web Compatible:** Google Chrome, Mozilla Firefox, Microsoft Edge, Brave, Safari u Opera.
2. **Extensión Tampermonkey:** 
   - [Chrome / Edge / Brave](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/es/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/app/apple-store/id1482490089)

---

## 🛠️ Instalación

### Método 1: Instalación directa desde GitHub (Recomendado)
1. Asegúrate de tener la extensión de **Tampermonkey** instalada en tu navegador.
2. Ve a la carpeta `scripts/` de este repositorio.
3. Haz clic en el archivo del script que desees instalar (ej. `nombre-del-script.user.js`).
4. Haz clic en el botón **Raw** (sin formato) en la parte superior derecha del archivo en GitHub.
5. Tampermonkey detectará automáticamente que es un script y abrirá una pestaña de instalación.
6. Haz clic en **Instalar** (o **Update** si ya lo tenías).

### Método 2: Instalación manual (Copiar y Pegar)
1. Abre el panel de control de Tampermonkey haciendo clic en el icono de la extensión y seleccionando **Añadir un nuevo script**.
2. Borra todo el código de plantilla que aparece por defecto.
3. Copia el contenido del archivo `.js` desde este repositorio y pégalo en el editor.
4. Presiona `Ctrl + S` (o `Cmd + S` en Mac) o ve a **Archivo > Guardar**.

---

## 💡 Uso y Configuración

Una vez instalados, los scripts se ejecutarán automáticamente cuando navegues a las URLs especificadas en la cabecera del script (`@match` o `@include`).

### Atajos de teclado (Si aplica)
Algunos scripts incluyen atajos para mayor rapidez:
* `Alt + A`: [Ej: Ejecutar acción rápida]
* `Ctrl + Shift + X`: [Ej: Abrir menú de configuración del script]

### Configuración del Script
Si necesitas cambiar variables (como tu ID de empleado, preferencias de color, etc.), abre el panel de Tampermonkey, edita el script y modifica las variables en la sección `// == CONFIGURACIÓN ==` ubicada justo después de la cabecera `// ==UserScript==`.

---

## 🐛 Solución de Problemas (Troubleshooting)

* **El script no se ejecuta:** Asegúrate de que la URL de la página web coincide exactamente con la regla `@match` en la cabecera del script.
* **Conflicto con otras extensiones:** Si usas bloqueadores de anuncios (como uBlock), asegúrate de añadir la web de trabajo a la lista blanca, ya que a veces bloquean scripts de inyección.
* **La página tarda en cargar:** Revisa que el script no esté haciendo peticiones `fetch` o `XMLHttpRequest` pesadas al inicio.

---

## 🤝 Contribuciones

¿Tienes una idea para mejorar el flujo de trabajo? ¡Las contribuciones son bienvenidas!
1. Haz un Fork del proyecto.
2. Crea una rama para tu nueva funcionalidad (`git checkout -b feature/NuevaFuncionalidad`).
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz Push a la rama (`git push origin feature/NuevaFuncionalidad`).
5. Abre un Pull Request.

---

## 📄 Licencia

Distribuido bajo la licencia [MIT / o indica "Uso interno exclusivo"]. Consulta el archivo `LICENSE` para más información.

---
*Desarrollado con ❤️ y ☕ para hacer el trabajo un poco más fácil.*