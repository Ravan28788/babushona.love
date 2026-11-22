// Misty & Yuvi's Romantic Photo Puzzle Game (3x3 Love Jigsaw)
class LovePuzzleGame {
  constructor() {
    this.modal = document.getElementById('puzzleModal');
    this.board = document.getElementById('puzzleBoard');
    this.refPreview = document.getElementById('puzzleRefPreview');
    this.refImg = document.getElementById('puzzleRefImg');
    this.peekBtn = document.getElementById('puzzlePeekBtn');
    this.helpBtn = document.getElementById('puzzleHelpBtn');
    this.closeBtn = document.getElementById('closePuzzleBtn');
    this.changePhotoBtn = document.getElementById('puzzleChangePhotoBtn');
    this.photoUpload = document.getElementById('puzzlePhotoUpload');
    this.tipBanner = document.getElementById('puzzleTipBanner');
    this.piecesMatchedEl = document.getElementById('puzzlePiecesMatched');
    this.moveCountEl = document.getElementById('puzzleMoveCount');
    this.kissesCountEl = document.getElementById('puzzleKissesCount');
    this.winCard = document.getElementById('puzzleWinCard');
    this.playAgainBtn = document.getElementById('puzzlePlayAgainBtn');
    this.claimGiftsBtn = document.getElementById('puzzleClaimGiftsBtn');

    // Skip Puzzles Elements & State (User requested: only 1 puzzle mandatory, then can skip remaining)
    this.skipBtn = document.getElementById('puzzleSkipBtn');
    this.bigSkipBtn = document.getElementById('puzzleBigSkipBtn');
    this.winSkipBtn = document.getElementById('puzzleWinSkipBtn');
    this.reqStatusEl = document.getElementById('puzzleRequiredStatus');
    this.skipBigSubText = document.getElementById('skipBigSubText');
    this.solvedPuzzlesCount = parseInt(localStorage.getItem('misty_solved_puzzles_count') || '0', 10);

    // Yuvi Help Modal Elements
    this.helpModal = document.getElementById('puzzleHelpModal');
    this.phCloseBtn = document.getElementById('phCloseBtn');
    this.phBackdrop = document.getElementById('phBackdrop');
    this.phKissCountText = document.getElementById('phKissCountText');
    this.phProgressFill = document.getElementById('phProgressFill');
    this.phSpeech = document.getElementById('phSpeech');
    this.phKissFxStage = document.getElementById('phKissFxStage');
    this.btnKissFlying = document.getElementById('btnKissFlying');
    this.btnKissSweet = document.getElementById('btnKissSweet');
    this.btnKissHug = document.getElementById('btnKissHug');

    this.gridSize = 3;
    this.totalPieces = 9;
    this.tiles = [];
    this.selectedTileIndex = null;
    this.moves = 0;
    this.totalKissesGiven = 0;
    this.currentHelpKisses = 0;
    this.imageSrc = './images/misty_cute_cheeks.jpg';
    this.isSolved = false;

    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn?.addEventListener('click', () => this.close());
    this.playAgainBtn?.addEventListener('click', () => this.initGame());
    this.claimGiftsBtn?.addEventListener('click', () => {
      this.close();
      window.journey?.unlock('gifts');
      window.birthdayGifts?.open();
    });

    // Skip remaining puzzles handlers (Enabled when >= 1 puzzle is solved)
    const handleSkip = () => {
      if (this.solvedPuzzlesCount < 1) {
        if (window.soundFX) window.soundFX.boing();
        this.showSkipLockedAlert();
      } else {
        if (window.soundFX) {
          window.soundFX.victoryFanfare?.();
        }
        this.close();
        window.journey?.unlock('gifts');
        window.birthdayGifts?.open();
      }
    };

    this.skipBtn?.addEventListener('click', handleSkip);
    this.bigSkipBtn?.addEventListener('click', handleSkip);
    this.winSkipBtn?.addEventListener('click', handleSkip);

    // Peek reference photo
    this.peekBtn?.addEventListener('click', () => {
      if (!this.refPreview) return;
      const isVisible = this.refPreview.style.display !== 'none';
      this.refPreview.style.display = isVisible ? 'none' : 'flex';
    });

    this.refPreview?.addEventListener('click', () => {
      this.refPreview.style.display = 'none';
    });

    // Photo picker gallery buttons
    document.querySelectorAll('.picker-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        if (src) this.setImage(src, btn);
      });
    });

    // Custom photo upload
    this.changePhotoBtn?.addEventListener('click', () => {
      this.photoUpload?.click();
    });

    this.photoUpload?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target.result;
          this.setImage(dataUrl, null);
        };
        reader.readAsDataURL(file);
      }
    });

    // Yuvi Help Button Click
    this.helpBtn?.addEventListener('click', () => {
      if (this.isSolved) {
        if (this.tipBanner) {
          this.tipBanner.style.display = 'block';
          this.tipBanner.innerHTML = '🎉 Arre meri jaan, puzzle already complete ho chuka hai! You are a genius! 👑❤️';
        }
        return;
      }
      this.openHelpModal();
    });

    this.phCloseBtn?.addEventListener('click', () => this.closeHelpModal());
    this.phBackdrop?.addEventListener('click', () => this.closeHelpModal());

    // Kiss action buttons
    this.btnKissFlying?.addEventListener('click', () => this.giveKiss('💋'));
    this.btnKissSweet?.addEventListener('click', () => this.giveKiss('😘'));
    this.btnKissHug?.addEventListener('click', () => this.giveKiss('👩‍❤️‍💋‍👨'));
  }

  setImage(src, activeBtn = null) {
    this.imageSrc = src;
    if (this.refImg) this.refImg.src = src;
    document.querySelectorAll('.picker-thumb').forEach(b => b.classList.remove('is-active'));
    if (activeBtn) activeBtn.classList.add('is-active');
    if (this.tipBanner) this.tipBanner.style.display = 'none';
    this.initGame();
  }

  open() {
    if (!this.modal) return;
    document.body.classList.add('modal-active');
    this.modal.classList.add('is-open');
    this.refreshDynamicTexts();
    this.updateSkipButtonUI();

    // Auto-load custom profile puzzle images if available
    const cfg = window.SiteConfig || {};
    this.onProfileChange(cfg);

    if (!this.tiles.length || this.isSolved) {
      this.initGame();
    }
  }

  refreshDynamicTexts() {
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
    const puzzleTitle = document.getElementById('puzzleTitle') || document.querySelector('.puzzle-title');
    if (puzzleTitle) {
      puzzleTitle.innerHTML = `${girlName}'s Love Puzzle 👩‍❤️‍👨`;
    }
    const mandatoryHeading = document.getElementById('puzzleMandatoryHeading') || document.querySelector('.pmb-heading');
    if (mandatoryHeading) {
      mandatoryHeading.innerHTML = `👑 MANDATORY NOTICE FOR QUEEN ${girlName.toUpperCase()}:`;
    }
    const pickerThumbFirst = document.querySelector('.picker-thumb[data-src*="misty_cute_cheeks"] span');
    if (pickerThumbFirst) {
      pickerThumbFirst.textContent = `Queen ${girlName} 💕`;
    }
  }

  updatePuzzlePickerStrip(images) {
    const strip = document.getElementById('puzzlePickerScroll') || document.getElementById('puzzlePickerStrip');
    if (!strip) return;
    const cfg = window.SiteConfig || {};
    const girlName = cfg.recipientName || cfg.name || 'Queen';
    const isMisty = (!girlName || girlName.toLowerCase() === 'misty');

    const AESTHETIC_PUZZLE_FALLBACKS = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
    ];

    let validImages = [];
    if (Array.isArray(images) && images.length > 0) {
      validImages = images.filter(img => typeof img === 'string' && img.trim() && !img.includes('undefined') && !img.includes('favicon.png'));
    }

    // If images is empty or incomplete, check all custom profile media
    if (validImages.length === 0 && !isMisty) {
      const p = cfg.customPhotos || {};
      const candidates = [
        p.puzzlePhoto, p.puzzle,
        p.mainPortrait, p.portrait,
        ...(Array.isArray(cfg.puzzleImages) ? cfg.puzzleImages : []),
        ...(Array.isArray(cfg.albumPhotos) ? cfg.albumPhotos : []),
        p.liveHug, p.hug,
        p.bgTheme, p.bg
      ].filter(img => typeof img === 'string' && img.trim() && !img.includes('undefined') && !img.includes('misty1.jpg') && !img.includes('gift_dress') && !img.includes('gift_thar') && !img.includes('gift_ps5') && !img.includes('paymentQr') && !img.includes('favicon.png'));
      validImages = candidates;
    }

    let finalImages = null;
    if (validImages.length > 0) {
      finalImages = [...validImages];
      const count = finalImages.length;
      while (finalImages.length < 6) {
        finalImages.push(finalImages[finalImages.length % count]);
      }
    } else if (!isMisty) {
      finalImages = [...AESTHETIC_PUZZLE_FALLBACKS];
    }

    if (!finalImages) return; // Keep Misty defaults if Misty

    strip.innerHTML = '';
    finalImages.forEach((src, idx) => {
      const btn = document.createElement('button');
      btn.className = `picker-thumb ${idx === 0 ? 'is-active' : ''}`;
      btn.type = 'button';
      btn.dataset.src = src;
      btn.title = `Queen ${girlName} Puzzle Photo ${idx + 1}`;
      btn.innerHTML = `<img src="${src}" alt="Queen ${girlName} Photo ${idx + 1}" /><span>Photo ${idx + 1}</span>`;
      const thumbImg = btn.querySelector('img');
      if (thumbImg) {
        thumbImg.onerror = () => {
          thumbImg.onerror = null;
          thumbImg.src = finalImages[0] || AESTHETIC_PUZZLE_FALLBACKS[idx % AESTHETIC_PUZZLE_FALLBACKS.length];
        };
      }
      btn.addEventListener('click', () => {
        this.setImage(src, btn);
      });
      strip.appendChild(btn);
    });

    if (finalImages[0]) {
      this.setImage(finalImages[0], strip.firstChild);
    }
  }

  onProfileChange(cfg) {
    this.refreshDynamicTexts();
    if (!cfg) return;
    const girlName = cfg.recipientName || cfg.name || 'Queen';
    const isMisty = (!girlName || girlName.toLowerCase() === 'misty');

    const customP = [];
    if (Array.isArray(cfg.puzzleImages) && cfg.puzzleImages.length > 0) {
      cfg.puzzleImages.forEach(img => {
        if (img && typeof img === 'string' && img.trim() && !img.includes('undefined') && !img.includes('favicon.png')) {
          customP.push(img);
        }
      });
    }
    const p = cfg.customPhotos || {};
    if (p.puzzlePhoto || p.puzzle) customP.push(p.puzzlePhoto || p.puzzle);
    if (p.mainPortrait || p.portrait) customP.push(p.mainPortrait || p.portrait);
    if (p.liveHug || p.hug) customP.push(p.liveHug || p.hug);
    if (p.bgTheme || p.bg) customP.push(p.bgTheme || p.bg);
    if (Array.isArray(cfg.albumPhotos)) {
      cfg.albumPhotos.forEach(img => { if (img) customP.push(img); });
    }

    const uniqueP = Array.from(new Set(customP.filter(Boolean)));
    if (uniqueP.length > 0 || !isMisty) {
      this.updatePuzzlePickerStrip(uniqueP);
    }
  }

  close() {
    if (!this.modal) return;
    document.body.classList.remove('modal-active');
    this.modal.classList.remove('is-open');
    this.closeHelpModal();
  }

  initGame() {
    this.isSolved = false;
    this.moves = 0;
    this.selectedTileIndex = null;
    if (this.winCard) this.winCard.style.display = 'none';
    if (this.moveCountEl) this.moveCountEl.textContent = '0';
    if (this.kissesCountEl) this.kissesCountEl.textContent = `${this.totalKissesGiven}`;
    this.updateSkipButtonUI();

    // Initialize 9 piece positions [0..8]
    const order = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // Shuffle so at least 6 pieces are displaced
    let displaced = 0;
    let attempts = 0;
    while (displaced < 6 && attempts < 20) {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      displaced = order.filter((pos, idx) => pos !== idx).length;
      attempts++;
    }

    this.tiles = order.map((originIndex, currentIndex) => ({
      originIndex,
      currentIndex
    }));

    this.renderBoard();
    this.updateStats();
  }

  renderBoard() {
    if (!this.board) return;
    this.board.innerHTML = '';

    this.tiles.forEach((tile, index) => {
      const pieceEl = document.createElement('div');
      pieceEl.className = 'puzzle-piece';
      pieceEl.dataset.index = index;

      // Calculate row and column of original image fragment
      const origRow = Math.floor(tile.originIndex / 3);
      const origCol = tile.originIndex % 3;

      pieceEl.style.backgroundImage = `url("${this.imageSrc}")`;
      pieceEl.style.backgroundSize = '300% 300%';
      // 0% for col 0, 50% for col 1, 100% for col 2
      pieceEl.style.backgroundPosition = `${origCol * 50}% ${origRow * 50}%`;

      const isCorrect = tile.originIndex === index;
      if (isCorrect) {
        pieceEl.classList.add('is-matched');
        const badge = document.createElement('span');
        badge.className = 'matched-badge';
        badge.textContent = '✓';
        pieceEl.appendChild(badge);
      }

      if (this.selectedTileIndex === index) {
        pieceEl.classList.add('is-selected');
      }

      pieceEl.addEventListener('click', () => this.handleTileClick(index));
      this.board.appendChild(pieceEl);
    });
  }

  handleTileClick(index) {
    if (this.isSolved) return;

    if (this.selectedTileIndex === null) {
      // First piece selected
      this.selectedTileIndex = index;
      if (window.soundFX) window.soundFX.chime(1.1);
      this.renderBoard();
    } else if (this.selectedTileIndex === index) {
      // Deselect
      this.selectedTileIndex = null;
      this.renderBoard();
    } else {
      // Swap tiles!
      this.swapTiles(this.selectedTileIndex, index);
      this.selectedTileIndex = null;
    }
  }

  swapTiles(indexA, indexB) {
    if (indexA === indexB) return;

    // Swap tile data
    const tempOrigin = this.tiles[indexA].originIndex;
    this.tiles[indexA].originIndex = this.tiles[indexB].originIndex;
    this.tiles[indexB].originIndex = tempOrigin;

    this.moves++;
    if (this.moveCountEl) this.moveCountEl.textContent = `${this.moves}`;

    if (window.soundFX) {
      window.soundFX.chime(1.3);
    }

    this.renderBoard();
    this.updateStats();

    // Check if won
    this.checkWin();
  }

  updateStats() {
    const matchedCount = this.tiles.filter((t, i) => t.originIndex === i).length;
    if (this.piecesMatchedEl) {
      this.piecesMatchedEl.textContent = `${matchedCount} / ${this.totalPieces} Solved`;
    }
  }

  checkWin() {
    const matchedCount = this.tiles.filter((t, i) => t.originIndex === i).length;
    if (matchedCount === this.totalPieces && !this.isSolved) {
      this.isSolved = true;
      this.solvedPuzzlesCount++;
      localStorage.setItem('misty_solved_puzzles_count', this.solvedPuzzlesCount);

      // Unlock gifts & activate skip button
      window.journey?.unlock('gifts');
      this.updateSkipButtonUI();

      if (window.soundFX) {
        window.soundFX.victoryFanfare();
        setTimeout(() => window.soundFX.kissSound?.(), 300);
        setTimeout(() => window.soundFX.kissSound?.(), 650);
      }
      this.board?.classList.add('is-completed-glowing');
      setTimeout(() => {
        if (this.winCard) {
          const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
          const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';
          const winTitle = this.winCard.querySelector('.win-title');
          if (winTitle) winTitle.textContent = `YOU DID IT, QUEEN ${girlName.toUpperCase()}! 👩‍❤️‍💋‍👨💖`;
          const winWords = this.winCard.querySelector('.win-love-words');
          if (winWords) {
            winWords.innerHTML = `"${girlName} my babe, meri girlfriend, meri world, mera babu shona, my love...<br>Tumne hamara love puzzle solve kar diya! Tum mere dil ka sabse keemti tukda ho, aur tumhare bina meri zindagi bilkul incomplete hai! I love you so much! 💍🏰❤️💋"`;
          }
          this.winCard.style.display = 'block';
        }
        this.spawnWinCelebration();
      }, 700);
    }
  }

  // Kiss-Exchange Help Modal
  openHelpModal() {
    if (!this.helpModal) return;
    this.currentHelpKisses = 0;
    this.updateHelpUI();
    const boyName = window.SiteConfig?.senderName || 'Yuvi';
    if (this.phSpeech) {
      this.phSpeech.innerHTML = `"Aise hi help nahi milegi babu! 😜 Pehle apne ${boyName} ko <strong>5 sweet sweet kisses</strong> do, tabhi main help karunga puzzle solve karne mein! 😘💋"`;
    }
    this.helpModal.style.display = 'flex';
  }

  closeHelpModal() {
    if (!this.helpModal) return;
    this.helpModal.style.display = 'none';
  }

  updateHelpUI() {
    const target = 5;
    const count = this.currentHelpKisses;
    const pct = Math.min(100, Math.round((count / target) * 100));
    if (this.phKissCountText) this.phKissCountText.textContent = `${count} / ${target} 💋`;
    if (this.phProgressFill) this.phProgressFill.style.width = `${pct}%`;
  }

  giveKiss(emoji = '💋') {
    if (this.currentHelpKisses >= 5) return;

    this.currentHelpKisses++;
    this.totalKissesGiven++;
    if (this.kissesCountEl) this.kissesCountEl.textContent = `${this.totalKissesGiven}`;

    if (window.soundFX) {
      window.soundFX.kissSound?.();
    }

    this.spawnFlyingKissAnimation(emoji);
    this.updateHelpUI();

    // Sweet reactions as she kisses him
    const boyName = window.SiteConfig?.senderName || 'Yuvi';
    const reactions = [
      '"Mmm... aur do babu! 🥰"',
      '"Kitni sweet kissi hai meri jaan! 💖"',
      `"${boyName} ka dil khush ho gaya! Aur 2 kissi do! 💋"`,
      '"Bas ek aur sweet si kissi, babu! 🥺❤️"',
      `"Awww my love! Kisses complete! Ab dekho ${boyName} aapke 2 pieces solve karta hai! 🥰👑"`
    ];
    if (this.phSpeech) {
      this.phSpeech.innerHTML = reactions[this.currentHelpKisses - 1] || '"Thank you my love! 🥰"';
    }

    // When 5 kisses are completed, trigger Yuvi's help to solve 2 pieces!
    if (this.currentHelpKisses >= 5) {
      if (window.soundFX) {
        window.soundFX.triumph();
      }
      setTimeout(() => {
        this.closeHelpModal();
        this.applyYuviHelpTip();
      }, 1000);
    }
  }

  spawnFlyingKissAnimation(emoji) {
    const stage = this.phKissFxStage || document.body;
    const el = document.createElement('div');
    el.className = 'ph-floating-kiss';
    el.textContent = emoji;
    el.style.left = `${30 + Math.random() * 40}%`;
    el.style.bottom = '20px';
    stage.appendChild(el);

    const driftX = (Math.random() - 0.5) * 80;
    el.animate([
      { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
      { transform: `translate(${driftX * 0.4}px, -60px) scale(1.3)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${driftX}px, -150px) scale(0.8)`, opacity: 0 }
    ], {
      duration: 1200,
      easing: 'ease-out'
    }).onfinish = () => el.remove();
  }

  // Yuvi places exactly 2 pieces in their correct position!
  applyYuviHelpTip() {
    // Find pieces that are currently misplaced
    const misplacedIndices = [];
    this.tiles.forEach((tile, index) => {
      if (tile.originIndex !== index) {
        misplacedIndices.push(index);
      }
    });

    if (misplacedIndices.length === 0) return;

    // Place up to 2 correct pieces
    const piecesToFix = Math.min(2, misplacedIndices.length);
    const fixedIndices = [];

    for (let f = 0; f < piecesToFix; f++) {
      // Pick the first remaining misplaced target index
      let targetSlot = null;
      for (let i = 0; i < 9; i++) {
        if (this.tiles[i].originIndex !== i) {
          targetSlot = i;
          break;
        }
      }
      if (targetSlot === null) break;

      // Find where the piece with originIndex === targetSlot currently is
      let currentSlot = this.tiles.findIndex(t => t.originIndex === targetSlot);
      if (currentSlot !== -1 && currentSlot !== targetSlot) {
        // Swap it into targetSlot!
        const temp = this.tiles[targetSlot].originIndex;
        this.tiles[targetSlot].originIndex = this.tiles[currentSlot].originIndex;
        this.tiles[currentSlot].originIndex = temp;
        fixedIndices.push(targetSlot);
      }
    }

    this.renderBoard();
    this.updateStats();

    // Show Tip Banner
    if (this.tipBanner) {
      this.tipBanner.style.display = 'block';
      const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
      const boyName = window.SiteConfig?.senderName || 'Yuvi';
      if (fixedIndices.length >= 2) {
        this.tipBanner.innerHTML = `💡 <strong>${boyName}'s Tip:</strong> 2 pieces solved in their exact place for Queen ${girlName}! 💖 Agar aur help chahiye toh dubara button click karo babu! 😘💋`;
      } else if (fixedIndices.length === 1) {
        this.tipBanner.innerHTML = `💡 <strong>${boyName}'s Tip:</strong> Last piece placed in its exact spot for Queen ${girlName}! Puzzle Solved! 🏆💖`;
      }
    }

    // Highlight the 2 pieces solved by Yuvi with glowing sparkle animation
    fixedIndices.forEach(idx => {
      const pieceEl = this.board?.querySelector(`[data-index="${idx}"]`);
      if (pieceEl) {
        pieceEl.classList.add('yuvi-hint-solved');
        setTimeout(() => pieceEl.classList.remove('yuvi-hint-solved'), 2500);
      }
    });

    if (window.soundFX) {
      window.soundFX.chime(1.5);
    }

    // Check if whole puzzle is solved
    this.checkWin();
  }

  spawnWinCelebration() {
    const flowers = ['🌸', '🌹', '💖', '💐', '💋', '✨', '💍'];
    for (let i = 0; i < 35; i++) {
      const el = document.createElement('div');
      el.className = 'floating-flower-petal';
      el.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      el.style.left = `${Math.random() * 95}%`;
      el.style.top = '-30px';
      el.style.fontSize = `${20 + Math.random() * 22}px`;
      document.body.appendChild(el);

      el.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 0 },
        { transform: `translate(${(Math.random() - 0.5) * 120}px, 50vh) rotate(180deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${(Math.random() - 0.5) * 180}px, 105vh) rotate(360deg)`, opacity: 0 }
      ], {
        duration: 2500 + Math.random() * 1500,
        easing: 'ease-out'
      }).onfinish = () => el.remove();
    }
  }

  // Skip Button UI & State Update (Only 1 puzzle mandatory, remaining can be skipped)
  updateSkipButtonUI() {
    const isUnlocked = this.solvedPuzzlesCount >= 1;

    if (this.reqStatusEl) {
      this.reqStatusEl.innerHTML = isUnlocked 
        ? '✅ 1 Solved! (Can Skip) 🔓' 
        : '1 Solve (Mandatory) 🔒';
    }

    if (this.skipBtn) {
      if (isUnlocked) {
        this.skipBtn.classList.remove('is-locked');
        this.skipBtn.classList.add('is-unlocked');
        this.skipBtn.innerHTML = '<span class="skip-btn-icon">⏭️</span> <span class="skip-btn-text">Skip Puzzles &amp; Open Gifts! 🎁</span>';
        this.skipBtn.title = '1 puzzle solve ho gaya! Click karke baaki puzzles skip karein aur gifts open karein! ✨';
      } else {
        this.skipBtn.classList.add('is-locked');
        this.skipBtn.classList.remove('is-unlocked');
        this.skipBtn.innerHTML = '<span class="skip-btn-icon">🔒</span> <span class="skip-btn-text">Skip (1 Solved Req)</span>';
        this.skipBtn.title = 'Pehle koi bhi 1 puzzle solve karna mandatory hai babu!';
      }
    }

    if (this.bigSkipBtn) {
      if (isUnlocked) {
        this.bigSkipBtn.classList.remove('is-locked');
        this.bigSkipBtn.classList.add('is-unlocked');
        const textSpan = this.bigSkipBtn.querySelector('.skip-big-text');
        if (textSpan) textSpan.innerHTML = '<span class="skip-big-icon">⏭️</span> Skip Remaining Puzzles &amp; Claim Gifts! 🎁';
        if (this.skipBigSubText) {
          this.skipBigSubText.innerHTML = '🎉 Yay! 1 puzzle solved! Baaki puzzles skip karne ke liye yahan click karein! ✨';
        }
      } else {
        this.bigSkipBtn.classList.add('is-locked');
        this.bigSkipBtn.classList.remove('is-unlocked');
        const textSpan = this.bigSkipBtn.querySelector('.skip-big-text');
        if (textSpan) textSpan.innerHTML = '<span class="skip-big-icon">🔒</span> Skip Remaining Puzzles &amp; Claim Gifts! 🎁';
        if (this.skipBigSubText) {
          this.skipBigSubText.innerHTML = '(Pehle koi bhi 1 puzzle solve karna mandatory hai babu)';
        }
      }
    }
  }

  showSkipLockedAlert() {
    if (this.bigSkipBtn) {
      this.bigSkipBtn.classList.add('shake-locked');
      setTimeout(() => this.bigSkipBtn.classList.remove('shake-locked'), 500);
    }
    if (this.skipBtn) {
      this.skipBtn.classList.add('shake-locked');
      setTimeout(() => this.skipBtn.classList.remove('shake-locked'), 500);
    }

    if (this.tipBanner) {
      this.tipBanner.style.display = 'block';
      this.tipBanner.innerHTML = '🔒 <strong>Notice:</strong> Arey babu! In sabhi puzzles mein se <u>koi bhi 1 puzzle solve karna MANDATORY hai</u>! 🥺 Uske baad aap baaki sabhi puzzles skip kar sakti hain! Agar problem ho toh <strong>Yuvi Help</strong> button dabao babu! 😘💋';
      this.tipBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (window.journey) {
      window.journey.showToast('🔒 Pehle koi bhi 1 puzzle solve karna mandatory hai babu! 🧩💖 Uske baad baaki skip kar sakti ho!');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.lovePuzzle = new LovePuzzleGame();
});
