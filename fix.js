const fs = require('fs');

let html = fs.readFileSync('presentacion.html', 'utf8');

// Fix the corrupted HTML from fuzzy replace:
// It removed the fullscreen button and <div class="pres-wrapper">
const fixReplacement =     <!-- FULLSCREEN BUTTON -->
    <button class="pres-fullscreen" title="Pantalla completa (F)">
      <svg viewBox="0 0 24 24">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
      </svg>
    </button>

    <!-- DOT NAVIGATION -->
    <div class="pres-dots"></div>

    <!-- ==========================================
       SLIDES
       ========================================== -->
    <div class="pres-wrapper">
;

// Wait, doing this via string replace is risky.
// Let me look at the HTML first.
