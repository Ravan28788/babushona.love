// Admin Control Center for Yuvi
// Complete access: Name customization (e.g. Misty -> Neha), Occasion (Birthday/Anniversary),
// Shareable Link Generator with URL parameters, Photo customization, Mission Skip & Unlocks!

(function() {
  const MASTER_PASSWORD = 'Yuvi@123';

  const DEFAULT_CONFIG = {
    recipientName: 'Misty',
    senderName: 'Yuvi',
    nickname: 'Babu Shona',
    occasion: 'birthday', // 'birthday', 'anniversary', 'love', 'valentine'
    customWish: 'to us and a love that blooms',
    spokenVoice: true,
    spokenWishText: 'Happy Birthday Misty!',
    upiId: 'baby8389@nyes',
    amount: 143,
    instaId: 'tim_aary',
    letterText: `Dear Misty,\n\nHappy Birthday to the girl who stole my heart and made my life ten thousand times sweeter. Every time I see your smile, hear your voice, or just think about you, I feel like the luckiest person in this whole universe.\n\nThank you for being my strength, my happiness, my biggest cheerleader, and my sweet partner in all madness. I promise to keep loving you, protecting your smile, standing by your side in every step of life, and making you feel like the queen you truly are.\n\nHere’s to us, to all our dreams, and to a love that blooms brighter with every passing year. Happy Birthday, my love! ❤️🎂✨`,
    customPhotos: {
      bgTheme: '',
      mainPortrait: '',
      puzzlePhoto: '',
      liveHug: ''
    }
  };

  class AdminManager {
    constructor() {
      this.config = this.loadConfig();
      window.SiteConfig = this.config;
      
      this.initDOMElements();
      this.initFromUrlParams();
      this.applyConfig(this.config);
      this.bindEvents();
    }

    loadConfig() {
      try {
        const saved = localStorage.getItem('yuvi_admin_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_CONFIG, ...parsed, customPhotos: { ...DEFAULT_CONFIG.customPhotos, ...(parsed.customPhotos || {}) } };
        }
      } catch (e) {
        console.warn('Error loading config from localStorage:', e);
      }
      return { ...DEFAULT_CONFIG };
    }

    saveConfig(cfg) {
      this.config = { ...this.config, ...cfg };
      window.SiteConfig = this.config;
      try {
        localStorage.setItem('yuvi_admin_config', JSON.stringify(this.config));
      } catch (e) {
        console.warn('Error saving config to localStorage:', e);
      }
      this.applyConfig(this.config);
    }

    initDOMElements() {
      this.cornerBtn = document.getElementById('adminCornerTrigger');
      this.authModal = document.getElementById('adminAuthModal');
      this.dashModal = document.getElementById('adminDashboardModal');
      this.closeAuthBtn = document.getElementById('closeAdminAuthBtn');
      this.closeDashBtn = document.getElementById('closeAdminDashBtn');
      this.passInput = document.getElementById('adminPassInput');
      this.loginBtn = document.getElementById('adminLoginBtn');
      this.authError = document.getElementById('adminAuthError');
      this.logoutBtn = document.getElementById('adminLogoutBtn');

      // Auth Views & Forgot Password Elements
      this.loginView = document.getElementById('adminLoginView');
      this.forgotView = document.getElementById('adminForgotView');
      this.forgotBtn = document.getElementById('adminForgotBtn');
      this.backToLoginBtn = document.getElementById('backToLoginBtn');
      this.secAns1 = document.getElementById('secAns1');
      this.secAns2 = document.getElementById('secAns2');
      this.secNewPass = document.getElementById('secNewPass');
      this.submitSecBtn = document.getElementById('submitSecBtn');
      this.secErrorMsg = document.getElementById('secErrorMsg');
      this.secSuccessMsg = document.getElementById('secSuccessMsg');

      // Dashboard form inputs
      this.inputToName = document.getElementById('adminToName');
      this.inputFromName = document.getElementById('adminFromName');
      this.inputNickname = document.getElementById('adminNickname');
      this.selectOccasion = document.getElementById('adminOccasion');
      this.inputCustomWish = document.getElementById('adminCustomWish');
      this.toggleVoice = document.getElementById('adminToggleVoice');
      this.inputVoiceText = document.getElementById('adminVoiceText');
      this.inputLetterText = document.getElementById('adminLetterText');
      this.inputUpiId = document.getElementById('adminUpiId');
      this.inputAmount = document.getElementById('adminAmount');
      this.inputInstaId = document.getElementById('adminInstaId');

      // Link Generator Elements
      this.generatedLinkEl = document.getElementById('adminGeneratedLink');
      this.copyLinkBtn = document.getElementById('adminCopyLinkBtn');
      this.openLinkBtn = document.getElementById('adminOpenLinkBtn');

      // Photos
      this.uploadBg = document.getElementById('adminUploadBg');
      this.uploadPortrait = document.getElementById('adminUploadPortrait');
      this.uploadPuzzle = document.getElementById('adminUploadPuzzle');
      this.uploadHug = document.getElementById('adminUploadHug');

      // Action Buttons
      this.saveBtn = document.getElementById('adminSaveBtn');
      this.resetBtn = document.getElementById('adminResetBtn');
      this.unlockAllBtn = document.getElementById('adminUnlockAllBtn');
      this.resetProgressBtn = document.getElementById('adminResetProgressBtn');
    }

    initFromUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const toName = params.get('to') || params.get('name');
      const fromName = params.get('from');
      const occ = params.get('occ') || params.get('occasion');
      const pet = params.get('pet') || params.get('nickname');

      if (toName || fromName || occ || pet) {
        if (toName) this.config.recipientName = toName.trim();
        if (fromName) this.config.senderName = fromName.trim();
        if (occ) this.config.occasion = occ.trim().toLowerCase();
        if (pet) this.config.nickname = pet.trim();

        // Update default wish text based on occasion
        if (this.config.occasion === 'anniversary') {
          this.config.spokenWishText = `Happy Anniversary ${this.config.recipientName}!`;
          this.config.customWish = 'to our timeless love and journey together';
        } else if (this.config.occasion === 'love') {
          this.config.spokenWishText = `I Love You ${this.config.recipientName}!`;
          this.config.customWish = 'you are my whole world and my heart';
        } else {
          this.config.spokenWishText = `Happy Birthday ${this.config.recipientName}!`;
        }

        window.SiteConfig = this.config;
      }
    }

    applyConfig(cfg) {
      const name = cfg.recipientName || 'Misty';
      const sender = cfg.senderName || 'Yuvi';
      const occ = cfg.occasion || 'birthday';
      const occTitle = occ === 'anniversary' ? 'Anniversary' : (occ === 'love' ? 'Love Surprise' : 'Birthday');
      const occWish = occ === 'anniversary' ? 'Happy Anniversary' : (occ === 'love' ? 'I Love You' : 'Happy Birthday');

      // 1. Page Title & Meta
      document.title = `${occWish} ${name} ♥`;

      // 2. Headline Words in Hero Reveal
      const wLine1 = document.getElementById('wLine1');
      const wLine2 = document.getElementById('wLine2');
      if (wLine1) wLine1.textContent = occWish;
      if (wLine2) wLine2.textContent = name;

      // Rebuild Split Chars if birthday.js is active
      if (typeof window.rebuildHeadlineChars === 'function') {
        window.rebuildHeadlineChars();
      }

      // 3. Hero Wish Elements
      const wHero = document.getElementById('wHero');
      if (wHero) wHero.textContent = `${occWish}, ${name}`;

      const wSub = document.getElementById('wSub');
      if (wSub && cfg.customWish) wSub.textContent = cfg.customWish;

      const startQuestBtn = document.getElementById('startQuestBtn');
      if (startQuestBtn) startQuestBtn.innerHTML = `💌 Start ${name}'s Love Quest &amp; Game ✨`;

      // 4. Gifts Header & Title
      const giftsTitle = document.querySelector('.gifts-title');
      if (giftsTitle) giftsTitle.innerHTML = `${occWish}, Queen ${name}! 🎂🎉`;

      const giftsBadge = document.querySelector('.gifts-badge');
      if (giftsBadge) giftsBadge.textContent = `SPECIAL ${occTitle.toUpperCase()} EDITION 👑`;

      // 5. Letter Card
      const letterTitle = document.querySelector('.letter-title');
      if (letterTitle) letterTitle.innerHTML = `A Letter From My Heart To You, ${name}... 🌹`;

      const letterBody = document.querySelector('.letter-body');
      if (letterBody && cfg.letterText) {
        letterBody.innerHTML = cfg.letterText.replace(/\n/g, '<br>');
      }

      const letterSign = document.querySelector('.letter-sign span');
      if (letterSign) letterSign.textContent = `Your ${sender} ♥`;

      // 6. Payment & UPI
      const upiText = document.getElementById('upiText');
      if (upiText) upiText.textContent = cfg.upiId;

      const qrReceiver = document.querySelector('.qr-receiver-name');
      if (qrReceiver) qrReceiver.textContent = `${sender} (Your Love) 👑`;

      const amountTag = document.querySelector('.amount-tag');
      if (amountTag) {
        amountTag.innerHTML = `Amount: <strong>₹${cfg.amount}.00</strong> (${cfg.amount} = I Love You ❤️)`;
      }

      const instaUser = document.querySelector('.insta-user');
      if (instaUser) instaUser.textContent = `@${cfg.instaId}`;

      const instaBtn = document.querySelector('.insta-link-btn');
      if (instaBtn) instaBtn.href = `https://instagram.com/${cfg.instaId}`;

      // 7. Custom Photos
      if (cfg.customPhotos?.bgTheme) {
        const bgHero = document.getElementById('heroBg');
        if (bgHero) bgHero.style.backgroundImage = `url("${cfg.customPhotos.bgTheme}")`;
      }
      if (cfg.customPhotos?.puzzlePhoto && window.lovePuzzle) {
        window.lovePuzzle.setImage(cfg.customPhotos.puzzlePhoto);
      }
      if (cfg.customPhotos?.liveHug) {
        document.querySelectorAll('.live-hug-img').forEach(img => img.src = cfg.customPhotos.liveHug);
      }

      // 8. Update Spoken Voice settings in window
      window.adminSpokenVoice = cfg.spokenVoice;
      window.adminSpokenWishText = cfg.spokenWishText || `${occWish} ${name}!`;

      // 9. Update UI fields in dashboard if opened
      this.populateFormFields();
      this.updateGeneratedLink();
    }

    populateFormFields() {
      if (this.inputToName) this.inputToName.value = this.config.recipientName;
      if (this.inputFromName) this.inputFromName.value = this.config.senderName;
      if (this.inputNickname) this.inputNickname.value = this.config.nickname;
      if (this.selectOccasion) this.selectOccasion.value = this.config.occasion;
      if (this.inputCustomWish) this.inputCustomWish.value = this.config.customWish;
      if (this.toggleVoice) this.toggleVoice.checked = this.config.spokenVoice !== false;
      if (this.inputVoiceText) this.inputVoiceText.value = this.config.spokenWishText;
      if (this.inputLetterText) this.inputLetterText.value = this.config.letterText;
      if (this.inputUpiId) this.inputUpiId.value = this.config.upiId;
      if (this.inputAmount) this.inputAmount.value = this.config.amount;
      if (this.inputInstaId) this.inputInstaId.value = this.config.instaId;
    }

    updateGeneratedLink() {
      if (!this.generatedLinkEl) return;
      const base = window.location.origin + window.location.pathname;
      const to = encodeURIComponent(this.config.recipientName || 'Misty');
      const from = encodeURIComponent(this.config.senderName || 'Yuvi');
      const occ = encodeURIComponent(this.config.occasion || 'birthday');
      const pet = encodeURIComponent(this.config.nickname || 'Babu');

      const fullUrl = `${base}?to=${to}&from=${from}&occ=${occ}&pet=${pet}`;
      this.generatedLinkEl.value = fullUrl;
    }

    bindEvents() {
      // Corner Button Click (Always prompts for password Yuvi@123)
      const onCornerClick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.openAuthModal();
      };
      this.cornerBtn?.addEventListener('click', onCornerClick);
      this.cornerBtn?.addEventListener('touchstart', onCornerClick, { passive: false });

      // Auth Modal Close & Submit
      this.closeAuthBtn?.addEventListener('click', () => this.closeAuthModal());
      this.authModal?.addEventListener('click', (e) => {
        if (e.target === this.authModal) this.closeAuthModal();
      });
      this.loginBtn?.addEventListener('click', () => this.handleLogin());
      this.passInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleLogin();
      });

      // Forgot Password & Security Questions Event Listeners
      this.forgotBtn?.addEventListener('click', () => this.showForgotView());
      this.backToLoginBtn?.addEventListener('click', () => this.showLoginView());
      this.submitSecBtn?.addEventListener('click', () => this.handleSecurityReset());
      [this.secAns1, this.secAns2, this.secNewPass].forEach(el => {
        el?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.handleSecurityReset();
        });
      });

      // Dash Modal Close & Logout
      this.closeDashBtn?.addEventListener('click', () => this.closeDashboard());
      this.dashModal?.addEventListener('click', (e) => {
        if (e.target === this.dashModal) this.closeDashboard();
      });
      this.logoutBtn?.addEventListener('click', () => {
        sessionStorage.removeItem('yuvi_admin_authed');
        this.closeDashboard();
        this.showToast('🔒 Logged out of Admin Control.');
      });

      // Live update link on input change
      [this.inputToName, this.inputFromName, this.inputNickname, this.selectOccasion].forEach(el => {
        el?.addEventListener('input', () => {
          this.config.recipientName = this.inputToName?.value || 'Misty';
          this.config.senderName = this.inputFromName?.value || 'Yuvi';
          this.config.nickname = this.inputNickname?.value || 'Babu Shona';
          this.config.occasion = this.selectOccasion?.value || 'birthday';
          this.updateGeneratedLink();
        });
      });

      // Copy Link Button
      this.copyLinkBtn?.addEventListener('click', () => {
        if (!this.generatedLinkEl) return;
        this.generatedLinkEl.select();
        navigator.clipboard.writeText(this.generatedLinkEl.value).then(() => {
          this.showToast('📋 Shareable custom link copied to clipboard! Share it with anyone! 💖');
        }).catch(() => {
          document.execCommand('copy');
          this.showToast('📋 Link copied to clipboard!');
        });
      });

      // Open Link in New Tab
      this.openLinkBtn?.addEventListener('click', () => {
        if (this.generatedLinkEl?.value) {
          window.open(this.generatedLinkEl.value, '_blank');
        }
      });

      // Save & Apply Button
      this.saveBtn?.addEventListener('click', () => {
        const newCfg = {
          recipientName: this.inputToName?.value.trim() || 'Misty',
          senderName: this.inputFromName?.value.trim() || 'Yuvi',
          nickname: this.inputNickname?.value.trim() || 'Babu Shona',
          occasion: this.selectOccasion?.value || 'birthday',
          customWish: this.inputCustomWish?.value.trim() || DEFAULT_CONFIG.customWish,
          spokenVoice: this.toggleVoice ? this.toggleVoice.checked : true,
          spokenWishText: this.inputVoiceText?.value.trim() || `Happy Birthday ${this.inputToName?.value || 'Misty'}!`,
          letterText: this.inputLetterText?.value || DEFAULT_CONFIG.letterText,
          upiId: this.inputUpiId?.value.trim() || 'baby8389@nyes',
          amount: parseInt(this.inputAmount?.value, 10) || 143,
          instaId: this.inputInstaId?.value.trim().replace(/^@/, '') || 'tim_aary'
        };

        this.saveConfig(newCfg);
        this.showToast('✅ All Admin Changes Saved & Applied Instantly! 🎉');
        if (window.soundFX) window.soundFX.triumph?.();
      });

      // Reset to Default Yuvi & Misty Button
      this.resetBtn?.addEventListener('click', () => {
        if (confirm('Kya aap sach mein sabhi settings ko default Yuvi & Misty theme par reset karna chahte hain?')) {
          localStorage.removeItem('yuvi_admin_config');
          this.config = { ...DEFAULT_CONFIG };
          this.saveConfig(this.config);
          this.showToast('🔄 Settings reset to default Yuvi & Misty theme! 💖');
        }
      });

      // Photo Upload Handlers
      this.bindPhotoUpload(this.uploadBg, 'bgTheme');
      this.bindPhotoUpload(this.uploadPortrait, 'mainPortrait');
      this.bindPhotoUpload(this.uploadPuzzle, 'puzzlePhoto');
      this.bindPhotoUpload(this.uploadHug, 'liveHug');

      // Mission Unlocks & Navigation Shortcuts
      this.unlockAllBtn?.addEventListener('click', () => {
        if (window.journey) {
          ['quiz', 'game', 'puzzle', 'gifts', 'pay'].forEach(s => window.journey.unlock(s, true));
        }
        if (window.loveGame) {
          window.loveGame.unlockedGameModes.add(2);
          window.loveGame.unlockedGameModes.add(3);
          window.loveGame.updateTabUI();
        }
        if (window.lovePuzzle) {
          window.lovePuzzle.solvedPuzzlesCount = 1;
          window.lovePuzzle.updateSkipButtonUI();
        }
        this.showToast('🔓 ALL Missions & Steps Unlocked! You can jump anywhere!');
        if (window.soundFX) window.soundFX.victoryFanfare?.();
      });

      this.resetProgressBtn?.addEventListener('click', () => {
        if (confirm('Reset all steps and lock missions back to start?')) {
          localStorage.removeItem('misty_solved_puzzles_count');
          location.reload();
        }
      });

      // Jump to buttons
      document.querySelectorAll('.admin-jump-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.jump;
          this.closeDashboard();
          this.jumpTo(target);
        });
      });

      // Tab switcher in Dashboard
      document.querySelectorAll('.atab-btn').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
          document.querySelectorAll('.atab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.atab-panel').forEach(p => p.classList.remove('active'));

          tabBtn.classList.add('active');
          const panelId = tabBtn.dataset.panel;
          const targetPanel = document.getElementById(panelId);
          if (targetPanel) targetPanel.classList.add('active');
        });
      });
    }

    bindPhotoUpload(inputEl, photoKey) {
      if (!inputEl) return;
      inputEl.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            if (!this.config.customPhotos) this.config.customPhotos = {};
            this.config.customPhotos[photoKey] = dataUrl;
            this.saveConfig(this.config);
            this.showToast(`📸 Custom ${photoKey} updated successfully!`);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    jumpTo(target) {
      if (!window.journey) return;
      if (target === 'quiz') {
        window.journey.unlock('quiz', true);
        window.loveQuest?.open();
      } else if (target === 'car1') {
        window.journey.unlock('game', true);
        window.loveGame?.switchMode(1);
        window.loveGame?.open();
      } else if (target === 'car2') {
        window.journey.unlock('game', true);
        window.loveGame?.unlockedGameModes.add(2);
        window.loveGame?.switchMode(2);
        window.loveGame?.open();
      } else if (target === 'car3') {
        window.journey.unlock('game', true);
        window.loveGame?.unlockedGameModes.add(3);
        window.loveGame?.switchMode(3);
        window.loveGame?.open();
      } else if (target === 'puzzle') {
        window.journey.unlock('puzzle', true);
        window.lovePuzzle?.open();
      } else if (target === 'gifts') {
        window.journey.unlock('gifts', true);
        window.birthdayGifts?.open();
      } else if (target === 'pay') {
        window.journey.unlock('pay', true);
        window.birthdayGifts?.open();
        window.birthdayGifts?.scrollToPayment();
      }
    }

    handleLogin() {
      const currentPass = localStorage.getItem('yuvi_master_pass') || MASTER_PASSWORD;
      const val = this.passInput?.value.trim();
      if (val === currentPass || val === MASTER_PASSWORD) {
        sessionStorage.setItem('yuvi_admin_authed', 'true');
        this.closeAuthModal();
        this.openDashboard();
        this.showToast('👑 Welcome Yuvi! Admin Control Unlocked! 🚀');
        if (window.soundFX) window.soundFX.victoryFanfare?.();
      } else {
        if (this.authError) {
          this.authError.textContent = '❌ Incorrect password! Only Yuvi can access.';
          this.authError.style.display = 'block';
        }
        if (this.passInput) {
          this.passInput.classList.add('shake-locked');
          setTimeout(() => this.passInput.classList.remove('shake-locked'), 500);
        }
        if (window.soundFX) window.soundFX.boing?.();
      }
    }

    handleSecurityReset() {
      const a1 = (this.secAns1?.value || '').trim().toLowerCase();
      const a2 = (this.secAns2?.value || '').trim().toLowerCase();

      // Question 1: your childhood school name -> 'mbs'
      // Question 2: your favourite things -> 'money'
      const q1Match = (a1 === 'mbs');
      const q2Match = (a2 === 'money');

      if (q1Match && q2Match) {
        const newPass = (this.secNewPass?.value || '').trim() || MASTER_PASSWORD;
        localStorage.setItem('yuvi_master_pass', newPass);
        sessionStorage.setItem('yuvi_admin_authed', 'true');

        if (this.secErrorMsg) this.secErrorMsg.style.display = 'none';
        if (this.secSuccessMsg) {
          this.secSuccessMsg.innerHTML = '✅ Security Verified! Password reset successfully! Opening Dashboard... 🎉';
          this.secSuccessMsg.style.display = 'block';
        }
        if (window.soundFX) window.soundFX.victoryFanfare?.();

        setTimeout(() => {
          this.closeAuthModal();
          this.openDashboard();
          this.showToast('👑 Welcome Yuvi! Password updated & Admin Control Unlocked! 🚀');
        }, 900);
      } else {
        if (this.secSuccessMsg) this.secSuccessMsg.style.display = 'none';
        if (this.secErrorMsg) {
          this.secErrorMsg.textContent = '❌ Security Answers Galat Hain! Only Yuvi can reset.';
          this.secErrorMsg.style.display = 'block';
        }
        if (this.secAns1) {
          this.secAns1.classList.add('shake-locked');
          setTimeout(() => this.secAns1?.classList.remove('shake-locked'), 500);
        }
        if (window.soundFX) window.soundFX.boing?.();
      }
    }

    showForgotView() {
      if (this.loginView) this.loginView.style.display = 'none';
      if (this.forgotView) this.forgotView.style.display = 'block';
      if (this.secErrorMsg) this.secErrorMsg.style.display = 'none';
      if (this.secSuccessMsg) this.secSuccessMsg.style.display = 'none';
      if (this.secAns1) this.secAns1.value = '';
      if (this.secAns2) this.secAns2.value = '';
      if (this.secNewPass) this.secNewPass.value = '';
      setTimeout(() => this.secAns1?.focus(), 150);
    }

    showLoginView() {
      if (this.forgotView) this.forgotView.style.display = 'none';
      if (this.loginView) this.loginView.style.display = 'block';
      if (this.authError) this.authError.style.display = 'none';
      setTimeout(() => this.passInput?.focus(), 150);
    }

    openAuthModal() {
      if (!this.authModal) return;
      this.showLoginView();
      if (this.passInput) this.passInput.value = '';
      this.authModal.classList.add('is-open');
      this.authModal.style.display = 'flex';
      document.body.classList.add('modal-active');
      setTimeout(() => this.passInput?.focus(), 200);
    }

    closeAuthModal() {
      if (this.authModal) {
        this.authModal.classList.remove('is-open');
        this.authModal.style.display = 'none';
      }
      document.body.classList.remove('modal-active');
    }

    openDashboard() {
      if (!this.dashModal) return;
      this.populateFormFields();
      this.updateGeneratedLink();
      this.dashModal.classList.add('is-open');
      this.dashModal.style.display = 'flex';
      document.body.classList.add('modal-active');
    }

    closeDashboard() {
      if (this.dashModal) {
        this.dashModal.classList.remove('is-open');
        this.dashModal.style.display = 'none';
      }
      document.body.classList.remove('modal-active');
    }

    showToast(msg) {
      if (window.journey) {
        window.journey.showToast(msg);
      } else {
        alert(msg);
      }
    }
  }

  function initAdmin() {
    if (!window.adminManager) {
      window.adminManager = new AdminManager();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }
})();
