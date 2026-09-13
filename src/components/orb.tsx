"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

// ============================================================================
// Types & Definitions
// ============================================================================

export type OrbState =
  | "working" // Orbits: particles on tilted 3D orbital planes
  | "searching" // Globe: meridian scan sweeping a dotted sphere
  | "solving" // Rubik: quarter-turn band scramble & auto-solve
  | "listening" // Wave: dual-frequency undulating latitude rings
  | "composing" // Ribbon: precessing multi-strand sash
  | "shaping" // Morph: seamless circle → triangle → square closed path morph
  | "pulsing" // Pulse: breathing 3D halftone sphere with expanding shockwaves
  | "vortex" // Vortex: swirling 3D logarithmic spiral drawing inward
  | "atom" // Atom: dense central core + 4 high-speed electron orbits
  | "helix" // Helix: rotating 3D double helix strand
  | "radar" // Radar: concentric 3D radar sweep
  | "galaxy" // Galaxy: 3D dual-arm logarithmic spiral galaxy with galactic bulge
  | "torus" // Torus: 3D rotating halftone torus with undulating surface ripples
  | "quantum" // Quantum: 3D holographic Tesseract / hypercube frame
  | "network" // Network: 3D geodesic node network with traveling energy pulses
  | "supernova" // Supernova: explosive 3D particle expansion & cardiac singularity pulse
  | "thinking" // Alias for working
  | "analyzing" // Alias for searching
  | "processing" // Alias for solving
  | "pulse" // Alias for pulsing
  | "beacon" // Alias for pulsing
  | "swarm" // Alias for vortex
  | "nucleus" // Alias for atom
  | "dna" // Alias for helix
  | "sonar" // Alias for radar
  | "nebula" // Alias for galaxy
  | "spiral" // Alias for galaxy
  | "donut" // Alias for torus
  | "ring_torus" // Alias for torus
  | "matrix" // Alias for quantum
  | "cube" // Alias for quantum
  | "constellation" // Alias for network
  | "nodes" // Alias for network
  | "burst" // Alias for supernova
  | "spark"; // Alias for supernova

export type OrbSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type OrbTheme = "auto" | "dark" | "light";

export const orbVariants = cva(
  "relative inline-flex items-center justify-center select-none shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "",
        expressive: "filter drop-shadow-[0_0_6px_currentColor]",
        classic: "",
        sharp: "",
        diamond: "",
        ring: "",
        cross: "",
      },
      intent: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-muted-foreground",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
        info: "text-info",
      },
      size: {
        xs: "size-4", // 16px
        sm: "size-6", // 24px
        md: "size-10", // 40px
        lg: "size-16", // 64px
        xl: "size-24", // 96px
        "2xl": "size-32", // 128px
      },
      glow: {
        none: "",
        subtle: "filter drop-shadow-[0_0_8px_currentColor]",
        intense: "filter drop-shadow-[0_0_16px_currentColor]",
      },
    },
    defaultVariants: {
      variant: "default",
      intent: "default",
      size: "lg",
      glow: "none",
    },
  },
);

const SIZE_MAP: Record<OrbSize, number> = {
  xs: 16,
  sm: 24,
  md: 40,
  lg: 64,
  xl: 96,
  "2xl": 128,
};

type ModeKey =
  | "orbits"
  | "globe"
  | "rubik"
  | "wave"
  | "ribbon"
  | "morph"
  | "pulse"
  | "vortex"
  | "atom"
  | "helix"
  | "radar"
  | "galaxy"
  | "torus"
  | "quantum"
  | "network"
  | "supernova";

const STATE_ALIAS_MAP: Record<OrbState, ModeKey> = {
  working: "orbits",
  thinking: "orbits",
  searching: "globe",
  analyzing: "globe",
  solving: "rubik",
  processing: "rubik",
  listening: "wave",
  composing: "ribbon",
  shaping: "morph",
  pulsing: "pulse",
  pulse: "pulse",
  beacon: "pulse",
  vortex: "vortex",
  swarm: "vortex",
  atom: "atom",
  nucleus: "atom",
  helix: "helix",
  dna: "helix",
  radar: "radar",
  sonar: "radar",
  galaxy: "galaxy",
  nebula: "galaxy",
  spiral: "galaxy",
  torus: "torus",
  donut: "torus",
  ring_torus: "torus",
  quantum: "quantum",
  matrix: "quantum",
  cube: "quantum",
  network: "network",
  constellation: "network",
  nodes: "network",
  supernova: "supernova",
  burst: "supernova",
  spark: "supernova",
};

const STATE_LABELS: Record<string, string> = {
  working: "Working…",
  thinking: "Thinking…",
  searching: "Searching…",
  analyzing: "Analyzing…",
  solving: "Solving…",
  processing: "Processing…",
  listening: "Listening…",
  composing: "Composing…",
  shaping: "Shaping…",
  pulsing: "Pulsing…",
  pulse: "Pulsing…",
  beacon: "Beacon…",
  vortex: "Swirling…",
  swarm: "Swarming…",
  atom: "Atom Core…",
  nucleus: "Nucleus…",
  helix: "DNA Helix…",
  dna: "DNA Helix…",
  radar: "Scanning Radar…",
  sonar: "Sonar Sweep…",
  galaxy: "Spiral Galaxy…",
  nebula: "Cosmic Nebula…",
  spiral: "Spiral Core…",
  torus: "Quantum Torus…",
  donut: "Donut Lattice…",
  ring_torus: "Ring Torus…",
  quantum: "Tesseract Matrix…",
  matrix: "Matrix Grid…",
  cube: "Quantum Cube…",
  network: "Node Network…",
  constellation: "Constellation…",
  nodes: "Active Nodes…",
  supernova: "Supernova Burst…",
  burst: "Star Burst…",
  spark: "Starlight Spark…",
};

const MODE_BASE_SPEED: Record<ModeKey, number> = {
  orbits: 1.885,
  globe: 2.015,
  rubik: 1.82,
  wave: 4.388,
  ribbon: 2.34,
  morph: 2.405,
  pulse: 1.5,
  vortex: 1.5,
  atom: 1.2,
  helix: 1.4,
  radar: 1.2,
  galaxy: 1.6,
  torus: 1.8,
  quantum: 1.4,
  network: 1.5,
  supernova: 2.0,
};

// ============================================================================
// Math & Presets Engine (0-Allocation Memory Architecture)
// ============================================================================

interface Dot {
  x: number;
  y: number;
  z: number;
  r: number;
  white: number;
  a: number;
}

const MAX_DOTS = 1200;
const DOT_BUFFER: Dot[] = Array.from({ length: MAX_DOTS }, () => ({
  x: 0,
  y: 0,
  z: 0,
  r: 0,
  white: 0,
  a: 1,
}));
let dotCount = 0;

function resetDotBuffer() {
  dotCount = 0;
}

function pushDot(
  x: number,
  y: number,
  z: number,
  r: number,
  white: number,
  a = 1,
) {
  if (dotCount >= MAX_DOTS) return;
  const d = DOT_BUFFER[dotCount++];
  d.x = x;
  d.y = y;
  d.z = z;
  d.r = r;
  d.white = white;
  d.a = a;
}

function hashD(a: number, b: number): number {
  const h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

function fibDir(i: number, n: number): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (2 * (i + 0.5)) / n;
  const rad = Math.sqrt(Math.max(0, 1 - y * y));
  const a = i * golden;
  return [rad * Math.cos(a), y, rad * Math.sin(a)];
}

function angleDelta(a: number, b: number): number {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

function radiusScale(size: number, pow = 0.6): number {
  return (size / 300) ** pow;
}

type Projector = (x: number, y: number, z: number) => [number, number, number];

function makeProj(
  yaw: number,
  tilt: number,
  cx: number,
  cy: number,
  scale: number,
): Projector {
  const st = Math.sin(tilt);
  const ct = Math.cos(tilt);
  const sy = Math.sin(yaw);
  const cyw = Math.cos(yaw);
  return (x, y, z) => {
    const x1 = x * cyw + z * sy;
    const z1 = -x * sy + z * cyw;
    const y1 = y * ct - z1 * st;
    const z2 = y * st + z1 * ct;
    return [cx + x1 * scale, cy - y1 * scale, z2];
  };
}

function paintDots(
  ctx: CanvasRenderingContext2D,
  dark: boolean,
  rMin = 0.3,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  if (dotCount === 0) return;

  for (let i = 1; i < dotCount; i++) {
    const key = DOT_BUFFER[i];
    let j = i - 1;
    while (j >= 0 && DOT_BUFFER[j].z > key.z) {
      DOT_BUFFER[j + 1] = DOT_BUFFER[j];
      j--;
    }
    DOT_BUFFER[j + 1] = key;
  }

  for (let i = 0; i < dotCount; i++) {
    const d = DOT_BUFFER[i];
    if (d.a < 0.02) continue;
    const w = Math.min(1, Math.max(0, d.white));
    const radius = Math.max(rMin, styleVariant === "classic" ? d.r * 0.8 : d.r);

    if (customRgb) {
      const depthFactor = dark ? 1 - w : w;
      const alphaBoost = styleVariant === "expressive" ? 1.25 : 1;
      const alpha = Math.min(
        1,
        Math.max(0, d.a * (0.3 + 0.7 * depthFactor) * alphaBoost),
      );
      ctx.fillStyle = `rgba(${customRgb[0]},${customRgb[1]},${customRgb[2]},${alpha})`;
    } else {
      const depthFactor = dark ? 1 - w : w;
      const alphaBoost = styleVariant === "expressive" ? 1.2 : 1;
      const g = Math.round(depthFactor * 255);
      const alpha = Math.min(1, Math.max(0, d.a * alphaBoost));
      ctx.fillStyle = `rgba(${g},${g},${g},${alpha})`;
    }

    if (styleVariant === "sharp") {
      const sz = radius * 1.8;
      ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz);
    } else if (styleVariant === "diamond") {
      const sz = radius * 1.8;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - sz / 2);
      ctx.lineTo(d.x + sz / 2, d.y);
      ctx.lineTo(d.x, d.y + sz / 2);
      ctx.lineTo(d.x - sz / 2, d.y);
      ctx.closePath();
      ctx.fill();
    } else if (styleVariant === "ring") {
      ctx.beginPath();
      ctx.arc(d.x, d.y, Math.max(1, radius), 0, Math.PI * 2);
      ctx.lineWidth = Math.max(0.8, radius * 0.4);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
    } else if (styleVariant === "cross") {
      const sz = radius * 1.6;
      ctx.beginPath();
      ctx.moveTo(d.x - sz, d.y);
      ctx.lineTo(d.x + sz, d.y);
      ctx.moveTo(d.x, d.y - sz);
      ctx.lineTo(d.x, d.y + sz);
      ctx.lineWidth = Math.max(0.8, radius * 0.35);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// --- Mode Options & Scaling ---

interface ModeOpts {
  [key: string]: number | undefined;
}

const BASE_PROFILES: Record<string, ModeOpts> = {
  globe: {
    latRings: 17,
    lonDensity: 44,
    rBase: 0.6,
    rDepth: 1.7,
    rBoost: 1.0,
    inkFar: 0.62,
    inkSpan: 0.54,
    rsPow: 0.6,
    rMin: 0.3,
    scanMul: 4.08,
    dimBase: 0.45,
  },
  orbits: {
    orbitN: 12,
    ghostN: 40,
    ghostR: 0.9,
    ghostA: 0.5,
    particles: 3,
    partR: 1.2,
    partRDepth: 1.6,
    rsPow: 0.6,
    rMin: 0.3,
  },
  rubik: {
    latRings: 15,
    lonDensity: 40,
    moveCount: 14,
    rBase: 0.6,
    rDepth: 1.7,
    rActive: 0.3,
    inkFar: 0.62,
    inkSpan: 0.54,
    rsPow: 0.6,
    rMin: 0.3,
  },
  wave: {
    rings: 15,
    lonDensity: 40,
    rBase: 0.6,
    rDepth: 1.7,
    rsPow: 0.6,
    rMin: 0.3,
  },
  ribbon: {
    lanes: 5,
    segs: 88,
    ghostN: 150,
    rBase: 1.1,
    rDepth: 1.7,
    rsPow: 0.6,
    rMin: 0.3,
    spin: 0,
    bandMul: 3.9,
    wobMul: 1,
  },
  morph: { rDot: 0.021, iconD: 1, rMin: 0.25, spread: 1.45 },
  pulse: {
    rings: 16,
    lonDensity: 40,
    rBase: 0.7,
    rDepth: 1.6,
    rsPow: 0.6,
    rMin: 0.3,
  },
  vortex: { particles: 180, rBase: 0.8, rDepth: 1.8, rsPow: 0.6, rMin: 0.3 },
  atom: {
    orbits: 4,
    ghostN: 32,
    partR: 1.4,
    nucleusN: 30,
    rsPow: 0.6,
    rMin: 0.3,
  },
  helix: {
    strands: 2,
    turns: 3,
    segs: 70,
    rBase: 0.8,
    rDepth: 1.6,
    rsPow: 0.6,
    rMin: 0.3,
  },
  radar: {
    rings: 5,
    segs: 48,
    scanSpeed: 2.2,
    rBase: 0.7,
    rDepth: 1.5,
    rsPow: 0.6,
    rMin: 0.3,
  },
  galaxy: {
    stars: 220,
    arms: 2,
    rBase: 0.75,
    rDepth: 1.7,
    rsPow: 0.6,
    rMin: 0.3,
  },
  torus: {
    rings: 16,
    segs: 36,
    rBase: 0.7,
    rDepth: 1.6,
    rsPow: 0.6,
    rMin: 0.3,
  },
  quantum: {
    nodes: 16,
    segsPerEdge: 8,
    rBase: 0.8,
    rDepth: 1.6,
    rsPow: 0.6,
    rMin: 0.3,
  },
  network: {
    hubs: 30,
    segsPerLink: 7,
    rBase: 0.75,
    rDepth: 1.6,
    rsPow: 0.6,
    rMin: 0.3,
  },
  supernova: {
    rays: 140,
    rBase: 0.85,
    rDepth: 1.8,
    rsPow: 0.6,
    rMin: 0.3,
  },
};

function resolveOptsForSize(mode: string, size: number): ModeOpts {
  const base = BASE_PROFILES[mode] || BASE_PROFILES.orbits;
  const countScale =
    size <= 20 ? 0.25 : size >= 64 ? 1 : 0.25 + 0.75 * ((size - 20) / 44);
  const sizeScale =
    size <= 20 ? 1.8 : size >= 64 ? 1 : 1.8 - 0.8 * ((size - 20) / 44);

  const opts: ModeOpts = { ...base };

  if (opts.latRings != null && opts.lonDensity != null) {
    const rt = Math.sqrt(countScale);
    opts.latRings = Math.max(3, Math.round(opts.latRings * rt));
    opts.lonDensity = Math.max(6, Math.round(opts.lonDensity * rt));
  }
  if (opts.orbitN != null)
    opts.orbitN = Math.max(2, Math.round(opts.orbitN * countScale));
  if (opts.ghostN != null)
    opts.ghostN = Math.max(10, Math.round(opts.ghostN * countScale));
  if (opts.particles != null)
    opts.particles = Math.max(20, Math.round(opts.particles * countScale));
  if (opts.stars != null)
    opts.stars = Math.max(30, Math.round(opts.stars * countScale));
  if (opts.rays != null)
    opts.rays = Math.max(24, Math.round(opts.rays * countScale));

  if (opts.rBase != null) opts.rBase *= sizeScale;
  if (opts.rDepth != null) opts.rDepth *= sizeScale;
  if (opts.ghostR != null) opts.ghostR *= sizeScale;
  if (opts.partR != null) opts.partR *= sizeScale;

  return opts;
}

// --- Pre-calculated Rubik Moves ---
interface Move {
  axis: 0 | 1 | 2;
  lo: number;
  hi: number;
  ang: number;
}
const STATIC_RUBIK_MOVES: Move[] = Array.from({ length: 20 }, (_, i) => {
  const axis = Math.min(2, Math.floor(hashD(i, 2.3) * 3)) as 0 | 1 | 2;
  const lo = -1.0 + 0.5 * Math.min(3, Math.floor(hashD(i, 5.9) * 4));
  const dir = hashD(i, 7.7) < 0.5 ? 1 : -1;
  return { axis, lo, hi: lo + 0.5, ang: (dir * Math.PI) / 2 };
});

const STATIC_AMOUNT_BUFFER = new Float32Array(20);

function solveCycle(
  time: number,
  count: number,
  slotDur: number,
  rest: number,
) {
  const cyc = 2 * count * slotDur + rest;
  const tc = time % cyc;
  STATIC_AMOUNT_BUFFER.fill(0);
  let active = -1;
  if (tc < 2 * count * slotDur) {
    const slot = Math.floor(tc / slotDur);
    const p = (tc - slot * slotDur) / slotDur;
    const cl = Math.min(1, p / 0.7);
    const ep = 1 - (1 - cl) ** 3;
    if (slot < count) {
      for (let i = 0; i < slot; i++) STATIC_AMOUNT_BUFFER[i] = 1;
      STATIC_AMOUNT_BUFFER[slot] = ep;
      active = slot;
    } else {
      const u = 2 * count - 1 - slot;
      for (let i = 0; i < u; i++) STATIC_AMOUNT_BUFFER[i] = 1;
      STATIC_AMOUNT_BUFFER[u] = 1 - ep;
      active = u;
    }
  }
  return active;
}

function applyRubikMoves(
  pt3: [number, number, number],
  moveCount: number,
  activeIdx: number,
): [number, number, number, boolean] {
  let [x, y, z] = pt3;
  let inActive = false;
  for (let i = 0; i < moveCount; i++) {
    const amt = STATIC_AMOUNT_BUFFER[i];
    if (amt <= 0) continue;
    const mv = STATIC_RUBIK_MOVES[i];
    const coord = mv.axis === 0 ? x : mv.axis === 1 ? y : z;
    if (coord < mv.lo || coord >= mv.hi) continue;
    if (i === activeIdx) inActive = true;
    const a = mv.ang * amt;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    if (mv.axis === 0) {
      const y2 = y * ca - z * sa;
      z = y * sa + z * ca;
      y = y2;
    } else if (mv.axis === 1) {
      const x2 = x * ca + z * sa;
      z = -x * sa + z * ca;
      x = x2;
    } else {
      const x2 = x * ca - y * sa;
      y = x * sa + y * ca;
      x = x2;
    }
  }
  return [x, y, z, inActive];
}

// --- Pre-calculated Morph Paths ---
type MorphPath = (f: number) => [number, number];

const MORPH_CIRCLE: MorphPath = (f) => {
  const a = -Math.PI / 2 + f * 2 * Math.PI;
  return [Math.cos(a) * 0.24, Math.sin(a) * 0.24];
};

function createPolyPath(
  verts: ReadonlyArray<readonly [number, number]>,
): MorphPath {
  const V = verts.length;
  const L: number[] = [];
  let total = 0;
  for (let i = 0; i < V; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % V];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    L.push(l);
    total += l;
  }
  return (f) => {
    let target = f * total;
    let i = 0;
    while (target > L[i] && i < V - 1) {
      target -= L[i];
      i++;
    }
    const a = verts[i];
    const b = verts[(i + 1) % V];
    const ff = L[i] ? Math.min(1, target / L[i]) : 0;
    return [a[0] + (b[0] - a[0]) * ff, a[1] + (b[1] - a[1]) * ff];
  };
}

const MORPH_TRIANGLE = createPolyPath([
  [0.0, -0.26],
  [0.24, 0.16],
  [-0.24, 0.16],
]);
const MORPH_SQUARE = createPolyPath([
  [0, -0.2],
  [0.2, -0.2],
  [0.2, 0.2],
  [-0.2, 0.2],
  [-0.2, -0.2],
]);
const MORPH_CYCLE: MorphPath[] = [MORPH_CIRCLE, MORPH_TRIANGLE, MORPH_SQUARE];

const MORPH_SAMPLES = 160;
const STATIC_MORPH_PTS: [number, number][] = Array.from(
  { length: MORPH_SAMPLES },
  () => [0, 0],
);
const STATIC_MORPH_L = new Float32Array(MORPH_SAMPLES);

// ============================================================================
// State Drawer Implementations (16 Modes)
// ============================================================================

function drawOrbitsMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(t * 0.12, 0.3, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const orbitN = o.orbitN ?? 8;
  const ghostN = o.ghostN ?? 24;
  const particles = o.particles ?? 3;

  for (let orb = 0; orb < orbitN; orb++) {
    const h1 = hashD(orb, 1.7);
    const h2 = hashD(orb, 5.2);
    const h3 = hashD(orb, 8.9);
    const ro = R * (0.45 + 0.52 * h1);
    const th = h1 * 2 * Math.PI;
    const phi = Math.acos(2 * h2 - 1);

    const nx = Math.sin(phi) * Math.cos(th);
    const ny = Math.cos(phi);
    const nz = Math.sin(phi) * Math.sin(th);
    let ux = -ny;
    let uy = nx;
    const uz = 0;
    const ul = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy));
    ux /= ul;
    uy /= ul;
    const vx = ny * uz - nz * uy;
    const vy = nz * ux - nx * uz;
    const vz = nx * uy - ny * ux;
    const speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1);

    for (let k = 0; k < ghostN; k++) {
      const a = (k / ghostN) * 2 * Math.PI;
      const [px, py, z] = pt(
        (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
        (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
        (uz * Math.cos(a) + vz * Math.sin(a)) * ro,
      );
      const depth = (z / ro + 1) / 2;
      pushDot(
        px,
        py,
        z,
        (o.ghostR ?? 0.9) * rs,
        0.72,
        (o.ghostA ?? 0.5) * (0.4 + 0.6 * depth),
      );
    }

    for (let m = 0; m < particles; m++) {
      const a = t * speed + (m / particles) * 2 * Math.PI + h2 * 6;
      const [px, py, z] = pt(
        (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
        (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
        (uz * Math.cos(a) + vz * Math.sin(a)) * ro,
      );
      const depth = (z / ro + 1) / 2;
      pushDot(
        px,
        py,
        z,
        ((o.partR ?? 1.2) + (o.partRDepth ?? 1.6) * depth) * rs,
        0.3 - 0.22 * depth,
        1,
      );
    }
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawGlobeMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const spin = 0.5;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.82;
  const tilt = 0.4 + 0.06 * Math.sin(t * 0.35);
  const pt = makeProj(t * spin, tilt, cx, cy, radius);
  const scan = t * (spin + (1.7 - spin) * (o.scanMul ?? 4.08));
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const dimBase = o.dimBase ?? 0.45;

  resetDotBuffer();
  const latRings = o.latRings ?? 12;
  const lonDensity = o.lonDensity ?? 28;
  for (let li = 0; li <= latRings; li++) {
    const lat = -Math.PI / 2 + (li / latRings) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const lonCount = Math.max(1, Math.round(Math.abs(cosLat) * lonDensity));
    for (let lj = 0; lj < lonCount; lj++) {
      const lon = (lj / lonCount) * 2 * Math.PI;
      const [px, py, z] = pt(
        cosLat * Math.cos(lon),
        sinLat,
        cosLat * Math.sin(lon),
      );
      const depth = (z + 1) / 2;
      const d = angleDelta(lon + t * spin, scan);
      const boost = Math.exp(-(d * d) / 0.18) * Math.max(0, z);
      pushDot(
        px,
        py,
        z,
        ((o.rBase ?? 0.6) +
          (o.rDepth ?? 1.7) * depth +
          (o.rBoost ?? 1) * boost) *
          rs,
        (o.inkFar ?? 0.62) - (o.inkSpan ?? 0.54) * depth,
        dimBase + (1 - dimBase) * Math.min(1, boost),
      );
    }
  }
  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawRubikMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(t * 0.55, 0.35 + 0.1 * Math.sin(t * 0.9), cx, cy, R);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const moveCount = Math.min(20, o.moveCount ?? 14);
  const activeIdx = solveCycle(t, moveCount, 0.42, 1.2);

  resetDotBuffer();
  const latRings = o.latRings ?? 12;
  const lonDensity = o.lonDensity ?? 28;
  for (let li = 0; li <= latRings; li++) {
    const lat = -Math.PI / 2 + (li / latRings) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const lonCount = Math.max(1, Math.round(Math.abs(cosLat) * lonDensity));
    for (let lj = 0; lj < lonCount; lj++) {
      const lon = (lj / lonCount) * 2 * Math.PI;
      const [x, y, z, inActive] = applyRubikMoves(
        [cosLat * Math.cos(lon), sinLat, cosLat * Math.sin(lon)],
        moveCount,
        activeIdx,
      );
      const [px, py, zr] = pt(x, y, z);
      const depth = (zr + 1) / 2;
      pushDot(
        px,
        py,
        zr,
        ((o.rBase ?? 0.6) +
          (o.rDepth ?? 1.7) * depth +
          (inActive ? (o.rActive ?? 0.3) : 0)) *
          rs,
        (o.inkFar ?? 0.62) -
          (o.inkSpan ?? 0.54) * depth -
          (inActive ? 0.14 : 0),
        1,
      );
    }
  }
  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawWaveMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.874;
  const pt = makeProj(t * 0.18, 0.38, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const rings = o.rings ?? 12;
  const lonDensity = o.lonDensity ?? 28;
  for (let ri = 0; ri <= rings; ri++) {
    const lat = -Math.PI / 2 + (ri / rings) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const w =
      0.62 * Math.sin(t * 2.1 - ri * 0.52) +
      0.38 * Math.sin(t * 1.27 + ri * 0.83);
    const rr = R * (0.88 + 0.105 * w);
    const lonCount = Math.max(1, Math.round(Math.abs(cosLat) * lonDensity));
    for (let lj = 0; lj < lonCount; lj++) {
      const lon = (lj / lonCount) * 2 * Math.PI;
      const [px, py, z] = pt(
        cosLat * Math.cos(lon) * rr,
        sinLat * rr,
        cosLat * Math.sin(lon) * rr,
      );
      const depth = (z / R + 1) / 2;
      const crest = Math.max(0, w);
      pushDot(
        px,
        py,
        z,
        ((o.rBase ?? 0.6) + (o.rDepth ?? 1.7) * depth) * (1 + 0.4 * crest) * rs,
        0.66 - 0.56 * depth - 0.1 * crest,
        1,
      );
    }
  }
  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawRibbonMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.78;
  const spin = o.spin ?? 0;
  const pt = makeProj(t * 0.1 * spin, 0.3, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const ghostN = o.ghostN ?? 100;
  for (let i = 0; i < ghostN; i++) {
    const d = fibDir(i, ghostN);
    const [px, py, z] = pt(d[0] * R, d[1] * R, d[2] * R);
    const depth = (z / R + 1) / 2;
    pushDot(px, py, z, 0.8 * rs, 0.78, 0.1 + 0.22 * depth);
  }

  const ya = t * 0.24;
  const ta = 0.55 + 0.3 * Math.sin(t * 0.18);
  const ux = Math.cos(ya);
  const uy = 0;
  const uz = Math.sin(ya);
  const vx = -uz * Math.sin(ta);
  const vy = Math.cos(ta);
  const vz = ux * Math.sin(ta);
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;

  const baseLanes = o.lanes ?? 4;
  const segs = o.segs ?? 60;
  const lanes = Math.max(1, Math.round(baseLanes * (o.bandMul ?? 3.9)));
  for (let w = 0; w < lanes; w++) {
    const laneOff = (w - (lanes - 1) / 2) * 0.075;
    const edge = Math.abs(w - (lanes - 1) / 2) / Math.max(1, (lanes - 1) / 2);
    for (let k = 0; k < segs; k++) {
      const a = (k / segs) * 2 * Math.PI;
      const wob =
        (0.16 * Math.sin(a * 3 - t * 1.7 + w * 0.22) +
          0.07 * Math.sin(a * 5 + t * 1.1)) *
        (o.wobMul ?? 1);
      const off = laneOff + wob;
      const x = ux * Math.cos(a) + vx * Math.sin(a) + nx * off;
      const y = uy * Math.cos(a) + vy * Math.sin(a) + ny * off;
      const z = uz * Math.cos(a) + vz * Math.sin(a) + nz * off;
      const l = Math.sqrt(x * x + y * y + z * z);
      const [px, py, zr] = pt((x / l) * R, (y / l) * R, (z / l) * R);
      const depth = (zr / R + 1) / 2;
      pushDot(
        px,
        py,
        zr,
        ((o.rBase ?? 1.1) + (o.rDepth ?? 1.7) * depth) * (1 - 0.25 * edge) * rs,
        0.52 - 0.44 * depth + 0.18 * edge,
        0.4 + 0.6 * depth,
      );
    }
  }
  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawMorphMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const K = MORPH_CYCLE.length;
  const HOLD = 1.4;
  const MORPH = 0.9;
  const SEG = HOLD + MORPH;

  const tc = t % (SEG * K);
  const k = Math.floor(tc / SEG);
  const local = tc - k * SEG;
  const m = local > HOLD ? (local - HOLD) / MORPH : 0;
  const smoothM = m * m * (3 - 2 * m);
  const sprd = o.spread ?? 1.45;

  const pA = MORPH_CYCLE[k];
  const pB = MORPH_CYCLE[(k + 1) % K];

  let totalL = 0;
  for (let i = 0; i < MORPH_SAMPLES; i++) {
    const f = i / MORPH_SAMPLES;
    const a = pA(f);
    const b = pB(f);
    STATIC_MORPH_PTS[i][0] = (a[0] + (b[0] - a[0]) * smoothM) * sprd;
    STATIC_MORPH_PTS[i][1] = (a[1] + (b[1] - a[1]) * smoothM) * sprd;
  }
  for (let i = 0; i < MORPH_SAMPLES; i++) {
    const a = STATIC_MORPH_PTS[i];
    const b = STATIC_MORPH_PTS[(i + 1) % MORPH_SAMPLES];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    STATIC_MORPH_L[i] = l;
    totalL += l;
  }

  const n = Math.max(8, Math.round(28 * (o.iconD ?? 1)));
  const re = (o.rDot ?? 0.021) * 1.35 * sprd;
  const pulse = 1 + 0.02 * Math.sin(local * 3.1);

  resetDotBuffer();
  const c2 = size / 2;
  let seg = 0;
  let acc = 0;
  for (let k2 = 0; k2 < n; k2++) {
    const target = (k2 / n) * totalL;
    while (acc + STATIC_MORPH_L[seg] < target && seg < MORPH_SAMPLES - 1) {
      acc += STATIC_MORPH_L[seg];
      seg++;
    }
    const a = STATIC_MORPH_PTS[seg];
    const b = STATIC_MORPH_PTS[(seg + 1) % MORPH_SAMPLES];
    const f = STATIC_MORPH_L[seg]
      ? Math.min(1, (target - acc) / STATIC_MORPH_L[seg])
      : 0;
    const x = (a[0] + (b[0] - a[0]) * f) * pulse;
    const y = (a[1] + (b[1] - a[1]) * f) * pulse;
    pushDot(c2 + x * size, c2 + y * size, 0, Math.max(0.35, re * size), 0.1, 1);
  }
  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawPulseMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(t * 0.25, 0.35, cx, cy, R);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const latRings = o.latRings ?? 14;
  const lonDensity = o.lonDensity ?? 32;
  const breathe = 0.88 + 0.14 * Math.sin(t * 2.5);

  for (let li = 0; li <= latRings; li++) {
    const lat = -Math.PI / 2 + (li / latRings) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const lonCount = Math.max(1, Math.round(Math.abs(cosLat) * lonDensity));
    const shockwave = Math.max(0, Math.sin(t * 3 - li * 0.4));

    for (let lj = 0; lj < lonCount; lj++) {
      const lon = (lj / lonCount) * 2 * Math.PI;
      const [px, py, z] = pt(
        cosLat * Math.cos(lon) * breathe,
        sinLat * breathe,
        cosLat * Math.sin(lon) * breathe,
      );
      const depth = (z + 1) / 2;
      pushDot(
        px,
        py,
        z,
        ((o.rBase ?? 0.7) + (o.rDepth ?? 1.6) * depth + shockwave * 0.6) * rs,
        0.65 - 0.5 * depth - shockwave * 0.15,
        0.4 + 0.6 * depth,
      );
    }
  }
  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawVortexMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(t * 0.3, 0.45, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const particles = o.particles ?? 120;

  for (let i = 0; i < particles; i++) {
    const frac = i / particles;
    const angle = t * 1.5 + frac * Math.PI * 8;
    const r = R * frac ** 0.7;
    const h = (1 - frac) * R * 0.6 * Math.sin(t * 0.8 + frac * 4);

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = h;

    const [px, py, pz] = pt(x, y, z);
    const depth = (pz / R + 1) / 2;
    pushDot(
      px,
      py,
      pz,
      ((o.rBase ?? 0.8) + (o.rDepth ?? 1.8) * depth * (1 - frac * 0.4)) * rs,
      0.6 - 0.5 * depth,
      0.3 + 0.7 * frac,
    );
  }
  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawAtomMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(t * 0.15, 0.3, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();

  const nPoints = o.nucleusN ?? 24;
  for (let i = 0; i < nPoints; i++) {
    const d = fibDir(i, nPoints);
    const pulse = 0.22 * R * (1 + 0.08 * Math.sin(t * 4 + i));
    const [px, py, z] = pt(d[0] * pulse, d[1] * pulse, d[2] * pulse);
    const depth = (z / R + 1) / 2;
    pushDot(px, py, z, 1.6 * rs, 0.25 - 0.15 * depth, 1);
  }

  const orbitCount = o.orbits ?? 4;
  const ghostN = o.ghostN ?? 28;

  for (let orb = 0; orb < orbitCount; orb++) {
    const angleOffset = (orb / orbitCount) * Math.PI;
    const tilt = 0.6 * Math.sin(angleOffset);
    const speed = 2.4 * (orb % 2 === 0 ? 1 : -1);

    const ux = Math.cos(angleOffset);
    const uy = Math.sin(angleOffset) * Math.cos(tilt);
    const uz = Math.sin(angleOffset) * Math.sin(tilt);

    const vx = -Math.sin(angleOffset);
    const vy = Math.cos(angleOffset) * Math.cos(tilt);
    const vz = Math.cos(angleOffset) * Math.sin(tilt);

    for (let k = 0; k < ghostN; k++) {
      const a = (k / ghostN) * 2 * Math.PI;
      const x = (ux * Math.cos(a) + vx * Math.sin(a)) * R;
      const y = (uy * Math.cos(a) + vy * Math.sin(a)) * R;
      const z = (uz * Math.cos(a) + vz * Math.sin(a)) * R;
      const [px, py, zr] = pt(x, y, z);
      const depth = (zr / R + 1) / 2;
      pushDot(px, py, zr, 0.8 * rs, 0.7, 0.25 + 0.35 * depth);
    }

    const ea = t * speed + orb * 1.5;
    const ex = (ux * Math.cos(ea) + vx * Math.sin(ea)) * R;
    const ey = (uy * Math.cos(ea) + vy * Math.sin(ea)) * R;
    const ez = (uz * Math.cos(ea) + vz * Math.sin(ea)) * R;
    const [epx, epy, ezr] = pt(ex, ey, ez);
    const _edepth = (ezr / R + 1) / 2;
    pushDot(epx, epy, ezr, (o.partR ?? 1.8) * rs, 0.15, 1);
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawHelixMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(0.2, 0.25, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const segs = o.segs ?? 54;
  const strands = o.strands ?? 2;

  for (let s = 0; s < strands; s++) {
    const strandPhase = (s / strands) * Math.PI * 2;
    for (let i = 0; i < segs; i++) {
      const frac = i / segs;
      const y = (frac - 0.5) * R * 1.6;
      const angle = t * 2 + frac * Math.PI * 5 + strandPhase;
      const radius = R * 0.45;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const [px, py, zr] = pt(x, y, z);
      const depth = (zr / R + 1) / 2;
      pushDot(
        px,
        py,
        zr,
        ((o.rBase ?? 0.8) + (o.rDepth ?? 1.6) * depth) * rs,
        0.6 - 0.5 * depth,
        0.3 + 0.7 * depth,
      );

      if (s === 0 && i % 4 === 0) {
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;
        for (let r = 1; r <= 3; r++) {
          const rf = r / 4;
          const rx = x + (x2 - x) * rf;
          const rz = z + (z2 - z) * rf;
          const [rpx, rpy, rzr] = pt(rx, y, rz);
          const rdepth = (rzr / R + 1) / 2;
          pushDot(rpx, rpy, rzr, 0.6 * rs, 0.75, 0.15 + 0.25 * rdepth);
        }
      }
    }
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawRadarMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(0.1, 0.5, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const rings = o.rings ?? 4;
  const segs = o.segs ?? 36;
  const sweepAngle = (t * (o.scanSpeed ?? 2.2)) % (Math.PI * 2);

  for (let r = 1; r <= rings; r++) {
    const ringRadius = R * (r / rings);
    for (let k = 0; k < segs; k++) {
      const a = (k / segs) * 2 * Math.PI;
      const d = angleDelta(a, sweepAngle);
      const intensity = Math.max(0.1, Math.exp(-(d * d) / 0.25));

      const x = Math.cos(a) * ringRadius;
      const z = Math.sin(a) * ringRadius;
      const [px, py, zr] = pt(x, 0, z);
      const depth = (zr / R + 1) / 2;

      pushDot(
        px,
        py,
        zr,
        ((o.rBase ?? 0.7) + (o.rDepth ?? 1.5) * depth + intensity * 0.8) * rs,
        0.65 - 0.5 * depth - intensity * 0.2,
        0.2 + 0.8 * intensity,
      );
    }
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

// --- NEW MODES: Galaxy, Torus, Quantum, Network, Supernova ---

function drawGalaxyMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(t * 0.2, 0.45 + 0.08 * Math.sin(t * 0.3), cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const totalStars = o.stars ?? 180;
  const arms = o.arms ?? 2;

  // 1. Central Galactic Core Bulge
  for (let i = 0; i < 28; i++) {
    const d = fibDir(i, 28);
    const cr = R * 0.2 * (0.4 + 0.6 * hashD(i, 1.1));
    const [px, py, z] = pt(d[0] * cr, d[1] * cr, d[2] * cr);
    const depth = (z / R + 1) / 2;
    pushDot(px, py, z, 1.7 * rs, 0.15 - 0.1 * depth, 1);
  }

  // 2. Spiral Arms
  for (let i = 0; i < totalStars; i++) {
    const arm = i % arms;
    const frac = (i / totalStars) ** 0.85;
    const r = R * (0.22 + 0.78 * frac);
    const armOffset = (arm / arms) * Math.PI * 2;
    const theta = Math.log(r / R + 0.1) * 2.8 + armOffset + t * 0.8;

    const spread = (hashD(i, 4.3) - 0.5) * 0.2 * (1 - frac * 0.5);
    const x = Math.cos(theta + spread) * r;
    const z = Math.sin(theta + spread) * r;
    const y = (hashD(i, 8.7) - 0.5) * R * 0.15 * (1 - frac);

    const [px, py, pz] = pt(x, y, z);
    const depth = (pz / R + 1) / 2;
    pushDot(
      px,
      py,
      pz,
      ((o.rBase ?? 0.75) + (o.rDepth ?? 1.7) * depth * (1 - frac * 0.3)) * rs,
      0.65 - 0.55 * depth,
      0.35 + 0.65 * (1 - frac * 0.5),
    );
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawTorusMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R_major = (size / 2) * 0.55;
  const R_minor = (size / 2) * 0.25;
  const pt = makeProj(t * 0.25, 0.5 + 0.15 * Math.sin(t * 0.4), cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();
  const majorRings = o.rings ?? 16;
  const segs = o.segs ?? 32;

  for (let i = 0; i < majorRings; i++) {
    const u = (i / majorRings) * Math.PI * 2;
    for (let j = 0; j < segs; j++) {
      const v = (j / segs) * Math.PI * 2;
      const ripple = 0.12 * Math.sin(4 * u + 3 * v - t * 3);

      const x =
        (R_major + (R_minor + ripple * R_minor) * Math.cos(v)) * Math.cos(u);
      const z =
        (R_major + (R_minor + ripple * R_minor) * Math.cos(v)) * Math.sin(u);
      const y = (R_minor + ripple * R_minor) * Math.sin(v);

      const [px, py, pz] = pt(x, y, z);
      const depth = (pz / (R_major + R_minor) + 1) / 2;

      pushDot(
        px,
        py,
        pz,
        ((o.rBase ?? 0.7) + (o.rDepth ?? 1.6) * depth + ripple * 0.4) * rs,
        0.65 - 0.5 * depth - ripple * 0.1,
        0.3 + 0.7 * depth,
      );
    }
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawQuantumMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const S = (size / 2) * 0.65;
  const pt = makeProj(t * 0.3, 0.35 + 0.12 * Math.sin(t * 0.5), cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();

  const corners3D: [number, number, number][] = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  const pulseInner = 0.55 + 0.15 * Math.sin(t * 2);
  const innerCorners = corners3D.map(([x, y, z]) => [
    x * pulseInner,
    y * pulseInner,
    z * pulseInner,
  ]);

  const segs = o.segsPerEdge ?? 7;

  // Outer cube edges
  edges.forEach(([a, b]) => {
    const c1 = corners3D[a];
    const c2 = corners3D[b];
    for (let k = 0; k <= segs; k++) {
      const f = k / segs;
      const x = (c1[0] + (c2[0] - c1[0]) * f) * S * 0.8;
      const y = (c1[1] + (c2[1] - c1[1]) * f) * S * 0.8;
      const z = (c1[2] + (c2[2] - c1[2]) * f) * S * 0.8;
      const [px, py, pz] = pt(x, y, z);
      const depth = (pz / S + 1) / 2;
      const isVertex = k === 0 || k === segs;
      pushDot(
        px,
        py,
        pz,
        (isVertex ? 1.6 : 0.85) * rs,
        isVertex ? 0.1 : 0.6 - 0.4 * depth,
        isVertex ? 1 : 0.4 + 0.6 * depth,
      );
    }
  });

  // Inner hypercube edges
  edges.forEach(([a, b]) => {
    const c1 = innerCorners[a];
    const c2 = innerCorners[b];
    for (let k = 0; k <= segs; k++) {
      const f = k / segs;
      const x = (c1[0] + (c2[0] - c1[0]) * f) * S * 0.8;
      const y = (c1[1] + (c2[1] - c1[1]) * f) * S * 0.8;
      const z = (c1[2] + (c2[2] - c1[2]) * f) * S * 0.8;
      const [px, py, pz] = pt(x, y, z);
      const depth = (pz / S + 1) / 2;
      const isVertex = k === 0 || k === segs;
      pushDot(
        px,
        py,
        pz,
        (isVertex ? 1.3 : 0.7) * rs,
        isVertex ? 0.15 : 0.65 - 0.45 * depth,
        isVertex ? 0.9 : 0.3 + 0.5 * depth,
      );
    }
  });

  // Hyper-connectors between outer and inner
  for (let i = 0; i < 8; i++) {
    const c1 = corners3D[i];
    const c2 = innerCorners[i];
    for (let k = 1; k < segs; k++) {
      const f = k / segs;
      const x = (c1[0] + (c2[0] - c1[0]) * f) * S * 0.8;
      const y = (c1[1] + (c2[1] - c1[1]) * f) * S * 0.8;
      const z = (c1[2] + (c2[2] - c1[2]) * f) * S * 0.8;
      const [px, py, pz] = pt(x, y, z);
      const depth = (pz / S + 1) / 2;
      pushDot(px, py, pz, 0.65 * rs, 0.7, 0.25 + 0.35 * depth);
    }
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawNetworkMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.78;
  const pt = makeProj(t * 0.18, 0.32, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();

  const numHubs = o.hubs ?? 28;
  const hubs: [number, number, number][] = [];
  for (let i = 0; i < numHubs; i++) {
    const d = fibDir(i, numHubs);
    hubs.push([d[0] * R, d[1] * R, d[2] * R]);
  }

  // Draw hubs
  hubs.forEach(([hx, hy, hz], idx) => {
    const [px, py, pz] = pt(hx, hy, hz);
    const depth = (pz / R + 1) / 2;
    const pulse = Math.sin(t * 3 + idx * 0.7) > 0.6;
    pushDot(
      px,
      py,
      pz,
      (pulse ? 1.8 : 1.3) * rs,
      pulse ? 0.1 : 0.3 - 0.2 * depth,
      1,
    );
  });

  // Draw connecting links between close hubs
  const segs = o.segsPerLink ?? 6;
  for (let i = 0; i < numHubs; i++) {
    for (let j = i + 1; j < numHubs; j++) {
      const h1 = hubs[i];
      const h2 = hubs[j];
      const dist = Math.hypot(h1[0] - h2[0], h1[1] - h2[1], h1[2] - h2[2]);
      if (dist < R * 0.85) {
        const signalPos = (t * 1.8 + i * 0.5 + j * 0.3) % 1;
        for (let k = 1; k < segs; k++) {
          const f = k / segs;
          const x = h1[0] + (h2[0] - h1[0]) * f;
          const y = h1[1] + (h2[1] - h1[1]) * f;
          const z = h1[2] + (h2[2] - h1[2]) * f;
          const [px, py, pz] = pt(x, y, z);
          const depth = (pz / R + 1) / 2;
          const isSignal = Math.abs(f - signalPos) < 0.15;
          pushDot(
            px,
            py,
            pz,
            (isSignal ? 1.2 : 0.65) * rs,
            isSignal ? 0.1 : 0.7,
            isSignal ? 1 : 0.2 + 0.4 * depth,
          );
        }
      }
    }
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

function drawSupernovaMode(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  o: ModeOpts,
  customRgb?: [number, number, number] | null,
  styleVariant:
    | "default"
    | "expressive"
    | "classic"
    | "sharp"
    | "diamond"
    | "ring"
    | "cross" = "default",
) {
  const cx = size / 2;
  const cy = size / 2;
  const R_max = (size / 2) * 0.85;
  const pt = makeProj(t * 0.22, 0.4, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  resetDotBuffer();

  const cycle = (t * 1.2) % (Math.PI * 2);
  const expansion = 0.2 + 0.8 * Math.abs(Math.sin(cycle)) ** 2;
  const R_curr = R_max * expansion;

  // 1. Singularity Core
  for (let i = 0; i < 20; i++) {
    const d = fibDir(i, 20);
    const cr = R_max * 0.15 * (1 - expansion * 0.5);
    const [px, py, pz] = pt(d[0] * cr, d[1] * cr, d[2] * cr);
    const _depth = (pz / R_max + 1) / 2;
    pushDot(px, py, pz, 2.0 * rs, 0.05, 1);
  }

  // 2. Bursting Tendril Rays
  const numRays = o.rays ?? 110;
  for (let i = 0; i < numRays; i++) {
    const d = fibDir(i, numRays);
    const rayLength = R_curr * (0.6 + 0.4 * hashD(i, 3.2));
    const [px, py, pz] = pt(
      d[0] * rayLength,
      d[1] * rayLength,
      d[2] * rayLength,
    );
    const depth = (pz / R_max + 1) / 2;
    pushDot(
      px,
      py,
      pz,
      ((o.rBase ?? 0.85) +
        (o.rDepth ?? 1.8) * depth * (1.2 - expansion * 0.4)) *
        rs,
      0.6 - 0.5 * depth,
      0.3 + 0.7 * depth,
    );
  }

  paintDots(ctx, dark, o.rMin, customRgb, styleVariant);
}

// ============================================================================
// Helper Hooks: Color & Theme Resolution
// ============================================================================

function parseColorToRgb(colorStr: string): [number, number, number] | null {
  if (!colorStr) return null;
  if (colorStr.startsWith("#")) {
    let hex = colorStr.slice(1);
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
  }
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
    ];
  }
  return null;
}

function useResolvedDark(
  theme: OrbTheme,
  hostRef: React.RefObject<Element | null>,
): boolean {
  const [dark, setDark] = React.useState(true);

  React.useEffect(() => {
    if (theme === "dark") {
      setDark(true);
      return;
    }
    if (theme === "light") {
      setDark(false);
      return;
    }

    const resolve = () => {
      let node: Element | null = hostRef.current;
      while (node) {
        if (
          node.classList.contains("dark") ||
          node.getAttribute("data-theme") === "dark"
        ) {
          setDark(true);
          return;
        }
        if (
          node.classList.contains("light") ||
          node.getAttribute("data-theme") === "light"
        ) {
          setDark(false);
          return;
        }
        node = node.parentElement;
      }
      const systemDark =
        typeof matchMedia !== "undefined" &&
        matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(systemDark);
    };

    resolve();

    const mq =
      typeof matchMedia !== "undefined"
        ? matchMedia("(prefers-color-scheme: dark)")
        : null;
    const onMq = () => resolve();
    mq?.addEventListener("change", onMq);

    let mo: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined" && hostRef.current) {
      mo = new MutationObserver(resolve);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
        subtree: true,
      });
    }

    return () => {
      mq?.removeEventListener("change", onMq);
      mo?.disconnect();
    };
  }, [theme, hostRef]);

  return dark;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

// ============================================================================
// Component Definition
// ============================================================================

export interface OrbProps
  extends useRender.ComponentProps<"div">, VariantProps<typeof orbVariants> {
  /** AI status state / animation preset @default "working" */
  state?: OrbState;
  /** Explicit pixel size override @default calculated from CVA size */
  pixelSize?: number;
  /** Theme mode resolution @default "auto" */
  theme?: OrbTheme;
  /** Speed multiplier @default 1 */
  speed?: number;
  /** Pause animation loop @default false */
  paused?: boolean;
  /** Custom ink color override (CSS hex, rgb, or color) */
  color?: string;
  /** Interactive hover speed boost @default false */
  interactive?: boolean;
  /** Accessibility label */
  "aria-label"?: string;
}

function Orb({
  className,
  variant = "default",
  intent,
  size = "lg",
  glow,
  state = "working",
  pixelSize,
  theme = "auto",
  speed = 1,
  paused = false,
  color,
  interactive = false,
  render,
  "aria-label": ariaLabel,
  ...props
}: OrbProps): React.ReactElement {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const hoverSpeedRef = React.useRef(1);

  const dark = useResolvedDark(theme, wrapperRef);
  const reduced = useReducedMotion();

  const computedSize = pixelSize ?? (size ? SIZE_MAP[size] : 64);
  const modeKey = STATE_ALIAS_MAP[state] ?? "orbits";
  const styleVariant =
    (variant as
      | "default"
      | "expressive"
      | "classic"
      | "sharp"
      | "diamond"
      | "ring"
      | "cross") || "default";

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(
      2,
      typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1,
    );
    canvas.width = Math.round(computedSize * dpr);
    canvas.height = Math.round(computedSize * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const opts = resolveOptsForSize(modeKey, computedSize);
    const customRgb = parseColorToRgb(color ?? "");
    const baseSpeed = MODE_BASE_SPEED[modeKey] ?? 1.885;

    const renderFrame = (tSec: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, computedSize, computedSize);

      switch (modeKey) {
        case "orbits":
          drawOrbitsMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "globe":
          drawGlobeMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "rubik":
          drawRubikMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "wave":
          drawWaveMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "ribbon":
          drawRibbonMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "morph":
          drawMorphMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "pulse":
          drawPulseMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "vortex":
          drawVortexMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "atom":
          drawAtomMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "helix":
          drawHelixMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "radar":
          drawRadarMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "galaxy":
          drawGalaxyMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "torus":
          drawTorusMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "quantum":
          drawQuantumMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "network":
          drawNetworkMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
        case "supernova":
          drawSupernovaMode(
            ctx,
            computedSize,
            tSec,
            dark,
            opts,
            customRgb,
            styleVariant,
          );
          break;
      }
    };

    if (reduced) {
      renderFrame(0.6);
      return;
    }

    let raf = 0;
    let running = false;
    const startTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const elapsedSec =
        ((now - startTime) / 1000) * baseSpeed * speed * hoverSpeedRef.current;
      renderFrame(elapsedSec);
      if (running) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || paused) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    renderFrame(0);

    let isIntersecting = true;
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            isIntersecting = entry.isIntersecting;
            if (isIntersecting && document.visibilityState !== "hidden")
              start();
            else stop();
          })
        : null;

    if (canvas) observer?.observe(canvas);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") stop();
      else if (isIntersecting) start();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    if (!observer) start();

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    modeKey,
    computedSize,
    dark,
    speed,
    paused,
    reduced,
    color,
    styleVariant,
  ]);

  const handleMouseEnter = () => {
    if (interactive) hoverSpeedRef.current = 1.75;
  };

  const handleMouseLeave = () => {
    if (interactive) hoverSpeedRef.current = 1;
  };

  const defaultProps = {
    ref: wrapperRef,
    className: cn(orbVariants({ variant, intent, size, glow, className })),
    role: "status",
    "aria-label": ariaLabel ?? STATE_LABELS[state] ?? "AI Orb",
    "data-slot": "orb",
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    children: (
      <canvas
        aria-hidden="true"
        ref={canvasRef}
        style={{
          width: computedSize,
          height: computedSize,
          display: "block",
        }}
      />
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

// ============================================================================
// Sub-Components for Composition
// ============================================================================

export interface OrbLabelProps extends useRender.ComponentProps<"span"> {}

function OrbLabel({
  className,
  render,
  ...props
}: OrbLabelProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      "font-mono text-xs text-muted-foreground select-none",
      className,
    ),
    "data-slot": "orb-label",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export interface OrbBadgeProps extends useRender.ComponentProps<"div"> {}

function OrbBadge({
  className,
  render,
  ...props
}: OrbBadgeProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      "inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-xs backdrop-blur-sm shadow-xs/5",
      className,
    ),
    "data-slot": "orb-badge",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export { Orb, OrbBadge, OrbLabel };
