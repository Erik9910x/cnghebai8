/**
 * MODULE 2: DRAG & DROP "CHUYỂN PHÔI ĐÚNG TRẠM" (js/games/dnd.js)
 * Kéo thả hoặc bấm chọn thẻ nhiệm vụ về 5 trạm máy: Đúc, Hàn, Khoan, Tiện, Phay.
 * Hỗ trợ Dual Interaction: Drag & Drop và Click-to-Assign.
 */

let dndCompletedCount = 0;
let activeDragGhost = null;
let currentDraggedCard = null;
let currentSelectedCard = null; // for click-to-assign

function initDndModule() {
  renderDndCards();
  initBinClickListeners();
}

function renderDndCards() {
  const tray = $('ar-card-tray');
  if (!tray) return;
  tray.innerHTML = '';
  dndCompletedCount = 0;
  currentSelectedCard = null;

  DND_CARDS.forEach(cardData => {
    const card = document.createElement('div');
    card.className = 'dnd-card';
    card.textContent = cardData.text;
    card.dataset.id = cardData.id;
    card.dataset.type = cardData.type;
    card.dataset.exp = cardData.exp;
    card.title = "Kéo thả hoặc bấm chọn thẻ, sau đó bấm vào trạm máy";

    // Pointer events for desktop and mobile
    card.onpointerdown = e => handlePointerDown(e, card);

    // Click to select
    card.onclick = e => {
      e.stopPropagation();
      handleCardClick(card);
    };

    tray.appendChild(card);
  });

  // Reset bins counter
  document.querySelectorAll('#ar-bins-grid .dnd-bin').forEach(bin => {
    bin.dataset.count = '0';
    const cEl = bin.querySelector('.bin-count');
    if (cEl) cEl.textContent = '0 thẻ';
    bin.classList.remove('hover', 'correct-flash', 'wrong-flash');
  });

  updateDndHUD("Hãy kéo thẻ hoặc bấm chọn một thẻ bên trên, sau đó chọn trạm gia công phù hợp.");
}

function handleCardClick(card) {
  if (card.classList.contains('done')) return;
  playSound('click');

  if (currentSelectedCard === card) {
    // Deselect
    card.classList.remove('selected-card');
    currentSelectedCard = null;
    updateDndHUD("Đã bỏ chọn thẻ. Bấm chọn thẻ khác hoặc dùng chuột kéo thả.");
  } else {
    // Select new
    document.querySelectorAll('.dnd-card').forEach(c => c.classList.remove('selected-card'));
    card.classList.add('selected-card');
    currentSelectedCard = card;
    updateDndHUD(`Đang chọn: "${card.textContent}". Hãy bấm vào 1 trong 5 trạm gia công bên dưới!`);
  }
}

function initBinClickListeners() {
  document.querySelectorAll('#ar-bins-grid .dnd-bin').forEach(bin => {
    bin.onclick = () => {
      if (currentSelectedCard) {
        verifyCardToBin(currentSelectedCard, bin);
      }
    };
  });
}

function handlePointerDown(e, card) {
  if (card.classList.contains('done')) return;
  // If clicked directly without drag threshold, click handles selection
  let startX = e.clientX;
  let startY = e.clientY;
  let isDragging = false;

  const rect = card.getBoundingClientRect();

  function onPointerMove(ev) {
    const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
    if (!isDragging && dist > 6) {
      isDragging = true;
      currentDraggedCard = card;

      activeDragGhost = card.cloneNode(true);
      activeDragGhost.style.position = 'fixed';
      activeDragGhost.style.left = `${rect.left}px`;
      activeDragGhost.style.top = `${rect.top}px`;
      activeDragGhost.style.width = `${rect.width}px`;
      activeDragGhost.style.zIndex = '1000';
      activeDragGhost.style.pointerEvents = 'none';
      activeDragGhost.style.boxShadow = '0 16px 36px rgba(0,0,0,0.6)';
      activeDragGhost.style.borderColor = 'var(--cyan)';
      activeDragGhost.style.opacity = '0.9';
      activeDragGhost.classList.add('dragging-ghost');
      document.body.appendChild(activeDragGhost);

      card.classList.add('dragging');
    }

    if (isDragging && activeDragGhost) {
      activeDragGhost.style.left = `${ev.clientX - rect.width / 2}px`;
      activeDragGhost.style.top = `${ev.clientY - rect.height / 2}px`;

      // Highlight hovered bin
      const bins = document.querySelectorAll('#ar-bins-grid .dnd-bin');
      bins.forEach(bin => {
        const bRect = bin.getBoundingClientRect();
        const inX = ev.clientX >= bRect.left && ev.clientX <= bRect.right;
        const inY = ev.clientY >= bRect.top && ev.clientY <= bRect.bottom;
        bin.classList.toggle('hover', inX && inY);
      });
    }
  }

  function onPointerUp(ev) {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);

    if (isDragging) {
      if (activeDragGhost) {
        activeDragGhost.remove();
        activeDragGhost = null;
      }
      card.classList.remove('dragging');

      // Check drop target bin
      const bins = document.querySelectorAll('#ar-bins-grid .dnd-bin');
      let targetBin = null;
      bins.forEach(bin => {
        bin.classList.remove('hover');
        const bRect = bin.getBoundingClientRect();
        const inX = ev.clientX >= bRect.left && ev.clientX <= bRect.right;
        const inY = ev.clientY >= bRect.top && ev.clientY <= bRect.bottom;
        if (inX && inY) targetBin = bin;
      });

      if (targetBin) {
        verifyCardToBin(card, targetBin);
      }
      currentDraggedCard = null;
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}

function verifyCardToBin(card, bin) {
  const stationName = bin.querySelector('.bin-name')?.textContent.trim() || "";
  const cardType = card.dataset.type;
  const acceptType = bin.dataset.accept;

  if (cardType === acceptType) {
    // Correct Match
    playSound('correct');
    card.classList.remove('selected-card');
    card.classList.add('done');
    card.style.display = 'none';
    currentSelectedCard = null;

    const count = parseInt(bin.dataset.count || '0') + 1;
    bin.dataset.count = count;
    const cEl = bin.querySelector('.bin-count');
    if (cEl) cEl.textContent = `${count} thẻ ✓`;

    bin.classList.add('correct-flash');
    setTimeout(() => bin.classList.remove('correct-flash'), 600);

    spawnConfetti(bin);
    dndCompletedCount++;

    updateDndHUD(`<span style="color:var(--emerald); font-weight:700;">✓ CHÍNH XÁC:</span> Đã chuyển "${card.textContent}" vào trạm <b>${stationName}</b>! (${dndCompletedCount}/8)`);

    if (dndCompletedCount === DND_CARDS.length) {
      setTimeout(() => {
        playSound('fanfare');
        updateDndHUD(`<span style="color:var(--ac); font-weight:700;">🎉 XUẤT SẮC!</span> Bạn đã phân loại chính xác toàn bộ 8 chi tiết vào 5 trạm gia công cơ khí!`);
      }, 500);
    }
  } else {
    // Incorrect Match
    playSound('incorrect');
    card.classList.add('card-shake');
    setTimeout(() => card.classList.remove('card-shake'), 600);

    bin.classList.add('wrong-flash');
    setTimeout(() => bin.classList.remove('wrong-flash'), 600);

    updateDndHUD(`<span style="color:var(--coral); font-weight:700;">✗ CHƯA ĐÚNG:</span> "${card.textContent}" không thuộc trạm ${stationName}. Gợi ý: ${card.dataset.exp}`);
  }
}

function updateDndHUD(htmlMessage) {
  const hud = $('dnd-hud-msg') || $('ar-status-text');
  if (hud) {
    hud.innerHTML = htmlMessage;
  }
}

function resetDndGame() {
  playSound('click');
  renderDndCards();
}
