// Global Interactive Heart & Kiss Click / Touch Explosion
(function() {
  const PARTICLES = ['💖', '💕', '💋', '😘', '✨', '🌸', '🥰', '🎈❤️', '🌹', '🤍', '🎉'];
  let lastClickTime = 0;

  function spawnBurst(x, y) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'global-click-particle';
      el.textContent = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      
      const size = 18 + Math.random() * 16;
      el.style.fontSize = `${size}px`;
      document.body.appendChild(el);

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 40 + Math.random() * 70;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - (30 + Math.random() * 40); // bias upward
      const rot = (Math.random() - 0.5) * 60;

      el.animate([
        { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5}px)) scale(1.2) rotate(${rot * 0.5}deg)`, opacity: 0.9, offset: 0.4 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy - 40}px)) scale(0.7) rotate(${rot}deg)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 400,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }).onfinish = () => el.remove();
    }

    if (window.soundFX && Math.random() < 0.4) {
      window.soundFX.pop(500 + Math.random() * 300);
    }
  }

  function handleInteraction(e) {
    // Don't trigger if target is inside archery bow control during active dragging
    if (e.target && e.target.closest && e.target.closest('#archery')) {
      return;
    }

    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    if (x == null || y == null) return;

    // Throttle slightly to prevent overload on rapid touches
    const now = performance.now();
    if (now - lastClickTime < 60) return;
    lastClickTime = now;

    spawnBurst(x, y);
  }

  window.addEventListener('click', handleInteraction, { passive: true });
  window.addEventListener('touchstart', handleInteraction, { passive: true });
})();
