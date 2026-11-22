// Misty's Romantic 3-Mission Arcade Trilogy:
// Mission 1: 🚗 Love Sports Car (50 Heart Coins 💖)
// Mission 2: 🚙 Mahindra Thar 4x4 Off-Road (50 Thar Badges 🌟)
// Mission 3: 👩‍❤️‍👨 Misty & Yuvi Couple Adventure (50 Love Stars 💖 to reach Yuvi!)

const YUVI_QUESTIONS = [
  {
    q: "Misty baby, mere paas aakar kaisa laga? Sach batana... pura din kitna miss kiya apne Yuvi ko? 🥺❤️",
    yes: "Bohot zyada miss kiya apne Yuvi ko! 🥰❤️",
    no: "Thoda sa bhi nahi! 🙈",
    tease: "Jhooth mat bolo meri jaan! 😜"
  },
  {
    q: "Yuvi tumhara sabse pyara, loyal aur favorite boyfriend hai na pure universe mein? 💍💖",
    yes: "YES! Sirf Yuvi mera favorite hai! 👑",
    no: "Soch ke bataungi! 😜",
    tease: "No pe click ho hi nahi sakta! 😂"
  },
  {
    q: "Mummy, Papa aur Bhai se bachkar mere paas aayi ho, itna pyaar kab se karne lagi mujhse? 🥰💋",
    yes: "Hamesha se sirf tumse pyaar karti hu! 💖✨",
    no: "Main to raste mein bhatak gayi thi! 🙈",
    tease: "Pakad liya babu! Jhooth nahi! 😜"
  },
  {
    q: "Kya tum promise karti ho ki hum dono hamesha ek dusre ke sath aise hi khush rahenge aur hamesha meri rahogi? 🤝💍",
    yes: "PROMISE! Hamesha sirf tumhari rahungi! ♾️🔐❤️",
    no: "Pakad ke dikhao! 😜",
    tease: "Pakad ke dikhao madam ji! 🙈"
  },
  {
    q: "Acha ek sweet si kissi do aur batao, I love you sabse zyada kaun karta hai? 😘💖",
    yes: "Mera Yuvi sabse zyada pyaar karta hai! 💋🥰",
    no: "Main nahi bataungi! 🙈",
    tease: "Bas Yes bolo babu! 😘"
  }
];

// Randomized Family Obstacle Excuses (Bahane) for Mode 3 Dodge (Expanded 20+ Hilarious Excuses)
const PAPA_BAHANE = [
  "Newspaper kahan hai?! 🗞️",
  "Sharma ji dekh rahe hain! 👓",
  "Kahan chali akele?! 🧐",
  "Dhoop mein kahan jaa rahi?! 🕶️",
  "Dahi leke aana jaldi! 🥦",
  "Mobile band karo pehle! 📱",
  "Bike pe kaun tha?! 🚴‍♂️",
  "Itni saj-dhaj ke kahan?! 🎀",
  "Sabzi mandi kaun jayega?! 🥬",
  "Padhai ho gayi poori?! 📚",
  "Meter reading check ki tune?! ⚡",
  "Bank ka chalan kaun bharega?! 🏦",
  "Itna muskura kyun rahi ho?! 🧐",
  "Dukan se bread leke aao! 🍞",
  "Bike ki chabi kahan rakhi?! 🔑",
  "Sharma ji ke ladke ko dekho! 👨‍💼"
];

const MUMMY_BAHANE = [
  "Roti kaun banayega?! 🥖",
  "Itna ready kiske liye?! 💄",
  "Phone niche rakh abhi! 📲",
  "Chakkar kiske sath hai?! 🌸",
  "Papa ko bataungi sab! 🧕",
  "Babu shona se milne?! 🙈",
  "Ghar pe mehmaan hain! ☕",
  "Almirah saaf ki tune?! 👗",
  "Doodh ubal raha hai! 🥛",
  "Itni der kahan thi?! ⌚",
  "Karele ki sabzi banayi hai! 🥒",
  "Aankhon mein kajal kiske liye?! 👁️",
  "Dupatta kahan gaya tera?! 🧕",
  "Mausi ji ka phone aaya tha! 📞",
  "Shaam ko jaldi ghar aana! ⏰",
  "Subah se phone pe lagi hai! 📱"
];

const BHAI_BAHANE = [
  "Photo le li maine! 📸",
  "Video bana li live! 🎥",
  "Jiju se milne chali na?! 🛵",
  "500 rupaye de chup rahunga! 💵",
  "Main peeche aa raha hoon! 🚲",
  "Chat padh li maine sab! 😂",
  "Jiju se PS5 dila pehle! 🎮",
  "Mummy ko bata doon kya?! 😈",
  "Dairy Milk Silk de tabhi jaana! 🍫",
  "Secret outing pakdi gayi! 🕵️‍♂️",
  "Jiju ki bike ki drive chahiye! 🏍️",
  "Momos khila tabhi rasta dunga! 🥟",
  "Instagram screenshot le liya! 📱",
  "Papa ko abhi call mila raha hoon! 📞",
  "Treat de pehle tab jaane dunga! 🍕",
  "Story pe mention kar mujhe! 🤳"
];

const GAME_MODES = {
  1: {
    id: 1,
    name: "Love Car",
    itemName: "Coins",
    itemEmoji: "💖",
    get vehicleName() {
      const g = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      return `${g}'s Sports Car`;
    },
    set vehicleName(v) {},
    roadBg: ["#fff0f5", "#ffe4ee", "#ffd6e7"],
    roadColor: "#ffffff",
    borderGlow: "#ff4d88",
    target: 50,
    milestones: [
      { at: 5, tag: "🌸 MISTY MY BABE 💖", photo: "./images/misty1.jpg", msg: "Misty my babe, meri girlfriend! You drive so adorably! Yuvi loves you so much! 🚗💖" },
      { at: 10, tag: "🥰 MERI GIRLFRIEND 🐱", photo: "./images/misty2.jpg", msg: "Meri girlfriend, mera babu shona! Har pal sirf tumhara khayal rehta hai! 🌸🥰" },
      { at: 15, tag: "👑 QUEEN OF MY HEART 👑", photo: "./images/misty3.jpg", msg: "Pure universe mein sabse pyari aur khubsurat ladki tum ho meri princess! 💖✨" },
      { at: 20, tag: "💋 I LOVE YOU MERI JAAN 💫", photo: "./images/misty4.jpg", msg: "Mera dil, meri jaan! Har ek coin ke sath tum mere dil ke aur paas aa rahi ho! 💖" },
      { at: 25, tag: "🎉 HALFWAY THERE BABU! 🔥", photo: "./images/misty5.jpg", msg: "25 Coins complete! You are driving like a true champion queen! 👑🚀" },
      { at: 30, tag: "🥺 MERI PYARI SWEETHEART 🌹", photo: "./images/misty6.jpg", msg: "Aapki innocent smile dekh ke Yuvi ka dil pighal jata hai babu! 🥺🌹" },
      { at: 35, tag: "🌙 MERI PURA DUNIYA 🌙", photo: "./images/misty7.jpg", msg: "Mera babu shona, meri world, my love... Yuvi sirf aur sirf aapka hai! 🐱💖" },
      { at: 40, tag: "🚀 BAS THODA AUR BABU! 🏰", photo: "./images/misty8.jpg", msg: "Super close my love! 40 Coins collected! Yuvi baahein failaye wait kar raha hai! 💫" },
      { at: 45, tag: "👩‍❤️‍💋‍👨 FINAL STRETCH MERI RANI! 🌹", photo: "./images/misty9.jpg", msg: "Almost at the finish line! Yuvi red rose leke aapke saamne khada hai babu! 🏰💖" }
    ],
    winTitle: "MISSION 1 COMPLETED! 🌸💖",
    winMsg: "Misty my babe, meri girlfriend! You collected all 50 Heart Coins and drove straight into my heart! 🚗💨❤️",
    nextBtnText: "➡️ Next Mission: Drive Thar 4x4! 🚙",
    nextMode: 2
  },
  2: {
    id: 2,
    name: "Thar 4x4",
    itemName: "Badges",
    itemEmoji: "🌟",
    vehicleName: "Mahindra Thar 4x4",
    roadBg: ["#e0f7fa", "#b2ebf2", "#80deea"],
    roadColor: "#f4ede2",
    borderGlow: "#ff8c42",
    target: 50,
    milestones: [
      { at: 5, tag: "🚙 THAR 4x4 BEAST MODE 🏔️", photo: "./images/misty7.jpg", msg: "Mera babu shona driving the big Thar 4x4! Queen vibes only! 🚙👑" },
      { at: 10, tag: "💖 MY MOUNTAIN QUEEN 🌸", photo: "./images/misty8.jpg", msg: "Misty my babe, pahadon mein aapke sath road trips karenge! 🌄💖" },
      { at: 15, tag: "👑 QUEEN MISTY ON TOP 🏔️", photo: "./images/misty1.jpg", msg: "Mera babu shona, meri world! Driving this beast like an absolute queen! 🚙👑✨" },
      { at: 20, tag: "🥰 MY ADORABLE BABU 🐾", photo: "./images/misty2.jpg", msg: "Meri sweet girlfriend, aapke sath har safar khoobsurat hai babu! 🥰✨" },
      { at: 25, tag: "🔥 25 BADGES CRUSHED! 🚀", photo: "./images/misty3.jpg", msg: "Halfway through the rugged trails! Misty is totally unstoppable! 🚙💨" },
      { at: 30, tag: "🌹 MY FOREVER LOVE 🌹", photo: "./images/misty4.jpg", msg: "Mera dil, meri jaan! Aap jaisi pyari ladki puri duniya mein nahi hai! 💖" },
      { at: 35, tag: "🌅 SUNSET ROMANCE 🌄", photo: "./images/misty5.jpg", msg: "Meri sweet angel, my love... Real life mountain road trips with you very soon! 🌄💖💋" },
      { at: 40, tag: "💫 ALMOST THERE PRINCESS 💫", photo: "./images/misty6.jpg", msg: "40 Badges done! Thar 4x4 complete hote hi Couple Game unlock hoga! 🚙🎉" },
      { at: 45, tag: "🏰 VICTORY IS WAITING! 👑", photo: "./images/misty9.jpg", msg: "Final 5 badges meri jaan! Get ready to meet Yuvi with the red rose! 🌹🏰" }
    ],
    winTitle: "THAR 4x4 EXPEDITION COMPLETED! 🚙🏔️",
    winMsg: "Mera babu shona, meri world! You conquered the rugged mountain trails in your dream Mahindra Thar 4x4! 🚙👑✨",
    get nextBtnText() {
      const g = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const b = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
      return `➡️ Next Mission: ${g} & ${b} Couple Game! 👩‍❤️‍👨`;
    },
    set nextBtnText(v) {},
    nextMode: 3
  },
  3: {
    id: 3,
    get name() {
      const g = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const b = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
      return `${g} & ${b}`;
    },
    set name(v) {},
    itemName: "Love Stars",
    itemEmoji: "⭐",
    get vehicleName() {
      const g = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      return `Queen ${g}`;
    },
    set vehicleName(v) {},
    roadBg: ["#fff5f8", "#ffe6f1", "#ffd6e7"],
    roadColor: "#ffffff",
    borderGlow: "#ff2a70",
    target: 50,
    milestones: [
      { at: 5, tag: "🌸 MISTY ON THE LOVE PATH 💖", photo: "./images/misty1.jpg", msg: "Misty my babe! Mummy, Papa aur Bhai se bach ke aage aao meri jaan! 👩‍❤️‍👨" },
      { at: 10, tag: "🥰 MERI CUTE GIRLFRIEND 🐱", photo: "./images/misty2.jpg", msg: "Mera babu shona, Yuvi samne red rose leke khada aapka wait kar raha hai! 🌹" },
      { at: 15, tag: "🌸 ROSE GARDEN CHECKPOINT! 💖", photo: "./images/misty3.jpg", msg: "15 Stars secured! Checkpoint saved! Aage aate jao meri jaan! 💖" },
      { at: 20, tag: "👑 QUEEN OF MY HEART 👑", photo: "./images/misty4.jpg", msg: "Pure universe mein sabse pyari aur khubsurat girlfriend ho tum! 💖✨" },
      { at: 25, tag: "💋 HALFWAY TO YUVI 💫", photo: "./images/misty5.jpg", msg: "25 Stars done! Yuvi ki baahein bas thodi dur hain meri jaan! 👩‍❤️‍💋‍👨" },
      { at: 30, tag: "🌙 STARLIGHT BRIDGE CHECKPOINT! ✨", photo: "./images/misty6.jpg", msg: "Mera babu shona, meri world! Tum kitni pyari ho! You're almost in Yuvi's arms! ✨🥰" },
      { at: 35, tag: "🥺 MERI PYARI SWEETHEART 🌹", photo: "./images/misty7.jpg", msg: "Mera dil, meri jaan, mera babu shona... har kadam pe Yuvi aapka hai! 🌹" },
      { at: 40, tag: "🚀 40 STARS REACHED! 🏰", photo: "./images/misty8.jpg", msg: "Bas 10 stars aur babu! Yuvi gazebo mein rose liye muskura raha hai! 🏰✨" },
      { at: 45, tag: "🏰 YUVI'S PALACE GATE! 🌹", photo: "./images/misty9.jpg", msg: "Queen Misty! Only 5 stars left! Yuvi samne khada hai red rose liye huye! 🌹🏰❤️" }
    ],
    get winTitle() {
      const g = (window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty').toUpperCase();
      const b = (window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi').toUpperCase();
      return `${b} & ${g} REUNITED! 👩‍❤️‍💋‍👨💖`;
    },
    set winTitle(v) {},
    get winMsg() {
      const g = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const b = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
      return `${g} my babe, meri girlfriend, meri world, mera babu shona, my love... You crossed every obstacle, collected all 50 love stars, and finally reached ${b}'s arms! 🏰❤️💋`;
    },
    set winMsg(v) {},
    nextBtnText: "🎁 Claim Grand Gifts (PS5 + GTA 6 & Your Yuvi!) ✨",
    nextMode: null
  }
};

class LoveCarGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.modal = document.getElementById('gameModal');
    
    // HUD
    this.coinCountEl = document.getElementById('gameCoinCount');
    this.hudItemLabel = document.getElementById('hudItemLabel');
    this.missionNameEl = document.getElementById('gameMissionName');
    this.speedEl = document.getElementById('gameSpeed');
    
    // Win Modal elements
    this.winModal = document.getElementById('missionWinModal');
    this.winTitle = document.getElementById('winTitle');
    this.winLoveWords = document.getElementById('winLoveWords');
    this.winNextMissionBtn = document.getElementById('winNextMissionBtn');
    this.claimGiftsBtn = document.getElementById('claimGiftsBtn');
    this.winFxContainer = document.getElementById('winFxContainer');

    // Special Yuvi & Misty Reunion Elements
    this.yuviModal = document.getElementById('yuviReunionModal');
    this.yuviQuestionText = document.getElementById('yuviQuestionText');
    this.btnYuviYes = document.getElementById('btnYuviYes');
    this.btnYuviNo = document.getElementById('btnYuviNo');
    this.btnYuviNoWrap = document.getElementById('btnYuviNoWrap');
    this.yuviTeaseBubble = document.getElementById('yuviTeaseBubble');
    this.yuviDialogueBox = document.getElementById('yuviDialogueBox');
    this.yuviActionsRow = document.getElementById('yuviActionsRow');
    this.claimYuviGiftsBtn = document.getElementById('claimYuviGiftsBtn');
    this.currentYuviQIndex = 0;

    // Obstacles, Checkpoints & Reunion
    this.obstacles = [];
    this.lastCheckpointCoins = 0;
    this.lastCheckpointName = "Start of Love Path";
    this.invincibleTimer = 0;
    this.animTimer = 0;
    this.yuviReunionActive = false;
    this.yuviGazeboY = -220;
    this.yuviHugged = false;

    // Milestone elements
    this.milestoneToast = document.getElementById('missionMilestoneToast');
    this.milestonePhotoImg = document.getElementById('milestonePhotoImg');
    this.milestoneTag = document.getElementById('milestoneTag');
    this.milestoneMsg = document.getElementById('milestoneMsg');
    this.milestoneNext = document.getElementById('milestoneNext');
    this.milestoneTimer = null;

    // Misty Care Collision Popup Elements
    this.mistyCareModal = document.getElementById('mistyCareModal');
    this.careOkBtn = document.getElementById('careOkBtn');
    this.careModalText = document.getElementById('careModalText');
    this.isPausedForCare = false;

    // Nitro Booster with Kiss Yuvi Recharge
    this.nitroKissModal = document.getElementById('nitroKissModal');
    this.closeNitroBtn = document.getElementById('closeNitroBtn');
    this.nitroBackdrop = document.getElementById('nitroBackdrop');
    this.btnNitroFlyingKiss = document.getElementById('btnNitroFlyingKiss');
    this.btnNitroSweetKiss = document.getElementById('btnNitroSweetKiss');
    this.btnNitroHugKiss = document.getElementById('btnNitroHugKiss');
    this.btnBoost = document.getElementById('btnBoost');

    this.nitroCharges = 1;
    this.isBoosting = false;
    this.boostDuration = 0;
    this.maxBoostDuration = 5.5; // 5.5s of Super Rocket Nitro Booster!

    // Start strictly with Mode 1: Love Car! Step-by-step unlock progression!
    this.currentMode = 1;
    this.unlockedGameModes = new Set([1]);
    this.isRunning = false;
    this.rafId = 0;

    this.car = {
      x: 0,
      y: 0,
      w: 48,
      h: 88,
      speed: 4.8,
      maxSpeed: 6.8,
      baseSpeed: 4.8,
      steer: 0,
      tilt: 0
    };

    this.keys = { left: false, right: false, up: false, down: false };
    this.coins = [];
    this.particles = [];
    this.sideItems = [];
    this.roadMarks = [];

    this.coinsCollected = 0;
    this.targetCoins = 50;
    this.completedMilestones = new Set();

    this.bindControls();
    this.bindTabs();
    this.updateTabUI();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  getModeData(mode = this.currentMode) {
    const raw = GAME_MODES[mode];
    if (!raw) return null;
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const rep = (str) => {
      if (!str) return str;
      return str
        .replace(/Misty/g, girlName)
        .replace(/MISTY/g, girlName.toUpperCase())
        .replace(/Yuvi/g, boyName)
        .replace(/YUVI/g, boyName.toUpperCase());
    };
    return {
      ...raw,
      name: mode === 3 ? `${girlName} & ${boyName}` : (mode === 1 ? 'Love Car' : (mode === 2 ? 'Thar 4x4' : rep(raw.name))),
      vehicleName: mode === 3 ? `Queen ${girlName}` : (mode === 1 ? `${girlName}'s Sports Car` : (mode === 2 ? 'Mahindra Thar 4x4' : rep(raw.vehicleName))),
      winTitle: rep(raw.winTitle),
      winMsg: rep(raw.winMsg),
      nextBtnText: rep(raw.nextBtnText),
      milestones: (raw.milestones || []).map(m => ({
        ...m,
        tag: rep(m.tag),
        msg: rep(m.msg)
      }))
    };
  }

  onProfileChange(cfg) {
    this.updateTabUI();
    const modeData = this.getModeData(this.currentMode);
    if (this.missionNameEl && modeData) {
      this.missionNameEl.textContent = modeData.name;
    }
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const careTitleEl = document.querySelector('.care-title');
    if (careTitleEl) careTitleEl.textContent = `${girlName} babu dhyaan se aao! 🥰💋`;
    const roseLabel = document.querySelector('.rose-label');
    if (roseLabel) roseLabel.textContent = `${boyName} 🌹`;

    const isMisty = (!girlName || girlName.toLowerCase() === 'misty');
    let customPortrait = null;
    if (!isMisty) {
      const p = cfg?.customPhotos || {};
      const giftPhotos = (window.birthdayGifts?.photos || []).map(item => (typeof item === 'object' ? item.src : item));
      const pool = [
        p.mainPortrait, p.portrait,
        ...(Array.isArray(cfg?.albumPhotos) ? cfg.albumPhotos : []),
        ...giftPhotos,
        ...(Array.isArray(cfg?.puzzleImages) ? cfg.puzzleImages : []),
        p.puzzlePhoto, p.puzzle,
        p.liveHug, p.hug,
        p.bgTheme, p.bg
      ].filter(img => img && typeof img === 'string' && img.trim() && (img.startsWith('data:image') || (!img.includes('./images/misty') && !img.includes('yuvi_misty_theme_bg') && !img.includes('gift_dress') && !img.includes('favicon.png'))));

      customPortrait = pool[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
    }
    if (customPortrait) {
      if (this.milestonePhotoImg) this.milestonePhotoImg.src = customPortrait;
      document.querySelectorAll('.care-misty-img, .win-misty-img, #winMistyImg').forEach(el => el.src = customPortrait);
    }

    const rep = (str) => {
      if (!str) return str;
      return str
        .replace(/Misty/g, girlName)
        .replace(/MISTY/g, girlName.toUpperCase())
        .replace(/Yuvi/g, boyName)
        .replace(/YUVI/g, boyName.toUpperCase());
    };
    if (this.winTitle && modeData) this.winTitle.textContent = rep(modeData.winTitle);
    if (this.winLoveWords && modeData) this.winLoveWords.innerHTML = `"${rep(modeData.winMsg)}"`;
    if (this.winNextMissionBtn && modeData) this.winNextMissionBtn.textContent = rep(modeData.nextBtnText);
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.W = this.canvas.width = rect.width || 420;
    this.H = this.canvas.height = rect.height || 640;
    this.roadLeft = this.W * 0.15;
    this.roadRight = this.W * 0.85;
    this.roadWidth = this.roadRight - this.roadLeft;

    if (!this.isRunning) {
      this.car.x = this.W / 2;
      this.car.y = this.H - 120;
    }
  }

  bindTabs() {
    document.querySelectorAll('.mission-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = parseInt(btn.dataset.mission, 10);
        if (mode) this.switchMode(mode);
      });
    });

    document.getElementById('tabMissionPiano')?.addEventListener('click', () => {
      this.close();
      window.lovePiano?.open();
    });

    this.winNextMissionBtn?.addEventListener('click', () => {
      const modeData = this.getModeData(this.currentMode);
      if (modeData && modeData.nextMode) {
        this.switchMode(modeData.nextMode);
      } else {
        // Mode 3 complete, unlock Step 4 (Love Puzzle)!
        this.close();
        window.journey?.unlock('puzzle');
        window.lovePuzzle?.open();
      }
    });

    this.claimGiftsBtn?.addEventListener('click', () => {
      this.close();
      window.journey?.unlock('puzzle');
      window.lovePuzzle?.open();
    });

    this.claimYuviGiftsBtn?.addEventListener('click', () => {
      this.close();
      window.journey?.unlock('puzzle');
      window.lovePuzzle?.open();
    });

    this.bindYuviQuestions();
  }

  bindYuviQuestions() {
    this.btnYuviYes?.addEventListener('click', () => {
      if (window.soundFX) {
        window.soundFX.chime(1.3);
        window.soundFX.triumph();
      }
      this.spawnHeartConfetti();
      this.currentYuviQIndex++;
      if (this.currentYuviQIndex < YUVI_QUESTIONS.length) {
        this.loadYuviQuestion(this.currentYuviQIndex);
      } else {
        // All answered!
        window.journey?.unlock('puzzle');
        if (this.yuviDialogueBox) this.yuviDialogueBox.style.display = 'none';
        if (this.yuviActionsRow) this.yuviActionsRow.style.display = 'flex';
        this.spawnHeartBalloons();
        this.spawnFlyingKisses();
      }
    });

    const dodgeNo = () => {
      if (!this.btnYuviNo) return;
      if (window.soundFX) window.soundFX.boing();
      const arena = document.getElementById('yuviBtnArena');
      if (!arena) return;
      const aR = arena.getBoundingClientRect();
      const bR = this.btnYuviNo.getBoundingClientRect();
      const maxX = (aR.width - bR.width) * 0.45;
      const maxY = (aR.height - bR.height) * 0.45;
      const rx = (Math.random() * 2 - 1) * maxX;
      const ry = (Math.random() * 2 - 1) * maxY;
      const rot = (Math.random() - 0.5) * 20;
      this.btnYuviNo.style.transform = `translate(${rx}px, ${ry}px) rotate(${rot}deg)`;

      if (this.yuviTeaseBubble) {
        const curQ = YUVI_QUESTIONS[this.currentYuviQIndex];
        this.yuviTeaseBubble.textContent = curQ ? curQ.tease : "Jhooth mat bolo babu! 😜";
        this.yuviTeaseBubble.classList.add('is-shown');
        clearTimeout(this._yuviBubbleTimer);
        this._yuviBubbleTimer = setTimeout(() => {
          this.yuviTeaseBubble.classList.remove('is-shown');
        }, 1200);
      }
    };

    this.btnYuviNo?.addEventListener('mouseenter', dodgeNo);
    this.btnYuviNo?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeNo();
    });
    this.btnYuviNo?.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeNo();
    });
  }

  switchMode(mode) {
    if (!GAME_MODES[mode]) return;
    if (!this.unlockedGameModes.has(mode)) {
      if (window.soundFX) window.soundFX.boing();
      const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
      const msg = mode === 2 
        ? "🔒 Pehle Love Car (Mission 1) mein 50 Coins collect karo babu! 🚗💖" 
        : `🔒 Pehle Thar 4x4 (Mission 2) mein 50 Badges collect karo babu! Tabhi ${girlName} & ${boyName} Couple Game unlock hoga! 🚙💖`;
      this.showModeLockToast(msg);
      return;
    }
    this.currentMode = mode;
    this.updateTabUI();

    if (this.winModal) this.winModal.classList.remove('is-shown');
    if (this.yuviModal) this.yuviModal.classList.remove('is-shown');
    if (this.milestoneToast) this.milestoneToast.classList.remove('is-shown');

    // Update vehicle/character size and speeds by mode
    if (mode === 2) {
      // Thar 4x4
      this.car.w = 54;
      this.car.h = 92;
      this.car.baseSpeed = 4.8;
      this.car.speed = 4.8;
      this.car.maxSpeed = 6.8;
    } else if (mode === 3) {
      // Misty character
      this.car.w = 36;
      this.car.h = 64;
      this.car.baseSpeed = 4.2;
      this.car.speed = 4.2;
      this.car.maxSpeed = 6.2;
    } else {
      // Love Car
      this.car.w = 48;
      this.car.h = 88;
      this.car.baseSpeed = 4.8;
      this.car.speed = 4.8;
      this.car.maxSpeed = 6.8;
    }

    // Update HUD Mission Name immediately
    const modeData = this.getModeData(mode);
    if (this.missionNameEl && modeData) {
      this.missionNameEl.textContent = modeData.name;
    }

    // Directly start running the selected mission immediately!
    this.start();
  }

  updateTabUI() {
    const tab1 = document.getElementById('tabMission1');
    const tab2 = document.getElementById('tabMission2');
    const tab3 = document.getElementById('tabMission3');

    if (tab1) {
      tab1.innerHTML = '🚗 1. Love Car';
      tab1.classList.toggle('active', this.currentMode === 1);
      tab1.classList.remove('is-locked');
    }

    if (tab2) {
      const isUnlocked = this.unlockedGameModes.has(2);
      tab2.innerHTML = isUnlocked ? '🚙 2. Thar 4x4' : '🔒 2. Thar 4x4';
      tab2.classList.toggle('active', this.currentMode === 2);
      tab2.classList.toggle('is-locked', !isUnlocked);
    }

    if (tab3) {
      const isUnlocked = this.unlockedGameModes.has(3);
      const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
      tab3.innerHTML = isUnlocked ? `👩‍❤️‍👨 3. ${girlName} &amp; ${boyName}` : `🔒 3. ${girlName} &amp; ${boyName}`;
      tab3.classList.toggle('active', this.currentMode === 3);
      tab3.classList.toggle('is-locked', !isUnlocked);
    }
  }

  showModeLockToast(msg) {
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const isMisty = (!girlName || girlName.toLowerCase() === 'misty');
    let photo = './images/misty2.jpg';
    if (!isMisty) {
      const cfg = window.SiteConfig || {};
      photo = cfg.customPhotos?.mainPortrait || cfg.customPhotos?.portrait || (cfg.puzzleImages && cfg.puzzleImages[0]) || photo;
    }
    this.showMilestone({
      photo: photo,
      tag: '🔒 MISSION LOCKED! 💖',
      msg: msg
    });
  }

  showStartScreen() {
    this.start();
  }

  bindControls() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = true;
      if (e.code === 'Space') {
        e.preventDefault();
        this.handleBoostClick();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = false;
    });

    const bindBtn = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[key] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[key] = false; });
      el.addEventListener('mousedown', () => { this.keys[key] = true; });
      el.addEventListener('mouseup', () => { this.keys[key] = false; });
      el.addEventListener('mouseleave', () => { this.keys[key] = false; });
    };

    bindBtn('btnSteerLeft', 'left');
    bindBtn('btnSteerRight', 'right');

    // Interactive Boost button (both touch and click for instant response)
    this.btnBoost?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleBoostClick();
    }, { passive: false });
    this.btnBoost?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleBoostClick();
    });

    // Misty Care Collision Modal OK button
    this.careOkBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.resumeAfterCare();
    });

    // Nitro Kiss Recharge Modal controls
    this.closeNitroBtn?.addEventListener('click', () => this.closeNitroKissModal());
    this.nitroBackdrop?.addEventListener('click', () => this.closeNitroKissModal());
    this.btnNitroFlyingKiss?.addEventListener('click', () => this.giveNitroKiss('💋'));
    this.btnNitroSweetKiss?.addEventListener('click', () => this.giveNitroKiss('😘'));
    this.btnNitroHugKiss?.addEventListener('click', () => this.giveNitroKiss('👩‍❤️‍💋‍👨'));

    this.milestoneToast?.addEventListener('click', () => {
      this.milestoneToast.classList.remove('is-shown');
    });
  }

  open() {
    if (!this.modal) return;
    document.body.classList.add('modal-active');
    this.modal.classList.add('is-open');
    if (this.winModal) this.winModal.classList.remove('is-shown');
    if (this.yuviModal) this.yuviModal.classList.remove('is-shown');
    if (this.milestoneToast) this.milestoneToast.classList.remove('is-shown');

    // Update mission tabs UI and locked status
    this.updateTabUI();
    const modeData = this.getModeData(this.currentMode);
    if (this.missionNameEl && modeData) {
      this.missionNameEl.textContent = modeData.name;
    }
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const careTitleEl = document.querySelector('.care-title');
    if (careTitleEl) careTitleEl.textContent = `${girlName} babu dhyaan se aao! 🥰💋`;
    const roseLabel = document.querySelector('.rose-label');
    if (roseLabel) roseLabel.textContent = `${boyName} 🌹`;

    this.resize();
    this.start();
  }

  close() {
    if (!this.modal) return;
    document.body.classList.remove('modal-active');
    this.modal.classList.remove('is-open');
    if (this.winModal) this.winModal.classList.remove('is-shown');
    if (this.yuviModal) this.yuviModal.classList.remove('is-shown');
    if (this.milestoneToast) this.milestoneToast.classList.remove('is-shown');
    if (this.mistyCareModal) this.mistyCareModal.style.display = 'none';
    if (this.nitroKissModal) this.nitroKissModal.style.display = 'none';
    this.isPausedForCare = false;
    this.stop();
  }

  start() {
    this.stop();
    this.isRunning = true;
    this.coinsCollected = 0;
    this.targetCoins = 50;
    this.completedMilestones.clear();
    this.coins = [];
    this.obstacles = [];
    this.particles = [];
    this.sideItems = [];
    this.roadMarks = [];
    this.yuviReunionActive = false;
    this.yuviGazeboY = -220;
    this.yuviHugged = false;
    this.lastCheckpointCoins = 0;
    this.isPausedForCare = false;
    this.isBoosting = false;
    this.boostDuration = 0;
    this.nitroCharges = 1;
    this.updateBoostBtnUI();
    if (this.mistyCareModal) this.mistyCareModal.style.display = 'none';
    if (this.nitroKissModal) this.nitroKissModal.style.display = 'none';

    // Reset Journey Map Bar
    const runnerIcon = document.getElementById('runnerIcon');
    if (runnerIcon) {
      runnerIcon.textContent = this.currentMode === 3 ? "👧💖" : (this.currentMode === 2 ? "🚙💨" : "🚗💨");
    }
    const fillEl = document.getElementById('mapProgressFill');
    const pinEl = document.getElementById('mapRunnerPin');
    if (fillEl) fillEl.style.width = '0%';
    if (pinEl) pinEl.style.left = '0%';

    this.car.x = this.W / 2;
    this.car.y = this.H - 120;
    this.car.speed = this.car.baseSpeed;

    const modeData = this.getModeData(this.currentMode);
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    if (this.hudItemLabel) this.hudItemLabel.textContent = `${modeData.itemEmoji} ${modeData.itemName}:`;
    if (this.missionNameEl) this.missionNameEl.textContent = this.currentMode === 3 ? `${girlName} & ${boyName}` : (this.currentMode === 2 ? 'Thar 4x4' : 'Love Car');
    if (this.coinCountEl) this.coinCountEl.textContent = `0 / ${this.targetCoins}`;
    const finishLabel = document.querySelector('.rose-label');
    if (finishLabel) finishLabel.textContent = `${boyName} 🌹`;

    // Init road markers
    for (let y = 0; y < this.H + 100; y += 70) {
      this.roadMarks.push({ y });
    }

    // Init roadside elements
    for (let y = 0; y < this.H + 200; y += 110) {
      this.sideItems.push({ y, side: 'left', size: 28 + Math.random() * 14 });
      this.sideItems.push({ y: y + 55, side: 'right', size: 28 + Math.random() * 14 });
    }

    // Spawn first items
    for (let i = 0; i < 5; i++) {
      this.spawnItem(-i * 130 - 100);
    }

    // Spawn initial family enemy characters on track right away
    this.spawnObstacle(-160);
    this.spawnObstacle(-320);

    if (window.soundFX) window.soundFX.rev();
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    this.keys.left = false;
    this.keys.right = false;
    this.keys.up = false;
    this.keys.down = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  spawnItem(y = -80) {
    const laneOffset = (Math.random() - 0.5) * (this.roadWidth * 0.74);
    this.coins.push({
      x: this.W / 2 + laneOffset,
      y: y,
      r: 16,
      rot: Math.random() * Math.PI,
      collected: false
    });
  }

  spawnObstacle(y = -90) {
    const laneOffset = (Math.random() - 0.5) * (this.roadWidth * 0.72);
    // Family Obstacles to dodge in Mission 3: Mummy, Papa, Bhai with random bahane!
    const types = ['mummy', 'papa', 'bhai'];
    const type = types[Math.floor(Math.random() * types.length)];
    let speech = '';
    if (type === 'mummy') {
      speech = MUMMY_BAHANE[Math.floor(Math.random() * MUMMY_BAHANE.length)];
    } else if (type === 'papa') {
      speech = PAPA_BAHANE[Math.floor(Math.random() * PAPA_BAHANE.length)];
    } else {
      speech = BHAI_BAHANE[Math.floor(Math.random() * BHAI_BAHANE.length)];
    }
    this.obstacles.push({
      x: this.W / 2 + laneOffset,
      y,
      r: 26,
      type,
      speech,
      sway: Math.random() * Math.PI * 2,
      rot: 0
    });
  }

  loop(now = performance.now()) {
    if (!this.isRunning) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.update(dt);
    if (!this.isRunning) return; // If 50 coins were hit during update, stop immediately!
    this.render();

    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (this.isPausedForCare) {
      return;
    }

    this.animTimer += dt;
    this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);

    // If Yuvi Reunion is active, handle gazebo approach and walk
    if (this.yuviReunionActive) {
      if (this.yuviGazeboY < 120) {
        this.yuviGazeboY += 130 * dt;
      }
      if (this.car.y > 165) {
        this.car.y -= 130 * dt;
      } else if (!this.yuviHugged) {
        this.yuviHugged = true;
        if (window.soundFX) {
          window.soundFX.kissSound?.();
          window.soundFX.victoryFanfare?.();
        }
        this.spawnFlyingKisses();
        this.spawnHeartBalloons();
        setTimeout(() => {
          this.stop();
          this.openYuviQuestionsModal();
        }, 1500);
      }
      return;
    }

    // Steering (relaxed and smooth)
    const steerSpeed = (this.currentMode === 3 ? 240 : 220) * dt;
    if (this.keys.left) {
      this.car.x -= steerSpeed;
      this.car.tilt = Math.max(-0.25, this.car.tilt - 0.05);
    } else if (this.keys.right) {
      this.car.x += steerSpeed;
      this.car.tilt = Math.min(0.25, this.car.tilt + 0.05);
    } else {
      this.car.tilt *= 0.82;
    }

    // Road boundaries
    this.car.x = Math.max(this.roadLeft + this.car.w / 2, Math.min(this.roadRight - this.car.w / 2, this.car.x));

    // Speed - Nitro Turbo Booster OR Cruise Speed!
    if (this.isBoosting && this.boostDuration > 0) {
      this.boostDuration -= dt;
      this.car.speed = 10.5; // Powerful Super Nitro Turbo! (Over 2.2x speed!)
      this.spawnNitroParticles();
      // Dynamic visual acceleration surge
      if (this.car.y > this.H - 165) {
        this.car.y -= 75 * dt;
      }
      if (this.boostDuration <= 0) {
        this.isBoosting = false;
        this.car.speed = this.car.baseSpeed;
      }
      this.updateBoostBtnUI();
    } else {
      // Smooth return to resting Y position
      if (this.car.y < this.H - 120) {
        this.car.y += 45 * dt;
      }
      if (this.keys.up) {
        this.car.speed = Math.min(this.car.maxSpeed, this.car.speed + 4 * dt);
      } else if (this.keys.down) {
        this.car.speed = Math.max(2.5, this.car.speed - 4 * dt);
      } else {
        if (this.car.speed < this.car.baseSpeed) this.car.speed += 2.5 * dt;
        if (this.car.speed > this.car.baseSpeed) this.car.speed -= 2.5 * dt;
      }
    }

    // Dynamic scroll multiplier (smooth, responsive & exciting)
    const movePx = this.car.speed * 62 * dt;
    this.roadMarks.forEach((m) => {
      m.y += movePx;
      if (m.y > this.H + 50) m.y -= (this.H + 100);
    });

    // Scroll roadside items
    this.sideItems.forEach((t) => {
      t.y += movePx;
      if (t.y > this.H + 80) t.y = -100;
    });

    // Spawn upcoming items
    if (this.coins.length < 6 && this.coinsCollected < this.targetCoins) {
      const topY = this.coins.reduce((min, c) => Math.min(min, c.y), 0);
      this.spawnItem(topY - (110 + Math.random() * 80));
    }

    // Obstacle management: Family Enemies (Misty ki Mummy, Papa, Bhai) to dodge ONLY IN MODE 3!
    if (this.currentMode === 3 && !this.yuviReunionActive) {
      if (this.obstacles.length < 3 && Math.random() < 0.045) {
        this.spawnObstacle();
      }

      for (let i = 0; i < this.obstacles.length; i++) {
        const obs = this.obstacles[i];
        obs.y += movePx * 0.75; // Slower vertical movement for easy reading!
        obs.x += Math.sin(this.animTimer * 1.6 + obs.sway) * 14 * dt;
        obs.x = Math.max(this.roadLeft + 35, Math.min(this.roadRight - 35, obs.x));

        // Collision with player -> triggers sweet care popup ("babu dhyaan se aao!")
        if (this.invincibleTimer <= 0 && Math.hypot(obs.x - this.car.x, obs.y - this.car.y) < 35) {
          this.triggerEnemyCollision(obs.type, obs.speech);
          return;
        }
      }
      this.obstacles = this.obstacles.filter(o => o.y < this.H + 80);
    } else {
      // In Mode 1 (Love Car) and Mode 2 (Thar 4x4), strictly zero family obstacles!
      this.obstacles = [];
    }

    // Check coin collection
    for (let i = 0; i < this.coins.length; i++) {
      const c = this.coins[i];
      c.y += movePx;
      c.rot += 3 * dt;

      // Collision detection with vehicle / character
      if (!c.collected && Math.hypot(c.x - this.car.x, c.y - this.car.y) < 38) {
        c.collected = true;
        this.coinsCollected++;

        if (window.soundFX) {
          window.soundFX.chime(1 + (this.coinsCollected % 5) * 0.15);
        }
        this.spawnBurst(c.x, c.y);

        // Check milestones across ALL modes (cute popups at 5, 10, 15, 20, 25, 30, 35, 40, 45)
        this.checkMilestones();

        // Checkpoints in Mode 3
        if (this.currentMode === 3) {
          const boyName = window.SiteConfig?.senderName || 'Yuvi';
          if (this.coinsCollected >= 15 && this.lastCheckpointCoins < 15) {
            this.setCheckpoint(15, "🌸 Rose Garden Checkpoint");
          } else if (this.coinsCollected >= 30 && this.lastCheckpointCoins < 30) {
            this.setCheckpoint(30, "🌙 Starlight Bridge Checkpoint");
          } else if (this.coinsCollected >= 45 && this.lastCheckpointCoins < 45) {
            this.setCheckpoint(45, `🏰 ${boyName}'s Palace Gate Checkpoint`);
          }
        }

        // 🌟 CRITICAL: IF 50 COINS ARE COMPLETED, TRIGGER VICTORY OR REUNION!
        if (this.coinsCollected >= this.targetCoins) {
          if (this.currentMode === 3) {
            this.startYuviReunion();
          } else {
            this.triggerVictory();
          }
          return;
        }
      }
    }

    // Clean up passed coins
    this.coins = this.coins.filter((c) => !c.collected && c.y < this.H + 100);

    // Vehicle exhaust / speed particles
    if (Math.random() < 0.5) {
      const modeData = this.getModeData(this.currentMode);
      this.particles.push({
        x: this.car.x + (Math.random() - 0.5) * (this.currentMode === 3 ? 8 : 16),
        y: this.car.y + this.car.h / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: 40 + Math.random() * 30,
        size: 10 + Math.random() * 8,
        alpha: 1,
        rot: Math.random() * 6.28,
        color: this.currentMode === 2 ? '#ff9f43' : (this.currentMode === 3 ? '#ff69b4' : '#ff7597')
      });
    }

    // Update particles
    this.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += (p.vy + movePx * 0.5) * dt;
      p.alpha -= 1.8 * dt;
      p.size *= 0.98;
    });
    this.particles = this.particles.filter((p) => p.alpha > 0);

    // Update HUD elements
    if (this.coinCountEl) this.coinCountEl.textContent = `${this.coinsCollected} / ${this.targetCoins}`;
    if (this.speedEl) {
      const kmh = Math.round(this.car.speed * 18);
      this.speedEl.textContent = this.isBoosting ? `🔥 ${kmh} km/h` : `${kmh} km/h`;
    }

    // Update Journey Map Progress Bar in Real-Time
    const progress = Math.min(100, (this.coinsCollected / this.targetCoins) * 100);
    const fillEl = document.getElementById('mapProgressFill');
    const pinEl = document.getElementById('mapRunnerPin');
    if (fillEl) fillEl.style.width = `${progress}%`;
    if (pinEl) pinEl.style.left = `${progress}%`;
  }

  checkMilestones() {
    const modeData = this.getModeData(this.currentMode);
    if (!modeData?.milestones) return;

    for (const m of modeData.milestones) {
      if (this.coinsCollected >= m.at && !this.completedMilestones.has(m.at)) {
        this.completedMilestones.add(m.at);
        this.showMilestone(m);
        break;
      }
    }
  }

  showMilestone(m) {
    if (!this.milestoneToast) return;
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const rep = (str) => {
      if (!str) return str;
      return str
        .replace(/Misty/g, girlName)
        .replace(/MISTY/g, girlName.toUpperCase())
        .replace(/Yuvi/g, boyName)
        .replace(/YUVI/g, boyName.toUpperCase());
    };

    let photoToShow = m.photo;
    const isMisty = (!girlName || girlName.toLowerCase() === 'misty');
    if (!isMisty) {
      const cfg = window.SiteConfig || {};
      const giftPhotos = (window.birthdayGifts?.photos || []).map(item => (typeof item === 'object' ? item.src : item));
      const albumPool = (Array.isArray(cfg.albumPhotos) ? cfg.albumPhotos : []).filter(p => p && typeof p === 'string' && p.trim() && (p.startsWith('data:image') || (!p.includes('./images/misty') && !p.includes('yuvi_misty_theme_bg') && !p.includes('gift_dress') && !p.includes('favicon.png'))));
      const customPool = [
        ...albumPool,
        cfg.customPhotos?.mainPortrait,
        cfg.customPhotos?.portrait,
        ...giftPhotos,
        ...(Array.isArray(cfg.puzzleImages) ? cfg.puzzleImages : []),
        cfg.customPhotos?.puzzlePhoto,
        cfg.customPhotos?.puzzle,
        cfg.customPhotos?.liveHug,
        cfg.customPhotos?.hug,
        cfg.customPhotos?.bgTheme,
        cfg.customPhotos?.bg
      ].filter(p => p && typeof p === 'string' && p.trim() && (p.startsWith('data:image') || (!p.includes('./images/misty') && !p.includes('yuvi_misty_theme_bg') && !p.includes('gift_dress') && !p.includes('favicon.png'))));

      const AESTHETIC_NOTIF_FALLBACKS = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
      ];

      if (albumPool.length > 0) {
        const idx = Math.floor(((m.at || 5) / 5 - 1)) % albumPool.length;
        photoToShow = albumPool[idx];
      } else if (customPool.length > 0) {
        const idx = Math.floor(((m.at || 5) / 5 - 1)) % customPool.length;
        photoToShow = customPool[Math.max(0, idx)] || customPool[0];
      } else {
        const idx = Math.floor(((m.at || 5) / 5 - 1)) % AESTHETIC_NOTIF_FALLBACKS.length;
        photoToShow = AESTHETIC_NOTIF_FALLBACKS[idx];
      }
    }

    if (this.milestonePhotoImg) {
      this.milestonePhotoImg.onerror = () => {
        this.milestonePhotoImg.onerror = null;
        this.milestonePhotoImg.src = './images/misty1.jpg';
      };
      this.milestonePhotoImg.src = photoToShow;
    }
    if (this.milestoneTag) this.milestoneTag.textContent = rep(m.tag);
    if (this.milestoneMsg) this.milestoneMsg.textContent = rep(m.msg);
    if (this.milestoneNext) this.milestoneNext.textContent = `Target: ${this.targetCoins} ${this.getModeData(this.currentMode).itemName}! 🚀`;

    this.milestoneToast.classList.add('is-shown');
    if (window.soundFX) {
      window.soundFX.triumph();
      setTimeout(() => window.soundFX.kissSound?.(), 220);
    }

    if (this.milestoneTimer) clearTimeout(this.milestoneTimer);
    // Increased duration to 8.5 seconds so player can read the full message easily!
    this.milestoneTimer = setTimeout(() => {
      this.milestoneToast?.classList.remove('is-shown');
    }, 8500);
  }

  // Care Collision Popup ("babu dhyaan se aao!") with randomized excuses & sweet dialogue
  triggerEnemyCollision(enemyType = 'mummy', speech = '') {
    if (this.isPausedForCare) return;
    this.isPausedForCare = true;

    if (window.soundFX) window.soundFX.boing();
    this.spawnBurst(this.car.x, this.car.y);
    this.spawnCollisionStars(this.car.x, this.car.y);

    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';

    const careTitleEl = document.querySelector('.care-title');
    if (careTitleEl) careTitleEl.textContent = `${girlName} babu dhyaan se aao! 🥰💋`;

    const careTextEl = document.getElementById('careModalText');
    if (careTextEl) {
      const excuseHint = speech ? `(${speech})` : '';
      const mummyDialogues = [
        `"Arey ${girlName} babu dhyaan se aao! 🥰 🧕 Mummy samne khadi hain ${excuseHint}! Sambhal ke chalo meri jaan! ${boyName} samne aapke liye red rose leke wait kar raha hai! 🌹<br><br>Aapke sabhi points <strong>100% safe</strong> hain! Ab aaram se aao!"`,
        `"Ohh meri sweetheart ${girlName}! 🙈 Mummy ne dekh liya lagta hai ${excuseHint}! Ghabrao mat meri princess, thoda side se nikal jao! ${boyName} aapka wait kar raha hai! 💖<br><br>Coins <strong>100% safe</strong> hain, koi tension nahi babu!"`,
        `"Dhyaan se meri jaan ${girlName}! 🧕 Mummy bol rahi hain ${excuseHint}! Chupke se bypass karo, ${boyName} samne gift box leke khada hai! 🎁✨<br><br>Aapke points <strong>safe</strong> hain babu!"`
      ];

      const papaDialogues = [
        `"Arey ${girlName} babu dhyaan se aao! 🥰 👓 Papa samne hain ${excuseHint}! Unse bach ke aage badho meri princess! ${boyName} samne baahein failaye khada hai! 💖<br><br>Aapke sabhi points <strong>100% safe</strong> hain! Chalo ab sambhal ke aao meri jaan!"`,
        `"Sambhal ke meri pyari ${girlName}! 🧐 Papa ne toka: ${excuseHint}! Unhe nazar na aao aise chupke se aage chalo! Samne ${boyName} aapke intezaar mein khada hai! 🏰🌹<br><br>Aapke sabhi coins <strong>100% safe</strong> hain!"`,
        `"Aww ${girlName} rani! 👓 Papa chashma theek karke pooch rahe hain ${excuseHint}! Koi baat nahi meri jaan, slow and steady chalo! ${boyName} aage khada hai! 🌸💞<br><br>Coins <strong>100% safe</strong> hain!"`
      ];

      const bhaiDialogues = [
        `"Arey ${girlName} babu dhyaan se aao! 🥰 😜 Bhai peeche pada hai: ${excuseHint}! Usse bach ke aage aao meri cute girlfriend! ${boyName} wait kar raha hai! 🏰<br><br>Sabhi points <strong>100% safe</strong> hain! Aaram se continue karo babu!"`,
        `"Hahaha naughty bhai ne pakad liya: ${excuseHint}! 📸 ${girlName} babu usko chocolate baad mein denge, pehle daud ke apne ${boyName} ke paas aao! 🛵💨<br><br>Coins <strong>100% safe</strong> hain meri jaan!"`,
        `"Oho meri pyari ${girlName}! 😜 Bhai sneak peek leke bola: ${excuseHint}! Jaldi se steer karo meri jaan, samne ${boyName} surprise leke ready hai! 🌟🎉<br><br>Coins <strong>100% safe</strong> hain babu!"`
      ];

      if (enemyType === 'mummy') {
        careTextEl.innerHTML = mummyDialogues[Math.floor(Math.random() * mummyDialogues.length)];
      } else if (enemyType === 'papa') {
        careTextEl.innerHTML = papaDialogues[Math.floor(Math.random() * papaDialogues.length)];
      } else {
        careTextEl.innerHTML = bhaiDialogues[Math.floor(Math.random() * bhaiDialogues.length)];
      }
    }

    if (this.mistyCareModal) {
      this.mistyCareModal.style.display = 'flex';
    }
  }

  resumeAfterCare() {
    if (this.mistyCareModal) {
      this.mistyCareModal.style.display = 'none';
    }
    this.isPausedForCare = false;
    this.invincibleTimer = 2.6; // 2.6s love shield so no immediate collision
    // Clear obstacles in immediate vicinity so path ahead is open
    this.obstacles = this.obstacles.filter(o => Math.hypot(o.x - this.car.x, o.y - this.car.y) > 140);
    if (window.soundFX) window.soundFX.chime(1.4);
  }

  spawnCollisionStars(x, y) {
    const emojis = ['💫', '✨', '🥺', '💖', '🌸'];
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('div');
      el.className = 'floating-heart-balloon';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${x + (Math.random() - 0.5) * 60}px`;
      el.style.top = `${y + (Math.random() - 0.5) * 60}px`;
      el.style.fontSize = `${18 + Math.random() * 12}px`;
      this.canvas?.parentElement?.appendChild(el);

      el.animate([
        { transform: 'translate(0, 0) scale(0.6)', opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 90}px, -70px) scale(1.2)`, opacity: 0 }
      ], {
        duration: 900,
        easing: 'ease-out'
      }).onfinish = () => el.remove();
    }
  }

  // Nitro Boost & "Kiss Yuvi" Recharge Logic
  handleBoostClick() {
    if (this.isBoosting && this.boostDuration > 0) return;

    if (this.nitroCharges > 0) {
      this.activateNitroBoost();
    } else {
      this.openNitroKissModal();
    }
  }

  activateNitroBoost() {
    this.nitroCharges = Math.max(0, this.nitroCharges - 1);
    this.isBoosting = true;
    this.boostDuration = this.maxBoostDuration;
    if (window.soundFX) {
      window.soundFX.chime(1.7);
      setTimeout(() => window.soundFX.triumph?.(), 160);
    }
    this.updateBoostBtnUI();
  }

  openNitroKissModal() {
    if (!this.nitroKissModal) return;
    const boyName = window.SiteConfig?.senderName || 'Yuvi';
    const speech = document.getElementById('nitroSpeech');
    if (speech) {
      speech.innerHTML = `"Pehle apne ${boyName} ko sweet sweet kiss do babu, tabhi aapki car ko <strong>Super Nitro Booster</strong> milega! 🚀🔥"`;
    }
    this.nitroKissModal.style.display = 'flex';
  }

  closeNitroKissModal() {
    if (!this.nitroKissModal) return;
    this.nitroKissModal.style.display = 'none';
  }

  giveNitroKiss(emoji = '💋') {
    if (window.soundFX) {
      window.soundFX.kissSound?.();
    }
    this.spawnNitroFloatingKiss(emoji);
    const speech = document.getElementById('nitroSpeech');
    if (speech) {
      speech.innerHTML = `"${emoji} Awww my love! Kiss received! 🥰 <strong>Nitro Booster 100% Full!</strong> Chalo ab car uda do! 🚀🔥"`;
    }
    this.nitroCharges = 1;
    this.updateBoostBtnUI();

    setTimeout(() => {
      this.closeNitroKissModal();
      this.activateNitroBoost();
    }, 850);
  }

  spawnNitroFloatingKiss(emoji) {
    const stage = document.getElementById('nitroFxStage') || document.body;
    const el = document.createElement('div');
    el.className = 'ph-floating-kiss';
    el.textContent = emoji;
    el.style.left = `${35 + Math.random() * 30}%`;
    el.style.bottom = '20px';
    stage.appendChild(el);

    const driftX = (Math.random() - 0.5) * 80;
    el.animate([
      { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
      { transform: `translate(${driftX * 0.4}px, -60px) scale(1.3)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${driftX}px, -140px) scale(0.8)`, opacity: 0 }
    ], {
      duration: 1100,
      easing: 'ease-out'
    }).onfinish = () => el.remove();
  }

  spawnNitroParticles() {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: this.car.x + (Math.random() - 0.5) * (this.currentMode === 3 ? 12 : 24),
        y: this.car.y + this.car.h / 2 + 6,
        vx: (Math.random() - 0.5) * 35,
        vy: 140 + Math.random() * 80,
        size: 16 + Math.random() * 12,
        alpha: 1,
        rot: Math.random() * 6.28,
        color: Math.random() > 0.4 ? '#ff0055' : (Math.random() > 0.5 ? '#ffa502' : '#ffea00')
      });
    }
  }

  updateBoostBtnUI() {
    if (!this.btnBoost) return;
    if (this.isBoosting && this.boostDuration > 0) {
      this.btnBoost.innerHTML = `🔥 BOOST (${Math.ceil(this.boostDuration)}s)`;
      this.btnBoost.classList.add('is-active-nitro');
      this.btnBoost.classList.remove('has-charge');
    } else if (this.nitroCharges > 0) {
      this.btnBoost.innerHTML = `🚀 NITRO BOOST!`;
      this.btnBoost.classList.remove('is-active-nitro');
      this.btnBoost.classList.add('has-charge');
    } else {
      this.btnBoost.innerHTML = `⚡ KISS YUVI 💋`;
      this.btnBoost.classList.remove('is-active-nitro', 'has-charge');
    }
  }

  respawnAtCheckpoint(enemyType = 'mummy') {
    this.triggerEnemyCollision(enemyType);
  }

  setCheckpoint(coins, name) {
    this.lastCheckpointCoins = coins;
    this.lastCheckpointName = name;
    if (window.soundFX) window.soundFX.chime(1.5);
    const girlName = window.SiteConfig?.recipientName || 'Misty';
    const isMisty = (!girlName || girlName.toLowerCase() === 'misty');
    let photo = coins === 15 ? './images/misty1.jpg' : (coins === 30 ? './images/misty6.jpg' : './images/misty7.jpg');
    if (!isMisty) {
      const cfg = window.SiteConfig || {};
      const pool = [
        cfg.customPhotos?.mainPortrait,
        cfg.customPhotos?.portrait,
        ...(Array.isArray(cfg.puzzleImages) ? cfg.puzzleImages : []),
        cfg.customPhotos?.puzzlePhoto,
        cfg.customPhotos?.liveHug
      ].filter(p => p && typeof p === 'string' && (p.startsWith('data:image') || (!p.includes('./images/misty') && !p.includes('yuvi_misty_theme_bg'))));
      if (pool.length > 0) {
        photo = pool[coins === 15 ? 0 : (coins === 30 ? (1 % pool.length) : (2 % pool.length))] || pool[0];
      }
    }
    const boyName = window.SiteConfig?.senderName || 'Yuvi';
    this.showMilestone({
      photo,
      tag: 'CHECKPOINT SAVED! 🚩✨',
      msg: `${name} reached! ${coins} Stars saved! ${boyName} is waiting ahead! 💖`
    });
  }

  startYuviReunion() {
    this.yuviReunionActive = true;
    this.obstacles = [];
    this.coins = [];
    if (window.soundFX) window.soundFX.triumph();
  }

  openYuviQuestionsModal() {
    if (!this.yuviModal) return;
    this.yuviModal.classList.add('is-shown');
    this.currentYuviQIndex = 0;
    if (this.yuviDialogueBox) this.yuviDialogueBox.style.display = 'block';
    if (this.yuviActionsRow) this.yuviActionsRow.style.display = 'none';

    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';

    const yuviReunionTitle = document.getElementById('yuviReunionTitle');
    if (yuviReunionTitle) yuviReunionTitle.textContent = `${girlName} Reached ${boyName}! 👩‍❤️‍💋‍👨💋`;
    const reunionBadge = document.querySelector('#yuviReunionModal .win-badge');
    if (reunionBadge) reunionBadge.textContent = `👑 ${girlName.toUpperCase()} & ${boyName.toUpperCase()} REUNITED! 👩‍❤️‍💋‍👨`;
    const yuviSpeakerTag = document.querySelector('.yuvi-speaker-tag strong');
    if (yuviSpeakerTag) yuviSpeakerTag.textContent = `${boyName} says:`;
    const reunionHugToast = document.getElementById('reunionHugToast');
    if (reunionHugToast) reunionHugToast.innerHTML = `🌹 ${boyName} presented a Red Rose &amp; sealed with tight Hugs &amp; Flying Kisses! 💋🥰`;

    this.loadYuviQuestion(0);
    this.spawnHeartBalloons();
    this.spawnFlyingKisses();
    this.spawnFlowerPetals();
  }

  loadYuviQuestion(idx) {
    const q = YUVI_QUESTIONS[idx];
    if (!q) return;
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const rep = (str) => {
      if (!str) return str;
      return str
        .replace(/Misty/g, girlName)
        .replace(/MISTY/g, girlName.toUpperCase())
        .replace(/Yuvi/g, boyName)
        .replace(/YUVI/g, boyName.toUpperCase());
    };
    if (this.yuviQuestionText) this.yuviQuestionText.textContent = `"${rep(q.q)}"`;
    if (this.btnYuviYes) this.btnYuviYes.textContent = rep(q.yes);
    if (this.btnYuviNo) {
      this.btnYuviNo.textContent = rep(q.no);
      this.btnYuviNo.style.transform = 'translate(0, 0) rotate(0deg)';
    }
  }

  spawnHeartConfetti() {
    const emojis = ['💖', '💕', '💍', '✨', '🥰', '🌸', '❤️', '🎉'];
    const container = this.yuviModal || document.body;
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('span');
      el.className = 'floating-heart-burst';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${50 + (Math.random() - 0.5) * 60}%`;
      el.style.top = `${50 + (Math.random() - 0.5) * 40}%`;
      el.style.fontSize = `${Math.random() * 20 + 20}px`;
      container.appendChild(el);

      const dx = (Math.random() - 0.5) * 280;
      const dy = (Math.random() - 0.8) * 320;
      const rot = (Math.random() - 0.5) * 360;

      el.animate([
        { transform: 'translate(0, 0) scale(0.5)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.3)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 600,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      }).onfinish = () => el.remove();
    }
  }

  spawnBurst(x, y) {
    const mode = this.currentMode;
    const color = mode === 2 ? '#ffd700' : (mode === 3 ? '#ff2a70' : '#ff4d79');
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 160,
        vy: (Math.random() - 0.5) * 160,
        size: 14,
        alpha: 1,
        rot: Math.random() * 6.28,
        color
      });
    }
  }

  // 🌟 IMMEDIATE GAME COMPLETE WITH FLOWER & HEART REACTIONS!
  triggerVictory() {
    // 1. Immediately freeze and stop game engine
    this.stop();

    // 2. Play celebratory sounds
    if (window.soundFX) {
      window.soundFX.victoryFanfare();
      setTimeout(() => window.soundFX.kissSound?.(), 300);
      setTimeout(() => window.soundFX.kissSound?.(), 650);
      setTimeout(() => window.soundFX.kissSound?.(), 1000);
    }

    // 3. Unlock Next Mission sequentially & track event!
    if (this.currentMode === 1) {
      this.unlockedGameModes.add(2);
      if (window.trackMissionEvent) window.trackMissionEvent('car1', '50 stars');
    } else if (this.currentMode === 2) {
      this.unlockedGameModes.add(3);
      if (window.trackMissionEvent) window.trackMissionEvent('car2', '50 badges');
    } else if (this.currentMode === 3) {
      if (window.trackMissionEvent) window.trackMissionEvent('car3', 'reunited');
    }
    this.updateTabUI();

    // 4. Update Win Modal Content for Current Mode
    const modeData = this.getModeData(this.currentMode);
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const rep = (str) => {
      if (!str) return str;
      return str
        .replace(/Misty/g, girlName)
        .replace(/MISTY/g, girlName.toUpperCase())
        .replace(/Yuvi/g, boyName)
        .replace(/YUVI/g, boyName.toUpperCase());
    };
    if (this.winTitle) this.winTitle.textContent = rep(modeData.winTitle);
    if (this.winLoveWords) this.winLoveWords.innerHTML = `"${rep(modeData.winMsg)}"`;
    if (this.winNextMissionBtn) {
      this.winNextMissionBtn.textContent = rep(modeData.nextBtnText);
    }

    // 5. Show Celebration Modal
    if (this.winModal) {
      this.winModal.classList.add('is-shown');
    }

    // 6. Spawn Swarms of Heart Balloons, Flying Kisses, and Floating Flower Petals!
    this.spawnHeartBalloons();
    this.spawnFlyingKisses();
    this.spawnFlowerPetals();
  }

  spawnFlowerPetals() {
    const container = this.winFxContainer || document.body;
    const flowers = ['🌸', '🌹', '🌺', '💐', '🌷', '🌼', '💖', '✨'];

    for (let i = 0; i < 35; i++) {
      const el = document.createElement('div');
      el.className = 'floating-flower-petal';
      el.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      el.style.left = `${Math.random() * 95}%`;
      el.style.top = '-40px';
      el.style.fontSize = `${22 + Math.random() * 24}px`;
      container.appendChild(el);

      const driftX = (Math.random() - 0.5) * 140;
      const duration = 2400 + Math.random() * 2000;
      const delay = Math.random() * 1200;

      el.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 0 },
        { transform: `translate(${driftX * 0.4}px, 40vh) rotate(180deg)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${driftX}px, 110vh) rotate(360deg)`, opacity: 0 }
      ], {
        duration,
        delay,
        easing: 'ease-out'
      }).onfinish = () => el.remove();
    }
  }

  spawnHeartBalloons() {
    const container = this.winFxContainer || document.body;
    const balloonTypes = ['🎈❤️', '🎈💖', '🎈💕', '🎈✨', '🎈'];
    
    for (let i = 0; i < 28; i++) {
      const el = document.createElement('div');
      el.className = 'floating-heart-balloon';
      el.textContent = balloonTypes[Math.floor(Math.random() * balloonTypes.length)];
      el.style.left = `${Math.random() * 95}%`;
      el.style.bottom = '-60px';
      el.style.fontSize = `${28 + Math.random() * 24}px`;
      container.appendChild(el);

      const driftX = (Math.random() - 0.5) * 120;
      const duration = 2500 + Math.random() * 2000;
      const delay = Math.random() * 1200;

      el.animate([
        { transform: 'translate(0, 0) rotate(-6deg)', opacity: 0 },
        { transform: `translate(${driftX * 0.3}px, -30vh) rotate(6deg)`, opacity: 0.95, offset: 0.2 },
        { transform: `translate(${driftX}px, -115vh) rotate(-10deg)`, opacity: 0 }
      ], {
        duration,
        delay,
        easing: 'ease-out'
      }).onfinish = () => el.remove();
    }
  }

  spawnFlyingKisses() {
    const container = this.winFxContainer || document.body;
    const kissTypes = ['💋', '😘', '👩‍❤️‍💋‍👨', '💋', '💖', '🥰', '💋'];

    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.className = 'flying-kiss-mark';
      el.textContent = kissTypes[Math.floor(Math.random() * kissTypes.length)];
      el.style.left = `${Math.random() * 92}%`;
      el.style.top = `${Math.random() * 90}%`;
      el.style.fontSize = `${24 + Math.random() * 28}px`;
      container.appendChild(el);

      const delay = Math.random() * 1600;
      const rot = (Math.random() - 0.5) * 50;

      el.animate([
        { transform: 'scale(0.1) rotate(0deg)', opacity: 0 },
        { transform: `scale(1.35) rotate(${rot}deg)`, opacity: 1, offset: 0.35 },
        { transform: `scale(1) rotate(${rot}deg) translateY(-30px)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 1000,
        delay,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }).onfinish = () => el.remove();
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);
    const mode = this.currentMode;
    const modeData = this.getModeData(mode);

    // 1. Background Gradient per Mode
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.H);
    bgGrad.addColorStop(0, modeData.roadBg[0]);
    bgGrad.addColorStop(0.5, modeData.roadBg[1]);
    bgGrad.addColorStop(1, modeData.roadBg[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.W, this.H);

    // 2. Road Surface
    ctx.fillStyle = modeData.roadColor;
    ctx.fillRect(this.roadLeft, 0, this.roadWidth, this.H);

    // Glowing Road Borders
    ctx.strokeStyle = modeData.borderGlow;
    ctx.lineWidth = 4;
    ctx.shadowColor = modeData.borderGlow;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(this.roadLeft, 0); ctx.lineTo(this.roadLeft, this.H);
    ctx.moveTo(this.roadRight, 0); ctx.lineTo(this.roadRight, this.H);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Road Lane Dashes
    ctx.strokeStyle = mode === 2 ? 'rgba(255, 200, 160, 0.55)' : (mode === 3 ? 'rgba(0, 242, 254, 0.65)' : 'rgba(255, 230, 240, 0.65)');
    ctx.lineWidth = 4;
    const lane1 = this.roadLeft + this.roadWidth * 0.33;
    const lane2 = this.roadLeft + this.roadWidth * 0.66;
    this.roadMarks.forEach((m) => {
      ctx.beginPath();
      ctx.moveTo(lane1, m.y); ctx.lineTo(lane1, m.y + 36);
      ctx.moveTo(lane2, m.y); ctx.lineTo(lane2, m.y + 36);
      ctx.stroke();
    });

    // 4. Roadside Scenery (Mode specific)
    this.sideItems.forEach((t) => {
      const tx = t.side === 'left' ? this.roadLeft - 32 : this.roadRight + 32;

      if (mode === 1) {
        // Mode 1: Pink Sakura trees
        ctx.fillStyle = '#4a2511';
        ctx.fillRect(tx - 3, t.y + 12, 6, 20);
        ctx.fillStyle = '#ff8fab';
        ctx.beginPath();
        ctx.arc(tx, t.y, t.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffb3c6';
        ctx.beginPath();
        ctx.arc(tx - 6, t.y - 6, t.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 2) {
        // Mode 2: Pine Trees & Mountain Rocks
        ctx.fillStyle = '#1b3b22';
        ctx.beginPath();
        ctx.moveTo(tx, t.y - t.size);
        ctx.lineTo(tx + t.size * 0.8, t.y + t.size);
        ctx.lineTo(tx - t.size * 0.8, t.y + t.size);
        ctx.fill();
        ctx.fillStyle = '#4a2511';
        ctx.fillRect(tx - 3, t.y + t.size, 6, 12);
      } else {
        // Mode 3: Romantic Starlight Lanterns & Fairy Trees
        ctx.fillStyle = '#ff3385';
        ctx.shadowColor = '#ff69b4';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(tx, t.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffd700';
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏮', tx, t.y);
        ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
        ctx.fillRect(tx - 1.5, t.y + 8, 3, 24);
      }
    });

    // 5. Collectible Items (Coins / Badges / Love Stars)
    this.coins.forEach((c) => {
      if (c.collected) return;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(Math.cos(c.rot), 1);

      if (mode === 1) {
        // Mode 1: Golden Heart Coin
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d81159';
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', 0, 1);
      } else if (mode === 2) {
        // Mode 2: 4x4 Thar Star Badge
        ctx.shadowColor = '#ff6b35';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('4x4', 0, 1);
      } else {
        // Mode 3: Sparkling Radiant Golden Star with Glowing Aura
        ctx.shadowColor = '#ff2a70';
        ctx.shadowBlur = 18;

        // Outer radiant pulsing halo
        ctx.fillStyle = 'rgba(255, 235, 59, 0.45)';
        ctx.beginPath();
        ctx.arc(0, 0, c.r + 6, 0, Math.PI * 2);
        ctx.fill();

        // Bright Golden Core
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fill();

        // White border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Golden Star emoji
        ctx.fillStyle = '#ff1493';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', 0, 1);
      }

      ctx.restore();
    });

    // 5b. Obstacles (Mode 3 only)
    if (mode === 3 && !this.yuviReunionActive) {
      this.obstacles.forEach((obs) => {
        this.drawObstacle(ctx, obs);
      });
    }

    // 5c. Gazebo Reunion (Mode 3)
    if (mode === 3 && this.yuviReunionActive) {
      this.drawYuviGazebo(ctx, this.W / 2, this.yuviGazeboY, this.yuviHugged);
    }

    // 6. Exhaust / Trail Particles
    this.particles.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(mode === 2 ? '★' : '♥', 0, 0);
      ctx.restore();
    });

    // 7. Draw Vehicle / Character per Mode
    if (mode === 1) {
      this.drawLoveCar(ctx, this.car.x, this.car.y, this.car.tilt);
    } else if (mode === 2) {
      this.drawThar4x4(ctx, this.car.x, this.car.y, this.car.tilt);
    } else {
      if (!this.yuviHugged) {
        this.drawMistyCharacter(ctx, this.car.x, this.car.y, this.car.tilt);
      }
    }
  }

  // VEHICLE 1: Pink Sports Convertible (Love Car)
  drawLoveCar(ctx, x, y, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Headlight beams
    const beamGrad = ctx.createLinearGradient(0, -this.car.h / 2, 0, -this.car.h / 2 - 140);
    beamGrad.addColorStop(0, 'rgba(255, 255, 220, 0.45)');
    beamGrad.addColorStop(1, 'rgba(255, 255, 220, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(-16, -this.car.h / 2);
    ctx.lineTo(-44, -this.car.h / 2 - 140);
    ctx.lineTo(-8, -this.car.h / 2 - 140);
    ctx.lineTo(-10, -this.car.h / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(10, -this.car.h / 2);
    ctx.lineTo(8, -this.car.h / 2 - 140);
    ctx.lineTo(44, -this.car.h / 2 - 140);
    ctx.lineTo(16, -this.car.h / 2);
    ctx.fill();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 28, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#111';
    ctx.fillRect(-26, -34, 6, 18);
    ctx.fillRect(20, -34, 6, 18);
    ctx.fillRect(-26, 18, 6, 18);
    ctx.fillRect(20, 18, 6, 18);

    // Body
    const bodyGrad = ctx.createLinearGradient(-22, 0, 22, 0);
    bodyGrad.addColorStop(0, '#d81159');
    bodyGrad.addColorStop(0.5, '#ff2a70');
    bodyGrad.addColorStop(1, '#a80b3f');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-22, -44, 44, 88, [18, 18, 12, 12]);
    ctx.fill();

    // Windshield
    ctx.fillStyle = 'rgba(200, 240, 255, 0.85)';
    ctx.beginPath();
    ctx.roundRect(-16, -24, 32, 14, [4, 4, 2, 2]);
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#220814';
    ctx.beginPath();
    ctx.roundRect(-15, -8, 30, 24, [3, 3, 3, 3]);
    ctx.fill();

    // Seats
    ctx.fillStyle = '#ff7597';
    ctx.fillRect(-12, -4, 10, 16);
    ctx.fillRect(2, -4, 10, 16);

    // Headlights
    ctx.fillStyle = '#fffadb';
    ctx.shadowColor = '#fffadb';
    ctx.shadowBlur = 8;
    ctx.fillRect(-18, -43, 8, 4);
    ctx.fillRect(10, -43, 8, 4);
    ctx.shadowBlur = 0;

    // Tail lights
    ctx.fillStyle = '#ff0033';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 6;
    ctx.fillRect(-18, 41, 8, 3);
    ctx.fillRect(10, 41, 8, 3);
    ctx.shadowBlur = 0;

    // License Plate
    const girlUpper = (window.SiteConfig?.recipientName || 'Misty').toUpperCase();
    ctx.fillStyle = '#fff';
    ctx.fillRect(-14, 34, 28, 7);
    ctx.fillStyle = '#d81159';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${girlUpper} ♥`, 0, 37.5);

    ctx.restore();
  }

  // VEHICLE 2: Rugged Red & Black Mahindra Thar 4x4 Beast
  drawThar4x4(ctx, x, y, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Powerful off-road fog lights
    const beamGrad = ctx.createLinearGradient(0, -50, 0, -200);
    beamGrad.addColorStop(0, 'rgba(255, 230, 150, 0.55)');
    beamGrad.addColorStop(1, 'rgba(255, 230, 150, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(-20, -45); ctx.lineTo(-55, -200); ctx.lineTo(55, -200); ctx.lineTo(20, -45);
    ctx.fill();

    // Heavy shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 12, 32, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    // Massive Chunky Off-Road Tires (4 big tyres with knobby treads)
    ctx.fillStyle = '#141416';
    ctx.fillRect(-30, -36, 9, 24);
    ctx.fillRect(21, -36, 9, 24);
    ctx.fillRect(-30, 16, 9, 24);
    ctx.fillRect(21, 16, 9, 24);

    // Wheel rims
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(-27, -28, 3, 8);
    ctx.fillRect(24, -28, 3, 8);
    ctx.fillRect(-27, 24, 3, 8);
    ctx.fillRect(24, 24, 3, 8);

    // Boxy Thar 4x4 Body (Glossy Red Body)
    const redGrad = ctx.createLinearGradient(-26, 0, 26, 0);
    redGrad.addColorStop(0, '#c01828');
    redGrad.addColorStop(0.5, '#e82838');
    redGrad.addColorStop(1, '#98101e');
    ctx.fillStyle = redGrad;
    ctx.beginPath();
    ctx.roundRect(-25, -46, 50, 92, [8, 8, 8, 8]);
    ctx.fill();

    // Matte Black Hood & Fenders
    ctx.fillStyle = '#1a1a1d';
    ctx.fillRect(-25, -46, 50, 18);

    // Iconic Thar 7-Slot Grille
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(-18, -45, 36, 6);
    ctx.fillStyle = '#e82838';
    for (let i = -14; i <= 14; i += 4) {
      ctx.fillRect(i, -44, 2, 4);
    }

    // Classic Round Headlamps
    ctx.fillStyle = '#fffadb';
    ctx.shadowColor = '#fffadb';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-16, -42, 4, 0, Math.PI * 2);
    ctx.arc(16, -42, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Front Windshield
    ctx.fillStyle = '#5588a3';
    ctx.fillRect(-20, -26, 40, 12);

    // Matte Black Convertible Hard/Soft Roof
    ctx.fillStyle = '#222226';
    ctx.beginPath();
    ctx.roundRect(-21, -12, 42, 44, [4, 4, 4, 4]);
    ctx.fill();

    // Rear Side Windows
    ctx.fillStyle = '#3a506b';
    ctx.fillRect(-19, -8, 8, 14);
    ctx.fillRect(11, -8, 8, 14);

    // Rear Mounted Spare Tire (Iconic Thar Feature!)
    ctx.fillStyle = '#111114';
    ctx.beginPath();
    ctx.roundRect(-12, 40, 24, 10, [4, 4, 4, 4]);
    ctx.fill();
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('4X4', 0, 45);

    // License Plate
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-14, 32, 28, 6);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 5px sans-serif';
    const girlUpper = (window.SiteConfig?.recipientName || 'MISTY').toUpperCase();
    ctx.fillText(`THAR ♥ ${girlUpper}`, 0, 35);

    ctx.restore();
  }

  // MODE 3: Cute Chibi Character Misty (Player)
  drawMistyCharacter(ctx, x, y, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt * 0.4);

    // Invincibility flashing when respawned
    if (this.invincibleTimer > 0 && Math.floor(Date.now() / 90) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    const t = this.animTimer * 10;
    const bounce = Math.sin(t) * 3;
    const legSwing = Math.sin(t) * 7;

    // Glowing pink aura beneath her
    ctx.shadowColor = '#ff69b4';
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(255, 105, 180, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 24 + bounce, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Little Legs & Cute Pink Shoes (running animation)
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(-8, 14 + bounce + legSwing, 5, 12);
    ctx.fillRect(3, 14 + bounce - legSwing, 5, 12);

    // Cute Floral Pastel Sundress (Misty's outfit)
    const dressGrad = ctx.createLinearGradient(0, -6, 0, 16);
    dressGrad.addColorStop(0, '#ffffff');
    dressGrad.addColorStop(1, '#ffc0cb');
    ctx.fillStyle = dressGrad;
    ctx.beginPath();
    ctx.moveTo(-10, -6 + bounce);
    ctx.lineTo(10, -6 + bounce);
    ctx.lineTo(16, 16 + bounce);
    ctx.lineTo(-16, 16 + bounce);
    ctx.closePath();
    ctx.fill();

    // Dress flower dots
    ctx.fillStyle = '#ff3377';
    ctx.beginPath();
    ctx.arc(-4, 6 + bounce, 2, 0, Math.PI * 2);
    ctx.arc(5, 8 + bounce, 2, 0, Math.PI * 2);
    ctx.arc(0, 12 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();

    // Soft Cascading Brown Wavy Hair
    ctx.fillStyle = '#4a2618';
    ctx.beginPath();
    ctx.ellipse(0, -14 + bounce, 15, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair waves blowing back
    ctx.fillRect(-14, -14 + bounce, 28, 20);
    ctx.beginPath();
    ctx.arc(-11, 6 + bounce, 4, 0, Math.PI * 2);
    ctx.arc(11, 6 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();

    // Cute Chibi Head & Sweet Face
    ctx.fillStyle = '#ffe3d6';
    ctx.beginPath();
    ctx.arc(0, -16 + bounce, 12, 0, Math.PI * 2);
    ctx.fill();

    // Rosy Blush Cheeks
    ctx.fillStyle = 'rgba(255, 105, 140, 0.65)';
    ctx.beginPath();
    ctx.arc(-7, -13 + bounce, 3, 0, Math.PI * 2);
    ctx.arc(7, -13 + bounce, 3, 0, Math.PI * 2);
    ctx.fill();

    // Cute Anime Eyes (sparkling and happy)
    ctx.fillStyle = '#2d1500';
    ctx.beginPath();
    ctx.arc(-4.5, -16 + bounce, 2.2, 0, Math.PI * 2);
    ctx.arc(4.5, -16 + bounce, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4, -17 + bounce, 0.9, 0, Math.PI * 2);
    ctx.arc(5, -17 + bounce, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Cute Smiling Mouth
    ctx.strokeStyle = '#c44569';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -12 + bounce, 2.5, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Flower Hairpin / Accessory
    ctx.fillStyle = '#ff3366';
    ctx.font = '10px serif';
    ctx.fillText('🌸', 6, -23 + bounce);

    // Floating Starlight Particles behind her steps
    if (Math.random() < 0.35) {
      this.particles.push({
        x: this.car.x + (Math.random() - 0.5) * 16,
        y: this.car.y + 20,
        vx: (Math.random() - 0.5) * 20,
        vy: 30 + Math.random() * 20,
        size: 10 + Math.random() * 8,
        alpha: 1,
        rot: Math.random() * 6.28,
        color: '#ff69b4'
      });
    }

    ctx.restore();
  }

  // Romantic Gazebo where Yuvi waits with Red Rose at the end of the road
  drawYuviGazebo(ctx, x, y, isHugged) {
    ctx.save();
    ctx.translate(x, y);

    // Romantic Floral Gazebo Arch
    ctx.strokeStyle = '#ff85a2';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(255, 248, 252, 0.98)';
    ctx.beginPath();
    ctx.arc(0, 0, 52, Math.PI, 0);
    ctx.lineTo(52, 65);
    ctx.lineTo(-52, 65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Arch Flowers
    const flowerIcons = ['🌸', '🌹', '🌺', '💖', '💐', '🌹', '🌸'];
    flowerIcons.forEach((fl, idx) => {
      const ang = Math.PI + (idx / (flowerIcons.length - 1)) * Math.PI;
      const fx = Math.cos(ang) * 52;
      const fy = Math.sin(ang) * 52;
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fl, fx, fy);
    });

    // Banner: "YUVI'S HEART & CASTLE 🏰❤️"
    const boyUpper = (window.SiteConfig?.senderName || 'Yuvi').toUpperCase();
    const girlUpper = (window.SiteConfig?.recipientName || 'Misty').toUpperCase();
    ctx.fillStyle = '#b81446';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${boyUpper}'S HEART 🏰❤️`, 0, -18);

    if (isHugged) {
      // Live Hug & Kiss in Gazebo with Swaying & Flying Kiss Marks!
      const t = this.animTimer * 5;
      const sway = Math.sin(t) * 2.5;

      ctx.save();
      ctx.translate(sway, 0);

      // Tight Romantic Couple Hug
      ctx.font = '46px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👩‍❤️‍💋‍👨', 0, 26);

      // Flying kisses & heart trail popping from their lips
      ctx.font = '18px serif';
      ctx.fillText('💋', -22, 10 - ((t * 8) % 24));
      ctx.fillText('💖', 22, 6 - (((t + 10) * 8) % 24));
      ctx.fillText('🌹', 2, 48);

      ctx.fillStyle = '#ff2a70';
      ctx.font = 'bold 11.5px sans-serif';
      ctx.fillText(`${girlUpper} & ${boyUpper} HUGGED & KISSED! 💋🥰`, 0, 68);
      ctx.restore();
    } else {
      // Yuvi standing holding a sparkling RED ROSE 🌹 for Misty!
      // Head
      ctx.fillStyle = '#1a1a24'; // Styled black hair
      ctx.beginPath();
      ctx.arc(0, 8, 11, 0, Math.PI * 2);
      ctx.fill();
      // Face
      ctx.fillStyle = '#ffe0d0';
      ctx.beginPath();
      ctx.arc(0, 12, 9, 0, Math.PI * 2);
      ctx.fill();
      // Eyes & Warm smile
      ctx.fillStyle = '#111';
      ctx.fillRect(-4, 10, 2, 2);
      ctx.fillRect(2, 10, 2, 2);
      ctx.strokeStyle = '#a8324e';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 14, 3, 0.2, Math.PI - 0.2);
      ctx.stroke();
      // Stylish Dark Navy Jacket
      ctx.fillStyle = '#1a233a';
      ctx.fillRect(-12, 21, 24, 22);

      // Arms: Left arm open, Right arm holding RED ROSE!
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1a233a';
      ctx.beginPath();
      ctx.moveTo(-12, 24); ctx.lineTo(-24, 20); // Left arm open
      ctx.moveTo(12, 24); ctx.lineTo(24, 15);   // Right arm holding rose
      ctx.stroke();

      // THE RED ROSE 🌹 in Yuvi's Hand!
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌹', 26, 12);

      // Speech badge: "Rose for Queen Misty! 🌹💖"
      ctx.fillStyle = '#ff2a70';
      ctx.font = 'bold 10px sans-serif';
      const girlName = window.SiteConfig?.recipientName || 'Misty';
      ctx.fillText(`Rose for Queen ${girlName}! 🌹💖`, 0, 52);
    }

    ctx.restore();
  }

  // Draw Obstacles in Mode 3 (Misty's Family Enemies: Mummy, Papa, Bhai)
  drawObstacle(ctx, obs) {
    ctx.save();
    ctx.translate(obs.x, obs.y);

    const type = obs.type || 'mummy';

    // 1. Warning Halo Ring around Obstacle
    const haloColor = type === 'mummy' ? 'rgba(232, 67, 147, 0.25)' : (type === 'papa' ? 'rgba(9, 132, 227, 0.25)' : 'rgba(230, 126, 34, 0.25)');
    const strokeColor = type === 'mummy' ? '#e84393' : (type === 'papa' ? '#0984e3' : '#e67e22');

    ctx.fillStyle = haloColor;
    ctx.beginPath();
    ctx.arc(0, 4, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Render Character Body & Props
    if (type === 'mummy') {
      // 🧕 Misty ki Mummy
      // Ground Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(0, 24, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Saree / Outfit (Deep Magenta with Gold Border)
      ctx.fillStyle = '#b83280';
      ctx.beginPath();
      ctx.moveTo(-14, 22);
      ctx.lineTo(14, 22);
      ctx.lineTo(10, 0);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();

      // Gold Pallu / Border
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(12, 18);
      ctx.stroke();

      // Head / Hair (Traditional Bun)
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(0, -9, 11, 0, Math.PI * 2);
      ctx.fill();

      // Face
      ctx.fillStyle = '#ffd1ba';
      ctx.beginPath();
      ctx.arc(0, -7, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // Red Bindi & Eyes
      ctx.fillStyle = '#d63031';
      ctx.beginPath();
      ctx.arc(0, -9, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#111';
      ctx.fillRect(-3, -7, 2, 2);
      ctx.fillRect(2, -7, 2, 2);

      // Rolling Pin (Belan) in hand!
      ctx.save();
      ctx.translate(16, -6);
      ctx.rotate(-0.4);
      // Wooden Belan
      ctx.fillStyle = '#d35400';
      ctx.fillRect(-3, -12, 6, 24);
      ctx.fillStyle = '#e67e22';
      ctx.fillRect(-1.5, -16, 3, 32);
      ctx.restore();

      // Dynamic Speech bubble with random excuse
      const speechText = obs.speech || 'Roti banao! 🥖';
      ctx.font = 'bold 8.5px sans-serif';
      const textWidth = ctx.measureText(speechText).width;
      const bubbleW = Math.max(54, textWidth + 14);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#b83280';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(14, -28, bubbleW, 16, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#b83280';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(speechText, 14 + bubbleW / 2, -20);

      // Top Floating Badge: [ 🧕 ENEMY: <Girl> ki Mummy ]
      const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const badgeText = `🧕 ENEMY: ${girlName} ki Mummy`;
      ctx.font = 'bold 9.5px sans-serif';
      const badgeW = Math.max(126, ctx.measureText(badgeText).width + 18);
      ctx.fillStyle = '#e84393';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, -44, badgeW, 18, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 0, -35);

    } else if (type === 'papa') {
      // 👓 Misty ke Papa
      // Ground Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(0, 24, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Kurta / Formal Shirt (Steel Blue)
      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.moveTo(-13, 22);
      ctx.lineTo(13, 22);
      ctx.lineTo(11, -1);
      ctx.lineTo(-11, -1);
      ctx.closePath();
      ctx.fill();

      // Collar & buttons
      ctx.fillStyle = '#fff';
      ctx.fillRect(-1.5, 0, 3, 14);

      // Head / Hair (Side parted neat hair)
      ctx.fillStyle = '#2d3436';
      ctx.beginPath();
      ctx.arc(0, -10, 11, 0, Math.PI * 2);
      ctx.fill();

      // Face
      ctx.fillStyle = '#ffeaa7';
      ctx.beginPath();
      ctx.arc(0, -8, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // Glasses (Chashma 👓)
      ctx.strokeStyle = '#2d3436';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-6, -11, 4.5, 4);
      ctx.strokeRect(1.5, -11, 4.5, 4);
      ctx.beginPath();
      ctx.moveTo(-1.5, -9);
      ctx.lineTo(1.5, -9);
      ctx.stroke();

      // Mustache
      ctx.fillStyle = '#2d3436';
      ctx.fillRect(-4, -5, 8, 2);

      // Newspaper in hand (Folded white sheet with black lines)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#7f8c8d';
      ctx.lineWidth = 1;
      ctx.fillRect(12, -2, 14, 18);
      ctx.strokeRect(12, -2, 14, 18);
      ctx.fillStyle = '#2d3436';
      ctx.fillRect(14, 2, 10, 1.5);
      ctx.fillRect(14, 5, 10, 1.5);
      ctx.fillRect(14, 8, 8, 1.5);

      // Dynamic Speech bubble with random excuse
      const speechText = obs.speech || 'Kahan chali?! 🧐';
      ctx.font = 'bold 8.5px sans-serif';
      const textWidth = ctx.measureText(speechText).width;
      const bubbleW = Math.max(54, textWidth + 14);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#0984e3';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(14, -28, bubbleW, 16, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0984e3';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(speechText, 14 + bubbleW / 2, -20);

      // Top Floating Badge: [ 👓 ENEMY: <Girl> ke Papa ]
      const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const badgeText = `👓 ENEMY: ${girlName} ke Papa`;
      ctx.font = 'bold 9.5px sans-serif';
      const badgeW = Math.max(124, ctx.measureText(badgeText).width + 18);
      ctx.fillStyle = '#0984e3';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, -44, badgeW, 18, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 0, -35);

    } else {
      // 😜 Misty ka Bhai
      // Ground Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(0, 24, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Casual T-shirt (Vibrant Orange) & Jeans
      ctx.fillStyle = '#e67e22';
      ctx.fillRect(-11, 0, 22, 15);
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(-10, 15, 20, 8);

      // Head / Hair (Spiky modern haircut)
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.arc(0, -9, 10.5, 0, Math.PI * 2);
      ctx.fill();

      // Face
      ctx.fillStyle = '#ffd1ba';
      ctx.beginPath();
      ctx.arc(0, -7, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // Winking mischievous face
      ctx.fillStyle = '#111';
      ctx.fillRect(-4, -8, 2.5, 2.5); // One eye open
      // Winking eye
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(2, -7);
      ctx.lineTo(5, -7);
      ctx.stroke();

      // Grin with tongue out
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(0, -4, 2.5, 0, Math.PI);
      ctx.fill();

      // Mobile Smartphone held high to snitch!
      ctx.fillStyle = '#111';
      ctx.roundRect(11, -8, 12, 18, 2);
      ctx.fill();
      ctx.fillStyle = '#00cec9'; // Screen glowing
      ctx.fillRect(12, -7, 10, 16);
      // Flash beam 📸
      ctx.fillStyle = 'rgba(255, 234, 167, 0.7)';
      ctx.beginPath();
      ctx.moveTo(17, -8);
      ctx.lineTo(7, -22);
      ctx.lineTo(27, -22);
      ctx.closePath();
      ctx.fill();

      // Dynamic Speech bubble with random excuse
      const speechText = obs.speech || 'Photo le li! 📸';
      ctx.font = 'bold 8.5px sans-serif';
      const textWidth = ctx.measureText(speechText).width;
      const bubbleW = Math.max(54, textWidth + 14);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(14, -28, bubbleW, 16, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d35400';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(speechText, 14 + bubbleW / 2, -20);

      // Top Floating Badge: [ 😜 ENEMY: <Girl> ka Bhai ]
      const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const badgeText = `😜 ENEMY: ${girlName} ka Bhai`;
      ctx.font = 'bold 9.5px sans-serif';
      const badgeW = Math.max(124, ctx.measureText(badgeText).width + 18);
      ctx.fillStyle = '#e67e22';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, -44, badgeW, 18, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 0, -35);
    }

    ctx.restore();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.loveGame = new LoveCarGame();
  const params = new URLSearchParams(window.location.search);
  if (params.get('test_care')) {
    const type = params.get('test_care');
    setTimeout(() => {
      window.loveGame?.open();
      window.loveGame.unlockedGameModes.add(3);
      window.loveGame.switchMode(3);
      const excuse = type === 'papa' ? PAPA_BAHANE[0] : (type === 'mummy' ? MUMMY_BAHANE[0] : BHAI_BAHANE[0]);
      window.loveGame.triggerEnemyCollision(type, excuse);
    }, 500);
  } else if (params.get('open_game') === '1') {
    const targetMode = parseInt(params.get('mode') || '1', 10);
    setTimeout(() => {
      window.loveGame?.open();
      if (targetMode > 1) {
        window.loveGame.unlockedGameModes.add(targetMode);
        window.loveGame.switchMode(targetMode);
      }
      if (params.get('show_obs') === '1') {
        // Place visible obstacles on road for inspection
        window.loveGame.obstacles = [
          { x: window.loveGame.W / 2 - 60, y: 180, r: 26, type: 'papa', speech: PAPA_BAHANE[1], sway: 0, rot: 0 },
          { x: window.loveGame.W / 2 + 60, y: 320, r: 26, type: 'bhai', speech: BHAI_BAHANE[0], sway: 0, rot: 0 }
        ];
      }
    }, 400);
  }
});
