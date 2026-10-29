/**
 * MACHINING LAB V2.0 — PRESENTATION ENGINE (js/engine.js)
 * Slides lifecycle, 16:9 stage scaling, Web Audio synthesizer, wipe FX, shortcuts.
 */

let currentSlide = 0;
let isAudioEnabled = true;
let isOverviewOpen = false;
let audioCtx = null;

const $ = id => document.getElementById(id);

// Web Audio API Procedural Synthesizer
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.08); // C#
      osc.frequency.setValueAtTime(659.25, now + 0.16); // E
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'fanfare') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + idx * 0.1);
        g.gain.setValueAtTime(0.15, now + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        o.start(now + idx * 0.1);
        o.stop(now + idx * 0.1 + 0.4);
      });
    }
  } catch (e) {
    // Audio safe fallback
  }
}

// Stage auto-fit for 16:9 projection (1280 x 720 base)
function fitStage() {
  const stage = $('stage');
  if (!stage) return;
  const availW = window.innerWidth;
  const availH = window.innerHeight - 64;
  const scale = Math.min(availW / 1280, availH / 720);
  stage.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', fitStage);

// Slide Transition Engine
function goSlide(targetIdx) {
  if (targetIdx < 0 || targetIdx >= SLIDES_COUNT) return;
  if (targetIdx === currentSlide && document.querySelector('.slide.on')) return;

  const prevIdx = currentSlide;
  const dir = targetIdx > prevIdx ? 'fw' : 'bw';
  currentSlide = targetIdx;

  playSound('click');

  const wipe = $('wipe');
  if (wipe) {
    wipe.className = '';
    void wipe.offsetWidth; // force reflow
    wipe.className = dir;
  }

  const slides = document.querySelectorAll('.slide');
  const oldSlide = slides[prevIdx];
  const newSlide = slides[targetIdx];

  if (oldSlide) {
    oldSlide.classList.add('out');
  }

  setTimeout(() => {
    slides.forEach((s, idx) => {
      s.classList.remove('on', 'out');
      if (idx === targetIdx) {
        s.classList.add('on');
      }
    });

    // Update progress bar & counter
    if ($('bar')) $('bar').style.width = `${((targetIdx + 1) / SLIDES_COUNT) * 100}%`;
    if ($('slide-count')) $('slide-count').textContent = `${String(targetIdx + 1).padStart(2, '0')} / ${String(SLIDES_COUNT).padStart(2, '0')}`;
    if ($('btn-prev')) $('btn-prev').disabled = targetIdx === 0;
    if ($('btn-next')) $('btn-next').disabled = targetIdx === SLIDES_COUNT - 1;

    // Update overview selection
    document.querySelectorAll('.ov-card').forEach((card, idx) => {
      card.classList.toggle('active', idx === targetIdx);
    });

    // Hash navigation
    history.replaceState(null, '', '#' + (targetIdx + 1));

    // Slide Lifecycle Triggers
    if (typeof resizeThreeMachines === 'function') {
      resizeThreeMachines(targetIdx);
    }
    if (targetIdx === 10 && typeof onQuizSlideEnter === 'function') {
      onQuizSlideEnter();
    }
  }, 320);
}

// Slide 02: Hook Scenario Switcher
function selectHook(idx) {
  playSound('click');
  const data = HOOK_DATA[idx];
  if (!data) return;

  const cards = document.querySelectorAll('#hook-scenarios .tech-card');
  cards.forEach((c, i) => c.classList.toggle('active', i === idx));

  if ($('hook-eval-title')) $('hook-eval-title').innerHTML = data.title;
  if ($('hook-eval-desc')) $('hook-eval-desc').innerHTML = data.desc;
  if ($('hook-eval-rule')) $('hook-eval-rule').innerHTML = data.rule;
}

// UI Toggles
function toggleOverview() {
  isOverviewOpen = !isOverviewOpen;
  $('overview-modal').classList.toggle('open', isOverviewOpen);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function toggleTheme() {
  const isLight = document.documentElement.dataset.theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'dark' : 'light';
}

function toggleAudio() {
  isAudioEnabled = !isAudioEnabled;
  $('btn-audio').textContent = isAudioEnabled ? '🔊' : '🔇';
}

// Hide / Show UI navigation and tool bars (Key H or UI Toggle button)
function toggleUIBars() {
  document.body.classList.toggle('ui-hidden');
  const isHidden = document.body.classList.contains('ui-hidden');
  playSound('click');
  const btn = $('btn-toggle-ui');
  if (btn) {
    btn.innerHTML = isHidden ? '🕶️' : '👁️';
    btn.title = isHidden ? 'Hiện thanh công cụ (Phím H)' : 'Ẩn thanh công cụ (Phím H)';
  }
}

// Build Overview Modal Cards
function buildOverview() {
  const modal = $('overview-modal');
  if (!modal) return;
  modal.innerHTML = '';
  SLIDES_DATA.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = `ov-card ${idx === currentSlide ? 'active' : ''}`;
    const cleanTitle = s.title.replace(/<[^>]*>?/gm, ' ');
    card.innerHTML = `
      <div class="ov-num">SLIDE ${String(idx + 1).padStart(2, '0')}</div>
      <div class="ov-title">${cleanTitle}</div>
      <div style="font-family: var(--mono); font-size: 10px; color: var(--ink-dim);">BẤM ĐỂ CHUYỂN</div>
    `;
    card.onclick = () => {
      goSlide(idx);
      toggleOverview();
    };
    modal.appendChild(card);
  });
}

// Keyboard shortcuts
window.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
    e.preventDefault();
    goSlide(currentSlide + 1);
  } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) {
    e.preventDefault();
    goSlide(currentSlide - 1);
  } else if (e.key === 'Home') {
    goSlide(0);
  } else if (e.key === 'End') {
    goSlide(SLIDES_COUNT - 1);
  } else if (e.key === 'o' || e.key === 'O') {
    toggleOverview();
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  } else if (e.key === 't' || e.key === 'T') {
    toggleTheme();
  } else if (e.key === 'm' || e.key === 'M') {
    toggleAudio();
  } else if (e.key === 'h' || e.key === 'H') {
    toggleUIBars();
  } else if (e.key === 'r' || e.key === 'R') {
    if (currentSlide === 10 && typeof openDicePicker === 'function') {
      openDicePicker();
    }
  } else if (['1', '2', '3', '4'].includes(e.key)) {
    if (currentSlide === 10 && typeof handleQuizSelect === 'function') {
      handleQuizSelect(parseInt(e.key) - 1);
    }
  } else if (e.key === 'Enter') {
    if (currentSlide === 10 && typeof nextQuestion === 'function' && $('qz-next-btn') && $('qz-next-btn').style.display !== 'none') {
      nextQuestion();
    }
  } else if (e.key === 'Escape') {
    if (isOverviewOpen) toggleOverview();
    if (typeof closeDiceModal === 'function') closeDiceModal();
  }
});

// Wheel navigation disabled per user request: allows mouse wheel zoom inside 3D models without changing slides
/*
let lastWheel = 0;
window.addEventListener('wheel', e => {
  if (isOverviewOpen) return;
  const now = Date.now();
  if (now - lastWheel < 600 || Math.abs(e.deltaY) < 30) return;
  lastWheel = now;
  goSlide(currentSlide + (e.deltaY > 0 ? 1 : -1));
}, { passive: true });
*/

let touchStartX = 0;
window.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
window.addEventListener('touchend', e => {
  const diffX = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diffX) > 60) {
    goSlide(currentSlide + (diffX < 0 ? 1 : -1));
  }
}, { passive: true });

// Mouse parallax effect
window.addEventListener('mousemove', e => {
  const mx = (e.clientX / window.innerWidth - 0.5).toFixed(3);
  const my = (e.clientY / window.innerHeight - 0.5).toFixed(3);
  const stage = $('stage');
  if (stage) {
    stage.style.setProperty('--mx', mx);
    stage.style.setProperty('--my', my);
  }
  const coords = $('telemetry-coords');
  if (coords) {
    coords.textContent = `X: ${(120 + mx * 10).toFixed(2)} Y: ${(-45 + my * 8).toFixed(2)} Z: 12.00`;
  }
});

// Confetti Spawner
function spawnConfetti(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  for (let i = 0; i < 24; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = (rect.left + rect.width / 2) + 'px';
    c.style.top = rect.top + 'px';
    c.style.background = ['#f59e0b', '#00e5ff', '#10b981', '#8b5cf6'][i % 4];
    c.style.setProperty('--dx', (Math.random() - 0.5) * 440 + 'px');
    c.style.setProperty('--dy', (Math.random() - 0.85) * 320 + 'px');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1200);
  }
}

// Background Grid & Spark Particles
function initBackgroundFX() {
  const gridCanvas = $('bg-grid');
  const sparksCanvas = $('sparks-canvas');
  if (!gridCanvas || !sparksCanvas) return;
  const gctx = gridCanvas.getContext('2d');
  const sctx = sparksCanvas.getContext('2d');

  function resize() {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
    sparksCanvas.width = window.innerWidth;
    sparksCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const sparks = Array.from({ length: 45 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -Math.random() * 0.8 - 0.2,
    size: Math.random() * 2 + 0.8,
    alpha: Math.random() * 0.6 + 0.2
  }));

  function animate() {
    gctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    gctx.strokeStyle = 'rgba(38, 51, 68, 0.4)';
    gctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < gridCanvas.width; x += step) {
      gctx.beginPath();
      gctx.moveTo(x, 0); gctx.lineTo(x, gridCanvas.height);
      gctx.stroke();
    }
    for (let y = 0; y < gridCanvas.height; y += step) {
      gctx.beginPath();
      gctx.moveTo(0, y); gctx.lineTo(gridCanvas.width, y);
      gctx.stroke();
    }

    sctx.clearRect(0, 0, sparksCanvas.width, sparksCanvas.height);
    sparks.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.y < 0) {
        s.y = sparksCanvas.height;
        s.x = Math.random() * sparksCanvas.width;
      }
      sctx.fillStyle = `rgba(245, 158, 11, ${s.alpha})`;
      sctx.beginPath();
      sctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      sctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

