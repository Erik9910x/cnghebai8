/**
 * MODULE 1: ĐẤU TRƯỜNG "RINH ĐIỂM LIỀN TAY" & FLAT DICE RANDOM PICKER 🎲 (js/games/quiz.js)
 * - 25 câu hỏi phân bậc (20 SGK nền tảng + 5 Chuyên gia / Tư duy cao đánh dấu đỏ).
 * - Điều hướng câu hỏi tự do: Nút ‹ / › hoặc nhập trực tiếp số câu (1 - 25).
 * - Flat Digital Dice Random Picker: Giao diện phẳng hiện đại, tinh gọn, mượt mà (không 3D nặng).
 * - Hiển thị song song SỐ THỨ TỰ & HỌ TÊN HỌC SINH (43 học sinh chính thức từ CLASS_ROSTER).
 * - 6 Chế độ mini-game tương tác lớp học:
 *   1. Random Student: Quay ngẫu nhiên 1 học sinh (STT + Tên), không chọn trùng.
 *   2. F1 Reaction Challenge: Dàn 5 đèn đỏ tắt chuyển xanh, bấm phản xạ nhanh.
 *   3. Dual Duel: Đối đầu 1 vs 1 giữa 2 học sinh trả lời nhanh trong 15s.
 *   4. Lucky Escape: Quyền tự trả lời nhận x2 điểm hoặc chuyển quyền cho bạn.
 *   5. Class Rush: Thử thách toàn lớp trong 20s khẩn trương.
 *   6. Chaos Mode: Mini-game bất ngờ (5s chớp nhoáng, trợ giúp đồng đội, x2 điểm).
 */

let qzIndex = 0;
let qzScore = 0;
let qzStreak = 0;
let qzLocked = false;
let userAnswers = {}; // Lưu trạng thái trả lời của từng câu

// Tracking học sinh đã được gọi (lưu theo student id)
let pickedStudentIds = new Set();

// Trạng thái Dice & Mini-game
let isRollingDice = false;
let currentDiceCode = 1;
let diceShuffleTimer = null;
let f1SequenceTimers = [];
let f1StopwatchInterval = null;
let f1StartTime = 0;
let f1IsGreen = false;
let duelTimer = null;
let rushTimer = null;

const DICE_MODES = [
  { code: 1, name: "RANDOM HỌC SINH", icon: "🎓", title: "Mặt 1 — <em>Random Học Sinh (STT & Tên)</em>", desc: "Quay số ngẫu nhiên chọn 1 học sinh theo STT và Họ Tên, không lặp lại người đã chọn." },
  { code: 2, name: "F1 REACTION", icon: "🏎️", title: "Mặt 2 — <em>F1 Reaction Challenge</em>", desc: "Dàn 5 đèn đỏ xuất phát F1 bật tuần tự rồi chuyển xanh bất ngờ. Ai bấm / giơ tay nhanh nhất giành quyền trả lời!" },
  { code: 3, name: "DUAL DUEL", icon: "⚔️", title: "Mặt 3 — <em>DUAL DUEL (Đối Đầu 1 vs 1)</em>", desc: "Random 2 học sinh khác nhau thi đấu trả lời nhanh câu hỏi trong vòng 15 giây." },
  { code: 4, name: "LUCKY ESCAPE", icon: "🍀", title: "Mặt 4 — <em>LUCKY ESCAPE (Thoát Hiểm)</em>", desc: "Học sinh được chọn có quyền tự trả lời nhận x2 điểm hoặc chuyển câu hỏi cho bạn khác!" },
  { code: 5, name: "CLASS RUSH", icon: "🔥", title: "Mặt 5 — <em>CLASS RUSH (Cả Lớp Chạy Đua)</em>", desc: "Cả lớp cùng tham gia thử thách trả lời trong 20 giây khẩn trương, giơ tay đầu tiên ghi điểm cho tổ." },
  { code: 6, name: "CHAOS MODE", icon: "⚡", title: "Mặt 6 — <em>CHAOS MODE (Thử Thách Bất Ngờ)</em>", desc: "Vòng quay hỗn loạn chọn ngẫu nhiên một thử thách mini-game bất ngờ cho câu hỏi hiện tại!" }
];

const CHAOS_RULES = [
  { title: "⚡ PHẢN XẠ 5 GIÂY", desc: "Học sinh được chỉ định có đúng 5 giây để đưa ra đáp án cuối cùng!" },
  { title: "💎 X2 ĐIỂM SỐ BẢN LĨNH", desc: "Nêu trực tiếp đáp án chính xác mà không cần nhìn 4 phương án gợi ý A, B, C, D để nhận gấp đôi điểm!" },
  { title: "🤝 TRỢ GIÚP ĐỒNG ĐỘI", desc: "Được quyền chọn 1 bạn cùng bàn thảo luận trong 10 giây trước khi chốt đáp án!" },
  { title: "🎁 BẢO TOÀN STREAK", desc: "Nếu trả lời sai vẫn giữ nguyên chuỗi streak đúng hiện tại của lớp!" },
  { title: "🎯 ĐỔI SANG CÂU HỎI KHÁC", desc: "Được quyền bỏ qua câu hỏi hiện tại và chuyển sang câu hỏi kế tiếp!" }
];

function initQuizModule() {
  qzIndex = 0;
  qzScore = 0;
  qzStreak = 0;
  userAnswers = {};
  renderQuestion();
  updatePoolCounterUI();
}

function onQuizSlideEnter() {
  renderQuestion();
}

// --------------------------------------------------------------------------
// 1. ĐIỀU HƯỚNG CÂU HỎI (PREV / NEXT / DIRECT JUMP)
// --------------------------------------------------------------------------
function prevQuestion() {
  if (qzIndex > 0) {
    playSound('click');
    goToQuestion(qzIndex - 1);
  }
}

function nextQuestion() {
  if (qzIndex < QUIZ_QUESTIONS.length - 1) {
    playSound('click');
    goToQuestion(qzIndex + 1);
  }
}

function jumpToQuestion(val) {
  const num = parseInt(val, 10);
  if (!isNaN(num) && num >= 1 && num <= QUIZ_QUESTIONS.length) {
    playSound('click');
    goToQuestion(num - 1);
  } else {
    // Reset to current
    const input = $('qz-jump-input');
    if (input) input.value = qzIndex + 1;
  }
}

function goToQuestion(newIndex) {
  qzIndex = Math.max(0, Math.min(QUIZ_QUESTIONS.length - 1, newIndex));
  renderQuestion();
}

function renderQuestion() {
  qzLocked = false;
  const qData = QUIZ_QUESTIONS[qzIndex];
  if (!qData) return;

  // Update question jump controls
  const input = $('qz-jump-input');
  if (input) input.value = qzIndex + 1;

  const prevBtn = $('qz-btn-prev');
  if (prevBtn) prevBtn.disabled = (qzIndex === 0);

  const nextBtn = $('qz-btn-next');
  if (nextBtn) nextBtn.disabled = (qzIndex === QUIZ_QUESTIONS.length - 1);

  // Level badge styling
  let levelBadge = `<span class="chip" style="color:var(--emerald); border-color:var(--emerald); font-size:11px; margin-left:6px; padding:2px 8px;">CƠ BẢN</span>`;
  if (qData.level === 'TRUNG BÌNH') {
    levelBadge = `<span class="chip" style="color:var(--cyan); border-color:var(--cyan); font-size:11px; margin-left:6px; padding:2px 8px;">TRUNG BÌNH</span>`;
  } else if (qData.level === 'KHÁ') {
    levelBadge = `<span class="chip" style="color:var(--ac); border-color:var(--ac); font-size:11px; margin-left:6px; padding:2px 8px;">KHÁ</span>`;
  } else if (qData.isExpert || qData.level === 'CHUYÊN GIA') {
    levelBadge = `<span class="chip" style="color:#ef4444; border-color:#ef4444; background:rgba(239,68,68,0.18); font-size:11px; margin-left:6px; padding:3px 10px; font-weight:700; box-shadow:0 0 12px rgba(239,68,68,0.4);">🔥 CHUYÊN GIA / TƯ DUY CAO</span>`;
  }

  if ($('qz-current-badge')) {
    $('qz-current-badge').innerHTML = levelBadge;
  }
  
  if ($('qz-question')) {
    if (qData.isExpert) {
      $('qz-question').innerHTML = `<span style="color:#ef4444; font-weight:700;">[CÂU HỎI CHUYÊN GIA] </span>${qData.q.replace('[CHUYÊN GIA] ', '')}`;
    } else {
      $('qz-question').textContent = qData.q;
    }
  }

  const optsContainer = $('qz-options');
  if (!optsContainer) return;
  optsContainer.innerHTML = '';

  const answeredState = userAnswers[qzIndex];

  qData.opts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerHTML = `<span class="opt-key">${idx + 1}</span><span>${opt}</span>`;
    
    // Nếu đã trả lời câu này trước đó, hiển thị trạng thái cũ
    if (answeredState !== undefined) {
      if (idx === qData.correct) {
        btn.classList.add('correct');
      } else if (idx === answeredState) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    } else {
      btn.onclick = () => handleQuizSelect(idx);
    }

    optsContainer.appendChild(btn);
  });

  if ($('qz-fb-text')) {
    if (answeredState !== undefined) {
      const isCorrect = (answeredState === qData.correct);
      $('qz-fb-text').innerHTML = isCorrect
        ? `<span style="color:var(--emerald); font-weight:700;">✓ ĐÃ TRẢ LỜI ĐÚNG:</span> ${qData.exp}`
        : `<span style="color:var(--coral); font-weight:700;">✗ ĐÃ TRẢ LỜI SAI:</span> ${qData.exp}`;
    } else {
      $('qz-fb-text').textContent = "Chọn đáp án bằng chuột hoặc bấm phím số 1, 2, 3, 4 trên bàn phím. Bấm 🎲 để gọi học sinh.";
    }
  }

  if ($('qz-next-btn')) {
    $('qz-next-btn').style.display = (answeredState !== undefined && qzIndex < QUIZ_QUESTIONS.length - 1) ? 'inline-block' : 'none';
  }
}

function handleQuizSelect(chosenIdx) {
  if (qzLocked) return;
  qzLocked = true;

  const qData = QUIZ_QUESTIONS[qzIndex];
  userAnswers[qzIndex] = chosenIdx;

  const buttons = document.querySelectorAll('#qz-options .opt-btn');
  buttons.forEach(b => b.disabled = true);

  if (chosenIdx === qData.correct) {
    playSound('correct');
    if (buttons[chosenIdx]) buttons[chosenIdx].classList.add('correct');
    qzStreak++;
    const streakBonus = qzStreak > 1 ? (qzStreak - 1) * 25 : 0;
    
    let basePts = 100;
    if (qData.level === 'TRUNG BÌNH') basePts = 120;
    else if (qData.level === 'KHÁ') basePts = 150;
    else if (qData.isExpert || qData.level === 'CHUYÊN GIA') basePts = 250;

    const totalPts = basePts + streakBonus;
    qzScore += totalPts;

    if ($('qz-score')) $('qz-score').textContent = qzScore;
    if ($('qz-streak')) $('qz-streak').textContent = `${qzStreak} 🔥`;
    if ($('qz-fb-text')) {
      $('qz-fb-text').innerHTML = `<span style="color:var(--emerald); font-weight:700;">✓ CHÍNH XÁC (+${totalPts}đ):</span> ${qData.exp}`;
    }
    triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.65);
  } else {
    playSound('wrong');
    if (buttons[chosenIdx]) buttons[chosenIdx].classList.add('incorrect');
    if (buttons[qData.correct]) buttons[qData.correct].classList.add('correct');
    qzStreak = 0;
    if ($('qz-streak')) $('qz-streak').textContent = '0';
    if ($('qz-fb-text')) {
      $('qz-fb-text').innerHTML = `<span style="color:var(--coral); font-weight:700;">✗ CHƯA CHÍNH XÁC:</span> ${qData.exp}`;
    }
  }

  if ($('qz-next-btn')) {
    if (qzIndex < QUIZ_QUESTIONS.length - 1) {
      $('qz-next-btn').style.display = 'inline-block';
      $('qz-next-btn').textContent = "CÂU TIẾP THEO ➔";
    } else {
      $('qz-next-btn').style.display = 'inline-block';
      $('qz-next-btn').textContent = "HOÀN THÀNH 🏆";
      $('qz-next-btn').onclick = () => showQuizSummary();
    }
  }
}

function showQuizSummary() {
  playSound('finish');
  triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.5);

  const container = $('qz-options');
  if (!container) return;

  const totalAnswered = Object.keys(userAnswers).length;
  let correctCount = 0;
  Object.keys(userAnswers).forEach(idx => {
    if (userAnswers[idx] === QUIZ_QUESTIONS[idx].correct) correctCount++;
  });

  if ($('qz-question')) {
    $('qz-question').innerHTML = `
      <div style="text-align:center;">
        <span style="color:var(--ac); font-size:36px;">🏆 TỔNG KẾT ĐẤU TRƯỜNG</span><br>
        <span style="font-size:20px; color:var(--ink-dim); font-family:var(--sans);">
          Bạn đã đạt <b style="color:var(--ac);">${qzScore} ĐIỂM</b> · Đúng <b>${correctCount}/${totalAnswered}</b> câu hỏi!
        </span>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="grid-column: span 2; text-align: center; padding: 20px;">
      <button class="btn-tech" style="padding: 12px 28px; font-size: 15px; margin-right: 12px;" onclick="restartQuiz()">
        LÀM LẠI ĐẤU TRƯỜNG ↺
      </button>
      <button class="btn-tech outline" style="padding: 12px 28px; font-size: 15px;" onclick="goToQuestion(0)">
        XEM LẠI CÁC CÂU HỎI 📖
      </button>
    </div>
  `;
}

function restartQuiz() {
  playSound('click');
  userAnswers = {};
  qzScore = 0;
  qzStreak = 0;
  if ($('qz-score')) $('qz-score').textContent = '0';
  if ($('qz-streak')) $('qz-streak').textContent = '0 🔥';
  goToQuestion(0);
}

// --------------------------------------------------------------------------
// 2. FLAT DIGITAL DICE RANDOM PICKER ENGINE (DICE CODES 1 - 6)
// --------------------------------------------------------------------------
function triggerDiceRoll(forcedCode) {
  if (isRollingDice) return;
  playSound('click');

  const modal = $('dice-engine-modal');
  if (!modal) return;
  modal.classList.add('active');

  cleanupDiceTimers();

  // Reset UI elements
  const stageWrap = $('dice-flat-stage');
  const display = $('dice-flat-display');
  const label = $('dice-rolling-label');
  const banner = $('dice-result-badge');
  const modeContainer = $('dice-mode-container');

  if (stageWrap) stageWrap.style.display = 'flex';
  if (label) label.textContent = "ĐANG TUNG XÚC XẮC DIGITAL...";
  if (banner) banner.style.display = 'none';
  if (modeContainer) modeContainer.style.display = 'none';

  // Ẩn tất cả mode view
  for (let i = 1; i <= 6; i++) {
    const v = $(`dice-view-${i}`);
    if (v) v.style.display = 'none';
  }

  isRollingDice = true;
  if (display) display.classList.add('rolling');

  // Random number cycling for 1 second
  let rollCount = 0;
  const cycleInterval = setInterval(() => {
    rollCount++;
    const tempN = (rollCount % 6) + 1;
    if (display) display.textContent = tempN;
    playSound('tick');
  }, 75);

  setTimeout(() => {
    clearInterval(cycleInterval);
    isRollingDice = false;

    // Pick final dice code (1 to 6) or use forcedCode
    const finalCode = (typeof forcedCode === 'number' && forcedCode >= 1 && forcedCode <= 6)
      ? forcedCode
      : Math.floor(Math.random() * 6) + 1;

    currentDiceCode = finalCode;

    if (display) {
      display.classList.remove('rolling');
      display.textContent = finalCode;
    }
    playSound('correct');

    const modeInfo = DICE_MODES[finalCode - 1];

    if (label) {
      label.textContent = `XÚC XẮC ĐỔ RA MẶT ${finalCode}!`;
    }

    if (banner) {
      banner.style.display = 'block';
      banner.innerHTML = `<span>${modeInfo.icon}</span> <span>${modeInfo.title}</span>`;
    }

    if (modeContainer) modeContainer.style.display = 'block';

    const targetView = $(`dice-view-${finalCode}`);
    if (targetView) targetView.style.display = 'block';

    // Kích hoạt logic tương ứng với Dice Code
    switch (finalCode) {
      case 1: startMode1RandomStudent(); break;
      case 2: startMode2F1Reaction(); break;
      case 3: startMode3DualDuel(); break;
      case 4: startMode4LuckyEscape(); break;
      case 5: startMode5ClassRush(); break;
      case 6: startMode6ChaosMode(); break;
    }
  }, 1000);
}

function closeDiceModal() {
  playSound('click');
  const modal = $('dice-engine-modal');
  if (modal) modal.classList.remove('active');
  cleanupDiceTimers();
}

function cleanupDiceTimers() {
  if (diceShuffleTimer) clearInterval(diceShuffleTimer);
  f1SequenceTimers.forEach(t => clearTimeout(t));
  f1SequenceTimers = [];
  if (f1StopwatchInterval) clearInterval(f1StopwatchInterval);
  if (duelTimer) clearInterval(duelTimer);
  if (rushTimer) clearInterval(rushTimer);
}

// --------------------------------------------------------------------------
// DICE 1: RANDOM STUDENT (STT & TÊN TỪ CLASS_ROSTER)
// --------------------------------------------------------------------------
function startMode1RandomStudent() {
  const sttEl = $('slot-student-stt');
  const nameEl = $('slot-student-name');
  const subEl = $('slot-student-sub');
  const box = $('slot-student-box');

  if (box) box.classList.remove('locked');

  // Lấy danh sách học sinh chưa được pick
  let available = CLASS_ROSTER.filter(st => !pickedStudentIds.has(st.id));

  // Nếu tất cả đã được gọi, tự động reset để bắt đầu vòng mới
  if (available.length === 0) {
    pickedStudentIds.clear();
    available = [...CLASS_ROSTER];
    if (subEl) subEl.textContent = "Đã gọi hết 43 học sinh! Tự động làm mới danh sách vòng 2.";
  }

  const chosenStudent = available[Math.floor(Math.random() * available.length)];
  const duration = 1800; // Shuffle nhanh, mượt 1.8s
  const startTime = Date.now();

  diceShuffleTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed < duration) {
      const randIdx = Math.floor(Math.random() * CLASS_ROSTER.length);
      const randSt = CLASS_ROSTER[randIdx];
      if (sttEl) sttEl.textContent = `STT #${String(randSt.id).padStart(2, '0')}`;
      if (nameEl) nameEl.textContent = randSt.name;
      playSound('tick');
    } else {
      clearInterval(diceShuffleTimer);
      // Khóa kết quả chính xác
      if (sttEl) sttEl.textContent = `STT #${String(chosenStudent.id).padStart(2, '0')}`;
      if (nameEl) nameEl.textContent = chosenStudent.name;
      if (subEl) subEl.textContent = `✓ Đã chọn học sinh trả lời câu hỏi #${qzIndex + 1}`;
      if (box) box.classList.add('locked');

      pickedStudentIds.add(chosenStudent.id);
      updatePoolCounterUI();
      playSound('correct');
      triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.5);
    }
  }, 70);
}

// --------------------------------------------------------------------------
// DICE 2: F1 REACTION CHALLENGE
// --------------------------------------------------------------------------
function startMode2F1Reaction() {
  f1IsGreen = false;
  f1SequenceTimers.forEach(t => clearTimeout(t));
  f1SequenceTimers = [];
  if (f1StopwatchInterval) clearInterval(f1StopwatchInterval);

  const msg = $('f1-hud-msg');
  const resultBox = $('f1-result-box');
  const tapZone = $('f1-tap-zone');

  if (msg) msg.textContent = "CHUẨN BỊ... THEO DÕI 5 ĐÈN ĐỎ XUẤT PHÁT!";
  if (resultBox) resultBox.textContent = "";
  if (tapZone) {
    tapZone.style.background = "var(--bg2)";
    tapZone.textContent = "⚡ BẤM HOẶC CHẠM VÀO ĐÂY KHI ĐÈN TẮT / CHUYỂN XANH!";
  }

  // Tắt tất cả đèn
  for (let i = 1; i <= 5; i++) {
    const bulb = $(`f1-bulb-${i}`);
    if (bulb) bulb.className = 'f1-bulb';
  }

  // Bật lần lượt 5 đèn đỏ (mỗi đèn cách nhau 0.5s)
  for (let i = 1; i <= 5; i++) {
    const timer = setTimeout(() => {
      const bulb = $(`f1-bulb-${i}`);
      if (bulb) bulb.className = 'f1-bulb red-on';
      playSound('tick');
      if (msg) msg.textContent = `ĐÈN ĐỎ ${i}/5 ĐÃ BẬT...`;
    }, i * 500);
    f1SequenceTimers.push(timer);
  }

  // Sau khi 5 đèn đỏ bật, chờ ngẫu nhiên 1 - 2.5 giây rồi chuyển XANH đồng loạt
  const randomDelay = 2500 + Math.random() * 1500;
  const greenTimer = setTimeout(() => {
    f1IsGreen = true;
    f1StartTime = Date.now();

    for (let i = 1; i <= 5; i++) {
      const bulb = $(`f1-bulb-${i}`);
      if (bulb) bulb.className = 'f1-bulb green-on';
    }

    playSound('bell');
    if (msg) msg.innerHTML = `<span style="color:var(--emerald); font-weight:700;">🟢 XANH RỒI! GIƠ TAY / BẤM NGAY!</span>`;
    if (tapZone) tapZone.style.background = "rgba(16, 185, 129, 0.25)";

    // Chạy đồng hồ bấm giờ mili-giây
    f1StopwatchInterval = setInterval(() => {
      const ms = Date.now() - f1StartTime;
      if (resultBox) resultBox.textContent = `THỜI GIAN: ${ms} ms`;
    }, 20);
  }, randomDelay);

  f1SequenceTimers.push(greenTimer);
}

function handleF1ReactionTap() {
  const resultBox = $('f1-result-box');
  const msg = $('f1-hud-msg');

  if (!f1IsGreen) {
    // Jump Start (xuất phát sớm)
    f1SequenceTimers.forEach(t => clearTimeout(t));
    f1SequenceTimers = [];
    playSound('wrong');
    if (msg) msg.innerHTML = `<span style="color:var(--coral); font-weight:700;">⚠️ PHẠM QUY (JUMP START)!</span> Bấm trước khi đèn xanh!`;
    if (resultBox) resultBox.innerHTML = `<span style="color:var(--coral);">Xuất phát sớm! Mất lượt phản xạ câu này.</span>`;
  } else {
    // Phản xạ thành công
    if (f1StopwatchInterval) clearInterval(f1StopwatchInterval);
    const reactionTime = Date.now() - f1StartTime;
    playSound('correct');

    let evalText = "⚡ Phản xạ siêu đẳng như tay đua F1!";
    if (reactionTime > 400) evalText = "Tốt! Bạn đã giành quyền trả lời câu hỏi!";
    else if (reactionTime > 700) evalText = "Hơi chậm một chút nhưng đã hoàn thành!";

    if (msg) msg.innerHTML = `<span style="color:var(--emerald); font-weight:700;">🏆 XUẤT SẮC! ${reactionTime} ms</span>`;
    if (resultBox) resultBox.innerHTML = `Thời gian phản xạ: <b>${reactionTime} ms</b> — ${evalText}`;
    triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.5);
  }
}

// --------------------------------------------------------------------------
// DICE 3: DUAL DUEL (1 VS 1 ĐỐI ĐẦU)
// --------------------------------------------------------------------------
function startMode3DualDuel() {
  if (duelTimer) clearInterval(duelTimer);

  // Chọn 2 học sinh khác nhau ngẫu nhiên từ CLASS_ROSTER
  const shuffled = [...CLASS_ROSTER].sort(() => Math.random() - 0.5);
  const studentA = shuffled[0];
  const studentB = shuffled[1];

  if ($('duel-stt-a')) $('duel-stt-a').textContent = `STT #${String(studentA.id).padStart(2, '0')}`;
  if ($('duel-name-a')) $('duel-name-a').textContent = studentA.name;

  if ($('duel-stt-b')) $('duel-stt-b').textContent = `STT #${String(studentB.id).padStart(2, '0')}`;
  if ($('duel-name-b')) $('duel-name-b').textContent = studentB.name;

  // Đếm ngược 15 giây
  let timeLeft = 15;
  const timerText = $('duel-timer-text');
  const timerFill = $('duel-timer-fill');

  if (timerText) timerText.textContent = `THỜI GIAN ĐỐI ĐẦU: 15s`;
  if (timerFill) timerFill.style.width = '100%';

  duelTimer = setInterval(() => {
    timeLeft--;
    const pct = Math.max(0, (timeLeft / 15) * 100);
    if (timerFill) timerFill.style.width = `${pct}%`;
    if (timerText) timerText.textContent = `THỜI GIAN ĐỐI ĐẦU: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(duelTimer);
      if (timerText) timerText.innerHTML = `<span style="color:var(--coral); font-weight:700;">HẾT GIỜ ĐỐI ĐẦU! Ai giơ tay trước trả lời!</span>`;
      playSound('wrong');
    }
  }, 1000);
}

// --------------------------------------------------------------------------
// DICE 4: LUCKY ESCAPE
// --------------------------------------------------------------------------
function startMode4LuckyEscape() {
  const randSt = CLASS_ROSTER[Math.floor(Math.random() * CLASS_ROSTER.length)];

  if ($('escape-student-stt')) $('escape-student-stt').textContent = `STT #${String(randSt.id).padStart(2, '0')}`;
  if ($('escape-student-name')) $('escape-student-name').textContent = randSt.name;
  if ($('escape-decision-msg')) $('escape-decision-msg').textContent = "";
}

function executeLuckyChoice(choice) {
  const msg = $('escape-decision-msg');
  playSound('click');

  if (choice === 'self') {
    if (msg) msg.innerHTML = `🎯 Bạn chọn <b>TỰ TRẢ LỜI</b>. Trả lời đúng câu này sẽ nhận trọn <b>X2 ĐIỂM SỐ</b>!`;
    setTimeout(() => closeDiceModal(), 1200);
  } else {
    // Random chọn bạn khác để chuyển quyền
    const otherStudents = CLASS_ROSTER.filter(st => !pickedStudentIds.has(st.id));
    const passTarget = otherStudents[Math.floor(Math.random() * otherStudents.length)] || CLASS_ROSTER[0];
    if (msg) msg.innerHTML = `🤝 Bạn đã <b>CHUYỂN QUYỀN</b> cho: <b>STT #${String(passTarget.id).padStart(2, '0')} — ${passTarget.name}</b>!`;
    pickedStudentIds.add(passTarget.id);
    updatePoolCounterUI();
    setTimeout(() => closeDiceModal(), 1800);
  }
}

// --------------------------------------------------------------------------
// DICE 5: CLASS RUSH (CẢ LỚP)
// --------------------------------------------------------------------------
function startMode5ClassRush() {
  if (rushTimer) clearInterval(rushTimer);

  let timeLeft = 20;
  const counter = $('rush-counter');
  if (counter) {
    counter.textContent = `${timeLeft}s`;
    counter.classList.remove('urgent');
  }

  rushTimer = setInterval(() => {
    timeLeft--;
    if (counter) {
      counter.textContent = `${timeLeft}s`;
      if (timeLeft <= 5) counter.classList.add('urgent');
    }

    if (timeLeft <= 0) {
      clearInterval(rushTimer);
      if (counter) counter.textContent = "HẾT GIỜ!";
      playSound('wrong');
    }
  }, 1000);
}

// --------------------------------------------------------------------------
// DICE 6: CHAOS MODE
// --------------------------------------------------------------------------
function startMode6ChaosMode() {
  const chosenRule = CHAOS_RULES[Math.floor(Math.random() * CHAOS_RULES.length)];
  if ($('chaos-rule-title')) $('chaos-rule-title').textContent = chosenRule.title;
  if ($('chaos-rule-desc')) $('chaos-rule-desc').textContent = chosenRule.desc;
}

// --------------------------------------------------------------------------
// 3. STUDENT POOL MANAGER (43 HỌC SINH TỪ CLASS_ROSTER)
// --------------------------------------------------------------------------
function toggleStudentPoolModal() {
  playSound('click');
  const modal = $('student-pool-modal');
  if (!modal) return;
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) {
    renderStudentPoolGrid();
  }
}

function renderStudentPoolGrid() {
  const grid = $('student-pool-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CLASS_ROSTER.forEach(st => {
    const isPicked = pickedStudentIds.has(st.id);
    const chip = document.createElement('div');
    chip.className = `student-chip ${isPicked ? 'picked' : ''}`;
    chip.innerHTML = `
      <span class="chip-stt">#${String(st.id).padStart(2, '0')}</span>
      <span class="chip-name">${st.name}</span>
      <span style="font-size:11px;">${isPicked ? '✓' : '●'}</span>
    `;

    chip.onclick = () => {
      if (pickedStudentIds.has(st.id)) {
        pickedStudentIds.delete(st.id);
      } else {
        pickedStudentIds.add(st.id);
      }
      playSound('click');
      renderStudentPoolGrid();
      updatePoolCounterUI();
    };

    grid.appendChild(chip);
  });

  updatePoolCounterUI();
}

function resetStudentPool() {
  playSound('click');
  pickedStudentIds.clear();
  renderStudentPoolGrid();
  updatePoolCounterUI();
}

function updatePoolCounterUI() {
  const total = CLASS_ROSTER.length;
  const picked = pickedStudentIds.size;
  const remain = total - picked;

  if ($('pool-count-badge')) $('pool-count-badge').textContent = total;
  if ($('pool-picked-count')) $('pool-picked-count').textContent = picked;
  if ($('pool-remain-count')) $('pool-remain-count').textContent = remain;
}
