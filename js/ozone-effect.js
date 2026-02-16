/* ═══════════════════════════════════════════════════
   VITALSPACE OZONE EFFECT
   O₃ molecules burst from the button position,
   spread outward, grow larger, and fade away.
   Smooth requestAnimationFrame-based animation.
   ═══════════════════════════════════════════════════ */
(function () {
    'use strict';

    var PARTICLE_COUNT = 60;
    var SPAWN_DURATION = 2500;
    var MAX_DURATION = 15000; // hard cutoff at 15s
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

    /* ── Get button center in viewport coords ── */
    function getBtnOrigin() {
        var btn = document.getElementById('ozoneBtn');
        if (!btn) return { x: window.innerWidth / 2, y: 40 };
        var r = btn.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    /* ── Single particle state ── */
    function makeParticle(origin) {
        var angle = rand(0, Math.PI * 2);
        var speed = rand(60, 200);
        var gravity = rand(30, 80);
        var life = rand(4000, 8000);
        var maxScale = rand(2.5, 5);
        var rotSpeed = rand(-90, 90);
        var hue = Math.round(rand(195, 225));
        var light = Math.round(rand(55, 75));

        return {
            el: null,
            x: origin.x,
            y: origin.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - rand(80, 160),
            gravity: gravity,
            life: life,
            age: 0,
            scale: 0.3,
            maxScale: maxScale,
            rot: 0,
            rotSpeed: rotSpeed,
            hue: hue,
            light: light
        };
    }

    function createParticleEl(container) {
        var el = document.createElement('span');
        el.textContent = 'O₃';
        el.style.cssText =
            'position:absolute;left:0;top:0;' +
            'font-size:10px;font-weight:800;' +
            'font-family:Inter,system-ui,sans-serif;' +
            'pointer-events:none;user-select:none;' +
            'will-change:transform,opacity;' +
            'white-space:nowrap;';
        container.appendChild(el);
        return el;
    }

    function injectStyles() {
        if (document.getElementById('ozoneStyles')) return;
        var s = document.createElement('style');
        s.id = 'ozoneStyles';
        s.textContent =
            '@keyframes ozonePulse{' +
            '0%,100%{box-shadow:0 0 8px rgba(51,136,255,0.3)}' +
            '50%{box-shadow:0 0 20px rgba(51,136,255,0.7)}' +
            '}' +
            '#ozoneBtn{position:relative}' +
            '#ozoneBtn:hover{border-color:rgba(51,136,255,0.5)!important;color:var(--blue-300)!important;background:rgba(51,136,255,0.06)!important}' +
            '#ozoneBtn.ozone-active{animation:ozonePulse .8s ease-in-out infinite;border-color:rgba(51,136,255,0.6)!important;color:#fff!important;background:rgba(51,136,255,0.15)!important}';
        document.head.appendChild(s);
    }

    function startOzone() {
        if (isRunning) return;
        isRunning = true;
        injectStyles();

        var container = document.getElementById('ozoneContainer') || createContainer();
        container.innerHTML = '';

        var btn = document.getElementById('ozoneBtn');
        if (btn) btn.classList.add('ozone-active');

        var origin = getBtnOrigin();
        var particles = [];
        var spawned = 0;
        var spawnStart = performance.now();
        var lastTime = spawnStart;

        /* ── Main animation loop ── */
        function tick(now) {
            var dt = (now - lastTime) / 1000;
            lastTime = now;
            if (dt > 0.1) dt = 0.1; // cap for tab-switch

            /* Spawn new particles over time */
            var spawnElapsed = now - spawnStart;
            if (spawned < PARTICLE_COUNT && spawnElapsed < SPAWN_DURATION) {
                var target = Math.floor((spawnElapsed / SPAWN_DURATION) * PARTICLE_COUNT);
                while (spawned < target && spawned < PARTICLE_COUNT) {
                    var p = makeParticle(origin);
                    p.el = createParticleEl(container);
                    particles.push(p);
                    spawned++;
                }
            }

            /* Update each particle */
            var alive = false;
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                if (!p.el) continue;

                p.age += dt * 1000;
                if (p.age >= p.life) {
                    p.el.remove();
                    p.el = null;
                    continue;
                }
                alive = true;

                var t = p.age / p.life; // 0→1

                /* Physics */
                p.vy += p.gravity * dt;
                p.vx *= (1 - 0.3 * dt); // air drag
                p.x += p.vx * dt;
                p.y += p.vy * dt;

                /* Scale: grow from small to max */
                p.scale = 0.3 + (p.maxScale - 0.3) * Math.min(t * 2.5, 1);

                /* Rotation */
                p.rot += p.rotSpeed * dt;

                /* Opacity: fade in fast, fade out smoothly */
                var opacity;
                if (t < 0.08) {
                    opacity = t / 0.08;
                } else if (t < 0.3) {
                    opacity = 1 - (t - 0.08) * 0.5;
                } else {
                    opacity = Math.max(0, 0.89 - (t - 0.3) * 1.27);
                }

                p.el.style.transform =
                    'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) ' +
                    'scale(' + p.scale.toFixed(2) + ') ' +
                    'rotate(' + p.rot.toFixed(1) + 'deg)';
                p.el.style.opacity = opacity.toFixed(3);
                p.el.style.color = 'hsl(' + p.hue + ',85%,' + p.light + '%)';
                p.el.style.textShadow =
                    '0 0 ' + (6 * p.scale).toFixed(0) + 'px hsla(' + p.hue + ',90%,60%,' + (opacity * 0.5).toFixed(2) + ')';
            }

            var elapsed = now - spawnStart;
            if ((alive || spawned < PARTICLE_COUNT) && elapsed < MAX_DURATION) {
                requestAnimationFrame(tick);
            } else {
                /* All done or 15s hard cutoff */
                container.innerHTML = '';
                isRunning = false;
                if (btn) btn.classList.remove('ozone-active');
            }
        }

        requestAnimationFrame(tick);
    }

    window.startOzoneEffect = startOzone;

    /* ── Bind ── */
    function bind() {
        if (bound) return;
        var btn = document.getElementById('ozoneBtn');
        if (!btn) return;
        bound = true;
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            startOzone();
        });
        injectStyles();
    }

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
