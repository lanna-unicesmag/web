// presentacion.js — LANNA Slideshow Controller

// ============================================================



document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const counter = document.querySelector('.slide-counter');
  const progress = document.querySelector('.pres-progress');
  const dotsContainer = document.querySelector('.pres-dots');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isTransitioning = false;

  // --- Generate dots dynamically ---
  let dots = [];
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'pres-dot' + (i === 0 ? ' active' : '');
    dot.dataset.slide = i;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  // --- Initialize ---
  function init() {
    if (counter) counter.textContent = `01 / ${String(totalSlides).padStart(2, '0')}`;
    if (progress) progress.style.width = ((1 / totalSlides) * 100) + '%';
    slides[0].classList.add('active');
    updateDotColors();
  }

  // --- Go to a specific slide ---
  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;

    const oldIndex = currentSlide;
    slides[oldIndex].classList.add('exiting');
    
    setTimeout(() => {
      slides[oldIndex].classList.remove('exiting');
      slides[oldIndex].classList.remove('active');

      // Remove active from all and reset animations
      slides.forEach((s, idx) => {
        if (idx !== index) s.classList.remove('active');
        s.querySelectorAll('.fade-up, .fade-in, .scale-up, .slide-in-up, .slide-in-down, .slide-in-left, .slide-in-right').forEach(el => {
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
      }, 400); // Pequeña espera extra post-transición para evitar spam
    }, 350); // Wait for the faster reverse cascade animations to finish (250ms + 100ms)
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

  // --- Auto-hide all UI controls after inactivity ---
  const controls = [
    document.querySelector('.pres-close'),
    document.querySelector('.pres-fullscreen'),
    document.querySelector('.pres-edit'),
    document.querySelector('.pres-dots'),
    document.querySelector('.pres-nav'),
    document.querySelector('.pres-prev'),
    document.querySelector('.pres-next')
  ].filter(el => el !== null);

  let hideTimer;
  let isHoveringControls = false;

  controls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHoveringControls = true;
      showControls();
    });
    el.addEventListener('mouseleave', () => {
      isHoveringControls = false;
      showControls();
    });
  });

  function showControls() {
    controls.forEach(el => {
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    });
    clearTimeout(hideTimer);
    if (!isHoveringControls) {
      hideTimer = setTimeout(() => {
        controls.forEach(el => {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        });
      }, 3000);
    }
  }

  document.addEventListener('mousemove', showControls);
  
  showControls();

  // --- Init ---
  init();


  // --- Edit Mode ---
  const btnEdit = document.querySelector('.pres-edit');
  let editModeActive = false;
  let dirHandle = null;

  if (btnEdit) {
    btnEdit.addEventListener('click', async () => {
      const psw = prompt('Clave de administrador para edición de imágenes:');
      if (psw !== 'RIPTIDE') {
        if (psw) alert('Clave incorrecta.');
        return;
      }
      
      try {
        alert('SELECCIONA LA CARPETA: Por favor selecciona la carpeta "images" del proyecto Lanna (donde están las fotos actuales) para autorizar su modificación.');
        dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        
        editModeActive = true;
        document.body.classList.add('edit-mode');
        alert('Modo Edición Habilitado.\nAhora haz clic en cualquier foto de la presentación para elegir su reemplazo.');
        
        setupImageEditing();
      } catch (err) {
        console.error(err);
        alert('El acceso a la carpeta local fue denegado o cancelado.');
      }
    });
  }

  function setupImageEditing() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.dataset.editable) return;
      img.dataset.editable = "true";
      
      img.addEventListener('click', async (e) => {
        if (!editModeActive || !dirHandle) return;
        e.preventDefault();
        
        try {
          const srcParts = img.src.split('/');
          const currentFilename = srcParts[srcParts.length - 1].split('?')[0]; // discard query params if any
          if (!currentFilename) return;

          const [fileHandle] = await window.showOpenFilePicker({
            types: [{ description: 'Imágenes', accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] } }],
            multiple: false
          });
          const file = await fileHandle.getFile();
          
          const targetFileHandle = await dirHandle.getFileHandle(decodeURIComponent(currentFilename), { create: true });
          const writable = await targetFileHandle.createWritable();
          await writable.write(file);
          await writable.close();
          
          img.src = './images/' + currentFilename + '?t=' + new Date().getTime();
          console.log('Imagen reemplazada en disco con éxito:', currentFilename);
        } catch (err) {
          console.error(err);
        }
      });
    });
  }
});