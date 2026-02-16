/* ═══════════════════════════════════════════════════
   VITALSPACE OZONE EFFECT
   "Spustit ozonizaci" — O₃ molecules start tiny,
   grow larger while floating down, and fade out.
   Like snow but with expanding, dissolving molecules.
   ═══════════════════════════════════════════════════ */
(function () {
    'use strict';

    var PARTICLE_COUNT = 70;
    var DURATION_MS = 10000;
    var isRunning = false;

    function createContainer() {
        var el = document.createElement('div');
        el.id = 'ozoneContainer';
        el.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'pointer-events:none;z-index:9998;overflow:hidden;';
        document.body.appendChild(el);
        return el;
    }

    function rand(a, b) { return a + Math.random() * (b - a); }

    function spawnParticle(container) {
        var p = document.createElement('span');
        var startX = rand(2, 98);
        var drift = rand(-80, 80);
        var fallDur = rand(5, 10);
        var delay = rand(0, 4);
        var endScale = rand(2.5, 5);
        var rotation = rand(-60, 60);
        var hue = Math.round(rand(200, 220));

        p.textContent = 'O₃';

        p.style.cssText =
            'position:absolute;' +
            'left:' + startX + '%;' +
            'top:-30px;' +
            'font-size:10px;' +
            'font-weight:800;' +
            'font-family:Inter,system-ui,sans-serif;' +
            'color:hsl(' + hue + ',90%,65%);' +
            'text-shadow:0 0 6px hsla(' + hue + ',90%,60%,0.5);' +
            'pointer-events:none;' +
            'user-select:none;' +
            'opacity:0;' +
            'will-change:transform,opacity;' +
            'animation:ozoneGrow ' + fallDur + 's ' + delay + 's ease-out forwards;' +
            '--drift:' + drift + 'px;' +
            '--end-scale:' + endScale + ';' +
            '--end-rot:' + rotation + 'deg;';

        container.appendChild(p);
    }

    function injectStyles() {
        if (document.getElementById('ozoneStyles')) return;
        var style = document.createElement('style');
        style.id = 'ozoneStyles';
        style.textContent =
            '@keyframes ozoneGrow {' +
            '  0%   { opacity:0;   transform:translateY(0)     translateX(0)                    scale(0.4) rotate(0deg); }' +
            '  5%   { opacity:0.9; transform:translateY(3vh)   translateX(calc(var(--drift)*0.05)) scale(0.6) rotate(5deg); }' +
            '  25%  { opacity:0.8; transform:translateY(20vh)  translateX(calc(var(--drift)*0.3))  scale(calc(var(--end-scale)*0.4)) rotate(calc(var(--end-rot)*0.3)); }' +
            '  50%  { opacity:0.5; transform:translateY(45vh)  translateX(calc(var(--drift)*0.6))  scale(calc(var(--end-scale)*0.7)) rotate(calc(var(--end-rot)*0.6)); }' +
            '  75%  { opacity:0.2; transform:translateY(70vh)  translateX(calc(var(--drift)*0.85)) scale(calc(var(--end-scale)*0.9)) rotate(calc(var(--end-rot)*0.85)); }' +
            '  100% { opacity:0;   transform:translateY(100vh) translateX(var(--drift))             scale(var(--end-scale))           rotate(var(--end-rot)); }' +
            '}' +
            '@keyframes ozonePulse {' +
            '  0%,100% { box-shadow:0 0 8px rgba(51,136,255,0.3); }' +
            '  50%     { box-shadow:0 0 20px rgba(51,136,255,0.7); }' +
            '}' +
            '#ozoneBtn.ozone-active {' +
            '  animation:ozonePulse 0.8s ease-in-out infinite;' +
            '  border-color:rgba(51,136,255,0.6) !important;' +
            '}';
        document.head.appendChild(style);
    }

    function startOzone() {
        if (isRunning) return;
        isRunning = true;

        injectStyles();

        var container = document.getElementById('ozoneContainer') || createContainer();
        container.innerHTML = '';

        var btn = document.getElementById('ozoneBtn');
        if (btn) btn.classList.add('ozone-active');

        // Spawn particles in waves
        var spawned = 0;
        var waveInterval = setInterval(function () {
            var batch = Math.min(6, PARTICLE_COUNT - spawned);
            for (var i = 0; i < batch; i++) {
                spawnParticle(container);
                spawned++;
            }
            if (spawned >= PARTICLE_COUNT) clearInterval(waveInterval);
        }, 300);

        // Cleanup
        setTimeout(function () {
            container.innerHTML = '';
            isRunning = false;
            if (btn) btn.classList.remove('ozone-active');
        }, DURATION_MS + 3000);
    }

    window.startOzoneEffect = startOzone;

    // Bind — works whether button exists now or is injected by components.js
    function bind() {
        var btn = document.getElementById('ozoneBtn');
        if (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                startOzone();
            });
        }
    }

    // Try binding now and also after a short delay (for components.js injection)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { bind(); setTimeout(bind, 100); });
    } else {
        bind();
        setTimeout(bind, 100);
    }
})();
