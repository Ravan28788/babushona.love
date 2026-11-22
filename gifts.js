// Misty's Romantic Birthday Gifts Showcase, Multi-Photo Album & Video Reel
const MISTY_PHOTOS = [
  {
    src: './images/misty1.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.23.19.jpeg',
    title: 'Queen Misty ♥',
    caption: 'Casual, effortlessly stylish, and stunning as always! 💙✨'
  },
  {
    src: './images/misty2.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.23.21%20(1).jpeg',
    title: 'Sweet Butterfly Angel ♥',
    caption: 'My cute butterfly queen with that adorable innocent smile 🦋💫'
  },
  {
    src: './images/misty3.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.23.21.jpeg',
    title: 'Timeless Beauty ♥',
    caption: 'Timeless, elegant, and classic beauty in black & white 🖤🌸'
  },
  {
    src: './images/misty4.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.23.22%20(1).jpeg',
    title: 'My Whole Heart ♥',
    caption: 'My sweet goofy drama queen making hearts for me! 🐱💖'
  },
  {
    src: './images/misty5.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.23.22%20(2).jpeg',
    title: 'Cutest Duo Ever ♥',
    caption: 'Cutest girl in the world matched with the cutest cat! 👓🐾'
  },
  {
    src: './images/misty6.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.23.22.jpeg',
    title: 'Million Dollar Smile ♥',
    caption: 'The million-dollar shy smile that makes my heart skip a beat 🌸✨'
  },
  {
    src: './images/misty7.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.24.52%20(1).jpeg',
    title: 'My Dream Girl ♥',
    caption: 'Lost in your thoughts... the prettiest girl in the universe 🥺🌹'
  },
  {
    src: './images/misty8.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.24.52%20(2).jpeg',
    title: 'Peace & Serenity ♥',
    caption: 'Pure innocence, peace, and endless love in one frame 🌙💕'
  },
  {
    src: './images/misty9.jpg',
    fallbackSrc: './Misty%20Photos/WhatsApp%20Image%202026-11-19%20at%2021.24.52.jpeg',
    title: 'Forever & Always Us ♥',
    caption: 'Forever my happiness, my peace, and my favorite person! ✌️🦋💖'
  }
];

class BirthdayGifts {
  constructor() {
    this.section = document.getElementById('giftsModal');
    this.photoImg = document.getElementById('mistyPhotoImg');
    this.photoTitle = document.getElementById('photoTitle');
    this.photoCaption = document.getElementById('photoCaption');
    this.photoCounter = document.getElementById('photoCounter');
    this.photoDots = document.getElementById('photoDots');
    this.photoThumbnails = document.getElementById('photoThumbnails');
    this.prevBtn = document.getElementById('prevPhotoBtn');
    this.nextBtn = document.getElementById('nextPhotoBtn');
    this.photoInput = document.getElementById('photoUploadInput');
    this.changePhotoBtn = document.getElementById('changePhotoBtn');
    this.videoEl = document.getElementById('mistyVideo');

    this.currentIndex = 0;
    this.photos = [...MISTY_PHOTOS];
    this.touchStartX = 0;

    this.initPhotos();
    this.bindEvents();
    this.bindVideoSync();
    this.initPaymentSection();

    if (window.SiteConfig) {
      this.onProfileChange(window.SiteConfig);
    }
  }

  initPhotos() {
    // Check localStorage for custom saved photo
    const customPhoto = localStorage.getItem('misty_custom_photo');
    if (customPhoto) {
      this.photos.unshift({
        src: customPhoto,
        title: 'Special Memory ♥',
        caption: 'A precious moment captured with all my love! 📸✨'
      });
    }

    this.renderDots();
    this.renderThumbnails();
    this.showPhoto(0, false);
  }

  renderDots() {
    if (!this.photoDots) return;
    this.photoDots.innerHTML = '';
    this.photos.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `photo-dot ${i === this.currentIndex ? 'active' : ''}`;
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => this.goToPhoto(i));
      this.photoDots.appendChild(dot);
    });
  }

  renderThumbnails() {
    if (!this.photoThumbnails) return;
    this.photoThumbnails.innerHTML = '';
    this.photos.forEach((item, i) => {
      const thumb = document.createElement('div');
      thumb.className = `photo-thumb ${i === this.currentIndex ? 'active' : ''}`;
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('aria-label', `Thumbnail ${i + 1}`);
      const img = document.createElement('img');
      img.src = item.src;
      img.onerror = () => {
        if (item.fallbackSrc && img.src !== item.fallbackSrc) {
          img.src = item.fallbackSrc;
        }
      };
      const girlName = window.SiteConfig?.recipientName || 'Misty';
      img.alt = `${girlName} thumb ${i + 1}`;
      thumb.appendChild(img);
      thumb.addEventListener('click', () => this.goToPhoto(i));
      this.photoThumbnails.appendChild(thumb);
    });
  }

  showPhoto(index, playSound = true) {
    if (!this.photos.length) return;
    if (index < 0) index = this.photos.length - 1;
    if (index >= this.photos.length) index = 0;
    this.currentIndex = index;

    const data = this.photos[index];

    if (this.photoImg && data) {
      this.photoImg.src = data.src;
      this.photoImg.style.opacity = '1';
      this.photoImg.style.transform = 'scale(1)';
      this.photoImg.onerror = () => {
        if (data.fallbackSrc && this.photoImg.src !== data.fallbackSrc) {
          this.photoImg.src = data.fallbackSrc;
        }
      };
    }

    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    if (this.photoTitle) this.photoTitle.textContent = data.title.replace(/Misty/g, girlName).replace(/Yuvi/g, boyName);
    if (this.photoCaption) this.photoCaption.textContent = `"${data.caption.replace(/Misty/g, girlName).replace(/Yuvi/g, boyName)}"`;
    if (this.photoCounter) this.photoCounter.textContent = `Photo ${index + 1} of ${this.photos.length} 💕`;

    // Update dots
    const dots = this.photoDots?.querySelectorAll('.photo-dot');
    dots?.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });

    // Update thumbnails
    const thumbs = this.photoThumbnails?.querySelectorAll('.photo-thumb');
    thumbs?.forEach((t, i) => {
      t.classList.toggle('active', i === index);
      if (i === index) {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    if (playSound && window.soundFX) {
      window.soundFX.chime(1.1 + (index % 5) * 0.1);
    }
  }

  nextPhoto() {
    this.showPhoto(this.currentIndex + 1);
  }

  prevPhoto() {
    this.showPhoto(this.currentIndex - 1);
  }

  goToPhoto(index) {
    if (index === this.currentIndex) return;
    this.showPhoto(index);
  }

  bindEvents() {
    // Nav arrows
    this.prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevPhoto();
    });

    this.nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextPhoto();
    });

    // Touch swipe support on polaroid image box
    const frame = document.querySelector('.polaroid-img-box');
    if (frame) {
      frame.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });

      frame.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - this.touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) this.nextPhoto();
          else this.prevPhoto();
        }
      }, { passive: true });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.section?.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') this.nextPhoto();
      if (e.key === 'ArrowLeft') this.prevPhoto();
    });

    // Custom photo file input trigger
    if (this.changePhotoBtn && this.photoInput) {
      this.changePhotoBtn.addEventListener('click', () => {
        this.photoInput.click();
      });

      this.photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            try {
              localStorage.setItem('misty_custom_photo', dataUrl);
            } catch (err) {
              console.log('Local storage quota, kept in session memory', err);
            }

            this.photos.unshift({
              src: dataUrl,
              title: 'Special Memory ♥',
              caption: 'A newly added sweetest picture of Queen Misty! 📸✨'
            });

            this.renderDots();
            this.renderThumbnails();
            this.showPhoto(0, true);

            if (window.soundFX) window.soundFX.victoryFanfare();
            alert('Misty\'s photo uploaded beautifully into the album! 📸💖');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Gift cards interactive unbox & full photo lightbox
    const lightboxModal = document.getElementById('giftLightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const closeLightboxBtn = document.getElementById('closeGiftLightboxBtn');

    const GIFT_DETAILS = {
      ps5: {
        img: './images/gift_ps5_gta6.jpg',
        title: 'Sony PlayStation 5 + GTA VI CD Disc 🎮📀',
        desc: 'Ultra high-definition PS5 gaming console bundled with Grand Theft Auto VI (GTA 6) physical CD disc & case! High-speed Vice City missions, open-world cruising with Yuvi, and unlimited late-night gaming dates together! 🎮🚗💥'
      },
      thar: {
        img: './images/gift_thar.jpg',
        title: 'Mahindra Thar 4x4 (Dream Beast) 🚙',
        desc: 'The iconic Red & Black Mahindra Thar 4x4 off-road SUV! Ready to take Queen Misty to scenic mountain road trips, golden sunsets, and romantic long drives under the stars! 🌄❤️'
      },
      dress: {
        img: './images/gift_dress.jpg',
        title: 'Princess Dresses & Cute Outfits 👗✨',
        desc: 'The most gorgeous fairy-tale pastel pink princess gown with glittering crystal sequins! Custom tailored for the sweetest, most beautiful queen in the whole universe! 👑👗🌸'
      },
      yuvi: {
        img: './images/yuvi_misty_theme_bg.jpg',
        title: 'Yuvi (Misty\'s Forever Boyfriend & Soulmate) 👑💍',
        desc: '100% Genuine, Lifetime Warranty, Unlimited Warm Hugs & Kisses, 24/7 Care & Support, Always Loyal, and deeply madly in love with Queen Misty! Reserved exclusively for my babu shona forever and ever! 👩‍❤️‍👨❤️'
      }
    };

    document.querySelectorAll('.real-gift-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const giftKey = card.dataset.gift;
        if (!card.classList.contains('is-unboxed')) {
          card.classList.add('is-unboxed');
          this.spawnCardConfetti(card);
        }

        const data = GIFT_DETAILS[giftKey];
        if (data && lightboxModal && lightboxImg) {
          const rawGirl = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
          const cleanGirl = rawGirl.replace(/^Queen\s+/i, '');
          const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
          const isMisty = (!cleanGirl || cleanGirl.toLowerCase() === 'misty');
          const p = window.SiteConfig?.customPhotos || {};
          const customGifts = window.SiteConfig?.customGifts || [];

          let displayImg = data.img;
          if (giftKey === 'yuvi') {
            const customHug = (customGifts[3] && customGifts[3].photo) || p.liveHug || p.hug || (!isMisty ? (p.mainPortrait || p.portrait) : null);
            if (customHug) displayImg = customHug;
          } else if (giftKey === 'ps5' && customGifts[0]?.photo) {
            displayImg = customGifts[0].photo;
          } else if (giftKey === 'thar' && (customGifts[1]?.photo || p.giftThar)) {
            displayImg = customGifts[1]?.photo || p.giftThar;
          } else if (giftKey === 'dress' && (customGifts[2]?.photo || p.giftDress)) {
            displayImg = customGifts[2]?.photo || p.giftDress;
          }

          lightboxImg.src = displayImg;
          if (lightboxTitle) lightboxTitle.textContent = data.title.replace(/Misty/g, cleanGirl).replace(/Yuvi/g, boyName);
          if (lightboxDesc) lightboxDesc.textContent = data.desc.replace(/Misty/g, cleanGirl).replace(/Yuvi/g, boyName).replace(/Queen\s+Queen/gi, 'Queen');
          
          const liveFx = document.getElementById('lightboxLiveFx');
          const liveBadge = document.getElementById('lightboxLiveBadge');
          const imgWrap = document.getElementById('lightboxImgWrap');
          const lightboxNeon = document.getElementById('lightboxNeonHeader');

          if (giftKey === 'yuvi') {
            if (liveFx) liveFx.style.display = 'block';
            if (liveBadge) liveBadge.style.display = 'inline-flex';
            if (imgWrap) imgWrap.classList.add('live-hug-active');
            if (lightboxNeon) lightboxNeon.style.display = 'flex';
            if (window.soundFX) {
              window.soundFX.chime(1.3);
              setTimeout(() => window.soundFX.kissSound?.(), 250);
            }
          } else {
            if (liveFx) liveFx.style.display = 'none';
            if (liveBadge) liveBadge.style.display = 'none';
            if (imgWrap) imgWrap.classList.remove('live-hug-active');
            if (lightboxNeon) lightboxNeon.style.display = 'none';
            if (window.soundFX) window.soundFX.chime(1.3);
          }

          lightboxModal.classList.add('is-open');
        }
      });
    });

    closeLightboxBtn?.addEventListener('click', () => {
      lightboxModal?.classList.remove('is-open');
    });

    lightboxModal?.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('is-open');
      }
    });
  }

  bindVideoSync() {
    if (!this.videoEl) return;
    const bgAudio = document.getElementById('bgMusic');

    this.videoEl.addEventListener('play', () => {
      if (bgAudio && !bgAudio.paused) {
        bgAudio.dataset.wasPlaying = 'true';
        bgAudio.pause();
      }
    });

    this.videoEl.addEventListener('pause', () => {
      if (bgAudio && bgAudio.dataset.wasPlaying === 'true') {
        bgAudio.play().catch(() => {});
        delete bgAudio.dataset.wasPlaying;
      }
    });

    this.videoEl.addEventListener('ended', () => {
      if (bgAudio && bgAudio.dataset.wasPlaying === 'true') {
        bgAudio.play().catch(() => {});
        delete bgAudio.dataset.wasPlaying;
      }
    });
  }

  ensureElements() {
    if (!this.section) this.section = document.getElementById('giftsModal');
    if (!this.photoImg) this.photoImg = document.getElementById('mistyPhotoImg');
    if (!this.photoTitle) this.photoTitle = document.getElementById('photoTitle');
    if (!this.photoCaption) this.photoCaption = document.getElementById('photoCaption');
    if (!this.photoCounter) this.photoCounter = document.getElementById('photoCounter');
    if (!this.photoDots) this.photoDots = document.getElementById('photoDots');
    if (!this.photoThumbnails) this.photoThumbnails = document.getElementById('photoThumbnails');
    if (!this.prevBtn) this.prevBtn = document.getElementById('prevPhotoBtn');
    if (!this.nextBtn) this.nextBtn = document.getElementById('nextPhotoBtn');
    if (!this.photoInput) this.photoInput = document.getElementById('photoUploadInput');
    if (!this.changePhotoBtn) this.changePhotoBtn = document.getElementById('changePhotoBtn');
    if (!this.videoEl) this.videoEl = document.getElementById('mistyVideo');
  }

  open() {
    this.ensureElements();
    const modal = this.section || document.getElementById('giftsModal');
    if (modal) {
      document.body.classList.add('modal-active');
      modal.classList.add('is-open');
      modal.style.display = 'flex';
      this.section = modal;
    }

    try {
      if (window.SiteConfig) {
        this.onProfileChange(window.SiteConfig);
      }
      this.refreshDynamicGifts();
    } catch (e) {
      console.warn('Gifts refresh warning:', e);
    }

    // Payment Section & Pay Nav Pill visibility check
    const isPayEnabled = (window.SiteConfig?.payment && window.SiteConfig.payment.enabled !== false) && (window.SiteConfig?.paymentEnabled !== false);
    const paySec = document.getElementById('vipPaymentSection');
    const navPay = document.getElementById('navPayBtn');

    if (isPayEnabled) {
      window.journey?.unlock('pay');
      if (paySec) paySec.style.display = '';
      if (navPay) navPay.style.display = 'inline-flex';
    } else {
      if (paySec) paySec.style.display = 'none';
      if (navPay) navPay.style.display = 'none';
    }

    try {
      if (window.soundFX) window.soundFX.victoryFanfare?.();
      this.spawnBigCelebration();
    } catch (e) {
      console.warn('Celebration animation warning:', e);
    }
  }

  refreshDynamicGifts() {
    const rawGirl = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const cleanGirl = rawGirl.replace(/^Queen\s+/i, '');
    const girlName = cleanGirl;
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const occ = window.SiteConfig?.occasion || 'birthday';
    const occWish = occ === 'anniversary' ? 'Happy Anniversary' : (occ === 'love_propose' || occ === 'love' ? 'I Love You' : (occ === 'marriage_propose' ? 'Will You Marry Me?' : (occ === 'sorry_request' ? 'I Am Sorry' : (occ === 'party' ? 'Party Time' : 'Happy Birthday'))));

    // Dynamic couple neon headers on thumbnail, reunion, and lightbox
    document.querySelectorAll('.tnh-boy-name').forEach(el => el.textContent = boyName);
    document.querySelectorAll('.tnh-girl-name').forEach(el => el.textContent = cleanGirl);

    const titleEl = document.querySelector('.gifts-title');
    if (titleEl) {
      if (occ === 'sorry_request') {
        titleEl.textContent = `Gifts & Sweet Apology for Queen ${cleanGirl} 🥺💖`;
      } else if (occ === 'marriage_propose') {
        titleEl.textContent = `Will You Marry Me, Queen ${cleanGirl}? 💍🏰`;
      } else {
        titleEl.textContent = `${occWish}, Queen ${cleanGirl}! 🎁🎉`;
      }
    }

    // Dynamic Gifts Customization if present in SiteConfig
    const customGifts = window.SiteConfig?.customGifts;
    if (Array.isArray(customGifts) && customGifts.length >= 3) {
      const g1 = customGifts[0];
      const g2 = customGifts[1];
      const g3 = customGifts[2];
      const g4 = customGifts[3];

      const c1 = document.getElementById('giftCardPS5');
      if (c1 && g1) {
        const badge = c1.querySelector('.gift-badge');
        if (badge) badge.textContent = g1.badge || 'GIFT #1 🎁';
        const title = c1.querySelector('.gift-item-title');
        if (title) title.textContent = g1.title;
        const desc = c1.querySelector('.gift-item-desc');
        if (desc) desc.textContent = g1.desc;
        const img = c1.querySelector('.gift-thumb-img');
        if (img && g1.photo) img.src = g1.photo;
      }

      const c2 = document.getElementById('giftCardThar');
      if (c2 && g2) {
        const badge = c2.querySelector('.gift-badge');
        if (badge) badge.textContent = g2.badge || 'GIFT #2 🎁';
        const title = c2.querySelector('.gift-item-title');
        if (title) title.textContent = g2.title;
        const desc = c2.querySelector('.gift-item-desc');
        if (desc) desc.textContent = g2.desc;
        const img = c2.querySelector('.gift-thumb-img');
        if (img && g2.photo) img.src = g2.photo;
      }

      const c3 = document.getElementById('giftCardDress');
      if (c3 && g3) {
        const badge = c3.querySelector('.gift-badge');
        if (badge) badge.textContent = g3.badge || 'GIFT #3 🎁';
        const title = c3.querySelector('.gift-item-title');
        if (title) title.textContent = g3.title;
        const desc = c3.querySelector('.gift-item-desc');
        if (desc) desc.textContent = g3.desc;
        const img = c3.querySelector('.gift-thumb-img');
        if (img && g3.photo) img.src = g3.photo;
      }
    }

    const customPhotos = window.SiteConfig?.customPhotos || {};
    const isMisty = (!cleanGirl || cleanGirl.toLowerCase() === 'misty');
    const customCouplePhoto = (customGifts && customGifts[3]?.photo) || customPhotos.liveHug || customPhotos.hug || (!isMisty ? (customPhotos.mainPortrait || customPhotos.portrait) : null);

    const c4 = document.getElementById('giftCardYuvi');
    if (c4) {
      const g4 = (Array.isArray(customGifts) && customGifts[3]) ? customGifts[3] : null;
      const badge = c4.querySelector('.gift-badge');
      if (badge) badge.textContent = g4?.badge || 'LIFETIME GIFT 👑💍';
      const title = c4.querySelector('.gift-item-title');
      const rawTitle = g4?.title || `${boyName} (${cleanGirl}'s Forever Partner) 👑❤️`;
      if (title) title.textContent = rawTitle.replace(/Queen's/gi, `${cleanGirl}'s`).replace(/Her Forever/gi, `${cleanGirl}'s Forever`).replace(/Misty's/gi, `${cleanGirl}'s`);
      const desc = c4.querySelector('.gift-item-desc');
      const rawDesc = g4?.desc || `100% genuine, lifetime warranty, unlimited warm hugs & kisses, 24/7 care & loyalty, exclusively reserved for Queen ${cleanGirl} forever!`;
      if (desc) desc.textContent = rawDesc.replace(/Queen Queen/gi, `Queen ${cleanGirl}`).replace(/for Queen forever/gi, `for Queen ${cleanGirl} forever`).replace(/Misty/gi, cleanGirl);
      const img = c4.querySelector('.gift-thumb-img');
      if (img && customCouplePhoto) {
        img.src = customCouplePhoto;
      }
      const liveWallBtn = c4.querySelector('.launch-live-wallpaper-btn');
      if (liveWallBtn) {
        const pId = window.SiteConfig?.id || (window.SiteConfig?.recipientName || 'queen').toLowerCase().replace(/[^a-z0-9]/g, '');
        liveWallBtn.href = `live-wallpaper.html?p=${encodeURIComponent(pId)}&to=${encodeURIComponent(cleanGirl)}&from=${encodeURIComponent(boyName)}`;
      }
    }

    // Payment Section toggle & message
    const paySec = document.getElementById('vipPaymentSection');
    if (paySec) {
      if (window.SiteConfig?.payment && window.SiteConfig.payment.enabled === false) {
        paySec.style.display = 'none';
      } else {
        paySec.style.display = '';
        if (window.SiteConfig?.payment?.popupText) {
          const cppTitle = document.querySelector('.cpp-big-title');
          if (cppTitle) cppTitle.textContent = `"${window.SiteConfig.payment.popupText}"`;
        }
      }
    }

    const secTitle = document.querySelector('.gallery-sec-title');
    if (secTitle) secTitle.textContent = `${girlName}'s Sweetest Moments & Memories`;

    const photoTitle = document.getElementById('photoTitle');
    if (photoTitle) photoTitle.textContent = `Queen ${girlName} ♥`;

    const videoBadge = document.querySelector('.video-badge-tag');
    if (videoBadge) videoBadge.textContent = `${girlName} In Motion`;
  }

  scrollToPayment(force = false) {
    const isPayEnabled = (window.SiteConfig?.payment && window.SiteConfig.payment.enabled !== false) && (window.SiteConfig?.paymentEnabled !== false);
    const paySec = document.getElementById('vipPaymentSection');
    const navPay = document.getElementById('navPayBtn');

    if (!isPayEnabled && !force) {
      if (paySec) paySec.style.display = 'none';
      if (navPay) navPay.style.display = 'none';
      if (window.journey) {
        window.journey.showToast('ℹ️ Payment is turned OFF for this profile in Admin Settings! 🔒');
      }
      this.open();
      return;
    }
    this.open();
    if (paySec) paySec.style.display = 'block';
    setTimeout(() => {
      const el = document.getElementById('vipPaymentSection');
      const container = document.querySelector('.gifts-container');
      if (container && el) {
        container.scrollTo({ top: el.offsetTop - 30, behavior: 'smooth' });
      } else if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (window.journey) {
        window.journey.showToast('🍫 "143 AMMOUNT PAY KRDO, CHOCLATE KHARID KE TUM KO DUNGA!" 🥰💖');
      }
      if (window.soundFX) window.soundFX.chime?.(1.5);
    }, 300);
  }

  initPaymentSection() {
    const copyBtn = document.getElementById('copyUpiBtn');
    const upiText = document.getElementById('upiText');
    const utrInput = document.getElementById('utrInput');
    const submitUtrBtn = document.getElementById('submitUtrBtn');
    const utrErrorMsg = document.getElementById('utrErrorMsg');
    const utrVerifyBox = document.getElementById('utrVerifyBox');
    const paymentSuccessCard = document.getElementById('paymentSuccessCard');
    const copyInstaBtn = document.getElementById('copyInstaBtn');

    // Tap on Heart Frame / QR triggers sweet chocolate toast
    const qrFrame = document.querySelector('.heart-frame-outer');
    qrFrame?.addEventListener('click', () => {
      if (window.journey) {
        window.journey.showToast('🍫 "143 AMMOUNT PAY KRDO, CHOCLATE KHARID KE TUM KO DUNGA!" 🥰💖');
      }
      if (window.soundFX) window.soundFX.kissSound?.();
    });

    // 1. Copy UPI ID
    copyBtn?.addEventListener('click', () => {
      const id = upiText?.textContent?.trim() || 'baby8389@nyes';
      navigator.clipboard?.writeText(id).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'Copied! 💖';
        copyBtn.style.background = '#27ae60';
        copyBtn.style.color = '#fff';
        if (window.soundFX) window.soundFX.chime(1.4);
        setTimeout(() => {
          copyBtn.textContent = orig;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2200);
      }).catch(() => {
        alert(`UPI ID: ${id}`);
      });
    });

    // Copy Instagram ID
    copyInstaBtn?.addEventListener('click', () => {
      navigator.clipboard?.writeText('tim_aary').then(() => {
        const orig = copyInstaBtn.textContent;
        copyInstaBtn.textContent = 'Copied! 📸';
        copyInstaBtn.style.background = '#27ae60';
        copyInstaBtn.style.color = '#fff';
        if (window.soundFX) window.soundFX.chime(1.4);
        setTimeout(() => {
          copyInstaBtn.textContent = orig;
          copyInstaBtn.style.background = '';
          copyInstaBtn.style.color = '';
        }, 2200);
      }).catch(() => {
        alert('Instagram ID: @tim_aary');
      });
    });

    // 2. Submit & Verify UTR Number
    submitUtrBtn?.addEventListener('click', () => {
      const utrVal = utrInput?.value?.trim();
      if (!utrVal || utrVal.length < 6) {
        if (utrErrorMsg) {
          utrErrorMsg.textContent = 'Kripya valid UPI Reference / UTR Number enter karein! 🥺';
          utrErrorMsg.style.display = 'block';
        }
        if (window.soundFX) window.soundFX.boing();
        utrInput?.focus();
        return;
      }

      if (utrErrorMsg) utrErrorMsg.style.display = 'none';

      // Play victory sound & celebratory fanfare
      if (window.soundFX) {
        window.soundFX.triumph();
        setTimeout(() => window.soundFX.kissSound?.(), 300);
        setTimeout(() => window.soundFX.victoryFanfare?.(), 700);
      }

      // Hide UTR verify form, show Payment Success Card with 143 meaning & Instagram DM
      if (utrVerifyBox) utrVerifyBox.style.display = 'none';
      if (paymentSuccessCard) {
        paymentSuccessCard.style.display = 'block';
      if (window.trackMissionEvent) window.trackMissionEvent('payment', 'paid');
        paymentSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Big celebratory hearts & confetti
      this.spawnBigCelebration();
    });
  }

  close() {
    this.ensureElements();
    const modal = this.section || document.getElementById('giftsModal');
    if (modal) {
      modal.classList.remove('is-open');
    }
    document.body.classList.remove('modal-active');
    if (this.videoEl && !this.videoEl.paused) {
      this.videoEl.pause();
    }
  }

  onProfileChange(cfg) {
    if (!cfg) return;
    const girlName = cfg.recipientName || cfg.name || '';
    const isMisty = (!girlName || girlName.toLowerCase() === 'misty') && (!cfg.id || cfg.id.toLowerCase() === 'misty');
    const name = girlName || 'Queen';
    const boyName = cfg.senderName || cfg.sender || 'Yuvi';

    if (isMisty) {
      this.photos = [...MISTY_PHOTOS];
      const customPhoto = localStorage.getItem('misty_custom_photo');
      if (customPhoto) {
        this.photos.unshift({
          src: customPhoto,
          title: 'Special Memory ♥',
          caption: 'A precious moment captured with all my love! 📸✨'
        });
      }
    } else {
      // Custom profile for other girl (Neha, Puja, Rani, Neelu, etc.)
      const customList = [];
      const p = cfg.customPhotos || {};

      // 1. Dedicated Album & Memories Photos (Highest priority - user explicitly uploaded these 6 photos for the album!)
      if (Array.isArray(cfg.albumPhotos) && cfg.albumPhotos.length > 0) {
        cfg.albumPhotos.forEach((imgUrl, idx) => {
          if (imgUrl && !customList.some(item => item.src === imgUrl)) {
            customList.push({
              src: imgUrl,
              title: `${name}'s Sweetest Memory #${idx + 1} ♥`,
              caption: `Every heartbeat whispers your name, sweetest ${name}! 💖✨`
            });
          }
        });
      }

      // 2. Portrait photo (Main girl portrait)
      const portrait = p.mainPortrait || p.portrait || '';
      if (portrait && !customList.some(item => item.src === portrait)) {
        customList.unshift({
          src: portrait,
          title: `Queen ${name} ♥`,
          caption: `The most gorgeous smile in the whole universe! 👑✨`
        });
      }

      // 3. All 6 Jigsaw Puzzle images
      if (Array.isArray(cfg.puzzleImages) && cfg.puzzleImages.length > 0) {
        cfg.puzzleImages.forEach((imgUrl, idx) => {
          if (imgUrl && !customList.some(item => item.src === imgUrl)) {
            customList.push({
              src: imgUrl,
              title: `${name}'s Beautiful Memory #${customList.length + 1} ♥`,
              caption: `A piece of my heart that belongs only to you, ${name}! 🌸💫`
            });
          }
        });
      }

      // 4. Puzzle photo slot 1
      const puzPhoto = p.puzzlePhoto || p.puzzle || '';
      if (puzPhoto && !customList.some(item => item.src === puzPhoto)) {
        customList.push({
          src: puzPhoto,
          title: `${name}'s Love Puzzle Photo ♥`,
          caption: `Every heartbeat whispers your name, sweetest ${name}! 💖✨`
        });
      }

      // 5. Live Hug Couple photo
      const hugPhoto = p.liveHug || p.hug || '';
      if (hugPhoto && !customList.some(item => item.src === hugPhoto)) {
        customList.push({
          src: hugPhoto,
          title: `${name} & ${boyName} Forever ♥`,
          caption: `Wrapped in your warm embrace... my favorite place in the world! 👩‍❤️‍💋‍👨`
        });
      }

      // 6. Background wallpaper photo
      const bgPhoto = p.bgTheme || p.bg || '';
      if (bgPhoto && !customList.some(item => item.src === bgPhoto)) {
        customList.push({
          src: bgPhoto,
          title: `Our Love Starlight ♥`,
          caption: `A romantic background of eternal love and togetherness! ✨🌙`
        });
      }

      // 7. Fallback aesthetic photos so Misty NEVER appears
      const AESTHETIC_FALLBACKS = [
        {
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          title: `Queen ${name} ♥`,
          caption: `Casual, effortlessly stylish, and stunning as always! 💙✨`
        },
        {
          src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
          title: `Sweet Angel ${name} ♥`,
          caption: `That adorable innocent smile that lights up my entire world! 🦋💫`
        },
        {
          src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
          title: `Timeless Beauty ♥`,
          caption: `Timeless, elegant, and breathtaking in every single way! 🌸✨`
        },
        {
          src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
          title: `My Whole Heart ♥`,
          caption: `The girl who stole my heart and made life feel like magic! 💖🐱`
        },
        {
          src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
          title: `Million Dollar Smile ♥`,
          caption: `The million-dollar smile that makes my heart skip a beat every time! 🌹✨`
        },
        {
          src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
          title: `My Dream Girl ♥`,
          caption: `Lost in your thoughts... the prettiest soul in the universe 🥺🌙`
        }
      ];

      if (customList.length === 0) {
        this.photos = AESTHETIC_FALLBACKS;
      } else {
        // If user uploaded 1 or more photos, cycle through THEM so user's own photos fill the album!
        const userCount = customList.length;
        while (customList.length < 6) {
          const dup = customList[customList.length % userCount];
          customList.push({
            src: dup.src,
            title: `${name}'s Special Memory #${customList.length + 1} ♥`,
            caption: dup.caption
          });
        }
        this.photos = customList;
      }
    }

    this.currentIndex = 0;
    this.renderDots();
    this.renderThumbnails();
    this.showPhoto(0, false);
    this.refreshDynamicGifts();

    // 4. Romantic Video Reel update for this profile
    if (this.videoEl) {
      const reelUrl = cfg.reel?.url || (cfg.customPhotos && (cfg.customPhotos.reelVideo || cfg.customPhotos.reel)) || '';
      const portrait = cfg.customPhotos?.mainPortrait || cfg.customPhotos?.portrait;
      if (portrait) {
        this.videoEl.poster = portrait;
      }
      if (reelUrl) {
        if (this.videoEl.src !== reelUrl && (!isMisty || !reelUrl.includes('misty_video.mp4'))) {
          this.videoEl.src = reelUrl;
          this.videoEl.load();
        }
      } else if (isMisty) {
        this.videoEl.src = './images/misty_video.mp4';
        this.videoEl.load();
      }
    }
    const videoBadge = document.querySelector('.video-badge-tag');
    if (videoBadge) videoBadge.textContent = `${name} In Motion`;
    const reelNote = document.querySelector('.video-caption-box .polaroid-note');
    if (reelNote && cfg.reel?.caption) {
      reelNote.textContent = `"${cfg.reel.caption.replace(/Misty/g, name).replace(/Yuvi/g, boyName)}"`;
    }
  }

  spawnCardConfetti(card) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const items = ['✨', '🎉', '💖', '🎁', '⭐', '🎈'];

    for (let i = 0; i < 20; i++) {
      const el = document.createElement('span');
      el.className = 'floating-heart-burst';
      el.textContent = items[Math.floor(Math.random() * items.length)];
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      document.body.appendChild(el);

      const dx = (Math.random() - 0.5) * 220;
      const dy = (Math.random() - 0.7) * 250;
      if (typeof el.animate === 'function') {
        el.animate([
          { transform: 'translate(0,0) scale(0.6)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(1.4)`, opacity: 0 }
        ], {
          duration: 900 + Math.random() * 400,
          easing: 'ease-out'
        }).onfinish = () => el.remove();
      } else {
        setTimeout(() => el.remove?.(), 1200);
      }
    }
  }

  spawnBigCelebration() {
    const items = ['🎉', '💖', '💍', '✨', '🎂', '🥳', '🌸', '🚗', '🎮', '👗'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('span');
      el.className = 'floating-heart-burst';
      el.textContent = items[Math.floor(Math.random() * items.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 80}%`;
      el.style.fontSize = `${Math.random() * 18 + 22}px`;
      document.body.appendChild(el);

      const dy = -(Math.random() * 200 + 100);
      if (typeof el.animate === 'function') {
        el.animate([
          { transform: 'translate(0, 0) scale(0.2)', opacity: 0 },
          { transform: 'translate(0, -50px) scale(1.2)', opacity: 1, offset: 0.3 },
          { transform: `translate(${(Math.random() - 0.5) * 80}px, ${dy}px) scale(0.8)`, opacity: 0 }
        ], {
          duration: 2000 + Math.random() * 1000,
          easing: 'ease-out'
        }).onfinish = () => el.remove();
      } else {
        setTimeout(() => el.remove?.(), 2000);
      }
    }
  }
}

function initBirthdayGifts() {
  if (!window.birthdayGifts && typeof BirthdayGifts !== 'undefined') {
    window.birthdayGifts = new BirthdayGifts();
  } else if (window.birthdayGifts) {
    window.birthdayGifts.ensureElements();
  }
  return window.birthdayGifts;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initBirthdayGifts();
    const params = new URLSearchParams(window.location.search);
    if (params.get('open_modal') === 'gifts' || params.get('jump') === 'gifts') {
      setTimeout(() => {
        window.birthdayGifts?.open();
      }, 400);
    }
  });
} else {
  initBirthdayGifts();
  const params = new URLSearchParams(window.location.search);
  if (params.get('open_modal') === 'gifts' || params.get('jump') === 'gifts') {
    setTimeout(() => {
      window.birthdayGifts?.open();
    }, 400);
  }
}

window.initBirthdayGifts = initBirthdayGifts;
