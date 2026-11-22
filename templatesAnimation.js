// Celebration Animation Engine: 12 Luxury Celebration Entrance Animations
// Handles Crossbow Heartbeat, 3D Gift Unboxing, Apology Healing Heart, Ring Reveal, Fireworks & more!

class CelebrationAnimationEngine {
  constructor() {
    this.overlay = document.getElementById('celebrationAnimationOverlay');
    this.canvas = document.getElementById('animStageCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.closeBtn = document.getElementById('closeAnimOverlayBtn');
    this.replayBtn = document.getElementById('replayAnimBtn');
    this.titleEl = document.getElementById('animBannerTitle');
    this.subEl = document.getElementById('animBannerSub');
    this.banner = document.getElementById('animBannerBox');

    this.currentTemplate = 'crossbow_heart';
    this.girlName = 'Queen';
    this.boyName = 'Yuvi';
    this.rafId = null;
    this.particles = [];
    this.animTime = 0;
    this.isRendering = false;

    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn?.addEventListener('click', () => this.hide());
    this.replayBtn?.addEventListener('click', () => {
      this.play(this.currentTemplate, this.girlName, this.boyName, this.isDemo);
    });

    const openSiteDemoBtn = document.getElementById('animOpenSiteDemoBtn');
    openSiteDemoBtn?.addEventListener('click', () => {
      const tmpl = this.currentTemplate || 'crossbow_heart';
      window.open(`./index.html?demo_tmpl=${encodeURIComponent(tmpl)}`, '_blank');
    });

    // Bottom Interactive Experience Dock Buttons
    document.getElementById('animBloomTreeBtn')?.addEventListener('click', () => {
      this.hide();
      if (window.triggerCustomTemplateReveal) {
        window.triggerCustomTemplateReveal();
      } else if (window.fireArrow) {
        window.fireArrow();
      }
    });

    document.getElementById('animPlayMissionsBtn')?.addEventListener('click', () => {
      this.hide();
      window.loveGame?.open();
    });

    document.getElementById('animPlayPuzzleBtn')?.addEventListener('click', () => {
      this.hide();
      window.lovePuzzle?.open();
    });

    document.getElementById('animPlayPianoBtn')?.addEventListener('click', () => {
      this.hide();
      window.lovePiano?.open('piano');
    });

    document.getElementById('animOpenGiftsBtn')?.addEventListener('click', () => {
      this.hide();
      window.birthdayGifts?.open();
    });

    document.getElementById('animReadLetterBtn')?.addEventListener('click', () => {
      this.hide();
      const letterModal = document.getElementById('letterModal');
      if (letterModal) letterModal.classList.add('is-open');
      const letterSec = document.getElementById('letterSection') || document.querySelector('.envelope-wrap');
      letterSec?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.getElementById('animExploreSiteBtn')?.addEventListener('click', () => {
      this.hide();
      const journey = document.getElementById('journey') || document.querySelector('.hero');
      journey?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Canvas Click Interaction (e.g. fire cannon, water splash, heart burst, piano note)
    this.canvas?.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleCanvasClick(x, y);
    });

    // Mousemove / touchmove on canvas for equalizer piano glissando
    this.canvas?.addEventListener('mousemove', (e) => {
      if (this.currentTemplate === 'neon_cyber_pulse' && this.onEqualizerMouseMove) {
        const rect = this.canvas.getBoundingClientRect();
        this.onEqualizerMouseMove(e.clientX - rect.left, e.clientY - rect.top);
      }
    });

    this.canvas?.addEventListener('touchmove', (e) => {
      if (this.currentTemplate === 'neon_cyber_pulse' && this.onEqualizerMouseMove && e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.onEqualizerMouseMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      }
    }, { passive: true });

    const heroPlayBtn = document.getElementById('playTemplateAnimBtn');
    heroPlayBtn?.addEventListener('click', () => {
      const template = window.SiteConfig?.template || 'crossbow_heart';
      const girl = window.SiteConfig?.recipientName || 'Misty';
      const boy = window.SiteConfig?.senderName || 'Yuvi';
      this.play(template, girl, boy, false);
    });

    // Check for URL demo trigger: ?demo_tmpl=crossbow_heart
    const urlParams = new URLSearchParams(window.location.search);
    const demoTmpl = urlParams.get('demo_tmpl') || urlParams.get('demo_template');
    const noAutoPlay = urlParams.get('nowatch') === '1';
    if (demoTmpl && !noAutoPlay) {
      setTimeout(() => {
        this.play(demoTmpl, 'Misty', 'Yuvi', true);
      }, 500);
    }

    window.addEventListener('resize', () => {
      if (this.isRendering) this.resizeCanvas();
    });
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  hide() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this.overlay.classList.remove('is-open');
    }
    document.querySelectorAll('.hero-template-trigger, .neon-piano-hero-banner, .template-interactive-hero-banner').forEach(el => el.remove());
    this.isRendering = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  play(templateId = 'crossbow_heart', girlName = 'Queen', boyName = 'Yuvi', isDemo = false) {
    if (!this.overlay) this.overlay = document.getElementById('celebrationAnimationOverlay');
    if (!this.canvas) this.canvas = document.getElementById('animStageCanvas');
    if (this.canvas && !this.ctx) this.ctx = this.canvas.getContext('2d');
    if (!this.titleEl) this.titleEl = document.getElementById('animBannerTitle');
    if (!this.subEl) this.subEl = document.getElementById('animBannerSub');
    if (!this.banner) this.banner = document.getElementById('animBannerBox');

    this.currentTemplate = templateId;
    this.girlName = girlName || window.SiteConfig?.recipientName || 'Queen';
    this.boyName = boyName || window.SiteConfig?.senderName || 'Yuvi';
    this.isDemo = isDemo;

    if (!this.overlay || !this.canvas) return;
    this.resizeCanvas();

    document.querySelectorAll('.hero-template-trigger, .neon-piano-hero-banner, .template-interactive-hero-banner').forEach(el => el.remove());

    const coupleBtn = document.getElementById('animPlayCoupleBtn');
    if (coupleBtn) {
      coupleBtn.innerHTML = `👩‍❤️‍👨 ${this.girlName} &amp; ${this.boyName} Adventure`;
    }

    const mainBadge = document.getElementById('animMainBadge');
    const useTmplBtn = document.getElementById('animUseTemplateBtn');
    const siteDemoBtn = document.getElementById('animOpenSiteDemoBtn');

    if (isDemo) {
      if (mainBadge) mainBadge.textContent = `🎬 LIVE DEMO (MISTY): ${templateId.replace(/_/g, ' ').toUpperCase()}`;
      if (useTmplBtn) {
        useTmplBtn.style.display = 'inline-flex';
        useTmplBtn.onclick = () => {
          this.hide();
          if (window.adminManager) {
            window.adminManager.openDashboard();
            window.adminManager.selectTemplate(templateId);
          }
        };
      }
      if (siteDemoBtn) {
        siteDemoBtn.style.display = 'inline-flex';
      }
    } else {
      if (mainBadge) mainBadge.textContent = '✨ LUXURY CELEBRATION SHOW ✨';
      if (useTmplBtn) useTmplBtn.style.display = 'none';
      if (siteDemoBtn) siteDemoBtn.style.display = 'none';
    }

    this.overlay.style.display = 'flex';
    this.overlay.classList.add('is-open');
    if (this.banner) this.banner.classList.remove('is-shown');
    this.mountInteractiveExperienceBanner(templateId, this.girlName, this.boyName);

    this.particles = [];
    this.animTime = 0;
    this.isRendering = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);

    // Play fanfare/sound
    if (window.soundFX) window.soundFX.chime?.(1.4);

    switch (templateId) {
      case 'crossbow_heart':
        this.startCrossbowHeart();
        break;
      case 'gift_unboxing':
        this.startGiftUnboxing();
        break;
      case 'apology_healing':
        this.startApologyHealing();
        break;
      case 'ring_reveal':
        this.startRingReveal();
        break;
      case 'midnight_fireworks':
        this.startMidnightFireworks();
        break;
      case 'sakura_waterfall':
        this.startSakuraWaterfall();
        break;
      case 'chocolate_fondue':
        this.startChocolateFondue();
        break;
      case 'cinderella_castle':
        this.startCinderellaCastle();
        break;
      case 'champagne_toast':
        this.startChampagneToast();
        break;
      case 'butterfly_garden':
        this.startButterflyGarden();
        break;
      case 'vintage_scroll':
        this.startVintageScroll();
        break;
      case 'cosmic_stars':
        this.startCosmicStars();
        break;
      case 'waterfall_cascade':
        this.startWaterfallCascade();
        break;
      case 'golden_lantern_river':
        this.startGoldenLanternRiver();
        break;
      case 'rose_rain_storm':
        this.startRoseRainStorm();
        break;
      case 'royal_coronation':
        this.startRoyalCoronation();
        break;
      case 'magic_potion_bubbles':
        this.startMagicPotionBubbles();
        break;
      case 'neon_cyber_pulse':
        this.startNeonCyberPulse();
        break;
      default:
        this.startCrossbowHeart();
    }
  }

  showBanner(title, sub) {
    if (this.titleEl) this.titleEl.innerHTML = title;
    if (this.subEl) this.subEl.innerHTML = sub;
    if (this.banner) {
      this.banner.classList.add('is-shown');
    }
  }

  // 1. 🏹 CUPID'S CROSSBOW & BEATING HEART ANIMATION
  startCrossbowHeart() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const targetX = W / 2;
    const targetY = H / 2 - 40;
    let arrowX = -80;
    let arrowY = H + 40;
    let hit = false;
    let heartScale = 0;
    let shockwaves = [];

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(10, 3, 8, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      const ctx = this.ctx;

      // Draw pulsating target heart
      if (this.animTime > 30) {
        if (!hit) {
          heartScale = Math.min(1, heartScale + 0.05);
        } else {
          // Heartbeat pulse: thump-thump
          const beat = Math.sin(this.animTime * 0.18);
          heartScale = 1.15 + (beat > 0.5 ? (beat - 0.5) * 0.45 : 0);
        }

        ctx.save();
        ctx.translate(targetX, targetY);
        ctx.scale(heartScale, heartScale);

        // Outer glow
        ctx.shadowColor = '#ff2a70';
        ctx.shadowBlur = hit ? 30 : 15;
        ctx.fillStyle = '#ff2a70';

        // Heart shape
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.bezierCurveTo(-45, -30, -75, 20, 0, 75);
        ctx.bezierCurveTo(75, 20, 45, -30, 0, 15);
        ctx.fill();

        // Inner shine
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffd6e7';
        ctx.font = 'bold 15px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.girlName} ♥ ${this.boyName}`, 0, 42);
        ctx.restore();
      }

      // Arrow flight
      if (!hit && this.animTime > 20) {
        const dx = targetX - arrowX;
        const dy = targetY - arrowY;
        const dist = Math.hypot(dx, dy);

        if (dist < 30) {
          hit = true;
          if (window.soundFX) window.soundFX.pop?.();
          this.showBanner(
            `💘 Cupid's Arrow Struck ${this.boyName}'s Heart!`,
            `"${this.boyName}'s heart beats completely and unconditionally for Queen ${this.girlName}! 💖"`
          );
          // Spawn glitter burst
          for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 3 + Math.random() * 8;
            this.particles.push({
              x: targetX,
              y: targetY + 30,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              color: ['#ff2a70', '#ffb8cf', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)],
              size: 4 + Math.random() * 6,
              alpha: 1
            });
          }
        } else {
          arrowX += (dx / dist) * 28;
          arrowY += (dy / dist) * 28;

          // Draw shooting arrow
          ctx.save();
          ctx.translate(arrowX, arrowY);
          const angle = Math.atan2(dy, dx);
          ctx.rotate(angle);

          // Arrow shaft
          ctx.strokeStyle = '#f1c40f';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-50, 0);
          ctx.lineTo(0, 0);
          ctx.stroke();

          // Arrow tip (Heart)
          ctx.fillStyle = '#ff2a70';
          ctx.font = '22px sans-serif';
          ctx.fillText('💖', -10, 8);
          ctx.restore();

          // Sparkle trail
          this.particles.push({
            x: arrowX,
            y: arrowY,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            color: '#f1c40f',
            size: 3 + Math.random() * 4,
            alpha: 1
          });
        }
      }

      // Draw shockwaves on hit
      if (hit && this.animTime % 25 === 0) {
        shockwaves.push({ r: 40, alpha: 0.9 });
      }
      shockwaves.forEach((sw, idx) => {
        sw.r += 4;
        sw.alpha -= 0.015;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 42, 112, ${sw.alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(targetX, targetY + 35, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
      shockwaves = shockwaves.filter(sw => sw.alpha > 0);

      // Render & update particles
      this.renderParticles();

      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 2. 🎁 3D SURPRISE GIFT BOX EXPLOSION
  startGiftUnboxing() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const boxX = W / 2;
    const boxY = H / 2 + 20;
    let boxScale = 0;
    let lidY = 0;
    let opened = false;

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(8, 2, 12, 0.3)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;
      const ctx = this.ctx;

      if (!opened) {
        boxScale = Math.min(1, boxScale + 0.04);
        if (this.animTime > 40) {
          opened = true;
          if (window.soundFX) window.soundFX.victoryFanfare?.();
          this.showBanner(
            `🎁 Grand Surprise Unboxed for Queen ${this.girlName}! 🎂✨`,
            `"Special birthday gifts, unconditional love, and infinite happiness reserved for you babu! 💖"`
          );

          // Explode 100 particles: balloons, confetti, hearts
          const emojis = ['💖', '🎈', '✨', '🎁', '🎉', '🌸', '👑', '⭐'];
          for (let i = 0; i < 90; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 4 + Math.random() * 10;
            this.particles.push({
              x: boxX,
              y: boxY - 30,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 3,
              emoji: emojis[Math.floor(Math.random() * emojis.length)],
              size: 16 + Math.random() * 16,
              alpha: 1
            });
          }
        }
      } else {
        lidY = Math.max(-120, lidY - 5);
      }

      // Draw Gift Box
      ctx.save();
      ctx.translate(boxX, boxY);
      ctx.scale(boxScale, boxScale);

      // Base Box
      ctx.fillStyle = '#ff2a70';
      ctx.fillRect(-60, -30, 120, 90);

      // Ribbon Vertical
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(-12, -30, 24, 90);
      // Ribbon Horizontal
      ctx.fillRect(-60, 15, 120, 20);

      // Lid
      ctx.translate(0, lidY);
      ctx.fillStyle = '#d81159';
      ctx.fillRect(-68, -48, 136, 24);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(-12, -48, 24, 24);

      // Ribbon Bow
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎀', 0, -48);
      ctx.restore();

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 3. 🥺 SWEET APOLOGY & HEALING HEART
  startApologyHealing() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cX = W / 2;
    const cY = H / 2 - 20;
    let healedProgress = 0;

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(18, 5, 10, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;
      const ctx = this.ctx;

      // Sad cloud clearing
      if (this.animTime < 60) {
        // Spawn teardrops
        if (Math.random() < 0.4) {
          this.particles.push({
            x: cX + (Math.random() - 0.5) * 120,
            y: cY - 100,
            vx: 0,
            vy: 4 + Math.random() * 3,
            color: '#70a1ff',
            size: 3 + Math.random() * 4,
            alpha: 1
          });
        }
      } else {
        healedProgress = Math.min(1, healedProgress + 0.02);
      }

      if (this.animTime === 65) {
        if (window.soundFX) window.soundFX.chime?.(1.3);
        this.showBanner(
          `🥺 Kaan Pakad Ke Sorry Babu... Maaf Kar Do Na! 💖`,
          `"Mera babu shona ${this.girlName}, galti ho gayi mujhse... please ek pyari si smile de do meri jaan! ${this.boyName} loves you forever! 🥺❤️🍫"`
        );
      }

      // Draw Mending Heart
      ctx.save();
      ctx.translate(cX, cY);
      ctx.shadowColor = healedProgress > 0.8 ? '#2ed573' : '#ff4757';
      ctx.shadowBlur = 20;

      // Heart halves
      const spread = (1 - healedProgress) * 18;

      // Left Half
      ctx.fillStyle = '#ff2a70';
      ctx.save();
      ctx.translate(-spread, 0);
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.bezierCurveTo(-45, -30, -75, 20, 0, 75);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Right Half
      ctx.save();
      ctx.translate(spread, 0);
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.bezierCurveTo(45, -30, 75, 20, 0, 75);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Golden Stitches of Love
      if (healedProgress > 0.3) {
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10, 20); ctx.lineTo(10, 26);
        ctx.moveTo(10, 34); ctx.lineTo(-10, 40);
        ctx.moveTo(-8, 50); ctx.lineTo(8, 56);
        ctx.stroke();
      }

      // Blooming Roses around heart when healed
      if (healedProgress > 0.7) {
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌹', -60, 60);
        ctx.fillText('🌹', 60, 60);
        ctx.fillText('🍫', 0, 95);
      }
      ctx.restore();

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 4. 💍 ROYAL DIAMOND RING BOX REVEAL
  startRingReveal() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rX = W / 2;
    const rY = H / 2 - 20;
    let openAngle = 0;

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(12, 2, 8, 0.3)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;
      const ctx = this.ctx;

      if (this.animTime > 30) {
        openAngle = Math.min(Math.PI * 0.45, openAngle + 0.03);
      }

      if (this.animTime === 45) {
        if (window.soundFX) window.soundFX.victoryFanfare?.();
        this.showBanner(
          `💍 Will You Marry Me &amp; Be My Queen Forever, ${this.girlName}?`,
          `"Holding your hand for the rest of my days... A lifetime of love, laughter &amp; loyalty! 🏰👑❤️"`
        );
      }

      // Draw Velvet Ring Box
      ctx.save();
      ctx.translate(rX, rY + 40);

      // Box Base (Crimson Velvet)
      ctx.fillStyle = '#6e0a31';
      ctx.fillRect(-50, 0, 100, 50);

      // Inner Cushion
      ctx.fillStyle = '#1e050f';
      ctx.fillRect(-44, 4, 88, 20);

      // Shining Diamond Ring
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 25;
      ctx.fillText('💎', 0, 10);
      ctx.shadowBlur = 0;

      // Box Lid (Rotating open)
      ctx.save();
      ctx.translate(0, 0);
      ctx.rotate(-openAngle);
      ctx.fillStyle = '#8b0f3e';
      ctx.fillRect(-52, -35, 104, 35);
      ctx.restore();

      // Prismatic Star Rays from Diamond
      if (openAngle > 1) {
        for (let i = 0; i < 4; i++) {
          const a = this.animTime * 0.05 + (i * Math.PI / 2);
          this.particles.push({
            x: rX + Math.cos(a) * 20,
            y: rY + 40 + Math.sin(a) * 20,
            vx: Math.cos(a) * 3,
            vy: Math.sin(a) * 3,
            color: ['#00f2fe', '#4facfe', '#ffd700', '#ffffff'][i],
            size: 3 + Math.random() * 4,
            alpha: 1
          });
        }
      }
      ctx.restore();

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 5. 🎆 MIDNIGHT FIREWORKS & STAR CANNON GALA
  startMidnightFireworks() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🎆 Diwali Sky Fireworks & Star Cannon for Queen ${this.girlName}! 🚀`,
      `"The Star Cannon lights up the entire universe and the moon with Diwali firecrackers for Queen ${this.girlName}! 💖🌌"`
    );

    // Celestial Moon Coordinates
    const moonX = W * 0.82;
    const moonY = H * 0.22;
    const moonR = Math.max(38, Math.min(W, H) * 0.10);

    // Star Cannon Base Coordinates (Bottom Left)
    const cannonX = Math.max(90, W * 0.16);
    const cannonY = H - 32;
    let cannonAngle = -Math.PI * 0.35;
    let targetAngle = cannonAngle;
    let barrelRecoil = 0;

    // Active rockets & spark effects
    const rockets = [];

    // Cannon Firing Handler
    this.fireCannonAt = (tx, ty) => {
      const dx = tx - cannonX;
      const dy = ty - cannonY;
      targetAngle = Math.atan2(dy, dx);
      cannonAngle = targetAngle;
      barrelRecoil = 20;

      if (window.soundFX) window.soundFX.pop?.();

      const speed = 19;
      rockets.push({
        x: cannonX + Math.cos(cannonAngle) * 65,
        y: cannonY + Math.sin(cannonAngle) * 65,
        vx: Math.cos(cannonAngle) * speed,
        vy: Math.sin(cannonAngle) * speed,
        targetX: tx,
        targetY: ty,
        color: ['#ffd700', '#ff2a70', '#00f2fe', '#2ed573', '#ff793f', '#ffffff'][Math.floor(Math.random() * 6)]
      });

      // Muzzle spark flash
      const mX = cannonX + Math.cos(cannonAngle) * 65;
      const mY = cannonY + Math.sin(cannonAngle) * 65;
      for (let i = 0; i < 15; i++) {
        const a = cannonAngle + (Math.random() - 0.5) * 0.9;
        const sp = 4 + Math.random() * 8;
        this.particles.push({
          x: mX,
          y: mY,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          color: '#ffd700',
          size: 2 + Math.random() * 3,
          alpha: 1
        });
      }
    };

    const loop = () => {
      if (!this.isRendering) return;
      this.animTime++;

      // Deep Midnight Cosmic Nebula Background
      this.ctx.fillStyle = 'rgba(5, 2, 14, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      const ctx = this.ctx;

      // 1. Draw The Glowing Celestial Moon (Universe)
      ctx.save();
      // Outer ethereal corona
      ctx.shadowColor = '#fffdf0';
      ctx.shadowBlur = 35;
      ctx.fillStyle = '#fffdf0';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Crescent shading
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(5, 2, 14, 0.92)';
      ctx.beginPath();
      ctx.arc(moonX + moonR * 0.42, moonY - moonR * 0.16, moonR * 0.88, 0, Math.PI * 2);
      ctx.fill();

      // Moon halo stardust
      ctx.font = '14px sans-serif';
      ctx.fillText('✨', moonX - moonR * 0.8, moonY - moonR * 0.7);
      ctx.fillText('⭐', moonX + moonR * 0.6, moonY + moonR * 0.8);
      ctx.restore();

      // 2. Auto-fire cycle every 38 frames
      if (this.animTime % 38 === 0) {
        const targetX = W * 0.25 + Math.random() * (W * 0.55);
        const targetY = H * 0.15 + Math.random() * (H * 0.35);
        this.fireCannonAt(targetX, targetY);
      }

      // 3. Update & Draw Flying Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Smoke/fire trail
        this.particles.push({
          x: r.x + (Math.random() - 0.5) * 4,
          y: r.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 1 + Math.random() * 2,
          color: r.color,
          size: 2.5 + Math.random() * 3,
          alpha: 0.85
        });

        // Draw rocket head
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check if rocket reached destination
        const dist = Math.hypot(r.x - r.targetX, r.y - r.targetY);
        if (dist < 25 || r.y <= r.targetY) {
          // DIWALI PATAKA FIRECRACKER BURST!
          if (window.soundFX) window.soundFX.chime?.(1.4);

          // Flash canvas briefly
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(0, 0, W, H);

          // 70+ Diwali Anar & Chakri spark particles with gravity physics
          for (let k = 0; k < 65; k++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 3.5 + Math.random() * 9.5;
            this.particles.push({
              x: r.x,
              y: r.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 2, // initial upward lift
              color: [r.color, '#ffd700', '#ffffff', '#ff2a70', '#00f2fe'][Math.floor(Math.random() * 5)],
              size: 2 + Math.random() * 4.5,
              alpha: 1
            });
          }

          // Floating sparkling star letter burst
          this.particles.push({
            x: r.x,
            y: r.y - 15,
            vx: 0,
            vy: -0.6,
            emoji: '🌟',
            size: 26,
            alpha: 1
          });

          rockets.splice(i, 1);
        }
      }

      // 4. Draw Mechanical Star Cannon / Firework Blaster Gun
      barrelRecoil = Math.max(0, barrelRecoil - 1.2);
      ctx.save();
      ctx.translate(cannonX, cannonY);

      // Gun Mount Turret (Base)
      ctx.fillStyle = '#222f3e';
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 10, 26, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gun Turret Screws & Details
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(-14, 10, 3, 0, Math.PI * 2);
      ctx.arc(0, 2, 3, 0, Math.PI * 2);
      ctx.arc(14, 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Mechanical Cannon Barrel
      ctx.save();
      ctx.rotate(cannonAngle);

      // Recoil translation
      const rDist = -barrelRecoil;
      ctx.translate(rDist, 0);

      // Main heavy barrel cylinder
      const bGrad = ctx.createLinearGradient(0, -9, 0, 9);
      bGrad.addColorStop(0, '#576574');
      bGrad.addColorStop(0.5, '#c8d6e5');
      bGrad.addColorStop(1, '#222f3e');
      ctx.fillStyle = bGrad;
      ctx.fillRect(0, -9, 65, 18);

      // Golden muzzle ring at barrel tip
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(60, -11, 8, 22);

      // Glowing Plasma Energy Rings along the barrel
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(18, -10); ctx.lineTo(18, 10);
      ctx.moveTo(35, -10); ctx.lineTo(35, 10);
      ctx.moveTo(50, -10); ctx.lineTo(50, 10);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Aiming Laser Beam (Guide line into sky)
      ctx.strokeStyle = 'rgba(255, 42, 112, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(68, 0);
      ctx.lineTo(260, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore(); // end barrel rotation
      ctx.restore(); // end cannon base

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 6. 🌸 SAKURA BLOSSOM WATERFALL
  startSakuraWaterfall() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🌸 Sakura Love Rain for Queen ${this.girlName} 💖`,
      `"A pure, sweet, and peaceful love that blossoms like spring cherry petals! 🌸✨"`
    );

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(12, 4, 10, 0.25)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      if (this.particles.length < 80) {
        this.particles.push({
          x: Math.random() * W,
          y: -20,
          vx: 1 + Math.sin(this.animTime * 0.05) * 1.5,
          vy: 2 + Math.random() * 2.5,
          emoji: '🌸',
          size: 16 + Math.random() * 14,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 7. 🍫 SWEET CHOCOLATE FONDUE
  startChocolateFondue() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🍫 143 Sweet Chocolate Celebration for ${this.girlName}! 🍓`,
      `"143 Amount Pay Kardo, Chocolate Kharid Ke Tumko Dunga babu! 💋🥰"`
    );

    const emojis = ['🍫', '🍓', '🍰', '🧁', '💖', '🍬'];
    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(15, 6, 3, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      if (this.particles.length < 60) {
        this.particles.push({
          x: Math.random() * W,
          y: -30,
          vx: (Math.random() - 0.5) * 2,
          vy: 3 + Math.random() * 3,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: 20 + Math.random() * 16,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 8. 🏰 FAIRYTALE CASTLE & WAND
  startCinderellaCastle() {
    this.showBanner(
      `🏰 Fairytale Royal Castle for Princess ${this.girlName} 👑`,
      `"Once upon a time, my heart found its royal queen... and they lived happily ever after! ✨🏰"`
    );
    this.startMidnightFireworks();
  }

  // 9. 🥂 CHAMPAGNE TOAST
  startChampagneToast() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🥂 Happy Anniversary to Us, ${this.girlName} &amp; ${this.boyName}! 💍`,
      `"To every shared breath, every late-night conversation, and a lifetime more to come! 🍾✨"`
    );

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(10, 4, 8, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      // Effervescent bubbles floating UP
      if (this.particles.length < 80) {
        this.particles.push({
          x: Math.random() * W,
          y: H + 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(2 + Math.random() * 3.5),
          color: '#f1c40f',
          size: 3 + Math.random() * 6,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 10. 🦋 BUTTERFLY GARDEN
  startButterflyGarden() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🦋 Enchanted Glowing Butterfly Garden for ${this.girlName} 🌸`,
      `"Every flutter brings sweet butterflies to my heart whenever I think of you babu! 💖"`
    );

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(6, 12, 10, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      if (this.particles.length < 35) {
        this.particles.push({
          x: Math.random() * W,
          y: H * 0.2 + Math.random() * H * 0.6,
          vx: 1 + Math.sin(this.animTime * 0.1) * 3,
          vy: Math.cos(this.animTime * 0.08) * 2,
          emoji: '🦋',
          size: 22 + Math.random() * 14,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 11. 📜 VINTAGE SCROLL
  startVintageScroll() {
    this.showBanner(
      `📜 A Timeless Royal Love Letter to Queen ${this.girlName} 💌`,
      `"Written with all my heart in golden ink: I will love you till the end of time! 🌹"`
    );
    this.startSakuraWaterfall();
  }

  // 12. 🌌 COSMIC STARS
  startCosmicStars() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🌌 Cosmic Constellation for ${this.girlName} &amp; ${this.boyName} ✨`,
      `"I love you past the moon, beyond the galaxies, and across all the stars in the universe! 🚀💖"`
    );

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(3, 1, 10, 0.25)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      if (this.particles.length < 90) {
        this.particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          color: ['#00f2fe', '#be2edd', '#ffffff', '#ffd700'][Math.floor(Math.random() * 4)],
          size: 2 + Math.random() * 4,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 13. 🌊 ROMANTIC CRYSTAL WATERFALL / WATER WALL CASCADE
  startWaterfallCascade() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🌊 Crystal Water Wall Cascade for Queen ${this.girlName}! 💧`,
      `"Water falls pure, endless and glistening... my love flows for you forever like an infinite waterfall! 💎💙"`
    );

    // Stream lines falling down (water curtains)
    const streamCount = Math.floor(W / 18);
    const streams = [];
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: i * 18 + (Math.random() - 0.5) * 8,
        y: Math.random() * H,
        len: 40 + Math.random() * 90,
        spd: 12 + Math.random() * 16,
        thick: 1.5 + Math.random() * 2.5,
        color: ['rgba(0, 242, 254, 0.75)', 'rgba(79, 172, 254, 0.8)', 'rgba(255, 255, 255, 0.85)', 'rgba(56, 239, 125, 0.6)'][Math.floor(Math.random() * 4)]
      });
    }

    const ripples = [];
    const poolLevel = H - 90;

    const loop = () => {
      if (!this.isRendering) return;
      this.animTime++;

      // Gradient aquatic lake background
      this.ctx.fillStyle = 'rgba(2, 10, 22, 0.28)';
      this.ctx.fillRect(0, 0, W, H);

      const ctx = this.ctx;

      // 1. Draw glowing pool surface at bottom
      const grad = ctx.createLinearGradient(0, poolLevel - 20, 0, H);
      grad.addColorStop(0, 'rgba(0, 210, 211, 0.2)');
      grad.addColorStop(0.5, 'rgba(10, 61, 98, 0.55)');
      grad.addColorStop(1, 'rgba(4, 30, 51, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, poolLevel, W, H - poolLevel);

      // 2. Animate and draw falling water streams
      streams.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.thick;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + (Math.sin(s.y * 0.02) * 2), s.y + s.len);
        ctx.stroke();

        s.y += s.spd;

        // When stream hits the water pool
        if (s.y + s.len >= poolLevel) {
          s.y = -s.len;
          s.x = Math.random() * W;

          // Splash droplets bouncing upward
          for (let k = 0; k < 3; k++) {
            this.particles.push({
              x: s.x,
              y: poolLevel,
              vx: (Math.random() - 0.5) * 6,
              vy: -(3 + Math.random() * 7),
              color: '#7efff5',
              size: 2 + Math.random() * 3,
              alpha: 0.95
            });
          }

          // Water ripple
          if (Math.random() > 0.4) {
            ripples.push({
              x: s.x,
              y: poolLevel + Math.random() * 35,
              r: 4,
              maxR: 35 + Math.random() * 35,
              alpha: 0.7
            });
          }
        }
      });

      // 3. Draw water ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 1.4;
        rp.alpha -= 0.015;

        ctx.save();
        ctx.strokeStyle = `rgba(126, 255, 245, ${Math.max(0, rp.alpha)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (rp.alpha <= 0) ripples.splice(i, 1);
      }

      // 4. Floating aquatic hearts & jewels
      if (this.animTime % 14 === 0) {
        this.particles.push({
          x: W * 0.15 + Math.random() * (W * 0.7),
          y: poolLevel + Math.random() * 40,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(1.5 + Math.random() * 2),
          emoji: ['💙', '💧', '💎', '🌊', '✨', '🐬'][Math.floor(Math.random() * 6)],
          size: 18 + Math.random() * 14,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 14. 🏮 FLOATING LANTERN RIVER
  startGoldenLanternRiver() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🏮 Floating Lantern River for Queen ${this.girlName} ✨`,
      `"Every glowing lantern on the water carries my eternal wish of love and happiness for you babu! 💖🌌"`
    );

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(5, 5, 18, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      const ctx = this.ctx;
      const riverY = H * 0.65;

      // River surface glow
      const rGrad = ctx.createLinearGradient(0, riverY, 0, H);
      rGrad.addColorStop(0, 'rgba(243, 156, 18, 0.18)');
      rGrad.addColorStop(1, 'rgba(10, 15, 35, 0.7)');
      ctx.fillStyle = rGrad;
      ctx.fillRect(0, riverY, W, H - riverY);

      // Spawn drifting lanterns
      if (this.particles.length < 32 && this.animTime % 18 === 0) {
        this.particles.push({
          x: -40,
          y: riverY + (Math.random() - 0.3) * (H - riverY - 40),
          vx: 1.2 + Math.random() * 1.8,
          vy: Math.sin(this.animTime * 0.05) * 0.4,
          emoji: '🏮',
          size: 26 + Math.random() * 16,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 15. 🌹 VELVET ROSE PETAL RAIN
  startRoseRainStorm() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🌹 Velvet Rose Petal Waterfall for Queen ${this.girlName}! 💖`,
      `"A shower of a million fresh red velvet rose petals for the most gorgeous girl in the universe! 👑🌹"`
    );

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(18, 3, 10, 0.26)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      if (this.particles.length < 90) {
        this.particles.push({
          x: Math.random() * (W + 100) - 50,
          y: -30,
          vx: -1.2 + Math.sin(this.animTime * 0.04) * 2.5,
          vy: 2.8 + Math.random() * 3.5,
          emoji: ['🌹', '🥀', '🌸', '💐', '❤️'][Math.floor(Math.random() * 5)],
          size: 18 + Math.random() * 16,
          alpha: 1
        });
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 16. 👑 ROYAL QUEEN CORONATION
  startRoyalCoronation() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cX = W / 2;
    const cY = H / 2 - 30;
    let crownY = -80;
    let landed = false;

    const loop = () => {
      if (!this.isRendering) return;
      this.ctx.fillStyle = 'rgba(15, 2, 10, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      const ctx = this.ctx;

      if (!landed) {
        crownY += 3.5;
        if (crownY >= cY) {
          crownY = cY;
          landed = true;
          if (window.soundFX) window.soundFX.victoryFanfare?.();
          this.showBanner(
            `👑 All Hail Queen ${this.girlName}! Long Live The Queen! 🏰`,
            `"Crowned as the forever sovereign ruler of ${this.boyName}'s heart, life, and soul! 💍✨"`
          );
          for (let i = 0; i < 60; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = 3 + Math.random() * 7;
            this.particles.push({
              x: cX,
              y: cY,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              color: ['#f1c40f', '#ffd700', '#ffffff', '#e74c3c'][Math.floor(Math.random() * 4)],
              size: 3 + Math.random() * 5,
              alpha: 1
            });
          }
        }
      }

      // Draw Sparkling Crown
      ctx.save();
      ctx.translate(cX, crownY);
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = landed ? 35 : 15;
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👑', 0, 0);

      if (landed) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        ctx.fillText(`QUEEN ${this.girlName.toUpperCase()}`, 0, 55);
      }
      ctx.restore();

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 17. 🧪 LOVE CHEMISTRY LABORATORY (2 CHEMICALS MIX & GIANT HEART REACTION)
  startMagicPotionBubbles() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.showBanner(
      `🧪 Mixing Secret Love Chemistry for Queen ${this.girlName}! 💖`,
      `"Formula ${this.boyName} & Formula ${this.girlName} are pouring together into the reaction beaker! ⚗️✨"`
    );

    const cX = W / 2;
    const cY = H * 0.62;

    // Flask Positions & Animation States
    let tiltA = 0;
    let tiltB = 0;
    let flaskAX = cX - 220;
    let flaskAY = cY - 140;
    let flaskBX = cX + 220;
    let flaskBY = cY - 140;
    let levelA = 0.85;
    let levelB = 0.85;
    let centerLevel = 0.05;
    let reactionClimax = false;
    let heartScale = 0;
    let shockwaves = [];
    let autoAdvanceFired = false;

    // Helper: Draw conical glass laboratory flask
    const drawLabFlask = (ctx, x, y, width, height, tilt, liquidColor, liquidLevel, label) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);

      const halfW = width / 2;
      const neckW = width * 0.28;
      const neckH = height * 0.35;

      // 1. Draw Liquid inside
      if (liquidLevel > 0.02) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-neckW / 2, -height / 2 + 5);
        ctx.lineTo(neckW / 2, -height / 2 + 5);
        ctx.lineTo(neckW / 2, -height / 2 + neckH);
        ctx.lineTo(halfW - 5, height / 2 - 5);
        ctx.lineTo(-halfW + 5, height / 2 - 5);
        ctx.lineTo(-neckW / 2, -height / 2 + neckH);
        ctx.closePath();
        ctx.clip();

        const fillY = height / 2 - (height * liquidLevel);
        ctx.fillStyle = liquidColor;
        ctx.shadowColor = liquidColor;
        ctx.shadowBlur = 18;
        ctx.fillRect(-halfW - 10, fillY, width + 20, height);
        ctx.restore();
      }

      // 2. Draw Glass Flask Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Lip
      ctx.ellipse(0, -height / 2, neckW / 2 + 2, 4, 0, 0, Math.PI * 2);
      // Neck & Cone
      ctx.moveTo(-neckW / 2, -height / 2);
      ctx.lineTo(-neckW / 2, -height / 2 + neckH);
      ctx.lineTo(-halfW, height / 2);
      ctx.lineTo(halfW, height / 2);
      ctx.lineTo(neckW / 2, -height / 2 + neckH);
      ctx.lineTo(neckW / 2, -height / 2);
      ctx.stroke();

      // Glass Highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.7, height / 2 - 6);
      ctx.lineTo(-neckW * 0.6, -height / 2 + neckH + 6);
      ctx.stroke();

      // Label
      if (label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, 0, height / 2 - 12);
      }
      ctx.restore();
    };

    // Helper: Draw Center Reaction Beaker
    const drawCenterBeaker = (ctx, x, y, width, height, liquidLevel) => {
      ctx.save();
      ctx.translate(x, y);

      const halfW = width / 2;

      // 1. Draw Liquid inside
      if (liquidLevel > 0.02) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(-halfW + 4, height / 2 - (height * liquidLevel), width - 8, height * liquidLevel);
        ctx.clip();

        // Swirling Purple/Gold Chemical Liquid Gradient
        const grad = ctx.createLinearGradient(-halfW, 0, halfW, height / 2);
        grad.addColorStop(0, '#e056fd');
        grad.addColorStop(0.5, '#ff2a70');
        grad.addColorStop(1, '#00f2fe');
        ctx.fillStyle = grad;
        ctx.shadowColor = '#e056fd';
        ctx.shadowBlur = 25;
        ctx.fillRect(-halfW - 5, -height / 2, width + 10, height + 10);
        ctx.restore();
      }

      // 2. Beaker Glass Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-halfW, -height / 2);
      ctx.lineTo(-halfW, height / 2 - 12);
      ctx.quadraticCurveTo(-halfW, height / 2, -halfW + 12, height / 2);
      ctx.lineTo(halfW - 12, height / 2);
      ctx.quadraticCurveTo(halfW, height / 2, halfW, height / 2 - 12);
      ctx.lineTo(halfW, -height / 2);
      ctx.stroke();

      // Spout lip
      ctx.beginPath();
      ctx.moveTo(-halfW - 5, -height / 2);
      ctx.lineTo(-halfW, -height / 2);
      ctx.moveTo(halfW, -height / 2);
      ctx.lineTo(halfW + 5, -height / 2);
      ctx.stroke();

      // Graduation marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 1; i <= 4; i++) {
        const markY = height / 2 - (i * (height / 5));
        ctx.beginPath();
        ctx.moveTo(halfW - 15, markY);
        ctx.lineTo(halfW - 4, markY);
        ctx.stroke();
      }

      // Stand Base
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(-halfW - 15, height / 2, width + 30, 10);
      ctx.restore();
    };

    // Click interaction shortcut to fast-forward mixing reaction
    this.triggerPotionReaction = () => {
      if (this.animTime < 75) {
        this.animTime = 74;
      } else {
        for (let i = 0; i < 40; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 4 + Math.random() * 9;
          this.particles.push({
            x: cX,
            y: cY - 100,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            color: ['#ff2a70', '#ffd700', '#00f2fe', '#ffffff', '#e056fd'][Math.floor(Math.random() * 5)],
            size: 3 + Math.random() * 5,
            alpha: 1,
            gravity: 0.1
          });
        }
      }
    };

    const loop = () => {
      if (!this.isRendering) return;
      this.animTime++;

      // Lab Darkness Background
      this.ctx.fillStyle = 'rgba(6, 4, 16, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      const ctx = this.ctx;

      // PHASE 1: Slide Flasks In (Frames 0 to 25)
      if (this.animTime < 25) {
        flaskAX += ((cX - 130) - flaskAX) * 0.18;
        flaskBX += ((cX + 130) - flaskBX) * 0.18;
      }

      // PHASE 2: Tilt & Pour Chemicals (Frames 25 to 75)
      if (this.animTime >= 25 && this.animTime < 75) {
        tiltA = Math.min(Math.PI * 0.30, tiltA + 0.035);
        tiltB = Math.max(-Math.PI * 0.30, tiltB - 0.035);
        levelA = Math.max(0.12, levelA - 0.015);
        levelB = Math.max(0.12, levelB - 0.015);
        centerLevel = Math.min(0.78, centerLevel + 0.015);

        // Sound effect
        if (this.animTime % 15 === 0 && window.soundFX) {
          window.soundFX.chime?.(1.2 + (this.animTime * 0.005));
        }

        // Draw pouring chemical liquid streams
        const spoutAX = flaskAX + Math.cos(tiltA) * 18 + Math.sin(tiltA) * 25;
        const spoutAY = flaskAY - Math.sin(tiltA) * 18 - Math.cos(tiltA) * 25;
        const spoutBX = flaskBX - Math.cos(-tiltB) * 18 - Math.sin(-tiltB) * 25;
        const spoutBY = flaskBY + Math.sin(-tiltB) * 18 - Math.cos(-tiltB) * 25;

        // Pink chemical stream from Flask A
        ctx.save();
        ctx.strokeStyle = '#ff2a70';
        ctx.shadowColor = '#ff2a70';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(spoutAX, spoutAY);
        ctx.quadraticCurveTo(cX - 35, cY - 80, cX - 15, cY - 20);
        ctx.stroke();
        ctx.restore();

        // Cyan chemical stream from Flask B
        ctx.save();
        ctx.strokeStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(spoutBX, spoutBY);
        ctx.quadraticCurveTo(cX + 35, cY - 80, cX + 15, cY - 20);
        ctx.stroke();
        ctx.restore();

        // Bubbling reaction foam particles in center beaker
        for (let i = 0; i < 4; i++) {
          this.particles.push({
            x: cX + (Math.random() - 0.5) * 50,
            y: cY - 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -(2.5 + Math.random() * 4.5),
            color: ['#ff2a70', '#00f2fe', '#e056fd', '#ffd700'][Math.floor(Math.random() * 4)],
            size: 2.5 + Math.random() * 4.5,
            alpha: 1,
            gravity: -0.06 // float up
          });
        }
      }

      // PHASE 3: CHEMICAL REACTION FLASH & GIANT HEART EXPLOSION (Frame 75+)
      if (this.animTime >= 75 && !reactionClimax) {
        reactionClimax = true;
        if (window.soundFX) window.soundFX.victoryFanfare?.();

        // Flash canvas
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(0, 0, W, H);

        this.showBanner(
          `🧪 100% PURE LOVE CHEMISTRY: ${this.girlName} ♥ ${this.boyName}! 💖`,
          `"The 2 secret formulas have mixed into an unstoppable love reaction! Proceeding to Step 1: Car Mission! 🚀"`
        );

        // Spawn giant burst of iridescent reaction bubbles & sparkles
        for (let i = 0; i < 80; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 4 + Math.random() * 10;
          this.particles.push({
            x: cX,
            y: cY - 60,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 1.5,
            color: ['#ff2a70', '#00f2fe', '#ffd700', '#e056fd', '#ffffff'][Math.floor(Math.random() * 5)],
            size: 3 + Math.random() * 5,
            alpha: 1,
            gravity: 0.12
          });
        }

        // Add 3 shockwave rings
        shockwaves.push({ r: 10, maxR: Math.min(W, H) * 0.7, alpha: 1 });
      }

      // Center Reaction Beaker
      drawCenterBeaker(ctx, cX, cY - 10, 110, 130, centerLevel);

      // Side Flasks A and B
      drawLabFlask(ctx, flaskAX, flaskAY, 75, 95, tiltA, '#ff2a70', levelA, `Formula ${this.boyName}`);
      drawLabFlask(ctx, flaskBX, flaskBY, 75, 95, tiltB, '#00f2fe', levelB, `Formula ${this.girlName}`);

      // Shockwave expansion
      shockwaves.forEach((sw, idx) => {
        sw.r += 6;
        sw.alpha -= 0.02;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 42, 112, ${Math.max(0, sw.alpha)})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cX, cY - 60, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        if (sw.alpha <= 0) shockwaves.splice(idx, 1);
      });

      // GIANT 3D PULSATING LOVE HEART EMERGING ("BADA SA HEART AAYE KHUL KE")
      if (reactionClimax) {
        heartScale = Math.min(1.45, heartScale + 0.04);
        const beat = Math.sin((this.animTime - 110) * 0.16);
        const currentScale = heartScale + (beat > 0.4 ? (beat - 0.4) * 0.25 : 0);

        ctx.save();
        ctx.translate(cX, cY - 100);
        ctx.scale(currentScale, currentScale);

        // Radiant Outer Glow
        ctx.shadowColor = '#ff2a70';
        ctx.shadowBlur = 35;

        // 3D Heart Gradient
        const hGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 100);
        hGrad.addColorStop(0, '#ff9ec0');
        hGrad.addColorStop(0.4, '#ff2a70');
        hGrad.addColorStop(1, '#8b0f3e');
        ctx.fillStyle = hGrad;

        // Giant Heart Path
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.bezierCurveTo(-65, -45, -110, 30, 0, 110);
        ctx.bezierCurveTo(110, 30, 65, -45, 0, 20);
        ctx.fill();

        // Inner Golden Chemistry Typography
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 12.5px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ 100% PURE CHEMISTRY ✨', 0, 32);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.fillText(`${this.girlName} ♥ ${this.boyName}`, 0, 54);

        ctx.fillStyle = '#ffd6e7';
        ctx.font = '11px -apple-system, sans-serif';
        ctx.fillText('Formula of Eternal Love', 0, 72);
        ctx.restore();

        // Spawning floating iridescent chemical bubbles with hearts
        if (this.animTime % 12 === 0) {
          this.particles.push({
            x: cX + (Math.random() - 0.5) * 120,
            y: cY - 100 + (Math.random() - 0.5) * 80,
            vx: (Math.random() - 0.5) * 2,
            vy: -(1.5 + Math.random() * 2.5),
            emoji: ['💖', '🫧', '🧪', '✨', '💍', '🥰'][Math.floor(Math.random() * 6)],
            size: 22 + Math.random() * 16,
            alpha: 1
          });
        }
      }

      // PHASE 4: AUTO ADVANCE TO STEP 1 (CAR MISSION & PUZZLE) ("OR AAGE KA STEP BADHE")
      if (reactionClimax && this.animTime > 220 && !autoAdvanceFired && this.isDemo) {
        autoAdvanceFired = true;
        // Prompt user and smoothly advance to Step 1
        const dock = document.getElementById('animBottomDock');
        if (dock) {
          const title = dock.querySelector('.abd-title');
          if (title) title.innerHTML = '🚀 REACTION COMPLETE! STEP 1 (CAR MISSION) UNLOCKED:';
        }
      }

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  // 18. ⚡ NEON CYBERPUNK HEARTBEAT & INTERACTIVE EQUALIZER PIANO
  startNeonCyberPulse() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cX = W / 2;
    const cY = H / 2;
    this.showBanner(
      `⚡ Neon Cyberpunk Heartbeat for Queen ${this.girlName}! 🎧`,
      `"High voltage love running at 1000 megawatts! Party with ${this.boyName} all night long! 🔥💿"`
    );

    // 30 Musical Notes Map for the 30 Equalizer Bars (C3 to D6)
    const PIANO_SCALE = [
      130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, // C3 to B3
      261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, // C4 to B4
      523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66 // C5 to D6
    ];
    const NOTE_LABELS = [
      'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
      'C4', 'C#', 'D4', 'D#', 'E4', 'F4', 'F#', 'G4', 'G#', 'A4', 'A#', 'B4',
      'C5', 'C#', 'D5', 'D#', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6'
    ];

    const barCount = 30;
    const barEnergies = new Float32Array(barCount);
    const barFlashes = new Float32Array(barCount);

    // Interactive banner is mounted globally by this.mountInteractiveExperienceBanner()

    // Play Piano Bar function
    this.playPianoBar = (barIdx, triggerModal = false) => {
      if (barIdx < 0 || barIdx >= barCount) return;
      const freq = PIANO_SCALE[barIdx];
      if (window.soundFX) {
        window.soundFX.playPianoNote?.(freq, 'piano', 0.9);
      }
      barEnergies[barIdx] = 1.0;
      barFlashes[barIdx] = 1.0;

      const barW = this.canvas.width / barCount;
      const barX = barIdx * barW + barW / 2;
      const barH = Math.min(this.canvas.height - 40, (Math.abs(Math.sin((this.animTime * 0.1) + barIdx * 0.4)) * 140 + 50) + 120);
      const barY = this.canvas.height - barH;

      // Spawn musical particles & electric neon lightning
      const noteEmojis = ['🎵', '🎶', '💖', '🎹', '✨', '⚡'];
      for (let k = 0; k < 6; k++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
        const spd = 4 + Math.random() * 7;
        this.particles.push({
          x: barX,
          y: barY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          emoji: noteEmojis[Math.floor(Math.random() * noteEmojis.length)],
          size: 18 + Math.random() * 12,
          alpha: 1,
          gravity: 0.12
        });
      }

      // Shockwave sparks
      for (let k = 0; k < 15; k++) {
        const a = Math.random() * Math.PI * 2;
        const s = 2 + Math.random() * 5;
        this.particles.push({
          x: barX,
          y: barY,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          color: barIdx % 2 === 0 ? '#00f2fe' : '#ff007f',
          size: 3 + Math.random() * 4,
          alpha: 1,
          gravity: 0.08
        });
      }

      if (triggerModal) {
        setTimeout(() => window.lovePiano?.open(), 250);
      }
    };

    let lastHoveredBar = -1;
    let lastHoverTime = 0;
    this.onEqualizerMouseMove = (x, y) => {
      if (y < this.canvas.height - 230) return;
      const barW = this.canvas.width / barCount;
      const barIdx = Math.floor(x / barW);
      const now = Date.now();
      if (barIdx !== lastHoveredBar && now - lastHoverTime > 75) {
        lastHoveredBar = barIdx;
        lastHoverTime = now;
        this.playPianoBar(barIdx, false);
      }
    };

    const loop = () => {
      if (!this.isRendering) return;
      const W = this.canvas.width;
      const H = this.canvas.height;
      this.ctx.fillStyle = 'rgba(5, 5, 14, 0.28)';
      this.ctx.fillRect(0, 0, W, H);
      this.animTime++;

      const ctx = this.ctx;
      const barW = W / barCount;

      // Equalizer bars at bottom
      for (let i = 0; i < barCount; i++) {
        // Base sine wave height + boosted energy from mouse clicks/hover
        let h = Math.abs(Math.sin((this.animTime * 0.1) + i * 0.4)) * 110 + 25;
        if (barEnergies[i] > 0) {
          h += barEnergies[i] * 140;
          barEnergies[i] = Math.max(0, barEnergies[i] - 0.04);
        }

        const isCyan = i % 2 === 0;
        const isFlashed = barFlashes[i] > 0;
        if (isFlashed) barFlashes[i] = Math.max(0, barFlashes[i] - 0.08);

        ctx.fillStyle = isFlashed ? '#ffffff' : (isCyan ? '#00f2fe' : '#ff007f');
        ctx.shadowColor = isFlashed ? '#ffd700' : (isCyan ? '#00f2fe' : '#ff007f');
        ctx.shadowBlur = isFlashed ? 25 : 12;

        const bx = i * barW + 2;
        const by = H - h;
        const bw = barW - 4;
        ctx.fillRect(bx, by, bw, h);

        // Peak cap
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx, by - 4, bw, 3);

        // Note label on bar
        if (bw > 18) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(NOTE_LABELS[i] || '', bx + bw / 2, H - 8);
        }
      }

      // Neon Heart
      const beat = Math.sin(this.animTime * 0.15);
      const sc = 1.1 + (beat > 0.6 ? (beat - 0.6) * 0.5 : 0);
      ctx.save();
      ctx.translate(cX, cY - 45);
      ctx.scale(sc, sc);
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 28;
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💖', 0, 0);
      ctx.restore();

      this.renderParticles();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  handleCanvasClick(x, y) {
    if (this.currentTemplate === 'neon_cyber_pulse') {
      const barCount = 30;
      const barW = this.canvas.width / barCount;
      const barIdx = Math.floor(x / barW);
      if (this.playPianoBar) {
        this.playPianoBar(barIdx, false);
      }
    } else if (this.currentTemplate === 'midnight_fireworks' || this.currentTemplate === 'cosmic_stars') {
      if (this.fireCannonAt) this.fireCannonAt(x, y);
    } else if (this.currentTemplate === 'waterfall_cascade') {
      // Splash water ripples & droplets on click
      if (window.soundFX) window.soundFX.chime?.(1.5);
      for (let i = 0; i < 30; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 3 + Math.random() * 8;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          color: ['#00f2fe', '#7efff5', '#ffffff', '#0abde3'][Math.floor(Math.random() * 4)],
          size: 3 + Math.random() * 4,
          alpha: 1,
          gravity: 0.15
        });
      }
    } else {
      // General celebratory glitter burst on click
      if (window.soundFX) window.soundFX.pop?.();
      for (let i = 0; i < 35; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 3 + Math.random() * 7;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          color: ['#ff2a70', '#ffd700', '#00f2fe', '#ffffff', '#9b59b6'][Math.floor(Math.random() * 5)],
          size: 3 + Math.random() * 5,
          alpha: 1,
          gravity: 0.12
        });
      }
    }
  }

  renderParticles() {
    const ctx = this.ctx;
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.alpha -= p.fadeRate || 0.009;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.emoji) {
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.emoji, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        if (p.glow) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  // Universal Floating Interactive Banner for Love Piano, Games, Puzzle across ALL 18 Templates
  mountInteractiveExperienceBanner(templateKey = 'crossbow_heart', girlName = 'Queen', boyName = 'Yuvi') {
    document.querySelectorAll('.template-interactive-hero-banner, .neon-piano-hero-banner').forEach(el => el.remove());

    const banner = document.createElement('div');
    banner.className = 'template-interactive-hero-banner';
    banner.id = 'templateInteractiveHeroBanner';

    const isNeon = templateKey === 'neon_cyber_pulse';
    const tagText = isNeon 
      ? '🎹 INTERACTIVE EQUALIZER PIANO &amp; CELEBRATION GAMES 🎶'
      : '🎹 ROMANTIC LOVE PIANO &amp; CELEBRATION EXPERIENCES 💖';
    const subText = isNeon
      ? `Click or drag your mouse across equalizer bars to play piano notes, or open full instruments for Queen ${girlName}! Dedicated by ${boyName} ♥`
      : `Play romantic melodies on piano, race 3-mission cars &amp; solve love puzzles for Queen ${girlName}! Dedicated with love by ${boyName} ♥`;

    banner.innerHTML = `
      <div class="tih-tag">${tagText}</div>
      <div class="tih-sub">${subText}</div>
      <div class="tih-actions">
        <button type="button" class="tih-btn tih-piano-btn" id="tihOpenPianoBtn">
          🎹 Play Love Piano &amp; Instruments 🎵
        </button>
        <button type="button" class="tih-btn tih-car-btn" id="tihOpenCarBtn">
          🏎️ Play 3-Mission Cars &amp; ${girlName} &amp; ${boyName} Game 👩‍❤️‍👨
        </button>
        <button type="button" class="tih-btn tih-puzzle-btn" id="tihOpenPuzzleBtn">
          🧩 Love Puzzle
        </button>
        <button type="button" class="tih-btn tih-gifts-btn" id="tihOpenGiftsBtn">
          🎁 Birthday Gifts
        </button>
        <button type="button" class="tih-btn tih-explore-btn" id="tihExploreBtn">
          🌸 Bloom Tree &amp; Site ⬇️
        </button>
      </div>
    `;

    this.overlay?.appendChild(banner);

    banner.querySelector('#tihOpenPianoBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      window.lovePiano?.open('piano');
    });

    banner.querySelector('#tihOpenCarBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
      window.loveGame?.open();
    });

    banner.querySelector('#tihOpenPuzzleBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
      window.lovePuzzle?.open();
    });

    banner.querySelector('#tihOpenGiftsBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
      window.birthdayGifts?.open();
    });

    banner.querySelector('#tihExploreBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
      const journey = document.getElementById('journey') || document.querySelector('.hero');
      journey?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Mount Dynamic Interactive Hero Trigger (Gift Box, Star Cannon, Chemistry, Ring Box...)
  mountHeroTemplateTrigger(templateKey = 'crossbow_heart', girlName = 'Queen', boyName = 'Yuvi') {
    const triggerEl = document.getElementById('heroTemplateTrigger');
    const targetWrap = document.querySelector('.targetWrap');
    const archery = document.getElementById('archery');
    const hint = document.getElementById('hint');

    if (!triggerEl) return;

    if (!templateKey || templateKey === 'crossbow_heart') {
      if (targetWrap) targetWrap.style.display = '';
      if (archery) archery.style.display = '';
      if (hint) hint.style.display = '';
      triggerEl.style.display = 'none';
      triggerEl.innerHTML = '';
      return;
    }

    // Hide default archery bow and target heart for custom templates
    if (targetWrap) targetWrap.style.display = 'none';
    if (archery) archery.style.display = 'none';
    if (hint) hint.style.display = 'none';
    triggerEl.style.display = 'flex';

    let html = '';

    if (templateKey === 'gift_unboxing') {
      html = `
        <div class="htt-card htt-gift-card" id="httInteractiveStage">
          <div class="htt-gift-box-3d" id="httGiftBox">
            <div class="htt-gift-lid" id="httGiftLid">
              <div class="htt-ribbon-bow">🎀</div>
            </div>
            <div class="htt-gift-body">
              <div class="htt-gift-ribbon-v"></div>
              <div class="htt-gift-ribbon-h"></div>
              <div class="htt-gift-tag">For: <strong>${girlName}</strong> ♥</div>
            </div>
            <div class="htt-box-burst" id="httBoxBurst">
              <div class="htt-giant-heart">💖</div>
              <div class="htt-burst-title">SURPRISE UNBOXED!</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-gift" id="httActionBtn">
            🎁 TAP TO UNWRAP SURPRISE FOR ${girlName.toUpperCase()} 🎁
          </button>
          <p class="htt-hint">Click the gift box or button to unwrap &amp; bloom celebration! ✨</p>
        </div>
      `;
    } else if (templateKey === 'midnight_fireworks' || templateKey === 'cosmic_stars') {
      html = `
        <div class="htt-card htt-cannon-card" id="httInteractiveStage">
          <div class="htt-celestial-moon">
            <div class="htt-moon-crescent"></div>
            <span class="htt-moon-sparkles">✨⭐</span>
          </div>
          <div class="htt-cannon-stage">
            <div class="htt-cannon-gun" id="httCannonGun">
              <div class="htt-gun-barrel" id="httGunBarrel">
                <span class="htt-gun-laser"></span>
              </div>
              <div class="htt-gun-turret"></div>
            </div>
            <div class="htt-pataka-rocket" id="httPatakaRocket">🚀</div>
            <div class="htt-firework-burst" id="httFireworkBurst">
              <div class="htt-diwali-heart">🎆💖🎇</div>
              <div class="htt-burst-title">DIWALI CELEBRATION!</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-cannon" id="httActionBtn">
            🚀 TAP CANNON TO FIRE DIWALI PATAKA 🎆
          </button>
          <p class="htt-hint">Launch fireworks into the sky to reveal the love tree! ✨</p>
        </div>
      `;
    } else if (templateKey === 'magic_potion_bubbles') {
      html = `
        <div class="htt-card htt-chem-card" id="httInteractiveStage">
          <div class="htt-chem-lab">
            <div class="htt-flask flask-boy" id="httFlaskBoy">
              <div class="htt-flask-neck"></div>
              <div class="htt-flask-bulb pink-fluid"></div>
              <span class="htt-flask-label">Formula ${boyName}</span>
            </div>
            <div class="htt-chem-beaker" id="httChemBeaker">
              <div class="htt-beaker-liquid" id="httBeakerLiquid"></div>
              <div class="htt-chem-bubbles" id="httChemBubbles"></div>
            </div>
            <div class="htt-flask flask-girl" id="httFlaskGirl">
              <div class="htt-flask-neck"></div>
              <div class="htt-flask-bulb cyan-fluid"></div>
              <span class="htt-flask-label">Formula ${girlName}</span>
            </div>
            <div class="htt-chem-reaction" id="httChemReaction">
              <div class="htt-giant-heart">🧪💖✨</div>
              <div class="htt-burst-title">100% PURE LOVE CHEMISTRY!</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-chem" id="httActionBtn">
            🧪 TAP TO MIX LOVE FORMULAS 💖
          </button>
          <p class="htt-hint">Mix the two secret formulas to unlock Queen ${girlName}'s celebration! ✨</p>
        </div>
      `;
    } else if (templateKey === 'ring_reveal') {
      html = `
        <div class="htt-card htt-ring-card" id="httInteractiveStage">
          <div class="htt-ring-box-3d" id="httRingBox">
            <div class="htt-ring-lid" id="httRingLid">
              <div class="htt-lid-inner"></div>
            </div>
            <div class="htt-ring-base">
              <div class="htt-velvet-cushion">
                <div class="htt-diamond-ring" id="httDiamondRing">
                  <span class="htt-ring-gem">💎</span>
                  <span class="htt-gem-glare">✨</span>
                </div>
              </div>
            </div>
            <div class="htt-ring-burst" id="httRingBurst">
              <div class="htt-giant-heart">💍💖👰</div>
              <div class="htt-burst-title">WILL YOU MARRY ME?</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-ring" id="httActionBtn">
            💍 TAP TO OPEN VELVET RING BOX 💖
          </button>
          <p class="htt-hint">Open the royal ring box to propose &amp; bloom celebration! ✨</p>
        </div>
      `;
    } else if (templateKey === 'apology_healing') {
      html = `
        <div class="htt-card htt-sorry-card" id="httInteractiveStage">
          <div class="htt-sorry-heart-stage" id="httSorryStage">
            <div class="htt-sorry-heart" id="httSorryHeart">
              <span class="htt-heart-face" id="httHeartFace">🥺</span>
              <span class="htt-bandaid bandaid-1" id="httBandaid1">🩹</span>
              <span class="htt-bandaid bandaid-2" id="httBandaid2">🩹</span>
            </div>
            <div class="htt-sorry-burst" id="httSorryBurst">
              <div class="htt-giant-heart">🥰💖💋</div>
              <div class="htt-burst-title">MAAF KAR DIYA MERI JAAN!</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-sorry" id="httActionBtn">
            🥺 TAP TO FORGIVE &amp; SEND WARM HUG 🩹
          </button>
          <p class="htt-hint">Forgive your ${boyName} with warm hugs &amp; kisses to reveal celebration! ✨</p>
        </div>
      `;
    } else if (templateKey === 'sakura_waterfall') {
      html = `
        <div class="htt-card htt-sakura-card" id="httInteractiveStage">
          <div class="htt-sakura-stage">
            <div class="htt-sakura-bud" id="httSakuraBud">🌸</div>
            <div class="htt-sakura-burst" id="httSakuraBurst">
              <div class="htt-giant-heart">🌸💖🌸</div>
              <div class="htt-burst-title">SPRING SAKURA BLOOM!</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-sakura" id="httActionBtn">
            🌸 TAP TO BLOOM SPRING SAKURA 🌸
          </button>
          <p class="htt-hint">Bloom the sakura blossoms to reveal Queen ${girlName}'s celebration! ✨</p>
        </div>
      `;
    } else if (templateKey === 'waterfall_cascade') {
      html = `
        <div class="htt-card htt-waterfall-card" id="httInteractiveStage">
          <div class="htt-waterfall-stage">
            <div class="htt-waterfall-gem" id="httWaterfallGem">💎🌊</div>
            <div class="htt-waterfall-burst" id="httWaterfallBurst">
              <div class="htt-giant-heart">🌊💖💎</div>
              <div class="htt-burst-title">CRYSTAL WATERFALL UNLOCKED!</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-waterfall" id="httActionBtn">
            🌊 TAP TO UNLEASH CRYSTAL WATERFALL 💎
          </button>
          <p class="htt-hint">Release crystal waterfalls to bloom the celebration! ✨</p>
        </div>
      `;
    } else {
      html = `
        <div class="htt-card htt-default-card" id="httInteractiveStage">
          <div class="htt-enchanted-stage">
            <div class="htt-enchanted-gem" id="httEnchantedGem">💖✨</div>
            <div class="htt-enchanted-burst" id="httEnchantedBurst">
              <div class="htt-giant-heart">👑💖✨</div>
              <div class="htt-burst-title">QUEEN ${girlName.toUpperCase()}'S CELEBRATION!</div>
            </div>
          </div>
          <button type="button" class="htt-action-btn htt-btn-enchanted" id="httActionBtn">
            ✨ TAP TO ENTER QUEEN ${girlName.toUpperCase()}'S CELEBRATION 💖
          </button>
          <p class="htt-hint">Tap to unlock and bloom Queen ${girlName}'s celebration! ✨</p>
        </div>
      `;
    }

    triggerEl.innerHTML = html;

    // Bind Interaction Handler
    const stage = document.getElementById('httInteractiveStage');
    const actionBtn = document.getElementById('httActionBtn');

    let triggered = false;
    const triggerAction = () => {
      if (triggered) return;
      triggered = true;

      // Play sound
      if (window.soundFX) {
        window.soundFX.chime?.(1.4);
        window.soundFX.pop?.();
      }

      // Add active animation class to stage
      if (stage) stage.classList.add('is-triggered');

      // Specific animation triggers
      if (templateKey === 'gift_unboxing') {
        const lid = document.getElementById('httGiftLid');
        const burst = document.getElementById('httBoxBurst');
        if (lid) lid.style.transform = 'translateY(-140px) rotate(-35deg) scale(0.7)';
        if (burst) { burst.style.display = 'flex'; burst.style.transform = 'translate(-50%, -50%) scale(1.4)'; burst.style.opacity = '1'; }
      } else if (templateKey === 'midnight_fireworks' || templateKey === 'cosmic_stars') {
        const gun = document.getElementById('httGunBarrel');
        const rocket = document.getElementById('httPatakaRocket');
        const burst = document.getElementById('httFireworkBurst');
        if (gun) gun.style.transform = 'rotate(-55deg) translate(-15px, 0)';
        if (rocket) {
          rocket.style.display = 'block';
          rocket.style.transform = 'translate(180px, -220px) scale(1.2)';
          rocket.style.opacity = '0';
        }
        setTimeout(() => {
          if (window.soundFX) window.soundFX.triumph?.();
          if (burst) { burst.style.display = 'flex'; burst.style.transform = 'translate(-50%, -50%) scale(1.5)'; burst.style.opacity = '1'; }
        }, 320);
      } else if (templateKey === 'magic_potion_bubbles') {
        const fb = document.getElementById('httFlaskBoy');
        const fg = document.getElementById('httFlaskGirl');
        const bq = document.getElementById('httBeakerLiquid');
        const reaction = document.getElementById('httChemReaction');
        if (fb) fb.style.transform = 'translate(45px, -15px) rotate(55deg)';
        if (fg) fg.style.transform = 'translate(-45px, -15px) rotate(-55deg)';
        if (bq) { bq.style.height = '85%'; bq.style.background = 'linear-gradient(135deg, #ff2a70, #00f2fe)'; }
        setTimeout(() => {
          if (reaction) { reaction.style.display = 'flex'; reaction.style.transform = 'translate(-50%, -50%) scale(1.4)'; reaction.style.opacity = '1'; }
        }, 350);
      } else if (templateKey === 'ring_reveal') {
        const lid = document.getElementById('httRingLid');
        const ring = document.getElementById('httDiamondRing');
        const burst = document.getElementById('httRingBurst');
        if (lid) lid.style.transform = 'rotateX(-120deg)';
        if (ring) ring.style.transform = 'translateY(-30px) scale(1.3)';
        setTimeout(() => {
          if (burst) { burst.style.display = 'flex'; burst.style.transform = 'translate(-50%, -50%) scale(1.4)'; burst.style.opacity = '1'; }
        }, 300);
      } else if (templateKey === 'apology_healing') {
        const b1 = document.getElementById('httBandaid1');
        const b2 = document.getElementById('httBandaid2');
        const face = document.getElementById('httHeartFace');
        const burst = document.getElementById('httSorryBurst');
        if (b1) b1.style.transform = 'translate(-60px, -60px) rotate(-45deg) scale(0)';
        if (b2) b2.style.transform = 'translate(60px, -60px) rotate(45deg) scale(0)';
        if (face) face.textContent = '🥰';
        setTimeout(() => {
          if (burst) { burst.style.display = 'flex'; burst.style.transform = 'translate(-50%, -50%) scale(1.4)'; burst.style.opacity = '1'; }
        }, 300);
      } else if (templateKey === 'sakura_waterfall') {
        const bud = document.getElementById('httSakuraBud');
        const burst = document.getElementById('httSakuraBurst');
        if (bud) bud.style.transform = 'scale(1.8) rotate(180deg)';
        setTimeout(() => {
          if (burst) { burst.style.display = 'flex'; burst.style.transform = 'translate(-50%, -50%) scale(1.4)'; burst.style.opacity = '1'; }
        }, 300);
      } else if (templateKey === 'waterfall_cascade') {
        const gem = document.getElementById('httWaterfallGem');
        const burst = document.getElementById('httWaterfallBurst');
        if (gem) gem.style.transform = 'scale(1.5) rotate(45deg)';
        setTimeout(() => {
          if (burst) { burst.style.display = 'flex'; burst.style.transform = 'translate(-50%, -50%) scale(1.4)'; burst.style.opacity = '1'; }
        }, 300);
      }

      // Smoothly advance to Kinfolk headline reveal and Heart Tree!
      setTimeout(() => {
        if (window.triggerCustomTemplateReveal) {
          window.triggerCustomTemplateReveal();
        } else if (window.fireArrow) {
          window.fireArrow();
        }
      }, 1300);
    };

    stage?.addEventListener('click', triggerAction);
    actionBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerAction();
    });
  }
}

// Global Singleton Initialization
let celebrationAnimSingleton = null;
function initCelebrationAnimationEngine() {
  if (!celebrationAnimSingleton) {
    celebrationAnimSingleton = new CelebrationAnimationEngine();
    window.celebrationAnimEngine = celebrationAnimSingleton;
    window.celebrationAnimation = celebrationAnimSingleton;
  }
  return celebrationAnimSingleton;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCelebrationAnimationEngine);
} else {
  initCelebrationAnimationEngine();
}

window.getCelebrationAnimationEngine = initCelebrationAnimationEngine;

