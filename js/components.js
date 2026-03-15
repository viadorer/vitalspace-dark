/* ═══════════════════════════════════════════════════
   VITALSPACE SHARED COMPONENTS
   Injects consistent header (nav) and footer
   into every page. Detects root vs subfolder
   and highlights the active nav item.
   ═══════════════════════════════════════════════════ */
(function () {
    'use strict';

    // Detect if page is in a subfolder
    var path = window.location.pathname;
    var inDeepSub = /\/blog\/posts\//.test(path);
    var inSub = !inDeepSub && /\/(zarizeni|pronajem|sluzby|blog|pages|private)\//.test(path);
    var R = inDeepSub ? '../../' : (inSub ? '../' : '');  // root prefix

    // Detect active section from URL
    var activeSec = '';
    if (/zarizeni/.test(path)) activeSec = 'zarizeni';
    else if (/pronajem/.test(path)) activeSec = 'pronajem';
    else if (/sluzby/.test(path)) activeSec = 'sluzby';
    else if (/o-nas/.test(path)) activeSec = 'o-nas';
    else if (/blog/.test(path)) activeSec = 'blog';

    function ac(sec) { return activeSec === sec ? ' class="active"' : ''; }

    // Home link — always points to vitalspace-homepage.html
    var HOME = R + 'vitalspace-homepage.html';

    // ══════════════════════════════════════
    //  HEADER (nav + mobile menu)
    // ══════════════════════════════════════
    function renderHeader() {
        return '' +
        '<nav class="nav" id="mainNav">' +
        '  <div class="nav-inner">' +
        '    <a href="' + HOME + '" class="nav-logo"><img src="' + R + 'logo-vitalspace.png" alt="VitalSpace" style="width:42px;height:42px;object-fit:contain;"> VitalSpace</a>' +
        '    <ul class="nav-links">' +
        '      <li class="nav-dropdown">' +
        '        <a href="' + R + 'zarizeni/"' + ac('zarizeni') + '>Zařízení</a>' +
        '        <div class="dropdown-menu">' +
        '          <a href="' + R + 'zarizeni/ozon-cleaner-pro.html">OZON Storm Pro I PLUS</a>' +
        '          <a href="' + R + 'zarizeni/ozon-clean-up.html">OZON Breeze Up</a>' +
        '          <a href="' + R + 'zarizeni/ozon-clean-box.html">OZON Oasis Box – DRY</a>' +
        '          <a href="' + R + 'zarizeni/srovnani.html">Srovnání zařízení</a>' +
        '        </div>' +
        '      </li>' +
        '      <li class="nav-dropdown">' +
        '        <a href="' + R + 'pronajem/"' + ac('pronajem') + '>Pronájem</a>' +
        '        <div class="dropdown-menu">' +
        '          <a href="' + R + 'pronajem/dlouhodoby.html">Dlouhodobý pronájem</a>' +
        '          <a href="' + R + 'pronajem/kratkodoba.html">Krátkodobý pronájem</a>' +
        '        </div>' +
        '      </li>' +
        '      <li class="nav-dropdown">' +
        '        <a href="' + R + 'sluzby/"' + ac('sluzby') + '>Služby</a>' +
        '        <div class="dropdown-menu">' +
        '          <a href="' + R + 'sluzby/reset.html">Reset prostoru</a>' +
        '          <a href="' + R + 'sluzby/prevent.html">Prevent program</a>' +
        '          <a href="' + R + 'sluzby/clinic.html">Clinic Standard</a>' +
        '        </div>' +
        '      </li>' +
        '      <li><a href="' + R + 'jak-to-probiha.html"' + ac('jak-to-probiha') + '>Jak to probíhá</a></li>' +
        '      <li><a href="' + R + 'o-nas.html"' + ac('o-nas') + '>O nás</a></li>' +
        '      <li><a href="' + R + 'blog/"' + ac('blog') + '>Blog</a></li>' +
        '    </ul>' +
        '    <div class="nav-cta">' +
        '      <button id="ozoneBtn" style="background:none;border:1px solid rgba(51,136,255,0.25);border-radius:8px;padding:0.45rem 0.75rem;cursor:pointer;color:var(--blue-400);display:flex;align-items:center;gap:0.375rem;font-size:0.8125rem;font-weight:600;font-family:inherit;transition:all 0.2s;" aria-label="Spustit ozonizaci" title="Spustit ozonizaci">' +
        '        <i data-lucide="atom" style="width:18px;height:18px;"></i> Spustit ozonizaci' +
        '      </button>' +
        '      <button id="themeToggle" style="background:none;border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:0.45rem;cursor:pointer;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;transition:all 0.2s;" aria-label="Přepnout téma">' +
        '        <i data-lucide="sun" style="width:20px;height:20px;"></i>' +
        '      </button>' +
        '      <a href="#kontakt" class="btn-primary" style="padding:0.6rem 1.25rem;font-size:0.875rem;">Získat nabídku</a>' +
        '    </div>' +
        '    <button class="mobile-toggle" id="mobileToggle" aria-label="Menu"><i data-lucide="menu" style="width:24px;height:24px;"></i></button>' +
        '  </div>' +
        '</nav>' +
        '<div class="mobile-overlay" id="mobileOverlay"></div>' +
        '<div class="mobile-menu" id="mobileMenu">' +
        '  <button class="mobile-close" id="mobileClose" aria-label="Zavřít"><i data-lucide="x" style="width:24px;height:24px;"></i></button>' +
        '  <div class="mobile-section-title">Zařízení</div>' +
        '  <a href="' + R + 'zarizeni/ozon-cleaner-pro.html">OZON Storm Pro I PLUS</a>' +
        '  <a href="' + R + 'zarizeni/ozon-clean-up.html">OZON Breeze Up</a>' +
        '  <a href="' + R + 'zarizeni/ozon-clean-box.html">OZON Oasis Box – DRY</a>' +
        '  <a href="' + R + 'zarizeni/srovnani.html">Srovnání zařízení</a>' +
        '  <div class="mobile-section-title">Pronájem</div>' +
        '  <a href="' + R + 'pronajem/dlouhodoby.html">Dlouhodobý pronájem</a>' +
        '  <a href="' + R + 'pronajem/kratkodoba.html">Krátkodobý pronájem</a>' +
        '  <div class="mobile-section-title">Služby</div>' +
        '  <a href="' + R + 'sluzby/reset.html">Reset prostoru</a>' +
        '  <a href="' + R + 'sluzby/prevent.html">Prevent program</a>' +
        '  <a href="' + R + 'sluzby/clinic.html">Clinic Standard</a>' +
        '  <div style="margin-top:1.5rem;"><a href="' + R + 'jak-to-probiha.html">Jak to probíhá</a></div>' +
        '  <div style="margin-top:0.5rem;"><a href="' + R + 'o-nas.html">O nás</a></div>' +
        '  <div style="margin-top:0.5rem;"><a href="' + R + 'blog/">Blog</a></div>' +
        '  <div style="margin-top:1.5rem;"><a href="#kontakt" class="btn-primary" style="display:block;text-align:center;">Získat nabídku</a></div>' +
        '</div>';
    }

    // ══════════════════════════════════════
    //  FOOTER
    // ══════════════════════════════════════
    function renderFooter() {
        return '' +
        '<footer class="footer">' +
        '  <div class="container">' +
        '    <div class="footer-grid">' +
        '      <div class="footer-brand">' +
        '        <a href="' + HOME + '" class="nav-logo" style="margin-bottom:0.5rem;"><img src="' + R + 'logo-vitalspace.png" alt="VitalSpace" style="width:36px;height:36px;object-fit:contain;"> VitalSpace</a>' +
        '        <p>Certifikovaná ozonová sanitace pro celou Českou republiku. Prodej, pronájem a servis profesionálních ozonových zařízení.</p>' +
        '      </div>' +
        '      <div>' +
        '        <h4>Zařízení</h4>' +
        '        <ul class="footer-links">' +
        '          <li><a href="' + R + 'zarizeni/ozon-cleaner-pro.html">OZON Storm Pro I PLUS</a></li>' +
        '          <li><a href="' + R + 'zarizeni/ozon-clean-up.html">OZON Breeze Up</a></li>' +
        '          <li><a href="' + R + 'zarizeni/ozon-clean-box.html">OZON Oasis Box – DRY</a></li>' +
        '          <li><a href="' + R + 'zarizeni/srovnani.html">Srovnání zařízení</a></li>' +
        '        </ul>' +
        '      </div>' +
        '      <div>' +
        '        <h4>Pronájem a služby</h4>' +
        '        <ul class="footer-links">' +
        '          <li><a href="' + R + 'pronajem/dlouhodoby.html">Dlouhodobý pronájem</a></li>' +
        '          <li><a href="' + R + 'pronajem/kratkodoba.html">Krátkodobý pronájem</a></li>' +
        '          <li><a href="' + R + 'sluzby/reset.html">Reset prostoru</a></li>' +
        '          <li><a href="' + R + 'sluzby/prevent.html">Prevent program</a></li>' +
        '          <li><a href="' + R + 'sluzby/clinic.html">Clinic Standard</a></li>' +
        '        </ul>' +
        '      </div>' +
        '      <div>' +
        '        <h4>Kontakt</h4>' +
        '        <ul class="footer-contact">' +
        '          <li><i data-lucide="phone"></i> +420 603 834 921</li>' +
        '          <li><i data-lucide="mail"></i> info@vitalspace.cz</li>' +
        '          <li><i data-lucide="map-pin"></i> Plzeň &amp; Praha | Celá ČR</li>' +
        '        </ul>' +
        '      </div>' +
        '    </div>' +
        '    <div class="footer-bottom">' +
        '      <span>&copy; 2025 VitalSpace. Všechna práva vyhrazena.</span>' +
        '      <div class="footer-legal"><a href="#">VOP</a><a href="#">Ochrana osobních údajů</a></div>' +
        '    </div>' +
        '  </div>' +
        '</footer>';
    }

    // ══════════════════════════════════════
    //  INJECT
    // ══════════════════════════════════════
    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');

    if (headerEl) headerEl.innerHTML = renderHeader();
    if (footerEl) footerEl.innerHTML = renderFooter();

    // Re-init Lucide icons after injection
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ══════════════════════════════════════
    //  MOBILE MENU LOGIC
    // ══════════════════════════════════════
    var mobileToggle = document.getElementById('mobileToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileOverlay = document.getElementById('mobileOverlay');
    var mobileClose = document.getElementById('mobileClose');

    function openMobile() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('open');
        mobileMenu.style.display = 'block';
        if (mobileOverlay) mobileOverlay.classList.add('open');
    }
    function closeMobile() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('open');
        setTimeout(function () {
            if (mobileMenu && !mobileMenu.classList.contains('open')) mobileMenu.style.display = 'none';
        }, 400);
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobile);
    if (mobileClose) mobileClose.addEventListener('click', closeMobile);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobile);
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', closeMobile);
        });
    }

    // ══════════════════════════════════════
    //  NAV SCROLL EFFECT
    // ══════════════════════════════════════
    var nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ══════════════════════════════════════
    //  SCROLL REVEAL (for all pages)
    // ══════════════════════════════════════
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(function (el) { observer.observe(el); });
    }
})();
