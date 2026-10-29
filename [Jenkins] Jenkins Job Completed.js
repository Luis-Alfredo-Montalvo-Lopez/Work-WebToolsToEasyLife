// ==UserScript==
// @name         [Jenkins] Jenkins Job Completed
// @namespace    http://tampermonkey.net/
// @version      2026-10-28
// @description  Emite un sonido al terminar de ejecutar un job en jenkins
// @author       LuisML
// @match        https://mx.pro.devops.mapfre.com/jenkins/job/*/job/*/job/*/*
// @icon         https://www.jenkins.io/images/logos/jenkins/jenkins.svg
// @grant        none
// ==/UserScript==

(function () {
  const SELECTOR = '.progress-bar.progress-bar-striped.active';

  let sonidoReproducido = false;
  let observerAtributos = null;
  let barraObservada = null;
  let audioCtx = null;

  // ---------- Audio: Jingle Bells por 10 segundos ----------
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  // Convierte nota musical a frecuencia (Hz)
  function notaAFrecuencia(nota) {
    const notas = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };

    const match = nota.match(/^([A-G]#?)(\d)$/);
    if (!match) return 0;

    const [, nombre, octava] = match;
    const freqBase = notas[nombre];
    const octavaNum = parseInt(octava);

    // Ajustar según octava (C4 = Do central = 261.63 Hz)
    return freqBase * Math.pow(2, octavaNum - 4);
  }

  async function reproducirJingleBells() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Jingle Bells - notas y duraciones (en beats, donde 1 = negra)
      const melodia = [
        // "Jingle bells, jingle bells, jingle all the way"
        { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 2 },
        { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 2 },
        { nota: 'E4', dur: 1 }, { nota: 'G4', dur: 1 }, { nota: 'C4', dur: 1 }, { nota: 'D4', dur: 1 }, { nota: 'E4', dur: 4 },

        // "Oh what fun it is to ride"
        { nota: 'F4', dur: 1 }, { nota: 'F4', dur: 1 }, { nota: 'F4', dur: 1 }, { nota: 'F4', dur: 1 },
        { nota: 'F4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 },
        { nota: 'E4', dur: 1 }, { nota: 'D4', dur: 1 }, { nota: 'D4', dur: 1 }, { nota: 'E4', dur: 1 },
        { nota: 'D4', dur: 2 }, { nota: 'G4', dur: 2 },

        // Repetir para llenar 10 segundos
        { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 2 },
        { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 2 },
        { nota: 'E4', dur: 1 }, { nota: 'G4', dur: 1 }, { nota: 'C4', dur: 1 }, { nota: 'D4', dur: 1 }, { nota: 'E4', dur: 4 },
        { nota: 'F4', dur: 1 }, { nota: 'F4', dur: 1 }, { nota: 'F4', dur: 1 }, { nota: 'F4', dur: 1 },
        { nota: 'F4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 }, { nota: 'E4', dur: 1 },
      ];

      const tempo = 140; // BPM
      const duracionBeat = 60 / tempo; // segundos por beat
      const tiempoInicio = ctx.currentTime;
      const duracionTotal = 11; // segundos

      let tiempoActual = 0;

      for (const { nota, dur } of melodia) {
        // Verificar si ya pasaron 10 segundos
        if (tiempoActual >= duracionTotal) break;

        const freq = notaAFrecuencia(nota);
        const duracionNota = dur * duracionBeat;

        // Limitar la última nota para no pasar de 10 seg
        const duracionReal = Math.min(duracionNota, duracionTotal - tiempoActual);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // sonido más suave, tipo campana
        osc.frequency.value = freq;

        osc.connect(gain).connect(ctx.destination);

        const inicio = tiempoInicio + tiempoActual;
        const fin = inicio + duracionReal;

        // Envelope: ataque rápido, decaimiento suave
        gain.gain.setValueAtTime(0, inicio);
        gain.gain.linearRampToValueAtTime(0.3, inicio + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, fin);

        osc.start(inicio);
        osc.stop(fin);

        tiempoActual += duracionReal;
      }

      console.log('🎄 Jingle Bells reproduciéndose por 10 segundos');
    } catch (e) {
      console.warn('Error reproduciendo Jingle Bells:', e);
    }
  }

  function dispararSonido(motivo) {
    if (sonidoReproducido) return;
    sonidoReproducido = true;
    console.log('✅ Completado. Motivo:', motivo);
    reproducirJingleBells();
  }

  // ---------- ¿Está al 100%? ----------
  function estaAl100(el) {
    const aria = parseFloat(el.getAttribute('aria-valuenow'));
    if (!isNaN(aria) && aria >= 100) return true;
    const w = parseFloat(el.style.width);
    if (!isNaN(w) && w >= 100) return true;
    return false;
  }

  // ---------- Observador de la barra ----------
  function observarBarra(barra) {
    if (barraObservada === barra) return;
    if (observerAtributos) observerAtributos.disconnect();
    barraObservada = barra;
    //console.log('👀 Observando barra');

    observerAtributos = new MutationObserver(() => {
      if (estaAl100(barra)) dispararSonido('aria-valuenow / width >= 100%');
    });
    observerAtributos.observe(barra, {
      attributes: true,
      attributeFilter: ['style', 'aria-valuenow', 'aria-valuetext', 'class']
    });

    if (estaAl100(barra)) dispararSonido('ya estaba al 100%');
  }

  // ---------- Observador global ----------
  const observerGlobal = new MutationObserver(() => {
    const barraActual = document.querySelector(SELECTOR);
    if (barraActual) {
      observarBarra(barraActual);
    } else if (barraObservada && !sonidoReproducido) {
      dispararSonido('la barra desapareció del DOM');
      if (observerAtributos) observerAtributos.disconnect();
      barraObservada = null;
    }
  });

  observerGlobal.observe(document.body, { childList: true, subtree: true });

  const inicial = document.querySelector(SELECTOR);
  if (inicial) observarBarra(inicial);

  // ---------- Botón de prueba ----------
  if (!document.getElementById('__test_audio_btn')) {
    const btn = document.createElement('button');
    btn.id = '__test_audio_btn';
    btn.textContent = '🎄 Probar Jingle Bells';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;padding:4px 8px;background:#dc2626;color:#fff;border:0;border-radius:6px;cursor:pointer;font-family:sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.3);opacity: 0.3;';
    btn.onclick = async () => {
      console.log('Prueba manual disparada');
      await reproducirJingleBells();
    };
    document.body.appendChild(btn);
  }

  console.log('🟢 Monitor activo (Jingle Bells 10 seg al completar)');
})();