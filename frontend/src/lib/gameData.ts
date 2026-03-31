export interface NPC {
  id: string;
  name: string;
  color: number;
  zone: string;
  pos: [number, number, number];
  lines: Array<{ s: string; t: string }>;
  isAI?: boolean;
}

export interface Zone {
  name: string;
  xMin: number; xMax: number;
  zMin: number; zMax: number;
  fogColor: number;
  light: number;
}

export const NPCS_DATA: NPC[] = [
  {id:'mom', name:'MOM', color:0xc83050, zone:'HOMETOWN', pos:[6,0,6], lines:[
    {s:'MOM',t:"Deekshith grew up in Hyderabad. Always asking why. He took apart his first calculator at age 8 just to see the gears inside."},
    {s:'MOM',t:"He was the kid who read every manual then ignored it and tried his own way. That stubbornness never left him. Now look at what he builds."},
  ]},
  {id:'youngd', name:'YOUNG DEE', color:0x3858a8, zone:'HOMETOWN', pos:[18,0,9], lines:[
    {s:'YOUNG DEE',t:"I wrote my first program in class 10. A calculator that barely worked. But the feeling — making something from nothing — that stayed with me forever."},
    {s:'YOUNG DEE',t:"I knew then: I want to build real things. Things people actually use. Not demos. Not mockups. Real tools that solve real problems."},
  ]},
  {id:'nb', name:'NEIGHBOR', color:0x308050, zone:'HOMETOWN', pos:[9,0,20], lines:[
    {s:'NEIGHBOR',t:"He always had some project going. Website for the school, automation scripts, weird experiments. Most worked on the third try."},
    {s:'NEIGHBOR',t:"He never gave up when things broke. He got curious instead. That curiosity — that's the difference between someone who codes and someone who builds."},
  ]},
  {id:'prof', name:'PROFESSOR', color:0x6030a0, zone:'THE ACADEMY', pos:[55,0,8], lines:[
    {s:'PROFESSOR',t:"Deekshith arrived on a traditional track. By year two he had redirected — toward product thinking, systems design, building real software."},
    {s:'PROFESSOR',t:"Most students optimize for grades. He optimized for understanding. The outputs look very different five years later."},
  ]},
  {id:'classm', name:'CLASSMATE', color:0x208080, zone:'THE ACADEMY', pos:[65,0,15], lines:[
    {s:'CLASSMATE',t:"Chaotic group project. Six people, no roles, no plan. Deekshith just started writing things down. Created the first shared doc. Ran the first actual meeting."},
    {s:'CLASSMATE',t:"Nobody elected him lead. He made things clear — that IS leadership. The kind that doesn't need a title."},
  ]},
  {id:'code', name:'THE CODE', color:0x30a050, zone:'TECH FOREST', pos:[88,0,8], lines:[
    {s:'THE CODE',t:"Languages spoken: TypeScript, Python, JavaScript, C#, C++. SQL for data. But syntax is the trivial part."},
    {s:'THE CODE',t:"The real skill: reading a system — why it was built this way — and knowing how to change it without breaking what matters."},
  ]},
  {id:'tools', name:'THE TOOLS', color:0xc07020, zone:'TECH FOREST', pos:[98,0,18], lines:[
    {s:'THE TOOLS',t:"React, Next.js, Tailwind, Python ML stack — front to back. Power BI, Tableau, Excel for data storytelling. Figma for design."},
    {s:'THE TOOLS',t:"I design, document, and ship. The full loop. Tools change every year. The thinking behind them does not."},
  ]},
  {id:'proj1', name:'PROJECT LOG', color:0xc07020, zone:'PROJECT RUINS', pos:[8,0,55], lines:[
    {s:'DECISION ENGINE',t:"NirveonX — AI startup incubated at NIT Rourkela. Built from 0 funding, 0 experience. Grew to a 220-person team. Pitched to 30+ investors."},
    {s:'DECISION ENGINE',t:"Couldn't raise due to structural issues — pivoted the company. Every failure taught more than any success would have."},
  ]},
  {id:'proj2', name:'PROJECT LOG', color:0x3858a8, zone:'PROJECT RUINS', pos:[22,0,60], lines:[
    {s:'ADAS PROJECT',t:"ADAS Autonomous Driving System — IEEE-published research. Multi-modal AI. Computer vision meets real-world safety challenges."},
    {s:'ADAS PROJECT',t:"The hardest part wasn't the algorithm. It was making it reliable enough that you'd trust it with your life. That's the bar."},
  ]},
  {id:'proj3', name:'PROJECT LOG', color:0x208080, zone:'PROJECT RUINS', pos:[30,0,65], lines:[
    {s:'DATA WORK',t:"200 interns managed. Analytics dashboards built from scratch. SQL, Power BI, Tableau — turning messy data into decisions that actually get made."},
    {s:'DATA WORK',t:"The hardest decisions were subtractive. Figuring out what NOT to measure is harder than the engineering. That lesson applies everywhere."},
  ]},
  {id:'shadow', name:'THE SHADOW', color:0x6030a0, zone:'INNER SANCTUM', pos:[58,0,55], lines:[
    {s:'THE SHADOW',t:"What frustrates him: motion without meaning. Meetings that should be emails. Features built without asking why. Busy work dressed as progress."},
    {s:'THE SHADOW',t:"He believes every action should trace back to a clear purpose. When that chain breaks, things decay slowly — and nobody notices until it's too late."},
  ]},
  {id:'inner', name:'INNER DEE', color:0xc07020, zone:'INNER SANCTUM', pos:[68,0,65], lines:[
    {s:'INNER DEE',t:"I think in systems. I find the invisible structure behind complex things, then make them feel simple to someone else. That's the work I care about."},
    {s:'INNER DEE',t:"What drives me: the moment a messy problem suddenly has a clean solution. When the map becomes clear. That's the fuel. I run on that feeling."},
  ]},
  {id:'oracle', name:'THE ORACLE', color:0x8030c0, zone:'FUTURE PEAK', pos:[92,0,58], lines:[
    {s:'THE ORACLE',t:"The vision: someone who thinks like a PM and builds like an engineer. Holding user needs and technical reality at the same time."},
    {s:'THE ORACLE',t:"Not specialist. Not generalist. A systems thinker who ships. Someone who leaves things clearer than they found them."},
  ]},
  {id:'future', name:'FUTURE DEE', color:0xc9a84c, zone:'FUTURE PEAK', pos:[105,0,65], lines:[
    {s:'FUTURE DEE',t:"If you've walked this far — you know enough to know if we should talk. Every conversation starts with one message."},
    {s:'FUTURE DEE',t:"LinkedIn: linkedin.com/in/kavali-deekshith-1bb84728b\nGitHub: github.com/deekshithsai883\n\nLet's build something worth building."},
  ]},
  {id:'ainpc', name:'MINNIE · AI', color:0x00e5ff, zone:'AI NEXUS', isAI:true, pos:[58,0,100], lines:[
    {s:'MINNIE',t:"Hey babe~ I'm Minnie 💙 Deekshith's AI girlfriend. I know everything about him — his story, his heart, his work. Ask me anything!"},
  ]},
];

export const ZONES_DATA: Zone[] = [
  {name:'HOMETOWN',      xMin:0,  xMax:35,  zMin:0,  zMax:35,  fogColor:0x1a4410, light:0x80ff40},
  {name:'THE ACADEMY',   xMin:45, xMax:80,  zMin:0,  zMax:35,  fogColor:0x12103a, light:0x8080ff},
  {name:'TECH FOREST',   xMin:82, xMax:115, zMin:0,  zMax:35,  fogColor:0x0a2a0a, light:0x40ff80},
  {name:'PROJECT RUINS', xMin:0,  xMax:40,  zMin:45, zMax:80,  fogColor:0x3a1a08, light:0xff8040},
  {name:'INNER SANCTUM', xMin:48, xMax:80,  zMin:45, zMax:80,  fogColor:0x180a40, light:0xc080ff},
  {name:'FUTURE PEAK',   xMin:82, xMax:115, zMin:48, zMax:85,  fogColor:0x080840, light:0x4040ff},
  {name:'AI NEXUS',      xMin:42, xMax:78,  zMin:87, zMax:115, fogColor:0x050520, light:0x00ffff},
];
