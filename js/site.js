/* ═══════════════════════════════════════════════════
   VITALSPACE — Shared Site JavaScript v3.0
   ═══════════════════════════════════════════════════ */
(function() {
    'use strict';

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ── Nav scroll effect ──
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── Mobile menu ──
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');

    function openMobile() {
        if (!mobileMenu) return;
        mobileMenu.style.display = 'block';
        requestAnimationFrame(() => {
            mobileMenu.classList.add('open');
            mobileOverlay.classList.add('open');
        });
    }
    function closeMobile() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        setTimeout(() => {
            if (!mobileMenu.classList.contains('open')) mobileMenu.style.display = 'none';
        }, 400);
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobile);
    if (mobileClose) mobileClose.addEventListener('click', closeMobile);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobile);
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeMobile));
    }

    // ── Scroll reveal ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── FAQ accordion ──
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const expanded = q.getAttribute('aria-expanded') === 'true';
            const answer = q.nextElementSibling;

            // Close all
            document.querySelectorAll('.faq-question').forEach(oq => {
                oq.setAttribute('aria-expanded', 'false');
                oq.nextElementSibling.style.maxHeight = '0';
            });

            if (!expanded) {
                q.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });

        q.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
        });
    });

    // ── Counter animation ──
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const duration = 1500;
                const start = performance.now();

                function animate(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (progress < 1) requestAnimationFrame(animate);
                }
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = nav ? nav.offsetHeight + 20 : 80;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // ── Active nav link ──
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a, .dropdown-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '/') {
            link.classList.add('active');
        }
    });

    // ── Cookie Consent ──
    (function initCookieConsent() {
        if (localStorage.getItem('vs_cookie_consent')) return;
        var bar = document.createElement('div');
        bar.className = 'cookie-consent';
        bar.innerHTML =
            '<div class="cookie-consent-inner">' +
                '<div class="cookie-consent-text">' +
                    'Tento web používá cookies pro zajištění správné funkčnosti a analýzu návštěvnosti. ' +
                    'Používáním webu souhlasíte s jejich využitím. ' +
                    '<a href="' + (/\/blog\/posts\//.test(location.pathname) ? '../../' : /\/(zarizeni|pronajem|sluzby|blog|pages|private)\//.test(location.pathname) ? '../' : '') + 'pages/ochrana-osobnich-udaju.html">Více informací</a>' +
                '</div>' +
                '<div class="cookie-consent-actions">' +
                    '<button class="cookie-decline">Odmítnout</button>' +
                    '<button class="cookie-accept">Přijmout</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(bar);
        setTimeout(function() { bar.classList.add('visible'); }, 800);
        bar.querySelector('.cookie-accept').addEventListener('click', function() {
            localStorage.setItem('vs_cookie_consent', 'accepted');
            bar.classList.remove('visible');
            setTimeout(function() { bar.remove(); }, 500);
        });
        bar.querySelector('.cookie-decline').addEventListener('click', function() {
            localStorage.setItem('vs_cookie_consent', 'declined');
            bar.classList.remove('visible');
            setTimeout(function() { bar.remove(); }, 500);
        });
    })();

    // ── Console branding ──
    console.log(
        '%c VitalSpace — MedTech Platform ',
        'background: #3388ff; color: white; font-size: 14px; padding: 8px 12px; border-radius: 4px;'
    );

})();
