// main.js - JavaScript para interactividad de LANNA

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed to enhance performance and stop fading out on scroll up
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Slightly before it reaches the bottom
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Parallax Effect ---
  // Simple parallax for the background images
  const parallaxBgs = document.querySelectorAll('.bg-parallax');
  window.addEventListener('scroll', () => {
    let scrollY = window.scrollY;
    parallaxBgs.forEach(bg => {
      // Small adjustment of background position for subtle parallax
      let speed = 0.4;
      bg.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
});
