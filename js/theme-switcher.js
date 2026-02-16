/* ═══════════════════════════════════════════════════
   VITALSPACE THEME SWITCHER
   Toggles between dark (new-design-system.css)
   and light (light-design-system.css) themes.
   Persists choice in localStorage across pages.
   Auto-switches based on time of day (6:00–18:00 = light).
   ═══════════════════════════════════════════════════ */
(function () {
    'use strict';

    var DARK_FILE = 'new-design-system.css';
    var LIGHT_FILE = 'light-design-system.css';
    var STORAGE_KEY = 'vitalspace-theme';
    var MODE_KEY = 'vitalspace-theme-mode'; // 'auto' or 'manual'
    var LIGHT_START = 6;  // 06:00
    var LIGHT_END = 18;   // 18:00

    /* ── Resolve the stylesheet <link> ── */
    var link = document.getElementById('themeStylesheet');
    if (!link) return;

    /* ── Determine base path (root vs subfolder) ── */
    var href = link.getAttribute('href');
    var prefix = href.substring(0, href.lastIndexOf('/') + 1); // "css/" or "../css/"

    /* ── Time-based theme detection ── */
    function getTimeTheme() {
        var h = new Date().getHours();
        return (h >= LIGHT_START && h < LIGHT_END) ? 'light' : 'dark';
    }

    /* ── Read mode & preference ── */
    var mode = localStorage.getItem(MODE_KEY) || 'auto';
    var saved = (mode === 'auto') ? getTimeTheme() : (localStorage.getItem(STORAGE_KEY) || 'dark');

    function applyTheme(theme) {
        link.setAttribute('href', prefix + (theme === 'light' ? LIGHT_FILE : DARK_FILE));
        localStorage.setItem(STORAGE_KEY, theme);
        updateToggleIcon(theme);
    }

    function updateToggleIcon(theme) {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        var currentMode = localStorage.getItem(MODE_KEY) || 'auto';
        // Sun = dark mode (switch to light), Moon = light mode (switch to dark), Monitor = auto
        if (currentMode === 'auto') {
            btn.innerHTML = '<i data-lucide="monitor" style="width:20px;height:20px;"></i>';
            btn.setAttribute('aria-label', 'Automatický režim (podle času) — klikněte pro ruční přepnutí');
            btn.setAttribute('title', 'Auto (' + (theme === 'dark' ? 'tmavý' : 'světlý') + ')');
        } else {
            btn.innerHTML = theme === 'dark'
                ? '<i data-lucide="sun" style="width:20px;height:20px;"></i>'
                : '<i data-lucide="moon" style="width:20px;height:20px;"></i>';
            btn.setAttribute('aria-label', theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim');
            btn.setAttribute('title', theme === 'dark' ? 'Tmavý režim' : 'Světlý režim');
        }
        // Re-render Lucide icons inside the button
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    /* ── Apply theme immediately ── */
    applyTheme(saved);

    /* ── Bind toggle button when DOM is ready ── */
    /* Click cycle: auto → manual light → manual dark → auto */
    function bindToggle() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        updateToggleIcon(localStorage.getItem(STORAGE_KEY) || 'dark');

        btn.addEventListener('click', function () {
            var currentMode = localStorage.getItem(MODE_KEY) || 'auto';
            var currentTheme = localStorage.getItem(STORAGE_KEY) || 'dark';

            if (currentMode === 'auto') {
                // auto → manual: switch to opposite of current
                localStorage.setItem(MODE_KEY, 'manual');
                applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
            } else if (currentTheme === 'light') {
                // manual light → manual dark
                applyTheme('dark');
            } else {
                // manual dark → back to auto
                localStorage.setItem(MODE_KEY, 'auto');
                applyTheme(getTimeTheme());
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindToggle);
    } else {
        bindToggle();
    }

    /* ── Auto-update every minute when in auto mode ── */
    setInterval(function () {
        if ((localStorage.getItem(MODE_KEY) || 'auto') === 'auto') {
            applyTheme(getTimeTheme());
        }
    }, 60000);
})();
