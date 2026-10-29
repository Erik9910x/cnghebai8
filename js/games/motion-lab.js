/**
 * MODULE 6: MOTION LAB KINEMATICS SIMULATOR (js/games/motion-lab.js)
 * Mô phỏng động học máy cơ khí và công cụ kiểm tra nguyên lí chuyển động SGK.
 */

let curKinematicMachine = 'tien';
let userKinematics = {
  workpieceRot: true,
  toolRot: false,
  workpieceFeed: false,
  toolFeed: true
};

function initMotionLabModule() {
  updateKinematicsUI();
}

function selectMachineMode(machineKey) {
  playSound('click');
  curKinematicMachine = machineKey;

  // Update tabs
  document.querySelectorAll('.machine-nav-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.machine === machineKey);
  });

  // Reset to default setup
  if (machineKey === 'tien') {
    userKinematics = { workpieceRot: true, toolRot: false, workpieceFeed: false, toolFeed: true };
  } else if (machineKey === 'phay') {
    userKinematics = { workpieceRot: false, toolRot: true, workpieceFeed: true, toolFeed: false };
  } else if (machineKey === 'khoan') {
    userKinematics = { workpieceRot: false, toolRot: true, workpieceFeed: false, toolFeed: true };
  }

  updateKinematicsUI();
  clearKinematicsFeedback();
}

function toggleKinematicSetting(key) {
  playSound('click');
  userKinematics[key] = !userKinematics[key];
  updateKinematicsUI();
  clearKinematicsFeedback();
}

function updateKinematicsUI() {
  const btnWpRot = $('btn-wp-rot');
  const btnToolRot = $('btn-tool-rot');
  const btnWpFeed = $('btn-wp-feed');
  const btnToolFeed = $('btn-tool-feed');

  if (btnWpRot) {
    btnWpRot.classList.toggle('active', userKinematics.workpieceRot);
    const s = btnWpRot.querySelector('.switch-status');
    if (s) s.textContent = userKinematics.workpieceRot ? 'BẬT' : 'TẮT';
  }
  if (btnToolRot) {
    btnToolRot.classList.toggle('active', userKinematics.toolRot);
    const s = btnToolRot.querySelector('.switch-status');
    if (s) s.textContent = userKinematics.toolRot ? 'BẬT' : 'TẮT';
  }
  if (btnWpFeed) {
    btnWpFeed.classList.toggle('active', userKinematics.workpieceFeed);
    const s = btnWpFeed.querySelector('.switch-status');
    if (s) s.textContent = userKinematics.workpieceFeed ? 'BẬT' : 'TẮT';
  }
  if (btnToolFeed) {
    btnToolFeed.classList.toggle('active', userKinematics.toolFeed);
    const s = btnToolFeed.querySelector('.switch-status');
    if (s) s.textContent = userKinematics.toolFeed ? 'BẬT' : 'TẮT';
  }
}

function checkKinematicsPrinciple() {
  const rule = KINEMATICS_RULES[curKinematicMachine];
  const fbEl = $('kinematics-feedback');
  if (!rule) return;

  const isRotMatch = (
    userKinematics.workpieceRot === rule.workpieceRot &&
    userKinematics.toolRot === rule.toolRot
  );
  const isFeedMatch = (
    userKinematics.workpieceFeed === rule.workpieceFeed &&
    userKinematics.toolFeed === rule.toolFeed
  );

  if (isRotMatch && isFeedMatch) {
    playSound('fanfare');
    if (fbEl) {
      fbEl.className = 'seq-alert success';
      fbEl.innerHTML = `<b>🎉 CHÍNH XÁC NGUYÊN LÍ SGK (${rule.name}):</b><br>${rule.desc}`;
    }
  } else {
    playSound('incorrect');
    let err = `<b>✗ CHƯA ĐÚNG NGUYÊN LÍ CHO ${rule.name}:</b><br>`;
    if (!isRotMatch) {
      err += `• Chuyển động quay chưa đúng (Xem lại bộ phận nào phải quay tròn chính?)<br>`;
    }
    if (!isFeedMatch) {
      err += `• Chuyển động tịnh tiến chưa đúng (Bộ phận nào thực hiện chạy dao tịnh tiến?)<br>`;
    }
    err += `<i>Quy tắc chuẩn: ${rule.desc}</i>`;
    if (fbEl) {
      fbEl.className = 'seq-alert warning';
      fbEl.innerHTML = err;
    }
  }
}

function clearKinematicsFeedback() {
  const fbEl = $('kinematics-feedback');
  if (fbEl) {
    fbEl.className = 'seq-alert';
    fbEl.innerHTML = '';
  }
}
