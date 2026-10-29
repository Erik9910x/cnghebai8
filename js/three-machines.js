/**
 * MACHINING LAB V2.0 — HIGH-PRECISION THREE.JS 3D MACHINERY ENGINE (js/three-machines.js)
 * Mô phỏng 3D WebGL cơ khí chính xác:
 * 1. Slide 01: Multi-Stepped CNC Aerospace Transmission Shaft & 3-Jaw Chuck
 * 2. Slide 07: Heavy Drill Press với Mũi khoan ruột gà rãnh xoắn kép & Phoi cắt
 * 3. Slide 08: Universal Lathe với Băng máy, Mâm cặp 3 chấu, Đài dao mảnh vàng TiN & Phoi xoắn
 * 4. Slide 09: Vertical Milling Machine với Dao phay ngón 4 me cắt & Bàn máy rãnh T
 * 5. Slide 13: 3D Wii Machining Slasher Action Arena (Fruit Ninja Style CNC Workshop)
 */

const threeInstances = {};

// Materials Palette
const MAT_STEEL_DARK = new THREE.MeshStandardMaterial({ color: 0x243242, metalness: 0.85, roughness: 0.35 });
const MAT_STEEL_BRIGHT = new THREE.MeshStandardMaterial({ color: 0xdde5ed, metalness: 0.92, roughness: 0.18 });
const MAT_CAST_IRON = new THREE.MeshStandardMaterial({ color: 0x1b2430, metalness: 0.7, roughness: 0.6 });
const MAT_GOLD_CARBIDE = new THREE.MeshStandardMaterial({ color: 0xffb300, metalness: 0.95, roughness: 0.15 });
const MAT_CYAN_ACCENT = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.85, roughness: 0.25 });
const MAT_CHIP_BURNT = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.3 }); // Phoi xanh do nhiệt
const MAT_BRONZE = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.3 });

function initAllThreeMachines() {
  if (typeof THREE === 'undefined') {
    console.warn("Three.js not loaded, switching to fallback.");
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
    const h = inst.wrap.clientHeight || (key === 'slasher' ? 440 : 340);
    if (w > 0 && h > 0) {
      inst.camera.aspect = w / h;
      inst.camera.updateProjectionMatrix();
      inst.renderer.setSize(w, h);
    }
  }
}

// =============================================================================
// 1. SLIDE 01: COVER 3D — AEROSPACE TRANSMISSION SHAFT & 3-JAW CHUCK
// =============================================================================
function initCover3D() {
  const wrap = $('cover-3d-wrap');
  if (!wrap) return;

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 1.6, 4.4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const l1 = new THREE.DirectionalLight(0xffb020, 1.4);
  l1.position.set(6, 6, 6);
  scene.add(l1);
  const l2 = new THREE.DirectionalLight(0x00f0ff, 1.0);
  l2.position.set(-6, -2, -6);
  scene.add(l2);

  const assembly = new THREE.Group();

  // Mâm cặp 3 chấu (3-Jaw Chuck)
  const chuckBody = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.65, 36), MAT_CAST_IRON);
  chuckBody.rotation.z = Math.PI / 2;
  chuckBody.position.x = -1.75;
  assembly.add(chuckBody);

  // 3 Chấu kẹp độc lập (Stepped Jaws)
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.22), MAT_STEEL_DARK);
    jaw.position.set(-1.42, Math.cos(angle) * 0.7, Math.sin(angle) * 0.7);
    assembly.add(jaw);
  }

  // Trục truyền động 5 bậc CNC (5-Stepped Shaft)
  const shaftGroup = new THREE.Group();
  
  // Bậc 1: Cổ kẹp mâm cặp
  const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 32), MAT_STEEL_DARK);
  s1.rotation.z = Math.PI / 2;
  s1.position.x = -1.1;
  shaftGroup.add(s1);

  // Bậc 2: Thân trụ bóng chính
  const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.3, 36), MAT_STEEL_BRIGHT);
  s2.rotation.z = Math.PI / 2;
  s2.position.x = 0.05;
  shaftGroup.add(s2);

  // Rãnh then trên bậc 2 (Milled Keyway)
  const keyway = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.16), MAT_CAST_IRON);
  keyway.position.set(0.05, 0.7, 0);
  shaftGroup.add(keyway);

  // Bậc 3: Cổ trục lắp vòng bi (Bearing journal)
  const s3 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 32), MAT_STEEL_DARK);
  s3.rotation.z = Math.PI / 2;
  s3.position.x = 1.15;
  shaftGroup.add(s3);

  // Bậc 4: Ren vít đầu trục (Threaded Neck)
  const s4 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.6, 32), MAT_CYAN_ACCENT);
  s4.rotation.z = Math.PI / 2;
  s4.position.x = 1.9;
  shaftGroup.add(s4);

  // Vát mép 45° đầu trục (Chamfer)
  const chamfer = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.15, 32), MAT_STEEL_BRIGHT);
  chamfer.rotation.z = -Math.PI / 2;
  chamfer.position.x = 2.25;
  shaftGroup.add(chamfer);

  assembly.add(shaftGroup);
  scene.add(assembly);

  threeInstances['cover'] = { wrap, renderer, camera, scene };

  function animate() {
    requestAnimationFrame(animate);
    assembly.rotation.x += 0.025;
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 2. SLIDE 07: 3D DRILL PRESS — COLUMN, VISE, TWIST FLUTES & SPIRAL CHIPS
// =============================================================================
function initDrill3D() {
  const wrap = $('drill-3d-wrap');
  if (!wrap) return;

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 1.4, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dl1 = new THREE.DirectionalLight(0x00f0ff, 1.3);
  dl1.position.set(5, 6, 5);
  scene.add(dl1);
  const dl2 = new THREE.DirectionalLight(0xffb020, 0.8);
  dl2.position.set(-4, -2, -4);
  scene.add(dl2);

  const drillMachine = new THREE.Group();

  // Đế máy khoan (Base Plate)
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 2.4), MAT_CAST_IRON);
  base.position.set(0, -1.8, -0.2);
  drillMachine.add(base);

  // Trụ máy khoan (Cylindrical Column)
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.4, 32), MAT_STEEL_BRIGHT);
  column.position.set(0, -0.1, -1.0);
  drillMachine.add(column);

  // Bàn gá phôi (Worktable with T-slots)
  const table = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32), MAT_CAST_IRON);
  table.position.set(0, -0.9, -0.2);
  drillMachine.add(table);

  // Ê-tô máy khoan kẹp phôi (Drill Vise)
  const viseBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 1.1), MAT_STEEL_DARK);
  viseBase.position.set(0, -0.68, -0.2);
  drillMachine.add(viseBase);

  // Khối phôi kim loại đang khoan (Workpiece Block)
  const workBlock = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.9), MAT_STEEL_DARK);
  workBlock.position.set(0, -0.3, -0.2);
  drillMachine.add(workBlock);

  // Lỗ khoan đang hình thành (Bored hole)
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.3, 24), MAT_CAST_IRON);
  hole.position.set(0, -0.05, -0.2);
  drillMachine.add(hole);

  // Cụm đầu khoan di động (Quill & Spindle Chuck)
  const spindleHead = new THREE.Group();
  
  // Đầu trục chính (Spindle housing)
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.8, 24), MAT_CAST_IRON);
  housing.position.set(0, 1.2, -0.2);
  spindleHead.add(housing);

  // Đầu kẹp mũi khoan (Keyless Drill Chuck)
  const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.65, 24), MAT_STEEL_DARK);
  chuck.position.set(0, 0.65, -0.2);
  spindleHead.add(chuck);

  // Mũi khoan ruột gà rãnh xoắn (Twist Drill Bit)
  const drillBitGroup = new THREE.Group();
  drillBitGroup.position.set(0, 0.05, -0.2);

  // Thân mũi khoan
  const bitBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.95, 24), MAT_GOLD_CARBIDE);
  drillBitGroup.add(bitBody);

  // Rãnh xoắn kép ruột gà (Helical Flutes)
  for (let f = 0; f < 8; f++) {
    const fl = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.025, 8, 24, Math.PI), MAT_STEEL_DARK);
    fl.rotation.x = Math.PI / 2 + 0.3;
    fl.rotation.z = (f * Math.PI) / 4;
    fl.position.y = -0.38 + f * 0.1;
    drillBitGroup.add(fl);
  }

  // Mũi nhọn côn 118° (Conical 118 deg point)
  const drillPoint = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 24), MAT_GOLD_CARBIDE);
  drillPoint.rotation.x = Math.PI;
  drillPoint.position.y = -0.58;
  drillBitGroup.add(drillPoint);

  spindleHead.add(drillBitGroup);
  drillMachine.add(spindleHead);

  // Phoi tiện kim loại xoăn bắn ra (Chips)
  const chipGroup = new THREE.Group();
  for (let c = 0; c < 6; c++) {
    const chip = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 12, Math.PI * 1.5), MAT_CHIP_BURNT);
    chip.position.set((Math.random() - 0.5) * 0.4, -0.05 + Math.random() * 0.15, -0.2 + (Math.random() - 0.5) * 0.4);
    chip.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    chipGroup.add(chip);
  }
  drillMachine.add(chipGroup);

  scene.add(drillMachine);
  threeInstances['drill'] = { wrap, renderer, camera, scene };

  let angle = 0;
  let feedY = 0;
  let dir = 1;

  function animate() {
    requestAnimationFrame(animate);
    angle += 0.25; // Chuyển động Vc (Quay tròn)
    drillBitGroup.rotation.y = angle;

    feedY += 0.006 * dir; // Chuyển động S (Tịnh tiến dọc)
    if (feedY > 0.38) dir = -1;
    if (feedY < -0.08) dir = 1;
    spindleHead.position.y = -feedY;

    chipGroup.rotation.y += 0.05;
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 3. SLIDE 08: 3D UNIVERSAL LATHE — BED, CHUCK, GOLD INSERT, CHIPS & SPARKS
// =============================================================================
function initLathe3D() {
  const wrap = $('lathe-3d-wrap');
  if (!wrap) return;

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 1.8, 4.4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const l1 = new THREE.DirectionalLight(0xffb020, 1.4);
  l1.position.set(5, 6, 5);
  scene.add(l1);
  const l2 = new THREE.DirectionalLight(0x00f0ff, 0.9);
  l2.position.set(-5, -2, -5);
  scene.add(l2);

  const lathe = new THREE.Group();

  // Băng máy tiện (Cast-Iron Lathe Bed with V-guideways)
  const bed = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.55, 1.6), MAT_CAST_IRON);
  bed.position.set(0, -1.0, 0);
  lathe.add(bed);

  // Ray dẫn hướng lăng trụ kép (Prismatic Guideways)
  const guide1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 0.18), MAT_STEEL_BRIGHT);
  guide1.position.set(0, -0.68, -0.45);
  lathe.add(guide1);
  const guide2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 0.18), MAT_STEEL_BRIGHT);
  guide2.position.set(0, -0.68, 0.45);
  lathe.add(guide2);

  // Hộp tốc độ trục chính (Headstock Gearbox)
  const headstock = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.4, 1.6), MAT_CAST_IRON);
  headstock.position.set(-1.75, -0.15, 0);
  lathe.add(headstock);

  // Mâm cặp 3 chấu quay (Spinning 3-Jaw Chuck)
  const chuckGroup = new THREE.Group();
  chuckGroup.position.set(-0.95, 0.2, 0);

  const chuckBody = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.45, 32), MAT_STEEL_DARK);
  chuckBody.rotation.z = Math.PI / 2;
  chuckGroup.add(chuckBody);

  for (let j = 0; j < 3; j++) {
    const a = (j * Math.PI * 2) / 3;
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.18), MAT_STEEL_BRIGHT);
    jaw.position.set(0.18, Math.cos(a) * 0.52, Math.sin(a) * 0.52);
    chuckGroup.add(jaw);
  }

  // Phôi thanh thép quay tròn (Rotating Workpiece)
  const workpiece = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.2, 32), MAT_STEEL_BRIGHT);
  workpiece.rotation.z = Math.PI / 2;
  workpiece.position.x = 1.15;
  chuckGroup.add(workpiece);

  lathe.add(chuckGroup);

  // Ụ động đỡ tâm (Tailstock with Live Center)
  const tailstock = new THREE.Group();
  tailstock.position.set(1.65, 0, 0);

  const tsBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.85, 0.9), MAT_CAST_IRON);
  tsBody.position.set(0, -0.3, 0);
  tailstock.add(tsBody);

  const quill = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 24), MAT_STEEL_BRIGHT);
  quill.rotation.z = Math.PI / 2;
  quill.position.set(-0.35, 0.2, 0);
  tailstock.add(quill);

  const liveCenter = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 24), MAT_GOLD_CARBIDE);
  liveCenter.rotation.z = Math.PI / 2;
  liveCenter.position.set(-0.7, 0.2, 0);
  tailstock.add(liveCenter);

  lathe.add(tailstock);

  // Bàn xe dao & Đài gá dao (Carriage & Tool Post)
  const carriage = new THREE.Group();
  carriage.position.set(0.1, -0.4, 0.65);

  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.95), MAT_CAST_IRON);
  carriage.add(saddle);

  const crossSlide = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.65), MAT_STEEL_DARK);
  crossSlide.position.set(0, 0.25, -0.15);
  carriage.add(crossSlide);

  // Đài dao vuông (4-Way Tool Post)
  const toolPost = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.38), MAT_STEEL_DARK);
  toolPost.position.set(0, 0.5, -0.2);
  carriage.add(toolPost);

  // Cán dao tiện (Tool Shank)
  const toolShank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.14), MAT_STEEL_DARK);
  toolShank.position.set(-0.15, 0.5, -0.38);
  carriage.add(toolShank);

  // Mảnh hợp kim cứng mạ vàng TiN (Gold Carbide Insert)
  const carbideInsert = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.08, 3), MAT_GOLD_CARBIDE);
  carbideInsert.rotation.x = -Math.PI / 2;
  carbideInsert.position.set(-0.38, 0.5, -0.38);
  carriage.add(carbideInsert);

  lathe.add(carriage);

  // Hạt tia lửa gia công tiện (Machining Sparks)
  const sparkGeo = new THREE.BufferGeometry();
  const sparkCount = 35;
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let s = 0; s < sparkCount * 3; s += 3) {
    sparkPos[s] = -0.38 + (Math.random() - 0.5) * 0.15;
    sparkPos[s + 1] = 0.5 + (Math.random() - 0.5) * 0.15;
    sparkPos[s + 2] = -0.38 + (Math.random() - 0.5) * 0.15;
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({ color: 0xffb020, size: 0.05, transparent: true, opacity: 0.85 });
  const sparkMesh = new THREE.Points(sparkGeo, sparkMat);
  lathe.add(sparkMesh);

  scene.add(lathe);
  threeInstances['lathe'] = { wrap, renderer, camera, scene };

  let feedX = 0.1;
  let dir = -1;

  function animate() {
    requestAnimationFrame(animate);
    chuckGroup.rotation.x += 0.16; // Chuyển động Vc (Phôi quay tròn)

    feedX += 0.005 * dir; // Chuyển động S_d (Dao tịnh tiến dọc trục)
    if (feedX < -0.45) dir = 1;
    if (feedX > 0.65) dir = -1;
    carriage.position.x = feedX;

    sparkMesh.position.x = feedX - 0.1;

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 4. SLIDE 09: 3D VERTICAL MILLING — COLUMN, KNEE, 4-FLUTE END MILL & T-SLOTS
// =============================================================================
function initMill3D() {
  const wrap = $('mill-3d-wrap');
  if (!wrap) return;

  const w = wrap.clientWidth || 480;
  const h = wrap.clientHeight || 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 1.5, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  wrap.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const ml1 = new THREE.DirectionalLight(0x00f0ff, 1.4);
  ml1.position.set(5, 6, 5);
  scene.add(ml1);
  const ml2 = new THREE.DirectionalLight(0xffb020, 0.9);
  ml2.position.set(-5, -2, -5);
  scene.add(ml2);

  const mill = new THREE.Group();

  // Thân máy phay (Vertical Mill Column & Base)
  const column = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.8), MAT_CAST_IRON);
  column.position.set(0, 0, -1.0);
  mill.add(column);

  // Đầu trục chính nhô ra phía trước (Overarm & Head)
  const headRam = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.4), MAT_CAST_IRON);
  headRam.position.set(0, 1.3, -0.3);
  mill.add(headRam);

  // Trục chính quay & Đầu kẹp dao (Spindle Quill)
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.65, 24), MAT_STEEL_DARK);
  spindle.position.set(0, 0.65, 0.15);
  mill.add(spindle);

  // Dao phay ngón 4 me cắt (4-Flute End Mill Tool)
  const cutterGroup = new THREE.Group();
  cutterGroup.position.set(0, 0.2, 0.15);

  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.75, 24), MAT_STEEL_BRIGHT);
  cutterGroup.add(shank);

  const flutes = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.55, 16), MAT_CYAN_ACCENT);
  flutes.position.y = -0.35;
  cutterGroup.add(flutes);

  mill.add(cutterGroup);

  // Bàn máy phay di trượt tịnh tiến (3-Axis Milling Table with T-slots)
  const tableGroup = new THREE.Group();
  tableGroup.position.set(0, -0.5, 0.15);

  const saddle = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.3), MAT_STEEL_DARK);
  saddle.position.set(0, -0.25, 0);
  tableGroup.add(saddle);

  const workTable = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 1.1), MAT_CAST_IRON);
  tableGroup.add(workTable);

  // 3 Rãnh chữ T trên bàn máy (3 T-slots)
  for (let t = -1; t <= 1; t++) {
    const tslot = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.08, 0.12), MAT_STEEL_BRIGHT);
    tslot.position.set(0, 0.16, t * 0.32);
    tableGroup.add(tslot);
  }

  // Khối phôi kim loại đang phay mặt (Milled Workpiece)
  const workpiece = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.8), MAT_STEEL_BRIGHT);
  workpiece.position.set(0, 0.36, 0);
  tableGroup.add(workpiece);

  mill.add(tableGroup);

  scene.add(mill);
  threeInstances['mill'] = { wrap, renderer, camera, scene };

  let angle = 0;
  let feedX = 0;
  let dir = 1;

  function animate() {
    requestAnimationFrame(animate);
    angle += 0.28; // Chuyển động V (Dao phay quay tròn)
    cutterGroup.rotation.y = angle;

    feedX += 0.007 * dir; // Chuyển động S (Bàn máy mang phôi tịnh tiến)
    if (feedX > 0.65) dir = -1;
    if (feedX < -0.65) dir = 1;
    tableGroup.position.x = feedX;

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// =============================================================================
// 5. SLIDE 13: 3D WII MACHINING SLASHER ARENA (FRUIT NINJA CNC WORKSHOP)
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

  // Con trỏ dao cắt 3D Holographic Cutting Blade
  const bladeGroup = new THREE.Group();
  const bladeBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 1.8, 16), MAT_CYAN_ACCENT);
  bladeBeam.rotation.z = Math.PI / 4;
  bladeGroup.add(bladeBeam);
  const bladeTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), MAT_GOLD_CARBIDE);
  bladeGroup.add(bladeTip);
  scene.add(bladeGroup);

  // Spawn pool of 3D workpieces (Tiện, Phay, Khoan, Hàn, Đúc)
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

  // Pointer position tracker (Wii remote tilt / mouse / touch)
  window.slasherPointer = { x: 0, y: 0 };

  wrap.addEventListener('pointermove', e => {
    const rect = wrap.getBoundingClientRect();
    window.slasherPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    window.slasherPointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  });

  wrap.addEventListener('pointerdown', () => {
    executeSlasherCut();
  });

  threeInstances['slasher'] = { wrap, renderer, camera, scene, bladeGroup };

  let lastSpawn = Date.now();

  function animate() {
    requestAnimationFrame(animate);

    // Update blade position
    bladeGroup.position.set(window.slasherPointer.x * 3.2, window.slasherPointer.y * 2.2, 0);
    bladeGroup.rotation.z += 0.05;

    // Spawn new targets periodically
    if (Date.now() - lastSpawn > 1400 && slasherTargets.length < 5) {
      spawnSlasherPart();
      lastSpawn = Date.now();
    }

    // Move targets
    for (let i = slasherTargets.length - 1; i >= 0; i--) {
      const p = slasherTargets[i];
      p.position.x += p.userData.vx;
      p.position.y += p.userData.vy;
      p.userData.vy -= 0.0012; // Gravity
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

      // Spark explosion & transform to gleaming finished part
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

  if (!hitAny) {
    playSound('incorrect');
  }
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
