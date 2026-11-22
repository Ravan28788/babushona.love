// Romantic Love Piano & Musical Instruments Engine
// Supports: Grand Piano, Acoustic Guitar, Symphony Strings, Heartbeat Drums
// Includes: Guided Melody Songs (Happy Birthday, Tum Hi Ho, Dheere Dheere) & Free Play

const PIANO_NOTES_MAP = {
  'C4': { freq: 261.63, key: 'a' },
  'C#4': { freq: 277.18, key: 'w' },
  'D4': { freq: 293.66, key: 's' },
  'D#4': { freq: 311.13, key: 'e' },
  'E4': { freq: 329.63, key: 'd' },
  'F4': { freq: 349.23, key: 'f' },
  'F#4': { freq: 369.99, key: 't' },
  'G4': { freq: 392.00, key: 'g' },
  'G#4': { freq: 415.30, key: 'y' },
  'A4': { freq: 440.00, key: 'h' },
  'A#4': { freq: 466.16, key: 'u' },
  'B4': { freq: 493.88, key: 'j' },
  'C5': { freq: 523.25, key: 'k' },
  'C#5': { freq: 554.37, key: 'o' },
  'D5': { freq: 587.33, key: 'l' },
  'D#5': { freq: 622.25, key: 'p' },
  'E5': { freq: 659.25, key: ';' }
};

const PIANO_MELODIES = {
  birthday: {
    title: '🎂 Happy Birthday To You',
    notes: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4', 'C4', 'C4', 'C5', 'A4', 'F4', 'E4', 'D4']
  },
  tumhiho: {
    title: '💖 Tum Hi Ho (Aashiqui 2)',
    notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'F4', 'G4', 'F4', 'E4', 'D4', 'E4', 'C4', 'D4', 'E4']
  },
  dheere: {
    title: '🌹 Dheere Dheere Se Meri Zindagi',
    notes: ['C4', 'E4', 'G4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'E4', 'G4', 'C5', 'B4', 'A4', 'G4']
  }
};

class LovePianoGame {
  constructor() {
    this.modal = document.getElementById('pianoModal');
    this.keysWrap = document.getElementById('pianoKeys');
    this.titleEl = document.getElementById('pianoTitle');
    this.subEl = document.getElementById('pianoSub');
    this.guidePrompt = document.getElementById('pianoGuidePrompt');
    this.scoreTag = document.getElementById('pianoScoreTag');
    this.noteSpawner = document.getElementById('pianoNoteSpawner');

    this.currentInstrument = 'piano'; // 'piano', 'guitar', 'strings', 'drums'
    this.currentSongKey = 'free'; // 'free', 'birthday', 'tumhiho', 'dheere'
    this.songStep = 0;
    this.isOpen = false;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    if (!this.modal) return;
    this.closeBtn = document.getElementById('closePianoBtn');
    this.instTabs = this.modal.querySelectorAll('.inst-tab');
    this.songBtns = this.modal.querySelectorAll('.pm-song-btn');
  }

  ensureElements() {
    if (!this.modal) {
      this.modal = document.getElementById('pianoModal');
      this.keysWrap = document.getElementById('pianoKeys');
      this.titleEl = document.getElementById('pianoTitle');
      this.subEl = document.getElementById('pianoSub');
      this.guidePrompt = document.getElementById('pianoGuidePrompt');
      this.scoreTag = document.getElementById('pianoScoreTag');
      this.noteSpawner = document.getElementById('pianoNoteSpawner');
      this.initElements();
      this.bindEvents();
    }
  }

  open(instrument = 'piano') {
    this.ensureElements();
    if (!this.modal) return;
    this.isOpen = true;
    this.modal.classList.add('is-open');
    document.body.classList.add('modal-active');

    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    const boyName = window.SiteConfig?.senderName || window.SiteConfig?.sender || 'Yuvi';

    if (this.titleEl) {
      this.titleEl.innerHTML = `🎹 Romantic Love Piano for Queen ${girlName}! 🎵`;
    }
    if (this.subEl) {
      this.subEl.textContent = `Play sweet romantic melodies with mouse, touch or keyboard! Dedicated with love from ${boyName} ♥`;
    }

    this.setInstrument(instrument);
    this.setSong('free');

    if (window.soundFX) window.soundFX.chime?.(1.3);
  }

  close() {
    if (!this.modal) return;
    this.isOpen = false;
    this.modal.classList.remove('is-open');
    document.body.classList.remove('modal-active');
    this.clearTargetHighlights();
  }

  onProfileChange(cfg) {
    this.ensureElements();
    const girlName = cfg?.recipientName || cfg?.name || window.SiteConfig?.recipientName || 'Misty';
    const boyName = cfg?.senderName || cfg?.sender || window.SiteConfig?.senderName || 'Yuvi';
    if (this.titleEl) {
      this.titleEl.innerHTML = `🎹 Romantic Love Piano for Queen ${girlName}! 🎵`;
    }
    if (this.subEl) {
      this.subEl.textContent = `Play sweet romantic melodies with mouse, touch or keyboard! Dedicated with love from ${boyName} ♥`;
    }
  }

  setInstrument(inst) {
    this.currentInstrument = inst;
    this.instTabs?.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.inst === inst);
    });

    if (this.guidePrompt) {
      const names = {
        piano: 'Grand Romantic Piano 🎹',
        guitar: 'Acoustic Love Guitar 🎸',
        strings: 'Symphony Strings 🎻',
        drums: 'Heartbeat Love Drums 🥁'
      };
      this.guidePrompt.innerHTML = `Active Instrument: <strong>${names[inst] || 'Piano'}</strong>. Tap any key to play! 🎶`;
    }
  }

  setSong(songKey) {
    this.currentSongKey = songKey;
    this.songStep = 0;
    this.songBtns?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.song === songKey);
    });

    this.clearTargetHighlights();

    if (songKey === 'free') {
      if (this.scoreTag) this.scoreTag.style.display = 'none';
      if (this.guidePrompt) this.guidePrompt.textContent = '✨ Free Play Mode: Play your own romantic tune!';
    } else {
      const song = PIANO_MELODIES[songKey];
      if (song && this.scoreTag) {
        this.scoreTag.style.display = 'inline-block';
        this.updateScoreUI();
      }
      this.highlightNextSongNote();
    }
  }

  updateScoreUI() {
    const song = PIANO_MELODIES[this.currentSongKey];
    if (song && this.scoreTag) {
      this.scoreTag.textContent = `⭐ ${song.title}: Note ${this.songStep + 1} / ${song.notes.length}`;
    }
  }

  highlightNextSongNote() {
    this.clearTargetHighlights();
    const song = PIANO_MELODIES[this.currentSongKey];
    if (!song) return;

    if (this.songStep >= song.notes.length) {
      // Completed!
      this.onSongComplete(song);
      return;
    }

    const targetNote = song.notes[this.songStep];
    const keyEl = this.modal.querySelector(`.piano-key[data-note="${targetNote}"]`);
    if (keyEl) {
      keyEl.classList.add('is-target-note');
      if (this.guidePrompt) {
        this.guidePrompt.innerHTML = `🎯 Target Note: <strong>${targetNote}</strong> (Key: <strong>${keyEl.dataset.key?.toUpperCase()}</strong>)`;
      }
    }
  }

  clearTargetHighlights() {
    this.modal?.querySelectorAll('.piano-key').forEach(k => {
      k.classList.remove('is-target-note');
    });
  }

  onSongComplete(song) {
    const girlName = window.SiteConfig?.recipientName || window.SiteConfig?.name || 'Misty';
    if (window.soundFX) window.soundFX.victoryFanfare?.();

    if (this.guidePrompt) {
      this.guidePrompt.innerHTML = `🎉 <strong>MELODY COMPLETE!</strong> Queen ${girlName}'s heart is dancing to the music! 💖🏆`;
    }

    // Spawn heart explosion
    for (let i = 0; i < 25; i++) {
      setTimeout(() => this.spawnFloatingNote(null, ['💖', '🎉', '🏆', '⭐', '🎹', '✨'][i % 6]), i * 40);
    }

    setTimeout(() => {
      this.setSong('free');
    }, 3200);
  }

  playNote(noteName, freq, isUserClick = true) {
    if (!freq && PIANO_NOTES_MAP[noteName]) {
      freq = PIANO_NOTES_MAP[noteName].freq;
    }
    if (!freq) return;

    // Synthesize note with realistic acoustic sustain (like musicca.com/piano)
    if (window.soundFX) {
      window.soundFX.playPianoNote?.(freq, this.currentInstrument, 2.2);
    }

    // Visual press on key
    const keyEl = this.modal?.querySelector(`.piano-key[data-note="${noteName}"]`);
    if (keyEl) {
      keyEl.classList.add('is-pressed');
      setTimeout(() => keyEl.classList.remove('is-pressed'), 200);
      this.spawnFloatingNote(keyEl);
    }

    // Check guided melody progress
    if (isUserClick && this.currentSongKey !== 'free') {
      const song = PIANO_MELODIES[this.currentSongKey];
      if (song) {
        const expectedNote = song.notes[this.songStep];
        if (noteName === expectedNote) {
          this.songStep++;
          this.updateScoreUI();
          this.highlightNextSongNote();
        }
      }
    }
  }

  spawnFloatingNote(keyEl, customEmoji = null) {
    const container = this.noteSpawner || this.modal;
    if (!container) return;

    const el = document.createElement('span');
    el.className = 'floating-piano-note';
    el.textContent = customEmoji || ['🎵', '🎶', '💖', '✨', '⭐', '🎹'][Math.floor(Math.random() * 6)];

    let startX = 50;
    if (keyEl) {
      const rect = keyEl.getBoundingClientRect();
      const wrapRect = this.modal.getBoundingClientRect();
      startX = ((rect.left + rect.width / 2 - wrapRect.left) / wrapRect.width) * 100;
    } else {
      startX = 20 + Math.random() * 60;
    }

    el.style.left = `${startX}%`;
    el.style.bottom = '140px';
    container.appendChild(el);

    const dx = (Math.random() - 0.5) * 60;
    const dy = -(120 + Math.random() * 80);
    const rot = (Math.random() - 0.5) * 45;

    el.animate([
      { transform: 'translate(0, 0) scale(0.6)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.3)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 400,
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
    }).onfinish = () => el.remove();
  }

  bindEvents() {
    // Close button
    this.closeBtn?.addEventListener('click', () => this.close());

    // Piano key clicks
    this.keysWrap?.addEventListener('click', (e) => {
      const keyEl = e.target.closest('.piano-key');
      if (keyEl) {
        const note = keyEl.dataset.note;
        const freq = parseFloat(keyEl.dataset.freq);
        this.playNote(note, freq, true);
      }
    });

    // Instrument tabs
    this.instTabs?.forEach(tab => {
      tab.addEventListener('click', () => {
        this.setInstrument(tab.dataset.inst);
      });
    });

    // Guided song buttons
    this.songBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setSong(btn.dataset.song);
      });
    });

    // Keyboard keys (Physical computer keyboard: A, S, D, F, G, H, J, K, etc.)
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const char = e.key.toLowerCase();
      const keyEl = this.modal?.querySelector(`.piano-key[data-key="${char}"]`);
      if (keyEl) {
        e.preventDefault();
        const note = keyEl.dataset.note;
        const freq = parseFloat(keyEl.dataset.freq);
        this.playNote(note, freq, true);
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Cross-game navigation buttons in Piano Modal
    document.getElementById('pianoJumpCarBtn')?.addEventListener('click', () => {
      this.close();
      window.loveGame?.open();
    });

    document.getElementById('pianoJumpPuzzleBtn')?.addEventListener('click', () => {
      this.close();
      window.lovePuzzle?.open();
    });

    document.getElementById('pianoJumpGiftsBtn')?.addEventListener('click', () => {
      this.close();
      window.birthdayGifts?.open();
    });
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  if (!window.lovePiano) {
    window.lovePiano = new LovePianoGame();
  } else {
    window.lovePiano.ensureElements();
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('open_piano') === '1') {
    setTimeout(() => window.lovePiano?.open(), 400);
  }
});
window.lovePiano = new LovePianoGame();
