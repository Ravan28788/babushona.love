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
      img.alt = `Misty thumb ${i + 1}`;
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

    if (this.photoImg) {
      this.photoImg.style.opacity = '0.3';
      this.photoImg.style.transform = 'scale(0.96)';

      const tempImg = new Image();
      tempImg.onload = () => {
        this.photoImg.src = tempImg.src;
        this.photoImg.style.opacity = '1';
        this.photoImg.style.transform = 'scale(1)';
      };
      tempImg.onerror = () => {
        if (data.fallbackSrc && tempImg.src !== data.fallbackSrc) {
          tempImg.src = data.fallbackSrc;
        } else {
          this.photoImg.src = data.src;
          this.photoImg.style.opacity = '1';
          this.photoImg.style.transform = 'scale(1)';
        }
      };
      tempImg.src = data.src;
    }

    if (this.photoTitle) this.photoTitle.textContent = data.title;
    if (this.photoCaption) this.photoCaption.textContent = `"${data.caption}"`;
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
          lightboxImg.src = data.img;
          if (lightboxTitle) lightboxTitle.textContent = data.title;
          if (lightboxDesc) lightboxDesc.textContent = data.desc;
          
          const liveFx = document.getElementById('lightboxLiveFx');
          const liveBadge = document.getElementById('lightboxLiveBadge');
          const imgWrap = document.getElementById('lightboxImgWrap');

          if (giftKey === 'yuvi') {
            if (liveFx) liveFx.style.display = 'block';
            if (liveBadge) liveBadge.style.display = 'inline-flex';
            if (imgWrap) imgWrap.classList.add('live-hug-active');
            if (window.soundFX) {
              window.soundFX.chime(1.3);
              setTimeout(() => window.soundFX.kissSound?.(), 250);
            }
          } else {
            if (liveFx) liveFx.style.display = 'none';
            if (liveBadge) liveBadge.style.display = 'none';
            if (imgWrap) imgWrap.classList.remove('live-hug-active');
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

  open() {
    if (!this.section) return;
    document.body.classList.add('modal-active');
    this.section.classList.add('is-open');
    window.journey?.unlock('pay');
    if (window.soundFX) window.soundFX.victoryFanfare();
    this.spawnBigCelebration();
  }

  scrollToPayment() {
    this.open();
    setTimeout(() => {
      const el = document.getElementById('vipPaymentSection');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.journey) {
        window.journey.showToast('🍫 "143 AMMOUNT PAY KRDO, CHOCLATE KHARID KE TUM KO DUNGA!" 🥰💖');
      }
      if (window.soundFX) window.soundFX.chime?.(1.5);
    }, 350);
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
        paymentSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Big celebratory hearts & confetti
      this.spawnBigCelebration();
    });
  }

  close() {
    if (!this.section) return;
    document.body.classList.remove('modal-active');
    this.section.classList.remove('is-open');
    if (this.videoEl && !this.videoEl.paused) {
      this.videoEl.pause();
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
      el.animate([
        { transform: 'translate(0,0) scale(0.6)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(1.4)`, opacity: 0 }
      ], {
        duration: 900 + Math.random() * 400,
        easing: 'ease-out'
      }).onfinish = () => el.remove();
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
      el.animate([
        { transform: 'translate(0, 0) scale(0.2)', opacity: 0 },
        { transform: 'translate(0, -50px) scale(1.2)', opacity: 1, offset: 0.3 },
        { transform: `translate(${(Math.random() - 0.5) * 80}px, ${dy}px) scale(0.8)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 1000,
        easing: 'ease-out'
      }).onfinish = () => el.remove();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.birthdayGifts = new BirthdayGifts();
});
