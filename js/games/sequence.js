/**
 * MODULE 3: SEQUENCE BUILDER "XẾP QUY TRÌNH ĐÚC" (js/games/sequence.js)
 * Sắp xếp các bước chuẩn bị song song và quy trình đúc kim loại chuẩn SGK trang 40.
 */

let currentSequence = [];

function initSequenceModule() {
  shuffleSequence();
}

function shuffleSequence() {
  currentSequence = [...SEQUENCE_STEPS].sort(() => Math.random() - 0.5);
  renderSequence();
  clearSeqFeedback();
}

function renderSequence(validatedResults = null) {
  const container = $('seq-list-container');
  if (!container) return;
  container.innerHTML = '';

  currentSequence.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'seq-item';

    let statusChip = '';
    if (validatedResults) {
      const isOk = validatedResults[idx];
      row.classList.toggle('seq-correct', isOk);
      row.classList.toggle('seq-wrong', !isOk);
      statusChip = isOk
        ? `<span class="chip" style="color:var(--emerald); border-color:var(--emerald); font-size:11px; margin-right:8px;">✓ Đúng</span>`
        : `<span class="chip" style="color:var(--coral); border-color:var(--coral); font-size:11px; margin-right:8px;">✗ Cần đổi</span>`;
    }

    row.innerHTML = `
      <div style="display:flex; align-items:center; flex:1;">
        <span class="seq-index">0${idx + 1}</span>
        <span class="seq-text">${item.text}</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        ${statusChip}
        <div class="seq-btns">
          <button class="seq-btn" onclick="moveSeq(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} title="Chuyển lên">▲</button>
          <button class="seq-btn" onclick="moveSeq(${idx}, 1)" ${idx === currentSequence.length - 1 ? 'disabled' : ''} title="Chuyển xuống">▼</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });
}

function moveSeq(index, direction) {
  playSound('click');
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= currentSequence.length) return;

  const temp = currentSequence[index];
  currentSequence[index] = currentSequence[targetIndex];
  currentSequence[targetIndex] = temp;
  renderSequence();
  clearSeqFeedback();
}

function checkSequenceSolution() {
  // Correct logic (SGK Trang 40):
  // First two items MUST be branches 1 and 2 (Làm khuôn and Nấu chảy kim loại) in any order!
  // Followed by Step 3 (Rót), Step 4 (Nguội), Step 5 (Phá khuôn), Step 6 (Làm sạch).
  const isBranch1and2 = (
    (currentSequence[0].id === 'A' && currentSequence[1].id === 'B') ||
    (currentSequence[0].id === 'B' && currentSequence[1].id === 'A')
  );
  const isPouring = currentSequence[2].id === 'C';
  const isCooling = currentSequence[3].id === 'D';
  const isUnmold = currentSequence[4].id === 'E';
  const isClean = currentSequence[5].id === 'F';

  const results = [
    currentSequence[0].id === 'A' || currentSequence[0].id === 'B',
    currentSequence[1].id === 'A' || currentSequence[1].id === 'B',
    isPouring,
    isCooling,
    isUnmold,
    isClean
  ];

  renderSequence(results);

  const fbEl = $('seq-feedback-msg');
  if (isBranch1and2 && isPouring && isCooling && isUnmold && isClean) {
    playSound('fanfare');
    spawnConfetti($('seq-list-container'));
    if (fbEl) {
      fbEl.className = 'seq-alert success';
      fbEl.innerHTML = `
        <b>🎉 CHÍNH XÁC 100%! BẠN ĐÃ THUỘC LÒNG SƠ ĐỒ ĐÚC:</b><br>
        Hai nhánh chuẩn bị song song (Làm khuôn & Nấu chảy kim loại) hoàn thành đồng thời ➔ Rót vào lòng khuôn ➔ Làm nguội & kết tinh ➔ Phá khuôn ➔ Làm sạch bavia và kiểm tra.
      `;
    }
  } else {
    playSound('incorrect');
    let hint = "Hai bước đầu tiên phải là 2 nhánh chuẩn bị song song (Làm khuôn & Nấu kim loại) trước khi rót vào lòng khuôn!";
    if (isBranch1and2 && !isPouring) {
      hint = "Sau khi có khuôn và kim loại nóng chảy, bước tiếp theo phải là 'Rót kim loại lỏng vào lòng khuôn'!";
    } else if (isBranch1and2 && isPouring && !isCooling) {
      hint = "Sau khi rót vào khuôn, cần thời gian để kim loại 'Làm nguội và kết tinh đông đặc'!";
    } else if (isBranch1and2 && isPouring && isCooling && !isUnmold) {
      hint = "Sau khi nguội, tiến hành 'Phá khuôn, lấy vật đúc ra ngoài' trước khi làm sạch!";
    }

    if (fbEl) {
      fbEl.className = 'seq-alert warning';
      fbEl.innerHTML = `<b>✗ CHƯA CHÍNH XÁC:</b> ${hint}`;
    }
  }
}

function showSequenceCorrect() {
  playSound('click');
  currentSequence = [...SEQUENCE_STEPS];
  renderSequence([true, true, true, true, true, true]);
  const fbEl = $('seq-feedback-msg');
  if (fbEl) {
    fbEl.className = 'seq-alert info';
    fbEl.innerHTML = `<b>SƠ ĐỒ CHUẨN SGK TRANG 40:</b> 2 nhánh song song chuẩn bị khuôn & kim loại lỏng ➔ Rót ➔ Nguội ➔ Phá khuôn ➔ Làm sạch.`;
  }
}

function clearSeqFeedback() {
  const fbEl = $('seq-feedback-msg');
  if (fbEl) {
    fbEl.className = 'seq-alert';
    fbEl.innerHTML = '';
  }
}
