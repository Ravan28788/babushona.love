
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

  // High-Capacity IndexedDB Media Storage (No 5MB Quota Limits)
  const IDB_NAME = 'yuvi_media_db';
  const IDB_VERSION = 1;
  const IDB_STORE = 'profiles_photos';

  function openPhotoDB() {
    return new Promise((resolve) => {
      if (!window.indexedDB) return resolve(null);
      try {
        const req = indexedDB.open(IDB_NAME, IDB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  async function savePhotosToIDB(id, photosObj) {
    if (!id || !photosObj) return;
    try {
      const db = await openPhotoDB();
      if (!db) return;
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put({ id: id.toLowerCase(), photos: photosObj, updatedAt: Date.now() });
    } catch (e) {
      console.warn('IDB write failed:', e);
    }
  }

  async function getPhotosFromIDB(id) {
    if (!id) return null;
    try {
      const db = await openPhotoDB();
      if (!db) return null;
      return new Promise((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(id.toLowerCase());
        req.onsuccess = () => resolve(req.result ? req.result.photos : null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  // Client-Side Image Compression Helper (Balanced for speed, high visual quality & lightweight storage)
  function compressImageFile(file, maxWidth = 800, quality = 0.70) {
    return new Promise((resolve) => {
      if (!file) return resolve('');
      if (!file.type || !file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxWidth || h > maxWidth) {
            if (w > h) {
              h = Math.round((h * maxWidth) / w);
              w = maxWidth;
            } else {
              w = Math.round((w * maxWidth) / h);
              h = maxWidth;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  function getProfileFullPhotos(profId) {
    if (!profId) return null;
    const cleanId = profId.toLowerCase().replace(/[^a-z0-9]/g, '');
    try {
      const raw = localStorage.getItem('yuvi_photos_' + cleanId);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  }

  function saveProfiles(profiles) {
    try {
      localStorage.setItem('yuvi_profiles_db', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Profiles DB size warning, saving lightweight index:', e);
      try {
        const slim = {};
        for (const [k, v] of Object.entries(profiles)) {
          slim[k] = { ...v };
          if (slim[k].customPhotos) {
            const ph = { ...slim[k].customPhotos };
            for (const pk of Object.keys(ph)) {
              if (typeof ph[pk] === 'string' && ph[pk].startsWith('data:')) {
                ph[pk] = ''; // Retained in dedicated yuvi_photos_<id> and IDB
              }
            }
            slim[k].customPhotos = ph;
          }
          if (Array.isArray(slim[k].puzzleImages)) {
            slim[k].puzzleImages = slim[k].puzzleImages.map(img => (typeof img === 'string' && img.startsWith('data:')) ? '' : img);
          }
        }
        localStorage.setItem('yuvi_profiles_db', JSON.stringify(slim));
      } catch (err2) {
        console.warn('Fallback safe profiles save failed:', err2);
      }
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

  // 12 Visual Celebration Animation Presets & Heartfelt Content
  const TEMPLATES_PRESETS = {
    crossbow_heart: {
      name: "Crossbow Love Strike",
      occ: "birthday",
      theme: "rose-pink",
      wish: "to us and a love that blooms forever",
      voice: (girl) => `Happy Birthday ${girl}!`,
      letter: (girl, boy) => `Dear ${girl},\n\nEvery single beat of my heart belongs only to you. You are my sunshine on cloudy days, my peace when the world is chaotic, and my greatest happiness every second.\n\nHappy Birthday my gorgeous queen! May all your sweetest dreams come true!\n\nForever & Always Yours,\n${boy} ❤️💍`
    },
    gift_unboxing: {
      name: "3D Gift Box Explosion",
      occ: "birthday",
      theme: "royal-wine-gold",
      wish: "unwrapping a lifetime of sweet surprises with you",
      voice: (girl) => `Surprise! Happy Birthday ${girl}!`,
      letter: (girl, boy) => `My Sweetest ${girl},\n\nEvery day with you feels like unboxing the most precious gift universe could ever grant me! Today is your special day, and I have packed all my hugs, kisses, love and surprises just for you!\n\nHappy Birthday babu shona! 🎁✨\n\nYours endlessly,\n${boy} 💖`
    },
    apology_healing: {
      name: "Apology & Healing Heart",
      occ: "sorry_request",
      theme: "sunset-peach",
      wish: "maaf kar do na meri jaan, I am truly sorry",
      voice: (girl) => `I am so sorry ${girl}, please maaf kar do!`,
      letter: (girl, boy) => `Meri Jaan ${girl},\n\nDil se bohot bohot sorry babu... mujhse sach me galti ho gayi, par mera dil sirf aapke liye dhadakta hai. Aapke bina ek pal bhi accha nahi lagta.\n\nPlz apna gussa thook do aur ek pyaari si smile de do na meri jaan! Main aage se hamesha aapka khayal rakhunga.\n\nLove you so much,\n${boy} 🥺🌹🩹`
    },
    ring_reveal: {
      name: "Royal Velvet Ring Box",
      occ: "marriage_propose",
      theme: "royal-wine-gold",
      wish: "will you marry me and make me the happiest person alive?",
      voice: (girl) => `Will you marry me, ${girl}?`,
      letter: (girl, boy) => `My Beloved ${girl},\n\nFrom the moment you walked into my life, everything changed for the better. I want to wake up next to your smile, hold your hand through every high and low, and spend every single tomorrow loving you more than yesterday.\n\nWill you marry me and make me your forever partner? 💍🏰✨\n\nWith all my love,\n${boy} 👑❤️`
    },
    midnight_fireworks: {
      name: "Midnight Fireworks Gala",
      occ: "party",
      theme: "midnight-neon",
      wish: "lighting up the whole universe just for your smile",
      voice: (girl) => `Party time! Happy celebration ${girl}!`,
      letter: (girl, boy) => `To My Starlight ${girl},\n\nTonight the entire sky lights up to celebrate you! You bring infinite colors, joy, music and spark to my life every day. Let's make this celebration unforgettable!\n\nCheers to you and our wild happy moments! 🎆🥂\n\nForever your cheerleader,\n${boy} 💫`
    },
    sakura_waterfall: {
      name: "Sakura Blossom Rain",
      occ: "love_propose",
      theme: "rose-pink",
      wish: "falling in love with you more and more each day",
      voice: (girl) => `I love you so much, ${girl}!`,
      letter: (girl, boy) => `Sweet Angel ${girl},\n\nJust like the cherry blossoms bloom in spring, my love for you blooms deeper with every passing season. You are the gentlest, kindest, most radiant soul I have ever met.\n\nI love you unconditionally and endlessly! 🌸💕\n\nForever yours,\n${boy} 🦋`
    },
    chocolate_fondue: {
      name: "Sweet Chocolate Fondue",
      occ: "valentine",
      theme: "sweet-chocolate",
      wish: "sweeter than chocolate, 143 forever with you",
      voice: (girl) => `Happy Valentine's day my sweet ${girl}!`,
      letter: (girl, boy) => `My Sweet Babu ${girl},\n\nNothing in this world—not Belgian truffles, warm molten chocolate, or sweet berries—is even half as sweet as you! Here is a sweet ₹143 love token for you to buy whatever treats make you happy today!\n\nLove you 143 (I Love You) times infinity! 🍫🍓❤️\n\nYours,\n${boy} 🥰`
    },
    cinderella_castle: {
      name: "Fairytale Castle & Wand",
      occ: "anniversary",
      theme: "emerald-fantasy",
      wish: "our very own enchanted fairytale love story",
      voice: (girl) => `Happy Anniversary to my princess ${girl}!`,
      letter: (girl, boy) => `To My Princess ${girl},\n\nFairytales do come true, because having you in my life feels straight out of an enchanted castle dream. Thank you for being my queen and turning our ordinary days into pure magic.\n\nHappy Anniversary my love! 🏰✨👑\n\nAlways your prince,\n${boy} 🌹`
    },
    champagne_toast: {
      name: "Royal Champagne Toast",
      occ: "anniversary",
      theme: "royal-wine-gold",
      wish: "cheers to our timeless journey of love and togetherness",
      voice: (girl) => `Cheers and Happy Anniversary, ${girl}!`,
      letter: (girl, boy) => `To My Queen ${girl},\n\nRaising a toast to the most breathtaking girl, our laughs, our shared late-night conversations, and all the beautiful memories we have woven together.\n\nHere is to our forever! 🥂🍾💍\n\nWith unending love,\n${boy} ❤️`
    },
    butterfly_garden: {
      name: "Enchanted Butterfly Garden",
      occ: "love_propose",
      theme: "rose-pink",
      wish: "you give me butterflies every single time I see you",
      voice: (girl) => `You are my dream girl, ${girl}!`,
      letter: (girl, boy) => `Dearest ${girl},\n\nEven after all this time, a single glimpse of your smile still gives me butterflies like day one. You are my lucky charm, my safe haven, and my favorite thought before falling asleep.\n\nLove you beyond the stars! 🦋🌸💫\n\nForever yours,\n${boy} 💖`
    },
    vintage_scroll: {
      name: "Wax-Sealed Love Scroll",
      occ: "love_propose",
      theme: "royal-wine-gold",
      wish: "written in destiny, sealed with my heart",
      voice: (girl) => `To my queen ${girl}, forever and always!`,
      letter: (girl, boy) => `My Sovereign Queen ${girl},\n\nIf words were gold, they still wouldn't suffice to describe how deeply you are cherished. This royal scroll carries every promise, every whispered prayer, and every ounce of devotion from my soul to yours.\n\nSealed with infinite love, 📜🕯️\n${boy} 👑`
    },
    cosmic_stars: {
      name: "Cosmic Star Constellation",
      occ: "birthday",
      theme: "midnight-neon",
      wish: "out of eight billion people, my heart chose only you",
      voice: (girl) => `Happy Birthday my cosmic star ${girl}!`,
      letter: (girl, boy) => `To My Universe ${girl},\n\nAcross galaxies and billions of stars, there is no one who shines as bright as you. Today the whole cosmos aligns to celebrate the day you were born.\n\nHappy Birthday to the center of my universe! 🌌⭐✨\n\nEternally yours,\n${boy} 💫`
    },
    waterfall_cascade: {
      name: "Romantic Crystal Water Wall",
      occ: "love_propose",
      theme: "crystal-waterfall",
      wish: "my love for you flows pure, deep and eternal like an infinite waterfall",
      voice: (girl) => `I love you deeper than all the oceans, ${girl}!`,
      letter: (girl, boy) => `My Precious Queen ${girl},\n\nJust like an infinite cascading crystal mountain waterfall that never stops flowing, my devotion, love, and passion for you will flow forever.\n\nPure, glistening, and boundless—you are the greatest treasure of my life.\n\nForever & Always Yours,\n${boy} 🌊💎💙`
    },
    golden_lantern_river: {
      name: "Floating Water Lantern River",
      occ: "anniversary",
      theme: "sunset-peach",
      wish: "every glowing lantern carries a whispered wish of forever with you",
      voice: (girl) => `Happy Anniversary to my brightest light, ${girl}!`,
      letter: (girl, boy) => `Dearest ${girl},\n\nTonight we release a river of glowing golden lanterns into the starry night. On every single lantern, I have written a prayer for your endless happiness, health, and our sacred journey of love.\n\nYou illuminate my world.\n\nEternally Yours,\n${boy} 🏮✨❤️`
    },
    rose_rain_storm: {
      name: "Velvet Rose Petal Waterfall",
      occ: "valentine",
      theme: "rose-pink",
      wish: "showering you in millions of fragrant velvet red roses",
      voice: (girl) => `Happy Valentine's Day my sweetest ${girl}!`,
      letter: (girl, boy) => `My Sweetest Angel ${girl},\n\nIf I could, I would pave every path you ever walk upon with red velvet rose petals. You deserve all the romance, tenderness, flowers, and royalty in this entire universe.\n\nHappy Valentine's Day my queen!\n\nDeeply & madly in love,\n${boy} 🌹👑💖`
    },
    royal_coronation: {
      name: "Royal Queen Diamond Coronation",
      occ: "birthday",
      theme: "royal-wine-gold",
      wish: "crowning the one true sovereign queen of my heart",
      voice: (girl) => `Long live Queen ${girl}, my royal love!`,
      letter: (girl, boy) => `To Her Royal Highness, Queen ${girl},\n\nYou rule not just my world, but every single heartbeat in my chest. Wear your invisible crown with pride today and always, because in elegance, kindness, and beauty, you have no equal.\n\nHappy Birthday my Queen!\n\nForever your loyal king,\n${boy} 👑💍✨`
    },
    magic_potion_bubbles: {
      name: "Love Chemistry Laboratory",
      occ: "love_propose",
      theme: "emerald-fantasy",
      wish: "two souls mixed together creating 100% pure eternal love chemistry",
      voice: (girl) => `We have 100% pure love chemistry, ${girl}!`,
      letter: (girl, boy) => `My Sweetest ${girl},\n\nScientists say chemistry is about elements combining together, but our chemistry is pure magic! From the moment our lives blended into one, my heart discovered what true love feels like.\n\nTwo souls, one perfect formula: You & Me forever!\n\nForever your love chemist,\n${boy} 🧪💖✨`
    },
    neon_cyber_pulse: {
      name: "Neon Cyberpunk Heartbeat",
      occ: "party",
      theme: "midnight-neon",
      wish: "our energy vibrates at the highest frequency in the universe",
      voice: (girl) => `Party loud and bright, Queen ${girl}!`,
      letter: (girl, boy) => `To My Electric Soul ${girl},\n\nLife with you is a high-voltage neon dream filled with unstoppable music, wild laughs, and glowing memories! Let's turn up the bass and celebrate you tonight under the laser lights!\n\nTurn up the music!\n\nRocking with you forever,\n${boy} ⚡🎧🎉`
    }
  };

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
      this.initProfileWizard();
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
        const activeId = localStorage.getItem('yuvi_active_profile_id');
        const profiles = getStoredProfiles();
        if (activeId && activeId !== 'misty' && profiles && profiles[activeId]) {
          const p = profiles[activeId];
          const localPhotos = getProfileFullPhotos(activeId);
          const girl = p.name || p.recipientName || 'Queen';
          const boy = p.sender || p.senderName || 'Yuvi';
          const pPhotos = { ...(p.customPhotos || {}), ...(localPhotos?.customPhotos || {}) };
          const pPuzImages = (localPhotos?.puzzleImages && localPhotos.puzzleImages.length > 0) ? localPhotos.puzzleImages : (p.puzzleImages || []);
          const pAlbPhotos = (localPhotos?.albumPhotos && localPhotos.albumPhotos.length > 0) ? localPhotos.albumPhotos : (p.albumPhotos || []);
          const pPort = pPhotos.mainPortrait || pPhotos.portrait || (pPuzImages && pPuzImages[0]) || '';
          const pBg = pPhotos.bgTheme || pPhotos.bg || '';
          const pPuz = pPhotos.puzzlePhoto || pPhotos.puzzle || '';
          const pHug = pPhotos.liveHug || pPhotos.hug || '';
          const pReel = p.reel?.url || pPhotos.reelVideo || pPhotos.reel || '';
          return {
            ...DEFAULT_CONFIG,
            ...p,
            recipientName: girl,
            senderName: boy,
            nickname: p.nickname || p.pet || 'Babu Shona',
            occasion: p.occasion || p.occ || 'birthday',
            theme: p.theme || 'rose-pink',
            template: p.template || 'crossbow_heart',
            puzzleImages: pPuzImages,
            albumPhotos: pAlbPhotos,
            customWish: p.customWish || p.wish || '',
            spokenWishText: p.spokenWishText || p.voice || '',
            letterText: p.letterText || p.letter || '',
            reel: p.reel || { url: pReel },
            customPhotos: {
              ...DEFAULT_CONFIG.customPhotos,
              ...pPhotos,
              portrait: pPort,
              mainPortrait: pPort,
              bg: pBg,
              bgTheme: pBg,
              puzzle: pPuz,
              puzzlePhoto: pPuz,
              hug: pHug,
              liveHug: pHug,
              reelVideo: pReel,
              reel: pReel
            }
          };
        }
        const saved = localStorage.getItem('yuvi_admin_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          const actId = this?.activeProfileId || localStorage.getItem('yuvi_active_profile_id') || 'misty';
          const localPhotos = getProfileFullPhotos(actId);
          const mergedPhotos = { ...DEFAULT_CONFIG.customPhotos, ...(parsed.customPhotos || {}), ...(localPhotos?.customPhotos || {}) };
          const puzImgs = (localPhotos?.puzzleImages && localPhotos.puzzleImages.length > 0) ? localPhotos.puzzleImages : (parsed.puzzleImages || []);
          const albImgs = (localPhotos?.albumPhotos && localPhotos.albumPhotos.length > 0) ? localPhotos.albumPhotos : (parsed.albumPhotos || []);
          return {
            ...DEFAULT_CONFIG,
            ...parsed,
            puzzleImages: puzImgs,
            albumPhotos: albImgs,
            customPhotos: mergedPhotos
          };
        }
      } catch (e) {
        console.warn('Error loading config from localStorage:', e);
      }
      return { ...DEFAULT_CONFIG };
    }

    saveConfig(cfg) {
      this.config = { ...this.config, ...cfg };
      window.SiteConfig = this.config;
      const actId = this.activeProfileId || localStorage.getItem('yuvi_active_profile_id') || 'misty';
      try {
        if (this.config.customPhotos || this.config.puzzleImages || this.config.albumPhotos) {
          localStorage.setItem('yuvi_photos_' + actId, JSON.stringify({
            customPhotos: this.config.customPhotos || {},
            puzzleImages: this.config.puzzleImages || [],
            albumPhotos: this.config.albumPhotos || []
          }));
        }
      } catch (_) {}
      try {
        localStorage.setItem('yuvi_admin_config', JSON.stringify(this.config));
      } catch (e) {
        console.warn('Error saving config to localStorage, using safe trimmed storage:', e);
        try {
          const slimConfig = { ...this.config };
          if (slimConfig.customPhotos) {
            const ph = { ...slimConfig.customPhotos };
            for (const k of Object.keys(ph)) {
              if (typeof ph[k] === 'string' && ph[k].startsWith('data:')) ph[k] = '';
            }
            slimConfig.customPhotos = ph;
          }
          if (Array.isArray(slimConfig.puzzleImages)) {
            slimConfig.puzzleImages = slimConfig.puzzleImages.map(img => (typeof img === 'string' && img.startsWith('data:')) ? '' : img);
          }
          localStorage.setItem('yuvi_admin_config', JSON.stringify(slimConfig));
        } catch (_) {}
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

      // Multi-Profile Wizard Elements
      this.profWizardContainer = document.getElementById('profWizardContainer');
      this.btnLaunchNewWizard = document.getElementById('btnLaunchNewWizard');
      this.btnCreateNewSmall = document.getElementById('btnCreateNewSmall');
      this.btnCloseWizardBtn = document.getElementById('btnCloseWizardBtn');
      this.profWizardTitle = document.getElementById('profWizardTitle');
      this.profCountBadge = document.getElementById('profCountBadge');
      this.wizStepper = document.getElementById('wizStepper');
      this.currentWizStep = 1;

      this.profEditId = document.getElementById('profEditId');
      this.profName = document.getElementById('profName');
      this.profSender = document.getElementById('profSender');
      this.profNickname = document.getElementById('profNickname');
      this.profOccasion = document.getElementById('profOccasion');
      this.profThemeSelect = document.getElementById('profThemeSelect');
      this.profWish = document.getElementById('profWish');
      this.profVoice = document.getElementById('profVoice');
      this.profLetter = document.getElementById('profLetter');
      this.profStatusBanner = document.getElementById('profStatusBanner');
      this.profTemplateSelect = document.getElementById('profTemplateSelect');
      this.btnPreviewSelectedTemplate = document.getElementById('btnPreviewSelectedTemplate');
      this.btnAutoFillPuzzleSlots = document.getElementById('btnAutoFillPuzzleSlots');
      this.profilePausedOverlay = document.getElementById('profilePausedOverlay');
      this.pausedAdminUnlockBtn = document.getElementById('pausedAdminUnlockBtn');
      this.profLinkCard = document.getElementById('profLinkCard');
      this.profShareLinkInput = document.getElementById('profShareLinkInput');
      this.profCopyShareLinkBtn = document.getElementById('profCopyShareLinkBtn');
      this.profWhatsappBtn = document.getElementById('profWhatsappBtn');
      this.profOpenShareLinkBtn = document.getElementById('profOpenShareLinkBtn');
      this.profQrPreviewImg = document.getElementById('profQrPreviewImg');
      this.profilesListContainer = document.getElementById('profilesListContainer');

      // Wizard Nav Buttons
      this.btnWizStep1Next = document.getElementById('btnWizStep1Next');
      this.btnWizStep2Back = document.getElementById('btnWizStep2Back');
      this.btnWizStep2Next = document.getElementById('btnWizStep2Next');
      this.btnWizStep3Back = document.getElementById('btnWizStep3Back');
      this.btnWizStep3Next = document.getElementById('btnWizStep3Next');
      this.btnWizStep4Back = document.getElementById('btnWizStep4Back');
      this.btnWizSaveProfile = document.getElementById('btnWizSaveProfile');
      this.btnWizFinish = document.getElementById('btnWizFinish');
      this.btnAutoLetterPreset = document.getElementById('btnAutoLetterPreset');

      // Wizard Step 2 Photos & Gifts
      this.wizPhotoBgUrl = document.getElementById('wizPhotoBgUrl');
      this.wizPhotoPortraitUrl = document.getElementById('wizPhotoPortraitUrl');
      this.wizPhotoPuzzleUrl = document.getElementById('wizPhotoPuzzleUrl');
      this.wizPhotoHugUrl = document.getElementById('wizPhotoHugUrl');
      this.wizPhotoBgFile = document.getElementById('wizPhotoBgFile');
      this.wizPhotoPortraitFile = document.getElementById('wizPhotoPortraitFile');
      this.wizPhotoPuzzleFile = document.getElementById('wizPhotoPuzzleFile');
      this.wizPhotoHugFile = document.getElementById('wizPhotoHugFile');

      // Wizard Step 3 Payment & Music
      this.wizPaymentEnable = document.getElementById('wizPaymentEnable');
      this.wizPaymentOptionsWrap = document.getElementById('wizPaymentOptionsWrap');
      this.wizUpiId = document.getElementById('wizUpiId');
      this.wizAmount = document.getElementById('wizAmount');
      this.wizPaymentPopupText = document.getElementById('wizPaymentPopupText');
      this.wizPaymentQrUrl = document.getElementById('wizPaymentQrUrl');
      this.wizPlaylistSelect = document.getElementById('wizPlaylistSelect');
      this.wizYtUrl = document.getElementById('wizYtUrl');
      this.wizYtStart = document.getElementById('wizYtStart');
      this.wizYtEnd = document.getElementById('wizYtEnd');
      this.btnWizTestSong = document.getElementById('btnWizTestSong');
      this.btnWizStopSong = document.getElementById('btnWizStopSong');

      // MP3 Audio Upload Elements
      this.wizAudioFile = document.getElementById('wizAudioFile');
      this.wizAudioUrl = document.getElementById('wizAudioUrl');
      this.wizAudioPreview = document.getElementById('wizAudioPreview');
      this.btnTriggerAudioUpload = document.getElementById('btnTriggerAudioUpload');
      this.btnTestCustomAudio = document.getElementById('btnTestCustomAudio');
      this.btnStopCustomAudio = document.getElementById('btnStopCustomAudio');

      // Video Reel Elements
      this.wizReelFile = document.getElementById('wizReelFile');
      this.wizReelUrl = document.getElementById('wizReelUrl');
      this.wizReelPreview = document.getElementById('wizReelPreview');
      this.btnTriggerReelUpload = document.getElementById('btnTriggerReelUpload');
      this.wizReelCaption = document.getElementById('wizReelCaption');

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

      // Check for standalone demo template link (?demo_tmpl=...)
      const demoTmpl = params.get('demo_tmpl') || params.get('demo_template');
      if (demoTmpl) {
        const preset = TEMPLATES_PRESETS[demoTmpl];
        if (preset) {
          this.config.theme = preset.theme;
          this.config.occasion = preset.occ;
          this.config.customWish = preset.wish;
        }
        this.config.template = demoTmpl;
        this.config.recipientName = 'Misty';
        this.config.senderName = 'Yuvi';
        this.activeProfileId = 'misty';
        window.SiteConfig = this.config;

        // Show floating sticky demo bar on the website and auto-play intro celebration
        setTimeout(() => {
          const engine = window.celebrationAnimEngine || window.celebrationAnimation;
          if (engine) {
            engine.play(demoTmpl, 'Misty', 'Yuvi', true);
            if (engine.mountHeroTemplateTrigger) engine.mountHeroTemplateTrigger(demoTmpl, 'Misty', 'Yuvi');
          }

          const stickyBar = document.getElementById('demoModeStickyBar');
          const dmsTitle = document.getElementById('dmsTitle');
          if (stickyBar) {
            stickyBar.style.display = 'flex';
            if (dmsTitle && preset) dmsTitle.textContent = `Template: ${preset.name}`;

            document.getElementById('dmsPianoBtn')?.addEventListener('click', () => {
              window.lovePiano?.open('piano');
            });

            document.getElementById('dmsReplayBtn')?.addEventListener('click', () => {
              const eng = window.celebrationAnimEngine || window.celebrationAnimation;
              if (eng) eng.play(demoTmpl, 'Misty', 'Yuvi', true);
            });

            document.getElementById('dmsCreateBtn')?.addEventListener('click', () => {
              this.openDashboard();
              this.openNewProfileWizard();
              this.selectTemplate(demoTmpl);
            });
          }

          // In Demo Mode, unlock all 3 arcade car missions for full testing!
          if (window.loveGame) {
            window.loveGame.unlockedGameModes.add(2);
            window.loveGame.unlockedGameModes.add(3);
            window.loveGame.updateTabUI();
          }
        }, 150);
      }

      // Check for testing auto-launch (?admin_wiz=1)
      if (params.get('admin_wiz') === '1') {
        setTimeout(() => {
          this.openDashboard();
          this.openNewProfileWizard();
          if (params.get('expand') === '1') {
            const btn = document.getElementById('btnToggleAllTemplates');
            btn?.click();
          }
        }, 350);
      }

      // Check for compact portable base64 profile payload
      const pdata = params.get('pdata');
      if (pdata) {
        try {
          const decoded = JSON.parse(decodeURIComponent(escape(atob(pdata))));
          if (decoded && decoded.name) {
            if (decoded.linkActive === false) {
              this.showLinkPausedScreen(decoded);
              return;
            }
            this.config.recipientName = decoded.name;
            if (decoded.sender) this.config.senderName = decoded.sender;
            if (decoded.pet) this.config.nickname = decoded.pet;
            if (decoded.occ) this.config.occasion = decoded.occ;
            if (decoded.theme) this.config.theme = decoded.theme;
            if (decoded.template) this.config.template = decoded.template;
            if (decoded.puzzleImages) this.config.puzzleImages = decoded.puzzleImages;
            if (decoded.albumPhotos) this.config.albumPhotos = decoded.albumPhotos;
            if (decoded.wish) this.config.customWish = decoded.wish;
            if (decoded.voice) this.config.spokenWishText = decoded.voice;
            if (decoded.letter) this.config.letterText = decoded.letter;
            if (decoded.reel) this.config.reel = decoded.reel;
            if (decoded.photos) {
              const ph = decoded.photos;
              const port = ph.mainPortrait || ph.portrait || '';
              const bg = ph.bgTheme || ph.bg || '';
              const puz = ph.puzzlePhoto || ph.puzzle || '';
              const hug = ph.liveHug || ph.hug || '';
              const rVideo = decoded.reel?.url || ph.reelVideo || ph.reel || '';
              this.config.customPhotos = {
                ...this.config.customPhotos,
                ...ph,
                portrait: port,
                mainPortrait: port,
                bg: bg,
                bgTheme: bg,
                puzzle: puz,
                puzzlePhoto: puz,
                hug: hug,
                liveHug: hug,
                reelVideo: rVideo,
                reel: rVideo
              };
            }
            window.SiteConfig = this.config;
            return;
          }
        } catch (e) {
          console.warn('Error parsing pdata param:', e);
        }
      }

      // Check for profile key
      let pId = params.get('p') || params.get('profile');
      const toParam = params.get('to') || params.get('name') || params.get('girl');
      const db = getStoredProfiles();
      const cleanTo = toParam ? toParam.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
      if (cleanTo && (!pId || pId === 'misty') && db[cleanTo]) {
        pId = cleanTo;
      }

      if (pId) {
        const found = db[pId.toLowerCase()];
        const localPhotos = getProfileFullPhotos(pId.toLowerCase());
        if (found) {
          if (found.linkActive === false) {
            this.showLinkPausedScreen(found);
            return;
          }
          const girl = found.name || found.recipientName || 'Queen';
          const boy = found.sender || found.senderName || 'Yuvi';
          const pPhotos = { ...(found.customPhotos || {}), ...(localPhotos?.customPhotos || {}) };
          const pPuzImages = (localPhotos?.puzzleImages && localPhotos.puzzleImages.length > 0) ? localPhotos.puzzleImages : (found.puzzleImages || []);
          const pAlbPhotos = (localPhotos?.albumPhotos && localPhotos.albumPhotos.length > 0) ? localPhotos.albumPhotos : (found.albumPhotos || []);
          const pPortrait = pPhotos.mainPortrait || pPhotos.portrait || (pPuzImages && pPuzImages[0]) || '';
          const pBg = pPhotos.bgTheme || pPhotos.bg || '';
          const pPuzzle = pPhotos.puzzlePhoto || pPhotos.puzzle || '';
          const pHug = pPhotos.liveHug || pPhotos.hug || '';
          const pReel = found.reel?.url || pPhotos.reelVideo || pPhotos.reel || '';

          this.config = {
            ...this.config,
            ...found,
            recipientName: girl,
            senderName: boy,
            nickname: found.nickname || found.pet || 'Babu Shona',
            occasion: found.occasion || found.occ || 'birthday',
            theme: found.theme || 'rose-pink',
            template: found.template || 'crossbow_heart',
            puzzleImages: pPuzImages,
            albumPhotos: pAlbPhotos,
            customWish: found.customWish || found.wish || '',
            spokenWishText: found.spokenWishText || found.voice || '',
            letterText: found.letterText || found.letter || '',
            reel: found.reel || { url: pReel },
            customPhotos: {
              ...this.config.customPhotos,
              ...pPhotos,
              portrait: pPortrait,
              mainPortrait: pPortrait,
              bg: pBg,
              bgTheme: pBg,
              puzzle: pPuzzle,
              puzzlePhoto: pPuzzle,
              hug: pHug,
              liveHug: pHug,
              reelVideo: pReel,
              reel: pReel
            }
          };
          this.activeProfileId = pId.toLowerCase();
          window.SiteConfig = this.config;

          // Also check IndexedDB asynchronously
          getPhotosFromIDB(pId.toLowerCase()).then(idbPhotos => {
            if (idbPhotos && typeof idbPhotos === 'object') {
              this.config.customPhotos = {
                ...this.config.customPhotos,
                ...idbPhotos
              };
              if (Array.isArray(idbPhotos.puzzleImages) && idbPhotos.puzzleImages.length > 0) {
                this.config.puzzleImages = idbPhotos.puzzleImages;
              }
              if (Array.isArray(idbPhotos.albumPhotos) && idbPhotos.albumPhotos.length > 0) {
                this.config.albumPhotos = idbPhotos.albumPhotos;
              }
              window.SiteConfig = this.config;
              this.applyConfig(this.config);
              window.loveGame?.onProfileChange?.(this.config);
              window.lovePuzzle?.onProfileChange?.(this.config);
              window.birthdayGifts?.onProfileChange?.(this.config);
              window.lovePiano?.onProfileChange?.(this.config);
            }
          }).catch(() => {});
        } else if (localPhotos) {
          // Found in dedicated photos storage
          this.activeProfileId = pId.toLowerCase();
          this.config.customPhotos = { ...this.config.customPhotos, ...(localPhotos.customPhotos || {}) };
          if (Array.isArray(localPhotos.puzzleImages)) this.config.puzzleImages = localPhotos.puzzleImages;
          if (Array.isArray(localPhotos.albumPhotos)) this.config.albumPhotos = localPhotos.albumPhotos;
          window.SiteConfig = this.config;
        } else {
          // Check IndexedDB
          this.activeProfileId = pId.toLowerCase();
          getPhotosFromIDB(pId.toLowerCase()).then(idbPhotos => {
            if (idbPhotos && typeof idbPhotos === 'object') {
              this.config.customPhotos = {
                ...this.config.customPhotos,
                ...idbPhotos
              };
              if (Array.isArray(idbPhotos.puzzleImages) && idbPhotos.puzzleImages.length > 0) {
                this.config.puzzleImages = idbPhotos.puzzleImages;
              }
              if (Array.isArray(idbPhotos.albumPhotos) && idbPhotos.albumPhotos.length > 0) {
                this.config.albumPhotos = idbPhotos.albumPhotos;
              }
              window.SiteConfig = this.config;
              this.applyConfig(this.config);
              window.loveGame?.onProfileChange?.(this.config);
              window.lovePuzzle?.onProfileChange?.(this.config);
              window.birthdayGifts?.onProfileChange?.(this.config);
              window.lovePiano?.onProfileChange?.(this.config);
            }
          }).catch(() => {});
        }
      } else {
        // No explicit profile in URL, check active profile in synchronous and IDB storage
        const actId = this.activeProfileId;
        const localPhotos = getProfileFullPhotos(actId);
        if (localPhotos) {
          this.config.customPhotos = { ...this.config.customPhotos, ...(localPhotos.customPhotos || {}) };
          if (Array.isArray(localPhotos.puzzleImages)) this.config.puzzleImages = localPhotos.puzzleImages;
          if (Array.isArray(localPhotos.albumPhotos)) this.config.albumPhotos = localPhotos.albumPhotos;
          window.SiteConfig = this.config;
        }
        if (actId && actId !== 'misty') {
          getPhotosFromIDB(actId).then(idbPhotos => {
            if (idbPhotos && typeof idbPhotos === 'object') {
              this.config.customPhotos = {
                ...this.config.customPhotos,
                ...idbPhotos
              };
              if (Array.isArray(idbPhotos.puzzleImages) && idbPhotos.puzzleImages.length > 0) {
                this.config.puzzleImages = idbPhotos.puzzleImages;
              }
              if (Array.isArray(idbPhotos.albumPhotos) && idbPhotos.albumPhotos.length > 0) {
                this.config.albumPhotos = idbPhotos.albumPhotos;
              }
              window.SiteConfig = this.config;
              this.applyConfig(this.config);
              window.loveGame?.onProfileChange?.(this.config);
              window.lovePuzzle?.onProfileChange?.(this.config);
              window.birthdayGifts?.onProfileChange?.(this.config);
              window.lovePiano?.onProfileChange?.(this.config);
            }
          }).catch(() => {});
        }
      }

      // Check individual query parameters (these override stored profiles for live links!)
      const toName = params.get('to') || params.get('name') || params.get('girl');
      const fromName = params.get('from') || params.get('sender') || params.get('boy');
      const occ = params.get('occ') || params.get('occasion');
      const pet = params.get('pet') || params.get('nickname');
      const theme = params.get('theme');
      const tmplParam = params.get('tmpl') || params.get('template');
      const bgParam = params.get('bg') || params.get('bgTheme');

      if (toName || fromName || occ || pet || theme || tmplParam || bgParam) {
        if (toName) this.config.recipientName = toName.trim();
        if (fromName) this.config.senderName = fromName.trim();
        if (occ) this.config.occasion = occ.trim().toLowerCase();
        if (pet) this.config.nickname = pet.trim();
        if (theme) {
          this.config.theme = theme.trim();
          document.documentElement.setAttribute('data-theme', this.config.theme);
          document.body.setAttribute('data-theme', this.config.theme);
        }
        if (tmplParam) this.config.template = tmplParam.trim();
        if (bgParam) {
          if (!this.config.customPhotos) this.config.customPhotos = {};
          this.config.customPhotos.bg = bgParam.trim();
          this.config.customPhotos.bgTheme = bgParam.trim();
        }

        if (this.config.occasion === 'anniversary') {
          this.config.spokenWishText = `Happy Anniversary ${this.config.recipientName}!`;
          this.config.customWish = 'to our timeless love and journey together';
        } else if (this.config.occasion === 'love' || this.config.occasion === 'love_propose') {
          this.config.spokenWishText = `I Love You ${this.config.recipientName}!`;
          this.config.customWish = 'you are my whole world and my heart';
        } else if (this.config.occasion === 'sorry' || this.config.occasion === 'sorry_request') {
          this.config.spokenWishText = `Maaf Kar Do ${this.config.recipientName}! Meri Jaan, I am really sorry!`;
          this.config.customWish = 'please forgive me, you are the beat of my heart';
        } else if (this.config.occasion === 'marriage' || this.config.occasion === 'marriage_propose') {
          this.config.spokenWishText = `Will You Marry Me, ${this.config.recipientName}?`;
          this.config.customWish = 'spend your entire lifetime holding my hand';
        } else {
          this.config.spokenWishText = `Happy Birthday ${this.config.recipientName}!`;
        }

        window.SiteConfig = this.config;
      }

      const jumpParam = params.get('jump') || params.get('open');
      if (jumpParam) {
        setTimeout(() => this.jumpTo(jumpParam), 600);
      }
    }

    showLinkPausedScreen(profile) {
      const girlName = profile.name || profile.recipientName || 'Queen';
      const overlay = document.getElementById('profilePausedOverlay');
      const titleEl = document.getElementById('pausedGirlTitle');
      const subEl = document.getElementById('pausedMsg');
      if (overlay) {
        overlay.style.display = 'flex';
        if (titleEl) titleEl.textContent = `Queen ${girlName}'s Celebration is Paused ⏸️`;
        if (subEl) subEl.textContent = `Yeh romantic celebration link admin dwaara temporarily pause kar di gayi hai.`;
      }
      try {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) bgMusic.pause();
        if (this.ytAudioPlayer && this.ytAudioPlayer.pauseVideo) this.ytAudioPlayer.pauseVideo();
      } catch (_) {}
    }

    applyConfig(cfg) {
      const name = cfg.recipientName || cfg.name || 'Misty';
      const sender = cfg.senderName || cfg.sender || 'Yuvi';
      const occ = cfg.occasion || cfg.occ || 'birthday';
      const theme = cfg.theme || 'rose-pink';

      cfg.recipientName = name;
      cfg.senderName = sender;
      this.config.recipientName = name;
      this.config.senderName = sender;
      window.SiteConfig = this.config;

      const occWishMap = {
        anniversary: 'Happy Anniversary',
        party: 'Happy Party',
        love_propose: 'I Love You',
        love: 'I Love You',
        marriage_propose: 'Will You Marry Me',
        marriage: 'Will You Marry Me',
        sorry_request: 'Maaf Kar Do Meri Jaan',
        sorry: 'Maaf Kar Do Meri Jaan',
        valentine: "Happy Valentine's Day",
        birthday: 'Happy Birthday'
      };
      const occWish = occWishMap[occ] || 'Happy Birthday';

      // 1. Theme application
      document.documentElement.setAttribute('data-theme', theme);
      if (window.rebuildTreeBackground) window.rebuildTreeBackground();
      document.querySelectorAll('.theme-card-option').forEach(card => {
        card.classList.toggle('is-selected-theme', card.dataset.theme === theme);
      });

      // 2. Page Title & Meta
      document.title = `${occWish} ${name} ♥`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', `An interactive ${occ} celebration card for ${name}.`);

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

      const wHero = document.getElementById('wHero');
      if (wHero) wHero.textContent = `${occWish}, ${name}`;

      const startQuestBtn = document.getElementById('startQuestBtn');
      if (startQuestBtn) startQuestBtn.innerHTML = `💌 Start ${name}'s Love Quest &amp; Game ✨`;

      const heroPianoBtn = document.getElementById('heroPianoBtn');
      if (heroPianoBtn) heroPianoBtn.innerHTML = `🎹 Play Romantic Piano &amp; Instruments for Queen ${name} 🎵`;

      // Mount Dynamic Interactive Hero Trigger (Gift Box, Star Cannon, Chemistry, Ring Box...)
      const tmpl = cfg.template || this.config.template || 'crossbow_heart';
      const engine = window.celebrationAnimEngine || window.celebrationAnimation;
      if (engine && engine.mountHeroTemplateTrigger) {
        engine.mountHeroTemplateTrigger(tmpl, name, sender);
      }

      // 5. Subtitle / Tagline
      const wishSub = document.querySelector('.wish-subtitle');
      if (wishSub && cfg.customWish) {
        wishSub.textContent = `to us and a love that blooms — forever ${sender} & ${name}`;
      }

      // Quest Question 1 text
      const qText = document.getElementById('qText');
      if (qText) qText.textContent = `Do you love me, ${name}? 🥺💖`;

      // Car Game Tab 3 & HUD
      const tabMission3 = document.getElementById('tabMission3');
      if (tabMission3) {
        const isUnlocked = window.loveGame?.unlockedGameModes?.has(3);
        tabMission3.textContent = isUnlocked ? `👩‍❤️‍👨 3. ${name} & ${sender}` : `🔒 3. ${name} & ${sender}`;
      }
      const gameMissionName = document.getElementById('gameMissionName');
      if (gameMissionName) {
        const curMode = window.loveGame?.currentMode || 1;
        gameMissionName.textContent = curMode === 3 ? `${name} & ${sender}` : (curMode === 2 ? 'Thar 4x4' : 'Love Car');
      }
      const roseLabel = document.querySelector('.rose-label');
      if (roseLabel) roseLabel.textContent = `${sender} 🌹`;

      // In-Game Care collision modal
      const careTitle = document.querySelector('.care-title');
      if (careTitle) careTitle.textContent = `${name} babu dhyaan se aao! 🥰💋`;
      const careModalText = document.getElementById('careModalText');
      if (careModalText) {
        careModalText.innerHTML = `"Arey babu, sambhal ke chalo! Mummy, Papa ya Bhai se bach ke aao meri jaan! ${sender} samne aapke liye red rose leke wait kar raha hai! 🌹<br><br>Aapke sabhi coins 100% safe hain! Ab aaram se aao babu!"`;
      }
      const careOkBtn = document.getElementById('careOkBtn');
      if (careOkBtn) careOkBtn.textContent = 'Okk बाबू, main dhyaan se aaungi! 💖🥰';

      // Nitro modal
      const nitroTitle = document.querySelector('.nitro-title');
      if (nitroTitle) nitroTitle.textContent = `Kiss ${sender} for Super Nitro Boost! 😘`;
      const nitroSpeech = document.getElementById('nitroSpeech');
      if (nitroSpeech) {
        nitroSpeech.innerHTML = `"Pehle apne ${sender} ko sweet sweet kiss do babu, tabhi aapki car ko <strong>Super Nitro Booster</strong> milega! 🚀🔥"`;
      }

      // Game Win words
      const winLoveWords = document.getElementById('winLoveWords');
      if (winLoveWords) {
        winLoveWords.innerHTML = `"${name} my babe, meri girlfriend, meri world, mera babu shona, my love...<br>You collected all 50 love items and conquered this mission! 🏰❤️💋"`;
      }

      // Reunion Modal
      const yuviReunionTitle = document.getElementById('yuviReunionTitle');
      if (yuviReunionTitle) yuviReunionTitle.textContent = `${name} Reached ${sender}! 👩‍❤️‍💋‍👨💋`;
      const reunionBadge = document.querySelector('#yuviReunionModal .win-badge');
      if (reunionBadge) reunionBadge.textContent = `👑 ${name.toUpperCase()} & ${sender.toUpperCase()} REUNITED! 👩‍❤️‍💋‍👨`;
      const reunionHugToast = document.getElementById('reunionHugToast');
      if (reunionHugToast) reunionHugToast.innerHTML = `🌹 ${sender} presented a Red Rose &amp; sealed with tight Hugs &amp; Flying Kisses! 💋🥰`;
      const yuviSpeakerTag = document.querySelector('.yuvi-speaker-tag strong');
      if (yuviSpeakerTag) yuviSpeakerTag.textContent = `${sender} says:`;
      const yuviQuestionText = document.getElementById('yuviQuestionText');
      if (yuviQuestionText) {
        yuviQuestionText.textContent = `"${name} baby, mere paas aakar kaisa laga? Sach batana... pura din kitna miss kiya apne ${sender} ko? 🥺❤️"`;
      }

      // Puzzle elements
      const puzzleTitle = document.getElementById('puzzleTitle') || document.querySelector('.puzzle-title');
      if (puzzleTitle) {
        puzzleTitle.innerHTML = `${name}'s Love Puzzle 👩‍❤️‍👨`;
      }
      const puzzleMandatoryHeading = document.getElementById('puzzleMandatoryHeading') || document.querySelector('.pmb-heading');
      if (puzzleMandatoryHeading) {
        puzzleMandatoryHeading.innerHTML = `👑 MANDATORY NOTICE FOR QUEEN ${name.toUpperCase()}:`;
      }
      const puzzleWinTitle = document.querySelector('#puzzleWinCard .win-title');
      if (puzzleWinTitle) puzzleWinTitle.textContent = `YOU DID IT, QUEEN ${name.toUpperCase()}! 👩‍❤️‍💋‍👨💖`;
      const puzzleWinWords = document.querySelector('#puzzleWinCard .win-love-words');
      if (puzzleWinWords) {
        puzzleWinWords.innerHTML = `"${name} my babe, meri girlfriend, meri world, mera babu shona, my love...<br>Tumne hamara love puzzle solve kar diya! Tum mere dil ka sabse keemti tukda ho, aur tumhare bina meri zindagi bilkul incomplete hai! I love you so much! 💍🏰❤️💋"`;
      }
      const phTitle = document.querySelector('.ph-title');
      if (phTitle) phTitle.textContent = `${sender}'s Romantic Help Counter 💋`;
      const phSpeech = document.getElementById('phSpeech');
      if (phSpeech) {
        phSpeech.innerHTML = `"Aise hi help nahi milegi babu! 😜 Pehle apne ${sender} ko <strong>5 sweet sweet kisses</strong> do, tabhi main help karunga puzzle solve karne mein! 😘💋"`;
      }
      const phKissCountText = document.querySelector('.ph-progress-header span');
      if (phKissCountText) phKissCountText.textContent = `Kisses given to ${sender}:`;

      // Gifts & Album
      const cleanGirl = name.replace(/^Queen\s+/i, '');
      const giftsTitle = document.querySelector('.gifts-title');
      if (giftsTitle) giftsTitle.textContent = `${occWish}, Queen ${cleanGirl}! 🎂🎉`;
      const giftYuviTitle = document.querySelector('#giftCardYuvi .gift-item-title');
      if (giftYuviTitle) giftYuviTitle.textContent = `${sender} (${cleanGirl}'s Forever Boyfriend) 👑❤️`;
      const giftYuviDesc = document.querySelector('#giftCardYuvi .gift-item-desc');
      if (giftYuviDesc) {
        giftYuviDesc.textContent = `100% genuine, lifetime warranty, unlimited warm hugs & kisses, 24/7 care & loyalty, exclusively reserved for Queen ${cleanGirl} forever!`;
      }
      // Dynamic couple neon headers on thumbnail, reunion, and lightbox
      document.querySelectorAll('.tnh-boy-name').forEach(el => el.textContent = sender);
      document.querySelectorAll('.tnh-girl-name').forEach(el => el.textContent = cleanGirl);
      const unlockAllBtn = document.getElementById('adminUnlockAllBtn');
      if (unlockAllBtn) {
        unlockAllBtn.textContent = `🔓 Master Unlock ALL (Quiz, Car, Thar, ${cleanGirl}&${sender}, Piano, Puzzle, Gifts, Pay)`;
      }
      const jumpCoupleBtn = document.querySelector('.admin-jump-btn[data-jump="car3"]');
      if (jumpCoupleBtn) {
        jumpCoupleBtn.textContent = `👩‍❤️‍👨 Jump to Couple Game (${cleanGirl} & ${sender})`;
      }
      const gallerySecTitle = document.querySelector('.gallery-sec-title');
      if (gallerySecTitle) gallerySecTitle.textContent = `${cleanGirl}'s Sweetest Moments & Memories`;
      const photoTitle = document.getElementById('photoTitle');
      if (photoTitle) photoTitle.textContent = `Queen ${cleanGirl} ♥`;
      const videoBadgeTag = document.querySelector('.video-badge-tag');
      if (videoBadgeTag) videoBadgeTag.textContent = `${cleanGirl} In Motion`;

      // 6. Letter / Modal Texts
      const letterTitle = document.querySelector('.letter-title');
      if (letterTitle) letterTitle.textContent = `A Letter From My Heart To You, ${name}... 🌹`;
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

      // 7. Payment & 143 Special Promise
      const cppTag = document.querySelector('.cpp-tag');
      if (cppTag) cppTag.textContent = `🍫 SPECIAL PROMISE FROM ${sender.toUpperCase()} 🥺💖`;
      const cppSubDesc = document.querySelector('.cpp-sub-desc');
      if (cppSubDesc) {
        cppSubDesc.innerHTML = `(143 = <strong>I LOVE YOU!</strong> ❤️ Payment aate hi Queen ${name} ke liye bohot saari favourite chocolates &amp; surprise gifts reserved ho jayenge babu! 💋✨)`;
      }
      const success143Banner = document.querySelector('.success-143-banner');
      if (success143Banner) {
        success143Banner.textContent = `"143 = I LOVE YOU ${name.toUpperCase()}! FOREVER & ALWAYS!" 💖♾️`;
      }

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

      // Navigation & Wallpaper pills - dynamically pass profile names to Live Wallpaper
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('to', name);
      currentParams.set('from', sender);
      if (this.activeProfileId && this.activeProfileId !== 'misty') {
        currentParams.set('profile', this.activeProfileId);
      }
      const wpQuery = '?' + currentParams.toString();

      document.querySelectorAll('a[href*="live-wallpaper.html"], a[href*="wallpaper.html"]').forEach(a => {
        a.href = `live-wallpaper.html${wpQuery}`;
        a.title = `${sender} & ${name} Live Wallpaper`;
      });

      // Deep Universal DOM Text & Attribute Replacer
      this.deepDOMReplace(name, sender);

      // 8. Custom Photos Live Application Across Entire Website
      const p = cfg.customPhotos || {};
      const bgImg = p.bgTheme || p.bg;
      const bgHero = document.getElementById('heroBg');
      const scene = document.querySelector('.scene');
      const isMisty = !name || name.toLowerCase() === 'misty';
      document.documentElement.classList.toggle('is-misty-profile', isMisty);
      document.body.classList.toggle('is-misty-profile', isMisty);

      if (bgImg && typeof bgImg === 'string' && bgImg.trim() && !bgImg.includes('yuvi_misty_theme_bg')) {
        document.documentElement.classList.add('has-custom-bg');
        document.body.classList.add('has-custom-bg');
        document.documentElement.style.setProperty('--custom-bg-url', `url("${bgImg}")`);
        document.body.style.setProperty('--custom-bg-url', `url("${bgImg}")`);
        if (bgHero) bgHero.style.setProperty('background-image', `url("${bgImg}")`, 'important');
        if (scene) scene.style.setProperty('background-image', `url("${bgImg}")`, 'important');
        document.body.style.setProperty('background-image', `url("${bgImg}")`, 'important');
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';

        const imgObj = new Image();
        imgObj.onload = () => {
          window.__customBgImageObj = imgObj;
          if (window.rebuildTreeBackground) window.rebuildTreeBackground();
        };
        imgObj.src = bgImg;
        if (imgObj.complete && imgObj.naturalWidth > 0) {
          window.__customBgImageObj = imgObj;
          if (window.rebuildTreeBackground) window.rebuildTreeBackground();
        }
      } else {
        document.documentElement.classList.remove('has-custom-bg');
        document.body.classList.remove('has-custom-bg');
        document.documentElement.style.removeProperty('--custom-bg-url');
        document.body.style.removeProperty('--custom-bg-url');
        window.__customBgImageObj = null;
        if (bgHero) bgHero.style.removeProperty('background-image');
        if (scene) scene.style.removeProperty('background-image');
        document.body.style.removeProperty('background-image');
        if (!isMisty) {
          if (bgHero) bgHero.style.setProperty('background-image', 'none', 'important');
          if (scene) scene.style.setProperty('background-image', 'none', 'important');
        }
        if (window.rebuildTreeBackground) window.rebuildTreeBackground();
      }

      // Payment section & nav pill visibility
      const isPayEnabled = (cfg.payment && cfg.payment.enabled !== false) && (cfg.paymentEnabled !== false);
      const paySection = document.getElementById('vipPaymentSection');
      if (paySection) {
        paySection.style.display = isPayEnabled ? 'block' : 'none';
      }
      const navPayBtn = document.getElementById('navPayBtn');
      if (navPayBtn) {
        navPayBtn.style.display = isPayEnabled ? 'inline-flex' : 'none';
      }

      // Enabled games visibility
      const games = cfg.enabledGames || ['quiz', 'car1', 'car2', 'car3', 'piano', 'puzzle', 'gifts', 'kisses', 'cupid', 'fireworks', 'reel', 'letter'];
      const elPianoNav = document.getElementById('navPianoBtn') || document.getElementById('pianoNavBtn');
      const elHeroPiano = document.getElementById('heroPianoBtn');
      const isPianoOn = games.includes('piano');
      if (elPianoNav) elPianoNav.style.display = isPianoOn ? 'inline-flex' : 'none';
      if (elHeroPiano) elHeroPiano.style.display = isPianoOn ? 'inline-block' : 'none';

      const elStartQuest = document.getElementById('startQuestBtn');
      const isQuizOn = games.includes('quiz') && cfg.quizEnabled !== false;
      if (elStartQuest) {
        if (isQuizOn) {
          elStartQuest.innerHTML = `💌 Start ${name}'s Love Quest &amp; Game ✨`;
        } else {
          elStartQuest.innerHTML = `🚗 Start ${name}'s Love Adventure Games ✨`;
        }
      }

      const portraitImg = p.mainPortrait || p.portrait || (cfg.puzzleImages && cfg.puzzleImages[0]);
      if (portraitImg && typeof portraitImg === 'string' && (!isMisty || portraitImg.startsWith('data:image'))) {
        ['milestonePhotoImg', 'winMistyImg', 'puzzleRefImg', 'mistyPhotoImg'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.src = portraitImg;
        });
        document.querySelectorAll('.care-misty-img, .win-misty-img, #winMistyImg').forEach(el => el.src = portraitImg);
        document.querySelectorAll('.portrait-img, .girl-avatar-img').forEach(el => el.src = portraitImg);
      }

      // 8.1 Jigsaw Puzzle live updates
      const puzList = (cfg.puzzleImages && cfg.puzzleImages.length > 0)
        ? cfg.puzzleImages
        : [p.puzzlePhoto || p.puzzle || portraitImg].filter(Boolean);

      if (window.lovePuzzle && puzList.length > 0) {
        window.lovePuzzle.updatePuzzlePickerStrip(puzList);
        window.lovePuzzle.setImage(puzList[0]);
      }
      const puzRef = document.getElementById('puzzleRefImg');
      if (puzRef && puzList[0]) puzRef.src = puzList[0];

      // 8.2 Live Hug & Couple Photo
      const hugImg = p.liveHug || p.hug || (!isMisty ? (p.mainPortrait || p.portrait || (cfg.puzzleImages && cfg.puzzleImages[0])) : null);
      if (hugImg && typeof hugImg === 'string') {
        document.querySelectorAll('.live-hug-img').forEach(img => img.src = hugImg);
        document.querySelectorAll('img[src*="gift_yuvi_misty"]').forEach(img => img.src = hugImg);
        const cardYuviImg = document.querySelector('#giftCardYuvi .gift-thumb-img');
        if (cardYuviImg) cardYuviImg.src = hugImg;
      }

      // Dynamic neon header on couple thumbnails and lightbox
      document.querySelectorAll('.tnh-boy-name').forEach(el => el.textContent = sender);
      document.querySelectorAll('.tnh-girl-name').forEach(el => el.textContent = name);
      document.querySelectorAll('.launch-live-wallpaper-btn, a[href*="live-wallpaper"]').forEach(a => {
        a.href = `live-wallpaper.html?p=${encodeURIComponent(cfg.id || '')}&to=${encodeURIComponent(name)}&from=${encodeURIComponent(sender)}`;
      });

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

      // 8.3 Romantic Reel Video Player Live Application
      const mistyVideo = document.getElementById('mistyVideo');
      const reelUrl = cfg.reel?.url || p.reelVideo || p.reel;
      if (mistyVideo) {
        if (portraitImg) {
          mistyVideo.poster = portraitImg;
        }
        if (reelUrl && (!isMisty || !reelUrl.includes('misty_video.mp4') || reelUrl.startsWith('data:'))) {
          mistyVideo.src = reelUrl;
          mistyVideo.load();
        } else if (!isMisty && portraitImg) {
          mistyVideo.poster = portraitImg;
        }
      }
      const polaroidNote = document.querySelector('.video-caption-box .polaroid-note');
      if (polaroidNote && cfg.reel?.caption) {
        polaroidNote.textContent = `"${cfg.reel.caption}"`;
      }

      // 9. Update Spoken Voice settings
      window.adminSpokenVoice = cfg.spokenVoice;
      window.adminSpokenWishText = cfg.spokenWishText || `${occWish} ${name}!`;

      // 10. Update UI fields in dashboard if opened
      this.populateFormFields();
      this.updateGeneratedLink();

      // 11. Notify all interactive game, quiz, puzzle and gifts engines
      window.loveQuest?.onProfileChange?.(cfg);
      window.loveGame?.onProfileChange?.(cfg);
      window.lovePuzzle?.onProfileChange?.(cfg);
      window.birthdayGifts?.onProfileChange?.(cfg);
      window.lovePiano?.onProfileChange?.(cfg);
      setTimeout(() => {
        window.loveQuest?.onProfileChange?.(cfg);
        window.loveGame?.onProfileChange?.(cfg);
        window.lovePuzzle?.onProfileChange?.(cfg);
        window.birthdayGifts?.onProfileChange?.(cfg);
        window.lovePiano?.onProfileChange?.(cfg);
      }, 100);

      // 12. Update Celebration Show Button
      const playAnimBtn = document.getElementById('playTemplateAnimBtn');
      if (playAnimBtn) {
        const tmpl = cfg.template || 'crossbow_heart';
        const tmplInfo = TEMPLATES_PRESETS[tmpl];
        playAnimBtn.innerHTML = `🎬 Watch ${name}'s ${tmplInfo ? tmplInfo.name : 'Celebration Show'} ✨`;
      }

      // 13. Custom MP3 Audio Application
      const customAudio = cfg.music?.customAudio || cfg.customAudio;
      const bgAudio = document.getElementById('bgMusic');
      if (bgAudio && customAudio) {
        if (bgAudio.src !== customAudio) {
          bgAudio.src = customAudio;
          bgAudio.load();
        }
      }
    }

    deepDOMReplace(name, sender) {
      if (!name) return;
      const upperName = name.toUpperCase();
      const upperSender = (sender || 'Yuvi').toUpperCase();
      const adminAuth = document.getElementById('adminAuthModal');
      const adminDash = document.getElementById('adminDashboardModal');

      // Previous recipient/sender names to replace
      const targetGirlNames = Array.from(new Set(['Misty', this.prevRecipientName])).filter(n => n && n.toLowerCase() !== name.toLowerCase());
      const targetBoyNames = Array.from(new Set(['Yuvi', this.prevSenderName])).filter(n => n && n.toLowerCase() !== (sender || 'Yuvi').toLowerCase());

      const walk = (node) => {
        if (adminAuth && adminAuth.contains(node)) return;
        if (adminDash && adminDash.contains(node)) return;
        if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE') return;

        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.nodeValue;
          if (!text) return;
          let changed = false;

          targetGirlNames.forEach(oldGirl => {
            if (text.includes(oldGirl)) {
              text = text.split(oldGirl).join(name);
              changed = true;
            }
            const oldUpper = oldGirl.toUpperCase();
            if (text.includes(oldUpper)) {
              text = text.split(oldUpper).join(upperName);
              changed = true;
            }
          });

          targetBoyNames.forEach(oldBoy => {
            if (text.includes(oldBoy)) {
              text = text.split(oldBoy).join(sender);
              changed = true;
            }
            const oldBoyUpper = oldBoy.toUpperCase();
            if (text.includes(oldBoyUpper)) {
              text = text.split(oldBoyUpper).join(upperSender);
              changed = true;
            }
          });

          if (changed) {
            node.nodeValue = text;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          ['title', 'alt', 'placeholder', 'aria-label'].forEach(attr => {
            if (node.hasAttribute(attr)) {
              let val = node.getAttribute(attr);
              if (!val) return;
              let attrChanged = false;
              targetGirlNames.forEach(oldGirl => {
                if (val.includes(oldGirl)) {
                  val = val.split(oldGirl).join(name);
                  attrChanged = true;
                }
                const oldUpper = oldGirl.toUpperCase();
                if (val.includes(oldUpper)) {
                  val = val.split(oldUpper).join(upperName);
                  attrChanged = true;
                }
              });
              targetBoyNames.forEach(oldBoy => {
                if (val.includes(oldBoy)) {
                  val = val.split(oldBoy).join(sender);
                  attrChanged = true;
                }
              });
              if (attrChanged) {
                node.setAttribute(attr, val);
              }
            }
          });

          for (let child = node.firstChild; child; child = child.nextSibling) {
            walk(child);
          }
        }
      };

      walk(document.body);

      // Track previous names for future live toggles
      this.prevRecipientName = name;
      this.prevSenderName = sender;
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

      // Tab 3 Photos & Media fields
      const ph = this.config.customPhotos || {};
      if (this.urlBg) this.urlBg.value = ph.bgTheme || ph.bg || '';
      if (this.urlPortrait) this.urlPortrait.value = ph.mainPortrait || ph.portrait || '';
      if (this.urlPuzzle) this.urlPuzzle.value = ph.puzzlePhoto || ph.puzzle || '';
      if (this.urlHug) this.urlHug.value = ph.liveHug || ph.hug || '';
      if (this.urlGiftDress) this.urlGiftDress.value = ph.giftDress || '';
      if (this.urlGiftThar) this.urlGiftThar.value = ph.giftThar || '';
      if (this.urlGiftPs5) this.urlGiftPs5.value = ph.giftPs5 || '';
      if (this.urlPaymentQr) this.urlPaymentQr.value = ph.paymentQr || '';

      const rUrl = this.config.reel?.url || ph.reelVideo || ph.reel || '';
      const rCap = this.config.reel?.caption || '';
      const elReelUrl = document.getElementById('adminUrlReel');
      const elReelCap = document.getElementById('adminReelCaption');
      if (elReelUrl) elReelUrl.value = rUrl;
      if (elReelCap) elReelCap.value = rCap;

      const albums = this.config.albumPhotos || [];
      for (let i = 1; i <= 6; i++) {
        const inp = document.getElementById(`adminAlbum${i}Url`);
        const prev = document.getElementById(`tabAlbumPrev${i}`);
        if (inp && albums[i - 1]) {
          inp.value = albums[i - 1];
          if (prev) prev.src = albums[i - 1];
        }
      }

      const puzzles = this.config.puzzleImages || [];
      for (let i = 1; i <= 6; i++) {
        const inp = document.getElementById(`adminPuzzle${i}Url`);
        const prev = document.getElementById(`tabPuzzlePrev${i}`);
        if (inp && puzzles[i - 1]) {
          inp.value = puzzles[i - 1];
          if (prev) prev.src = puzzles[i - 1];
        }
      }
    }

    // ==========================================
    // MULTI-PROFILE CELEBRATION ENGINE
    // ==========================================
    // ==========================================
    // MULTI-PROFILE STEP-BY-STEP CELEBRATION WIZARD
    // ==========================================
    initProfileWizard() {
      // 1. Stepper Click Navigation
      document.querySelectorAll('.wiz-step').forEach(stepEl => {
        stepEl.addEventListener('click', () => {
          const targetStep = parseInt(stepEl.dataset.step, 10);
          if (targetStep) this.goToStep(targetStep);
        });
      });

      // 1.5 Template Cards Selection (18 visual celebration templates)
      const templateCards = document.querySelectorAll('.wiz-template-card');
      templateCards.forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.wt-card-actions')) return;
          const tmpl = card.dataset.template;
          this.selectTemplate(tmpl);
        });
      });

      // Toggle See All Templates Button
      const btnToggleAll = document.getElementById('btnToggleAllTemplates');
      const templatesGrid = document.getElementById('wizTemplatesGrid');
      if (btnToggleAll && templatesGrid) {
        btnToggleAll.addEventListener('click', () => {
          const isExpanded = templatesGrid.classList.toggle('is-expanded-all');
          btnToggleAll.innerHTML = isExpanded 
            ? '▲ Show Less Templates (Top 6 Popular)' 
            : '✨ See All 18+ Luxury Templates (Water Wall, Lanterns, Roses...) ⬇️';
        });
      }

      // Template Card Action Buttons: Demo Animation, Live Website Demo & Select
      document.querySelectorAll('.wt-action-btn.demo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tmpl = btn.dataset.demotemplate;
          const engine = window.celebrationAnimEngine || window.celebrationAnimation || (window.getCelebrationAnimationEngine && window.getCelebrationAnimationEngine());
          if (engine) {
            engine.play(tmpl, 'Misty', 'Yuvi', true);
            this.showToast(`🎬 Playing "${tmpl.replace(/_/g, ' ')}" Live Demo with Misty's photos! ✨`);
          } else {
            // Fallback: Open demo website directly
            window.open(`./index.html?demo_tmpl=${encodeURIComponent(tmpl)}`, '_blank');
          }
        });
      });

      // Template Card Action Buttons: View Full Demo Website
      document.querySelectorAll('.wt-action-btn.site-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tmpl = btn.dataset.sitetemplate;
          window.open(`./index.html?demo_tmpl=${encodeURIComponent(tmpl)}`, '_blank');
          this.showToast(`🌐 Opening "${tmpl.replace(/_/g, ' ')}" Full Demo Website in new tab! ✨`);
        });
      });

      document.querySelectorAll('.wt-action-btn.select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tmpl = btn.dataset.selecttemplate;
          this.selectTemplate(tmpl);
          this.goToStep(1);
          setTimeout(() => this.profName?.focus(), 120);
        });
      });

      // Preview Selected Template Animation Button
      if (this.btnPreviewSelectedTemplate) {
        this.btnPreviewSelectedTemplate.addEventListener('click', () => {
          const tmpl = this.profTemplateSelect?.value || 'crossbow_heart';
          const name = (this.profName?.value || '').trim() || 'Queen';
          const sender = (this.profSender?.value || '').trim() || 'Yuvi';
          const engine = window.celebrationAnimEngine || window.celebrationAnimation || (window.getCelebrationAnimationEngine && window.getCelebrationAnimationEngine());
          if (engine) {
            engine.play(tmpl, name, sender);
          } else {
            window.open(`./index.html?demo_tmpl=${encodeURIComponent(tmpl)}`, '_blank');
          }
        });
      }

      // Step 2: 4 Key Photos File Inputs Binding with Image Compression & Memory Cache
      this.uploadedWizardPhotos = this.uploadedWizardPhotos || {};

      const bindWizardFileInput = (fileInput, urlInput, labelName, keyName, onLoaded) => {
        if (!fileInput || !urlInput) return;
        fileInput.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            this.showToast(`⏳ Compressing ${labelName || 'photo'} for smooth performance...`);
            const dataUrl = await compressImageFile(file, 800, 0.70);
            urlInput.value = dataUrl;
            if (keyName) this.uploadedWizardPhotos[keyName] = dataUrl;
            this.showToast(`📸 Loaded ${labelName || 'photo'}: ${file.name}! ✨`);
            if (onLoaded) onLoaded(dataUrl);
          }
        });
      };

      bindWizardFileInput(this.wizPhotoBgFile, this.wizPhotoBgUrl, 'Background Wallpaper', 'bg', (dataUrl) => {
        this.uploadedWizardPhotos['bg'] = dataUrl;
        this.uploadedWizardPhotos['bgTheme'] = dataUrl;
        const bgHero = document.getElementById('heroBg');
        if (bgHero) bgHero.style.setProperty('background-image', `url("${dataUrl}")`, 'important');
      });

      bindWizardFileInput(this.wizPhotoPortraitFile, this.wizPhotoPortraitUrl, 'Main Girl Portrait', 'portrait', (dataUrl) => {
        this.uploadedWizardPhotos['portrait'] = dataUrl;
        this.uploadedWizardPhotos['mainPortrait'] = dataUrl;
        const puz1 = document.getElementById('wizPuzzle1Url');
        const puzPrev1 = document.getElementById('puzzlePrev1');
        if (puz1 && !puz1.value) {
          puz1.value = dataUrl;
          this.uploadedWizardPhotos['puzzle1'] = dataUrl;
          if (puzPrev1) puzPrev1.src = dataUrl;
        }
      });

      bindWizardFileInput(this.wizPhotoPuzzleFile, this.wizPhotoPuzzleUrl, 'Puzzle Image', 'puzzle', (dataUrl) => {
        this.uploadedWizardPhotos['puzzle'] = dataUrl;
        this.uploadedWizardPhotos['puzzlePhoto'] = dataUrl;
        const puz1 = document.getElementById('wizPuzzle1Url');
        const puzPrev1 = document.getElementById('puzzlePrev1');
        if (puz1) {
          puz1.value = dataUrl;
          this.uploadedWizardPhotos['puzzle1'] = dataUrl;
          if (puzPrev1) puzPrev1.src = dataUrl;
        }
      });

      bindWizardFileInput(this.wizPhotoHugFile, this.wizPhotoHugUrl, 'Live Hug Photo', 'hug', (dataUrl) => {
        this.uploadedWizardPhotos['hug'] = dataUrl;
        this.uploadedWizardPhotos['liveHug'] = dataUrl;
      });

      // 6 Jigsaw Puzzle Slots Binding & Auto-Fill with Compression
      for (let i = 1; i <= 6; i++) {
        const fileInput = document.getElementById(`wizPuzzle${i}File`);
        const urlInput = document.getElementById(`wizPuzzle${i}Url`);
        const imgPrev = document.getElementById(`puzzlePrev${i}`);

        if (fileInput && urlInput) {
          fileInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const dataUrl = await compressImageFile(file, 800, 0.70);
              urlInput.value = dataUrl;
              this.uploadedWizardPhotos[`puzzle${i}`] = dataUrl;
              if (imgPrev) imgPrev.src = dataUrl;
              this.showToast(`🧩 Puzzle #${i} photo updated! ✨`);
            }
          });
        }
        if (urlInput) {
          urlInput.addEventListener('input', () => {
            if (imgPrev && urlInput.value) {
              imgPrev.src = urlInput.value;
              this.uploadedWizardPhotos[`puzzle${i}`] = urlInput.value;
            }
          });
        }
      }

      // Auto-Fill Puzzle Slots Button
      if (this.btnAutoFillPuzzleSlots) {
        this.btnAutoFillPuzzleSlots.addEventListener('click', () => {
          const AESTHETIC_PUZZLE_FALLBACKS = [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
          ];
          const portraitUrl = this.wizPhotoPortraitUrl?.value;
          for (let i = 1; i <= 6; i++) {
            const urlInput = document.getElementById(`wizPuzzle${i}Url`);
            const imgPrev = document.getElementById(`puzzlePrev${i}`);
            if (urlInput) {
              if (i === 1 && portraitUrl && !urlInput.value) {
                urlInput.value = portraitUrl;
              } else if (!urlInput.value) {
                urlInput.value = AESTHETIC_PUZZLE_FALLBACKS[i - 1];
              }
              if (imgPrev && urlInput.value) imgPrev.src = urlInput.value;
            }
          }
          this.showToast('🧩 Auto-filled 6 romantic puzzle image slots! ✨');
        });
      }

      // 6 Memories & Album Slots Binding & Auto-Fill with Compression (Wizard Step 2)
      for (let i = 1; i <= 6; i++) {
        const fileInput = document.getElementById(`wizAlbum${i}File`);
        const urlInput = document.getElementById(`wizAlbum${i}Url`);
        const imgPrev = document.getElementById(`albumPrev${i}`);

        if (fileInput && urlInput) {
          fileInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const dataUrl = await compressImageFile(file, 800, 0.70);
              urlInput.value = dataUrl;
              this.uploadedWizardPhotos[`album${i}`] = dataUrl;
              if (imgPrev) imgPrev.src = dataUrl;
              this.showToast(`📸 Album #${i} photo updated! ✨`);
            }
          });
        }
        if (urlInput) {
          urlInput.addEventListener('input', () => {
            if (imgPrev && urlInput.value) {
              imgPrev.src = urlInput.value;
              this.uploadedWizardPhotos[`album${i}`] = urlInput.value;
            }
          });
        }
      }

      // Auto-Fill Album Slots Button (Wizard Step 2)
      const btnAutoFillAlbum = document.getElementById('btnAutoFillAlbumSlots');
      if (btnAutoFillAlbum) {
        btnAutoFillAlbum.addEventListener('click', () => {
          const AESTHETIC_ALBUM_FALLBACKS = [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
          ];
          const portraitUrl = this.wizPhotoPortraitUrl?.value;
          for (let i = 1; i <= 6; i++) {
            const urlInput = document.getElementById(`wizAlbum${i}Url`);
            const imgPrev = document.getElementById(`albumPrev${i}`);
            if (urlInput) {
              if (i === 1 && portraitUrl && !urlInput.value) {
                urlInput.value = portraitUrl;
              } else if (!urlInput.value) {
                urlInput.value = AESTHETIC_ALBUM_FALLBACKS[i - 1];
              }
              if (imgPrev && urlInput.value) imgPrev.src = urlInput.value;
              this.uploadedWizardPhotos[`album${i}`] = urlInput.value;
            }
          }
          this.showToast('📸 Auto-filled 6 sweetest memories album slots! ✨');
        });
      }

      // Reactive name updates in Wizard Step 1
      if (this.profName) {
        this.profName.addEventListener('input', () => {
          const name = this.profName.value.trim() || 'Queen';
          const sender = (this.profSender?.value || '').trim() || 'Yuvi';
          const occ = this.profOccasion?.value || 'birthday';
          const preset = this.getOccasionPresets(occ, name, sender);

          if (this.profVoice) {
            const cur = this.profVoice.value;
            if (!cur || cur.includes('Misty') || cur.includes('Queen') || cur.startsWith('Happy Birthday') || cur.startsWith('Happy Anniversary') || cur.startsWith('Will you marry me') || cur.startsWith('I am really sorry') || cur.startsWith('Party time')) {
              this.profVoice.value = preset.voice;
            } else {
              this.profVoice.value = cur.replace(/Misty/gi, name);
            }
          }

          if (this.profLetter) {
            const curL = this.profLetter.value;
            if (!curL || curL.includes('Misty') || curL.includes('Queen')) {
              this.profLetter.value = preset.letter;
            } else {
              this.profLetter.value = curL.replace(/Misty/gi, name);
            }
          }

          if (this.profWish) {
            this.profWish.value = preset.wish;
          }

          const g4Title = document.getElementById('wizGift4Title');
          const g4Desc = document.getElementById('wizGift4Desc');
          if (g4Title) g4Title.value = `${sender} (${name}'s Forever Boyfriend) 👑❤️`;
          if (g4Desc) g4Desc.value = `100% genuine with lifetime warranty, unlimited warm hugs & kisses, 24/7 care & loyalty, exclusively reserved for Queen ${name} forever!`;
        });
      }

      if (this.profSender) {
        this.profSender.addEventListener('input', () => {
          const sender = this.profSender.value.trim() || 'Yuvi';
          if (this.profLetter) {
            this.profLetter.value = this.profLetter.value.replace(/Yuvi/gi, sender);
          }
        });
      }

      // 2. Occasion Pills Click
      const occPills = document.querySelectorAll('.occ-pill');
      occPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const occ = pill.dataset.occ;
          occPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          if (this.profOccasion) this.profOccasion.value = occ;
          this.applyOccasionPreset(occ);
        });
      });

      // Occasion Select Dropdown Change
      if (this.profOccasion) {
        this.profOccasion.addEventListener('change', () => {
          const occ = this.profOccasion.value;
          occPills.forEach(p => p.classList.toggle('active', p.dataset.occ === occ));
          this.applyOccasionPreset(occ);
        });
      }

      // 3. Theme Cards Selection
      const themeCards = document.querySelectorAll('.wiz-theme-card');
      themeCards.forEach(card => {
        card.addEventListener('click', () => {
          const theme = card.dataset.theme;
          themeCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          if (this.profThemeSelect) this.profThemeSelect.value = theme;
        });
      });

      // 4. Gift Presets Selection
      document.querySelectorAll('#giftPresetsBar .mini-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.loadGiftPreset(btn.dataset.giftpreset);
          this.showToast(`🎁 Loaded "${btn.textContent.trim()}" into gift slots! ✨`);
        });
      });

      // 5. Auto Letter Preset Button
      if (this.btnAutoLetterPreset) {
        this.btnAutoLetterPreset.addEventListener('click', () => {
          const occ = this.profOccasion?.value || 'birthday';
          const name = (this.profName?.value || '').trim() || 'Queen';
          const sender = (this.profSender?.value || '').trim() || 'Yuvi';
          const preset = this.getOccasionPresets(occ, name, sender);
          if (this.profLetter) this.profLetter.value = preset.letter;
          if (this.profWish) this.profWish.value = preset.wish;
          if (this.profVoice) this.profVoice.value = preset.voice;
          this.showToast('💌 Auto-filled heartfelt letter template! ✨');
        });
      }

      // 6. Payment QR Checkbox Toggle
      if (this.wizPaymentEnable) {
        this.wizPaymentEnable.addEventListener('change', () => {
          if (this.wizPaymentOptionsWrap) {
            this.wizPaymentOptionsWrap.style.display = this.wizPaymentEnable.checked ? 'block' : 'none';
          }
        });
      }

      // 7. Step Navigation Buttons (Full 6 Steps)
      const stepNavMap = [
        { id: 'btnWizStep1Next', to: 2 },
        { id: 'btnWizStep2Back', to: 1 },
        { id: 'btnWizStep2Next', to: 3 },
        { id: 'btnWizStep3Back', to: 2 },
        { id: 'btnWizStep3Next', to: 4 },
        { id: 'btnWizStep4Back', to: 3 },
        { id: 'btnWizStep4Next', to: 5 },
        { id: 'btnWizStep5Back', to: 4 },
        { id: 'btnWizStep5Next', to: 6 },
        { id: 'btnWizStep6Back', to: 5 }
      ];
      stepNavMap.forEach(({ id, to }) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => this.goToStep(to));
      });

      const btnGoAnalytics = document.getElementById('btnWizGoToAnalytics');
      if (btnGoAnalytics) {
        btnGoAnalytics.addEventListener('click', () => this.switchTab('panelAnalytics'));
      }

      const btnStudioReset = document.getElementById('btnStudioResetForm');
      if (btnStudioReset) {
        btnStudioReset.addEventListener('click', () => this.openNewProfileWizard());
      }

      const btnCreateFromAnalytics = document.getElementById('btnCreateNewFromAnalytics');
      if (btnCreateFromAnalytics) {
        btnCreateFromAnalytics.addEventListener('click', () => {
          this.switchTab('panelStudio');
          this.openNewProfileWizard();
        });
      }

      const btnRefreshAnalytics = document.getElementById('btnRefreshAnalytics');
      if (btnRefreshAnalytics) {
        btnRefreshAnalytics.addEventListener('click', () => {
          this.renderAnalyticsDashboard();
          this.showToast('📡 Radar refreshed live!');
        });
      }

      if (this.btnWizSaveProfile) {
        this.btnWizSaveProfile.addEventListener('click', () => this.handleSaveProfile());
      }

      // Initialize Step 4 Games Selector, Quiz Manager & Step 5 Payment Toggle
      this.initGamesSelector();
      this.initQuizManager();
      this.initPaymentToggle();

      // 8. Open Wizard Buttons
      if (this.btnLaunchNewWizard) {
        this.btnLaunchNewWizard.addEventListener('click', () => this.openNewProfileWizard());
      }
      if (this.btnCreateNewSmall) {
        this.btnCreateNewSmall.addEventListener('click', () => this.openNewProfileWizard());
      }
      if (this.btnCloseWizardBtn) {
        this.btnCloseWizardBtn.addEventListener('click', () => {
          if (this.profWizardContainer) this.profWizardContainer.style.display = 'none';
        });
      }

      // 9. WhatsApp Share Button
      if (this.profWhatsappBtn) {
        this.profWhatsappBtn.addEventListener('click', () => {
          const url = this.profShareLinkInput?.value;
          const name = (this.profName?.value || '').trim() || 'babu';
          if (url) {
            const msg = `Mera ${name}, aapke liye ek bohot special romantic surprise website banayi hai! 💖 Jaldi se is link ko open karo babu: ${url}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
          }
        });
      }

      // 10. YouTube Snippet Test Controls
      if (this.btnWizTestSong) {
        this.btnWizTestSong.addEventListener('click', () => {
          const url = this.wizYtUrl?.value;
          const start = parseTimeToSeconds(this.wizYtStart?.value, 30);
          const end = parseTimeToSeconds(this.wizYtEnd?.value, 80);
          if (url && this.playYouTubeSnippet) {
            this.playYouTubeSnippet(url, start, end, 'Custom Hook Preview', 'Preview');
            if (this.btnWizStopSong) this.btnWizStopSong.style.display = 'inline-block';
            this.showToast('🎶 Playing YouTube Hook Snippet...');
          } else {
            this.showToast('⚠️ Kripya YouTube URL daalein!');
          }
        });
      }
      if (this.btnWizStopSong) {
        this.btnWizStopSong.addEventListener('click', () => {
          if (this.stopYouTubeSnippet) this.stopYouTubeSnippet();
          this.btnWizStopSong.style.display = 'none';
          this.showToast('⏹️ Audio preview stopped.');
        });
      }

      // 10.5 MP3 Music Upload Controls
      if (this.btnTriggerAudioUpload && this.wizAudioFile) {
        this.btnTriggerAudioUpload.addEventListener('click', () => {
          this.wizAudioFile.click();
        });
      }
      if (this.wizAudioFile) {
        this.wizAudioFile.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const dataUrl = evt.target.result;
              if (this.wizAudioUrl) this.wizAudioUrl.value = dataUrl;
              if (this.wizAudioPreview) {
                this.wizAudioPreview.src = dataUrl;
                this.wizAudioPreview.style.display = 'block';
              }
              this.showToast(`🎵 Loaded MP3: ${file.name}! ✨`);
            };
            reader.readAsDataURL(file);
          }
        });
      }
      if (this.btnTestCustomAudio) {
        this.btnTestCustomAudio.addEventListener('click', () => {
          const audioSrc = this.wizAudioUrl?.value;
          if (audioSrc && this.wizAudioPreview) {
            this.wizAudioPreview.src = audioSrc;
            this.wizAudioPreview.style.display = 'block';
            this.wizAudioPreview.play().then(() => {
              if (this.btnStopCustomAudio) this.btnStopCustomAudio.style.display = 'inline-block';
              this.showToast('▶️ Playing custom MP3 preview...');
            }).catch(err => {
              this.showToast('⚠️ Could not play audio: ' + err.message);
            });
          } else {
            this.showToast('⚠️ Kripya pehle MP3 upload karein ya audio link daalein!');
          }
        });
      }
      if (this.btnStopCustomAudio) {
        this.btnStopCustomAudio.addEventListener('click', () => {
          if (this.wizAudioPreview) {
            this.wizAudioPreview.pause();
            this.wizAudioPreview.currentTime = 0;
          }
          this.btnStopCustomAudio.style.display = 'none';
        });
      }

      // 10.6 Reel Video Upload Controls
      if (this.btnTriggerReelUpload && this.wizReelFile) {
        this.btnTriggerReelUpload.addEventListener('click', () => {
          this.wizReelFile.click();
        });
      }
      if (this.wizReelFile) {
        this.wizReelFile.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const dataUrl = evt.target.result;
              if (this.wizReelUrl) this.wizReelUrl.value = dataUrl;
              if (this.wizReelPreview) {
                this.wizReelPreview.src = dataUrl;
                this.wizReelPreview.style.display = 'block';
              }
              this.showToast(`📹 Loaded Reel Video: ${file.name}! 🎬`);
            };
            reader.readAsDataURL(file);
          }
        });
      }
      if (this.wizReelUrl) {
        this.wizReelUrl.addEventListener('input', () => {
          if (this.wizReelPreview && this.wizReelUrl.value) {
            this.wizReelPreview.src = this.wizReelUrl.value;
            this.wizReelPreview.style.display = 'block';
          }
        });
      }
    }

    selectTemplate(tmpl) {
      if (!tmpl) return;
      document.querySelectorAll('.wiz-template-card').forEach(c => {
        c.classList.toggle('active', c.dataset.template === tmpl);
      });
      if (this.profTemplateSelect) this.profTemplateSelect.value = tmpl;

      const preset = TEMPLATES_PRESETS[tmpl];
      if (preset) {
        const name = (this.profName?.value || '').trim() || 'Queen';
        const sender = (this.profSender?.value || '').trim() || 'Yuvi';

        if (this.profOccasion) {
          this.profOccasion.value = preset.occ;
          document.querySelectorAll('.occ-pill').forEach(p => p.classList.toggle('active', p.dataset.occ === preset.occ));
        }
        if (this.profThemeSelect) {
          this.profThemeSelect.value = preset.theme;
          document.querySelectorAll('.wiz-theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === preset.theme));
        }
        if (this.profWish) this.profWish.value = preset.wish;
        if (this.profVoice) this.profVoice.value = preset.voice(name);
        if (this.profLetter) this.profLetter.value = preset.letter(name, sender);

        const giftPresetKey = preset.occ === 'sorry_request' ? 'sorry' : (preset.occ === 'marriage_propose' ? 'marriage' : (preset.occ === 'anniversary' ? 'anniversary' : (preset.occ === 'party' ? 'party' : 'birthday')));
        this.loadGiftPreset(giftPresetKey);

        this.showToast(`✨ Selected "${preset.name}" celebration template!`);
      }
    }

    goToStep(stepNum) {
      if (stepNum > 1) {
        const name = (this.profName?.value || '').trim();
        if (!name) {
          this.showProfileStatus('⚠️ Kripya sabse pehle ladki ka naam (Recipient Girl Name) zaroor bharein!', true);
          if (this.profName) this.profName.focus();
          return;
        }
      }

      this.currentWizStep = stepNum;

      // Update stepper pills 1 to 6
      for (let i = 1; i <= 6; i++) {
        const pill = document.getElementById(`stepPill${i}`);
        const pane = document.getElementById(`wizPane${i}`);
        if (pill) {
          pill.classList.toggle('active', i === stepNum);
          pill.classList.toggle('completed', i < stepNum);
        }
        if (pane) {
          pane.style.display = (i === stepNum) ? 'block' : 'none';
        }
      }

      if (stepNum === 6) {
        this.updateStepSummary();
      }

      if (this.profWizardContainer) {
        this.profWizardContainer.style.display = 'block';
      }
    }

    openNewProfileWizard() {
      this.resetProfileWizard();
      if (this.profWizardContainer) {
        this.profWizardContainer.style.display = 'block';
        this.profWizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => this.profName?.focus(), 150);
    }

    updateStep4Summary() {
      const name = (this.profName?.value || '').trim() || 'Queen';
      const sender = (this.profSender?.value || '').trim() || 'Yuvi';
      const occ = this.profOccasion?.value || 'birthday';
      const theme = this.profThemeSelect?.value || 'rose-pink';
      const occPreset = this.getOccasionPresets(occ, name, sender);

      const heading = document.getElementById('sumHeading');
      if (heading) heading.textContent = `Celebration Website for Queen ${name} 👑`;

      const sRec = document.getElementById('sumRecipient');
      if (sRec) sRec.textContent = name;

      const sSend = document.getElementById('sumSender');
      if (sSend) sSend.textContent = sender;

      const sOcc = document.getElementById('sumOccasion');
      if (sOcc) sOcc.textContent = occPreset.badge || occ;

      const sTheme = document.getElementById('sumTheme');
      if (sTheme) {
        const themeLabels = {
          'rose-pink': '🌹 Romantic Rose Pink',
          'midnight-neon': '🔮 Midnight Purple & Neon',
          'royal-wine-gold': '🍷 Royal Wine & Gold',
          'sunset-peach': '🍑 Sunset Peach & Coral',
          'emerald-fantasy': '🌿 Enchanted Emerald',
          'sweet-chocolate': '🍫 Sweet Chocolate Brown'
        };
        sTheme.textContent = themeLabels[theme] || theme;
      }

      const sGifts = document.getElementById('sumGifts');
      if (sGifts) {
        const g1 = (document.getElementById('wizGift1Title')?.value || '').trim() || 'Gift 1';
        const g2 = (document.getElementById('wizGift2Title')?.value || '').trim() || 'Gift 2';
        sGifts.textContent = `${g1}, ${g2} & more`;
      }

      const sPay = document.getElementById('sumPayment');
      if (sPay) {
        const isPay = this.wizPaymentEnable ? this.wizPaymentEnable.checked : true;
        const amt = document.getElementById('wizAmount')?.value || 143;
        sPay.textContent = isPay ? `Enabled (₹${amt} Chocolate Token)` : 'Disabled';
      }
    }

    getOccasionPresets(occ, girlName = 'Queen', boyName = 'Yuvi') {
      const presets = {
        birthday: {
          badge: '🎂 Birthday Celebration',
          wish: 'to us and a love that blooms brighter with every candle',
          voice: `Happy Birthday ${girlName}!`,
          letter: `Dear ${girlName},\n\nHappy Birthday to the most beautiful queen in my life! Every time I see your smile or hear your laughter, I feel like the luckiest person in this whole universe.\n\nThank you for being my sweetness, my happiness, and my best partner in all madness. I promise to keep loving you, protecting your smile, and standing by your side in every step of life. Happy Birthday my love! ❤️🎂✨`,
          gifts: [
            { badge: 'GIFT #1 🎮📀', title: 'Sony PS5 + GTA VI CD Disc 🎮📀', desc: 'Ultra HD PlayStation 5 console bundled with Grand Theft Auto VI CD Disc! Open-world cruising with Yuvi and late-night gaming dates!', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'GIFT #2 🚙', title: 'Mahindra Thar 4x4 (Dream Beast) 🚙', desc: 'Starting with this cute mini Thar collectible for your room, and real mountain road trips with me next!', photo: './images/gift_thar.jpg' },
            { badge: 'GIFT #3 👗', title: 'Princess Dresses & Cute Outfits 👗', desc: 'The prettiest dresses for the prettiest girl in the world! To make you shine like the absolute queen you are!', photo: './images/gift_dress.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (${girlName}'s Forever Boyfriend) 👑❤️`, desc: `100% genuine, lifetime warranty, unlimited warm hugs & kisses, 24/7 care & loyalty, exclusively reserved for Queen ${girlName} forever!` }
          ]
        },
        anniversary: {
          badge: '💍 Anniversary Celebration',
          wish: 'to every shared breath and a forever promise that never fades',
          voice: `Happy Anniversary ${girlName}!`,
          letter: `My Dearest ${girlName},\n\nHappy Anniversary to the girl who changed my world forever. Looking back at our journey, every single memory with you feels like a blessing. You are my home, my peace, and my favorite chapter.\n\nThank you for choosing me every single day. Here’s to celebrating our love today, tomorrow, and for all eternity. Happy Anniversary, my soulmate! 💍🥂💖`,
          gifts: [
            { badge: 'GIFT #1 💍✨', title: 'Couple Infinity Name Rings 💍✨', desc: `Handcrafted matching platinum rings engraved with "${girlName} & ${boyName} Forever". A symbol of our infinite love.`, photo: './images/gift_dress.jpg' },
            { badge: 'GIFT #2 🏖️🌅', title: 'Romantic Maldives Sunset Villa 🏖️🌅', desc: 'Private overwater villa getaway with crystal-clear turquoise waters, candlelight beach dinners, and stargazing just for us two!', photo: './images/gift_thar.jpg' },
            { badge: 'GIFT #3 📸📖', title: 'Our Love Story Memory Scrapbook 📸📖', desc: 'A luxurious custom-bound book capturing all our romantic photos, inside jokes, travel tickets, and starry memories.', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (${girlName}'s Forever Soulmate) 👑❤️`, desc: `Lifetime warranty of endless romance, forehead kisses, and unwavering support through thick and thin!` }
          ]
        },
        party: {
          badge: '🎉 Party & Special Day',
          wish: 'to golden memories, music, and celebrating the joy of us',
          voice: `Let's Party and Celebrate, ${girlName}!`,
          letter: `Hey Beautiful ${girlName},\n\nTonight the spotlight is completely on you! Put on your favorite smile and dancing shoes, because we are going to celebrate you like royalty. Life with you is one big joyful party, and I wouldn’t trade this happiness for anything in the world. Let’s make tonight unforgettable! 🥂🎉✨`,
          gifts: [
            { badge: 'GIFT #1 🍾🥂', title: 'Golden Champagne & Royal Treats Hamper 🍾', desc: 'Sparkling premium celebratory drink paired with artisan Belgian chocolates and gourmet delights!', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'GIFT #2 👗✨', title: 'Dazzling Designer Party Evening Gown 👗', desc: 'A breathtaking emerald & gold party dress tailored to make you the undisputed center of attention!', photo: './images/gift_dress.jpg' },
            { badge: 'GIFT #3 🎵🎟️', title: 'VIP Concert & Rooftop Starlight Passes 🎵', desc: 'Exclusive front-row VIP access to our favorite romantic live concert followed by midnight rooftop dessert!', photo: './images/gift_thar.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (Your Favorite Party & Dance Partner) 👑❤️`, desc: `Your personal photographer, midnight snack partner, and biggest fan forever!` }
          ]
        },
        love_propose: {
          badge: '💖 Love Propose / Romance',
          wish: 'to the moment my heart found where it belongs — with you',
          voice: `I Love You So Much, ${girlName}!`,
          letter: `My Dearest ${girlName},\n\nFrom the moment you entered my life, everything became brighter, kinder, and so much sweeter. My heart has only one wish — to love you more with every heartbeat. You are my dream, my happiness, and my entire world.\n\nI love you unconditionally, and I want to spend all my tomorrows making you smile. Will you stay by my side forever? 💖🌹✨`,
          gifts: [
            { badge: 'GIFT #1 💖✨', title: 'Glowing Neon "I Love You" Lamp 💖', desc: `A warm pastel neon night-lamp radiating "I Love You ${girlName}" to keep your room cozy with our love.`, photo: './images/gift_dress.jpg' },
            { badge: 'GIFT #2 🧸🌹', title: '5-Foot Giant Fluffy Teddy Bear 🧸', desc: 'A super soft giant huggable teddy holding an embroidered red rose heart, waiting to give you warm cuddles!', photo: './images/gift_thar.jpg' },
            { badge: 'GIFT #3 🍫🏰', title: 'Luxury Swiss Chocolate & Ferrero Tower 🍫', desc: 'A multi-tier romantic chocolate tower packed with Dairy Milk Silk, Ferrero Rocher, and red roses.', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (${girlName}'s Forever Loyal Boyfriend) 👑❤️`, desc: `Lifetime supply of tight hugs, sweet kisses, and unconditional loyalty exclusively for you!` }
          ]
        },
        marriage_propose: {
          badge: '👰 Marriage Proposal',
          wish: 'to forever together — will you marry me and be my queen?',
          voice: `Will you marry me, ${girlName}?`,
          letter: `My Queen ${girlName},\n\nI cannot imagine waking up in a world where I don't get to call you mine. You have brought so much warmth, laughter, and grace into my life. Every dream I have for the future has you in it.\n\nOn bended knee, with my whole heart and all my love: Will you marry me, ${girlName}? Let’s build our beautiful fairytale home together! 💍🏰👑❤️`,
          gifts: [
            { badge: 'GIFT #1 💎💍', title: 'Platinum Solitaire Engagement Diamond Ring 💎', desc: 'A brilliant, conflict-free solitaire diamond resting in timeless platinum. A forever promise on your finger.', photo: './images/gift_dress.jpg' },
            { badge: 'GIFT #2 🌹🔮', title: '1000 Preserved Red Roses Crystal Dome 🌹', desc: 'A grand crystal dome preserving 1000 velvety red roses that will stay fresh and bloom forever, just like our bond.', photo: './images/gift_thar.jpg' },
            { badge: 'GIFT #3 🏰🕯️', title: 'Fairytale Royal Palace Proposal Dinner 🏰', desc: 'A private heritage palace rooftop reservation with candlelit pathway, live violin, and midnight fireworks!', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (Your Groom & Forever Husband) 👑💍`, desc: `Promising to cherish you, cook for you, wipe every tear, celebrate every victory, and adore you every single day of our lives!` }
          ]
        },
        sorry_request: {
          badge: '🥺 Sorry Request ("Maaf Kar Do")',
          wish: 'mera babu shona, please gussa chhod do na... I am so sorry 🥺',
          voice: `I am really sorry ${girlName}, please maaf kar do na! 🥺❤️`,
          letter: `Mera Babu Shona ${girlName},\n\nArey meri jaan, sach me bohot badi galti ho gayi mujhse... please gussa mat ho na! 🥺 Jab aap naraz hoti ho na, toh mera dil bilkul udaas ho jata hai aur kuch bhi acha nahi lagta.\n\nKaan pakad ke sorry bol raha hu babu! Main promise karta hu aage se dhyan rakhunga. Ek pyari si smile de do meri princess aur apne ${boyName} ko maaf kar do... I love you so much meri jaan! 🥺❤️🍫🧸`,
          gifts: [
            { badge: 'GIFT #1 🐼🥺', title: 'Super Cute "I am Sorry" Panda Plushie 🐼', desc: 'A cute innocent panda with folded paws and teary eyes asking Queen for sweet forgiveness! Ready for tight hugs.', photo: './images/gift_dress.jpg' },
            { badge: 'GIFT #2 🍫🌹', title: 'Dairy Milk Silk Tower & Red Roses Bouquet 🍫', desc: 'Queen ki favourite chocolates ka bada bouquet! Gussa pighlaane ke liye sabse sweet chocolate treat!', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'GIFT #3 📜🧸', title: 'Lifetime Apology & Unlimited Hugs Contract 📜', desc: 'Official signed love agreement: 100% unconditional apologies, 0 ego, and unlimited warm kisses anytime you ask!', photo: './images/gift_thar.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (${girlName}'s Apology Boy & Forever Protector) 🥺❤️`, desc: `100% sorry, ready to do 100 sit-ups, and promising to keep Queen smiling forever!` }
          ]
        },
        valentine: {
          badge: "🌹 Valentine's Special",
          wish: 'to the one who makes every single day feel like Valentine',
          voice: `Happy Valentine's Day ${girlName}!`,
          letter: `My Valentine ${girlName},\n\nEvery day with you feels like Valentine’s Day. You make love feel so effortless, pure, and magical. Thank you for filling my life with roses, sweet hugs, and sweet butterflies.\n\nBe my Valentine today, tomorrow, and every year for the rest of our lives. I adore you, my queen! 🌹🍫💖`,
          gifts: [
            { badge: 'GIFT #1 🌹🍫', title: 'Valentine Luxury Romance Hamper 🌹', desc: 'A massive heart-shaped gift hamper with red roses, artisan chocolates, scented candles, and cute love notes.', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'GIFT #2 💖✨', title: 'Custom Love Star & Moon Pendant 💖', desc: 'Rose gold engraved pendant shining bright like our love in the starlight.', photo: './images/gift_dress.jpg' },
            { badge: 'GIFT #3 🚙🏔️', title: 'Weekend Romantic Road Trip Voucher 🚙', desc: 'Scenic mountain drive together with romantic songs playing, cool breeze, and stargazing.', photo: './images/gift_thar.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (Your Forever Valentine) 👑❤️`, desc: `Reserved exclusively for Queen ${girlName} with 100% devotion and unlimited flying kisses!` }
          ]
        },
        other: {
          badge: '✨ Special Celebration',
          wish: 'to moments that turn into forever memories',
          voice: `A Special Surprise Just for You, ${girlName}!`,
          letter: `Dear ${girlName},\n\nToday is a special celebration just for you! Every milestone with you is worth celebrating. Thank you for bringing so much sweetness and love into my life.\n\nHere’s to many more smiles, laughter, and sweet surprises together. You are my favorite person! ✨💖`,
          gifts: [
            { badge: 'GIFT #1 🎁✨', title: 'Surprise Mystery Gift Box 🎁', desc: 'A curated box packed with wonderful surprises and personal favorites chosen just for you!', photo: './images/gift_ps5_gta6.jpg' },
            { badge: 'GIFT #2 🚙✨', title: 'Adventure Road Trip Pass 🚙', desc: 'A road trip to your dream destination with great music and memories!', photo: './images/gift_thar.jpg' },
            { badge: 'GIFT #3 👗✨', title: 'Royal Queen Outfit 👗', desc: 'A gorgeous designer dress to make you feel like the royal queen you are!', photo: './images/gift_dress.jpg' },
            { badge: 'LIFETIME GIFT 👑💍', title: `${boyName} (Your Forever Companion) 👑❤️`, desc: `Lifetime warranty of endless smiles, care, and love exclusively for Queen ${girlName}!` }
          ]
        }
      };
      return presets[occ] || presets.birthday;
    }

    applyOccasionPreset(occ) {
      const name = (this.profName?.value || '').trim() || 'Queen';
      const sender = (this.profSender?.value || '').trim() || 'Yuvi';
      const preset = this.getOccasionPresets(occ, name, sender);

      if (this.profWish) this.profWish.value = preset.wish;
      if (this.profVoice) this.profVoice.value = preset.voice;
      if (this.profLetter) this.profLetter.value = preset.letter;

      // Also set matching gifts preset in step 2
      this.loadGiftPreset(occ);
    }

    loadGiftPreset(presetKey) {
      const name = (this.profName?.value || '').trim() || 'Queen';
      const sender = (this.profSender?.value || '').trim() || 'Yuvi';
      const preset = this.getOccasionPresets(presetKey, name, sender);
      const gifts = preset.gifts || [];

      if (gifts[0]) {
        const b = document.getElementById('wizGift1Badge');
        const t = document.getElementById('wizGift1Title');
        const d = document.getElementById('wizGift1Desc');
        const p = document.getElementById('wizGift1Photo');
        if (b) b.value = gifts[0].badge;
        if (t) t.value = gifts[0].title;
        if (d) d.value = gifts[0].desc;
        if (p) p.value = gifts[0].photo || '';
      }
      if (gifts[1]) {
        const b = document.getElementById('wizGift2Badge');
        const t = document.getElementById('wizGift2Title');
        const d = document.getElementById('wizGift2Desc');
        const p = document.getElementById('wizGift2Photo');
        if (b) b.value = gifts[1].badge;
        if (t) t.value = gifts[1].title;
        if (d) d.value = gifts[1].desc;
        if (p) p.value = gifts[1].photo || '';
      }
      if (gifts[2]) {
        const b = document.getElementById('wizGift3Badge');
        const t = document.getElementById('wizGift3Title');
        const d = document.getElementById('wizGift3Desc');
        const p = document.getElementById('wizGift3Photo');
        if (b) b.value = gifts[2].badge;
        if (t) t.value = gifts[2].title;
        if (d) d.value = gifts[2].desc;
        if (p) p.value = gifts[2].photo || '';
      }
      if (gifts[3]) {
        const b = document.getElementById('wizGift4Badge');
        const t = document.getElementById('wizGift4Title');
        const d = document.getElementById('wizGift4Desc');
        if (b) b.value = gifts[3].badge;
        if (t) t.value = gifts[3].title;
        if (d) d.value = gifts[3].desc;
      }
    }

    handleSaveProfile() {
      const name = (this.profName?.value || '').trim();
      const sender = (this.profSender?.value || '').trim() || 'Yuvi';
      const pet = (this.profNickname?.value || '').trim() || 'Babu Shona';
      const occ = this.profOccasion?.value || 'birthday';
      const theme = this.profThemeSelect?.value || 'rose-pink';
      const wish = (this.profWish?.value || '').trim() || 'to us and a love that blooms';
      const voice = (this.profVoice?.value || '').trim() || (occ === 'anniversary' ? `Happy Anniversary ${name}!` : `Happy Birthday ${name}!`);
      const letter = (this.profLetter?.value || '').trim() || `Dear ${name},\n\nI love you forever! ❤️✨`;

      if (!name) {
        this.showProfileStatus('⚠️ Kripya ladki ka naam (Recipient Name) zaroor daalein!', true);
        this.goToStep(1);
        return;
      }

      const editId = this.profEditId?.value;
      let profId = editId ? editId : name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (editId === 'misty' && name.toLowerCase() !== 'misty') {
        profId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      if (!profId) profId = 'queen' + Date.now().toString(36);

      const profiles = getStoredProfiles();
      const existingPhotos = profiles[profId]?.customPhotos || (profId === 'misty' ? this.config.customPhotos : {}) || {};

      // Gather photos from memory cache first, then inputs, then existing
      const bgVal = this.uploadedWizardPhotos?.bg || this.uploadedWizardPhotos?.bgTheme || this.wizPhotoBgUrl?.value || existingPhotos.bg || existingPhotos.bgTheme || '';
      const portraitVal = this.uploadedWizardPhotos?.portrait || this.uploadedWizardPhotos?.mainPortrait || this.wizPhotoPortraitUrl?.value || existingPhotos.portrait || existingPhotos.mainPortrait || '';
      const puzzleVal = this.uploadedWizardPhotos?.puzzle || this.uploadedWizardPhotos?.puzzlePhoto || this.wizPhotoPuzzleUrl?.value || existingPhotos.puzzle || existingPhotos.puzzlePhoto || '';
      const hugVal = this.uploadedWizardPhotos?.hug || this.uploadedWizardPhotos?.liveHug || this.wizPhotoHugUrl?.value || existingPhotos.hug || existingPhotos.liveHug || '';
      const reelVal = this.uploadedWizardPhotos?.reel || this.wizReelUrl?.value || existingPhotos.reelVideo || existingPhotos.reel || '';

      const customPhotos = {
        ...existingPhotos,
        bg: bgVal,
        bgTheme: bgVal,
        portrait: portraitVal,
        mainPortrait: portraitVal,
        puzzle: puzzleVal,
        puzzlePhoto: puzzleVal,
        hug: hugVal,
        liveHug: hugVal,
        giftDress: document.getElementById('wizGift3Photo')?.value || existingPhotos.giftDress || '',
        giftThar: document.getElementById('wizGift2Photo')?.value || existingPhotos.giftThar || '',
        giftPs5: document.getElementById('wizGift1Photo')?.value || existingPhotos.giftPs5 || '',
        paymentQr: this.wizPaymentQrUrl?.value || existingPhotos.paymentQr || '',
        reelVideo: reelVal,
        reel: reelVal
      };

      // Gather 4 Custom Gifts
      const customGifts = [
        {
          badge: document.getElementById('wizGift1Badge')?.value || 'GIFT #1 🎮',
          title: document.getElementById('wizGift1Title')?.value || 'Sony PS5',
          desc: document.getElementById('wizGift1Desc')?.value || 'PlayStation 5 console',
          photo: document.getElementById('wizGift1Photo')?.value || './images/gift_ps5_gta6.jpg'
        },
        {
          badge: document.getElementById('wizGift2Badge')?.value || 'GIFT #2 🚙',
          title: document.getElementById('wizGift2Title')?.value || 'Mahindra Thar 4x4',
          desc: document.getElementById('wizGift2Desc')?.value || 'Dream beast off-roader',
          photo: document.getElementById('wizGift2Photo')?.value || './images/gift_thar.jpg'
        },
        {
          badge: document.getElementById('wizGift3Badge')?.value || 'GIFT #3 👗',
          title: document.getElementById('wizGift3Title')?.value || 'Princess Dresses',
          desc: document.getElementById('wizGift3Desc')?.value || 'Royal designer outfits',
          photo: document.getElementById('wizGift3Photo')?.value || './images/gift_dress.jpg'
        },
        {
          badge: document.getElementById('wizGift4Badge')?.value || 'LIFETIME GIFT 👑💍',
          title: document.getElementById('wizGift4Title')?.value || `${sender} (${name}'s Forever Boyfriend) 👑❤️`,
          desc: document.getElementById('wizGift4Desc')?.value || `100% genuine with lifetime warranty, exclusively reserved for Queen ${name}!`,
          photo: hugVal || portraitVal || ''
        }
      ];

      // Gather Payment settings
      const payment = {
        enabled: this.wizPaymentEnable ? this.wizPaymentEnable.checked : true,
        upiId: this.wizUpiId?.value || 'baby8389@nyes',
        amount: parseInt(this.wizAmount?.value || '143', 10),
        popupText: this.wizPaymentPopupText?.value || '143 AMMOUNT PAY KRDO, CHOCLATE KHARID KE TUM KO DUNGA! 🥰🍫',
        qrImage: this.wizPaymentQrUrl?.value || ''
      };

      // Gather Music & Reel settings
      const music = {
        playlist: this.wizPlaylistSelect?.value || 'happybirthday',
        customAudio: this.wizAudioUrl?.value || '',
        youtubeUrl: this.wizYtUrl?.value || '',
        hookStart: parseTimeToSeconds(this.wizYtStart?.value, 30),
        hookEnd: parseTimeToSeconds(this.wizYtEnd?.value, 80)
      };

      const reel = {
        url: reelVal || './images/misty_video.mp4',
        caption: this.wizReelCaption?.value || 'Seeing you smile is my favorite view! 🥰🎬🌹'
      };

      // Gather all 6 puzzle images!
      let puzzleImages = [
        this.uploadedWizardPhotos?.puzzle1 || document.getElementById('wizPuzzle1Url')?.value || customPhotos.puzzle || customPhotos.portrait || '',
        this.uploadedWizardPhotos?.puzzle2 || document.getElementById('wizPuzzle2Url')?.value || '',
        this.uploadedWizardPhotos?.puzzle3 || document.getElementById('wizPuzzle3Url')?.value || '',
        this.uploadedWizardPhotos?.puzzle4 || document.getElementById('wizPuzzle4Url')?.value || '',
        this.uploadedWizardPhotos?.puzzle5 || document.getElementById('wizPuzzle5Url')?.value || '',
        this.uploadedWizardPhotos?.puzzle6 || document.getElementById('wizPuzzle6Url')?.value || ''
      ].filter(Boolean);

      if (puzzleImages.length === 0 && (portraitVal || puzzleVal)) {
        puzzleImages = [portraitVal || puzzleVal];
      }

      // Gather all 6 memories & album images!
      let albumPhotos = [
        this.uploadedWizardPhotos?.album1 || document.getElementById('wizAlbum1Url')?.value || customPhotos.portrait || '',
        this.uploadedWizardPhotos?.album2 || document.getElementById('wizAlbum2Url')?.value || '',
        this.uploadedWizardPhotos?.album3 || document.getElementById('wizAlbum3Url')?.value || '',
        this.uploadedWizardPhotos?.album4 || document.getElementById('wizAlbum4Url')?.value || '',
        this.uploadedWizardPhotos?.album5 || document.getElementById('wizAlbum5Url')?.value || '',
        this.uploadedWizardPhotos?.album6 || document.getElementById('wizAlbum6Url')?.value || ''
      ].filter(Boolean);

      if (albumPhotos.length === 0 && (portraitVal || puzzleVal)) {
        albumPhotos = [portraitVal || puzzleVal];
      }

      // Selected Celebration Animation Template
      const template = this.profTemplateSelect?.value || 'crossbow_heart';

      // Save high-capacity media into dedicated synchronous localStorage key and IndexedDB
      try {
        localStorage.setItem('yuvi_photos_' + profId, JSON.stringify({
          customPhotos: customPhotos,
          puzzleImages: puzzleImages,
          albumPhotos: albumPhotos
        }));
      } catch (e) {
        console.warn('Dedicated profile photos storage warning:', e);
      }
      savePhotosToIDB(profId, { ...customPhotos, puzzleImages, albumPhotos });
      savePhotosToIDB('__active__', { ...customPhotos, puzzleImages, albumPhotos });

      // Collect enabled games
      const gameCheckboxes = document.querySelectorAll('.games-selector-grid input[type="checkbox"]');
      let enabledGames = Array.from(gameCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
      if (enabledGames.length === 0) {
        enabledGames = ['quiz', 'car1', 'car2', 'car3', 'piano', 'puzzle', 'gifts', 'kisses', 'cupid', 'fireworks', 'reel', 'letter'];
      }

      // Collect quiz settings & questions
      const quizEnabled = document.getElementById('wizQuizEnable') ? document.getElementById('wizQuizEnable').checked : true;
      const quizQuestions = [];
      document.querySelectorAll('#wizQuizQuestionsList .quiz-q-card').forEach(card => {
        const q = card.querySelector('.quiz-q-text')?.value.trim();
        const yes = card.querySelector('.quiz-q-yes')?.value.trim();
        const no = card.querySelector('.quiz-q-no')?.value.trim();
        if (q) {
          quizQuestions.push({ q, yes: yes || 'YAYYY! I love you so much! 🥰❤️', no: no || 'Can\'t touch this! 😜' });
        }
      });

      const newProfile = {
        id: profId,
        name: name,
        sender: sender,
        nickname: pet,
        occasion: occ,
        theme: theme,
        template: template,
        puzzleImages: puzzleImages,
        albumPhotos: albumPhotos,
        linkActive: (profiles[profId]?.linkActive !== undefined) ? profiles[profId].linkActive : true,
        customWish: wish,
        spokenVoice: true,
        spokenWishText: voice,
        letterText: letter,
        customPhotos: customPhotos,
        customGifts: customGifts,
        payment: payment,
        paymentEnabled: payment.enabled,
        music: music,
        reel: reel,
        enabledGames: enabledGames,
        quizEnabled: quizEnabled,
        quizQuestions: quizQuestions.length > 0 ? quizQuestions : this.getDefaultQuizQuestions(name, sender),
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
        template: template,
        puzzleImages: puzzleImages,
        albumPhotos: albumPhotos,
        customWish: wish,
        spokenWishText: voice,
        letterText: letter,
        customPhotos: { ...newProfile.customPhotos },
        customGifts: customGifts,
        payment: payment,
        paymentEnabled: payment.enabled,
        music: music,
        reel: reel
      };
      this.saveConfig(this.config);
      this.applyConfig(this.config);

      // Generate Link
      const shareUrl = this.generateProfileUrl(newProfile);
      if (this.profShareLinkInput) this.profShareLinkInput.value = shareUrl;

      // Show Link Box & QR Preview
      if (this.profLinkCard) this.profLinkCard.style.display = 'block';
      if (this.profQrPreviewImg) {
        this.renderQrCode(this.profQrPreviewImg, shareUrl);
      }

      this.showProfileStatus(`🎉 Profile "<strong>${name}</strong>" created successfully! Unique shareable link ready niche! 💖`, false);
      this.renderProfilesList();
      this.renderAnalyticsDashboard();
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

    renderQrCode(imgEl, targetUrl) {
      if (!imgEl) return;
      let shortUrl = targetUrl;
      try {
        const u = new URL(targetUrl, window.location.href);
        const sp = new URLSearchParams();
        if (u.searchParams.has('p')) sp.set('p', u.searchParams.get('p'));
        if (u.searchParams.has('to')) sp.set('to', u.searchParams.get('to'));
        if (u.searchParams.has('from')) sp.set('from', u.searchParams.get('from'));
        if (u.searchParams.has('occ')) sp.set('occ', u.searchParams.get('occ'));
        if (u.searchParams.has('theme')) sp.set('theme', u.searchParams.get('theme'));
        shortUrl = `${u.origin}${u.pathname}?${sp.toString()}`;
      } catch (_) {}

      imgEl.onerror = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 220;
          canvas.height = 220;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 220, 220);
          ctx.strokeStyle = '#ff2a70';
          ctx.lineWidth = 4;
          ctx.strokeRect(6, 6, 208, 208);
          const drawCorner = (x, y) => {
            ctx.fillStyle = '#111111';
            ctx.fillRect(x, y, 40, 40);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 6, y + 6, 28, 28);
            ctx.fillStyle = '#ff2a70';
            ctx.fillRect(x + 11, y + 11, 18, 18);
          };
          drawCorner(18, 18);
          drawCorner(162, 18);
          drawCorner(18, 162);
          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💖', 110, 110);
          imgEl.src = canvas.toDataURL('image/png');
        } catch (_) {}
      };

      imgEl.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(shortUrl);
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
      if (profile.template) params.set('tmpl', profile.template);

      // Compact payload for full fidelity across other devices (without large base64 so URL stays clean)
      const cleanPhotos = {};
      if (profile.customPhotos) {
        for (const [k, v] of Object.entries(profile.customPhotos)) {
          if (typeof v === 'string' && !v.startsWith('data:')) {
            cleanPhotos[k] = v;
          }
        }
      }
      const cleanPuzzleImages = Array.isArray(profile.puzzleImages)
        ? profile.puzzleImages.filter(img => typeof img === 'string' && !img.startsWith('data:'))
        : [];
      const cleanAlbumPhotos = Array.isArray(profile.albumPhotos)
        ? profile.albumPhotos.filter(img => typeof img === 'string' && !img.startsWith('data:'))
        : [];

      const payload = {
        name: profile.name,
        sender: profile.sender,
        pet: profile.nickname,
        occ: profile.occasion,
        theme: profile.theme,
        template: profile.template || 'crossbow_heart',
        puzzleImages: cleanPuzzleImages,
        albumPhotos: cleanAlbumPhotos,
        linkActive: profile.linkActive !== false,
        wish: profile.customWish,
        voice: profile.spokenWishText,
        letter: profile.letterText,
        photos: cleanPhotos,
        customGifts: profile.customGifts || [],
        payment: profile.payment || {},
        music: profile.music || {},
        reel: (profile.reel?.url && !profile.reel.url.startsWith('data:')) ? profile.reel : {}
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
      const keys = Object.keys(profiles);

      if (this.profCountBadge) {
        this.profCountBadge.textContent = keys.length;
      }

      let html = '';
      keys.forEach(key => {
        const p = profiles[key];
        const isActive = (key === activeId);
        const occEmoji = p.occasion === 'anniversary' ? '💍' : (p.occasion === 'sorry_request' ? '🥺' : (p.occasion === 'marriage_propose' ? '👰' : (p.occasion === 'party' ? '🎉' : (p.occasion === 'love_propose' ? '💖' : '👸'))));

        html += `
          <div class="profile-item-card ${isActive ? 'is-active-profile' : ''}">
            <div class="pro-card-info">
              <span class="pro-avatar">${occEmoji}</span>
              <div>
                <div class="pro-name-row">
                  ${p.name}
                  ${isActive ? '<span class="pro-badge active-badge">Active 🟢</span>' : ''}
                  <span class="pro-badge occ-badge">${p.occasion}</span>
                  <span class="pro-badge theme-badge">${p.theme || 'rose-pink'}</span>
                  ${p.template ? `<span class="pro-badge theme-badge">🎬 ${p.template.replace(/_/g, ' ')}</span>` : ''}
                </div>
                <div class="pro-sub-meta">
                  From: <strong>${p.sender}</strong> &bull; Nickname: <em>${p.nickname}</em> &bull; Link: <strong>${p.linkActive !== false ? 'Active 🟢' : 'Paused 🔴'}</strong>
                </div>
              </div>
            </div>
            <div class="pro-card-actions">
              <button type="button" class="pro-btn status-btn ${p.linkActive !== false ? 'active-link' : 'paused-link'}" data-togglelink="${p.id}">
                ${p.linkActive !== false ? '🟢 Link Active' : '🔴 Link Paused'}
              </button>
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
      this.profilesListContainer.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const profId = btn.dataset.togglelink;
          const profiles = getStoredProfiles();
          if (profiles[profId]) {
            profiles[profId].linkActive = (profiles[profId].linkActive === false) ? true : false;
            saveProfiles(profiles);
            this.renderProfilesList();
            this.showToast(`Link for "${profiles[profId].name}" is now ${profiles[profId].linkActive ? 'Active 🟢' : 'Paused ⏸️'}!`);
          }
        });
      });

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
          this.loadProfileIntoWizard(btn.dataset.editprof);
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
        customPhotos: { ...(p.customPhotos || {}) },
        customGifts: p.customGifts || [],
        payment: p.payment || {},
        music: p.music || {}
      };
      this.saveConfig(this.config);

      const shareUrl = this.generateProfileUrl(p);
      if (this.profShareLinkInput) this.profShareLinkInput.value = shareUrl;

      this.renderProfilesList();
      this.showToast(`⚡ Profile "${p.name}" is now live on the entire portal! 💖`);
      if (window.soundFX) window.soundFX.chime(1.4);
    }

    loadProfileIntoWizard(profId) {
      const profiles = getStoredProfiles();
      const p = profiles[profId];
      if (!p) return;

      if (this.profEditId) this.profEditId.value = p.id;
      if (this.profWizardTitle) this.profWizardTitle.textContent = `✏️ Edit Profile: ${p.name}`;

      if (this.profName) this.profName.value = p.name;
      if (this.profSender) this.profSender.value = p.sender;
      if (this.profNickname) this.profNickname.value = p.nickname;
      if (this.profOccasion) this.profOccasion.value = p.occasion;
      if (this.profThemeSelect) this.profThemeSelect.value = p.theme || 'rose-pink';
      if (this.profWish) this.profWish.value = p.customWish;
      if (this.profVoice) this.profVoice.value = p.spokenWishText;
      if (this.profLetter) this.profLetter.value = p.letterText;

      // Sync occasion pills
      document.querySelectorAll('.occ-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.occ === p.occasion);
      });

      // Sync celebration template
      const tmpl = p.template || 'crossbow_heart';
      if (this.profTemplateSelect) this.profTemplateSelect.value = tmpl;
      document.querySelectorAll('.wiz-template-card').forEach(card => {
        card.classList.toggle('active', card.dataset.template === tmpl);
      });

      // Sync all 6 puzzle image slots
      if (Array.isArray(p.puzzleImages)) {
        p.puzzleImages.forEach((imgUrl, idx) => {
          const num = idx + 1;
          const urlInput = document.getElementById(`wizPuzzle${num}Url`);
          const imgPrev = document.getElementById(`puzzlePrev${num}`);
          if (urlInput) urlInput.value = imgUrl || '';
          if (imgPrev && imgUrl) imgPrev.src = imgUrl;
        });
      }

      // Sync theme card
      document.querySelectorAll('.wiz-theme-card').forEach(card => {
        card.classList.toggle('active', card.dataset.theme === (p.theme || 'rose-pink'));
      });

      // Photos
      if (p.customPhotos) {
        if (this.wizPhotoBgUrl) this.wizPhotoBgUrl.value = p.customPhotos.bgTheme || p.customPhotos.bg || '';
        if (this.wizPhotoPortraitUrl) this.wizPhotoPortraitUrl.value = p.customPhotos.mainPortrait || p.customPhotos.portrait || '';
        if (this.wizPhotoPuzzleUrl) this.wizPhotoPuzzleUrl.value = p.customPhotos.puzzlePhoto || p.customPhotos.puzzle || '';
        if (this.wizPhotoHugUrl) this.wizPhotoHugUrl.value = p.customPhotos.liveHug || p.customPhotos.hug || '';
      }

      // Gifts
      if (p.customGifts && Array.isArray(p.customGifts) && p.customGifts.length >= 3) {
        if (document.getElementById('wizGift1Badge')) document.getElementById('wizGift1Badge').value = p.customGifts[0].badge;
        if (document.getElementById('wizGift1Title')) document.getElementById('wizGift1Title').value = p.customGifts[0].title;
        if (document.getElementById('wizGift1Desc')) document.getElementById('wizGift1Desc').value = p.customGifts[0].desc;
        if (document.getElementById('wizGift1Photo')) document.getElementById('wizGift1Photo').value = p.customGifts[0].photo || '';

        if (document.getElementById('wizGift2Badge')) document.getElementById('wizGift2Badge').value = p.customGifts[1].badge;
        if (document.getElementById('wizGift2Title')) document.getElementById('wizGift2Title').value = p.customGifts[1].title;
        if (document.getElementById('wizGift2Desc')) document.getElementById('wizGift2Desc').value = p.customGifts[1].desc;
        if (document.getElementById('wizGift2Photo')) document.getElementById('wizGift2Photo').value = p.customGifts[1].photo || '';

        if (document.getElementById('wizGift3Badge')) document.getElementById('wizGift3Badge').value = p.customGifts[2].badge;
        if (document.getElementById('wizGift3Title')) document.getElementById('wizGift3Title').value = p.customGifts[2].title;
        if (document.getElementById('wizGift3Desc')) document.getElementById('wizGift3Desc').value = p.customGifts[2].desc;
        if (document.getElementById('wizGift3Photo')) document.getElementById('wizGift3Photo').value = p.customGifts[2].photo || '';

        if (p.customGifts[3]) {
          if (document.getElementById('wizGift4Badge')) document.getElementById('wizGift4Badge').value = p.customGifts[3].badge;
          if (document.getElementById('wizGift4Title')) document.getElementById('wizGift4Title').value = p.customGifts[3].title;
          if (document.getElementById('wizGift4Desc')) document.getElementById('wizGift4Desc').value = p.customGifts[3].desc;
        }
      } else {
        this.loadGiftPreset(p.occasion);
      }

      // Payment
      if (p.payment) {
        if (this.wizPaymentEnable) this.wizPaymentEnable.checked = (p.payment.enabled !== false);
        if (this.wizUpiId) this.wizUpiId.value = p.payment.upiId || 'baby8389@nyes';
        if (this.wizAmount) this.wizAmount.value = p.payment.amount || 143;
        if (this.wizPaymentPopupText) this.wizPaymentPopupText.value = p.payment.popupText || '143 AMMOUNT PAY KRDO, CHOCLATE KHARID KE TUM KO DUNGA! 🥰🍫';
        if (this.wizPaymentQrUrl) this.wizPaymentQrUrl.value = p.payment.qrImage || '';
      }

      // Music & Reel
      if (p.music) {
        if (this.wizPlaylistSelect) this.wizPlaylistSelect.value = p.music.playlist || 'happybirthday';
        if (this.wizYtUrl) this.wizYtUrl.value = p.music.youtubeUrl || '';
        if (this.wizYtStart) this.wizYtStart.value = p.music.hookStart || '0:30';
        if (this.wizYtEnd) this.wizYtEnd.value = p.music.hookEnd || '1:20';
        if (p.music.customAudio) {
          if (this.wizAudioUrl) this.wizAudioUrl.value = p.music.customAudio;
          if (this.wizAudioPreview) {
            this.wizAudioPreview.src = p.music.customAudio;
            this.wizAudioPreview.style.display = 'block';
          }
        } else {
          if (this.wizAudioUrl) this.wizAudioUrl.value = '';
          if (this.wizAudioPreview) this.wizAudioPreview.style.display = 'none';
        }
      }
      if (p.reel) {
        if (this.wizReelUrl) this.wizReelUrl.value = p.reel.url || '';
        if (this.wizReelPreview && p.reel.url) {
          this.wizReelPreview.src = p.reel.url;
          this.wizReelPreview.style.display = 'block';
        } else if (this.wizReelPreview) {
          this.wizReelPreview.style.display = 'none';
        }
        if (this.wizReelCaption) this.wizReelCaption.value = p.reel.caption || '';
      }

      const shareUrl = this.generateProfileUrl(p);
      if (this.profShareLinkInput) this.profShareLinkInput.value = shareUrl;
      if (this.profQrPreviewImg) {
        this.renderQrCode(this.profQrPreviewImg, shareUrl);
      }
      if (this.profLinkCard) this.profLinkCard.style.display = 'block';

      // Sync 12 games selection
      const games = Array.isArray(p.enabledGames) ? p.enabledGames : ['quiz', 'car1', 'car2', 'car3', 'piano', 'puzzle', 'gifts', 'kisses', 'cupid', 'fireworks', 'reel', 'letter'];
      document.querySelectorAll('.games-selector-grid input[type="checkbox"]').forEach(cb => {
        cb.checked = games.includes(cb.value);
        cb.closest('.game-select-card')?.classList.toggle('active', cb.checked);
      });

      // Sync quiz toggle & questions
      const qEnable = document.getElementById('wizQuizEnable');
      if (qEnable) {
        qEnable.checked = p.quizEnabled !== false;
        const qWrap = document.getElementById('wizQuizQuestionsContainer');
        if (qWrap) qWrap.style.display = qEnable.checked ? 'block' : 'none';
      }
      this.renderQuizQuestions(p.quizQuestions || this.getDefaultQuizQuestions(p.name, p.sender));

      this.goToStep(1);
      if (this.profWizardContainer) {
        this.profWizardContainer.style.display = 'block';
        this.profWizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.showProfileStatus(`📝 Loaded "${p.name}" into Step Wizard. Review karein aur Step 4 me Save karein.`, false);
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

    resetProfileWizard() {
      if (this.profEditId) this.profEditId.value = '';
      this.uploadedWizardPhotos = {};
      if (this.profWizardTitle) this.profWizardTitle.textContent = '✨ Create Celebration Profile (Step-by-Step)';
      if (this.profName) this.profName.value = '';
      if (this.profSender) this.profSender.value = 'Yuvi';
      if (this.profNickname) this.profNickname.value = 'Babu Shona';
      if (this.profOccasion) this.profOccasion.value = 'birthday';
      if (this.profThemeSelect) this.profThemeSelect.value = 'rose-pink';

      if (this.wizPhotoBgUrl) this.wizPhotoBgUrl.value = '';
      if (this.wizPhotoPortraitUrl) this.wizPhotoPortraitUrl.value = '';
      if (this.wizPhotoPuzzleUrl) this.wizPhotoPuzzleUrl.value = '';
      if (this.wizPhotoHugUrl) this.wizPhotoHugUrl.value = '';
      if (this.wizPhotoBgFile) this.wizPhotoBgFile.value = '';
      if (this.wizPhotoPortraitFile) this.wizPhotoPortraitFile.value = '';
      if (this.wizPhotoPuzzleFile) this.wizPhotoPuzzleFile.value = '';
      if (this.wizPhotoHugFile) this.wizPhotoHugFile.value = '';

      document.querySelectorAll('.occ-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.occ === 'birthday');
      });
      document.querySelectorAll('.wiz-theme-card').forEach(card => {
        card.classList.toggle('active', card.dataset.theme === 'rose-pink');
      });

      if (this.profTemplateSelect) this.profTemplateSelect.value = 'crossbow_heart';
      document.querySelectorAll('.wiz-template-card').forEach(card => {
        card.classList.toggle('active', card.dataset.template === 'crossbow_heart');
      });
      for (let i = 1; i <= 6; i++) {
        const u = document.getElementById(`wizPuzzle${i}Url`);
        const f = document.getElementById(`wizPuzzle${i}File`);
        const p = document.getElementById(`puzzlePrev${i}`);
        if (u) u.value = '';
        if (f) f.value = '';
        if (p) p.src = './images/misty_cute_cheeks.jpg';

        const au = document.getElementById(`wizAlbum${i}Url`);
        const af = document.getElementById(`wizAlbum${i}File`);
        const ap = document.getElementById(`albumPrev${i}`);
        if (au) au.value = '';
        if (af) af.value = '';
        if (ap) ap.src = './images/misty_white_kurti.jpg';
      }

      if (this.wizAudioUrl) this.wizAudioUrl.value = '';
      if (this.wizAudioPreview) {
        this.wizAudioPreview.pause();
        this.wizAudioPreview.style.display = 'none';
      }
      if (this.wizReelUrl) this.wizReelUrl.value = '';
      if (this.wizReelPreview) {
        this.wizReelPreview.pause();
        this.wizReelPreview.style.display = 'none';
      }
      if (this.wizReelCaption) this.wizReelCaption.value = 'Seeing you smile is my favorite view in this whole universe! 🥰🎬🌹';

      this.applyOccasionPreset('birthday');
      if (this.profStatusBanner) this.profStatusBanner.style.display = 'none';
      if (this.profLinkCard) this.profLinkCard.style.display = 'none';

      this.goToStep(1);
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

      // Live link & field updater when inputs change
      if (this.inputToName) {
        this.inputToName.addEventListener('input', () => {
          const newName = this.inputToName.value.trim() || 'Misty';
          const prevName = this.prevRecipientName || 'Misty';
          if (this.inputVoiceText) {
            const curVoice = this.inputVoiceText.value;
            if (curVoice.includes(prevName)) {
              this.inputVoiceText.value = curVoice.replace(new RegExp(prevName, 'g'), newName);
            } else if (!curVoice || curVoice.startsWith('Happy Birthday') || curVoice.startsWith('Happy Anniversary') || curVoice.startsWith('Will you marry me') || curVoice.startsWith('I am really sorry') || curVoice.startsWith('Party time')) {
              const occ = this.selectOccasion?.value || 'birthday';
              const preset = this.getOccasionPresets(occ, newName, this.inputFromName?.value.trim() || 'Yuvi');
              this.inputVoiceText.value = preset.voice;
            }
          }
          if (this.inputLetterText) {
            const curLetter = this.inputLetterText.value;
            if (curLetter.includes(prevName)) {
              this.inputLetterText.value = curLetter.replace(new RegExp(prevName, 'g'), newName);
            }
          }
          this.updateGeneratedLink();
        });
      }

      if (this.inputFromName) {
        this.inputFromName.addEventListener('input', () => {
          const newSender = this.inputFromName.value.trim() || 'Yuvi';
          const prevSender = this.prevSenderName || 'Yuvi';
          if (this.inputLetterText) {
            const curLetter = this.inputLetterText.value;
            if (curLetter.includes(prevSender)) {
              this.inputLetterText.value = curLetter.replace(new RegExp(prevSender, 'g'), newSender);
            }
          }
          this.updateGeneratedLink();
        });
      }

      if (this.selectOccasion) {
        this.selectOccasion.addEventListener('change', () => {
          const occ = this.selectOccasion.value || 'birthday';
          const name = this.inputToName?.value.trim() || 'Misty';
          const sender = this.inputFromName?.value.trim() || 'Yuvi';
          const preset = this.getOccasionPresets(occ, name, sender);
          if (this.inputVoiceText) this.inputVoiceText.value = preset.voice;
          if (this.inputLetterText) this.inputLetterText.value = preset.letter;
          if (this.inputCustomWish) this.inputCustomWish.value = preset.wish;
          this.updateGeneratedLink();
        });
      }

      if (this.inputNickname) {
        this.inputNickname.addEventListener('input', () => this.updateGeneratedLink());
      }

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

      // Tab 3: Reel Video upload & URL
      const uploadReel = document.getElementById('adminUploadReel');
      const urlReel = document.getElementById('adminUrlReel');
      const capReel = document.getElementById('adminReelCaption');
      if (uploadReel && urlReel) {
        uploadReel.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            this.showToast('⏳ Uploading reel video...');
            const reader = new FileReader();
            reader.onload = ev => {
              const dataUrl = ev.target.result;
              urlReel.value = dataUrl;
              this.applyCustomReel(dataUrl, capReel?.value);
            };
            reader.readAsDataURL(file);
          }
        });
      }
      if (urlReel) {
        urlReel.addEventListener('change', () => {
          this.applyCustomReel(urlReel.value, capReel?.value);
        });
      }
      if (capReel) {
        capReel.addEventListener('change', () => {
          this.applyCustomReel(urlReel?.value, capReel.value);
        });
      }

      // Tab 3: 6 Album Photos Bindings
      for (let i = 1; i <= 6; i++) {
        const fileInp = document.getElementById(`adminAlbum${i}File`);
        const urlInp = document.getElementById(`adminAlbum${i}Url`);
        const prevImg = document.getElementById(`tabAlbumPrev${i}`);
        if (fileInp && urlInp) {
          fileInp.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              this.showToast(`⏳ Compressing Album #${i}...`);
              const dataUrl = await compressImageFile(file, 800, 0.70);
              urlInp.value = dataUrl;
              if (prevImg) prevImg.src = dataUrl;
              this.applyCustomAlbumPhoto(i - 1, dataUrl);
            }
          });
        }
        if (urlInp) {
          urlInp.addEventListener('change', () => {
            if (urlInp.value) {
              if (prevImg) prevImg.src = urlInp.value;
              this.applyCustomAlbumPhoto(i - 1, urlInp.value);
            }
          });
        }
      }

      // Tab 3: 6 Puzzle Photos Bindings
      for (let i = 1; i <= 6; i++) {
        const fileInp = document.getElementById(`adminPuzzle${i}File`);
        const urlInp = document.getElementById(`adminPuzzle${i}Url`);
        const prevImg = document.getElementById(`tabPuzzlePrev${i}`);
        if (fileInp && urlInp) {
          fileInp.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              this.showToast(`⏳ Compressing Puzzle #${i}...`);
              const dataUrl = await compressImageFile(file, 800, 0.70);
              urlInp.value = dataUrl;
              if (prevImg) prevImg.src = dataUrl;
              this.applyCustomPuzzlePhoto(i - 1, dataUrl);
            }
          });
        }
        if (urlInp) {
          urlInp.addEventListener('change', () => {
            if (urlInp.value) {
              if (prevImg) prevImg.src = urlInp.value;
              this.applyCustomPuzzlePhoto(i - 1, urlInp.value);
            }
          });
        }
      }

      // Tab 3: Auto-Fill Buttons
      const btnTabAutoFillAlbum = document.getElementById('btnTabAutoFillAlbum');
      if (btnTabAutoFillAlbum) {
        btnTabAutoFillAlbum.addEventListener('click', () => {
          const AESTHETIC_ALBUM_FALLBACKS = [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
          ];
          for (let i = 1; i <= 6; i++) {
            const urlInp = document.getElementById(`adminAlbum${i}Url`);
            const prevImg = document.getElementById(`tabAlbumPrev${i}`);
            if (urlInp && !urlInp.value) {
              urlInp.value = AESTHETIC_ALBUM_FALLBACKS[i - 1];
              if (prevImg) prevImg.src = urlInp.value;
              this.applyCustomAlbumPhoto(i - 1, urlInp.value);
            }
          }
          this.showToast('📸 Auto-filled album photos! ✨');
        });
      }

      const btnTabAutoFillPuzzle = document.getElementById('btnTabAutoFillPuzzle');
      if (btnTabAutoFillPuzzle) {
        btnTabAutoFillPuzzle.addEventListener('click', () => {
          const AESTHETIC_PUZZLE_FALLBACKS = [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
          ];
          for (let i = 1; i <= 6; i++) {
            const urlInp = document.getElementById(`adminPuzzle${i}Url`);
            const prevImg = document.getElementById(`tabPuzzlePrev${i}`);
            if (urlInp && !urlInp.value) {
              urlInp.value = AESTHETIC_PUZZLE_FALLBACKS[i - 1];
              if (prevImg) prevImg.src = urlInp.value;
              this.applyCustomPuzzlePhoto(i - 1, urlInp.value);
            }
          }
          this.showToast('🧩 Auto-filled puzzle photos! ✨');
        });
      }

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

          if (panelId === 'panelProfiles' || panelId === 'panelAnalytics') {
            this.renderAnalyticsDashboard();
          }
          if (panelId === 'panelAdmins') this.renderAdminsList();
        });
      });
    }

    // ==========================================
    // PHOTO & MEDIA CONTROLS (8 PHOTOS)
    // ==========================================
    bindPhotoInput(fileInputEl, urlInputEl, photoKey) {
      if (fileInputEl) {
        fileInputEl.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            this.showToast(`⏳ Optimizing ${photoKey}...`);
            const dataUrl = await compressImageFile(file);
            this.applyCustomPhoto(photoKey, dataUrl);
            if (urlInputEl) urlInputEl.value = dataUrl;
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
      // Also set alternative alias
      const aliasMap = {
        bgTheme: 'bg', bg: 'bgTheme',
        mainPortrait: 'portrait', portrait: 'mainPortrait',
        puzzlePhoto: 'puzzle', puzzle: 'puzzlePhoto',
        liveHug: 'hug', hug: 'liveHug'
      };
      if (aliasMap[photoKey]) {
        this.config.customPhotos[aliasMap[photoKey]] = src;
      }

      // Save to active profile too
      const profiles = getStoredProfiles();
      const curId = this.activeProfileId || 'misty';
      if (profiles[curId]) {
        if (!profiles[curId].customPhotos) profiles[curId].customPhotos = {};
        profiles[curId].customPhotos[photoKey] = src;
        if (aliasMap[photoKey]) {
          profiles[curId].customPhotos[aliasMap[photoKey]] = src;
        }
        saveProfiles(profiles);
      }

      // Save high-resolution media to IndexedDB immediately so it is NEVER lost on page reload!
      const idbData = {
        ...(profiles[curId]?.customPhotos || {}),
        [photoKey]: src,
        ...(aliasMap[photoKey] ? { [aliasMap[photoKey]]: src } : {})
      };
      if (Array.isArray(this.config.puzzleImages)) idbData.puzzleImages = this.config.puzzleImages;
      if (Array.isArray(this.config.albumPhotos)) idbData.albumPhotos = this.config.albumPhotos;

      savePhotosToIDB(curId, idbData);
      savePhotosToIDB('__active__', idbData);

      this.saveConfig(this.config);
      this.applyConfig(this.config);

      // Instantly notify live game, puzzle, gifts & piano
      window.loveGame?.onProfileChange?.(this.config);
      window.lovePuzzle?.onProfileChange?.(this.config);
      window.birthdayGifts?.onProfileChange?.(this.config);
      window.lovePiano?.onProfileChange?.(this.config);

      this.showToast(`📸 Custom ${photoKey} updated successfully across the entire site! ✨`);
    }

    applyCustomAlbumPhoto(index, src) {
      if (!Array.isArray(this.config.albumPhotos)) this.config.albumPhotos = [];
      while (this.config.albumPhotos.length <= index) {
        this.config.albumPhotos.push('');
      }
      this.config.albumPhotos[index] = src;

      const profiles = getStoredProfiles();
      const curId = this.activeProfileId || 'misty';
      if (profiles[curId]) {
        profiles[curId].albumPhotos = [...this.config.albumPhotos];
        saveProfiles(profiles);
      }

      const idbData = {
        ...(profiles[curId]?.customPhotos || this.config.customPhotos || {}),
        albumPhotos: this.config.albumPhotos
      };
      if (Array.isArray(this.config.puzzleImages)) idbData.puzzleImages = this.config.puzzleImages;

      savePhotosToIDB(curId, idbData);
      savePhotosToIDB('__active__', idbData);

      this.saveConfig(this.config);
      this.applyConfig(this.config);

      window.loveGame?.onProfileChange?.(this.config);
      window.birthdayGifts?.onProfileChange?.(this.config);
      this.showToast(`📸 Album Photo #${index + 1} updated! ✨`);
    }

    applyCustomPuzzlePhoto(index, src) {
      if (!Array.isArray(this.config.puzzleImages)) this.config.puzzleImages = [];
      while (this.config.puzzleImages.length <= index) {
        this.config.puzzleImages.push('');
      }
      this.config.puzzleImages[index] = src;

      const profiles = getStoredProfiles();
      const curId = this.activeProfileId || 'misty';
      if (profiles[curId]) {
        profiles[curId].puzzleImages = [...this.config.puzzleImages];
        saveProfiles(profiles);
      }

      const idbData = {
        ...(profiles[curId]?.customPhotos || this.config.customPhotos || {}),
        puzzleImages: this.config.puzzleImages
      };
      if (Array.isArray(this.config.albumPhotos)) idbData.albumPhotos = this.config.albumPhotos;

      savePhotosToIDB(curId, idbData);
      savePhotosToIDB('__active__', idbData);

      this.saveConfig(this.config);
      this.applyConfig(this.config);

      window.lovePuzzle?.updatePuzzlePickerStrip?.(this.config.puzzleImages);
      window.lovePuzzle?.setImage?.(this.config.puzzleImages[0]);
      this.showToast(`🧩 Puzzle Photo #${index + 1} updated! ✨`);
    }

    applyCustomReel(url, caption) {
      if (!this.config.reel) this.config.reel = {};
      if (url) this.config.reel.url = url;
      if (caption !== undefined) this.config.reel.caption = caption;

      const profiles = getStoredProfiles();
      const curId = this.activeProfileId || 'misty';
      if (profiles[curId]) {
        profiles[curId].reel = { ...this.config.reel };
        saveProfiles(profiles);
      }

      this.saveConfig(this.config);
      this.applyConfig(this.config);
      this.showToast('🎬 Reel Video settings updated! ✨');
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
      this.closeDashboard?.();
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
      } else if (target === 'piano') {
        window.journey.closeAllModals();
        window.lovePiano?.open('piano');
      } else if (target === 'gifts') {
        window.journey?.closeAllModals?.();
        window.journey?.unlock?.('gifts', true);
        window.journey?.setActiveNav?.('navGiftsBtn');
        if (!window.birthdayGifts && typeof BirthdayGifts !== 'undefined') {
          window.birthdayGifts = new BirthdayGifts();
        }
        if (window.birthdayGifts) {
          window.birthdayGifts.open();
        } else {
          const m = document.getElementById('giftsModal');
          if (m) {
            document.body.classList.add('modal-active');
            m.classList.add('is-open');
            m.style.display = 'flex';
          }
        }
      } else if (target === 'pay') {
        const isPayEnabled = (this.config?.payment && this.config.payment.enabled !== false) && (this.config?.paymentEnabled !== false);
        if (!isPayEnabled) {
          this.showToast('ℹ️ Payment ₹143 is turned OFF for this profile in Admin Settings! 🔒');
          return;
        }
        window.journey?.closeAllModals?.();
        window.journey?.unlock?.('pay', true);
        window.journey?.setActiveNav?.('navPayBtn');
        if (!window.birthdayGifts && typeof BirthdayGifts !== 'undefined') {
          window.birthdayGifts = new BirthdayGifts();
        }
        window.birthdayGifts?.scrollToPayment(true);
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
  

  switchTab(panelId) {
    document.querySelectorAll('.atab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.panel === panelId);
    });
    document.querySelectorAll('.atab-panel').forEach(p => {
      p.classList.toggle('active', p.id === panelId);
    });

    if (panelId === 'panelAnalytics') {
      this.renderAnalyticsDashboard();
      if (!this.analyticsInterval) {
        this.analyticsInterval = setInterval(() => this.renderAnalyticsDashboard(), 3500);
      }
    } else {
      if (this.analyticsInterval) {
        clearInterval(this.analyticsInterval);
        this.analyticsInterval = null;
      }
    }
  }

  getDefaultQuizQuestions(girlName = 'Neha', boyName = 'Yuvi') {
    return [
      {
        q: `Do you love me, ${girlName}? 🥺💖`,
        sub: "Ek sach sach jawab dena meri jaan... no lies allowed!",
        yes: `YAYYY! I knew it! ${boyName} loves you 3000x more than words can say! 🥰❤️`,
        no: "Can't touch this! 😜"
      },
      {
        q: `Will you marry me one day, ${girlName}? 💍👰‍♀️✨`,
        sub: "Ek din humara bhi ek pyara sa chhota aashiyana hoga...",
        yes: "OMG SHE SAID YES! Best day of my entire life! 💍👰‍♀️🎉",
        no: "Oops! Too slow! 🏃‍♂️💨"
      },
      {
        q: `Kya tum mera sath hamesha dogi? 🤝❤️‍🔥`,
        sub: "Har mushkil, har khushi mein, har mod pe...",
        yes: `Hamesha aur har kadam pe tumhara hath pakad ke rakhunga! 🤝✨`,
        no: "NO is not an option! 😂"
      },
      {
        q: `Kya tum mere liye hamesha loyal rahogi? 🔐🕊️`,
        sub: "Sirf tum aur main, is bheed bhari duniya mein...",
        yes: "Aap meri sabse badi priority ho aur hamesha rahogi! 🔐💖",
        no: "Pakad ke dikhao! 🙈"
      },
      {
        q: `Jab main naraz hounga, kya tum mujhe ek pyara sa hug dekar manaogi? 🫂🥺`,
        sub: "Tumhara ek hug meri saari tension gayab kar deta hai...",
        yes: `Tightest warm hug reserved only for ${boyName}, always! 🫂❤️`,
        no: "Nice try, beautiful! 🤭"
      },
      {
        q: `Promise me, we will stay together forever & always? ♾️🔐❤️`,
        sub: "No matter what happens, till our hair turns white...",
        yes: "Promise sealed in the stars forever & ever! ♾️🔐❤️ Mission Unlocked! 🚗💨",
        no: "Try again! Click YES! ✨"
      }
    ];
  }

  renderQuizQuestions(questions) {
    const container = document.getElementById('wizQuizQuestionsList');
    if (!container) return;
    const girl = (this.profName?.value || '').trim() || 'Neha';
    const boy = (this.profSender?.value || '').trim() || 'Yuvi';
    const list = (Array.isArray(questions) && questions.length > 0) ? questions : this.getDefaultQuizQuestions(girl, boy);

    let html = '';
    list.forEach((item, idx) => {
      html += `
        <div class="quiz-q-card" data-idx="${idx}">
          <div class="qqc-header">
            <span class="qqc-title">Question #${idx + 1} 💖</span>
            <button type="button" class="qqc-del-btn" title="Remove question">🗑️</button>
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:11px;">Question Text:</label>
            <input type="text" class="admin-input quiz-q-text" value="${escapeHtml(item.q || item.question || '')}" placeholder="e.g. Do you love me, ${girl}? 🥺💖" />
          </div>
          <div class="admin-grid-2">
            <div class="form-group">
              <label style="font-size:11px;">Sweet "YES" Answer (Congratulation popup):</label>
              <input type="text" class="admin-input quiz-q-yes" value="${escapeHtml(item.yes || item.response || '')}" placeholder="e.g. YAYYY! I love you so much! 🥰❤️" />
            </div>
            <div class="form-group">
              <label style="font-size:11px;">Teasing "NO" Runaway Excuse (When she tries to click NO):</label>
            <input type="text" class="admin-input quiz-q-no" value="${escapeHtml(item.no || "Can't touch this! 😜")}" placeholder="e.g. Can't touch this! 😜" />
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    container.querySelectorAll('.qqc-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.quiz-q-card');
        if (card) {
          card.remove();
          container.querySelectorAll('.quiz-q-card').forEach((c, i) => {
            const t = c.querySelector('.qqc-title');
            if (t) t.textContent = `Question #${i + 1} 💖`;
          });
        }
      });
    });
  }

  addQuizQuestion() {
    const container = document.getElementById('wizQuizQuestionsList');
    if (!container) return;
    const girl = (this.profName?.value || '').trim() || 'Neha';
    const boy = (this.profSender?.value || '').trim() || 'Yuvi';
    const count = container.querySelectorAll('.quiz-q-card').length + 1;
    const div = document.createElement('div');
    div.className = 'quiz-q-card';
    div.innerHTML = `
      <div class="qqc-header">
        <span class="qqc-title">Question #${count} 💖</span>
        <button type="button" class="qqc-del-btn" title="Remove question">🗑️</button>
      </div>
      <div class="form-group" style="margin-bottom:6px;">
        <label style="font-size:11px;">Question Text:</label>
        <input type="text" class="admin-input quiz-q-text" placeholder="e.g. Kya tum mere sath dinner date pe chalogi? 🍕" />
      </div>
      <div class="admin-grid-2">
        <div class="form-group">
          <label style="font-size:11px;">Sweet "YES" Answer:</label>
          <input type="text" class="admin-input quiz-q-yes" placeholder="e.g. Candlelight dinner reserved for us tonight! 🍷✨" />
        </div>
        <div class="form-group">
          <label style="font-size:11px;">Teasing "NO" Runaway Excuse:</label>
          <input type="text" class="admin-input quiz-q-no" value="Can't touch this! 😜" placeholder="Can't touch this! 😜" />
        </div>
      </div>
    `;
    div.querySelector('.qqc-del-btn').addEventListener('click', () => {
      div.remove();
      container.querySelectorAll('.quiz-q-card').forEach((c, i) => {
        const t = c.querySelector('.qqc-title');
        if (t) t.textContent = `Question #${i + 1} 💖`;
      });
    });
    container.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  initGamesSelector() {
    const selectAllBtn = document.getElementById('btnSelectAllGames');
    const deselectAllBtn = document.getElementById('btnDeselectAllGames');
    const cards = document.querySelectorAll('.game-select-card');

    cards.forEach(card => {
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.addEventListener('change', () => {
          card.classList.toggle('active', cb.checked);
        });
      }
    });

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        cards.forEach(card => {
          const cb = card.querySelector('input[type="checkbox"]');
          if (cb) {
            cb.checked = true;
            card.classList.add('active');
          }
        });
      });
    }

    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', () => {
        cards.forEach(card => {
          const cb = card.querySelector('input[type="checkbox"]');
          if (cb) {
            cb.checked = false;
            card.classList.remove('active');
          }
        });
      });
    }
  }

  initQuizManager() {
    const btnAdd = document.getElementById('btnAddQuizQuestion');
    const btnReset = document.getElementById('btnResetQuizQuestions');
    const qEnable = document.getElementById('wizQuizEnable');
    const qWrap = document.getElementById('wizQuizQuestionsContainer');

    if (qEnable && qWrap) {
      qEnable.addEventListener('change', () => {
        qWrap.style.display = qEnable.checked ? 'block' : 'none';
      });
    }

    if (btnAdd) {
      btnAdd.addEventListener('click', () => this.addQuizQuestion());
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const girl = (this.profName?.value || '').trim() || 'Neha';
        const boy = (this.profSender?.value || '').trim() || 'Yuvi';
        this.renderQuizQuestions(this.getDefaultQuizQuestions(girl, boy));
        this.showToast('🔄 Reset quiz questions to romantic defaults!');
      });
    }

    this.renderQuizQuestions();
  }

  initPaymentToggle() {
    const switchEl = document.getElementById('wizPaymentEnable');
    const wrap = document.getElementById('wizPaymentOptionsWrap');
    if (switchEl && wrap) {
      switchEl.addEventListener('change', () => {
        wrap.style.display = switchEl.checked ? 'block' : 'none';
      });
      wrap.style.display = switchEl.checked ? 'block' : 'none';
    }
  }

  renderAnalyticsDashboard() {
    const container = document.getElementById('analyticsProfilesContainer');
    if (!container) return;

    const profiles = getStoredProfiles();
    const keys = Object.keys(profiles);
    const activeId = this.activeProfileId || 'neha';

    let onlineCount = 0;
    let totalMissionsDone = 0;

    const cardsHtml = keys.map(key => {
      const p = profiles[key];
      const trackKey = 'yuvi_track_' + p.id;
      let track = {};
      try { track = JSON.parse(localStorage.getItem(trackKey) || '{}'); } catch(e){}

      const lastSeen = track.lastSeen || 0;
      const isOnline = (Date.now() - lastSeen < 25000) && (track.isOnline !== false);
      if (isOnline) onlineCount++;

      const m = track.missions || {};
      let missionsDoneForProfile = 0;
      if (m.quiz === 'done') missionsDoneForProfile++;
      if (m.car1) missionsDoneForProfile++;
      if (m.car2) missionsDoneForProfile++;
      if (m.car3) missionsDoneForProfile++;
      if (m.piano) missionsDoneForProfile++;
      if (m.puzzle) missionsDoneForProfile++;
      if (m.gifts) missionsDoneForProfile++;
      if (m.letter) missionsDoneForProfile++;
      if (m.payment) missionsDoneForProfile++;
      totalMissionsDone += missionsDoneForProfile;

      const timeAgoStr = !lastSeen ? 'Never opened yet' : (
        (Date.now() - lastSeen < 60000) ? 'Active just now' :
        (Date.now() - lastSeen < 3600000) ? `${Math.floor((Date.now() - lastSeen)/60000)}m ago` :
        new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );

      const isPayOff = p.payment && p.payment.enabled === false;

      return `
        <div class="tracking-profile-card ${key === activeId ? 'is-active-profile' : ''}">
          <div class="tpc-header">
            <div>
              <div class="tpc-girl-name">👑 Queen ${escapeHtml(p.name)} <span style="font-size:12px;font-weight:400;color:#c49eb0;">(from ${escapeHtml(p.sender || 'Yuvi')})</span></div>
              <div class="tpc-meta">
                <span class="pro-badge occ-badge">${escapeHtml(p.occasion || 'celebration')}</span>
                <span class="pro-badge theme-badge">${escapeHtml(p.theme || 'rose-pink')}</span>
                ${p.template ? `<span class="pro-badge theme-badge">🎬 ${escapeHtml(p.template.replace(/_/g, ' '))}</span>` : ''}
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">
              <div style="display:flex; align-items:center; gap:6px;" title="Payment Section ON / OFF">
                <label class="ios-switch mini">
                  <input type="checkbox" class="profile-payment-toggle" data-profid="${p.id}" ${(!p.payment || (p.payment.enabled !== false && p.paymentEnabled !== false)) ? 'checked' : ''} />
                  <span class="ios-slider"></span>
                </label>
                <span style="font-size:11px;font-weight:700;color:${(!p.payment || (p.payment.enabled !== false && p.paymentEnabled !== false)) ? '#ff9ff3' : '#a4b0be'};">
                  ${(!p.payment || (p.payment.enabled !== false && p.paymentEnabled !== false)) ? '💳 Pay ON' : '💳 Pay OFF'}
                </span>
              </div>

              <div style="display:flex; align-items:center; gap:6px;">
                <label class="ios-switch mini" title="Link Active / Paused Switch">
                  <input type="checkbox" class="profile-active-toggle" data-profid="${p.id}" ${p.linkActive !== false ? 'checked' : ''} />
                  <span class="ios-slider"></span>
                </label>
                <span style="font-size:11px;font-weight:700;color:${p.linkActive !== false ? '#2ed573' : '#ff4757'};">
                  ${p.linkActive !== false ? 'LIVE' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:10px;">
            <div>
              ${isOnline 
                ? `<span class="visitor-status-pill online"><span class="online-pulse-dot"></span> 🟢 ONLINE NOW</span>` 
                : `<span class="visitor-status-pill offline">⚪ Offline (${timeAgoStr})</span>`}
            </div>
            <div style="font-size:11.5px; color:#ffd6e7; font-weight:700;">
              👁️ <strong>${track.views || 0}</strong> page visits
            </div>
          </div>

          <div style="font-size:11px; font-weight:800; color:#ff9ff3; margin-top:2px;">
            🎯 Live Missions Completion Matrix (${missionsDoneForProfile}/9):
          </div>
          <div class="mission-matrix-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px;">
            <span class="mission-chip ${m.quiz === 'done' ? 'done' : 'pending'}">🎯 Quiz: ${m.quiz === 'done' ? 'Done' : 'Pending'}</span>
            <span class="mission-chip ${m.car1 ? 'done' : 'pending'}">🚗 Car 1: ${m.car1 ? '50 Stars' : 'Pending'}</span>
            <span class="mission-chip ${m.car2 ? 'done' : 'pending'}">🚙 Thar 2: ${m.car2 ? '50 Badges' : 'Pending'}</span>
            <span class="mission-chip ${m.car3 ? 'done' : 'pending'}">👩‍❤️‍👨 Couple 3: ${m.car3 ? 'Reunited' : 'Pending'}</span>
            <span class="mission-chip ${m.piano ? 'done' : 'pending'}">🎹 Piano: ${m.piano ? 'Played' : 'Pending'}</span>
            <span class="mission-chip ${m.puzzle ? 'done' : 'pending'}">🧩 Puzzle: ${m.puzzle ? 'Solved' : 'Pending'}</span>
            <span class="mission-chip ${m.gifts ? 'done' : 'pending'}">🎁 Gifts: ${m.gifts ? 'Opened' : 'Pending'}</span>
            <span class="mission-chip ${m.letter ? 'done' : 'pending'}">💌 Letter: ${m.letter ? 'Read' : 'Unread'}</span>
            <span class="mission-chip ${isPayOff ? 'off' : (m.payment ? 'done' : 'pending')}">💳 Pay: ${isPayOff ? 'Turned Off' : (m.payment ? 'Paid' : 'Pending')}</span>
          </div>

          <div class="pro-card-actions" style="margin-top:4px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.08);">
            <button type="button" class="pro-btn edit-btn" data-editprof="${p.id}">✏️ Edit in Studio</button>
            <button type="button" class="pro-btn copy-btn" data-copyprof="${p.id}">📋 Copy Link</button>
            <button type="button" class="pro-btn open-btn" data-openprof="${p.id}">🚀 Test in Tab</button>
            ${p.id !== 'misty' ? `<button type="button" class="pro-btn del-btn" data-delprof="${p.id}">🗑️ Delete</button>` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = cardsHtml || '<div style="color:#c49eb0;padding:20px;text-align:center;">No celebration profiles created yet. Click "Create New Profile" to begin!</div>';

    const statProfiles = document.getElementById('statTotalProfiles');
    if (statProfiles) statProfiles.textContent = keys.length;

    const statOnline = document.getElementById('statOnlineNow');
    if (statOnline) statOnline.textContent = onlineCount;

    const statMissions = document.getElementById('statMissionsCompleted');
    if (statMissions) statMissions.textContent = totalMissionsDone;

    container.querySelectorAll('.profile-active-toggle').forEach(tgl => {
      tgl.addEventListener('change', () => {
        const profId = tgl.dataset.profid;
        const allP = getStoredProfiles();
        if (allP[profId]) {
          allP[profId].linkActive = tgl.checked;
          saveProfiles(allP);
          this.showToast(`Profile "${allP[profId].name}" link is now ${tgl.checked ? 'Active 🟢' : 'Paused 🔴'}!`);
          this.renderAnalyticsDashboard();
        }
      });
    });

    container.querySelectorAll('.profile-payment-toggle').forEach(tgl => {
      tgl.addEventListener('change', () => {
        const profId = tgl.dataset.profid;
        const isEnabled = tgl.checked;
        const allP = getStoredProfiles();
        if (allP[profId]) {
          if (!allP[profId].payment) allP[profId].payment = {};
          allP[profId].payment.enabled = isEnabled;
          allP[profId].paymentEnabled = isEnabled;
          saveProfiles(allP);

          if (this.config.id === profId || this.activeProfileId === profId) {
            this.config.payment = allP[profId].payment;
            this.config.paymentEnabled = isEnabled;
            this.saveConfig(this.config);
            this.applyConfig(this.config);
          }
          this.showToast(`💳 Profile "${allP[profId].name}": Payment is now ${isEnabled ? 'ON (Active)' : 'OFF (Removed)'}! ✨`);
          this.renderAnalyticsDashboard();
        }
      });
    });

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const profId = btn.dataset.editprof;
        this.switchTab('panelStudio');
        this.loadProfileIntoWizard(profId);
      });
    });

    container.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const profId = btn.dataset.copyprof;
        const allP = getStoredProfiles();
        if (allP[profId]) {
          const url = this.generateProfileUrl(allP[profId]);
          navigator.clipboard.writeText(url).then(() => {
            this.showToast(`📋 Link for ${allP[profId].name} copied to clipboard! ✨`);
          });
        }
      });
    });

    container.querySelectorAll('.open-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const profId = btn.dataset.openprof;
        const allP = getStoredProfiles();
        if (allP[profId]) {
          const url = this.generateProfileUrl(allP[profId]);
          window.open(url, '_blank');
        }
      });
    });

    container.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const profId = btn.dataset.delprof;
        if (confirm(`Are you sure you want to delete profile "${profId}"?`)) {
          const allP = getStoredProfiles();
          delete allP[profId];
          saveProfiles(allP);
          this.renderAnalyticsDashboard();
          this.showToast(`Deleted profile "${profId}"!`);
        }
      });
    });
  }

}

  // Expose helpers globally
  window.AdminManager = AdminManager;
  window.savePhotosToIDB = savePhotosToIDB;
  window.getPhotosFromIDB = getPhotosFromIDB;
  window.getStoredProfiles = getStoredProfiles;

  function initAdmin() {
    if (!window.adminManager) {
      window.adminManager = new AdminManager();
      window.applyProfileToEntireSite = function(profile) {
        if (window.adminManager && profile) {
          window.adminManager.saveConfig(profile);
        }
      };
      const p = new URLSearchParams(window.location.search);
      if (p.get('open_admin') === 'true') {
        window.adminManager.openDashboard();
        const tab = p.get('tab');
        if (tab) {
          const tabBtn = document.querySelector(`.atab-btn[data-panel="${tab}"]`);
          if (tabBtn) tabBtn.click();
        }
        const step = p.get('step');
        if (step && window.adminManager?.goToStep) {
          window.adminManager.goToStep(parseInt(step, 10));
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

// ============================================================
// GLOBAL VISITOR HEARTBEAT & REAL-TIME MISSION TRACKING ENGINE
// ============================================================
window.initVisitorTracking = function() {
  try {
    const params = new URLSearchParams(window.location.search);
    const profId = params.get('p') || window.SiteConfig?.profileId || 'neha';
    const trackKey = 'yuvi_track_' + profId;

    let data = {};
    try { data = JSON.parse(localStorage.getItem(trackKey) || '{}'); } catch(e){}
    data.views = (data.views || 0) + 1;
    data.lastSeen = Date.now();
    data.isOnline = true;
    if (!data.missions) data.missions = {};
    localStorage.setItem(trackKey, JSON.stringify(data));

    // 6-second heartbeat ping
    setInterval(() => {
      try {
        let d = JSON.parse(localStorage.getItem(trackKey) || '{}');
        d.lastSeen = Date.now();
        d.isOnline = true;
        localStorage.setItem(trackKey, JSON.stringify(d));
      } catch(e){}
    }, 6000);

    window.addEventListener('beforeunload', () => {
      try {
        let d = JSON.parse(localStorage.getItem(trackKey) || '{}');
        d.lastSeen = Date.now();
        d.isOnline = false;
        localStorage.setItem(trackKey, JSON.stringify(d));
      } catch(e){}
    });
  } catch(e) {}
};

window.trackMissionEvent = function(missionKey, statusText) {
  try {
    const params = new URLSearchParams(window.location.search);
    const profId = params.get('p') || window.SiteConfig?.profileId || 'neha';
    const trackKey = 'yuvi_track_' + profId;
    let data = {};
    try { data = JSON.parse(localStorage.getItem(trackKey) || '{}'); } catch(e){}
    if (!data.missions) data.missions = {};
    data.missions[missionKey] = statusText || 'done';
    data.lastSeen = Date.now();
    localStorage.setItem(trackKey, JSON.stringify(data));

    if (window.adminManager?.renderAnalyticsDashboard) {
      window.adminManager.renderAnalyticsDashboard();
    }
  } catch(e) {}
};

if (typeof window !== 'undefined') {
  window.initVisitorTracking();
}
