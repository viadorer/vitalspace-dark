/* ═══════════════════════════════════════════════════
   VITALSPACE OZONE EFFECT
   "Spustit ozonizaci" — O₃ molecules start tiny,
   grow larger while floating down, and fade out.
   Fun easter-egg for visitors.
   ═══════════════════════════════════════════════════ */
(function () {
    'use strict';

    var PARTICLE_COUNT = 80;
    var DURATION_MS = 10000;
    var isRunning = false;
    var bound = false;

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
        var startX = rand(0, 100);
        var drift = rand(-100, 100);
        var fallDur = rand(4, 9);
        var delay = rand(0, 3.5);
        var endScale = rand(2, 5.5);
        var rotation = rand(-90, 90);
        var hue = Math.round(rand(195, 225));
        var lightness = Math.round(rand(55, 75));

        // Mix of O₃ text styles
        var variants = ['O₃', 'O₃', 'O₃', 'O\u2083', '03'];
        p.textContent = variants[Math.floor(Math.random() * variants.length)];

        p.style.cssText =
            'position:absolute;' +
            'left:' + startX + '%;' +
            'top:-30px;' +
            'font-size:10px;' +
            'font-weight:800;' +
            'font-family:Inter,system-ui,sans-serif;' +
            'color:hsl(' + hue + ',85%,' + lightness + '%);' +
            'text-shadow:0 0 8px hsla(' + hue + ',90%,60%,0.4), 0 0 20px hsla(' + hue + ',80%,50%,0.15);' +
            'pointer-events:none;' +
            'user-select:none;' +
            'opacity:0;' +
            'will-change:transform,opacity;' +
            'animation:ozoneGrow ' + fallDur + 's ' + delay + 's cubic-bezier(0.25,0.1,0.25,1) forwards;' +
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
            '  0%   { opacity:0;   transform:translateY(0)     translateX(0)                       scale(0.25) rotate(0deg); }' +
            '  3%   { opacity:0.7; transform:translateY(2vh)   translateX(calc(var(--drift)*0.02))  scale(0.35) rotate(2deg); }' +
            '  8%   { opacity:0.9; transform:translateY(6vh)   translateX(calc(var(--drift)*0.06))  scale(0.5)  rotate(calc(var(--end-rot)*0.08)); }' +
            '  15%  { opacity:0.85;transform:translateY(12vh)  translateX(calc(var(--drift)*0.13))  scale(calc(var(--end-scale)*0.25)) rotate(calc(var(--end-rot)*0.15)); }' +
            '  30%  { opacity:0.7; transform:translateY(26vh)  translateX(calc(var(--drift)*0.28))  scale(calc(var(--end-scale)*0.45)) rotate(calc(var(--end-rot)*0.3)); }' +
            '  50%  { opacity:0.45;transform:translateY(45vh)  translateX(calc(var(--drift)*0.5))   scale(calc(var(--end-scale)*0.65)) rotate(calc(var(--end-rot)*0.5)); }' +
            '  70%  { opacity:0.2; transform:translateY(65vh)  translateX(calc(var(--drift)*0.72))  scale(calc(var(--end-scale)*0.82)) rotate(calc(var(--end-rot)*0.72)); }' +
            '  85%  { opacity:0.07;transform:translateY(80vh)  translateX(calc(var(--drift)*0.87))  scale(calc(var(--end-scale)*0.93)) rotate(calc(var(--end-rot)*0.87)); }' +
            '  100% { opacity:0;   transform:translateY(105vh) translateX(var(--drift))              scale(var(--end-scale))            rotate(var(--end-rot)); }' +
            '}' +
            '@keyframes ozonePulse {' +
            '  0%,100% { box-shadow:0 0 8px rgba(51,136,255,0.3), inset 0 0 4px rgba(51,136,255,0.1); }' +
            '  50%     { box-shadow:0 0 20px rgba(51,136,255,0.7), inset 0 0 8px rgba(51,136,255,0.2); }' +
            '}' +
            '#ozoneBtn { position:relative; }' +
            '#ozoneBtn:hover { border-color:rgba(51,136,255,0.5) !important; color:var(--blue-300) !important; background:rgba(51,136,255,0.06) !important; }' +
            '#ozoneBtn.ozone-active {' +
            '  animation:ozonePulse 0.8s ease-in-out infinite;' +
            '  border-color:rgba(51,136,255,0.6) !important;' +
            '  color:#fff !important;' +
            '  background:rgba(51,136,255,0.15) !important;' +
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
        if (btn) {
            btn.classList.add('ozone-active');
            btn.title = 'Ozonizace probíhá… 🧪';
        }

        // Spawn particles in waves for natural feel
        var spawned = 0;
        var waveInterval = setInterval(function () {
            var batch = Math.min(5 + Math.floor(Math.random() * 4), PARTICLE_COUNT - spawned);
            for (var i = 0; i < batch; i++) {
                spawnParticle(container);
                spawned++;
            }
            if (spawned >= PARTICLE_COUNT) clearInterval(waveInterval);
        }, 250);

        // Cleanup
        setTimeout(function () {
            container.innerHTML = '';
            isRunning = false;
            if (btn) {
                btn.classList.remove('ozone-active');
                btn.title = 'Spustit ozonizaci';
            }
        }, DURATION_MS + 3000);
    }

    window.startOzoneEffect = startOzone;

    // Bind click handler — safe to call multiple times
    function bind() {
        if (bound) return;
        var btn = document.getElementById('ozoneBtn');
        if (!btn) return;
        bound = true;

        btn.title = 'Spustit ozonizaci';

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            startOzone();
        });

        // Inject styles early for hover effect
        injectStyles();
    }

    // Poll for button (handles components.js injecting it later)
    function waitForButton() {
        if (bound) return;
        bind();
        if (!bound) setTimeout(waitForButton, 150);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForButton);
    } else {
        waitForButton();
    }
})();
