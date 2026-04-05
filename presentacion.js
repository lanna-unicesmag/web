// presentacion.js — LANNA Slideshow Controller

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const counter = document.querySelector('.slide-counter');
  const progress = document.querySelector('.pres-progress');
  const dots = document.querySelectorAll('.pres-dot');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isTransitioning = false;

  // --- Initialize ---
  function init() {
    goToSlide(0);
    updateDotColors();
  }

  // --- Go to a specific slide ---
  function goToSlide(index) {
    if (isTransitioning && index !== currentSlide) return;
    isTransitioning = true;

    // Remove active from all
    slides.forEach(s => {
      s.classList.remove('active');
      // Reset fade-up animations
      s.querySelectorAll('.fade-up, .fade-in, .scale-up').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // trigger reflow
        el.style.animation = '';
      });
    });

    // Activate target
    currentSlide = index;
    slides[currentSlide].classList.add('active');

    // Update counter
    if (counter) {
      counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }

    // Update progress
    if (progress) {
      const pct = ((currentSlide + 1) / totalSlides) * 100;
      progress.style.width = pct + '%';
    }

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
    updateDotColors();

    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  // --- Navigate ---
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  // --- Dot colors: dark dots on light slides, light dots on dark slides ---
  function updateDotColors() {
    const darkSlides = [0]; // slide-01 has dark bg
    const isDark = darkSlides.includes(currentSlide);
    dots.forEach(dot => {
      dot.classList.toggle('on-dark', isDark);
    });
  }

  // --- Button Handlers ---
  const btnPrev = document.getElementById('pres-prev');
  const btnNext = document.getElementById('pres-next');

  if (btnPrev) btnPrev.addEventListener('click', prevSlide);
  if (btnNext) btnNext.addEventListener('click', nextSlide);

  // --- Dot click ---
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // --- Keyboard Navigation ---
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'Escape':
        // Go back to main site
        window.location.href = 'index.html';
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  });

  // --- Touch / Swipe Support ---
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > 50 && absDx > absDy) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // --- Fullscreen ---
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  const fsBtn = document.querySelector('.pres-fullscreen');
  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

  // --- Auto-hide nav after inactivity ---
  const nav = document.querySelector('.pres-nav');
  let hideTimer;

  function showNav() {
    if (nav) nav.style.opacity = '1';
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (nav) nav.style.opacity = '0.15';
    }, 3000);
  }

  document.addEventListener('mousemove', showNav);
  document.addEventListener('keydown', showNav);
  showNav();

  // --- Init ---
  init();
});
