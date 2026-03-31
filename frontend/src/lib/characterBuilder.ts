import * as THREE from 'three';

const matCache = new Map<string, THREE.MeshStandardMaterial>();

function getMat(color: number, rough = 0.8, metal = 0.1): THREE.MeshStandardMaterial {
  const key = `${color}_${rough}_${metal}`;
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
  }
  return matCache.get(key)!;
}

/** 
 * Build a normal human character — fixed proportions:
 * - One head, one neck, one torso
 * - ONE pair of arms (left + right only)
 * - ONE pair of legs (left + right only)
 * - One pair of feet
 * Matches the reference image: athletic build, normal human anatomy
 */
export function buildCharacter(
  color = 0x3858a8,
  skinToneOverride?: number,
  hairColor?: number,
  isPlayer = false
): THREE.Group {
  const group = new THREE.Group();

  const skinTones = [0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524, 0xffdbac, 0xd4a574];
  const skin = skinToneOverride ?? skinTones[Math.floor(Math.random() * skinTones.length)];
  const skinDarkHex = Math.floor(new THREE.Color(skin).multiplyScalar(0.82).getHex());

  const skinMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.75 });
  const skinDarkMat = new THREE.MeshStandardMaterial({ color: skinDarkHex, roughness: 0.8 });
  const hairMat = getMat(hairColor ?? 0x1a0e06, 0.9, 0.0);
  const shirtMat = getMat(color, 0.75, 0.05);
  const pantsMat = getMat(0x1e2040, 0.85, 0.05);
  const shoeMat = getMat(0x1a1008, 0.9, 0.05);
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf5f0ea, roughness: 0.4 });
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x3a200a, roughness: 0.3 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });

  // ── FEET (boots) — ONE PAIR ──
  const makeBoots = (xOffset: number) => {
    const boot = new THREE.Group();
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.42), shoeMat);
    sole.position.set(0, 0.04, 0.04);
    boot.add(sole);
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.16, 0.36), shoeMat);
    upper.position.set(0, 0.14, 0.02);
    boot.add(upper);
    const toe = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.10, 0.12), shoeMat);
    toe.position.set(0, 0.10, 0.22);
    boot.add(toe);
    boot.position.set(xOffset, 0.08, 0);
    return boot;
  };

  group.add(makeBoots(-0.13)); // left boot
  group.add(makeBoots(0.13));  // right boot

  // ── LEGS — ONE PAIR (left + right) ──
  const makeLeg = (xOffset: number) => {
    const leg = new THREE.Group();
    // shin
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.085, 0.54, 10), pantsMat);
    shin.position.y = 0.27;
    leg.add(shin);
    // knee
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), pantsMat);
    knee.position.y = 0.54;
    knee.scale.set(1, 0.75, 1);
    leg.add(knee);
    // thigh
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.115, 0.58, 10), pantsMat);
    thigh.position.y = 0.85;
    leg.add(thigh);
    leg.position.set(xOffset, 0.08, 0);
    return leg;
  };

  group.add(makeLeg(-0.13)); // left leg
  group.add(makeLeg(0.13));  // right leg

  // ── HIPS ──
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.20, 0.22, 12), pantsMat);
  hips.position.y = 1.42;
  group.add(hips);

  // ── TORSO (single torso, no duplicates) ──
  const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.26, 0.30, 12), shirtMat);
  abdomen.position.y = 1.72;
  group.add(abdomen);

  const midTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.23, 0.32, 12), shirtMat);
  midTorso.position.y = 2.02;
  group.add(midTorso);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.26, 0.34, 12), shirtMat);
  chest.position.y = 2.35;
  group.add(chest);

  // ── SHOULDERS — exactly 2 ──
  [-1, 1].forEach(sx => {
    const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.155, 10, 8), shirtMat);
    deltoid.scale.set(1, 1.1, 0.9);
    deltoid.position.set(sx * 0.36, 2.38, 0);
    group.add(deltoid);
  });

  // ── ARMS — ONE PAIR (left + right only) ──
  const makeArm = (xOffset: number, zRot: number) => {
    const arm = new THREE.Group();
    // bicep
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.095, 0.48, 10), shirtMat);
    bicep.position.y = -0.24;
    arm.add(bicep);
    // elbow
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 6), shirtMat);
    elbow.position.y = -0.50;
    elbow.scale.set(1, 0.8, 1);
    arm.add(elbow);
    // forearm
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.42, 10), skinMat);
    forearm.position.y = -0.83;
    arm.add(forearm);
    // wrist
    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.10, 8), skinMat);
    wrist.position.y = -1.09;
    arm.add(wrist);
    // palm
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.07), skinMat);
    palm.position.y = -1.22;
    arm.add(palm);
    // fingers (one set per hand)
    const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.10, 0.055), skinDarkMat);
    fingers.position.y = -1.34;
    arm.add(fingers);
    // thumb
    const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.055), skinMat);
    thumb.position.set(xOffset > 0 ? 0.07 : -0.07, -1.22, 0);
    thumb.rotation.z = xOffset > 0 ? -0.5 : 0.5;
    arm.add(thumb);

    arm.position.set(xOffset, 2.42, 0);
    arm.rotation.z = zRot;
    return arm;
  };

  group.add(makeArm(-0.44, 0.06));  // left arm only
  group.add(makeArm(0.44, -0.06));  // right arm only

  // ── NECK — one neck ──
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.115, 0.26, 10), skinMat);
  neck.position.y = 2.72;
  group.add(neck);

  // ── HEAD — one head ──
  const headGroup = new THREE.Group();
  headGroup.position.y = 3.06;

  // cranium
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), skinMat);
  cranium.scale.set(1, 1.08, 0.95);
  headGroup.add(cranium);

  // cheekbones
  [-0.18, 0.18].forEach(cx => {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), skinMat);
    cheek.scale.set(1, 0.65, 0.8);
    cheek.position.set(cx, -0.04, 0.19);
    headGroup.add(cheek);
  });

  // jaw + chin
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.55), skinMat);
  jaw.position.y = -0.09;
  headGroup.add(jaw);
  const chin = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 6), skinMat);
  chin.scale.set(0.9, 0.65, 0.85);
  chin.position.set(0, -0.28, 0.14);
  headGroup.add(chin);

  // ears — exactly 2
  [-1, 1].forEach(ex => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 6), skinMat);
    ear.scale.set(0.55, 1, 0.7);
    ear.position.set(ex * 0.29, 0.02, 0);
    headGroup.add(ear);
  });

  // eyes — exactly 2
  [-0.105, 0.105].forEach(ex => {
    const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), eyeWhite);
    eyeball.position.set(ex, 0.062, 0.261);
    headGroup.add(eyeball);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), irisMat);
    iris.position.set(ex, 0.062, 0.272);
    headGroup.add(iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 4), pupilMat);
    pupil.position.set(ex, 0.062, 0.278);
    headGroup.add(pupil);
    // eyelid
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.054, 10, 5, 0, Math.PI * 2, 0, Math.PI * 0.5), skinMat);
    lid.position.set(ex, 0.075, 0.258);
    lid.rotation.x = 0.3;
    headGroup.add(lid);
    // eyebrow
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.018, 0.025), hairMat);
    brow.position.set(ex, 0.138, 0.248);
    brow.rotation.x = -0.2;
    brow.rotation.z = ex < 0 ? 0.12 : -0.12;
    headGroup.add(brow);
  });

  // nose
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.10, 0.04), skinMat);
  bridge.position.set(0, 0.01, 0.268);
  headGroup.add(bridge);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 6), skinMat);
  tip.scale.set(1, 0.8, 0.9);
  tip.position.set(0, -0.055, 0.285);
  headGroup.add(tip);

  // mouth
  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.028, 0.03), skinMat);
  upperLip.position.set(0, -0.115, 0.272);
  headGroup.add(upperLip);
  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.032, 0.035), skinMat);
  lowerLip.position.set(0, -0.145, 0.270);
  headGroup.add(lowerLip);

  // hair cap
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.295, 14, 10), hairMat);
  hairCap.scale.set(1, 0.82, 0.98);
  hairCap.position.y = 0.08;
  headGroup.add(hairCap);

  group.add(headGroup);

  // ground shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.38, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.30, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // animation refs
  const legs = group.children.filter((_, i) => i >= 2 && i <= 3) as THREE.Group[];
  const arms = group.children.filter((_, i) => i >= 9 && i <= 10) as THREE.Group[];

  group.userData = {
    legL: legs[0], legR: legs[1],
    armL: arms[0], armR: arms[1],
    headGroup,
    isPlayer
  };

  return group;
}

/** Deekshith — slim Indian build, blazer, glasses */
export function buildDeekshithCharacter(): THREE.Group {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc8956c, roughness: 0.72 });
  const skinDarkMat = new THREE.MeshStandardMaterial({ color: 0xb07850, roughness: 0.80 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x0a0806, roughness: 0.85 });
  const blazerMat = new THREE.MeshStandardMaterial({ color: 0x3a6090, roughness: 0.7 });
  const blazerDark = new THREE.MeshStandardMaterial({ color: 0x2a4a70, roughness: 0.8 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x141420, roughness: 0.85 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0a0808, roughness: 0.9 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2, metalness: 0.8 });
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf5f0ea, roughness: 0.4 });
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x2a1505, roughness: 0.3 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });

  // ── FEET — ONE PAIR ──
  [-0.12, 0.12].forEach(x => {
    const boot = new THREE.Group();
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.08, 0.40), shoeMat);
    sole.position.set(0, 0.04, 0.03);
    boot.add(sole);
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.34), shoeMat);
    upper.position.set(0, 0.13, 0.02);
    boot.add(upper);
    boot.position.set(x, 0.08, 0);
    group.add(boot);
  });

  // ── LEGS — ONE PAIR ──
  [-0.12, 0.12].forEach(x => {
    const leg = new THREE.Group();
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.078, 0.52, 10), pantsMat);
    shin.position.y = 0.26;
    leg.add(shin);
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.105, 8, 6), pantsMat);
    knee.position.y = 0.52;
    knee.scale.set(1, 0.75, 1);
    leg.add(knee);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.100, 0.56, 10), pantsMat);
    thigh.position.y = 0.82;
    leg.add(thigh);
    leg.position.set(x, 0.08, 0);
    group.add(leg);
  });

  // ── HIPS ──
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.20, 12), pantsMat);
  hips.position.y = 1.36;
  group.add(hips);

  // ── TORSO — blazer ──
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.95, 12), blazerMat);
  torso.position.y = 1.90;
  group.add(torso);

  // lapels
  [-1, 1].forEach(lx => {
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.28, 0.06), blazerMat);
    lapel.position.set(lx * 0.09, 2.22, 0.21);
    lapel.rotation.z = lx * 0.35;
    lapel.rotation.x = -0.4;
    group.add(lapel);
  });

  // ── SHOULDERS — exactly 2 ──
  [-1, 1].forEach(sx => {
    const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.145, 10, 8), blazerMat);
    deltoid.scale.set(1, 1.05, 0.90);
    deltoid.position.set(sx * 0.33, 2.35, 0);
    group.add(deltoid);
  });

  // ── ARMS — ONE PAIR ONLY ──
  [-0.39, 0.39].forEach((x, i) => {
    const arm = new THREE.Group();
    const sx = i === 0 ? -1 : 1;

    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.46, 10), blazerMat);
    bicep.position.y = -0.23;
    arm.add(bicep);
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.092, 8, 6), blazerMat);
    elbow.scale.set(1, 0.78, 1);
    elbow.position.y = -0.48;
    arm.add(elbow);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.06, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }));
    cuff.position.y = -0.56;
    arm.add(cuff);
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.062, 0.38, 10), skinMat);
    forearm.position.y = -0.79;
    arm.add(forearm);
    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.058, 0.08, 8), skinMat);
    wrist.position.y = -1.00;
    arm.add(wrist);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.14, 0.06), skinMat);
    palm.position.y = -1.12;
    arm.add(palm);
    const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.09, 0.05), skinDarkMat);
    fingers.position.y = -1.23;
    arm.add(fingers);
    const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 0.05), skinMat);
    thumb.position.set(sx * 0.07, -1.10, 0);
    thumb.rotation.z = -sx * 0.5;
    arm.add(thumb);

    arm.position.set(x, 2.40, 0);
    arm.rotation.z = -sx * 0.05;
    group.add(arm);
  });

  // ── NECK — one ──
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.098, 0.24, 10), skinMat);
  neck.position.y = 2.66;
  group.add(neck);

  // ── HEAD — one ──
  const headGroup = new THREE.Group();
  headGroup.position.y = 2.98;

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 14), skinMat);
  cranium.scale.set(0.92, 1.08, 0.96);
  headGroup.add(cranium);

  // cheekbones
  [-0.14, 0.14].forEach(cx => {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), skinMat);
    cheek.scale.set(1, 0.60, 0.75);
    cheek.position.set(cx, -0.02, 0.17);
    headGroup.add(cheek);
  });

  // jaw
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.55), skinMat);
  jaw.position.y = -0.07;
  headGroup.add(jaw);
  const chin = new THREE.Mesh(new THREE.SphereGeometry(0.082, 8, 6), skinMat);
  chin.scale.set(0.85, 0.60, 0.82);
  chin.position.set(0, -0.24, 0.12);
  headGroup.add(chin);

  // ears — exactly 2
  [-1, 1].forEach(ex => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), skinMat);
    ear.scale.set(0.50, 0.90, 0.65);
    ear.position.set(ex * 0.25, 0.01, 0);
    headGroup.add(ear);
  });

  // eyes — exactly 2
  [-0.085, 0.085].forEach(ex => {
    const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.043, 10, 8), eyeWhite);
    eyeball.position.set(ex, 0.052, 0.222);
    headGroup.add(eyeball);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), irisMat);
    iris.position.set(ex, 0.052, 0.232);
    headGroup.add(iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 4), pupilMat);
    pupil.position.set(ex, 0.052, 0.237);
    headGroup.add(pupil);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 5, 0, Math.PI * 2, 0, Math.PI * 0.48), skinMat);
    lid.position.set(ex, 0.062, 0.218);
    lid.rotation.x = 0.28;
    headGroup.add(lid);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.016, 0.022),
      new THREE.MeshStandardMaterial({ color: 0x0a0806, roughness: 0.9 }));
    brow.position.set(ex, 0.112, 0.210);
    brow.rotation.x = -0.18;
    brow.rotation.z = ex < 0 ? 0.10 : -0.10;
    headGroup.add(brow);
  });

  // glasses
  const bridgeBar = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.06, 6), glassMat);
  bridgeBar.rotation.z = Math.PI / 2;
  bridgeBar.position.set(0, 0.068, 0.220);
  headGroup.add(bridgeBar);
  [-0.090, 0.090].forEach(fx => {
    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.006, 4, 4), glassMat);
    frame.position.set(fx, 0.065, 0.218);
    frame.rotation.x = Math.PI / 2;
    frame.scale.set(1, 0.62, 1);
    headGroup.add(frame);
    const lensM = new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.25 });
    const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.048), lensM);
    lens.position.set(fx, 0.065, 0.219);
    headGroup.add(lens);
  });
  [-1, 1].forEach(tx => {
    const temple = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.22, 5), glassMat);
    temple.rotation.z = Math.PI / 2;
    temple.rotation.y = tx * 0.15;
    temple.position.set(tx * 0.198, 0.065, 0.175);
    headGroup.add(temple);
  });

  // nose
  const noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.08, 0.032), skinMat);
  noseBridge.position.set(0, 0.014, 0.226);
  headGroup.add(noseBridge);
  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.030, 8, 6), skinMat);
  noseTip.scale.set(1, 0.78, 0.88);
  noseTip.position.set(0, -0.044, 0.238);
  headGroup.add(noseTip);

  // lips
  const uLip = new THREE.Mesh(new THREE.BoxGeometry(0.094, 0.022, 0.025),
    new THREE.MeshStandardMaterial({ color: 0xb07858, roughness: 0.65 }));
  uLip.position.set(0, -0.095, 0.228);
  headGroup.add(uLip);
  const lLip = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.026, 0.028), skinMat);
  lLip.position.set(0, -0.120, 0.225);
  headGroup.add(lLip);

  // hair
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.262, 16, 12), hairMat);
  hairCap.scale.set(0.92, 0.80, 0.97);
  hairCap.position.y = 0.08;
  headGroup.add(hairCap);
  const sweepR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.18), hairMat);
  sweepR.position.set(0.12, 0.14, 0.05);
  sweepR.rotation.z = -0.25;
  headGroup.add(sweepR);
  const frontSweep = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.08, 0.10), hairMat);
  frontSweep.position.set(0.04, 0.12, 0.18);
  frontSweep.rotation.x = -0.55;
  headGroup.add(frontSweep);

  group.add(headGroup);

  // shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.35, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // get arm refs for animation (arms are at indices 8 and 9 in group)
  const armL = group.children[8] as THREE.Group;
  const armR = group.children[9] as THREE.Group;
  const legL = group.children[2] as THREE.Group;
  const legR = group.children[3] as THREE.Group;

  group.userData = { legL, legR, armL, armR, headGroup, isPlayer: true };
  return group;
}

/** MINNIE — cyan-themed AI character matching reference: normal human, pink-ish hair */
export function buildMINNIECharacter(): THREE.Group {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf2d5b5, roughness: 0.72 });
  const skinDarkMat = new THREE.MeshStandardMaterial({ color: 0xd4b090, roughness: 0.80 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0xe06080, roughness: 0.8, metalness: 0.05 }); // pink-red hair like reference
  const suitMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.1 }); // white suit
  const armorMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.3, metalness: 0.7 }); // dark armor straps
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.7 });
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.5, metalness: 0.5 });
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const irisMat = new THREE.MeshStandardMaterial({ color: 0xc07830, roughness: 0.2 }); // amber eyes like reference

  // ── FEET — ONE PAIR ──
  [-0.12, 0.12].forEach(x => {
    const boot = new THREE.Group();
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.08, 0.38), bootMat);
    sole.position.set(0, 0.04, 0.02);
    boot.add(sole);
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.32), bootMat);
    upper.position.set(0, 0.15, 0.01);
    boot.add(upper);
    boot.position.set(x, 0.08, 0);
    group.add(boot);
  });

  // ── LEGS — ONE PAIR ──
  [-0.12, 0.12].forEach(x => {
    const leg = new THREE.Group();
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.072, 0.50, 10), pantsMat);
    shin.position.y = 0.25;
    leg.add(shin);
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 6), pantsMat);
    knee.position.y = 0.50;
    knee.scale.set(1, 0.75, 1);
    leg.add(knee);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.095, 0.54, 10), pantsMat);
    thigh.position.y = 0.79;
    leg.add(thigh);
    leg.position.set(x, 0.08, 0);
    group.add(leg);
  });

  // ── HIPS ──
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.17, 0.20, 12), pantsMat);
  hips.position.y = 1.34;
  group.add(hips);

  // ── TORSO ──
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.21, 0.90, 12), suitMat);
  torso.position.y = 1.87;
  group.add(torso);

  // chest armor strap
  const chestArmor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.30, 0.08), armorMat);
  chestArmor.position.set(0, 2.15, 0.20);
  group.add(chestArmor);

  // ── SHOULDERS — exactly 2 ──
  [-1, 1].forEach(sx => {
    const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.138, 10, 8), suitMat);
    deltoid.scale.set(1, 1.05, 0.90);
    deltoid.position.set(sx * 0.30, 2.33, 0);
    group.add(deltoid);
  });

  // ── ARMS — ONE PAIR ONLY ──
  [-0.37, 0.37].forEach((x, i) => {
    const arm = new THREE.Group();
    const sx = i === 0 ? -1 : 1;

    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.090, 0.080, 0.44, 10), suitMat);
    bicep.position.y = -0.22;
    arm.add(bicep);
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 6), suitMat);
    elbow.scale.set(1, 0.78, 1);
    elbow.position.y = -0.46;
    arm.add(elbow);
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.065, 0.40, 10), skinMat);
    forearm.position.y = -0.77;
    arm.add(forearm);
    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.060, 0.08, 8), skinMat);
    wrist.position.y = -0.98;
    arm.add(wrist);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.06), skinMat);
    palm.position.y = -1.10;
    arm.add(palm);
    const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.05), skinDarkMat);
    fingers.position.y = -1.21;
    arm.add(fingers);
    const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 0.05), skinMat);
    thumb.position.set(sx * 0.07, -1.09, 0);
    thumb.rotation.z = -sx * 0.5;
    arm.add(thumb);

    arm.position.set(x, 2.38, 0);
    arm.rotation.z = -sx * 0.05;
    group.add(arm);
  });

  // ── NECK — one ──
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.080, 0.095, 0.22, 10), skinMat);
  neck.position.y = 2.63;
  group.add(neck);

  // neck scarf (pink, like reference)
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.04, 8, 24), hairMat);
  scarf.position.y = 2.60;
  scarf.rotation.x = 0.3;
  group.add(scarf);

  // ── HEAD — one ──
  const headGroup = new THREE.Group();
  headGroup.position.y = 2.94;

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), skinMat);
  cranium.scale.set(0.94, 1.06, 0.96);
  headGroup.add(cranium);

  // softer feminine jaw
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8, 0, Math.PI * 2, Math.PI * 0.50, Math.PI * 0.52), skinMat);
  jaw.position.y = -0.06;
  headGroup.add(jaw);
  const chin = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), skinMat);
  chin.scale.set(0.8, 0.55, 0.80);
  chin.position.set(0, -0.22, 0.13);
  headGroup.add(chin);

  // ears — exactly 2
  [-1, 1].forEach(ex => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), skinMat);
    ear.scale.set(0.50, 0.90, 0.65);
    ear.position.set(ex * 0.24, 0.01, 0);
    headGroup.add(ear);
  });

  // eyes — exactly 2 (larger, more expressive like reference)
  [-0.085, 0.085].forEach(ex => {
    const socket = new THREE.Mesh(new THREE.SphereGeometry(0.060, 10, 8), skinMat);
    socket.scale.set(1.05, 0.88, 0.35);
    socket.position.set(ex, 0.06, 0.22);
    headGroup.add(socket);
    const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.050, 10, 8), eyeWhite);
    eyeball.position.set(ex, 0.062, 0.228);
    headGroup.add(eyeball);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), irisMat);
    iris.position.set(ex, 0.062, 0.238);
    headGroup.add(iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.017, 6, 4),
      new THREE.MeshStandardMaterial({ color: 0x050505 }));
    pupil.position.set(ex, 0.062, 0.244);
    headGroup.add(pupil);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.008, 4, 4),
      new THREE.MeshStandardMaterial({ color: 0xffffff }));
    shine.position.set(ex + 0.012, 0.074, 0.247);
    headGroup.add(shine);
    // eyelid (feminine, slightly thicker)
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 5, 0, Math.PI * 2, 0, Math.PI * 0.48), skinMat);
    lid.position.set(ex, 0.072, 0.224);
    lid.rotation.x = 0.25;
    headGroup.add(lid);
    // eyebrow (softer arch)
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.080, 0.015, 0.020),
      new THREE.MeshStandardMaterial({ color: 0xcc4060, roughness: 0.8 }));
    brow.position.set(ex, 0.118, 0.214);
    brow.rotation.x = -0.15;
    brow.rotation.z = ex < 0 ? 0.15 : -0.15;
    headGroup.add(brow);
  });

  // nose (small, delicate)
  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), skinMat);
  noseTip.scale.set(1, 0.7, 0.8);
  noseTip.position.set(0, -0.040, 0.232);
  headGroup.add(noseTip);

  // lips (fuller, pinkish)
  const lipMat = new THREE.MeshStandardMaterial({ color: 0xd06070, roughness: 0.5 });
  const uLip = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.026, 0.028), lipMat);
  uLip.position.set(0, -0.090, 0.224);
  headGroup.add(uLip);
  const lLip = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.030, 0.030), lipMat);
  lLip.position.set(0, -0.118, 0.222);
  headGroup.add(lLip);

  // HAIR — shoulder-length pink-red like reference image
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.255, 16, 12), hairMat);
  hairCap.scale.set(0.95, 0.82, 0.97);
  hairCap.position.y = 0.09;
  headGroup.add(hairCap);
  // side hair
  [-1, 1].forEach(sx => {
    const sideHair = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.40, 0.14), hairMat);
    sideHair.position.set(sx * 0.22, -0.10, 0.02);
    headGroup.add(sideHair);
  });
  // back hair (flowing down)
  const backHair = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.55, 0.10), hairMat);
  backHair.position.set(0, -0.16, -0.18);
  headGroup.add(backHair);
  // front fringe
  const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.10), hairMat);
  fringe.position.set(0, 0.13, 0.18);
  fringe.rotation.x = -0.45;
  headGroup.add(fringe);

  group.add(headGroup);

  // glowing AI aura
  const auraGeo = new THREE.SphereGeometry(0.7, 12, 10);
  const auraMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.35,
    transparent: true, opacity: 0.12, depthWrite: false, side: THREE.BackSide
  });
  group.add(new THREE.Mesh(auraGeo, auraMat));

  // glowing ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.65, 0.04, 8, 32),
    new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.2, transparent: true, opacity: 0.8 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.08;
  group.add(ring);
  group.userData.aiRing = ring;

  // shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.35, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  const armL = group.children[8] as THREE.Group;
  const armR = group.children[9] as THREE.Group;
  const legL = group.children[2] as THREE.Group;
  const legR = group.children[3] as THREE.Group;
  group.userData = { legL, legR, armL, armR, headGroup, isPlayer: false, isMinnie: true };

  return group;
}
