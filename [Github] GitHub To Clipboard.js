// ==UserScript==
// @name         [Github] GitHub To Clipboard
// @namespace    http://tampermonkey.net/
// @version      2026-10-28
// @description  Copia cambios de github al portapapeles
// @author       LuisML
// @match        https://github.com/*/*/pull/*/changes
// @icon         https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original
// @grant        none
// ==/UserScript==

(function() {
    // Extraer información de la URL actual
    const match = window.location.pathname.match(/\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    if (!match) {
        alert('Por favor, ejecuta este script en la página de un Pull Request de GitHub');
        return;
    }

    const [, owner, repo, prNumber] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`;

    // Crear el botón flotante
    const button = document.createElement('button');
    button.textContent = '📋 Copy Changes PR';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 4px 8px;
        background: #2da44e;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 999999;
        transition: all 0.2s;
        opacity: 0.3;
    `;

    button.addEventListener('mouseenter', () => {
        button.style.background = '#2c974b';
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        button.style.opacity = '0.8';
    });

    button.addEventListener('mouseleave', () => {
        button.style.background = '#2da44e';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        if(!button.disabled){
            button.style.opacity = '0.3';
        }

    });

    button.addEventListener('click', async () => {
        button.textContent = '⏳ Cargando...';
        button.style.opacity = '0.8';
        button.disabled = true;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const files = await response.json();

            // Mapear estados
            const statusMap = {
                'added': 'A',
                'removed': 'D',
                'renamed': 'R',
                'modified': 'M'
            };

            // Generar la lista
            const changes = files.map((file, index) => {
                const status = statusMap[file.status] || '?';
                if (index === 0) {
                    return `${repo}\t${status}\t${file.filename}\t${window.location.href}`;
                }
                return `${repo}\t${status}\t${file.filename}`;
            }).join('\n');

            // Copiar al portapapeles
            await navigator.clipboard.writeText(changes);

            // Feedback visual
            const originalText = button.textContent;
            button.textContent = '✅ ¡Copiado!';
            button.style.background = '#1a7f37';

            setTimeout(() => {
                button.textContent = '📋 Copiar cambios del PR';
                button.style.background = '#2da44e';
                button.disabled = false;
                button.style.opacity = '0.3';
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            button.textContent = '❌ Error';
            button.style.background = '#cf222e';

            setTimeout(() => {
                button.textContent = '📋 Copy Changes PR';
                button.style.background = '#2da44e';
                button.disabled = false;
            }, 2000);
        }
    });

    // Agregar el botón a la página
    document.body.appendChild(button);
    console.log('✅ Botón de copiar cambios del PR agregado');
})();