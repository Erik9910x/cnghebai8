/**
 * MACHINING LAB V2.5 — EXTREME HIGH-PRECISION 3D INDUSTRIAL MACHINERY ENGINE (js/three-machines.js)
 * Nâng cấp toàn diện 4 mô hình 3D công nghiệp chuẩn cơ khí Công nghệ 11:
 * 1. Slide 01: 01-drive-shaft-chuck.glb — Cụm Trục Truyền Động 5 Bậc & Mâm Cặp 3 Chấu Tự Định Tâm
 * 2. Slide 07: 02-industrial-drill-press.glb — Máy Khoan Đứng Công Nghiệp & Mũi Khoan Ruột Gà 2 Me Xoắn TiN
 * 3. Slide 08: 03-universal-lathe.glb — Máy Tiện Vạn Năng Công Nghiệp & Băng Máy, Ụ Động, Đài Dao Hợp Kim Vàng TiN
 * 4. Slide 09: 04-vertical-milling-machine.glb — Máy Phay Đứng Công Nghiệp & Dao Phay Ngón, Bàn Máy Rãnh Chữ T
 * 5. Slide 13: Slasher 3D Arena (Fallback Game Engine)
 */

const threeInstances = {};

// Materials Palette for PBR and Procedural Elements
const MAT_STEEL_DARK = new THREE.MeshStandardMaterial({ color: 0x243242, metalness: 0.85, roughness: 0.35 });
const MAT_STEEL_BRIGHT = new THREE.MeshStandardMaterial({ color: 0xdde5ed, metalness: 0.92, roughness: 0.18 });
const MAT_CAST_IRON = new THREE.MeshStandardMaterial({ color: 0x1b2430, metalness: 0.7, roughness: 0.6 });
const MAT_GOLD_CARBIDE = new THREE.MeshStandardMaterial({ color: 0xffb300, metalness: 0.95, roughness: 0.15 });
const MAT_CYAN_ACCENT = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.85, roughness: 0.25 });
const MAT_CHIP_BURNT = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide });
const MAT_BRONZE = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.3 });

function initAllThreeMachines() {
  if (typeof THREE === 'undefined') {
    console.warn("[Three3D] Three.js not loaded, switching to fallback.");
    return;
  }

  initCover3D();
  initDrill3D();
  initLathe3D();
  initMill3D();
  initSlasher3D();
}

function resizeThreeMachines(slideIdx) {
  let key = null;
  if (slideIdx === 0) key = 'cover';
  else if (slideIdx === 6) key = 'drill';
  else if (slideIdx === 7) key = 'lathe';
  else if (slideIdx === 8) key = 'mill';
  else if (slideIdx === 12) key = 'slasher';

  if (key && threeInstances[key]) {
    const inst = threeInstances[key];
    const w = inst.wrap.clientWidth || (key === 'slasher' ? 760 : 480);
    const h = inst.wrap.clientHeight || (key === 'slasher' ? 440 : 380);
    if (w > 0 && h > 0) {
      inst.camera.aspect = w / h;
      inst.camera.updateProjectionMatrix();
      inst.renderer.setSize(w, h);
    }
  }
}

// Window resize observer
window.addEventListener('resize', () => {
  Object.keys(threeInstances).forEach(key => {
    const inst = threeInstances[key];
    if (inst && inst.wrap && inst.renderer && inst.camera) {
      const w = inst.wrap.clientWidth;
      const h = inst.wrap.clientHeight;
      if (w > 0 && h > 0) {
        inst.camera.aspect = w / h;
        inst.camera.updateProjectionMatrix();
        inst.renderer.setSize(w, h);
      }
    }
  });
});

/**
 * Universal GLB Loader with Multi-Path Fallback
 */
function loadGLBWithFallback(primaryPath, secondaryPath, onSuccess, onError) {
  if (typeof THREE.GLTFLoader === 'undefined') {
    console.warn("[Three3D] GLTFLoader is undefined, triggering fallback.");
    if (onError) onError(new Error("GLTFLoader not available"));
    return;
  }
  const loader = new THREE.GLTFLoader();
  loader.load(
    primaryPath,
    gltf => {
      console.log(`[Three3D] Loaded successfully from: ${primaryPath}`);
      onSuccess(gltf);
    },
    undefined,
    err => {
      console.warn(`[Three3D] Failed primary path: ${primaryPath}, trying secondary: ${secondaryPath}`, err);
      if (secondaryPath) {
        loader.load(
          secondaryPath,
          gltf => {
            console.log(`[Three3D] Loaded successfully from secondary: ${secondaryPath}`);
            onSuccess(gltf);
          },
          undefined,
          err2 => {
            console.warn(`[Three3D] Failed secondary path: ${secondaryPath}`, err2);
            if (onError) onError(err2);
          }
        );
      } else if (onError) {
        onError(err);
      }
    }
  );
}

/**
 * Center model and set up framing
 */
function fitModelToCamera(object, camera, controls, options = {}) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  if (options.lockYZCenter) {
    // Keep Y and Z aligned with native rotation axis (for rotating shafts)
    object.position.x -= center.x;
  } else {
    object.position.x -= center.x;
    object.position.y -= center.y;
    object.position.z -= center.z;
  }

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera.fov * Math.PI) / 180;
  let dist = (maxDim / 2) / Math.tan(fov / 2);
  dist *= (options.distMult || 1.35);

  const posX = options.posX !== undefined ? options.posX : dist * 0.75;
  const posY = options.posY !== undefined ? options.posY : dist * 0.55;
  const posZ = options.posZ !== undefined ? options.posZ : dist * 0.95;
  camera.position.set(posX, posY, posZ);
  camera.lookAt(0, 0, 0);

  if (controls) {
    controls.target.set(0, 0, 0);
    controls.update();
  }
}

/**
 * Sidebar Tool Bar Injection: Expand, Zoom +, Zoom -, Reset, Front, Back, Side, Top, Iso, Play/Pause
 */
function injectBoxSidebar(wrap, key) {
  if (!wrap) return;

  // 1. Inject prominent Expand button into HUD if available
  const hud = wrap.querySelector('.canvas-hud');
  if (hud && !hud.querySelector('.btn-expand-badge')) {
    const expBadge = document.createElement('button');
    expBadge.className = 'btn-expand-badge';
    expBadge.id = `badge-expand-${key}`;
    expBadge.innerHTML = '⛶ PHÓNG TO';
    expBadge.title = 'Phóng to toàn màn hình cho bài thuyết trình (Phím Esc để thu nhỏ)';
    expBadge.onclick = (e) => {
      e.stopPropagation();
      window.toggleExpand3D(key);
    };
    hud.appendChild(expBadge);
  }

  // 2. Inject floating tool sidebar on right
  if (wrap.querySelector('.box-sidebar-tools')) return;
  const bar = document.createElement('div');
  bar.className = 'box-sidebar-tools';
  bar.innerHTML = `
    <button class="box-tool-btn btn-expand-tool" id="btn-expand-${key}" data-tip="Phóng to toàn màn hình (Expand)" onclick="toggleExpand3D('${key}')">⛶</button>
    <div class="box-tool-divider"></div>
    <button class="box-tool-btn" data-tip="Phóng to (Zoom +)" onclick="threeMachineAction('${key}', 'zoomIn')">＋</button>
    <button class="box-tool-btn" data-tip="Thu nhỏ (Zoom -)" onclick="threeMachineAction('${key}', 'zoomOut')">－</button>
    <button class="box-tool-btn" data-tip="Khôi phục góc nhìn mặc định" onclick="threeMachineAction('${key}', 'reset')">⟲</button>
    <div class="box-tool-divider"></div>
    <button class="box-tool-btn" data-tip="Góc nhìn Chính diện (Front)" onclick="threeMachineAction('${key}', 'front')">F</button>
    <button class="box-tool-btn" data-tip="Góc nhìn Mặt sau (Back)" onclick="threeMachineAction('${key}', 'back')">B</button>
    <button class="box-tool-btn" data-tip="Góc nhìn Cạnh bên (Side)" onclick="threeMachineAction('${key}', 'side')">S</button>
    <button class="box-tool-btn" data-tip="Góc nhìn Từ trên (Top)" onclick="threeMachineAction('${key}', 'top')">T</button>
    <button class="box-tool-btn" data-tip="Góc nhìn Đẳng cự (Isometric 3D)" onclick="threeMachineAction('${key}', 'iso')">3D</button>
    <div class="box-tool-divider"></div>
    <button class="box-tool-btn" data-tip="Tạm dừng / Tiếp tục quay" id="btn-pause-${key}" onclick="threeMachineAction('${key}', 'togglePause')">⏸</button>
  `;
  wrap.appendChild(bar);
}

/**
 * Toggle Fullscreen / Theater Presentation Expand Mode
 */
window.toggleExpand3D = function(key) {
  const inst = threeInstances[key];
  if (!inst) return;
  const wrap = inst.wrap;

  if (!inst.isExpanded) {
    // 1. Create a placeholder to keep layout stable inside #stage
    inst.placeholder = document.createElement('div');
    inst.placeholder.className = 'three-canvas-placeholder';
    inst.placeholder.style.width = wrap.offsetWidth + 'px';
    inst.placeholder.style.height = wrap.offsetHeight + 'px';
    wrap.parentNode.insertBefore(inst.placeholder, wrap);

    // 2. Append directly to body to break free of #stage CSS transform:scale()
    document.body.appendChild(wrap);
    wrap.classList.add('theater-expanded');
    inst.isExpanded = true;
  } else {
    // Collapse back into the slide
    wrap.classList.remove('theater-expanded');
    if (inst.placeholder && inst.placeholder.parentNode) {
      inst.placeholder.parentNode.insertBefore(wrap, inst.placeholder);
      inst.placeholder.remove();
      inst.placeholder = null;
    }
    inst.isExpanded = false;
  }

  // Update badge and tool button labels
  const badge = document.getElementById(`badge-expand-${key}`);
  const toolBtn = document.getElementById(`btn-expand-${key}`);

  if (badge) {
    badge.innerHTML = inst.isExpanded ? '✕ THU NHỎ' : '⛶ PHÓNG TO';
  }
  if (toolBtn) {
    toolBtn.innerHTML = inst.isExpanded ? '🗗' : '⛶';
    toolBtn.setAttribute('data-tip', inst.isExpanded ? 'Thu nhỏ về slide (Esc)' : 'Phóng to toàn màn hình (Expand)');
  }

  // Resize WebGL viewport to fill expanded / restored bounds
  const resizeViewport = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w > 0 && h > 0) {
      inst.camera.aspect = w / h;
      inst.camera.updateProjectionMatrix();
      inst.renderer.setSize(w, h);
    }
  };

  resizeViewport();
  setTimeout(resizeViewport, 50);
  setTimeout(resizeViewport, 150);
  setTimeout(resizeViewport, 300);
};

// Press Escape to exit expanded mode
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    Object.keys(threeInstances).forEach(key => {
      const inst = threeInstances[key];
      if (inst && inst.isExpanded) {
        window.toggleExpand3D(key);
      }
    });
  }
});

/**
 * Handle Sidebar Actions
 */
window.threeMachineAction = function(key, action) {
  const inst = threeInstances[key];
  if (!inst) return;
  const { camera, controls } = inst;
  const baseDist = inst.baseDist || 3.2;

  if (action === 'zoomIn') {
    if (controls) {
      camera.position.sub(controls.target).multiplyScalar(0.82).add(controls.target);
      controls.update();
    }
  } else if (action === 'zoomOut') {
    if (controls) {
      camera.position.sub(controls.target).multiplyScalar(1.22).add(controls.target);
      controls.update();
    }
  } else if (action === 'reset') {
    if (inst.resetCamera) inst.resetCamera();
  } else if (action === 'front') {
    // Chính diện (+Z nhìn vào tâm)
    camera.position.set(0, 0.2, baseDist);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  } else if (action === 'back') {
    // Mặt sau (-Z nhìn vào tâm)
    camera.position.set(0, 0.2, -baseDist);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  } else if (action === 'side') {
    // Cạnh bên (+X nhìn dọc trục)
    camera.position.set(baseDist, 0.2, 0);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  } else if (action === 'top') {
    // Từ trên xuống (+Y)
    camera.position.set(0, baseDist, 0.001);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  } else if (action === 'iso') {
    // Góc phối cảnh kỹ thuật đẳng cự (Isometric 3D)
    camera.position.set(baseDist * 0.72, baseDist * 0.55, baseDist * 0.85);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  } else if (action === 'togglePause') {
    inst.isPaused = !inst.isPaused;
    const btn = document.getElementById(`btn-pause-${key}`);
    if (btn) btn.textContent = inst.isPaused ? '▶' : '⏸';
  }
};

// =============================================================================
// 1. SLIDE 01: COVER 3D — TRỤC TRUYỀN ĐỘNG 5 BẬC & MÂM CẶP 3 CHẤU (GLB 01)
// =============================================================================
function initCover3D() {
  const wrap = $('cover-3d-wrap');
  if (!wrap) return;

  injectBoxSidebar(wrap, 'cover');

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 380;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(1.9, 1.3, 3.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  // High-End Studio Lighting for White Checkered Background
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const lKey = new THREE.DirectionalLight(0xfff8ee, 1.6);
  lKey.position.set(6, 8, 6);
  scene.add(lKey);
  const lRim = new THREE.DirectionalLight(0x0284c7, 0.8);
  lRim.position.set(-6, 3, -6);
  scene.add(lRim);
  const lFill = new THREE.DirectionalLight(0x94a3b8, 0.6);
  lFill.position.set(0, -5, 4);
  scene.add(lFill);

  const grid = new THREE.GridHelper(8, 16, 0x0284c7, 0xcbd5e1);
  grid.position.y = -1.1;
  scene.add(grid);

  let animatedModel = null;
  const initialCamPos = new THREE.Vector3(1.9, 1.3, 3.2);

  function resetCamera() {
    camera.position.copy(initialCamPos);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  }

  function buildProceduralCoverFallback() {
    const assembly = new THREE.Group();
    const chuckBody = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.65, 36), MAT_CAST_IRON);
    chuckBody.rotation.z = Math.PI / 2;
    chuckBody.position.x = -1.75;
    assembly.add(chuckBody);
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.22), MAT_STEEL_DARK);
      jaw.position.set(-1.42, Math.cos(angle) * 0.7, Math.sin(angle) * 0.7);
      assembly.add(jaw);
    }
    const shaftGroup = new THREE.Group();
    const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 32), MAT_STEEL_DARK);
    s1.rotation.z = Math.PI / 2; s1.position.x = -1.1; shaftGroup.add(s1);
    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.3, 36), MAT_STEEL_BRIGHT);
    s2.rotation.z = Math.PI / 2; s2.position.x = 0.05; shaftGroup.add(s2);
    const keyway = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.16), MAT_CAST_IRON);
    keyway.position.set(0.05, 0.7, 0); shaftGroup.add(keyway);
    const s3 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 32), MAT_STEEL_DARK);
    s3.rotation.z = Math.PI / 2; s3.position.x = 1.15; shaftGroup.add(s3);
    const s4 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.6, 32), MAT_CYAN_ACCENT);
    s4.rotation.z = Math.PI / 2; s4.position.x = 1.9; shaftGroup.add(s4);
    const chamfer = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.15, 32), MAT_STEEL_BRIGHT);
    chamfer.rotation.z = -Math.PI / 2; chamfer.position.x = 2.25; shaftGroup.add(chamfer);
    assembly.add(shaftGroup);
    return assembly;
  }

  // Load High-End 01-drive-shaft-chuck.glb
  loadGLBWithFallback(
    'assets/models/01-drive-shaft-chuck.glb',
    'New 3D Extreme/01-drive-shaft-chuck.glb',
    gltf => {
      animatedModel = gltf.scene;
      fitModelToCamera(animatedModel, camera, controls, { distMult: 1.25, posX: 1.9, posY: 1.2, posZ: 2.8, lockYZCenter: true });
      initialCamPos.copy(camera.position);
      scene.add(animatedModel);
    },
    () => {
      animatedModel = buildProceduralCoverFallback();
      fitModelToCamera(animatedModel, camera, controls, { distMult: 1.4 });
      initialCamPos.copy(camera.position);
      scene.add(animatedModel);
    }
  );

  threeInstances['cover'] = { wrap, renderer, camera, scene, controls, resetCamera, baseDist: 2.8, isPaused: false };

  let lastTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (animatedModel && !threeInstances['cover'].isPaused) {
      animatedModel.rotation.x += dt * 1.8; // Chuyển động quay Vc quanh trục X (750 RPM minh họa)
    }
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 2. SLIDE 07: 3D DRILL PRESS — MÁY KHOAN ĐỨNG CÔNG NGHIỆP (GLB 02)
// =============================================================================
function initDrill3D() {
  const wrap = $('drill-3d-wrap');
  if (!wrap) return;

  injectBoxSidebar(wrap, 'drill');

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 380;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(2.4, 1.4, 3.4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const lKey = new THREE.DirectionalLight(0xfff8ee, 1.6);
  lKey.position.set(5, 7, 5);
  scene.add(lKey);
  const lRim = new THREE.DirectionalLight(0x0284c7, 0.9);
  lRim.position.set(-5, 2, -5);
  scene.add(lRim);

  const grid = new THREE.GridHelper(8, 16, 0x0284c7, 0xcbd5e1);
  grid.position.y = -1.2;
  scene.add(grid);

  let spindleNode = null;
  let chuckNode = null;
  let bitNode = null;
  let chipsNode = null;
  let holeNode = null;

  let spindleBaseY = 0, chuckBaseY = 0, bitBaseY = 0;
  let spindleAngle = 0;
  let feedOffset = 0;
  let feedDir = 1;
  let dwellTimer = 0;
  const initialCamPos = new THREE.Vector3(2.4, 1.4, 3.4);

  function resetCamera() {
    camera.position.copy(initialCamPos);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  }

  function setupDrillKinematics(model) {
    spindleNode = model.getObjectByName('Spindle');
    chuckNode = model.getObjectByName('DrillChuck');
    bitNode = model.getObjectByName('TwistDrillBit');
    chipsNode = model.getObjectByName('DrillChips') || model.getObjectByName('DrillChips_Mesh');
    holeNode = model.getObjectByName('DrilledHoleVisual');

    if (spindleNode) spindleBaseY = spindleNode.position.y;
    if (chuckNode) chuckBaseY = chuckNode.position.y;
    if (bitNode) bitBaseY = bitNode.position.y;
  }

  function buildProceduralDrillFallback() {
    const drillMachine = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 2.4), MAT_CAST_IRON);
    base.position.set(0, -1.8, -0.2); drillMachine.add(base);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.4, 32), MAT_STEEL_BRIGHT);
    col.position.set(0, -0.1, -1.0); drillMachine.add(col);
    const tbl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32), MAT_CAST_IRON);
    tbl.position.set(0, -0.9, -0.2); drillMachine.add(tbl);
    const vise = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 1.1), MAT_STEEL_DARK);
    vise.position.set(0, -0.68, -0.2); drillMachine.add(vise);
    const workBlock = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.9), MAT_STEEL_DARK);
    workBlock.position.set(0, -0.3, -0.2); drillMachine.add(workBlock);

    const spindleHead = new THREE.Group();
    const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.65, 24), MAT_STEEL_DARK);
    chuck.position.set(0, 0.65, -0.2); chuck.name = 'DrillChuck'; spindleHead.add(chuck);
    const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.95, 24), MAT_GOLD_CARBIDE);
    bit.position.set(0, 0.05, -0.2); bit.name = 'TwistDrillBit'; spindleHead.add(bit);
    drillMachine.add(spindleHead);
    return drillMachine;
  }

  loadGLBWithFallback(
    'assets/models/02-industrial-drill-press.glb',
    'New 3D Extreme/02-industrial-drill-press.glb',
    gltf => {
      fitModelToCamera(gltf.scene, camera, controls, { distMult: 1.25, posX: 2.1, posY: 1.2, posZ: 2.9 });
      initialCamPos.copy(camera.position);
      setupDrillKinematics(gltf.scene);
      scene.add(gltf.scene);
    },
    () => {
      const fallback = buildProceduralDrillFallback();
      fitModelToCamera(fallback, camera, controls, { distMult: 1.4 });
      initialCamPos.copy(camera.position);
      setupDrillKinematics(fallback);
      scene.add(fallback);
    }
  );

  threeInstances['drill'] = { wrap, renderer, camera, scene, controls, resetCamera, baseDist: 3.0, isPaused: false };

  let lastTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!threeInstances['drill'].isPaused) {
      // Kinematics: Spindle Vc (Spinning) + Feed S (Downfeed into Workpiece)
      spindleAngle += dt * 14.0;
      if (bitNode) bitNode.rotation.y = spindleAngle;
      if (chuckNode) chuckNode.rotation.y = spindleAngle;
      if (spindleNode) spindleNode.rotation.y = spindleAngle;

      if (dwellTimer > 0) {
        dwellTimer -= dt;
      } else {
        feedOffset += feedDir * dt * 0.18;
        if (feedOffset > 0.34) {
          feedOffset = 0.34;
          feedDir = -1;
          dwellTimer = 0.25; // Dừng tại đáy lỗ côn 118°
        }
        if (feedOffset < 0.0) {
          feedOffset = 0.0;
          feedDir = 1;
          dwellTimer = 0.2;
        }
      }

      const dy = -feedOffset;
      if (spindleNode) spindleNode.position.y = spindleBaseY + dy;
      if (chuckNode) chuckNode.position.y = chuckBaseY + dy;
      if (bitNode) bitNode.position.y = bitBaseY + dy;

      // Chips active when drill enters workpiece
      if (chipsNode) {
        const isCutting = feedOffset > 0.10;
        chipsNode.visible = isCutting;
        if (isCutting) {
          chipsNode.rotation.y += dt * 10.0;
        }
      }

      if (holeNode) {
        holeNode.scale.set(1, Math.min(1.0, Math.max(0.25, feedOffset / 0.34)), 1);
      }
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 3. SLIDE 08: 3D UNIVERSAL LATHE — MÁY TIỆN VẠN NĂNG CÔNG NGHIỆP (GLB 03)
// =============================================================================
function initLathe3D() {
  const wrap = $('lathe-3d-wrap');
  if (!wrap) return;

  injectBoxSidebar(wrap, 'lathe');

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 380;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(2.0, 1.8, 3.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const lKey = new THREE.DirectionalLight(0xfff8ee, 1.6);
  lKey.position.set(6, 8, 6);
  scene.add(lKey);
  const lRim = new THREE.DirectionalLight(0x0284c7, 0.9);
  lRim.position.set(-6, 2, -6);
  scene.add(lRim);

  const grid = new THREE.GridHelper(8, 16, 0x0284c7, 0xcbd5e1);
  grid.position.y = -1.0;
  scene.add(grid);

  // Machining Sparks at cutting tip
  const sparkGeo = new THREE.BufferGeometry();
  const sparkCount = 35;
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let s = 0; s < sparkCount * 3; s += 3) {
    sparkPos[s] = (Math.random() - 0.5) * 0.15;
    sparkPos[s + 1] = (Math.random() - 0.5) * 0.15;
    sparkPos[s + 2] = (Math.random() - 0.5) * 0.15;
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({ color: 0xffb020, size: 0.04, transparent: true, opacity: 0.85 });
  const sparkMesh = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparkMesh);

  let chuckNode = null;
  let workpieceNode = null;
  let carriageNode = null;
  let carriageBaseX = 0;
  let feedX = 0;
  let feedDir = -1;
  const initialCamPos = new THREE.Vector3(2.0, 1.8, 3.8);

  function resetCamera() {
    camera.position.copy(initialCamPos);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  }

  function setupLatheKinematics(model) {
    chuckNode = model.getObjectByName('ChuckAssembly');
    workpieceNode = model.getObjectByName('RotatingWorkpiece') || model.getObjectByName('WorkpieceAssembly');
    carriageNode = model.getObjectByName('CarriageAssembly');

    if (carriageNode) {
      carriageBaseX = carriageNode.position.x;
    }
  }

  function buildProceduralLatheFallback() {
    const lathe = new THREE.Group();
    const bed = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.55, 1.6), MAT_CAST_IRON);
    bed.position.set(0, -1.0, 0); lathe.add(bed);
    const headstock = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.4, 1.6), MAT_CAST_IRON);
    headstock.position.set(-1.75, -0.15, 0); lathe.add(headstock);

    const chuckGroup = new THREE.Group();
    chuckGroup.name = 'ChuckAssembly';
    chuckGroup.position.set(-0.95, 0.2, 0);
    const chuckBody = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.45, 32), MAT_STEEL_DARK);
    chuckBody.rotation.z = Math.PI / 2; chuckGroup.add(chuckBody);
    const wp = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.2, 32), MAT_STEEL_BRIGHT);
    wp.rotation.z = Math.PI / 2; wp.position.x = 1.15; wp.name = 'RotatingWorkpiece'; chuckGroup.add(wp);
    lathe.add(chuckGroup);

    const carriage = new THREE.Group();
    carriage.name = 'CarriageAssembly';
    carriage.position.set(0.1, -0.4, 0.65);
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.95), MAT_CAST_IRON);
    carriage.add(saddle);
    const toolPost = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.38), MAT_STEEL_DARK);
    toolPost.position.set(0, 0.5, -0.2); carriage.add(toolPost);
    lathe.add(carriage);
    return lathe;
  }

  loadGLBWithFallback(
    'assets/models/03-universal-lathe.glb',
    'New 3D Extreme/03-universal-lathe.glb',
    gltf => {
      fitModelToCamera(gltf.scene, camera, controls, { distMult: 1.35, posX: 2.1, posY: 1.6, posZ: 3.4 });
      initialCamPos.copy(camera.position);
      setupLatheKinematics(gltf.scene);
      scene.add(gltf.scene);
    },
    () => {
      const fallback = buildProceduralLatheFallback();
      fitModelToCamera(fallback, camera, controls, { distMult: 1.45 });
      initialCamPos.copy(camera.position);
      setupLatheKinematics(fallback);
      scene.add(fallback);
    }
  );

  threeInstances['lathe'] = { wrap, renderer, camera, scene, controls, resetCamera, baseDist: 3.4, isPaused: false };

  let lastTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!threeInstances['lathe'].isPaused) {
      // Kinematics: Vc (Workpiece Spin) + Sd (Carriage Longitudinal Feed)
      const spinSpeed = dt * 12.0;
      if (chuckNode) chuckNode.rotation.x += spinSpeed;
      if (workpieceNode) workpieceNode.rotation.x += spinSpeed;

      feedX += feedDir * dt * 0.15;
      if (feedX > 0.45) feedDir = -1;
      if (feedX < -0.35) feedDir = 1;

      if (carriageNode) {
        carriageNode.position.x = carriageBaseX + feedX;
        sparkMesh.position.set(carriageNode.position.x, 0.25, 0.15);
      }
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 4. SLIDE 09: 3D VERTICAL MILLING — MÁY PHAY ĐỨNG CÔNG NGHIỆP (GLB 04)
// =============================================================================
function initMill3D() {
  const wrap = $('mill-3d-wrap');
  if (!wrap) return;

  injectBoxSidebar(wrap, 'mill');

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 380;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(2.4, 1.8, 3.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const lKey = new THREE.DirectionalLight(0xfff8ee, 1.6);
  lKey.position.set(6, 8, 6);
  scene.add(lKey);
  const lRim = new THREE.DirectionalLight(0x0284c7, 0.9);
  lRim.position.set(-6, 2, -6);
  scene.add(lRim);

  const grid = new THREE.GridHelper(8, 16, 0x0284c7, 0xcbd5e1);
  grid.position.y = -1.1;
  scene.add(grid);

  let toolHolderNode = null;
  let spindleNode = null;
  let tableNode = null;
  let tableBaseX = 0;
  let feedX = 0;
  let feedDir = 1;
  const initialCamPos = new THREE.Vector3(2.4, 1.8, 3.6);

  function resetCamera() {
    camera.position.copy(initialCamPos);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
    camera.lookAt(0, 0, 0);
  }

  function setupMillKinematics(model) {
    spindleNode = model.getObjectByName('Spindle');
    toolHolderNode = model.getObjectByName('ToolHolder');
    tableNode = model.getObjectByName('MillingTableAssembly') || model.getObjectByName('Worktable');

    if (tableNode) {
      tableBaseX = tableNode.position.x;
    }
  }

  function buildProceduralMillFallback() {
    const mill = new THREE.Group();
    const col = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.8), MAT_CAST_IRON);
    col.position.set(0, 0, -1.0); mill.add(col);
    const headRam = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.4), MAT_CAST_IRON);
    headRam.position.set(0, 1.3, -0.3); mill.add(headRam);

    const cutterGroup = new THREE.Group();
    cutterGroup.name = 'ToolHolder';
    cutterGroup.position.set(0, 0.2, 0.15);
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.75, 24), MAT_STEEL_BRIGHT);
    cutterGroup.add(shank);
    const flutes = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.55, 16), MAT_CYAN_ACCENT);
    flutes.position.y = -0.35; cutterGroup.add(flutes);
    mill.add(cutterGroup);

    const tableGroup = new THREE.Group();
    tableGroup.name = 'MillingTableAssembly';
    tableGroup.position.set(0, -0.5, 0.15);
    const workTable = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 1.1), MAT_CAST_IRON);
    tableGroup.add(workTable);
    const wp = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.8), MAT_STEEL_BRIGHT);
    wp.position.set(0, 0.36, 0); tableGroup.add(wp);
    mill.add(tableGroup);
    return mill;
  }

  loadGLBWithFallback(
    'assets/models/04-vertical-milling-machine.glb',
    'New 3D Extreme/04-vertical-milling-machine.glb',
    gltf => {
      fitModelToCamera(gltf.scene, camera, controls, { distMult: 1.3, posX: 2.1, posY: 1.5, posZ: 3.2 });
      initialCamPos.copy(camera.position);
      setupMillKinematics(gltf.scene);
      scene.add(gltf.scene);
    },
    () => {
      const fallback = buildProceduralMillFallback();
      fitModelToCamera(fallback, camera, controls, { distMult: 1.45 });
      initialCamPos.copy(camera.position);
      setupMillKinematics(fallback);
      scene.add(fallback);
    }
  );

  threeInstances['mill'] = { wrap, renderer, camera, scene, controls, resetCamera, baseDist: 3.2, isPaused: false };

  let lastTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!threeInstances['mill'].isPaused) {
      // Kinematics: V (End Mill Cutter Rotation) + S (Worktable Longitudinal Feed)
      const cutterSpeed = dt * 15.0;
      if (toolHolderNode) toolHolderNode.rotation.y += cutterSpeed;
      if (spindleNode) spindleNode.rotation.y += cutterSpeed;

      feedX += feedDir * dt * 0.18;
      if (feedX > 0.38) feedDir = -1;
      if (feedX < -0.38) feedDir = 1;

      if (tableNode) {
        tableNode.position.x = tableBaseX + feedX;
      }
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 5. SLIDE 13: 3D SLASHER ARENA ENGINE (FALLBACK / EXTRA GAME ENGINE)
// =============================================================================
let slasherScore = 0;
let slasherCombo = 0;
let slasherPartsCut = 0;
const slasherTargets = [];

function initSlasher3D() {
  const wrap = $('slasher-3d-arena');
  if (!wrap) return;

  const w = wrap.clientWidth || 760;
  const h = wrap.clientHeight || 440;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  wrap.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const l1 = new THREE.DirectionalLight(0x00f0ff, 1.5);
  l1.position.set(4, 5, 5);
  scene.add(l1);
  const l2 = new THREE.DirectionalLight(0xffb020, 1.2);
  l2.position.set(-4, -4, 4);
  scene.add(l2);

  const bladeGroup = new THREE.Group();
  const bladeBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 1.8, 16), MAT_CYAN_ACCENT);
  bladeBeam.rotation.z = Math.PI / 4;
  bladeGroup.add(bladeBeam);
  const bladeTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), MAT_GOLD_CARBIDE);
  bladeGroup.add(bladeTip);
  scene.add(bladeGroup);

  const partTypes = [
    { type: 'TIỆN', geo: new THREE.CylinderGeometry(0.35, 0.35, 1.4, 24), mat: MAT_STEEL_BRIGHT, name: "Trục tròn xoay" },
    { type: 'PHAY', geo: new THREE.BoxGeometry(0.9, 0.7, 0.7), mat: MAT_STEEL_DARK, name: "Khối rãnh T" },
    { type: 'KHOAN', geo: new THREE.CylinderGeometry(0.4, 0.4, 0.8, 20), mat: MAT_CYAN_ACCENT, name: "Phôi tạo lỗ" },
    { type: 'HÀN', geo: new THREE.BoxGeometry(1.3, 0.3, 0.3), mat: MAT_BRONZE, name: "Dầm ghép mối" }
  ];

  function spawnSlasherPart() {
    const def = partTypes[Math.floor(Math.random() * partTypes.length)];
    const mesh = new THREE.Mesh(def.geo, def.mat.clone());
    mesh.position.set((Math.random() - 0.5) * 4.4, -3.2, (Math.random() - 0.5) * 1.5);
    mesh.userData = {
      type: def.type,
      name: def.name,
      vx: (Math.random() - 0.5) * 0.03,
      vy: 0.07 + Math.random() * 0.03,
      rotX: (Math.random() - 0.5) * 0.04,
      rotY: (Math.random() - 0.5) * 0.04,
      cut: false
    };
    scene.add(mesh);
    slasherTargets.push(mesh);
  }

  window.slasherPointer = { x: 0, y: 0 };
  wrap.addEventListener('pointermove', e => {
    const rect = wrap.getBoundingClientRect();
    window.slasherPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    window.slasherPointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  });
  wrap.addEventListener('pointerdown', () => executeSlasherCut());

  threeInstances['slasher'] = { wrap, renderer, camera, scene, bladeGroup };

  let lastSpawn = Date.now();
  function animate() {
    requestAnimationFrame(animate);
    bladeGroup.position.set(window.slasherPointer.x * 3.2, window.slasherPointer.y * 2.2, 0);
    bladeGroup.rotation.z += 0.05;

    if (Date.now() - lastSpawn > 1400 && slasherTargets.length < 5) {
      spawnSlasherPart();
      lastSpawn = Date.now();
    }

    for (let i = slasherTargets.length - 1; i >= 0; i--) {
      const p = slasherTargets[i];
      p.position.x += p.userData.vx;
      p.position.y += p.userData.vy;
      p.userData.vy -= 0.0012;
      p.rotation.x += p.userData.rotX;
      p.rotation.y += p.userData.rotY;

      if (p.position.y < -3.6) {
        scene.remove(p);
        slasherTargets.splice(i, 1);
        if (!p.userData.cut && slasherCombo > 0) {
          slasherCombo = 0;
          updateSlasherHUD();
        }
      }
    }
    renderer.render(scene, camera);
  }
  animate();
}

function executeSlasherCut() {
  playSound('click');
  const inst = threeInstances['slasher'];
  if (!inst) return;
  const bx = window.slasherPointer.x * 3.2;
  const by = window.slasherPointer.y * 2.2;
  let hitAny = false;

  for (let i = 0; i < slasherTargets.length; i++) {
    const p = slasherTargets[i];
    if (p.userData.cut) continue;
    const dx = p.position.x - bx;
    const dy = p.position.y - by;
    const dist = Math.hypot(dx, dy);

    if (dist < 1.1) {
      hitAny = true;
      p.userData.cut = true;
      playSound('correct');
      p.material = MAT_GOLD_CARBIDE;
      p.scale.set(0.75, 1.25, 0.75);
      p.userData.vy = -0.04;
      p.userData.rotX = 0.2;
      slasherCombo++;
      const pts = 100 * Math.min(5, slasherCombo);
      slasherScore += pts;
      slasherPartsCut++;
      spawnConfetti(inst.wrap);
      updateSlasherHUD(`⚡ GIA CÔNG THÀNH CÔNG: <b>${p.userData.type} (${p.userData.name})</b>! (+${pts}đ)`);
    }
  }
  if (!hitAny) playSound('incorrect');
}

function updateSlasherHUD(msgHtml) {
  if ($('slasher-score-val')) $('slasher-score-val').textContent = `${slasherScore} đ`;
  if ($('slasher-combo-val')) $('slasher-combo-val').textContent = `x${slasherCombo} COMBO 🔥`;
  if ($('slasher-parts-val')) $('slasher-parts-val').textContent = `${slasherPartsCut} phôi`;
  if (msgHtml && $('slasher-hud-msg')) $('slasher-hud-msg').innerHTML = msgHtml;
}

function restartSlasherGame() {
  playSound('click');
  slasherScore = 0;
  slasherCombo = 0;
  slasherPartsCut = 0;
  updateSlasherHUD("Đã làm mới đấu trường 3D Slasher! Nghiêng điện thoại hoặc di chuột để chém gia công chi tiết.");
}
