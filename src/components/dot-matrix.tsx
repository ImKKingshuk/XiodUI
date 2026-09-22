"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export type DotMatrixShape = "circle" | "square" | "diamond" | "heart";
export type DotMatrixPreset =
  | "ripple"
  | "spiral"
  | "snake"
  | "wave"
  | "wave-vertical"
  | "pulse"
  | "diagonal"
  | "diagonal-reverse"
  | "rotor"
  | "columns-flux"
  | "helix"
  | "infinity"
  | "heart-pulse"
  | "orbit"
  | "matrix-rain"
  | "sine-wave"
  | "crt-glide"
  | "twin-orbit"
  | "rung-shift"
  | "lunar-breath"
  | "nova-wheel"
  | "prism-bloom"
  | "half-helix"
  | "honey-gate"
  | "spiral-lattice"
  | "altitude-wave"
  | "glyph-cluster"
  | "rail-scan"
  | "halo-drift"
  | "none";

const DIRECT_ANIMS = new Set([
  "helix",
  "infinity",
  "heart-pulse",
  "orbit",
  "matrix-rain",
  "sine-wave",
  "crt-glide",
  "twin-orbit",
  "rung-shift",
  "lunar-breath",
  "nova-wheel",
  "prism-bloom",
  "half-helix",
  "honey-gate",
  "spiral-lattice",
  "altitude-wave",
  "glyph-cluster",
  "rail-scan",
  "halo-drift",
]);
export type DotMatrixColorPreset =
  | "solid"
  | "sunset"
  | "ocean"
  | "neon"
  | "aurora"
  | "fire"
  | "prism";

export interface DotMatrixProps extends useRender.ComponentProps<"div"> {
  rows?: number;
  cols?: number;
  mode?: "animation" | "static" | "vu";
  pattern?: number[][] | boolean[][];
  preset?: DotMatrixPreset;
  frames?: number[][][];
  isPlaying?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  fps?: number;
  speed?: number;
  levels?: number[];
  dotSize?: number;
  gap?: number;
  shape?: DotMatrixShape;
  colorPreset?: DotMatrixColorPreset;
  color?: string;
  colorOff?: string;
  bloom?: boolean;
  bloomIntensity?: number;
  halo?: boolean;
  ariaLabel?: string;
  onFrame?: (index: number) => void;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}

// Generate spiral order of coordinates on any rectangular grid
function getSpiralOrder(rows: number, cols: number): number[] {
  const order = Array.from<number>({ length: rows * cols }).fill(0);
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;
  let step = 0;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) {
      order[top * cols + col] = step++;
    }
    top++;

    for (let row = top; row <= bottom; row++) {
      order[row * cols + right] = step++;
    }
    right--;

    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        order[bottom * cols + col] = step++;
      }
      bottom--;
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        order[row * cols + left] = step++;
      }
      left++;
    }
  }

  return order;
}

// Generate snake S-path order
function getSnakeOrder(rows: number, cols: number): number[] {
  const order = Array.from<number>({ length: rows * cols }).fill(0);
  let step = 0;
  for (let row = 0; row < rows; row++) {
    if (row % 2 === 0) {
      for (let col = 0; col < cols; col++) {
        order[row * cols + col] = step++;
      }
    } else {
      for (let col = cols - 1; col >= 0; col--) {
        order[row * cols + col] = step++;
      }
    }
  }
  return order;
}

// Ensure custom frames or patterns match exact grid size
function ensureFrameSize(
  frame: number[][] | boolean[][],
  rows: number,
  cols: number,
): number[][] {
  const result: number[][] = [];
  for (let r = 0; r < rows; r++) {
    result.push([]);
    const row = frame[r] || [];
    for (let c = 0; c < cols; c++) {
      const val = row[c];
      result[r][c] = typeof val === "boolean" ? (val ? 1 : 0) : (val ?? 0);
    }
  }
  return result;
}

function distanceSquared(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function triangleWave(value: number): number {
  const wrapped = ((value % 1) + 1) % 1;
  return 1 - Math.abs(wrapped * 2 - 1);
}

function wavePeak(value: number): number {
  const wrapped = ((value % 1) + 1) % 1;
  return Math.max(0, 1 - Math.abs(wrapped * 2 - 1) / 0.55);
}

export function DotMatrix({
  rows = 5,
  cols = 5,
  mode = "animation",
  pattern,
  preset = "ripple",
  frames,
  isPlaying = true,
  loop = true,
  autoplay = true,
  fps = 12,
  speed = 1,
  levels,
  dotSize = 8,
  gap = 3,
  shape = "circle",
  colorPreset = "solid",
  color = "currentColor",
  colorOff = "var(--muted-foreground)",
  bloom = true,
  bloomIntensity = 1.8,
  halo = false,
  ariaLabel = "Dot matrix loader",
  className,
  onFrame,
  render,
  ...props
}: DotMatrixProps): React.JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const frameIdRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!autoplay || !isPlaying || prefersReducedMotion) return;

    const isDirectAnim = DIRECT_ANIMS.has(preset);
    if (!isDirectAnim) return;

    const svg = svgRef.current;
    if (!svg) return;

    const dots = svg.querySelectorAll<SVGElement>(".dmx-dot-cell");
    if (dots.length === 0) return;

    let animationFrameId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const cycleDuration = 1600 / speed;
      const u = (elapsed % cycleDuration) / cycleDuration;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const row = parseInt(dot.getAttribute("data-row") || "0", 10);
        const col = parseInt(dot.getAttribute("data-col") || "0", 10);

        let opacity = 0.12;

        if (preset === "helix") {
          const colCenter = (cols - 1) / 2;
          const STRAND_LOOPS = 2;
          const rowPhase = u * STRAND_LOOPS * 2 * Math.PI + row * 1.24;
          const left = Math.round(
            colCenter / 2 + (Math.sin(rowPhase) * colCenter) / 2,
          );
          const right = cols - 1 - left;
          const bridgeOn = Math.cos(rowPhase * 2) > 0.82;

          if (col === left || col === right) {
            opacity = 1.0;
          } else if (
            bridgeOn &&
            col > Math.min(left, right) &&
            col < Math.max(left, right)
          ) {
            opacity = 0.58;
          } else if (
            Math.abs(col - left) === 1 ||
            Math.abs(col - right) === 1
          ) {
            opacity = 0.35;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "infinity") {
          const t = u * Math.PI * 2;
          const hAx = Math.sin(t);
          const hAy = 0.58 * Math.sin(2 * t);
          const hBx = Math.sin(t + Math.PI);
          const hBy = 0.58 * Math.sin(2 * (t + Math.PI));
          const tAx = Math.sin(t - 0.25);
          const tAy = 0.58 * Math.sin(2 * (t - 0.25));
          const tBx = Math.sin(t + Math.PI - 0.25);
          const tBy = 0.58 * Math.sin(2 * (t + Math.PI - 0.25));

          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const dotX = (col - colCenter) / Math.max(1, colCenter);
          const dotY = (rowCenter - row) / Math.max(1, rowCenter);

          const headInfluence = (hx: number, hy: number) =>
            Math.exp(-distanceSquared(dotX, dotY, hx, hy) / 0.19);

          const leadVal = Math.max(
            headInfluence(hAx, hAy),
            headInfluence(hBx, hBy),
          );
          const trailVal = Math.max(
            headInfluence(tAx, tAy),
            headInfluence(tBx, tBy),
          );
          const centerPulse =
            Math.exp(-(dotX * dotX + dotY * dotY) / 0.05) *
            (0.45 + 0.55 * leadVal);

          opacity =
            0.08 + 0.78 * leadVal + 0.42 * trailVal + 0.16 * centerPulse;
          opacity = Math.min(1.0, opacity);
        } else if (preset === "heart-pulse") {
          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const xVal = col - colCenter;
          const yVal = row - rowCenter;
          const radius = Math.hypot(xVal, yVal);
          const beat = Math.sin(u * Math.PI * 2);
          const spike = Math.sin(u * Math.PI * 4);
          const pulse = Math.max(0, beat) + Math.max(0, spike) * 0.55;

          if (radius < 1.2) {
            opacity = 0.25 + pulse * 0.75;
          } else if (radius < 2.2) {
            opacity = 0.15 + pulse * 0.55;
          } else {
            opacity = 0.12 + pulse * 0.18;
          }
        } else if (preset === "orbit") {
          const totalOuter = Math.max(1, cols * 2 + (rows - 2) * 2);
          const isOuter =
            row === 0 || row === rows - 1 || col === 0 || col === cols - 1;

          if (isOuter) {
            let ringIndex = 0;
            if (row === 0) ringIndex = col;
            else if (col === cols - 1) ringIndex = cols - 1 + row;
            else if (row === rows - 1)
              ringIndex = cols - 1 + rows - 1 + (cols - 1 - col);
            else if (col === 0)
              ringIndex = cols - 1 + rows - 1 + cols - 1 + (rows - 1 - row);

            const headPos = u * totalOuter;
            const distToHead = (headPos - ringIndex + totalOuter) % totalOuter;
            const trailVal = Math.max(0, 1 - distToHead / (totalOuter * 0.35));
            opacity = 0.15 + trailVal * 0.85;
          } else {
            opacity = 0.12;
          }
        } else if (preset === "matrix-rain") {
          const offset = (col * 7.3) % 1.0;
          const speedMult = 0.6 + ((col * 11.3) % 0.6);
          const dropPos = ((u * speedMult + offset) % 1.0) * (rows + 4) - 2;
          const dist = row - dropPos;
          if (dist <= 0 && dist > -4) {
            opacity = 0.15 + ((4 + dist) / 4) * 0.85;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "sine-wave") {
          const phase = u * 2 * Math.PI;
          const colPhase = (col / cols) * 2 * Math.PI;
          const waveHeight = ((Math.sin(phase + colPhase) + 1) / 2) * rows;
          const distToTop = rows - 1 - row;
          if (distToTop < waveHeight) {
            const diff = waveHeight - distToTop;
            opacity = 0.15 + Math.min(1.0, diff) * 0.85;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "crt-glide") {
          const scanline = u * (rows + 3) - 1.5;
          const dist = row - scanline;
          if (dist >= 0 && dist < 3) {
            opacity = 0.15 + (1 - dist / 3) * 0.85;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "twin-orbit") {
          const totalOuter = Math.max(1, cols * 2 + (rows - 2) * 2);
          const isOuter =
            row === 0 || row === rows - 1 || col === 0 || col === cols - 1;

          if (isOuter) {
            let ringIndex = 0;
            if (row === 0) ringIndex = col;
            else if (col === cols - 1) ringIndex = cols - 1 + row;
            else if (row === rows - 1)
              ringIndex = cols - 1 + rows - 1 + (cols - 1 - col);
            else if (col === 0)
              ringIndex = cols - 1 + rows - 1 + cols - 1 + (rows - 1 - row);

            const headPos = u * totalOuter;
            const distToHead = (headPos - ringIndex + totalOuter) % totalOuter;
            const trailVal = Math.max(0, 1 - distToHead / (totalOuter * 0.35));
            opacity = 0.15 + trailVal * 0.85;
          } else if (rows > 2 && cols > 2) {
            const innerRow = row - 1;
            const innerCol = col - 1;
            const innerR = rows - 2;
            const innerC = cols - 2;
            const totalInner = Math.max(1, innerC * 2 + (innerR - 2) * 2);
            const isInner =
              innerRow === 0 ||
              innerRow === innerR - 1 ||
              innerCol === 0 ||
              innerCol === innerC - 1;

            if (isInner) {
              let innerIndex = 0;
              if (innerRow === 0) innerIndex = innerCol;
              else if (innerCol === innerC - 1)
                innerIndex = innerC - 1 + innerRow;
              else if (innerRow === innerR - 1)
                innerIndex = innerC - 1 + innerR - 1 + (innerC - 1 - innerCol);
              else if (innerCol === 0)
                innerIndex =
                  innerC -
                  1 +
                  innerR -
                  1 +
                  innerC -
                  1 +
                  (innerR - 1 - innerRow);

              const headPos = u * totalInner;
              const distToHead =
                (innerIndex - headPos + totalInner) % totalInner;
              const trailVal = Math.max(
                0,
                1 - distToHead / (totalInner * 0.45),
              );
              opacity = 0.15 + trailVal * 0.85;
            } else {
              opacity = 0.15;
            }
          } else {
            opacity = 0.15;
          }
        } else if (preset === "rung-shift") {
          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const yVal = row - rowCenter;
          const phaseStep = Math.floor(u * 10);
          const activeRow = (phaseStep + rows) % rows;
          const rowDistance = Math.abs(row - activeRow);
          const swing = Math.sin((phaseStep / 10) * Math.PI * 2 + yVal * 0.9);
          const leftAnchor = Math.round(
            colCenter / 2 + (swing * colCenter) / 2,
          );
          const rightAnchor = cols - 1 - leftAnchor;

          if (row === activeRow && col >= leftAnchor && col <= rightAnchor) {
            opacity = 0.95;
          } else if (
            (col === leftAnchor || col === rightAnchor) &&
            rowDistance <= 1
          ) {
            opacity = 0.56;
          } else if (
            (col === leftAnchor || col === rightAnchor) &&
            rowDistance === 2
          ) {
            opacity = 0.28;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "lunar-breath") {
          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const x = col - colCenter;
          const y = row - rowCenter;
          const ring = Math.hypot(x, y);
          const t = u * Math.PI * 2;
          const angle = Math.atan2(y, x);
          const moonCenterX = Math.cos(t) * (colCenter * 0.35);
          const moonCenterY = Math.sin(t) * (rowCenter * 0.35);
          const body = Math.hypot(x - moonCenterX, y - moonCenterY);
          const cutCenterX = moonCenterX + Math.cos(t) * (colCenter * 0.41);
          const cutCenterY = moonCenterY + Math.sin(t) * (rowCenter * 0.41);
          const cut = Math.hypot(x - cutCenterX, y - cutCenterY);
          const rim = Math.max(0, 1 - Math.abs(body - colCenter * 0.77) / 0.35);
          const haloStrength = Math.max(
            0,
            1 - Math.acos(Math.cos(angle - t)) / 0.9,
          );

          if (body < colCenter * 0.77 && cut > colCenter * 0.52) {
            opacity = 0.95;
          } else if (rim > 0.5) {
            opacity = 0.3 + rim * 0.22;
          } else if (haloStrength > 0.68 && ring > colCenter * 0.6) {
            opacity = 0.3;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "nova-wheel") {
          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const x = col - colCenter;
          const y = row - rowCenter;
          const radius = Math.hypot(x, y);
          const angle = Math.atan2(y, x);
          const theta = u * Math.PI * 2;
          const pinwheel = Math.cos(angle * 4 - theta * 2.2);
          const radialGate = Math.sin(radius * 2.1 - theta * 1.25);

          if (radius < 0.6) {
            opacity = 0.66;
          } else if (pinwheel > 0.48 && radialGate > -0.25) {
            opacity = 0.94;
          } else if (pinwheel > 0.1) {
            opacity = 0.34;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "prism-bloom") {
          const masks = [
            "x...x.x.x...o...x.x.x...x",
            "..x...oxo.xooox.oxo...x..",
            ".x.x.x.o.x..o..x.o.x.x.x.",
            "x.x.x.o.o.x.o.x.o.o.x.x.x",
          ];
          const seq = [0, 1, 2, 3, 2, 1];
          const step = Math.floor(u * 6) % 6;
          const maskIdx = seq[step] ?? 0;
          const mask = masks[maskIdx] ?? masks[0] ?? "";
          const wrappedIdx = (row % 5) * 5 + (col % 5);
          const cell = mask[wrappedIdx] || ".";

          if (cell === "x") {
            opacity = 1.0;
          } else if (cell === "o") {
            opacity = 0.52;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "half-helix") {
          const colCenter = (cols - 1) / 2;
          const STEP_COUNT = 20;
          const HELIX_LOOP_RADIANS = (Math.PI * 2) / (STEP_COUNT - 1);
          const t = u * STEP_COUNT;
          const rowPhase = t * HELIX_LOOP_RADIANS + row * 1.24;
          const strandCol = Math.round(
            colCenter + colCenter * Math.sin(rowPhase),
          );

          if (col === strandCol) {
            opacity = 1.0;
          } else if (Math.abs(col - strandCol) === 1) {
            opacity = 0.35;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "honey-gate") {
          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const x = col - colCenter;
          const y = row - rowCenter;
          const sweep = triangleWave(u) * 4.0 - 2.0;
          const diagA = x * 0.86 + y * 0.5;
          const diagB = x * -0.86 + y * 0.5;
          const gateA = Math.max(0, 1 - Math.abs(diagA - sweep) / 0.55);
          const gateB = Math.max(0, 1 - Math.abs(diagB + sweep) / 0.55);
          const centerDistance = Math.hypot(x, y);
          const centerFlash =
            Math.max(0, 1 - Math.abs(sweep) / 0.68) *
            Math.max(0, 1 - centerDistance / 1.9);

          opacity = 0.15 + gateA * 0.7 + gateB * 0.7 + centerFlash * 0.42;
          opacity = Math.min(1.0, opacity);
        } else if (preset === "spiral-lattice") {
          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const x = col - colCenter;
          const y = row - rowCenter;
          const radius = Math.hypot(x, y);
          const angle = Math.atan2(y, x);

          const spiral = u + radius * 0.18 + angle / (Math.PI * 2);
          const counterSpiral =
            u * 0.72 - radius * 0.16 - angle / (Math.PI * 2);
          const a = wavePeak(spiral);
          const b = wavePeak(counterSpiral) * 0.55;
          const core =
            radius < 0.8 ? 0.54 + Math.sin(u * Math.PI * 4) * 0.26 : 0;

          opacity = 0.15 + a * 0.7 + b * 0.42 + core;
          opacity = Math.min(1.0, opacity);
        } else if (preset === "altitude-wave") {
          const colCenter = (cols - 1) / 2;
          const rowPhase = (rows - 1 - row) * 0.13;
          const pulse = 0.5 - 0.5 * Math.cos((u + rowPhase) * Math.PI * 2);
          const crest = pulse * pulse;
          const altitudeWeight = 0.58 + (rows - 1 - row) * 0.16;
          const centerWeight = col === Math.floor(colCenter) ? 0.16 : 0;

          opacity =
            0.15 +
            pulse * (0.34 - 0.08) +
            crest * (altitudeWeight + centerWeight) * (0.94 - 0.34);
          opacity = Math.min(0.95, opacity);
        } else if (preset === "glyph-cluster") {
          const patterns = [
            ["1,1", "2,1", "3,1", "1,3", "2,3", "3,3"],
            ["1,1", "2,1", "3,1", "2,2", "1,3", "2,3", "3,3"],
            ["1,1", "1,2", "1,3", "2,1", "2,3", "3,1", "3,2", "3,3"],
            ["1,1", "3,1", "2,2", "1,3", "3,3"],
            ["2,1", "1,2", "3,2", "2,3"],
            ["1,1", "2,1", "2,2", "2,3", "3,3"],
          ];
          const count = patterns.length;
          const phaseIndex = Math.floor(u * count) % count;
          const previousIndex = (phaseIndex + count - 1) % count;
          const activeSet = new Set(patterns[phaseIndex]);
          const prevSet = new Set(patterns[previousIndex]);

          const key = `${row % 5},${col % 5}`;
          const colCenter = (cols - 1) / 2;
          const rowCenter = (rows - 1) / 2;
          const ring = Math.hypot(col - colCenter, row - rowCenter);

          if (activeSet.has(key)) {
            opacity = 0.95;
          } else if (prevSet.has(key)) {
            opacity = 0.34;
          } else if (ring < 1.1) {
            opacity = 0.2;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "rail-scan") {
          const STEP_COUNT = 25;
          const t = Math.floor(u * STEP_COUNT) % STEP_COUNT;
          const activeRow = t % rows;
          const activeBrailleCol = Math.floor((t / rows) * 2) % 2;
          const railColLeft = Math.max(0, Math.floor(cols * 0.25));
          const railColRight = Math.min(cols - 1, Math.ceil(cols * 0.75));
          const railCol = activeBrailleCol === 0 ? railColLeft : railColRight;
          const nearCol = Math.floor((cols - 1) / 2);
          const rowDistance = Math.abs(row - activeRow);

          if (col === railCol && rowDistance === 0) {
            opacity = 0.95;
          } else if (col === railCol && rowDistance === 1) {
            opacity = 0.34;
          } else if (col === nearCol && rowDistance === 0) {
            opacity = 0.52;
          } else if (
            (col === railColLeft || col === railColRight) &&
            rowDistance === 2
          ) {
            opacity = 0.24;
          } else {
            opacity = 0.15;
          }
        } else if (preset === "halo-drift") {
          const colCenter = (cols - 1) / 2;
          const t = u * 20;
          const HELIX_LOOP_RADIANS = (Math.PI * 2) / 19;
          const diagonalAxis = row + col;
          const phaseOffset = t * HELIX_LOOP_RADIANS + diagonalAxis * 0.82;
          const strandPerpendicular = Math.round(
            colCenter * 0.8 * Math.sin(phaseOffset),
          );
          const cellPerpendicular = col - row;
          const distanceFromStrand = Math.abs(
            cellPerpendicular - strandPerpendicular,
          );

          if (distanceFromStrand === 0) {
            opacity = 1.0;
          } else if (distanceFromStrand === 1) {
            opacity = 0.35;
          } else {
            opacity = 0.15;
          }
        }

        dot.style.opacity = opacity.toFixed(4);
        dot.style.filter = "none";
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoplay, isPlaying, speed, preset, prefersReducedMotion, rows, cols]);

  // Precompute snake & spiral paths
  const spiralOrder = useMemo(() => getSpiralOrder(rows, cols), [rows, cols]);
  const snakeOrder = useMemo(() => getSnakeOrder(rows, cols), [rows, cols]);

  // Frame scheduler for custom keyframes
  const hasCustomFrames = mode === "animation" && frames && frames.length > 0;
  const isCurrentlyAnimating =
    autoplay && isPlaying && !prefersReducedMotion && hasCustomFrames;

  useEffect(() => {
    if (!isCurrentlyAnimating || !frames || frames.length === 0) {
      return;
    }

    const interval = 1000 / fps;

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const delta = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulatorRef.current += delta;

      if (accumulatorRef.current >= interval) {
        accumulatorRef.current -= interval;

        setCurrentFrameIndex((prev) => {
          const next = prev + 1;
          if (next >= frames.length) {
            if (loop) {
              onFrame?.(0);
              return 0;
            }
            return prev;
          }
          onFrame?.(next);
          return next;
        });
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isCurrentlyAnimating, frames, fps, loop, onFrame]);

  // Reset animation states when properties change
  useEffect(() => {
    setCurrentFrameIndex(0);
    lastTimeRef.current = 0;
    accumulatorRef.current = 0;
  }, []);

  // Dimensions
  const padding = 4; // safety boundary to avoid clipping glowing/scaling elements
  const gridWidth = cols * (dotSize + gap) - gap;
  const gridHeight = rows * (dotSize + gap) - gap;
  const viewBoxWidth = gridWidth + padding * 2;
  const viewBoxHeight = gridHeight + padding * 2;

  // Active matrix grid frame mapping
  const currentFrame = useMemo<number[][]>(() => {
    if (mode === "vu" && levels) {
      const frame = Array.from({ length: rows }, () =>
        Array.from<number>({ length: cols }).fill(0),
      );
      for (let col = 0; col < Math.min(cols, levels.length); col++) {
        const level = Math.max(0, Math.min(1, levels[col] ?? 0));
        const height = Math.round(level * rows);
        for (let row = 0; row < rows; row++) {
          const rowFromBottom = rows - 1 - row;
          if (rowFromBottom < height) {
            frame[row][col] = 1;
          }
        }
      }
      return frame;
    }

    if (mode === "static" && pattern) {
      return ensureFrameSize(pattern, rows, cols);
    }

    if (hasCustomFrames && frames) {
      const rawFrame = frames[currentFrameIndex] || frames[0] || [];
      return ensureFrameSize(rawFrame, rows, cols);
    }

    // Default: all cells active for preset animations
    return Array.from({ length: rows }, () =>
      Array.from<number>({ length: cols }).fill(1),
    );
  }, [
    mode,
    pattern,
    frames,
    currentFrameIndex,
    levels,
    rows,
    cols,
    hasCustomFrames,
  ]);

  // Preset Colors Defs Map
  const colorPresetGradients = {
    sunset: ["#ff5f6d", "#ffc371"],
    ocean: ["#00c6ff", "#0072ff"],
    neon: ["#b4ff39", "#39ffb6"],
    aurora: ["#ff3cac", "#784ba0", "#2b86c5"],
    fire: ["#ff512f", "#dd2476"],
    prism: ["#12c2e9", "#c471ed", "#f64f59"],
  };

  const gradientColors =
    colorPreset !== "solid" ? colorPresetGradients[colorPreset] : null;

  const defaultProps = {
    className: cn("relative inline-block select-none", className),
    "data-slot": "dot-matrix",
    style: {
      "--dmx-color": color,
      "--dmx-color-off": colorOff,
    } as React.CSSProperties,
    children: (
      <svg
        ref={svgRef}
        width={viewBoxWidth}
        height={viewBoxHeight}
        viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block overflow-visible"
        aria-label={ariaLabel}
        role="img"
      >
        <defs>
          {gradientColors && (
            <linearGradient
              id="dmx-gradient-preset"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              {gradientColors.map((col, idx) => (
                <stop
                  key={col}
                  offset={`${(idx / (gradientColors.length - 1)) * 100}%`}
                  stopColor={col}
                />
              ))}
            </linearGradient>
          )}

          {(bloom || halo) && (
            <filter
              id="dmx-bloom-filter"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={bloomIntensity}
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}

          <filter
            id="dmx-hover-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={bloomIntensity * 1.5}
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>
          {`
            .dmx-dot {
              transform-origin: center;
              transform-box: fill-box;
              transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease;
            }
            .dmx-dot-on {
              fill: ${gradientColors ? "url(#dmx-gradient-preset)" : "var(--dmx-color, currentColor)"};
            }
            .dmx-dot-off {
              fill: var(--dmx-color-off, currentColor);
              opacity: 0.12;
            }
            .dmx-dot-animate-pulse {
              animation: dmx-pulse-anim ${1.5 / speed}s infinite ease-in-out;
            }
            .dmx-dot-animate-wave {
              animation: dmx-wave-anim ${1.5 / speed}s infinite ease-in-out;
            }
            .dmx-dot-animate-ripple {
              animation: dmx-ripple-anim ${2 / speed}s infinite cubic-bezier(0.4, 0, 0.2, 1);
            }
            .dmx-dot-animate-spiral {
              animation: dmx-spiral-anim ${2.5 / speed}s infinite cubic-bezier(0.4, 0, 0.2, 1);
            }
            .dmx-dot-animate-snake {
              animation: dmx-snake-anim ${3 / speed}s infinite cubic-bezier(0.4, 0, 0.2, 1);
            }
            .dmx-dot-animate-diagonal {
              animation: dmx-diagonal-anim ${2 / speed}s infinite cubic-bezier(0.4, 0, 0.2, 1);
            }
            .dmx-dot-animate-rotor {
              animation: dmx-rotor-anim ${2.5 / speed}s infinite linear;
            }
            .dmx-dot-animate-columns-flux {
              animation: dmx-flux-anim ${1.8 / speed}s infinite ease-in-out;
            }
            .dmx-dot:hover {
              transform: scale(1.3);
              opacity: 1 !important;
              ${bloom ? "filter: url(#dmx-hover-filter);" : ""}
            }
            @keyframes dmx-pulse-anim {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(0.4); opacity: 0.2; }
            }
            @keyframes dmx-wave-anim {
              0%, 100% { transform: translateY(0); opacity: 1; }
              50% { transform: translateY(-30%); opacity: 0.35; }
            }
            @keyframes dmx-ripple-anim {
              0% { transform: scale(1.3); opacity: 1; }
              50% { transform: scale(0.3); opacity: 0.15; }
              100% { transform: scale(1.3); opacity: 1; }
            }
            @keyframes dmx-spiral-anim {
              0% { transform: scale(1.25); opacity: 1; }
              50% { transform: scale(0.3); opacity: 0.15; }
              100% { transform: scale(1.25); opacity: 1; }
            }
            @keyframes dmx-snake-anim {
              0% { transform: scale(1.25); opacity: 1; }
              50% { transform: scale(0.3); opacity: 0.15; }
              100% { transform: scale(1.25); opacity: 1; }
            }
            @keyframes dmx-diagonal-anim {
              0% { transform: scale(1.3); opacity: 1; }
              50% { transform: scale(0.3); opacity: 0.15; }
              100% { transform: scale(1.3); opacity: 1; }
            }
            @keyframes dmx-rotor-anim {
              0% { transform: scale(1.3); opacity: 1; }
              50% { transform: scale(0.3); opacity: 0.15; }
              100% { transform: scale(1.3); opacity: 1; }
            }
            @keyframes dmx-flux-anim {
              0%, 100% { transform: scaleY(1); opacity: 1; }
              50% { transform: scaleY(0.3); opacity: 0.2; }
            }
          `}
        </style>

        {halo && (
          <ellipse
            cx={(cols * (dotSize + gap) - gap) / 2}
            cy={(rows * (dotSize + gap) - gap) / 2}
            rx={viewBoxWidth / 2}
            ry={viewBoxHeight / 2}
            fill="var(--dmx-color, currentColor)"
            opacity={0.06}
            filter="url(#dmx-bloom-filter)"
          />
        )}

        {currentFrame.map((rowArr, rowIdx) =>
          rowArr.map((cellVal, colIdx) => {
            const x = colIdx * (dotSize + gap);
            const y = rowIdx * (dotSize + gap);
            const cx = x + dotSize / 2;
            const cy = y + dotSize / 2;

            const isCellOn = cellVal > 0.01;
            const cellOpacity = isCellOn ? cellVal : 0.12;

            const isDirectAnim = DIRECT_ANIMS.has(preset);

            // Generate CSS animation classes for standard animation presets
            const useCSSAnimation =
              mode === "animation" &&
              isPlaying &&
              !prefersReducedMotion &&
              !hasCustomFrames &&
              preset !== "none" &&
              !isDirectAnim;

            const animationClass = useCSSAnimation
              ? (() => {
                  switch (preset) {
                    case "pulse":
                      return "dmx-dot-animate-pulse";
                    case "wave":
                    case "wave-vertical":
                      return "dmx-dot-animate-wave";
                    case "ripple":
                      return "dmx-dot-animate-ripple";
                    case "spiral":
                      return "dmx-dot-animate-spiral";
                    case "snake":
                      return "dmx-dot-animate-snake";
                    case "diagonal":
                    case "diagonal-reverse":
                      return "dmx-dot-animate-diagonal";
                    case "rotor":
                      return "dmx-dot-animate-rotor";
                    case "columns-flux":
                      return "dmx-dot-animate-columns-flux";
                    default:
                      return "";
                  }
                })()
              : "";

            const animationDelay = useCSSAnimation
              ? (() => {
                  const scaledCycle =
                    preset === "pulse"
                      ? 1.5 / speed
                      : preset === "columns-flux"
                        ? 1.8 / speed
                        : preset === "rotor" || preset === "spiral"
                          ? 2.5 / speed
                          : preset === "snake"
                            ? 3 / speed
                            : 2 / speed;

                  if (preset === "ripple") {
                    const rowCenter = (rows - 1) / 2;
                    const colCenter = (cols - 1) / 2;
                    const dist = Math.hypot(
                      rowIdx - rowCenter,
                      colIdx - colCenter,
                    );
                    const maxDist = Math.hypot(rowCenter, colCenter) || 1;
                    return `${((dist / maxDist) * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "spiral") {
                    const order = spiralOrder[rowIdx * cols + colIdx] || 0;
                    return `${((order / (rows * cols - 1 || 1)) * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "snake") {
                    const order = snakeOrder[rowIdx * cols + colIdx] || 0;
                    return `${((order / (rows * cols - 1 || 1)) * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "wave") {
                    return `${((colIdx / (cols - 1 || 1)) * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "wave-vertical") {
                    return `${((rowIdx / (rows - 1 || 1)) * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "diagonal") {
                    return `${(((rowIdx + colIdx) / (rows + cols - 2 || 1)) * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "diagonal-reverse") {
                    return `${(((rowIdx + (cols - 1 - colIdx)) / (rows + cols - 2 || 1)) * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "rotor") {
                    const rowCenter = (rows - 1) / 2;
                    const colCenter = (cols - 1) / 2;
                    const angle = Math.atan2(
                      rowIdx - rowCenter,
                      colIdx - colCenter,
                    );
                    const angleNorm = (angle + Math.PI) / (Math.PI * 2);
                    return `${(angleNorm * scaledCycle).toFixed(4)}s`;
                  }
                  if (preset === "columns-flux") {
                    const isEvenCol = colIdx % 2 === 0;
                    const yNorm = isEvenCol
                      ? rowIdx / (rows - 1 || 1)
                      : (rows - 1 - rowIdx) / (rows - 1 || 1);
                    const colStagger = (colIdx / (cols - 1 || 1)) * 0.3;
                    return `${((yNorm * 0.7 + colStagger) * scaledCycle).toFixed(4)}s`;
                  }
                  return "0s";
                })()
              : undefined;

            const elementStyle = {
              animationDelay,
              ...((bloom || halo) &&
              isCellOn &&
              !useCSSAnimation &&
              !isDirectAnim
                ? { filter: "url(#dmx-bloom-filter)" }
                : {}),
              ...(!useCSSAnimation ? { opacity: cellOpacity } : {}),
            } as React.CSSProperties;

            const baseProps = {
              className: cn(
                "dmx-dot dmx-dot-cell",
                isCellOn ? "dmx-dot-on" : "dmx-dot-off",
                isCellOn && animationClass,
              ),
              style: elementStyle,
              "data-row": rowIdx,
              "data-col": colIdx,
            };

            const key = `${rowIdx}-${colIdx}`;

            if (shape === "square") {
              return (
                <rect
                  key={key}
                  {...baseProps}
                  x={x}
                  y={y}
                  width={dotSize}
                  height={dotSize}
                  rx={Math.max(1, dotSize * 0.15)}
                />
              );
            }

            if (shape === "diamond") {
              const radius = dotSize / 2;
              const points = `${cx},${cy - radius} ${cx + radius},${cy} ${cx},${cy + radius} ${cx - radius},${cy}`;
              return <polygon key={key} {...baseProps} points={points} />;
            }

            if (shape === "heart") {
              const s = dotSize / 12;
              const pathD = `M ${cx} ${cy + 4 * s}
                C ${cx - 5 * s} ${cy - 1.5 * s} ${cx - 6 * s} ${cy - 5 * s} ${cx - 3 * s} ${cy - 5.5 * s}
                C ${cx - 1 * s} ${cy - 5.8 * s} ${cx} ${cy - 3 * s} ${cx} ${cy - 3 * s}
                C ${cx} ${cy - 3 * s} ${cx + 1 * s} ${cy - 5.8 * s} ${cx + 3 * s} ${cy - 5.5 * s}
                C ${cx + 6 * s} ${cy - 5 * s} ${cx + 5 * s} ${cy - 1.5 * s} ${cx} ${cy + 4 * s} Z`;
              return <path key={key} {...baseProps} d={pathD} />;
            }

            // Default: circle
            return (
              <circle
                key={key}
                {...baseProps}
                cx={cx}
                cy={cy}
                r={dotSize / 2}
              />
            );
          }),
        )}
      </svg>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
