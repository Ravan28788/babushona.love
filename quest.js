// Misty's Romantic 10 Love Questions Quest
const LOVE_QUESTIONS = [
  {
    num: 1,
    emoji: "🥺💖",
    badge: "Question 1 of 10 💕",
    question: "Do you love me, Misty? 🥺💖",
    subtext: "Ek sach sach jawab dena meri jaan... no lies allowed!",
    response: "YAYYY! I knew it! I love you 3000x more than words can say! 🥰❤️"
  },
  {
    num: 2,
    emoji: "💍👰‍♀️✨",
    badge: "Question 2 of 10 💍",
    question: "Will you marry me one day? 💍👰‍♀️✨",
    subtext: "Ek din humara bhi ek chhota sa pyara aashiyana hoga...",
    response: "OMG SHE SAID YES! Best day of my entire life! 💍👰‍♀️🎉"
  },
  {
    num: 3,
    emoji: "🤝❤️‍🔥",
    badge: "Question 3 of 10 🤝",
    question: "Kya tum mera sath hamesha dogi? 🤝❤️‍🔥",
    subtext: "Har mushkil, har khushi mein, har mod pe...",
    response: "Hamesha aur har kadam pe tumhara hath pakad ke rakhunga! 🤝✨"
  },
  {
    num: 4,
    emoji: "🔐🕊️",
    badge: "Question 4 of 10 🔐",
    question: "Kya tum mere liye hamesha loyal rahogi? 🔐🕊️",
    subtext: "Sirf tum aur main, is bheed bhari duniya mein...",
    response: "Aap meri sabse badi priority ho aur hamesha rahogi! 🔐💖"
  },
  {
    num: 5,
    emoji: "🙈💕",
    badge: "Question 5 of 10 🙈",
    question: "Kya tum hamesha sirf meri rahogi? 🙈💕",
    subtext: "Koi aur option hi nahi hai madam ji! 😉",
    response: "Only yours, forever & unconditionally! 🙈❤️"
  },
  {
    num: 6,
    emoji: "🥰✨",
    badge: "Question 6 of 10 🥰",
    question: "Kya tum mujhe hamesha aise hi apni cute smile dikhaogi? 🥰✨",
    subtext: "Tumhari ek smile se mera pura din ban jata hai...",
    response: "Your smile is my whole world! Never stop smiling! 🥺✨"
  },
  {
    num: 7,
    emoji: "🫂🥹",
    badge: "Question 7 of 10 🫂",
    question: "Jab main gussa hounga, kya tum mujhe ek pyara sa hug dekar manaogi? 🫂🥹",
    subtext: "Tumhara ek hug meri saari tension gayab kar deta hai...",
    response: "Tightest warm hug reserved only for you, always! 🫂❤️"
  },
  {
    num: 8,
    emoji: "📖💑",
    badge: "Question 8 of 10 📖",
    question: "Kya hum dono milke duniya ki sabse pyari love story banayein? 📖💑",
    subtext: "Jisme hum dono hero aur heroine honge...",
    response: "Our story will be the most romantic fairytale ever written! 📖💑"
  },
  {
    num: 9,
    emoji: "🍕🎮",
    badge: "Question 9 of 10 🍕",
    question: "Kya tum meri har choti-badi khushi aur pagalpan ki partner banogi? 🍕🎮",
    subtext: "Midnight snacks, long drives, aur gaming sessions ke partner...",
    response: "Partners in fun, partners in food, partners for life! 🍕🎮❤️"
  },
  {
    num: 10,
    emoji: "♾️🔐❤️",
    badge: "Question 10 of 10 ♾️",
    question: "Promise me, we will stay together forever & always? ♾️🔐❤️",
    subtext: "No matter what happens, till our hair turns white...",
    response: "Promise sealed in the stars forever & ever! ♾️🔐❤️ Mission Unlocked! 🚗💨"
  }
];

const TEASE_MESSAGES = [
  "Oops! Too slow! 😜",
  "Can't touch this! 🏃‍♂️💨",
  "NO is not an option! 😂",
  "Pakad ke dikhao! 🙈",
  "Only YES allowed! 💖",
  "Nice try, beautiful! 🤭",
  "Nope! You love me! 🥰",
  "Try again! Click YES! ✨",
  "Error 404: NO not found! 🚀"
];

class LoveQuest {
  constructor() {
    this.currentIndex = 0;
    this.dodgeCount = 0;
    this.isTransitioning = false;
    this.container = document.getElementById('questModal');
    this.arena = document.getElementById('btnArena');
    this.btnYes = document.getElementById('btnYes');
    this.btnNo = document.getElementById('btnNo');
    this.teaseBubble = document.getElementById('teaseBubble');
    this.card = document.getElementById('questCard');
    this.badgeEl = document.getElementById('qBadge');
    this.emojiEl = document.getElementById('qEmoji');
    this.questionEl = document.getElementById('qText');
    this.subtextEl = document.getElementById('qSub');
    this.progressFill = document.getElementById('qProgressFill');
    this.congratsToast = document.getElementById('congratsToast');
    this.congratsMsg = document.getElementById('congratsMsg');

    this.bindEvents();
  }

  bindEvents() {
    if (!this.btnNo || !this.btnYes) return;

    // Runaway NO button on mouseenter, mousemove nearby, touchstart, or pointerover
    const dodge = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dodgeNoButton();
    };

    this.btnNo.addEventListener('mouseenter', dodge);
    this.btnNo.addEventListener('touchstart', dodge, { passive: false });
    this.btnNo.addEventListener('pointerenter', dodge);
    this.btnNo.addEventListener('click', dodge);

    // Nearby cursor detection in arena
    if (this.arena) {
      this.arena.addEventListener('mousemove', (e) => {
        if (!this.btnNo) return;
        const rect = this.btnNo.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 65) {
          this.dodgeNoButton();
        }
      });
    }

    // YES Button Click
    this.btnYes.addEventListener('click', () => {
      if (this.isTransitioning) return;
      this.handleYes();
    });
  }

  open() {
    if (!this.container) return;
    document.body.classList.add('modal-active');
    this.container.classList.add('is-open');
    this.loadQuestion(this.currentIndex);
    if (window.soundFX) window.soundFX.chime(1);
  }

  close() {
    if (!this.container) return;
    document.body.classList.remove('modal-active');
    this.container.classList.remove('is-open');
  }

  loadQuestion(idx) {
    if (idx >= LOVE_QUESTIONS.length) {
      this.completeQuest();
      return;
    }

    const q = LOVE_QUESTIONS[idx];
    this.currentIndex = idx;
    this.dodgeCount = 0;

    // Reset button positions
    this.btnNo.style.transform = 'translate(0px, 0px)';
    this.btnYes.style.transform = 'scale(1)';
    if (this.teaseBubble) this.teaseBubble.classList.remove('is-shown');

    // Update Card Content with smooth fade
    if (this.card) {
      this.card.classList.remove('card-flip');
      void this.card.offsetWidth; // trigger reflow
      this.card.classList.add('card-flip');
    }

    const girlName = window.SiteConfig?.recipientName || 'Misty';
    this.badgeEl.textContent = q.badge;
    this.emojiEl.textContent = q.emoji;
    this.questionEl.textContent = q.question.replace(/Misty/g, girlName);
    this.subtextEl.textContent = q.subtext.replace(/Misty/g, girlName);

    // Progress bar
    const pct = ((idx + 1) / LOVE_QUESTIONS.length) * 100;
    this.progressFill.style.width = `${pct}%`;
  }

  dodgeNoButton() {
    if (!this.arena || !this.btnNo) return;

    this.dodgeCount++;
    if (window.soundFX) window.soundFX.boing();

    const aR = this.arena.getBoundingClientRect();
    const bR = this.btnNo.getBoundingClientRect();

    // Calculate maximum translation bounds within arena
    const maxX = (aR.width - bR.width) * 0.45;
    const maxY = (aR.height - bR.height) * 0.45;

    // Pick a new position that is far from current
    let rx = (Math.random() * 2 - 1) * maxX;
    let ry = (Math.random() * 2 - 1) * maxY;

    // Give it a playful rotation
    const rot = (Math.random() - 0.5) * 24;

    this.btnNo.style.transition = 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
    this.btnNo.style.transform = `translate(${rx}px, ${ry}px) rotate(${rot}deg)`;

    // YES button gets bigger and more noticeable with each dodge!
    const yesScale = Math.min(1.35, 1 + this.dodgeCount * 0.05);
    this.btnYes.style.transform = `scale(${yesScale})`;

    // Show tease bubble with funny messages
    if (this.teaseBubble) {
      const msg = TEASE_MESSAGES[Math.floor(Math.random() * TEASE_MESSAGES.length)];
      this.teaseBubble.textContent = msg;
      this.teaseBubble.classList.add('is-shown');
      clearTimeout(this._bubbleTimer);
      this._bubbleTimer = setTimeout(() => {
        this.teaseBubble.classList.remove('is-shown');
      }, 1400);
    }
  }

  handleYes() {
    this.isTransitioning = true;
    const q = LOVE_QUESTIONS[this.currentIndex];

    // Sound and massive heart confetti
    if (window.soundFX) {
      window.soundFX.chime(1.2);
      window.soundFX.triumph();
    }
    this.spawnHeartConfetti();

    // Show congratulations feedback toast
    this.congratsMsg.innerHTML = `<strong>${q.response}</strong>`;
    this.congratsToast.classList.add('is-shown');

    setTimeout(() => {
      this.congratsToast.classList.remove('is-shown');
      this.isTransitioning = false;
      this.loadQuestion(this.currentIndex + 1);
    }, 2000);
  }

  spawnHeartConfetti() {
    const emojis = ['💖', '💕', '💍', '✨', '🥰', '🌸', '❤️', '🎉'];
    const container = document.body;

    for (let i = 0; i < 35; i++) {
      const el = document.createElement('span');
      el.className = 'floating-heart-burst';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${50 + (Math.random() - 0.5) * 60}%`;
      el.style.top = `${50 + (Math.random() - 0.5) * 40}%`;
      el.style.fontSize = `${Math.random() * 20 + 20}px`;
      container.appendChild(el);

      const dx = (Math.random() - 0.5) * 300;
      const dy = (Math.random() - 0.8) * 350;
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

  completeQuest() {
    this.close();
    window.journey?.unlock('game');
    // Launch Car Mission automatically strictly on Mode 1 (Love Car)
    if (window.loveGame) {
      window.loveGame.switchMode(1);
      window.loveGame.open();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.loveQuest = new LoveQuest();
});
