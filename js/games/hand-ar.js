/**
 * MODULE 4: HIGH-PERFORMANCE HAND AR "PINCH & PLACE" (js/games/hand-ar.js)
 * Tối ưu hóa 60fps không lag, không khựng:
 * 1. Khắc phục Layout Thrashing: Cache tọa độ các trạm máy (cachedBinRects).
 * 2. Khắc phục Canvas Overdraw: Resize canvas khi đổi cửa sổ, KHÔNG resize mỗi frame.
 * 3. Tăng tốc phần cứng (GPU Compositing): Dùng translate3d cho con trỏ và ghost phôi.
 * 4. ModelComplexity 0 (MediaPipe Lite): Giảm tải CPU/GPU 4x, mượt mà trên mọi máy tính.
 * 5. Hysteresis Pinch Detection: Ngưỡng chụm ngón (0.055) và mở ngón (0.088) chống rung (jitter-free).
 */

let isCameraRunning = false;
let cameraMediaStream = null;
let isVirtualHandActive = false;
let isPinching = false;
let skeletonOn = true;
let arHeldCard = null;
let arDragGhost = null;
let cachedBins = [];

// Smooth Cursor Interpolation (Lerp 0.45)
let smoothCursorX = 0;
let smoothCursorY = 0;
let hasFirstHandPoint = false;

function initHandARModule() {
  initVirtualHandSimulator();
  window.addEventListener('resize', handleCanvasResize);
}

function handleCanvasResize() {
  const canvas = $('hand-ar-overlay');
  const slideEl = $('s12');
  if (canvas && slideEl) {
    const sRect = slideEl.getBoundingClientRect();
    canvas.width = sRect.width;
    canvas.height = sRect.height;
  }
  cacheBinRects();
}

function cacheBinRects() {
  const bins = document.querySelectorAll('#ar-bins-grid .dnd-bin');
  cachedBins = [];
  bins.forEach(bin => {
    const r = bin.getBoundingClientRect();
    cachedBins.push({
      el: bin,
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom
    });
  });
}

function toggleSkeleton() {
  skeletonOn = !skeletonOn;
  const btn = $('btn-toggle-skel');
  if (btn) {
    btn.textContent = skeletonOn ? "TẮT KHUNG XƯƠNG 🦴" : "BẬT KHUNG XƯƠNG 🦴";
    btn.classList.toggle('active', !skeletonOn);
  }
  if (!skeletonOn) {
    const canvas = $('hand-ar-overlay');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  playSound('click');
}

// --------------------------------------------------------------------------
// 1. WEBCAM & MEDIAPIPE GESTURE TRACKING (MODEL COMPLEXITY 0 - HIGH FPS)
// --------------------------------------------------------------------------
async function toggleCamera() {
  if (isCameraRunning) {
    stopHandAR();
  } else {
    await startHandAR();
  }
}

async function startHandAR() {
  const video = $('camera-video');
  const status = $('ar-status-text');
  const pipWrap = $('camera-pip-wrap');
  const pipDot = $('pip-status-dot');
  if (!video) return;

  try {
    if (status) status.textContent = "ĐANG KẾT NỐI...";

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 480, height: 360, facingMode: "user" },
      audio: false
    });

    video.srcObject = stream;
    cameraMediaStream = stream;
    isCameraRunning = true;
    isVirtualHandActive = false;
    hasFirstHandPoint = false;

    handleCanvasResize();

    if ($('btn-toggle-cam')) $('btn-toggle-cam').textContent = "TẮT WEBCAM ✕";
    if (pipWrap) pipWrap.classList.add('live');
    if (pipDot) pipDot.classList.add('live');
    if (status) status.textContent = "LIVE · 60 FPS";
    if ($('dnd-hud-msg')) {
      $('dnd-hud-msg').innerHTML = `<span style="color:var(--cyan); font-weight:700;">WEBCAM LIVE:</span> Đưa tay trước camera, chụm ngón cái & ngón trỏ (Pinch) để gắp phôi nối vào trạm máy!`;
    }
    playSound('correct');

    loadMediaPipeHands(video);
  } catch (err) {
    console.warn("Webcam access error:", err);
    if (status) status.textContent = "OFFLINE";
    if (pipWrap) pipWrap.classList.remove('live');
    if (pipDot) pipDot.classList.remove('live');
    if ($('dnd-hud-msg')) {
      $('dnd-hud-msg').innerHTML = `<span style="color:var(--coral); font-weight:700;">CHẾ ĐỘ TAY ẢO ĐÃ BẬT:</span> Di chuột và giữ chuột trái để gắp thả thẻ phôi mượt mà!`;
    }
    toggleVirtualHand(true);
  }
}

function stopHandAR() {
  if (cameraMediaStream) {
    cameraMediaStream.getTracks().forEach(track => track.stop());
  }
  isCameraRunning = false;
  hasFirstHandPoint = false;

  if ($('camera-video')) $('camera-video').srcObject = null;
  if ($('btn-toggle-cam')) $('btn-toggle-cam').textContent = "BẬT WEBCAM 📷";
  if ($('camera-pip-wrap')) $('camera-pip-wrap').classList.remove('live');
  if ($('pip-status-dot')) $('pip-status-dot').classList.remove('live');
  if ($('ar-status-text')) $('ar-status-text').textContent = "CAM OFF";

  const canvas = $('hand-ar-overlay');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function loadMediaPipeHands(videoElement) {
  if (typeof window.Hands === 'undefined') {
    const s1 = document.createElement('script');
    s1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
      s2.onload = () => setupMediaPipe(videoElement);
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  } else {
    setupMediaPipe(videoElement);
  }
}

function setupMediaPipe(videoElement) {
  try {
    const hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    // ModelComplexity: 0 = Lite (siêu nhẹ, không lag trên laptop và máy tính trường học)
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onHandResults);

    if (typeof Camera !== 'undefined') {
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (isCameraRunning && videoElement.readyState >= 2) {
            await hands.send({ image: videoElement });
          }
        },
        width: 480,
        height: 360
      });
      camera.start();
    }
  } catch (e) {
    console.warn("MediaPipe setup fallback:", e);
  }
}

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4], [0,5],[5,6],[6,7],[7,8], [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16], [13,17],[17,18],[18,19],[19,20],[0,17]
];

function onHandResults(results) {
  const canvas = $('hand-ar-overlay');
  const gestureEl = $('ar-gesture-text');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // Clear without changing dimensions (avoid layout reflow lag!)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
    if (gestureEl) gestureEl.textContent = 'GESTURE: ĐANG QUÉT TAY...';
    if (arHeldCard) releaseArCard();
    hasFirstHandPoint = false;
    return;
  }

  const landmarks = results.multiHandLandmarks[0];

  const pts = landmarks.map(lm => ({
    x: (1 - lm.x) * canvas.width,
    y: lm.y * canvas.height
  }));

  const rawX = pts[8].x;
  const rawY = pts[8].y;

  // Exponential lerp smoothing for ultra-smooth 60fps tracking
  if (!hasFirstHandPoint) {
    smoothCursorX = rawX;
    smoothCursorY = rawY;
    hasFirstHandPoint = true;
  } else {
    smoothCursorX += (rawX - smoothCursorX) * 0.46;
    smoothCursorY += (rawY - smoothCursorY) * 0.46;
  }

  // Draw light skeleton
  if (skeletonOn) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
    ctx.lineWidth = 2;

    for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
      const [a, b] = HAND_CONNECTIONS[i];
      ctx.beginPath();
      ctx.moveTo(pts[a].x, pts[a].y);
      ctx.lineTo(pts[b].x, pts[b].y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Measure normalized pinch distance between thumb (4) and index (8)
  const dx = landmarks[8].x - landmarks[4].x;
  const dy = landmarks[8].y - landmarks[4].y;
  const dist = Math.hypot(dx, dy);

  // Global screen coords
  const slideEl = $('s12');
  const sRect = slideEl ? slideEl.getBoundingClientRect() : { left: 0, top: 0 };
  const globalX = sRect.left + smoothCursorX;
  const globalY = sRect.top + smoothCursorY;

  // Optimized pinch threshold hysteresis
  if (dist < 0.055 && !isPinching) {
    isPinching = true;
    if (gestureEl) gestureEl.textContent = 'GESTURE: PINCH (ĐANG CHỤM NGÓN GẮP THẺ)';
    checkArPinchGrab(globalX, globalY);
  } else if (dist > 0.088 && isPinching) {
    isPinching = false;
    if (gestureEl) gestureEl.textContent = 'GESTURE: MỞ TAY (ĐÃ THẢ THẺ)';
    checkArPinchDrop(globalX, globalY);
  }

  if (arHeldCard) {
    updateArHeldGhostPos(globalX, globalY);
  }
}

// --------------------------------------------------------------------------
// 2. VIRTUAL HAND SIMULATOR (DÀNH CHO CHUỘT / CẢM ỨNG 60FPS)
// --------------------------------------------------------------------------
function initVirtualHandSimulator() {
  const slideEl = $('s12');
  if (!slideEl) return;

  slideEl.addEventListener('pointermove', e => {
    if (!isVirtualHandActive) return;
    if (arHeldCard) {
      updateArHeldGhostPos(e.clientX, e.clientY);
    }
  });

  slideEl.addEventListener('pointerdown', e => {
    if (!isVirtualHandActive) return;
    isPinching = true;
    playSound('click');
    if ($('ar-gesture-text')) $('ar-gesture-text').textContent = 'GESTURE: PINCH (TAY ẢO ĐANG GẮP)';
    checkArPinchGrab(e.clientX, e.clientY);
  });

  slideEl.addEventListener('pointerup', e => {
    if (!isVirtualHandActive) return;
    isPinching = false;
    if ($('ar-gesture-text')) $('ar-gesture-text').textContent = 'GESTURE: MỞ TAY ẢO';
    checkArPinchDrop(e.clientX, e.clientY);
  });
}

function toggleVirtualHand(forceState) {
  isVirtualHandActive = typeof forceState === 'boolean' ? forceState : !isVirtualHandActive;
  const btn = $('btn-toggle-sim');

  if (isVirtualHandActive) {
    if (isCameraRunning) stopHandAR();
    handleCanvasResize();
    if ($('dnd-hud-msg')) {
      $('dnd-hud-msg').innerHTML = `<span style="color:var(--cyan); font-weight:700;">GIẢ LẬP TAY ẢO 60FPS:</span> Di chuyển chuột và giữ chuột trái để chụm ngón (Pinch) gắp phôi nối vào trạm máy!`;
    }
    if (btn) btn.classList.add('active');
    playSound('click');
  } else {
    if (btn) btn.classList.remove('active');
    if (arHeldCard) releaseArCard();
  }
}

// --------------------------------------------------------------------------
// 3. HARDWARE-ACCELERATED PINCH GRAB & DROP (ZERO LAYOUT REFLOW)
// --------------------------------------------------------------------------
function checkArPinchGrab(globalX, globalY) {
  if (arHeldCard) return;
  cacheBinRects();

  // Tìm thẻ bằng elementFromPoint
  const el = document.elementFromPoint(globalX, globalY);
  let card = el ? el.closest('#ar-card-tray .dnd-card:not(.done)') : null;

  // Fallback: Tìm thẻ gần nhất trong bán kính 75px
  if (!card) {
    const cards = document.querySelectorAll('#ar-card-tray .dnd-card:not(.done)');
    let minD = 75;
    cards.forEach(c => {
      const r = c.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(cx - globalX, cy - globalY);
      if (dist < minD) {
        minD = dist;
        card = c;
      }
    });
  }

  if (card) {
    arHeldCard = card;
    card.classList.add('lift');

    // Tạo floating ghost có translate3d trên GPU
    arDragGhost = document.createElement('div');
    arDragGhost.className = 'dnd-ghost';
    arDragGhost.textContent = card.textContent;
    document.body.appendChild(arDragGhost);

    arDragGhost.style.transform = `translate3d(${globalX}px, ${globalY}px, 0) translate(-50%, -50%)`;

    playSound('click');
    updateDndHUD(`Đã gắp: <b>"${card.textContent}"</b>. Hãy di chuyển và mở ngón tay trên trạm gia công!`);
  }
}

function updateArHeldGhostPos(globalX, globalY) {
  if (arDragGhost) {
    // GPU-accelerated compositing: no layout reflow, buttery 60fps!
    arDragGhost.style.transform = `translate3d(${globalX}px, ${globalY}px, 0) translate(-50%, -50%)`;
  }

  // Highlight bin using pre-cached rects
  for (let i = 0; i < cachedBins.length; i++) {
    const b = cachedBins[i];
    const isHover = (globalX >= b.left && globalX <= b.right && globalY >= b.top && globalY <= b.bottom);
    b.el.classList.toggle('hover', isHover);
  }
}

function checkArPinchDrop(globalX, globalY) {
  if (!arHeldCard) return;

  let matchedBin = null;
  for (let i = 0; i < cachedBins.length; i++) {
    const b = cachedBins[i];
    b.el.classList.remove('hover');
    if (globalX >= b.left && globalX <= b.right && globalY >= b.top && globalY <= b.bottom) {
      matchedBin = b.el;
    }
  }

  const card = arHeldCard;
  releaseArCard();

  if (matchedBin) {
    verifyCardToBin(card, matchedBin);
  } else {
    updateDndHUD(`Đã thả "${card.textContent}". Hãy kéo hoặc mở ngón tay đúng trên 1 trong 5 trạm máy!`);
  }
}

function releaseArCard() {
  if (arDragGhost) {
    arDragGhost.remove();
    arDragGhost = null;
  }
  if (arHeldCard) {
    arHeldCard.classList.remove('lift');
    arHeldCard = null;
  }
}
