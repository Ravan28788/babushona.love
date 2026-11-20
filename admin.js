// Admin Control Center for Yuvi & Multi-Admin System
// Complete access: Multi-Profile Celebration Engine (Neha, Misty, Rani...),
// Visual 5-Theme Customizer, Complete 8-Photo & Media Customizer,
// Dynamic Wishes & Texts, YouTube Romantic Music & Snippet Player,
// Multi-Admin Management & Universal Shareable Links!

(function() {
  const MASTER_PASSWORD = 'Yuvi@123';

  const DEFAULT_CONFIG = {
    recipientName: 'Misty',
    senderName: 'Yuvi',
    nickname: 'Babu Shona',
    occasion: 'birthday', // 'birthday', 'anniversary', 'love', 'valentine'
    theme: 'rose-pink',   // 'rose-pink', 'midnight-neon', 'royal-wine-gold', 'sunset-peach', 'emerald-fantasy'
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
      liveHug: '',
      giftDress: '',
      giftThar: '',
      giftPs5: '',
      paymentQr: ''
    }
  };

  const DEFAULT_PROFILES = {
    misty: {
      id: 'misty',
      name: 'Misty',
      sender: 'Yuvi',
      nickname: 'Babu Shona',
      occasion: 'birthday',
      theme: 'rose-pink',
      customWish: 'to us and a love that blooms',
      spokenVoice: true,
      spokenWishText: 'Happy Birthday Misty!',
      letterText: DEFAULT_CONFIG.letterText,
      customPhotos: { ...DEFAULT_CONFIG.customPhotos },
      createdAt: 'Default'
    }
  };

  // Helper functions for Multi-Admin persistence
  function getStoredSubAdmins() {
    try {
      const raw = localStorage.getItem('yuvi_sub_admins');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading sub-admins:', e);
    }
    return [];
  }

  function saveSubAdmins(admins) {
    try {
      localStorage.setItem('yuvi_sub_admins', JSON.stringify(admins));
    } catch (e) {
      console.warn('Error saving sub-admins:', e);
    }
  }

  // Helper functions for Celebration Profiles DB
  function getStoredProfiles() {
    try {
      const raw = localStorage.getItem('yuvi_profiles_db');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ...DEFAULT_PROFILES, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading profiles:', e);
    }
    return { ...DEFAULT_PROFILES };
  }

  function saveProfiles(profiles) {
    try {
      localStorage.setItem('yuvi_profiles_db', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Error saving profiles:', e);
    }
  }

  // Helper function to extract YouTube video ID
  function extractYouTubeId(url) {
    if (!url) return null;
    const cleanUrl = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Helper function to parse seconds or mm:ss format
  function parseTimeToSeconds(val, fallback = 0) {
    if (typeof val === 'number') return isNaN(val) ? fallback : val;
    if (!val) return fallback;
    const s = String(val).trim();
    if (s.includes(':')) {
      const parts = s.split(':').map(Number);
      if (parts.length === 2) return ((parts[0] || 0) * 60) + (parts[1] || 0);
      if (parts.length === 3) return ((parts[0] || 0) * 3600) + ((parts[1] || 0) * 60) + (parts[2] || 0);
    }
    const num = parseFloat(s);
    return isNaN(num) ? fallback : num;
  }

  class AdminManager {
    constructor() {
      this.config = this.loadConfig();
      window.SiteConfig = this.config;
      this.currentAdmin = this.loadSessionAdmin();
      this.activeProfileId = localStorage.getItem('yuvi_active_profile_id') || 'misty';

      this.initDOMElements();
      this.initFromUrlParams();
      this.applyConfig(this.config);
      this.bindEvents();
    }

    loadSessionAdmin() {
      try {
        const raw = sessionStorage.getItem('yuvi_current_admin');
        if (raw) return JSON.parse(raw);
      } catch (_) {}
      return { name: 'Yuvi', username: 'yuvi', role: 'master' };
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
      this.userInput = document.getElementById('adminUserInput');
      this.userWrap = document.getElementById('adminUserWrap');
      this.toggleUserBtn = document.getElementById('toggleUserFieldBtn');
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

      // Dashboard Header
      this.dashBadge = document.getElementById('adminDashBadge');

      // Multi-Profile Form Elements
      this.profEditId = document.getElementById('profEditId');
      this.profFormTitle = document.getElementById('profFormTitle');
      this.profName = document.getElementById('profName');
      this.profSender = document.getElementById('profSender');
      this.profNickname = document.getElementById('profNickname');
      this.profOccasion = document.getElementById('profOccasion');
      this.profThemeSelect = document.getElementById('profThemeSelect');
      this.profWish = document.getElementById('profWish');
      this.profVoice = document.getElementById('profVoice');
      this.profLetter = document.getElementById('profLetter');
      this.profSaveBtn = document.getElementById('profSaveBtn');
      this.profResetFormBtn = document.getElementById('profResetFormBtn');
      this.profStatusBanner = document.getElementById('profStatusBanner');
      this.profShareLinkInput = document.getElementById('profShareLinkInput');
      this.profCopyShareLinkBtn = document.getElementById('profCopyShareLinkBtn');
      this.profOpenShareLinkBtn = document.getElementById('profOpenShareLinkBtn');
      this.profilesListContainer = document.getElementById('profilesListContainer');

      // General / Names Form inputs
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

      // Photos (Uploads & URLs)
      this.uploadBg = document.getElementById('adminUploadBg');
      this.urlBg = document.getElementById('adminUrlBg');
      this.uploadPortrait = document.getElementById('adminUploadPortrait');
      this.urlPortrait = document.getElementById('adminUrlPortrait');
      this.uploadPuzzle = document.getElementById('adminUploadPuzzle');
      this.urlPuzzle = document.getElementById('adminUrlPuzzle');
      this.uploadHug = document.getElementById('adminUploadHug');
      this.urlHug = document.getElementById('adminUrlHug');
      this.uploadGiftDress = document.getElementById('adminUploadGiftDress');
      this.urlGiftDress = document.getElementById('adminUrlGiftDress');
      this.uploadGiftThar = document.getElementById('adminUploadGiftThar');
      this.urlGiftThar = document.getElementById('adminUrlGiftThar');
      this.uploadGiftPs5 = document.getElementById('adminUploadGiftPs5');
      this.urlGiftPs5 = document.getElementById('adminUrlGiftPs5');
      this.uploadPaymentQr = document.getElementById('adminUploadPaymentQr');
      this.urlPaymentQr = document.getElementById('adminUrlPaymentQr');

      // YouTube Music Manager Elements
      this.adminYtUrl = document.getElementById('adminYtUrl');
      this.adminYtTitle = document.getElementById('adminYtTitle');
      this.adminYtArtist = document.getElementById('adminYtArtist');
      this.adminYtStart = document.getElementById('adminYtStart');
      this.adminYtEnd = document.getElementById('adminYtEnd');
      this.adminAddSongBtn = document.getElementById('adminAddSongBtn');
      this.adminTestSongBtn = document.getElementById('adminTestSongBtn');
      this.adminStopTestBtn = document.getElementById('adminStopTestBtn');
      this.macStatusMsg = document.getElementById('macStatusMsg');
      this.adminPlaylistContainer = document.getElementById('adminPlaylistContainer');

      // Multi-Admin Manager Elements
      this.newAdminName = document.getElementById('newAdminName');
      this.newAdminUser = document.getElementById('newAdminUser');
      this.newAdminPass = document.getElementById('newAdminPass');
      this.createAdminBtn = document.getElementById('createAdminBtn');
      this.amcStatusMsg = document.getElementById('amcStatusMsg');
      this.adminUsersContainer = document.getElementById('adminUsersContainer');

      // Action Buttons
      this.saveBtn = document.getElementById('adminSaveBtn');
      this.resetBtn = document.getElementById('adminResetBtn');
      this.unlockAllBtn = document.getElementById('adminUnlockAllBtn');
      this.resetProgressBtn = document.getElementById('adminResetProgressBtn');
    }

    initFromUrlParams() {
      const params = new URLSearchParams(window.location.search);

      // Check for compact portable base64 profile payload
      const pdata = params.get('pdata');
      if (pdata) {
        try {
          const decoded = JSON.parse(decodeURIComponent(escape(atob(pdata))));
          if (decoded && decoded.name) {
            this.config.recipientName = decoded.name;
            if (decoded.sender) this.config.senderName = decoded.sender;
            if (decoded.pet) this.config.nickname = decoded.pet;
            if (decoded.occ) this.config.occasion = decoded.occ;
            if (decoded.theme) this.config.theme = decoded.theme;
            if (decoded.wish) this.config.customWish = decoded.wish;
            if (decoded.voice) this.config.spokenWishText = decoded.voice;
            if (decoded.letter) this.config.letterText = decoded.letter;
            if (decoded.photos) this.config.customPhotos = { ...this.config.customPhotos, ...decoded.photos };
            window.SiteConfig = this.config;
            return;
          }
        } catch (e) {
          console.warn('Error parsing pdata param:', e);
        }
      }

      // Check for profile key
      const pId = params.get('p') || params.get('profile');
      if (pId) {
        const db = getStoredProfiles();
        const found = db[pId.toLowerCase()];
        if (found) {
          this.config = { ...this.config, ...found, customPhotos: { ...this.config.customPhotos, ...(found.customPhotos || {}) } };
          this.activeProfileId = pId.toLowerCase();
          window.SiteConfig = this.config;
          return;
        }
      }

      // Check individual query parameters
      const toName = params.get('to') || params.get('name');
      const fromName = params.get('from');
      const occ = params.get('occ') || params.get('occasion');
      const pet = params.get('pet') || params.get('nickname');
      const theme = params.get('theme');

      if (toName || fromName || occ || pet || theme) {
        if (toName) this.config.recipientName = toName.trim();
        if (fromName) this.config.senderName = fromName.trim();
        if (occ) this.config.occasion = occ.trim().toLowerCase();
        if (pet) this.config.nickname = pet.trim();
        if (theme) this.config.theme = theme.trim();

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
      const theme = cfg.theme || 'rose-pink';
      const occWish = occ === 'anniversary' ? 'Happy Anniversary' : (occ === 'love' ? 'I Love You' : 'Happy Birthday');

      // 1. Theme application
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-card-option').forEach(card => {
        card.classList.toggle('is-selected-theme', card.dataset.theme === theme);
      });

      // 2. Page Title & Meta
      document.title = `${occWish} ${name} ♥`;

      // 3. Eyebrow in Hero
      const eyebrow = document.getElementById('eyebrow');
      if (eyebrow) eyebrow.textContent = `a little something, for ${name} ♥`;

      // 4. Headline Words in Hero Reveal
      const wLine1 = document.getElementById('wLine1');
      const wLine2 = document.getElementById('wLine2');
      if (wLine1) wLine1.textContent = occWish;
      if (wLine2) wLine2.textContent = name;

      if (window.rebuildHeadlineChars) {
        window.rebuildHeadlineChars(occWish, name);
      }

      // 5. Subtitle / Tagline
      const wishSub = document.querySelector('.wish-subtitle');
      if (wishSub && cfg.customWish) {
        wishSub.textContent = `to us and a love that blooms — forever ${sender} & ${name}`;
      }

      // 6. Letter / Modal Texts
      const letterRec = document.querySelector('.letter-recipient span');
      if (letterRec) letterRec.textContent = name;

      const letterBody = document.querySelector('.letter-body');
      if (letterBody && cfg.letterText) {
        letterBody.innerHTML = cfg.letterText
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br/>');
        if (!letterBody.innerHTML.startsWith('<p>')) {
          letterBody.innerHTML = `<p>${letterBody.innerHTML}</p>`;
        }
      }

      const letterSign = document.querySelector('.letter-sign span');
      if (letterSign) letterSign.textContent = `Your ${sender} ♥`;

      // 7. Payment & UPI
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

      // 8. Custom Photos Live Application Across Entire Website
      const p = cfg.customPhotos || {};
      if (p.bgTheme) {
        const bgHero = document.getElementById('heroBg');
        if (bgHero) bgHero.style.backgroundImage = `url("${p.bgTheme}")`;
        const scene = document.querySelector('.scene');
        if (scene) scene.style.backgroundImage = `url("${p.bgTheme}")`;
      }
      if (p.mainPortrait) {
        ['milestonePhotoImg', 'winMistyImg', 'puzzleRefImg', 'mistyPhotoImg'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.src = p.mainPortrait;
        });
        document.querySelectorAll('.care-misty-img').forEach(el => el.src = p.mainPortrait);
      }
      if (p.puzzlePhoto && window.lovePuzzle) {
        window.lovePuzzle.setImage(p.puzzlePhoto);
        const ref = document.getElementById('puzzleRefImg');
        if (ref) ref.src = p.puzzlePhoto;
      }
      if (p.liveHug) {
        document.querySelectorAll('.live-hug-img').forEach(img => img.src = p.liveHug);
        document.querySelectorAll('img[src*="gift_yuvi_misty"]').forEach(img => img.src = p.liveHug);
      }
      if (p.giftDress) {
        document.querySelectorAll('img[src*="gift_dress"]').forEach(img => img.src = p.giftDress);
      }
      if (p.giftThar) {
        document.querySelectorAll('img[src*="gift_thar"]').forEach(img => img.src = p.giftThar);
      }
      if (p.giftPs5) {
        document.querySelectorAll('img[src*="gift_ps5"]').forEach(img => img.src = p.giftPs5);
      }
      if (p.paymentQr) {
        document.querySelectorAll('.qr-code-img').forEach(img => img.src = p.paymentQr);
      }

      // 9. Update Spoken Voice settings
      window.adminSpokenVoice = cfg.spokenVoice;
      window.adminSpokenWishText = cfg.spokenWishText || `${occWish} ${name}!`;

      // 10. Update UI fields in dashboard if opened
      this.populateFormFields();
      this.updateGeneratedLink();
    }

    populateFormFields() {
      // General Tab fields
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

      // Profile Form fields
      if (this.profName) this.profName.value = this.config.recipientName;
      if (this.profSender) this.profSender.value = this.config.senderName;
      if (this.profNickname) this.profNickname.value = this.config.nickname;
      if (this.profOccasion) this.profOccasion.value = this.config.occasion;
      if (this.profThemeSelect) this.profThemeSelect.value = this.config.theme || 'rose-pink';
      if (this.profWish) this.profWish.value = this.config.customWish;
      if (this.profVoice) this.profVoice.value = this.config.spokenWishText;
      if (this.profLetter) this.profLetter.value = this.config.letterText;
    }

    // ==========================================
    // MULTI-PROFILE CELEBRATION ENGINE
    // ==========================================
    handleSaveProfile() {
      const name = (this.profName?.value || '').trim();
      const sender = (this.profSender?.value || '').trim() || 'Yuvi';
      const pet = (this.profNickname?.value || '').trim() || 'Babu Shona';
      const occ = this.profOccasion?.value || 'birthday';
      const theme = this.profThemeSelect?.value || 'rose-pink';
      const wish = (this.profWish?.value || '').trim() || 'to us and a love that blooms';
      const voice = (this.profVoice?.value || '').trim() || (occ === 'anniversary' ? `Happy Anniversary ${name}!` : `Happy Birthday ${name}!`);
      const letter = (this.profLetter?.value || '').trim() || `Dear ${name},\n\nHappy ${occ === 'anniversary' ? 'Anniversary' : 'Birthday'} to the most beautiful queen in my life! You make every day sweet and magical. I love you forever! ❤️✨`;

      if (!name) {
        this.showProfileStatus('⚠️ Kripya ladki ka naam (Recipient Name) zaroor daalein!', true);
        return;
      }

      const editId = this.profEditId?.value;
      const profId = editId ? editId : name.toLowerCase().replace(/[^a-z0-9]/g, '');

      const profiles = getStoredProfiles();
      const existingPhotos = profiles[profId]?.customPhotos || this.config.customPhotos || {};

      const newProfile = {
        id: profId,
        name: name,
        sender: sender,
        nickname: pet,
        occasion: occ,
        theme: theme,
        customWish: wish,
        spokenVoice: true,
        spokenWishText: voice,
        letterText: letter,
        customPhotos: { ...existingPhotos },
        updatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      };

      profiles[profId] = newProfile;
      saveProfiles(profiles);

      // Make this profile active
      this.activeProfileId = profId;
      localStorage.setItem('yuvi_active_profile_id', profId);

      this.config = {
        ...this.config,
        recipientName: name,
        senderName: sender,
        nickname: pet,
        occasion: occ,
        theme: theme,
        customWish: wish,
        spokenWishText: voice,
        letterText: letter,
        customPhotos: { ...newProfile.customPhotos }
      };
      this.saveConfig(this.config);

      // Reset edit ID
      if (this.profEditId) this.profEditId.value = '';
      if (this.profFormTitle) this.profFormTitle.textContent = '✨ Create / Edit Celebration Profile';
      if (this.profSaveBtn) this.profSaveBtn.innerHTML = '💾 Save &amp; Create Profile 🚀';

      const shareUrl = this.generateProfileUrl(newProfile);
      if (this.profShareLinkInput) this.profShareLinkInput.value = shareUrl;

      // Notice with user's exact phrase: "Profile created successfully!"
      this.showProfileStatus(`🎉 Profile "<strong>${name}</strong>" created successfully! Website is now fully customized for ${name}. Shareable link ready niche! 💖`, false);
      this.renderProfilesList();
      this.showToast(`🎉 Profile "${name}" created successfully! 🚀`);
      if (window.soundFX) window.soundFX.chime(1.5);
    }

    showProfileStatus(htmlMsg, isError) {
      if (!this.profStatusBanner) return;
      this.profStatusBanner.innerHTML = htmlMsg;
      this.profStatusBanner.style.background = isError ? 'rgba(255, 71, 87, 0.2)' : 'rgba(46, 213, 115, 0.2)';
      this.profStatusBanner.style.borderColor = isError ? '#ff4757' : '#2ed573';
      this.profStatusBanner.style.color = isError ? '#ff9da7' : '#a8ffcc';
      this.profStatusBanner.style.display = 'block';
    }

    generateProfileUrl(profile) {
      const base = window.location.origin + window.location.pathname;
      const params = new URLSearchParams();
      params.set('p', profile.id);
      params.set('to', profile.name);
      params.set('from', profile.sender);
      params.set('occ', profile.occasion);
      params.set('theme', profile.theme || 'rose-pink');
      if (profile.nickname) params.set('pet', profile.nickname);

      // Compact payload for full fidelity across other devices
      const payload = {
        name: profile.name,
        sender: profile.sender,
        pet: profile.nickname,
        occ: profile.occasion,
        theme: profile.theme,
        wish: profile.customWish,
        voice: profile.spokenWishText,
        letter: profile.letterText,
        photos: profile.customPhotos || {}
      };

      try {
        const jsonStr = JSON.stringify(payload);
        if (jsonStr.length < 3500) {
          params.set('pdata', btoa(unescape(encodeURIComponent(jsonStr))));
        }
      } catch (e) {}

      return `${base}?${params.toString()}`;
    }

    renderProfilesList() {
      if (!this.profilesListContainer) return;
      const profiles = getStoredProfiles();
      const activeId = this.activeProfileId || 'misty';

      let html = '';
      Object.keys(profiles).forEach(key => {
        const p = profiles[key];
        const isActive = (key === activeId);

        html += `
          <div class="profile-item-card ${isActive ? 'is-active-profile' : ''}">
            <div class="pro-card-info">
              <span class="pro-avatar">${p.occasion === 'anniversary' ? '💍' : (p.occasion === 'love' ? '💖' : '👸')}</span>
              <div>
                <div class="pro-name-row">
                  ${p.name}
                  ${isActive ? '<span class="pro-badge active-badge">Active 🟢</span>' : ''}
                  <span class="pro-badge occ-badge">${p.occasion}</span>
                  <span class="pro-badge theme-badge">${p.theme || 'rose-pink'}</span>
                </div>
                <div class="pro-sub-meta">
                  From: <strong>${p.sender}</strong> &bull; Nickname: <em>${p.nickname}</em>
                </div>
              </div>
            </div>
            <div class="pro-card-actions">
              ${!isActive ? `<button type="button" class="pro-btn activate-btn" data-actprof="${p.id}">⚡ Set Active</button>` : ''}
              <button type="button" class="pro-btn copy-btn" data-copyprof="${p.id}">📋 Copy Link</button>
              <button type="button" class="pro-btn open-btn" data-openprof="${p.id}">🚀 Open</button>
              <button type="button" class="pro-btn edit-btn" data-editprof="${p.id}">✏️ Edit</button>
              ${p.id !== 'misty' ? `<button type="button" class="pro-btn del-btn" data-delprof="${p.id}">🗑️</button>` : ''}
            </div>
          </div>
        `;
      });

      this.profilesListContainer.innerHTML = html;

      // Bind profile buttons
      this.profilesListContainer.querySelectorAll('.activate-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.activateProfile(btn.dataset.actprof);
        });
      });

      this.profilesListContainer.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = profiles[btn.dataset.copyprof];
          if (p) {
            const url = this.generateProfileUrl(p);
            navigator.clipboard.writeText(url).then(() => {
              this.showToast(`📋 Link for "${p.name}" copied to clipboard! ✨`);
            }).catch(() => {
              this.showToast(`📋 Link: ${url}`);
            });
          }
        });
      });

      this.profilesListContainer.querySelectorAll('.open-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = profiles[btn.dataset.openprof];
          if (p) {
            const url = this.generateProfileUrl(p);
            window.open(url, '_blank');
          }
        });
      });

      this.profilesListContainer.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.loadProfileIntoForm(btn.dataset.editprof);
        });
      });

      this.profilesListContainer.querySelectorAll('.del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.deleteProfile(btn.dataset.delprof);
        });
      });
    }

    activateProfile(profId) {
      const profiles = getStoredProfiles();
      const p = profiles[profId];
      if (!p) return;

      this.activeProfileId = profId;
      localStorage.setItem('yuvi_active_profile_id', profId);

      this.config = {
        ...this.config,
        recipientName: p.name,
        senderName: p.sender,
        nickname: p.nickname,
        occasion: p.occasion,
        theme: p.theme || 'rose-pink',
        customWish: p.customWish,
        spokenWishText: p.spokenWishText,
        letterText: p.letterText,
        customPhotos: { ...(p.customPhotos || {}) }
      };
      this.saveConfig(this.config);

      const shareUrl = this.generateProfileUrl(p);
      if (this.profShareLinkInput) this.profShareLinkInput.value = shareUrl;

      this.renderProfilesList();
      this.showToast(`⚡ Profile "${p.name}" is now live on the entire portal! 💖`);
      if (window.soundFX) window.soundFX.chime(1.4);
    }

    loadProfileIntoForm(profId) {
      const profiles = getStoredProfiles();
      const p = profiles[profId];
      if (!p) return;

      if (this.profEditId) this.profEditId.value = p.id;
      if (this.profFormTitle) this.profFormTitle.textContent = `✏️ Edit Profile: ${p.name}`;
      if (this.profSaveBtn) this.profSaveBtn.innerHTML = `💾 Update Profile (${p.name}) ✨`;

      if (this.profName) this.profName.value = p.name;
      if (this.profSender) this.profSender.value = p.sender;
      if (this.profNickname) this.profNickname.value = p.nickname;
      if (this.profOccasion) this.profOccasion.value = p.occasion;
      if (this.profThemeSelect) this.profThemeSelect.value = p.theme || 'rose-pink';
      if (this.profWish) this.profWish.value = p.customWish;
      if (this.profVoice) this.profVoice.value = p.spokenWishText;
      if (this.profLetter) this.profLetter.value = p.letterText;

      const shareUrl = this.generateProfileUrl(p);
      if (this.profShareLinkInput) this.profShareLinkInput.value = shareUrl;

      // Switch to profiles tab view
      this.showProfileStatus(`📝 Loaded "${p.name}" into editor. Changes save karne ke liye "Update Profile" dabayein.`, false);
    }

    deleteProfile(profId) {
      if (profId === 'misty') {
        alert('Default Misty profile cannot be deleted.');
        return;
      }
      if (!confirm(`Kya aap sach me "${profId}" profile ko delete karna chahte hain?`)) return;

      const profiles = getStoredProfiles();
      delete profiles[profId];
      saveProfiles(profiles);

      if (this.activeProfileId === profId) {
        this.activateProfile('misty');
      } else {
        this.renderProfilesList();
      }
      this.showToast('🗑️ Profile deleted.');
    }

    resetProfileForm() {
      if (this.profEditId) this.profEditId.value = '';
      if (this.profFormTitle) this.profFormTitle.textContent = '✨ Create / Edit Celebration Profile';
      if (this.profSaveBtn) this.profSaveBtn.innerHTML = '💾 Save &amp; Create Profile 🚀';
      if (this.profName) this.profName.value = '';
      if (this.profSender) this.profSender.value = 'Yuvi';
      if (this.profNickname) this.profNickname.value = 'Babu Shona';
      if (this.profOccasion) this.profOccasion.value = 'birthday';
      if (this.profThemeSelect) this.profThemeSelect.value = 'rose-pink';
      if (this.profWish) this.profWish.value = 'to us and a love that blooms';
      if (this.profVoice) this.profVoice.value = '';
      if (this.profLetter) this.profLetter.value = '';
      if (this.profStatusBanner) this.profStatusBanner.style.display = 'none';
      setTimeout(() => this.profName?.focus(), 100);
    }

    updateGeneratedLink() {
      if (!this.generatedLinkEl) return;
      const base = window.location.origin + window.location.pathname;
      const params = new URLSearchParams();
      if (this.inputToName?.value) params.set('to', this.inputToName.value.trim());
      if (this.inputFromName?.value) params.set('from', this.inputFromName.value.trim());
      if (this.selectOccasion?.value) params.set('occ', this.selectOccasion.value.trim());
      if (this.inputNickname?.value) params.set('pet', this.inputNickname.value.trim());
      if (this.config.theme) params.set('theme', this.config.theme);

      const finalUrl = `${base}?${params.toString()}`;
      this.generatedLinkEl.value = finalUrl;
    }

    bindEvents() {
      // Corner Button Click
      if (this.cornerBtn) {
        this.cornerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const authed = sessionStorage.getItem('yuvi_admin_authed') === 'true';
          if (authed) {
            this.openDashboard();
          } else {
            this.openAuthModal();
          }
        });
      }

      // Close Modals
      if (this.closeAuthBtn) {
        this.closeAuthBtn.addEventListener('click', () => this.closeAuthModal());
      }
      if (this.closeDashBtn) {
        this.closeDashBtn.addEventListener('click', () => this.closeDashboard());
      }

      // Toggle optional username field in login
      if (this.toggleUserBtn) {
        this.toggleUserBtn.addEventListener('click', () => {
          if (this.userWrap) {
            const isHidden = this.userWrap.style.display === 'none';
            this.userWrap.style.display = isHidden ? 'block' : 'none';
            this.toggleUserBtn.textContent = isHidden ? '🔑 Switch to Simple Password Login' : '👤 Sub-Admin Username Login';
            if (isHidden && this.userInput) this.userInput.focus();
          }
        });
      }

      // Login Submission
      if (this.loginBtn) {
        this.loginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogin();
        });
      }

      // Forgot Password Navigation & Verification
      if (this.forgotBtn) {
        this.forgotBtn.addEventListener('click', () => this.showForgotView());
      }
      if (this.backToLoginBtn) {
        this.backToLoginBtn.addEventListener('click', () => this.showLoginView());
      }
      if (this.submitSecBtn) {
        this.submitSecBtn.addEventListener('click', () => this.handleSecurityReset());
      }

      // Profile Manager Handlers
      if (this.profSaveBtn) {
        this.profSaveBtn.addEventListener('click', () => this.handleSaveProfile());
      }
      if (this.profResetFormBtn) {
        this.profResetFormBtn.addEventListener('click', () => this.resetProfileForm());
      }
      if (this.profCopyShareLinkBtn) {
        this.profCopyShareLinkBtn.addEventListener('click', () => {
          if (this.profShareLinkInput) {
            this.profShareLinkInput.select();
            navigator.clipboard.writeText(this.profShareLinkInput.value).then(() => {
              this.showToast('📋 Shareable profile link copied to clipboard! ✨');
            }).catch(() => {
              this.showToast('📋 Link copied!');
            });
          }
        });
      }
      if (this.profOpenShareLinkBtn) {
        this.profOpenShareLinkBtn.addEventListener('click', () => {
          if (this.profShareLinkInput?.value) {
            window.open(this.profShareLinkInput.value, '_blank');
          }
        });
      }

      // Theme Selection Handlers
      document.querySelectorAll('.tco-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const themeName = btn.dataset.settheme;
          if (themeName) {
            this.config.theme = themeName;
            this.saveConfig(this.config);
            this.showToast(`🎨 Theme changed to "${themeName}"! ✨`);
            if (window.soundFX) window.soundFX.chime(1.3);
          }
        });
      });

      // Live link updater when inputs change
      [this.inputToName, this.inputFromName, this.selectOccasion, this.inputNickname].forEach(inp => {
        if (inp) inp.addEventListener('input', () => this.updateGeneratedLink());
      });

      // Copy Link in Share Tab
      if (this.copyLinkBtn) {
        this.copyLinkBtn.addEventListener('click', () => {
          this.updateGeneratedLink();
          if (this.generatedLinkEl) {
            this.generatedLinkEl.select();
            navigator.clipboard.writeText(this.generatedLinkEl.value).then(() => {
              this.showToast('📋 Custom Shareable Link copied to clipboard! ✨');
            }).catch(() => {
              document.execCommand('copy');
              this.showToast('📋 Link Copied!');
            });
          }
        });
      }

      // Open Link
      if (this.openLinkBtn) {
        this.openLinkBtn.addEventListener('click', () => {
          this.updateGeneratedLink();
          if (this.generatedLinkEl?.value) {
            window.open(this.generatedLinkEl.value, '_blank');
          }
        });
      }

      // Save General Changes Button
      if (this.saveBtn) {
        this.saveBtn.addEventListener('click', () => {
          const newCfg = {
            recipientName: this.inputToName?.value.trim() || 'Misty',
            senderName: this.inputFromName?.value.trim() || 'Yuvi',
            nickname: this.inputNickname?.value.trim() || 'Babu Shona',
            occasion: this.selectOccasion?.value || 'birthday',
            customWish: this.inputCustomWish?.value.trim() || 'to us and a love that blooms',
            spokenVoice: this.toggleVoice?.checked !== false,
            spokenWishText: this.inputVoiceText?.value.trim() || '',
            letterText: this.inputLetterText?.value.trim() || this.config.letterText,
            upiId: this.inputUpiId?.value.trim() || 'baby8389@nyes',
            amount: parseInt(this.inputAmount?.value, 10) || 143,
            instaId: this.inputInstaId?.value.trim() || 'tim_aary',
          };
          this.saveConfig(newCfg);
          this.showToast('💾 All Changes Applied Live to the Portal! 🎉✨');
          if (window.soundFX) window.soundFX.chime(1.5);
        });
      }

      // Reset to Default Button
      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => {
          if (confirm('Kya aap sab kuch wapas default (Yuvi & Misty) par reset karna chahte hain?')) {
            localStorage.removeItem('yuvi_admin_config');
            this.config = { ...DEFAULT_CONFIG };
            this.saveConfig(this.config);
            this.activateProfile('misty');
            this.showToast('🔄 Reset done! Portal is now set back to default Yuvi & Misty.');
          }
        });
      }

      // Logout Button
      if (this.logoutBtn) {
        this.logoutBtn.addEventListener('click', () => {
          sessionStorage.removeItem('yuvi_admin_authed');
          sessionStorage.removeItem('yuvi_current_admin');
          this.closeDashboard();
          this.showToast('🔒 Admin session logged out.');
        });
      }

      // 8 Photo upload and URL bindings
      this.bindPhotoInput(this.uploadBg, this.urlBg, 'bgTheme');
      this.bindPhotoInput(this.uploadPortrait, this.urlPortrait, 'mainPortrait');
      this.bindPhotoInput(this.uploadPuzzle, this.urlPuzzle, 'puzzlePhoto');
      this.bindPhotoInput(this.uploadHug, this.urlHug, 'liveHug');
      this.bindPhotoInput(this.uploadGiftDress, this.urlGiftDress, 'giftDress');
      this.bindPhotoInput(this.uploadGiftThar, this.urlGiftThar, 'giftThar');
      this.bindPhotoInput(this.uploadGiftPs5, this.urlGiftPs5, 'giftPs5');
      this.bindPhotoInput(this.uploadPaymentQr, this.urlPaymentQr, 'paymentQr');

      // Mission Master Controls
      if (this.unlockAllBtn) {
        this.unlockAllBtn.addEventListener('click', () => {
          if (window.journey) {
            window.journey.unlockAll();
            this.showToast('🔓 ALL Missions, Stages & Gifts UNLOCKED! You can explore freely! 🚀');
            if (window.soundFX) window.soundFX.victoryFanfare?.();
          }
        });
      }

      if (this.resetProgressBtn) {
        this.resetProgressBtn.addEventListener('click', () => {
          if (window.journey) {
            window.journey.resetProgress();
            this.showToast('🔒 Journey reset! All stages locked back to Step 1.');
          }
        });
      }

      // Jump Buttons
      document.querySelectorAll('.admin-jump-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.jump;
          this.closeDashboard();
          this.jumpTo(target);
        });
      });

      // YouTube Music Manager Handlers
      if (this.adminAddSongBtn) {
        this.adminAddSongBtn.addEventListener('click', () => this.handleAddSong());
      }
      if (this.adminTestSongBtn) {
        this.adminTestSongBtn.addEventListener('click', () => this.handleTestSnippet());
      }
      if (this.adminStopTestBtn) {
        this.adminStopTestBtn.addEventListener('click', () => this.handleStopSnippet());
      }

      // Multi-Admin Manager Handlers
      if (this.createAdminBtn) {
        this.createAdminBtn.addEventListener('click', () => this.handleCreateAdmin());
      }

      // Tab switcher in Dashboard
      document.querySelectorAll('.atab-btn').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
          document.querySelectorAll('.atab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.atab-panel').forEach(p => p.classList.remove('active'));

          tabBtn.classList.add('active');
          const panelId = tabBtn.dataset.panel;
          const targetPanel = document.getElementById(panelId);
          if (targetPanel) targetPanel.classList.add('active');

          if (panelId === 'panelProfiles') this.renderProfilesList();
          if (panelId === 'panelMusic') this.renderPlaylistList();
          if (panelId === 'panelAdmins') this.renderAdminsList();
        });
      });
    }

    // ==========================================
    // PHOTO & MEDIA CONTROLS (8 PHOTOS)
    // ==========================================
    bindPhotoInput(fileInputEl, urlInputEl, photoKey) {
      if (fileInputEl) {
        fileInputEl.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const dataUrl = evt.target.result;
              this.applyCustomPhoto(photoKey, dataUrl);
            };
            reader.readAsDataURL(file);
          }
        });
      }

      if (urlInputEl) {
        urlInputEl.addEventListener('change', () => {
          const url = urlInputEl.value.trim();
          if (url) {
            this.applyCustomPhoto(photoKey, url);
          }
        });
      }
    }

    applyCustomPhoto(photoKey, src) {
      if (!this.config.customPhotos) this.config.customPhotos = {};
      this.config.customPhotos[photoKey] = src;
      this.saveConfig(this.config);

      // Save to active profile too
      const profiles = getStoredProfiles();
      const curId = this.activeProfileId || 'misty';
      if (profiles[curId]) {
        if (!profiles[curId].customPhotos) profiles[curId].customPhotos = {};
        profiles[curId].customPhotos[photoKey] = src;
        saveProfiles(profiles);
      }

      this.showToast(`📸 Custom ${photoKey} updated successfully! ✨`);
    }

    // ==========================================
    // MULTI-ADMIN CREATION & MANAGEMENT
    // ==========================================
    handleCreateAdmin() {
      const name = (this.newAdminName?.value || '').trim();
      const user = (this.newAdminUser?.value || '').trim().toLowerCase();
      const pass = (this.newAdminPass?.value || '').trim();

      const showMsg = (text, isErr) => {
        if (!this.amcStatusMsg) return;
        this.amcStatusMsg.innerHTML = text;
        this.amcStatusMsg.className = isErr ? 'amc-status-msg error' : 'amc-status-msg success';
        this.amcStatusMsg.style.display = 'block';
      };

      if (!name || !user || !pass) {
        showMsg('⚠️ Kripya Name, Username aur Password teeno daalein!', true);
        return;
      }

      if (user === 'yuvi' || user === 'master') {
        showMsg('⚠️ "yuvi" username Master Admin ke liye reserved hai! Koi doosra username chunein.', true);
        return;
      }

      if (pass.length < 4) {
        showMsg('⚠️ Password kam se kam 4 characters ka hona chahiye!', true);
        return;
      }

      const existing = getStoredSubAdmins();
      if (existing.some(a => a.username === user)) {
        showMsg(`⚠️ Username "@${user}" pehle se bana hua hai! Doosra username chunein.`, true);
        return;
      }

      const newAdmin = {
        id: 'admin_' + Date.now(),
        name: name,
        username: user,
        password: pass,
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        createdBy: this.currentAdmin?.name || 'Yuvi'
      };

      existing.push(newAdmin);
      saveSubAdmins(existing);

      if (this.newAdminName) this.newAdminName.value = '';
      if (this.newAdminUser) this.newAdminUser.value = '';
      if (this.newAdminPass) this.newAdminPass.value = '';

      showMsg(`🎉 New Admin <strong>${name}</strong> (@${user}) create ho gaya! Wo bhi ab apna password daal kar portal control kar sakte hain.`, false);
      this.renderAdminsList();
      this.showToast(`👑 Admin account created for ${name}!`);
      if (window.soundFX) window.soundFX.chime(1.4);
    }

    handleDeleteAdmin(adminId) {
      if (!confirm('Kya aap sach me is admin ko remove karna chahte hain?')) return;
      let admins = getStoredSubAdmins();
      admins = admins.filter(a => a.id !== adminId);
      saveSubAdmins(admins);
      this.renderAdminsList();
      this.showToast('🗑️ Admin account removed.');
    }

    renderAdminsList() {
      if (!this.adminUsersContainer) return;
      const subAdmins = getStoredSubAdmins();

      let html = `
        <div class="admin-user-card master-card">
          <div class="auc-info">
            <span class="auc-avatar">👑</span>
            <div>
              <div class="auc-name">Yuvi <span class="auc-badge master-badge">Master Owner 🛡️</span></div>
              <div class="auc-meta">Username: <strong>@yuvi</strong> | Role: Master Admin (Permanent Access)</div>
            </div>
          </div>
          <div class="auc-action">
            <span class="auc-fixed-tag">Owner Key Protected</span>
          </div>
        </div>
      `;

      if (subAdmins.length === 0) {
        html += `
          <div class="auc-empty-msg">
            Abhi koi doosra admin nahi banaya gaya hai. Upar diye gaye form se naye admins add kar sakte hain!
          </div>
        `;
      } else {
        subAdmins.forEach(sub => {
          html += `
            <div class="admin-user-card sub-card">
              <div class="auc-info">
                <span class="auc-avatar">👤</span>
                <div>
                  <div class="auc-name">${sub.name} <span class="auc-badge sub-badge">Full Admin ⚡</span></div>
                  <div class="auc-meta">Username: <strong>@${sub.username}</strong> | Created: ${sub.createdAt} by ${sub.createdBy}</div>
                </div>
              </div>
              <div class="auc-action">
                <button type="button" class="auc-delete-btn" data-del="${sub.id}">🗑️ Remove</button>
              </div>
            </div>
          `;
        });
      }

      this.adminUsersContainer.innerHTML = html;

      this.adminUsersContainer.querySelectorAll('.auc-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.del;
          this.handleDeleteAdmin(id);
        });
      });
    }

    // ==========================================
    // YOUTUBE MUSIC & SNIPPET HOOK ENGINE
    // ==========================================
    handleAddSong() {
      const url = (this.adminYtUrl?.value || '').trim();
      const title = (this.adminYtTitle?.value || '').trim();
      const artist = (this.adminYtArtist?.value || '').trim();
      const start = parseTimeToSeconds(this.adminYtStart?.value, 30);
      const end = parseTimeToSeconds(this.adminYtEnd?.value, 80);

      const showMsg = (text, isErr) => {
        if (!this.macStatusMsg) return;
        this.macStatusMsg.innerHTML = text;
        this.macStatusMsg.className = isErr ? 'mac-status-msg error' : 'mac-status-msg success';
        this.macStatusMsg.style.display = 'block';
      };

      if (!url) {
        showMsg('⚠️ Kripya YouTube Song ka link daalein!', true);
        return;
      }

      const videoId = extractYouTubeId(url);
      if (!videoId) {
        showMsg('⚠️ Sahi YouTube URL daalein! (e.g. https://www.youtube.com/watch?v=... ya https://youtu.be/...)', true);
        return;
      }

      if (end <= start) {
        showMsg('⚠️ Snippet End Time, Start Time se bada hona chahiye!', true);
        return;
      }

      const songData = {
        title: title || 'Romantic Song ❤️',
        artist: artist || 'YouTube Special',
        youtubeId: videoId,
        startTime: start,
        endTime: end
      };

      if (window.RomanticPlayer?.addCustomSong) {
        window.RomanticPlayer.addCustomSong(songData);
        showMsg(`🎉 Song <strong>"${songData.title}"</strong> successfully playlist mein add ho gaya! (Snippet Hook: ${start}s se ${end}s)`, false);
        if (this.adminYtUrl) this.adminYtUrl.value = '';
        if (this.adminYtTitle) this.adminYtTitle.value = '';
        if (this.adminYtArtist) this.adminYtArtist.value = '';
        this.renderPlaylistList();
        this.showToast(`🎵 Romantic YouTube song added to portal!`);
        if (window.soundFX) window.soundFX.chime(1.4);
      }
    }

    handleTestSnippet() {
      const url = (this.adminYtUrl?.value || '').trim();
      const start = parseTimeToSeconds(this.adminYtStart?.value, 30);
      const end = parseTimeToSeconds(this.adminYtEnd?.value, 80);

      const showMsg = (text, isErr) => {
        if (!this.macStatusMsg) return;
        this.macStatusMsg.innerHTML = text;
        this.macStatusMsg.className = isErr ? 'mac-status-msg error' : 'mac-status-msg success';
        this.macStatusMsg.style.display = 'block';
      };

      const videoId = extractYouTubeId(url);
      if (!videoId) {
        showMsg('⚠️ Preview sunne ke liye pehle sahi YouTube URL daalein!', true);
        return;
      }

      if (window.RomanticPlayer?.testSnippet) {
        window.RomanticPlayer.testSnippet(videoId, start, end);
        showMsg(`🎶 Testing snippet hook from <strong>${start}s</strong> to <strong>${end}s</strong>... Main point check karein!`, false);
        if (this.adminStopTestBtn) this.adminStopTestBtn.style.display = 'inline-block';
      }
    }

    handleStopSnippet() {
      if (window.RomanticPlayer?.stopSnippetTest) {
        window.RomanticPlayer.stopSnippetTest();
        if (this.adminStopTestBtn) this.adminStopTestBtn.style.display = 'none';
        if (this.macStatusMsg) {
          this.macStatusMsg.innerHTML = '⏹️ Snippet preview stopped.';
          this.macStatusMsg.className = 'mac-status-msg';
        }
      }
    }

    renderPlaylistList() {
      if (!this.adminPlaylistContainer || !window.RomanticPlayer) return;
      const playlist = window.RomanticPlayer.getPlaylist();
      const currentIdx = window.RomanticPlayer.getCurrentIndex();

      let html = '';
      playlist.forEach((song, idx) => {
        const isCurrent = (idx === currentIdx);
        const isYouTube = (song.type === 'youtube');
        const badgeClass = isYouTube ? 'badge-yt' : 'badge-local';
        const badgeLabel = isYouTube ? 'YouTube 🔴' : 'Built-in 🎶';

        html += `
          <div class="playlist-item-card ${isCurrent ? 'is-playing' : ''}">
            <div class="pic-info">
              <span class="pic-num">${idx + 1}.</span>
              <div class="pic-details">
                <div class="pic-title">
                  ${song.title} <span class="pic-badge ${badgeClass}">${badgeLabel}</span>
                </div>
                <div class="pic-meta">
                  ${song.artist} &bull; <span class="pic-hook-text">⏱️ Hook Snippet: ${song.startTime || 0}s ${song.endTime ? 'to ' + song.endTime + 's' : ''}</span>
                </div>
              </div>
            </div>
            <div class="pic-actions">
              <button type="button" class="pic-play-btn" data-playidx="${idx}">
                ${isCurrent ? '🔊 Playing' : '▶️ Play'}
              </button>
              ${isYouTube ? `<button type="button" class="pic-del-btn" data-delid="${song.id}">🗑️</button>` : ''}
            </div>
          </div>
        `;
      });

      this.adminPlaylistContainer.innerHTML = html;

      this.adminPlaylistContainer.querySelectorAll('.pic-play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.playidx, 10);
          if (window.RomanticPlayer?.playTrackByIdx) {
            window.RomanticPlayer.playTrackByIdx(idx);
            this.renderPlaylistList();
          }
        });
      });

      this.adminPlaylistContainer.querySelectorAll('.pic-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.delid;
          if (window.RomanticPlayer?.removeCustomSong) {
            window.RomanticPlayer.removeCustomSong(id);
            this.renderPlaylistList();
            this.showToast('🗑️ Song playlist se remove ho gaya.');
          }
        });
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
      const currentMasterPass = localStorage.getItem('yuvi_master_pass') || MASTER_PASSWORD;
      const valPass = (this.passInput?.value || '').trim();
      const valUser = (this.userInput?.value || '').trim().toLowerCase();

      let matchedAdmin = null;

      // 1. Check Master Admin Credentials
      if (valPass === currentMasterPass || valPass === MASTER_PASSWORD) {
        if (!valUser || valUser === 'yuvi' || valUser === 'master') {
          matchedAdmin = { name: 'Yuvi', username: 'yuvi', role: 'master' };
        }
      }

      // 2. Check Sub-Admins Credentials
      if (!matchedAdmin) {
        const subAdmins = getStoredSubAdmins();
        const found = subAdmins.find(sub => {
          if (valUser) {
            return sub.username.toLowerCase() === valUser && sub.password === valPass;
          }
          return sub.password === valPass;
        });
        if (found) {
          matchedAdmin = { name: found.name, username: found.username, role: 'admin' };
        }
      }

      if (matchedAdmin) {
        this.currentAdmin = matchedAdmin;
        sessionStorage.setItem('yuvi_admin_authed', 'true');
        sessionStorage.setItem('yuvi_current_admin', JSON.stringify(matchedAdmin));

        this.closeAuthModal();
        this.openDashboard();
        this.showToast(`👑 Welcome ${matchedAdmin.name}! Full Admin Access Unlocked! 🚀`);
        if (window.soundFX) window.soundFX.victoryFanfare?.();
      } else {
        if (this.authError) {
          this.authError.textContent = '❌ Incorrect password or username! Only authorized admins can access.';
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

      // Security Answers
      const q1Match = (a1 === 'mbs');
      const q2Match = (a2 === 'money');

      if (q1Match && q2Match) {
        const newPass = (this.secNewPass?.value || '').trim() || MASTER_PASSWORD;
        localStorage.setItem('yuvi_master_pass', newPass);
        this.currentAdmin = { name: 'Yuvi', username: 'yuvi', role: 'master' };
        sessionStorage.setItem('yuvi_admin_authed', 'true');
        sessionStorage.setItem('yuvi_current_admin', JSON.stringify(this.currentAdmin));

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
      if (this.userInput) this.userInput.value = '';
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

      if (this.dashBadge) {
        const isMaster = this.currentAdmin?.role === 'master';
        this.dashBadge.innerHTML = isMaster
          ? '👑 YUVI MASTER CONTROL (FULL ACCESS)'
          : `⚡ ${this.currentAdmin?.name.toUpperCase()} ADMIN CONTROL (FULL ACCESS)`;
      }

      this.renderProfilesList();
      this.renderPlaylistList();
      this.renderAdminsList();

      const activeP = getStoredProfiles()[this.activeProfileId || 'misty'];
      if (activeP && this.profShareLinkInput) {
        this.profShareLinkInput.value = this.generateProfileUrl(activeP);
      }

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
      const p = new URLSearchParams(window.location.search);
      if (p.get('open_admin') === 'true') {
        window.adminManager.openDashboard();
        const tab = p.get('tab');
        if (tab) {
          const tabBtn = document.querySelector(`.atab-btn[data-panel="${tab}"]`);
          if (tabBtn) tabBtn.click();
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }
})();