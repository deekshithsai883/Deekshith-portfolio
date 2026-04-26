import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useCallback } from 'react';

interface NPC {
  id: string; name: string; color: number; zone: string;
  pos: [number, number, number];
  lines: Array<{ s: string; t: string }>;
  isAI?: boolean;
}
interface Zone {
  name: string; xMin: number; xMax: number; zMin: number; zMax: number;
  fogColor: number; skyColor: number; light: number;
}

const NPCS_DATA: NPC[] = [
  { id:'mom', name:'MOM', color:0xc83050, zone:'HOMETOWN', pos:[6,0,6], lines:[
    {s:'MOM', t:"Deekshith was born on August 24th, 2002 at Sagarlal Hospital, Hyderabad. He grew up in Boudhanagar. His father left when he was 3, so I raised him with his grandparents and uncle."},
    {s:'MOM', t:"Even as a toddler he understood trigonometry. He was a chess prodigy, cricket lover, and always asking why things work the way they do. That curiosity never left him."}
  ]},
  { id:'youngd', name:'YOUNG DEE', color:0x3858a8, zone:'HOMETOWN', pos:[18,0,9], lines:[
    {s:'YOUNG DEE', t:"I suffered a severe head injury as a kid and was in a coma for a year. It affected my long-term memory  but my short-term memory stayed sharp. I adapted and kept going."},
    {s:'YOUNG DEE', t:"I scored 91% in 10th boards, 87% in 12th, and 97 percentile in JEE Mains. I could have taken the safe path. Instead I chose to build things that matter."}
  ]},
  { id:'nb', name:'GRANDFATHER', color:0x308050, zone:'HOMETOWN', pos:[9,0,20], lines:[
    {s:'GRANDFATHER', t:"He won science fairs, gave speeches on annual days, and led clubs. In 9th grade his team placed All India #2 in the national science fair  Vignana Mela. Always competed, always led."}
  ]},
  { id:'prof', name:'PROFESSOR', color:0x6030a0, zone:'THE ACADEMY', pos:[55,0,8], lines:[
    {s:'PROFESSOR', t:"Deekshith joined GITAM for CSE, then transferred to JNTUH Manthani for B.Tech in CSE-AIML. His first year CGPA was 7.2. He took detours  but always came back with more to show."},
    {s:'PROFESSOR', t:"His final year project: Restoration of Manuscripts using GANs  a 7-layered architecture that fully restores ancient manuscripts to their original form."}
  ]},
  { id:'classm', name:'CLASSMATE', color:0x208080, zone:'THE ACADEMY', pos:[65,0,15], lines:[
    {s:'CLASSMATE', t:"In 2nd year he joined Winzera Pvt. Ltd. as a Business Associate. Did 10,000 one-on-one presentations across India. Built a team of 220 people. Spoke at national conferences. Then came back to college with 22 backlogs."},
    {s:'CLASSMATE', t:"He cleared all but 2 backlogs within a year. Nobody else I know could have done that  run a nationwide sales operation and then just... refocus and grind through the academics."}
  ]},
  { id:'code', name:'THE CODE', color:0x30a050, zone:'TECH FOREST', pos:[88,0,8], lines:[
    {s:'THE CODE', t:"Languages: C, C++, Python, C#. Query: SQL, PostgreSQL, MongoDB. Tools: VSCode, Jupyter, Power BI, Tableau, MS Office, GitHub, GitLab. Currently learning C# and C++ for game development."},
    {s:'THE CODE', t:"His final year manuscript restoration project uses a custom 7-layer GAN architecture. IEEE-published ADAS research in autonomous driving. Real systems, not demos."}
  ]},
  { id:'tools', name:'THE TOOLS', color:0xc07020, zone:'TECH FOREST', pos:[98,0,18], lines:[
    {s:'THE TOOLS', t:"Football match outcome prediction using Random Forest, XGBoost, Ensemble Learning  deployed via Flask API. Sales analysis with MySQL + Power BI. Employee analysis with Excel pivot tables."},
    {s:'THE TOOLS', t:"SQL project analyzing regional sales profitability. Power BI dashboards tracking KPIs. Python for data cleaning, EDA, predictive modeling. The full analytics stack, end to end."}
  ]},
  { id:'proj1', name:'PROJECT LOG', color:0xc07020, zone:'PROJECT RUINS', pos:[8,0,55], lines:[
    {s:'NIRVEONX', t:"NirveonX Omnicare Pvt. Ltd.  founded February 2025, registered June 2025. Grew LinkedIn from 0 to 1400 followers. ~200 interns total. Incubated at FTBI, NIT Rourkela."},
    {s:'NIRVEONX', t:"Pitched to multiple investors. They loved the idea but rejected at pre-seed stage. Built MVPs from scratch with zero cost. Full company structure: NDA, OL, CoC, LOR, support mail, organized teams. People who worked with us got placed in real companies."}
  ]},
  { id:'proj2', name:'PROJECT LOG', color:0x3858a8, zone:'PROJECT RUINS', pos:[22,0,60], lines:[
    {s:'TRIARIGHT', t:"Business Analyst / Data Analyst Intern at TriaRight Solutions LLP  Jan to Feb 2025, onsite Hyderabad. Strategic planning, business requirements gathering, data analysis. Resigned after 2 months."},
    {s:'FURNO', t:"Founder's Office Intern at FURNO.AI  Feb to Mar 2025, remote. Team coordination, business strategy, technical projects. Resigned as personal goals didn't align."}
  ]},
  { id:'proj3', name:'PROJECT LOG', color:0x208080, zone:'PROJECT RUINS', pos:[30,0,65], lines:[
    {s:'DATA WORK', t:"Sales Analysis: MySQL + CSV/Excel + Power BI. Sales trends, customer insights, product analysis, geographic hotspots. Employee Analysis: Excel pivot tables, gender diversity, workforce dynamics."},
    {s:'DATA WORK', t:"Football Data Analysis: Python ML pipeline predicting match outcomes  Win, Loss, Draw. Goals, shots, possession, fouls as key features. Flask API deployment for real-time predictions."}
  ]},
  { id:'shadow', name:'THE SHADOW', color:0x6030a0, zone:'INNER SANCTUM', pos:[58,0,55], lines:[
    {s:'THE SHADOW', t:"He got 22 backlogs while building a 220-person sales team. Was detained for a year. Resigned from two internships. Left his own startup. These aren't failures  they're pivots made with full awareness."},
    {s:'THE SHADOW', t:"What frustrates him: motion without meaning. Meetings that should be emails. Busy work dressed as progress. He moves when there's a real reason to move."}
  ]},
  { id:'inner', name:'INNER DEE', color:0xc07020, zone:'INNER SANCTUM', pos:[68,0,65], lines:[
    {s:'INNER DEE', t:"I think in systems. I find the invisible structure behind complex things and make them feel simple. Whether it's a 220-person team, a GAN architecture, or a Power BI dashboard  I build the spine first."},
    {s:'INNER DEE', t:"I communicate in English, Telugu, and Hindi. I've led teams, gathered requirements, negotiated deals B2B and B2C. I'm not just a coder or just an analyst  I'm the person who connects both."}
  ]},
  { id:'oracle', name:'THE ORACLE', color:0x8030c0, zone:'FUTURE PEAK', pos:[92,0,58], lines:[
    {s:'THE ORACLE', t:"He's open to: Data Analyst, Business Analyst, Founder's Office, .NET Dev, C++ Dev, ML Developer, Project Manager, Business Development Manager, SQL Developer. Final year, 7 CGPA aggregate, JNTUH CSE-AIML."},
    {s:'THE ORACLE', t:"The vision: someone who thinks like a founder, builds like an engineer, and communicates like a leader. He's already done all three  separately. Now he wants to do them together."}
  ]},
  { id:'future', name:'FUTURE DEE', color:0xc9a84c, zone:'FUTURE PEAK', pos:[105,0,65], lines:[
    {s:'FUTURE DEE', t:"If you've walked this far, you know the story. Hyderabad kid. Coma survivor. JEE 97 percentile. 10,000 sales presentations. 220-person team. Startup founder. GAN researcher. Now game developer."},
    {s:'FUTURE DEE', t:"LinkedIn: linkedin.com/in/kavali-deekshith-1bb84728b\nGitHub: github.com/deekshithsai883\nLocation: Khairatabad, Hyderabad 500004\n\nLet's talk if you're building something real."}
  ]},
   { id:'placement', name:'RECRUITER', color:0xf0a020, zone:'FUTURE PEAK', pos:[95,0,70], lines:[
    {s:'RECRUITER', t:"Deekshith was selected and placed at Gowra Bits & Bytes Pvt. Ltd. with a 12 LPA package. The offer came through during his final year at JNTUH Manthani. It's a strong close to the academic chapter."},
    {s:'RECRUITER', t:"Data Analyst profile. The foundation he built with SQL, Power BI, Python, and business analysis landed it. Real skills, real outcome."}
  ]},
  { id:'ainpc', name:'MINNIE · AI', color:0x00e5ff, zone:'AI NEXUS', isAI:true, pos:[58,0,100], lines:[
    {s:'MINNIE', t:"Hey! I'm Minnie 💙 I know everything about Deekshith:  his story, skills, projects, and goals. Ask me anything!"}
  ]},
];

const ZONES_DATA: Zone[] = [
  { name:'HOMETOWN',      xMin:0,  xMax:35,  zMin:0,  zMax:35,  fogColor:0x87ceeb, skyColor:0x87ceeb, light:0xffd580 },
  { name:'THE ACADEMY',   xMin:45, xMax:80,  zMin:0,  zMax:35,  fogColor:0xc8d8ff, skyColor:0xc8d8ff, light:0xaaaaff },
  { name:'TECH FOREST',   xMin:82, xMax:115, zMin:0,  zMax:35,  fogColor:0xaaffcc, skyColor:0xaaffcc, light:0x40ff80 },
  { name:'PROJECT RUINS', xMin:0,  xMax:40,  zMin:45, zMax:80,  fogColor:0xffd8b0, skyColor:0xffd8b0, light:0xff9040 },
  { name:'INNER SANCTUM', xMin:48, xMax:80,  zMin:45, zMax:80,  fogColor:0xe0c8ff, skyColor:0xe0c8ff, light:0xd080ff },
  { name:'FUTURE PEAK',   xMin:82, xMax:115, zMin:48, zMax:85,  fogColor:0xb0d8ff, skyColor:0xb0d8ff, light:0x60aaff },
  { name:'AI NEXUS',      xMin:42, xMax:78,  zMin:87, zMax:115, fogColor:0xc8f8ff, skyColor:0xc8f8ff, light:0x00e5ff },
];

// ─── Precise scale & ground offset for NewWalking-compressed.glb ───────────
// Bone-space analysis: total character height span = 166.87 FBX units
// scale=0.012 → character height = 2.0 Three.js units (right for this world)
// foot Y in bone-space ≈ -94.26 → at scale 0.012: -1.131 below origin
// So mesh must be lifted by +1.131 to stand on Y=0 ground
  // lifts feet to ground level

const GamePage: NextPage = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef  = useRef<{ cleanup: () => void } | null>(null);
  const initGame = useCallback(async () => {
    if (!mountRef.current) return;

    const THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { FBXLoader }  = await import('three/examples/jsm/loaders/FBXLoader.js');

    const container = mountRef.current;

    const loadScreen    = document.getElementById('loadScreen')!;
    const loadBar       = document.getElementById('loadBar') as HTMLDivElement;
    const titleScreen   = document.getElementById('titleScreen')!;
    const startBtn      = document.getElementById('startBtn')!;
    const hud           = document.getElementById('hud')!;
    const zoneLabelEl   = document.getElementById('zoneLabel')!;
    const foundLabelEl  = document.getElementById('foundLabel')!;
    const notifEl       = document.getElementById('notif')!;
    const interactEl    = document.getElementById('interact')!;
    const dlgEl         = document.getElementById('dlg')!;
    const dlgFaceCanvas = document.getElementById('dlgFaceCanvas') as HTMLCanvasElement;
    const faceCX        = dlgFaceCanvas.getContext('2d')!;
    const dlgName       = document.getElementById('dlgName')!;
    const dlgText       = document.getElementById('dlgText')!;
    const dlgPage       = document.getElementById('dlgPage')!;
    const dlgCont       = document.getElementById('dlgCont')!;
    const minimapWrap   = document.getElementById('minimapWrap')!;
    const minimapCanvas = document.getElementById('minimap') as HTMLCanvasElement;
    const mmCX          = minimapCanvas.getContext('2d')!;
    const controlsHint  = document.getElementById('controlsHint')!;
    const dpad          = document.getElementById('dpad')!;
    const aBtn          = document.getElementById('aBtn')!;
    const flashEl       = document.getElementById('flash')!;
    const musicBtn      = document.getElementById('musicBtn')!;
    const voiceBtn      = document.getElementById('voiceBtn')!;
    const aiInputWrap   = document.getElementById('aiInputWrap')!;
    const aiHistoryEl   = document.getElementById('aiHistory')!;
    const aiUserInput   = document.getElementById('aiUserInput') as HTMLInputElement;
    const aiSendBtn     = document.getElementById('aiSendBtn') as HTMLButtonElement;
    const aiCloseBtn    = document.getElementById('aiCloseBtn')!;

    let gameRunning = false;
    const setLoad = (p: number) => { loadBar.style.width = p + '%'; };
    setLoad(5);

    // ── Renderer ──────────────────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:1';
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87ceeb, 40, 160);
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 380);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    setLoad(10);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff8f0, 1.8));
    const sun = new THREE.DirectionalLight(0xfff5d0, 2.4);
    sun.position.set(30, 60, 20); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -80; sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80; sun.shadow.camera.bottom = -80;
    sun.shadow.bias = -0.001; scene.add(sun);
    const fill = new THREE.DirectionalLight(0xaad4ff, 0.9);
    fill.position.set(-20, 15, -10); scene.add(fill);
    const zoneLight = new THREE.PointLight(0xffd580, 1.4, 55);
    zoneLight.position.set(10, 5, 10); scene.add(zoneLight);

    // ── Materials helper ──────────────────────────────────────────────────────
    const matCache = new Map<string, THREE.MeshStandardMaterial>();
    const getMat = (color: number, rough = 0.7, metal = 0.05) => {
      const k = `${color}_${rough}_${metal}`;
      if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
      return matCache.get(k)!;
    };

    // ── Ground ────────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(new THREE.BoxGeometry(120, 0.5, 120), getMat(0x5cb85c, 0.9));
    ground.position.set(57, -0.25, 57); ground.receiveShadow = true; scene.add(ground);
    const zonePads: [number,number,number,number,number][] = [
      [17,17,35,35,0x7dd87d],[62,17,35,35,0xb0c4f8],[98,17,33,35,0x90e8b0],
      [20,62,40,35,0xf8d090],[64,62,32,35,0xd8b8ff],[98,66,33,37,0xb8d8ff],[60,101,36,28,0xb0f0ff],
    ];
    zonePads.forEach(([x,z,w,d,c]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w,0.08,d), getMat(c,0.9));
      m.position.set(x,0.01,z); m.receiveShadow=true; scene.add(m);
    });

    // ── Buildings ─────────────────────────────────────────────────────────────
    const makeBuilding = (x:number,z:number,w:number,d:number,h:number,wC:number,rC:number,gC:number) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), getMat(wC,0.7,0.05));
      wall.position.set(x,h/2,z); wall.castShadow=true; wall.receiveShadow=true; scene.add(wall);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w+0.4,0.4,d+0.4), getMat(rC,0.6,0.1));
      roof.position.set(x,h+0.2,z); scene.add(roof);
      const winM = new THREE.MeshStandardMaterial({color:gC,emissive:gC,emissiveIntensity:0.25,transparent:true,opacity:0.85});
      for(let i=0;i<Math.min(3,Math.floor(w/1.5));i++){
        const win=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.55,0.06),winM);
        win.position.set(x-w/2+0.9+i*1.3,h*0.6,z+d/2+0.06); scene.add(win);
      }
    };
    makeBuilding(8,14,8,7,4,0xf0e8a0,0xe05040,0xffd080);
    makeBuilding(20,8,10,8,5,0xf8c880,0xd06030,0xffee80);
    makeBuilding(52,14,14,10,8,0xd0d8f8,0x5060c0,0xd0e0ff);
    makeBuilding(70,10,8,7,6,0xc0c8f0,0x4050b0,0xb0c8ff);
    makeBuilding(86,14,8,7,6,0xb0f0d0,0x30a860,0xa0ffc8);
    makeBuilding(100,8,6,5,5,0xa8f8d8,0x28b870,0x80ffe0);
    makeBuilding(8,55,7,6,4,0xf8d0a0,0xd07030,0xffe090);
    makeBuilding(20,62,9,7,6,0xf8c090,0xc06020,0xffd070);
    makeBuilding(56,58,10,8,8,0xe8d0ff,0x8040c0,0xd080ff);
    makeBuilding(88,55,10,8,10,0xb0d0ff,0x3060d0,0x80b8ff);
    makeBuilding(100,62,7,6,8,0xa0c8ff,0x2050c0,0x60a0ff);
    makeBuilding(66,96,6,6,5,0xc0f8ff,0x00b8d8,0x60eeff);

    // AI Nexus  Gate pillars
const gateMat = new THREE.MeshStandardMaterial({
  color: 0x00cfff,
  emissive: 0x00aaee,
  emissiveIntensity: 0.6,
  transparent: true,
  opacity: 0.88,
  roughness: 0.2,
  metalness: 0.4,
});

[55, 63].forEach(px => {
  // Pillar
  const gate = new THREE.Mesh(
    new THREE.BoxGeometry(1, 13, 1),
    gateMat
  );
  gate.position.set(px, 6.5, 87);
  gate.castShadow = true;
  scene.add(gate);

  // Glowing cap sphere
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 6),
    gateMat
  );
  cap.position.set(px, 13.5, 87);
  scene.add(cap);

  // Point light per pillar for glow effect
  const gateLight = new THREE.PointLight(0x00cfff, 1.2, 12);
  gateLight.position.set(px, 10, 87);
  scene.add(gateLight);
});

// Horizontal crossbar connecting the two pillars
const crossbar = new THREE.Mesh(
  new THREE.BoxGeometry(9, 0.6, 0.6),
  gateMat
);
crossbar.position.set(59, 13.5, 87);
scene.add(crossbar);
    // ── Trees ─────────────────────────────────────────────────────────────────
    const makeTree=(x:number,z:number,type='normal')=>{
      const g=new THREE.Group();
      const lC=type==='tech'?[0x40e070,0x30c050]:type==='magic'?[0xd090ff,0xb060e8]:[0x4cbb4c,0x3a9a3a];
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.4,2.5,8),getMat(0x8b5e3c,0.9));
      trunk.position.y=1.25; g.add(trunk);
      [{r:1.8,y:2.5},{r:1.5,y:3.6},{r:1.0,y:4.6}].forEach(({r,y},i)=>{
        const l=new THREE.Mesh(new THREE.SphereGeometry(r,8,6),getMat(lC[i%2],0.85));l.position.y=y;g.add(l);
      });
      g.position.set(x,0,z);g.rotation.y=Math.random()*Math.PI*2;scene.add(g);
    };
    [[2,2],[28,2],[2,30],[28,30],[14,2]].forEach(([x,z])=>makeTree(x,z));
    for(let i=0;i<6;i++) makeTree(46+i*5,2,'magic');
    for(let i=0;i<10;i++) makeTree(82+Math.sin(i*2.1)*8+6,Math.cos(i*1.7)*12+18,'tech');
    for(let x=0;x<116;x+=12){makeTree(x,0);makeTree(x,84,'magic');}
    for(let z=0;z<116;z+=12){makeTree(0,z);makeTree(114,z);}

    // ── Particles ─────────────────────────────────────────────────────────────
    const pGeo=new THREE.BufferGeometry();
    const pPos=new Float32Array(300*3),pCol=new Float32Array(300*3);
    for(let i=0;i<300;i++){
      pPos[i*3]=Math.random()*116;pPos[i*3+1]=1+Math.random()*6;pPos[i*3+2]=Math.random()*116;
      const c=new THREE.Color().setHSL(0.05+Math.random()*0.5,1.0,0.75);
      pCol[i*3]=c.r;pCol[i*3+1]=c.g;pCol[i*3+2]=c.b;
    }
    pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
    pGeo.setAttribute('color',new THREE.BufferAttribute(pCol,3));
    const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.20,vertexColors:true,transparent:true,opacity:0.85,depthWrite:false}));
    scene.add(particles);

    setLoad(20);

    // ════════════════════════════════════════════════════════════════════════════
    // LOAD ANIMATION FILES
    // scale = 0.012, Y offset = +1.131 (feet on ground)
    // ════════════════════════════════════════════════════════════════════════════
    let walkTemplate: THREE.Group | null = null;
    let walkClip: THREE.AnimationClip | null = null;
    let idleTemplate: THREE.Group | null = null;
    let idleClip: THREE.AnimationClip | null = null;
    let briefcaseTemplate: THREE.Group | null = null;
    let briefcaseIdleClip: THREE.AnimationClip | null = null;

   const applyCharScale = (obj: THREE.Group) => {
  obj.scale.setScalar(0.09);   // Walking.glb = 22 units
  obj.position.y = 0.1;
};

const scaleFBX = (obj: THREE.Group) => {
  obj.scale.setScalar(0.0167); // FBX files = 180 units
  obj.position.y = 0.15;
};
    // Walking GLB (player walk)
  await new Promise<void>(resolve => {
  new GLTFLoader().load('/animations/Walking.glb', gltf => {
    walkTemplate = gltf.scene;
    walkTemplate.traverse(c => { if ((c as THREE.Mesh).isMesh) { c.castShadow=true; c.receiveShadow=true; } });
    if (gltf.animations.length > 0) walkClip = gltf.animations[0];
    setLoad(45); resolve();
  }, undefined, err => { console.warn('Walking.glb failed:', err); resolve(); });
});
    // Standing Idle FBX (NPCs)
   await new Promise<void>(resolve => {
  new FBXLoader().load('/animations/Standing_Idle.fbx', fbx => {
    idleTemplate = fbx;
    idleTemplate.traverse(c => { if ((c as THREE.Mesh).isMesh) { c.castShadow=true; c.receiveShadow=true; } });
    if (fbx.animations.length > 0) idleClip = fbx.animations[0];
    setLoad(65); resolve();
  }, undefined, err => { console.warn('Standing_Idle.fbx failed:', err); resolve(); });
});
    // Briefcase Idle FBX (player standing)
   
await new Promise<void>(resolve => {
  new FBXLoader().load('/animations/Standing_W_Briefcase_Idle.fbx', fbx => {
    briefcaseTemplate = fbx;
    briefcaseTemplate.traverse(c => { if ((c as THREE.Mesh).isMesh) { c.castShadow=true; c.receiveShadow=true; } });
    if (fbx.animations.length > 0) briefcaseIdleClip = fbx.animations[0];
    setLoad(80); resolve();
  }, undefined, err => { console.warn('Standing_W_Briefcase_Idle.fbx failed:', err); resolve(); });
});
   // ── Fallback procedural character ─────────────────────────────────────────
    const buildFallback = (color: number): THREE.Group => {
      const g = new THREE.Group();
      const skinM = getMat(0xe8b88a, 0.65);
      const shirtM = getMat(color, 0.65);
      const pantsM = getMat(0x2a3a5a, 0.8);
      const shoeM = getMat(0x1a1a1a, 0.85);
      const hairM = getMat(0x1a0c04, 0.9);

      [-0.13, 0.13].forEach(ox => {
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.09, 0.36), shoeM);
        shoe.position.set(ox, 0.045, 0.02); g.add(shoe);
      });
      [-0.13, 0.13].forEach(ox => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 1.10, 10), pantsM);
        leg.position.set(ox, 0.60, 0); g.add(leg);
      });
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.95, 10), shirtM);
      torso.position.set(0, 1.68, 0); g.add(torso);
      [-0.34, 0.34].forEach(ox => {
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.55, 8), shirtM);
        upper.position.set(ox, 1.72, 0); g.add(upper);
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.50, 8), skinM);
        lower.position.set(ox, 1.26, 0); g.add(lower);
      });
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.10, 0.22, 10), skinM);
      neck.position.set(0, 2.26, 0); g.add(neck);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), skinM);
      head.scale.set(1.0, 1.05, 1.0); head.position.set(0, 2.62, 0); g.add(head);
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), hairM);
      hair.scale.set(1.02, 0.72, 1.02); hair.position.set(0, 2.76, 0); g.add(hair);
      [-0.10, 0.10].forEach(ex => {
        const white = new THREE.Mesh(new THREE.SphereGeometry(0.050, 10, 8),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
        white.position.set(ex, 2.64, 0.22); g.add(white);
        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), getMat(0x3a2010, 0.2));
        iris.position.set(ex, 2.64, 0.248); g.add(iris);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), getMat(0x050304, 0.1));
        pupil.position.set(ex, 2.64, 0.256); g.add(pupil);
        const shine = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6),
          new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 }));
        shine.position.set(ex + 0.010, 2.652, 0.260); g.add(shine);
      });
      const smileM = getMat(0xc07050, 0.4);
      const smile = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.010, 6, 10, Math.PI), smileM);
      smile.rotation.z = Math.PI; smile.position.set(0, 2.52, 0.24); g.add(smile);
      const shad = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16),
        new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.18, depthWrite: false }));
      shad.rotation.x = -Math.PI / 2; shad.position.y = 0.01; g.add(shad);
      return g;
    };

    // ── Clone loaded model ─────────────────────────────────────────────────────
    const cloneModel = (template: THREE.Group): THREE.Group => {
      const clone = template.clone(true);
      clone.traverse(c => { if ((c as THREE.SkinnedMesh).isSkinnedMesh) (c as THREE.SkinnedMesh).skeleton?.pose(); });
      return clone;
    };

    // ── Mixer registry ────────────────────────────────────────────────────────
    const mixers: THREE.AnimationMixer[] = [];
    const setupAnim = (mesh: THREE.Group, clip: THREE.AnimationClip | null): THREE.AnimationMixer | null => {
      if (!clip) return null;
      const mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(clip).play();
      mixers.push(mixer);
      return mixer;
    };

    // ── Player setup ──────────────────────────────────────────────────────────
    let playerMesh: THREE.Group;
    let playerWalkMesh: THREE.Group | null = null;
    let playerIdleMesh: THREE.Group | null = null;

    const initPlayerMesh = (template: THREE.Group | null, clip: THREE.AnimationClip | null, scaleFn: (g: THREE.Group) => void): THREE.Group | null => {
      if (!template) return null;
      const m = cloneModel(template);
      scaleFn(m);
      setupAnim(m, clip);
      return m;
    };

    if (playerIdleMesh) { playerIdleMesh.position.set(10, 0, 10); scene.add(playerIdleMesh); }
    if (playerWalkMesh) { playerWalkMesh.position.set(10, 0, 10); playerWalkMesh.visible = false; scene.add(playerWalkMesh); }

    playerMesh = playerIdleMesh ?? playerWalkMesh ?? buildFallback(0x3a6090);
    if (!playerIdleMesh && !playerWalkMesh) { playerMesh.position.set(10, 0, 10); scene.add(playerMesh); }
    // ── NPCs ──────────────────────────────────────────────────────────────────
    const npcMeshes: THREE.Group[] = [];
    const npcLabels: HTMLDivElement[] = [];

    NPCS_DATA.forEach(npc => {
      let mesh: THREE.Group;
      const buildMinnie = (): THREE.Group => {
  const g = new THREE.Group();
  const skinM = getMat(0xffd5b0, 0.65);
  const hairM = getMat(0xff88cc, 0.7);
  const dressM = getMat(0x00e5ff, 0.65);
  const legM = getMat(0xffffff, 0.8);
  const shoeM = getMat(0xff88cc, 0.8);

  // Shoes
  [-0.12, 0.12].forEach(ox => {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.32), shoeM);
    shoe.position.set(ox, 0.04, 0); g.add(shoe);
  });

  // Legs (shorter, peeking below skirt)
  [-0.10, 0.10].forEach(ox => {
    const lm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 10), legM);
    lm.position.set(ox, 0.30, 0); g.add(lm);
  });

  // Skirt (wide flared cone  clearly a dress)
  const dress = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.52, 1.10, 12), dressM);
  dress.position.set(0, 1.42, 0); g.add(dress);

  // Bodice (torso top, narrower)
  const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.18, 0.55, 10), dressM);
  bodice.position.set(0, 2.08, 0); g.add(bodice);

  // Arms
  [-0.40, 0.40].forEach(ox => {
    const am = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.80, 8), skinM);
    am.position.set(ox, 1.75, 0); g.add(am);
  });

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.20, 10), skinM);
  neck.position.set(0, 2.18, 0); g.add(neck);

  // Head  simple round
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), skinM);
  head.position.set(0, 2.62, 0); g.add(head);

  // Hair  simple cap
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.30, 14, 10), hairM);
  hairCap.scale.set(1.0, 0.65, 1.0);
  hairCap.position.set(0, 2.78, 0); g.add(hairCap);

  // Hair sides
  [-0.22, 0.22].forEach(ox => {
    const hs = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.45, 8), hairM);
    hs.position.set(ox, 2.44, 0); g.add(hs);
  });

  // Eyes  just two simple dark dots
  [-0.10, 0.10].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8),
      getMat(0x222222, 0.3));
    eye.position.set(ex, 2.64, 0.25); g.add(eye);
    // White highlight
    const hi = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6),
      new THREE.MeshStandardMaterial({color:0xffffff, emissive:0xffffff, emissiveIntensity:1}));
    hi.position.set(ex + 0.012, 2.655, 0.27); g.add(hi);
  });

  // Smile  simple arc
  const smileM = getMat(0xcc6688, 0.4);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 10, Math.PI), smileM);
  smile.rotation.z = Math.PI;
  smile.position.set(0, 2.54, 0.26); g.add(smile);

  // Cyan glow
  const aura = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 10),
    new THREE.MeshStandardMaterial({color:0x00e5ff, emissive:0x00e5ff, emissiveIntensity:0.3, transparent:true, opacity:0.08, depthWrite:false, side:THREE.BackSide}));
  aura.position.set(0, 1.4, 0); g.add(aura);

  // Shadow
  const shad = new THREE.Mesh(new THREE.CircleGeometry(0.35, 16),
    new THREE.MeshBasicMaterial({color:0, transparent:true, opacity:0.18, depthWrite:false}));
  shad.rotation.x = -Math.PI / 2; shad.position.y = 0.02; g.add(shad);

  return g;
};
      mesh = npc.isAI ? buildMinnie() : buildFallback(npc.color);
      mesh.position.set(npc.pos[0], 0, npc.pos[2]);
      mesh.userData.npcData = npc;
      scene.add(mesh); npcMeshes.push(mesh);

     if (npc.isAI) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.70,0.045,8,32),
    new THREE.MeshStandardMaterial({color:0x00e5ff,emissive:0x00e5ff,emissiveIntensity:1.8,transparent:true,opacity:0.9}));
  ring.rotation.x=-Math.PI/2; ring.position.y=0.08;
  mesh.add(ring); mesh.userData.aiRing = ring;

  const aura = new THREE.Mesh(new THREE.SphereGeometry(1.1,12,10),
    new THREE.MeshStandardMaterial({color:0x00e5ff,emissive:0x00e5ff,emissiveIntensity:0.2,transparent:true,opacity:0.08,depthWrite:false,side:THREE.BackSide}));
  aura.position.y = 1.8;
  mesh.add(aura);
}

      const labelDiv = document.createElement('div');
      labelDiv.style.cssText = `position:fixed;font-family:'Press Start 2P',monospace;font-size:7px;color:#2a5080;text-align:center;pointer-events:none;z-index:40;white-space:nowrap;background:rgba(255,255,255,0.88);padding:3px 8px;border:1px solid rgba(42,80,128,0.4);border-radius:4px;display:none`;
      labelDiv.textContent = npc.name;
      document.body.appendChild(labelDiv);
      npcLabels.push(labelDiv);
    });

    setLoad(90);

    // ── Camera & Input ────────────────────────────────────────────────────────
    // Camera follow height/distance tuned for 2-unit tall character
    const camState = { yaw: Math.PI, pitch: 0.34, distance: 7, lastMX: 0, lastMY: 0 };
    const Keys: Record<string,number> = {};
    const MobileKeys = { u:0,d:0,l:0,r:0 };

    const onKeyDown = (e: KeyboardEvent) => {
      Keys[e.code] = 1;
      if (!gameRunning) return;
      if (['Space','KeyE','Enter'].includes(e.code)){ e.preventDefault(); doInteract(); }
      if (e.key.startsWith('Arrow')) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { Keys[e.code] = 0; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let mouseActive=false;
    const onMouseDown=(e:MouseEvent)=>{mouseActive=true;camState.lastMX=e.clientX;camState.lastMY=e.clientY;e.preventDefault();};
    const onMouseUp=()=>{mouseActive=false;};
    const onMouseMove=(e:MouseEvent)=>{
      if(!mouseActive) return;
      camState.yaw-=(e.clientX-camState.lastMX)*0.005;
      camState.pitch=Math.max(0.1,Math.min(1.2,camState.pitch+(e.clientY-camState.lastMY)*0.004));
      camState.lastMX=e.clientX;camState.lastMY=e.clientY;
    };
    const onWheel=(e:WheelEvent)=>{camState.distance=Math.max(3,Math.min(18,camState.distance+e.deltaY*0.02));e.preventDefault();};
    canvas.addEventListener('mousedown',onMouseDown);
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
    window.addEventListener('mouseup',onMouseUp);
    window.addEventListener('mousemove',onMouseMove);
    canvas.addEventListener('wheel',onWheel,{passive:false});

    let touchActive=false,lastTX=0,lastTY=0;
    canvas.addEventListener('touchstart',e=>{if(e.touches.length===1){touchActive=true;lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;}},{passive:true});
    canvas.addEventListener('touchend',()=>{touchActive=false;});
    canvas.addEventListener('touchmove',e=>{
      if(!touchActive||e.touches.length!==1) return;
      camState.yaw-=(e.touches[0].clientX-lastTX)*0.005;
      camState.pitch=Math.max(0.1,Math.min(1.2,camState.pitch+(e.touches[0].clientY-lastTY)*0.004));
      lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;
    },{passive:true});

    const isMobile=/Mobi|Android/i.test(navigator.userAgent)||window.innerWidth<768;
    if(isMobile){
      dpad.style.display='block';(aBtn as HTMLElement).style.display='flex';controlsHint.style.display='none';
      const dpMap:Record<string,keyof typeof MobileKeys>={'dp-u':'u','dp-d':'d','dp-l':'l','dp-r':'r'};
      Object.entries(dpMap).forEach(([id,dir])=>{
        const el=document.getElementById(id)!;
        el.addEventListener('touchstart',e=>{MobileKeys[dir]=1;el.classList.add('on');e.preventDefault();},{passive:false});
        el.addEventListener('touchend',()=>{MobileKeys[dir]=0;el.classList.remove('on');});
      });
      aBtn.addEventListener('touchstart',e=>{doInteract();e.preventDefault();},{passive:false});
    } else { controlsHint.style.display='block'; }

    // ── Dialogue ──────────────────────────────────────────────────────────────
    let dlgQueue:Array<{s:string;t:string}>=[], dlgTyping=false;
    let dlgInterval:ReturnType<typeof setInterval>|null=null;
    let dlgFull='',dlgShown='',dlgNPC:NPC|null=null;

    const drawPortrait=(col:number)=>{
      const w=110,h=110;
      faceCX.fillStyle='#e8f4ff'; faceCX.fillRect(0,0,w,h);
      const c=new THREE.Color(col);
      const grd=faceCX.createRadialGradient(w/2,h,10,w/2,h*0.5,w*0.65);
      grd.addColorStop(0,`rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},0.35)`);
      grd.addColorStop(1,'transparent'); faceCX.fillStyle=grd; faceCX.fillRect(0,0,w,h);
      faceCX.fillStyle='rgb(210,165,115)'; faceCX.fillRect(w/2-7,h*0.58,14,14);
      faceCX.fillStyle=`#${c.getHexString()}`; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.80,22,20,0,0,Math.PI*2); faceCX.fill();
      faceCX.fillStyle='rgb(213,160,110)'; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.40,23,27,0,0,Math.PI*2); faceCX.fill();
      faceCX.fillStyle='rgba(240,180,150,0.5)';
      [-11,11].forEach(cx=>{faceCX.beginPath();faceCX.ellipse(w/2+cx,h*0.44,7,5,0,0,Math.PI*2);faceCX.fill();});
      faceCX.fillStyle='#1a0c04'; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.27,25,14,0,0,Math.PI*2); faceCX.fill();
      faceCX.fillRect(w/2-26,h*0.28,8,18); faceCX.fillRect(w/2+18,h*0.28,8,18);
      [w/2-9,w/2+9].forEach(ex=>{
        faceCX.fillStyle='#f5f0ea'; faceCX.beginPath(); faceCX.ellipse(ex,h*0.41,5.5,4.5,0,0,Math.PI*2); faceCX.fill();
        faceCX.fillStyle='#2a1a0a'; faceCX.beginPath(); faceCX.ellipse(ex,h*0.41,3.0,3.5,0,0,Math.PI*2); faceCX.fill();
        faceCX.fillStyle='white'; faceCX.beginPath(); faceCX.arc(ex+1.5,h*0.40,1.2,0,Math.PI*2); faceCX.fill();
        faceCX.fillStyle='#1a0c04'; faceCX.beginPath(); faceCX.ellipse(ex,h*0.365,5,2,ex<w/2?0.15:-0.15,0,Math.PI*2); faceCX.fill();
      });
      faceCX.fillStyle='rgba(180,130,90,0.5)'; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.48,4,5,0,0,Math.PI*2); faceCX.fill();
      faceCX.fillStyle='rgb(190,130,100)'; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.535,7,2.5,0,0,Math.PI*2); faceCX.fill();
      faceCX.strokeStyle=`rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},0.6)`;
      faceCX.lineWidth=2; faceCX.beginPath(); faceCX.ellipse(w/2,h/2,w/2-3,h/2-3,0,0,Math.PI*2); faceCX.stroke();
    };
    const drawMINNIEPortrait=()=>{
      const w=110,h=110;
      faceCX.fillStyle='#e8faff'; faceCX.fillRect(0,0,w,h);
      const grd=faceCX.createRadialGradient(w/2,h/2,8,w/2,h/2,50);
      grd.addColorStop(0,'rgba(0,200,240,0.6)');grd.addColorStop(0.5,'rgba(0,160,210,0.25)');grd.addColorStop(1,'rgba(0,100,180,0)');
      faceCX.fillStyle=grd; faceCX.beginPath(); faceCX.arc(w/2,h/2,50,0,Math.PI*2); faceCX.fill();
      faceCX.fillStyle='rgb(240,200,160)'; faceCX.fillRect(w/2-7,h*0.57,14,12);
      faceCX.fillStyle='#f0f0f0'; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.80,20,18,0,0,Math.PI*2); faceCX.fill();
      faceCX.fillStyle='rgb(245,203,167)'; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.40,20,24,0,0,Math.PI*2); faceCX.fill();
      faceCX.fillStyle='rgba(255,150,150,0.35)';
      [-10,10].forEach(cx=>{faceCX.beginPath();faceCX.ellipse(w/2+cx,h*0.44,7,5,0,0,Math.PI*2);faceCX.fill();});
      faceCX.fillStyle='#e06080'; faceCX.beginPath(); faceCX.ellipse(w/2,h*0.27,22,14,0,0,Math.PI*2); faceCX.fill();
      faceCX.fillRect(w/2-24,h*0.28,7,22); faceCX.fillRect(w/2+17,h*0.28,7,22);
      [w/2-8,w/2+8].forEach(ex=>{
        faceCX.fillStyle='#f8f4ee'; faceCX.beginPath(); faceCX.ellipse(ex,h*0.41,5,4.5,0,0,Math.PI*2); faceCX.fill();
        faceCX.fillStyle='#b06830'; faceCX.beginPath(); faceCX.ellipse(ex,h*0.41,3,3.5,0,0,Math.PI*2); faceCX.fill();
        faceCX.fillStyle='white'; faceCX.beginPath(); faceCX.arc(ex+1.2,h*0.40,1.2,0,Math.PI*2); faceCX.fill();
        faceCX.fillStyle='#e06080'; faceCX.beginPath(); faceCX.ellipse(ex,h*0.365,5,2,ex<w/2?0.15:-0.15,0,Math.PI*2); faceCX.fill();
      });
      faceCX.strokeStyle='rgba(0,200,240,0.7)'; faceCX.lineWidth=2;
      faceCX.beginPath(); faceCX.ellipse(w/2,h/2,w/2-3,h/2-3,0,0,Math.PI*2); faceCX.stroke();
      faceCX.fillStyle='rgba(0,180,220,0.9)'; faceCX.font='bold 7px monospace'; faceCX.textAlign='center'; faceCX.fillText('MINNIE 💙',w/2,h-7);
    };

    const typeText=(text:string,onDone:()=>void)=>{
      dlgFull=text;dlgShown='';dlgText.textContent='';dlgTyping=true;dlgCont.style.display='none';
      if(dlgInterval) clearInterval(dlgInterval);let i=0;
      dlgInterval=setInterval(()=>{ if(i<dlgFull.length){dlgShown+=dlgFull[i++];dlgText.textContent=dlgShown;}else{if(dlgInterval)clearInterval(dlgInterval);dlgTyping=false;onDone();} },18);
    };
    const closeDlg=()=>{ dlgEl.style.display='none';dlgNPC=null;dlgQueue=[];if(dlgInterval)clearInterval(dlgInterval);dlgTyping=false; };
    const seen=new Set<string>(); let currentZone='THE WORLD';
    const updateHUD=()=>{ zoneLabelEl.textContent='◈ '+currentZone; foundLabelEl.textContent=seen.size+' / '+NPCS_DATA.length+' found'; };
    let notifTimer:ReturnType<typeof setTimeout>|null=null;
    const notify=(msg:string)=>{ notifEl.textContent=msg;notifEl.classList.add('on');if(notifTimer)clearTimeout(notifTimer);notifTimer=setTimeout(()=>notifEl.classList.remove('on'),2800); };

    const nextLine=()=>{
      if(dlgNPC?.isAI){closeDlg();aiInputWrap.style.display='block';setTimeout(()=>aiUserInput.focus(),100);return;}
      if(!dlgQueue.length){closeDlg();return;}
      const line=dlgQueue.shift()!;
      dlgEl.style.display='flex';dlgName.textContent=line.s;
      dlgPage.textContent=`${dlgNPC!.lines.length-dlgQueue.length} / ${dlgNPC!.lines.length}`;
      drawPortrait(dlgNPC!.color);
      typeText(line.t,()=>{dlgCont.textContent='▼ E / CLICK';dlgCont.style.display='block';});
    };
    const openNPC=(npc:NPC)=>{
      if(!seen.has(npc.id)){seen.add(npc.id);notify('Encountered: '+npc.name);updateHUD();}
      dlgNPC=npc;
      if(npc.isAI){dlgQueue=[];dlgEl.style.display='flex';dlgName.textContent='MINNIE · AI';drawMINNIEPortrait();dlgPage.textContent='';typeText(npc.lines[0].t,()=>{dlgCont.textContent='▼ E / CLICK · OPEN CHAT';dlgCont.style.display='block';});}
      else{dlgQueue=[...npc.lines];nextLine();}
    };
    const getNearest=()=>{ let best:THREE.Group|null=null,bd=4.5;npcMeshes.forEach(m=>{const d=playerMesh.position.distanceTo(m.position);if(d<bd){bd=d;best=m;}});return best; };
    const doInteract=()=>{
      if(dlgEl.style.display==='flex'){
        if(dlgTyping){if(dlgInterval)clearInterval(dlgInterval);dlgTyping=false;dlgShown=dlgFull;dlgText.textContent=dlgFull;dlgCont.style.display='block';}
        else nextLine();return;
      }
      const nb=getNearest();if(nb) openNPC(nb.userData.npcData as NPC);
    };
    dlgEl.addEventListener('click',doInteract);

    const checkZone=()=>{
      const px=playerMesh.position.x,pz=playerMesh.position.z;
      for(const z of ZONES_DATA){
        if(px>=z.xMin&&px<z.xMax&&pz>=z.zMin&&pz<z.zMax){
          if(z.name!==currentZone){
            currentZone=z.name;notify('Entering: '+z.name);
            flashEl.style.opacity='1';setTimeout(()=>{flashEl.style.opacity='0';},300);
            (scene.fog as THREE.Fog).color.set(z.fogColor);(scene.background as THREE.Color).set(z.skyColor);
            zoneLight.color.set(z.light);updateHUD();
          }return;
        }
      }
      if(currentZone!=='THE WORLD'){currentZone='THE WORLD';(scene.fog as THREE.Fog).color.set(0x87ceeb);(scene.background as THREE.Color).set(0x87ceeb);updateHUD();}
    };

    const drawMinimap=()=>{
      const W=130,H=100,sc=W/116;
      mmCX.fillStyle='rgba(240,248,255,0.95)'; mmCX.fillRect(0,0,W,H);
      ZONES_DATA.forEach(z=>{const c=new THREE.Color(z.fogColor);mmCX.fillStyle=`rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},0.7)`;mmCX.fillRect(z.xMin*sc,z.zMin*sc*(H/W),(z.xMax-z.xMin)*sc,(z.zMax-z.zMin)*sc*(H/W));});
      npcMeshes.forEach(m=>{const nd=m.userData.npcData as NPC;mmCX.fillStyle=seen.has(nd.id)?'#2060c0':'rgba(30,80,160,0.3)';mmCX.fillRect(m.position.x*sc-1.5,m.position.z*sc*(H/W)-1.5,3,3);});
      mmCX.fillStyle='#e03060';mmCX.beginPath();mmCX.arc(playerMesh.position.x*sc,playerMesh.position.z*sc*(H/W),3.5,0,Math.PI*2);mmCX.fill();
    };

    const updateLabels=()=>{
      npcMeshes.forEach((mesh,i)=>{
        const pos=mesh.position.clone(); pos.y+=2.8;
        const proj=pos.project(camera); const dist=playerMesh.position.distanceTo(mesh.position);
        if(dist>20||proj.z>1){npcLabels[i].style.display='none';return;}
        const x=(proj.x+1)/2*window.innerWidth,y=(-proj.y+1)/2*window.innerHeight;
        npcLabels[i].style.display='block';
        npcLabels[i].style.left=(x-npcLabels[i].offsetWidth/2)+'px';
        npcLabels[i].style.top=(y-20)+'px';
      });
    };

    // ── MINNIE AI (Groq) ──────────────────────────────────────────────────────
    let aiHistory:Array<{role:'user'|'assistant';content:string}>=[];
    let aiThinking=false;
    const appendMsg=(role:'user'|'assistant',text:string)=>{
      const div=document.createElement('div');
      div.style.cssText=`font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:600;padding:6px 12px;border-radius:4px;max-width:88%;line-height:1.5;${role==='user'?'align-self:flex-end;background:rgba(0,120,220,0.12);color:#1a4080;border-left:2px solid #0080d0;':'align-self:flex-start;background:rgba(255,255,255,0.7);color:#1a3020;border-left:2px solid rgba(0,200,220,0.6);'}`;
      const prefix = role === 'user' ? 'You: ' : 'MINNIE 💙: ';
const urlRegex = /(https?:\/\/[^\s]+)/g;
const parts = text.split(urlRegex);
div.appendChild(document.createTextNode(prefix));
parts.forEach(part => {
  if (urlRegex.test(part)) {
    const a = document.createElement('a');
    a.href = part;
    a.textContent = part;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.cssText = 'color:#0088cc;text-decoration:underline;word-break:break-all;';
    div.appendChild(a);
  } else {
    div.appendChild(document.createTextNode(part));
  }
  urlRegex.lastIndex = 0; // reset regex after .test()
});
      aiHistoryEl.appendChild(div);aiHistoryEl.scrollTop=aiHistoryEl.scrollHeight;
      if(role==='assistant') speakAsMinnie(text);
    };
    const sendToMINNIE=async()=>{
      const msg=aiUserInput.value.trim();if(!msg||aiThinking) return;
      aiUserInput.value='';appendMsg('user',msg);aiHistory.push({role:'user',content:msg});
      aiThinking=true;aiSendBtn.textContent='...';aiSendBtn.disabled=true;
      const t=document.createElement('div');t.style.cssText='font-family:monospace;font-size:13px;color:rgba(0,150,180,0.7);padding:4px 12px;align-self:flex-start;';
      t.textContent='MINNIE is thinking...';aiHistoryEl.appendChild(t);aiHistoryEl.scrollTop=aiHistoryEl.scrollHeight;
      try{
        const res=await fetch('/api/minnie',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:aiHistory})});
        const data=await res.json();if(!res.ok) throw new Error(data.error);
        aiHistory.push({role:'assistant',content:data.reply});t.remove();appendMsg('assistant',data.reply);
      }catch(err:unknown){t.remove();appendMsg('assistant',`Connection error. Make sure GROQ_API_KEY is set. (${err instanceof Error?err.message:'?'})`);}
      aiThinking=false;aiSendBtn.textContent='SEND';aiSendBtn.disabled=false;
    };
    aiSendBtn.addEventListener('click',sendToMINNIE);
    aiUserInput.addEventListener('keydown',e=>{if(e.key==='Enter') sendToMINNIE();e.stopPropagation();});
    aiUserInput.addEventListener('keyup',e=>e.stopPropagation());
    aiCloseBtn.addEventListener('click',()=>{aiInputWrap.style.display='none';aiHistory=[];aiHistoryEl.innerHTML='';});

    let voiceEnabled=true;
    const speakAsMinnie=(text:string)=>{
      if(!voiceEnabled||!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const short=text.replace(/\n/g,' ').split(/[.!?]/).slice(0,2).join('. ').trim();if(!short) return;
      const u=new SpeechSynthesisUtterance(short);
      const v=window.speechSynthesis.getVoices();
      const fem=v.find(x=>/female|zira|samantha|victoria|karen|serena/i.test(x.name)&&x.lang.startsWith('en'))||v.find(x=>x.lang==='en-US'||x.lang==='en-GB')||v[0];
      if(fem) u.voice=fem;u.rate=1.05;u.pitch=1.25;u.volume=0.88;window.speechSynthesis.speak(u);
    };
    if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();
    voiceBtn.addEventListener('click',()=>{voiceEnabled=!voiceEnabled;if(!voiceEnabled&&window.speechSynthesis)window.speechSynthesis.cancel();voiceBtn.textContent=voiceEnabled?'♀ VOICE ON':'♀ VOICE OFF';});

    let audioCtx:AudioContext|null=null,musicPlaying=false,musicMuted=false;
    const gNodes:GainNode[]=[];
    const startMusic=()=>{
      if(musicPlaying) return;
      audioCtx=new(window.AudioContext||(window as unknown as{webkitAudioContext:typeof AudioContext}).webkitAudioContext)();
      musicPlaying=true;
      const master=audioCtx.createGain();master.gain.value=0.18;master.connect(audioCtx.destination);gNodes.push(master);
      [261,329,392,523].forEach((f,i)=>{
        const osc=audioCtx!.createOscillator(),g=audioCtx!.createGain(),lfo=audioCtx!.createOscillator(),lfoG=audioCtx!.createGain();
        osc.type='triangle';osc.frequency.value=f;g.gain.value=0.028;lfo.type='sine';lfo.frequency.value=0.10+i*0.04;lfoG.gain.value=6;
        lfo.connect(lfoG);lfoG.connect(osc.detune);osc.connect(g);g.connect(master);osc.start();lfo.start();gNodes.push(g);
      });
    };
    musicBtn.addEventListener('click',()=>{
      if(!audioCtx) startMusic();musicMuted=!musicMuted;
      gNodes.forEach(g=>g.gain.setTargetAtTime(musicMuted?0:0.18,audioCtx!.currentTime,0.5));
      musicBtn.textContent=musicMuted?'♪ MUSIC OFF':'♪ MUSIC ON';
    });

    setLoad(100);

    // ── Game loop ─────────────────────────────────────────────────────────────
    let lastTime=0,animId=0;
    const pState={speed:7,facing:0,moving:false};

    const animate=(time:number)=>{
      animId=requestAnimationFrame(animate);
      const dt=Math.min((time-lastTime)/1000,0.05);lastTime=time;
      mixers.forEach(m=>m.update(dt));
      if(!gameRunning){renderer.render(scene,camera);return;}

      const fw=Keys['KeyW']||Keys['ArrowUp']||MobileKeys.u;
      const bk=Keys['KeyS']||Keys['ArrowDown']||MobileKeys.d;
      const lt=Keys['KeyA']||Keys['ArrowLeft']||MobileKeys.l;
      const rt=Keys['KeyD']||Keys['ArrowRight']||MobileKeys.r;
      const camFwd=new THREE.Vector3(-Math.sin(camState.yaw),0,-Math.cos(camState.yaw));
      const camRight=new THREE.Vector3(Math.cos(camState.yaw),0,-Math.sin(camState.yaw));
      const moveDir=new THREE.Vector3();
      if(fw) moveDir.add(camFwd);if(bk) moveDir.sub(camFwd);if(lt) moveDir.sub(camRight);if(rt) moveDir.add(camRight);
      const moving=moveDir.lengthSq()>0;
      pState.moving=moving;

      if(moving){
        moveDir.normalize();
        playerMesh.position.addScaledVector(moveDir,pState.speed*dt);
        playerMesh.position.x=Math.max(0.5,Math.min(115.5,playerMesh.position.x));
        playerMesh.position.z=Math.max(0.5,Math.min(115.5,playerMesh.position.z));
        pState.facing=Math.atan2(moveDir.x,moveDir.z);
        playerMesh.rotation.y=pState.facing;
      }

      // Swap walk/idle visibility
      if(playerIdleMesh && playerWalkMesh){
        if(moving && playerIdleMesh.visible){
          playerIdleMesh.visible=false;
          playerWalkMesh.visible=true;
          playerWalkMesh.position.copy(playerMesh.position);
          playerWalkMesh.rotation.y=playerMesh.rotation.y;
          playerMesh=playerWalkMesh;
        } else if(!moving && playerWalkMesh.visible){
          playerWalkMesh.visible=false;
          playerIdleMesh.visible=true;
          playerIdleMesh.position.copy(playerMesh.position);
          playerIdleMesh.rotation.y=playerMesh.rotation.y;
          playerMesh=playerIdleMesh;
        } else if(moving && playerWalkMesh.visible){
          playerWalkMesh.position.copy(playerMesh.position);
          playerWalkMesh.rotation.y=pState.facing;
        }
      }

      // Camera  follow player at correct height for 2-unit character
      const camTarget=playerMesh.position.clone().add(new THREE.Vector3(0,1.2,0));
      const camOffset=new THREE.Vector3(
        Math.sin(camState.yaw)*Math.cos(camState.pitch)*camState.distance,
        Math.sin(camState.pitch)*camState.distance,
        Math.cos(camState.yaw)*Math.cos(camState.pitch)*camState.distance
      );
      camera.position.lerp(camTarget.clone().add(camOffset),0.12);
      camera.lookAt(camTarget);

      // NPC face player
      npcMeshes.forEach(m=>{
        if(m.userData.aiRing) m.userData.aiRing.rotation.z=time*0.002;
        const toP=new THREE.Vector3().subVectors(playerMesh.position,m.position);
        m.rotation.y+=(Math.atan2(toP.x,toP.z)-m.rotation.y)*0.05;
      });

      // Particles
      const pa=particles.geometry.attributes.position.array as Float32Array;
      for(let i=0;i<pa.length/3;i++){pa[i*3+1]+=Math.sin(time*0.001+i)*0.002;if(pa[i*3+1]>8)pa[i*3+1]=0.5;}
      particles.geometry.attributes.position.needsUpdate=true;

      interactEl.style.display=getNearest()?'block':'none';
      checkZone();zoneLight.position.copy(playerMesh.position).add(new THREE.Vector3(0,5,0));
      drawMinimap();updateLabels();
      renderer.render(scene,camera);
    };

    setTimeout(()=>{loadScreen.style.opacity='0';setTimeout(()=>{loadScreen.style.display='none';titleScreen.style.display='flex';},500);},400);

    startBtn.addEventListener('click',()=>{
      titleScreen.style.display='none';hud.style.display='block';minimapWrap.style.display='block';
      musicBtn.style.display='block';voiceBtn.style.display='block';
      if(!isMobile) controlsHint.style.display='block';
      gameRunning=true;updateHUD();startMusic();lastTime=performance.now();animId=requestAnimationFrame(animate);
    });

    const titleRender=()=>{if(gameRunning)return;renderer.render(scene,camera);requestAnimationFrame(titleRender);};
    requestAnimationFrame(titleRender);

    gameRef.current={cleanup:()=>{
      cancelAnimationFrame(animId);
      window.removeEventListener('resize',onResize);window.removeEventListener('keydown',onKeyDown);
      window.removeEventListener('keyup',onKeyUp);window.removeEventListener('mouseup',onMouseUp);
      window.removeEventListener('mousemove',onMouseMove);
      npcLabels.forEach(l=>l.remove());mixers.forEach(m=>m.stopAllAction());renderer.dispose();
      if(canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }};
  },[]);

  useEffect(()=>{initGame();return()=>{gameRef.current?.cleanup();};},[initGame]);

  return (
    <>
      <Head>
        <title>Journey Through Deekshith  3D Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@400;600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <div ref={mountRef} style={{position:'fixed',inset:0}} />

      {/* Loading */}
      <div id="loadScreen">
        <div className="load-bar-wrap"><div id="loadBar" /></div>
        <p>LOADING WORLD...</p>
      </div>

      {/* ── Title Screen  active, photo prominent, no CEO/Founder ── */}
      <div id="titleScreen" style={{display:'none'}}>
        {/* Animated background blobs */}
        <div className="title-blob title-blob-1" />
        <div className="title-blob title-blob-2" />
        <div className="title-blob title-blob-3" />

        <div className="title-layout">

          {/* LEFT: Photo card */}
          <div className="title-photo-col">
            <div className="title-photo-card">
              {/* Photo  replace src with your real image URL or /your-photo.jpg in public/ */}
              <img
                src="/deekshith.jpg"
                alt="Deekshith"
                className="title-photo-img"
                onError={(e) => {
                  // Fallback illustrated avatar if photo not found
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fb = document.getElementById('photo-fallback');
                  if (fb) fb.style.display = 'flex';
                }}
              />
              <div id="photo-fallback" className="title-photo-fallback" style={{display:'none'}}>
                {/* Illustrated avatar */}
                <svg viewBox="0 0 180 210" xmlns="http://www.w3.org/2000/svg" width="180" height="210">
                  <defs>
                    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#dbeeff"/>
                      <stop offset="100%" stopColor="#b8d4f8"/>
                    </radialGradient>
                    <radialGradient id="skinGrad" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#e8b88a"/>
                      <stop offset="100%" stopColor="#c8855a"/>
                    </radialGradient>
                  </defs>
                  <rect width="180" height="210" fill="url(#bgGrad)" rx="12"/>
                  {/* Body / blazer */}
                  <ellipse cx="90" cy="188" rx="55" ry="32" fill="#2a4a80"/>
                  <ellipse cx="90" cy="175" rx="40" ry="28" fill="#3a6090"/>
                  {/* Shirt collar */}
                  <polygon points="80,148 90,162 100,148" fill="white"/>
                  {/* Neck */}
                  <rect x="82" y="136" width="16" height="18" rx="4" fill="url(#skinGrad)"/>
                  {/* Head */}
                  <ellipse cx="90" cy="112" rx="38" ry="44" fill="url(#skinGrad)"/>
                  {/* Hair */}
                  <ellipse cx="90" cy="75" rx="40" ry="22" fill="#0d0804"/>
                  <ellipse cx="55" cy="98" rx="12" ry="22" fill="#0d0804"/>
                  <ellipse cx="125" cy="98" rx="12" ry="22" fill="#0d0804"/>
                  {/* Ears */}
                  <ellipse cx="52" cy="115" rx="7" ry="10" fill="#d4956a"/>
                  <ellipse cx="128" cy="115" rx="7" ry="10" fill="#d4956a"/>
                  {/* Eyes */}
                  <ellipse cx="76" cy="108" rx="8" ry="7" fill="white"/>
                  <ellipse cx="104" cy="108" rx="8" ry="7" fill="white"/>
                  <circle cx="77" cy="109" r="5" fill="#1a0a04"/>
                  <circle cx="105" cy="109" r="5" fill="#1a0a04"/>
                  <circle cx="78.5" cy="107" r="1.5" fill="white"/>
                  <circle cx="106.5" cy="107" r="1.5" fill="white"/>
                  {/* Eyebrows */}
                  <path d="M68 99 Q76 95 84 99" stroke="#0d0804" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M96 99 Q104 95 112 99" stroke="#0d0804" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  {/* Nose */}
                  <path d="M90 112 Q87 120 84 123 Q90 125 96 123 Q93 120 90 112" fill="#c07845"/>
                  {/* Mouth  natural smile */}
                  <path d="M79 132 Q90 140 101 132" stroke="#a05030" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M82 132 Q90 136 98 132" fill="rgba(160,80,50,0.25)"/>
                  {/* Glasses */}
                  <rect x="64" y="102" width="20" height="14" rx="4" fill="none" stroke="#1a2840" strokeWidth="1.8"/>
                  <rect x="96" y="102" width="20" height="14" rx="4" fill="none" stroke="#1a2840" strokeWidth="1.8"/>
                  <line x1="84" y1="109" x2="96" y2="109" stroke="#1a2840" strokeWidth="1.8"/>
                  <line x1="57" y1="109" x2="64" y2="109" stroke="#1a2840" strokeWidth="1.5"/>
                  <line x1="116" y1="109" x2="123" y2="109" stroke="#1a2840" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="title-photo-badge">Hyderabad, India</div>
            </div>

            {/* Floating skill chips */}
            <div className="skill-chips">
              <span className="chip chip-blue">Python</span>
              <span className="chip chip-purple">ML / AI</span>
              <span className="chip chip-orange">SQL</span>
            </div>
          </div>

          {/* CENTER: Name + CTA */}
          <div className="title-mid">
            <div className="title-eyebrow">✦ Interactive Portfolio</div>
            <div className="title-name-block">
              <div className="title-name-sub">KAVALI</div>
              <div className="title-name-main">DEEKSHITH</div>
            </div>
            <div className="title-roles">
              <span className="role-tag">Data Analyst</span>
              <span className="role-dot">·</span>
              <span className="role-dot">·</span>
              <span className="role-tag">AI Builder</span>
            </div>
            <div className="title-divider" />
            <div className="title-desc">
              A 3D world built from a real story.<br />
              Walk through 7 zones, meet 16 characters,<br />
              and discover what drives him to build.
            </div>
            <div className="title-divider" />
            <button className="title-btn" id="startBtn">
              <span className="btn-icon">▶</span>
              BEGIN JOURNEY
            </button>
            <div className="title-hint">16 characters · 7 zones · AI companion</div>
          </div>

          {/* RIGHT: How to play */}
          <div className="title-right">
            <div className="title-rules-head">◈ HOW TO PLAY</div>
            <div className="title-rule"><span className="title-rule-key">WASD</span><span>Move</span></div>
            <div className="title-rule"><span className="title-rule-key">DRAG</span><span>Rotate camera</span></div>
            <div className="title-rule"><span className="title-rule-key">SCROLL</span><span>Zoom in / out</span></div>
            <div className="title-rule"><span className="title-rule-key">E / TAP</span><span>Talk to character</span></div>
            <div className="title-divider" />
            <div className="title-rules-head" style={{color:'#0088cc',fontSize:'7px'}}>◈ FIND MINNIE</div>
            <div className="title-rule" style={{color:'rgba(0,100,180,0.8)'}}>
              <span>Reach the AI NEXUS zone  she answers anything live via Groq AI 💙</span>
            </div>
            <div className="title-divider" />
            {/* Zone preview pills */}
            <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginTop:'4px'}}>
              {['HOMETOWN','ACADEMY','TECH FOREST','RUINS','SANCTUM','FUTURE PEAK','AI NEXUS'].map(z=>(
                <span key={z} style={{fontFamily:"'Press Start 2P',monospace",fontSize:'5px',padding:'3px 6px',background:'rgba(32,100,200,0.1)',border:'1px solid rgba(32,100,200,0.2)',borderRadius:'3px',color:'rgba(26,70,150,0.7)'}}>{z}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* HUD */}
      <div id="hud" style={{display:'none'}}>
        <div id="zoneLabel">◈ THE WORLD</div>
        <div id="foundLabel">0 / 16 found</div>
      </div>
      <div id="crosshair" />

      <div id="minimapWrap" style={{display:'none'}}>
        <canvas id="minimap" width={130} height={100} />
        <div className="mm-label">MAP</div>
      </div>

      <div id="notif" />
      <div id="interact" style={{display:'none'}}>[ E ] Talk</div>

      <div id="dlg" style={{display:'none'}}>
        <div className="dlg-box">
          <div id="dlgFace"><canvas id="dlgFaceCanvas" width={110} height={110} /></div>
          <div className="dlg-right">
            <div id="dlgName">???</div>
            <div id="dlgText" />
            <div className="dlg-footer"><span id="dlgPage" /><span id="dlgCont">▼ E / CLICK</span></div>
          </div>
        </div>
      </div>

      <div id="flash" />

      <div id="dpad" style={{display:'none'}}>
        <div className="dp" id="dp-u">▲</div>
        <div className="dp" id="dp-l">◄</div>
        <div className="dp" id="dp-d">▼</div>
        <div className="dp" id="dp-r">►</div>
      </div>
      <div id="aBtn" style={{display:'none'}}>ACT</div>
      <div id="controlsHint" style={{display:'none'}}>WASD Move &nbsp;|&nbsp; Drag Rotate &nbsp;|&nbsp; Scroll Zoom &nbsp;|&nbsp; E Talk</div>

      <div id="musicBtn" className="top-btn" style={{display:'none'}}>♪ MUSIC ON</div>
      <div id="voiceBtn" className="top-btn" style={{display:'none'}}>♀ VOICE ON</div>

      <div id="aiInputWrap" style={{display:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px'}}>
          <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:'7px',color:'#0070c0',letterSpacing:'1px'}}>◈ ASK MINNIE · AI (Groq / Llama 3.3)</span>
          <span style={{flex:1}} />
          <button id="aiCloseBtn" style={{fontFamily:"'Press Start 2P',monospace",fontSize:'6px',color:'rgba(0,100,180,0.6)',background:'none',border:'1px solid rgba(0,120,200,0.3)',padding:'4px 10px',cursor:'pointer'}}>✕ CLOSE</button>
        </div>
        <div id="aiHistory" />
        <div style={{display:'flex',gap:'8px',alignItems:'stretch'}}>
          <input id="aiUserInput" type="text" placeholder="Ask anything  skills, projects, story, contact..." maxLength={300} />
          <button id="aiSendBtn" className="ai-send-btn">SEND</button>
        </div>
        <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:'5px',color:'rgba(0,100,180,0.4)',marginTop:'6px',letterSpacing:'1px'}}>Powered by Groq · Llama 3.3 70B</div>
      </div>
    </>
  );
};

export default GamePage;
