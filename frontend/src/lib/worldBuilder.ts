import * as THREE from 'three';

const matCache = new Map<string, THREE.MeshStandardMaterial>();
function getMat(color: number, rough = 0.8, metal = 0.1): THREE.MeshStandardMaterial {
  const key = `${color}_${rough}_${metal}`;
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
  return matCache.get(key)!;
}

export function buildGround(scene: THREE.Scene) {
  const mainGeo = new THREE.BoxGeometry(116, 0.5, 116);
  const mainMesh = new THREE.Mesh(mainGeo, getMat(0x1a1a28));
  mainMesh.position.set(57, -0.25, 57);
  mainMesh.receiveShadow = true;
  scene.add(mainMesh);

  const zones = [
    { x: 17, z: 17, w: 35, d: 35, c: 0x2a5a18 },
    { x: 62, z: 17, w: 35, d: 35, c: 0x1e1a38 },
    { x: 98, z: 17, w: 33, d: 35, c: 0x183820 },
    { x: 20, z: 62, w: 40, d: 35, c: 0x5a3820 },
    { x: 64, z: 62, w: 32, d: 35, c: 0x1a1030 },
    { x: 98, z: 66, w: 33, d: 37, c: 0x808090 },
    { x: 60, z: 101, w: 36, d: 28, c: 0x040418 },
  ];
  zones.forEach(z => {
    const geo = new THREE.BoxGeometry(z.w, 0.08, z.d);
    const mesh = new THREE.Mesh(geo, getMat(z.c, 0.95, 0.0));
    mesh.position.set(z.x, 0.01, z.z);
    mesh.receiveShadow = true;
    scene.add(mesh);
  });

  // connecting paths
  const pathMat = getMat(0x3a3020, 0.9, 0.0);
  [[35, 17, 10, 1], [35, 55, 1, 40], [60, 35, 1, 30], [60, 100, 36, 1]].forEach(([x, z, w, d]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, d), pathMat);
    path.position.set(x, 0.02, z);
    scene.add(path);
  });
}

export function buildStructures(scene: THREE.Scene) {
  const makeBuilding = (x: number, z: number, w: number, d: number, h: number,
    wallC: number, roofC: number, glowC: number, label?: string) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), getMat(wallC, 0.8, 0.1));
    wall.position.set(x, h / 2, z);
    wall.castShadow = true;
    scene.add(wall);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.3, d + 0.3), getMat(roofC, 0.7, 0.2));
    roof.position.set(x, h + 0.15, z);
    scene.add(roof);
    // window glow
    for (let i = 0; i < 3; i++) {
      const winMat = new THREE.MeshStandardMaterial({ color: glowC, emissive: glowC, emissiveIntensity: 0.6, transparent: true, opacity: 0.8 });
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.05), winMat);
      win.position.set(x - w / 2 + 0.8 + i * 1.2, h * 0.6, z + d / 2 + 0.05);
      scene.add(win);
    }
  };

  // Hometown
  makeBuilding(8, 14, 8, 7, 4, 0x5a7830, 0x3a5820, 0xffdd80, 'HOME');
  makeBuilding(20, 8, 10, 8, 5, 0x6a4830, 0x4a2810, 0xffaa40, 'SCHOOL');
  makeBuilding(28, 20, 6, 6, 3, 0x507040, 0x304020, 0x80ff80, 'PARK');

  // Academy
  makeBuilding(52, 14, 14, 10, 8, 0x2a2860, 0x1a1850, 0xaaaaff, 'UNIVERSITY');
  makeBuilding(70, 10, 8, 7, 6, 0x303070, 0x202060, 0x8080ff, 'LIBRARY');

  // Tech Forest
  makeBuilding(86, 14, 8, 7, 6, 0x1a4030, 0x0a2020, 0x40ff80, 'LAB');
  makeBuilding(100, 8, 6, 5, 5, 0x204030, 0x102020, 0x20ffc0, 'SERVER');

  // Project Ruins
  makeBuilding(8, 55, 7, 6, 4, 0x603820, 0x402010, 0xff8040, 'RUINS');
  makeBuilding(20, 62, 9, 7, 6, 0x502818, 0x301808, 0xffc060, 'FORGE');
  makeBuilding(32, 50, 6, 5, 3, 0x604020, 0x402010, 0xff6020, 'ARCHIVE');

  // Inner Sanctum
  makeBuilding(56, 58, 10, 8, 8, 0x280a50, 0x180030, 0xc060ff, 'SANCTUM');
  makeBuilding(68, 52, 7, 6, 6, 0x200840, 0x100020, 0xa040e0, 'MIND');

  // Future Peak
  makeBuilding(88, 55, 10, 8, 10, 0x101080, 0x080860, 0x4040ff, 'PEAK');
  makeBuilding(100, 62, 7, 6, 8, 0x080868, 0x040448, 0x2060ff, 'VISION');
  makeBuilding(66, 96, 6, 6, 5, 0x004060, 0x003050, 0x001830, 'DATA VAULT');

  // AI Nexus gateway
  const gateMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.6, metalness: 0.5 });
  const pillarMat = getMat(0x004060, 0.5, 0.4);
  [55, 63].forEach(px => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 0.6), pillarMat);
    pillar.position.set(px, 3, 87);
    scene.add(pillar);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.4, transparent: true, opacity: 0.9 }));
    cap.position.set(px, 6.5, 87);
    scene.add(cap);
  });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.5, 0.5), gateMat);
  beam.position.set(59, 6.25, 87);
  scene.add(beam);

  // AI Nexus platform
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.8, 0.25, 16),
    new THREE.MeshStandardMaterial({ color: 0x001828, emissive: 0x00e5ff, emissiveIntensity: 0.3, metalness: 0.6 }));
  platform.position.set(58, 0.13, 100);
  scene.add(platform);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.12, 8, 40),
    new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.0, transparent: true, opacity: 0.7 }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(58, 0.18, 100);
  scene.add(ring);
}

export function buildTrees(scene: THREE.Scene) {
  const makeTree = (x: number, z: number, type: 'normal' | 'tech' | 'magic' = 'normal') => {
    const group = new THREE.Group();
    const trunkMat = getMat(0x5a3818, 0.9, 0.05);
    const leafColors = type === 'tech' ? [0x40c060, 0x30a050] : type === 'magic' ? [0x8040d0, 0x6020b0] : [0x2d7a20, 0x1e5010];
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 2.5, 8), trunkMat);
    trunk.position.y = 1.25;
    group.add(trunk);
    [1.8, 1.4, 1.0].forEach((r, i) => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), getMat(leafColors[i % 2], 0.9));
      leaf.position.y = [2.2, 3.4, 4.4][i];
      group.add(leaf);
    });
    group.position.set(x, 0, z);
    group.rotation.y = Math.random() * Math.PI * 2;
    scene.add(group);
  };

  [[2, 2], [28, 2], [2, 30], [28, 30], [14, 2]].forEach(([x, z]) => makeTree(x, z, 'normal'));
  for (let i = 0; i < 6; i++) makeTree(46 + i * 5, 2, 'magic');
  for (let i = 0; i < 10; i++) makeTree(82 + Math.sin(i * 2.1) * 8 + 6, Math.cos(i * 1.7) * 12 + 18, 'tech');
  for (let x = 0; x < 115; x += 12) makeTree(x, 0, 'normal');
  for (let x = 0; x < 115; x += 12) makeTree(x, 84, 'magic');
  for (let z = 0; z < 115; z += 12) makeTree(0, z, 'normal');
}

export function buildParticles(scene: THREE.Scene): THREE.Points {
  const count = 300;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = Math.random() * 116;
    pos[i * 3 + 1] = 1 + Math.random() * 6;
    pos[i * 3 + 2] = Math.random() * 116;
    const c = new THREE.Color().setHSL(0.1 + Math.random() * 0.6, 0.9, 0.7);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);
  return particles;
}

export function buildStars(scene: THREE.Scene) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(1500 * 3);
  for (let i = 0; i < 1500; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 200 + Math.random() * 50;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.abs(Math.cos(phi)) + 10;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size: 0.4, color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false });
  scene.add(new THREE.Points(geo, mat));
}
