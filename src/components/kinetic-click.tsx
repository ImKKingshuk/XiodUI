"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const KATA = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

/* --------------------------------- Types --------------------------------- */
export type KineticClickVariant =
  | "spark"
  | "ripple"
  | "embers"
  | "quantum"
  | "tesseract"
  | "blackhole"
  | "firework"
  | "shatter"
  | "warp"
  | "matrix"
  | "smoke"
  | "supernova"
  | "holosphere"
  | "flowfield"
  | "synapse"
  | "diffusion"
  | "rain"
  | "binary"
  | "fission"
  | "bullettime";

export type KineticClickTrigger = "click" | "mousedown";

export interface KineticClickProps extends useRender.ComponentProps<"div"> {
  /**
   * The animation variant to trigger on click.
   * @default "spark"
   */
  variant?: KineticClickVariant;
  /**
   * The particle/effect color. Accepts standard hex, rgb, or "currentColor"
   * to automatically inherit computed style colors of the clicked target.
   * @default "currentColor"
   */
  color?: string;
  /**
   * The style property to inherit color from when color is "currentColor".
   * - "text": Inherits from computed text color.
   * - "background": Inherits from computed background color.
   * - "border": Inherits from computed border color.
   * - "auto": Intelligently fallback from text -> background -> border (useful if text is neutral like white/black).
   * @default "auto"
   */
  colorFrom?: "text" | "background" | "border" | "auto";
  /**
   * Number of particles/ripples/structures to spawn.
   */
  count?: number;
  /**
   * Custom scale/size metric for particles/ripples.
   */
  size?: number;
  /**
   * Overall animation duration in milliseconds.
   */
  duration?: number;
  /**
   * Trigger event type.
   * @default "mousedown"
   */
  trigger?: KineticClickTrigger;
  children?: ReactNode;
}

interface Particle {
  id: string;
  type: KineticClickVariant;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  color: string;
  // Variant specific state
  angle?: number;
  dist?: number;
  speed?: number;
  wobble?: number;
  wobbleSpeed?: number;
  rotX?: number;
  rotY?: number;
  rotSpeedX?: number;
  rotSpeedY?: number;
  timer?: number;
  teleportTimer?: number;
  // Added for new effects
  gravity?: number;
  friction?: number;
  accel?: number;
  initialRotation?: number;
  rotationSpeed?: number;
  trailLength?: number;
  subType?: "ring" | "dot";
  opacity?: number;
  accretion?: number;
  pts?: [number, number, number][];
  fieldScale?: number;
  fieldStrength?: number;
  groupId?: string;
  targetY?: number;
  hit?: boolean;
  char?: string;
}

/* ----------------------------- Canvas Manager ----------------------------- */
class GlobalCanvasManager {
  private static instance: GlobalCanvasManager | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private consumers = 0;

  private constructor() {
    if (typeof window === "undefined") return;
    this.createCanvas();
    window.addEventListener("resize", this.handleResize);
  }

  public static getInstance(): GlobalCanvasManager {
    if (!GlobalCanvasManager.instance) {
      GlobalCanvasManager.instance = new GlobalCanvasManager();
    }
    return GlobalCanvasManager.instance;
  }

  private createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.dataset.slot = "kinetic-click-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    Object.assign(this.canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "999999",
      // Hidden while idle so the page doesn't keep a full-screen layer.
      visibility: "hidden",
    });
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.handleResize();
  }

  // Size the backing store in device pixels so particles stay sharp on HiDPI
  // screens; drawing stays in CSS pixels through the transform.
  private handleResize = () => {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(window.innerWidth * dpr);
    this.canvas.height = Math.round(window.innerHeight * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  public addParticles(newParticles: Particle[]) {
    this.particles.push(...newParticles);
    this.startLoop();
  }

  public retain() {
    this.consumers += 1;
  }

  public release() {
    this.consumers = Math.max(0, this.consumers - 1);
    if (this.consumers === 0) this.cleanup();
  }

  private startLoop() {
    if (this.animId !== null) return;
    if (this.canvas) this.canvas.style.visibility = "visible";
    const loop = (timestamp: number) => {
      this.updateAndDraw(timestamp);
      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(loop);
      } else {
        this.animId = null;
        if (this.ctx && this.canvas) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.canvas.style.visibility = "hidden";
        }
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  private updateAndDraw(_timestamp: number) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Geometry data for Tesseract projection
    const TESSERACT_NODES: [number, number, number][] = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const TESSERACT_EDGES: [number, number][] = [
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

    const coreKeys = new Set<string>();

    this.particles = this.particles.filter((p) => {
      p.life -= p.decay;
      if (p.life <= 0) return false;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);

      switch (p.type) {
        case "spark": {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // tiny gravity drift

          const tailX = p.x - p.vx * 1.5;
          const tailY = p.y - p.vy * 1.5;

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.lineWidth = p.size;
          ctx.strokeStyle = p.color;
          ctx.lineCap = "round";
          ctx.stroke();
          break;
        }

        case "ripple": {
          p.size += p.vx; // vx is ripple expansion speed

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.lineWidth = p.vy; // vy is line width
          ctx.strokeStyle = p.color;
          ctx.stroke();
          break;
        }

        case "embers": {
          p.vy -= 0.02; // slow rising acceleration
          p.x += p.vx + Math.sin(p.wobble ?? 0) * 0.4;
          p.y += p.vy;
          if (p.wobble !== undefined && p.wobbleSpeed !== undefined) {
            p.wobble += p.wobbleSpeed;
          }

          const currentRadius = Math.max(0.2, p.size * p.life);

          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        }

        case "quantum": {
          if (p.timer !== undefined && p.teleportTimer !== undefined) {
            p.timer--;
            if (p.timer <= 0) {
              const spread = p.vx; // vx is spread radius
              p.x = p.originX + (Math.random() - 0.5) * spread;
              p.y = p.originY + (Math.random() - 0.5) * spread;
              p.timer = Math.random() * p.teleportTimer;
            }
          }

          const cs = p.size; // crosshair size
          ctx.beginPath();
          ctx.moveTo(p.x - cs, p.y);
          ctx.lineTo(p.x + cs, p.y);
          ctx.moveTo(p.x, p.y - cs);
          ctx.lineTo(p.x, p.y + cs);
          ctx.lineWidth = 1;
          ctx.strokeStyle = p.color;
          ctx.stroke();
          break;
        }

        case "tesseract": {
          if (
            p.rotX !== undefined &&
            p.rotY !== undefined &&
            p.rotSpeedX !== undefined &&
            p.rotSpeedY !== undefined
          ) {
            p.rotX += p.rotSpeedX;
            p.rotY += p.rotSpeedY;

            // Grow size over duration
            const limitSize = p.vx; // vx is max size
            const speed = p.vy; // vy is grow speed
            if (p.size < limitSize) {
              p.size += speed;
            }

            const rx = p.rotX;
            const ry = p.rotY;
            const size = p.size;

            const projected = TESSERACT_NODES.map(([nx, ny, nz]) => {
              // 3D rotation Y
              const x1 = nx * Math.cos(ry) - nz * Math.sin(ry);
              const z1 = nx * Math.sin(ry) + nz * Math.cos(ry);
              const y1 = ny;

              // 3D rotation X
              const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
              const x2 = x1;

              return [p.x + x2 * size, p.y + y2 * size] as [number, number];
            });

            ctx.beginPath();
            for (const [a, b] of TESSERACT_EDGES) {
              ctx.moveTo(projected[a][0], projected[a][1]);
              ctx.lineTo(projected[b][0], projected[b][1]);
            }
            ctx.lineWidth = 1;
            ctx.strokeStyle = p.color;
            ctx.stroke();
          }
          break;
        }

        case "blackhole": {
          if (p.angle !== undefined && p.dist !== undefined) {
            p.dist *= p.accretion ?? 0.93;
            p.angle += 3 / Math.max(5, p.dist);

            const px = p.originX + Math.cos(p.angle) * p.dist;
            const py = p.originY + Math.sin(p.angle) * p.dist;

            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            const key = `${p.originX},${p.originY}`;
            if (!coreKeys.has(key)) {
              coreKeys.add(key);
              ctx.save();
              ctx.globalAlpha = Math.max(0, p.life * 0.5);
              ctx.beginPath();
              ctx.arc(p.originX, p.originY, p.size * 4, 0, Math.PI * 2);
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.restore();
            }
          }
          break;
        }

        case "firework": {
          p.vx *= p.friction ?? 0.96;
          p.vy *= p.friction ?? 0.96;
          p.vy += p.gravity ?? 0.08;
          p.x += p.vx;
          p.y += p.vy;

          ctx.beginPath();
          ctx.arc(
            p.x,
            p.y,
            p.size * (0.6 + Math.random() * 0.8),
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        }

        case "shatter": {
          if (
            p.angle !== undefined &&
            p.dist !== undefined &&
            p.initialRotation !== undefined &&
            p.rotationSpeed !== undefined
          ) {
            const easedProgress = 1 - p.life;
            const x = p.originX + Math.cos(p.angle) * easedProgress * p.dist;
            const y =
              p.originY +
              Math.sin(p.angle) * easedProgress * p.dist +
              (p.gravity ?? 0.6) * easedProgress * easedProgress * p.dist;

            const rotation =
              p.initialRotation + p.rotationSpeed * easedProgress * Math.PI * 4;
            const shardAlpha = p.life < 0.4 ? p.life / 0.4 : 1.0;

            ctx.save();
            ctx.globalAlpha = Math.max(0, shardAlpha * p.life);
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillStyle = p.color;

            const s = p.size;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s, s);
            ctx.lineTo(-s, s);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          break;
        }

        case "warp": {
          if (p.angle !== undefined && p.dist !== undefined) {
            p.vx *= p.accel ?? 1.1; // vx stores the speed

            const oldX = p.originX + Math.cos(p.angle) * p.dist;
            const oldY = p.originY + Math.sin(p.angle) * p.dist;

            p.dist += p.vx;

            const newX = p.originX + Math.cos(p.angle) * p.dist;
            const newY = p.originY + Math.sin(p.angle) * p.dist;

            const lineW = Math.min(p.size, p.vx * 0.15);

            ctx.beginPath();
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(newX, newY);
            ctx.lineWidth = lineW;
            ctx.strokeStyle = p.color;
            ctx.stroke();
          }
          break;
        }

        case "matrix": {
          const easedProgress = 1 - p.life;
          const traveled = p.vy * easedProgress * 60;
          const headY = p.y + traveled;

          ctx.font = `${p.size}px monospace`;
          ctx.textAlign = "center";

          const trail = p.trailLength ?? 8;
          for (let j = 0; j < trail; j++) {
            const charY = headY - j * (p.size + 2);
            const trailAlpha = Math.max(0, (1 - j / trail) * p.life);

            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(
              0,
              (j === 0 ? trailAlpha : trailAlpha * 0.6) * p.life,
            );

            const char = KATA[Math.floor(Math.random() * KATA.length)];
            ctx.fillText(char, p.x, charY);
            ctx.restore();
          }
          break;
        }

        case "smoke": {
          p.x += p.vx;
          p.y += p.vy;
          p.size += p.speed ?? 0.3;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life * (p.opacity ?? 0.15));
          ctx.fill();
          ctx.restore();
          break;
        }

        case "supernova": {
          if (p.subType === "ring") {
            p.size += p.vx; // vx is expansion velocity
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.lineWidth = 4 * p.life;
            ctx.strokeStyle = p.color;
            ctx.stroke();
          } else {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= p.friction ?? 0.95;
            p.vy *= p.friction ?? 0.95;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
          }
          break;
        }

        case "holosphere": {
          p.rotX = (p.rotX ?? 0) + (p.rotSpeedX ?? 0.02);
          p.rotY = (p.rotY ?? 0) + (p.rotSpeedY ?? 0.03);

          const maxS = p.vx; // vx holds maxSize
          const growS = p.vy; // vy holds growSpeed
          if (p.size < maxS) p.size += growS;

          if (p.pts) {
            for (const [sx, sy, sz] of p.pts) {
              const py = sy * Math.cos(p.rotX) - sz * Math.sin(p.rotX);
              const pz1 = sy * Math.sin(p.rotX) + sz * Math.cos(p.rotX);
              const px = sx * Math.cos(p.rotY) - pz1 * Math.sin(p.rotY);
              const pz2 = sx * Math.sin(p.rotY) + pz1 * Math.cos(p.rotY);
              const depth = (pz2 + 1) / 2;

              ctx.save();
              ctx.fillStyle = p.color;
              ctx.globalAlpha = Math.max(0, p.life * depth);
              ctx.fillRect(p.x + px * p.size, p.y + py * p.size, 1.5, 1.5);
              ctx.restore();
            }
          }
          break;
        }

        case "flowfield": {
          p.vx +=
            Math.sin(p.y * (p.fieldScale ?? 0.05)) * (p.fieldStrength ?? 0.2);
          p.vy +=
            Math.cos(p.x * (p.fieldScale ?? 0.05)) * (p.fieldStrength ?? 0.2);
          p.x += p.vx;
          p.y += p.vy;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        }

        case "synapse": {
          p.vx *= p.friction ?? 0.88;
          p.vy *= p.friction ?? 0.88;
          p.x += p.vx;
          p.y += p.vy;

          const connectionDist = p.dist ?? 70;
          ctx.save();
          ctx.beginPath();
          const groupNodes = this.particles.filter(
            (other) =>
              other.type === "synapse" &&
              other.groupId === p.groupId &&
              other.id > p.id,
          );
          for (const other of groupNodes) {
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
            }
          }
          ctx.lineWidth = 1;
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life * 0.4);
          ctx.stroke();
          ctx.restore();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        }

        case "diffusion": {
          const easeSpeed = 0.1;
          // vx is target x (tx), vy is target y (ty)
          p.x += (p.vx - p.x) * easeSpeed;
          p.y += (p.vy - p.y) * easeSpeed;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        }

        case "rain": {
          if (!p.hit) {
            p.y += p.vy;
            const streakHeight = 15;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - streakHeight);
            ctx.lineTo(p.x, p.y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = p.color;
            ctx.stroke();
            ctx.restore();

            if (p.y >= (p.targetY ?? p.y)) {
              p.hit = true;
              p.y = p.targetY ?? p.y;
              p.size = 0; // reset radius for ripple expansion
            }
          } else {
            const rippleSpeed = 1.5;
            const rippleSquish = 0.4;
            p.size += rippleSpeed; // size holds expanding ripple radius

            const rippleAlpha = Math.max(0, p.life - (1 - p.life) * 0.5);

            ctx.save();
            ctx.beginPath();
            ctx.ellipse(
              p.x,
              p.targetY ?? p.y,
              p.size,
              p.size * rippleSquish,
              0,
              0,
              Math.PI * 2,
            );
            ctx.lineWidth = 1;
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = Math.max(0, rippleAlpha);
            ctx.stroke();
            ctx.restore();
          }
          break;
        }

        case "binary": {
          const progress = 1.0 - p.life;
          const eased = progress * (2 - progress); // ease-out
          p.x = p.originX + Math.cos(p.angle ?? 0) * eased * (p.dist ?? 60);
          p.y =
            p.originY +
            Math.sin(p.angle ?? 0) * eased * (p.dist ?? 60) -
            eased * 18;
          const alpha = progress < 0.5 ? 1 : 1 - (progress - 0.5) * 2;

          ctx.save();
          ctx.font = `${p.size}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.fillStyle = p.color;
          ctx.fillText(p.char ?? "1", p.x, p.y);
          ctx.restore();
          break;
        }

        case "fission": {
          const alpha = p.life;
          let splits = 1;
          let radius = p.size;
          let spread = 0;
          const maxSpread = 40;

          if (p.life > 0.6) {
            splits = 1;
            radius = p.size * 2;
            spread = 0;
          } else if (p.life > 0.3) {
            splits = 3;
            radius = p.size;
            spread = (1 - p.life) * maxSpread;
          } else {
            splits = 9;
            radius = p.size * 0.5;
            spread = (1 - p.life) * maxSpread;
          }

          const spinAngle = p.life * 5;
          for (let i = 0; i < splits; i++) {
            const angle = i * ((Math.PI * 2) / splits) + spinAngle;
            const sx = p.x + (splits > 1 ? Math.cos(angle) * spread : 0);
            const sy = p.y + (splits > 1 ? Math.sin(angle) * spread : 0);

            ctx.beginPath();
            ctx.arc(sx, sy, radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
          }
          break;
        }

        case "bullettime": {
          p.vx *= p.friction ?? 0.92;
          p.vy *= p.friction ?? 0.92;
          p.x += p.vx;
          p.y += p.vy;

          const dx = p.x - p.originX;
          const dy = p.y - p.originY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxRadius = p.dist ?? 80;

          if (dist <= maxRadius) {
            const alpha = p.life;
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

            // Trail
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * p.life;
            ctx.lineCap = "round";
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(
              p.x - (p.vx / (speed || 1)) * speed * 2.5,
              p.y - (p.vy / (speed || 1)) * speed * 2.5,
            );
            ctx.stroke();
            ctx.restore();

            // Ring Effect
            if (p.life > 0.5) {
              ctx.save();
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 0.5;
              ctx.globalAlpha = p.life * 0.3;
              ctx.beginPath();
              ctx.arc(p.x, p.y, (1 - p.life) * 30, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }

            // Particle Dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
          }
          break;
        }
      }

      ctx.restore();
      return true;
    });
  }

  public cleanup() {
    if (this.canvas) {
      window.removeEventListener("resize", this.handleResize);
      if (this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      if (this.animId !== null) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      GlobalCanvasManager.instance = null;
    }
  }
}

function isNeutralColor(color: string): boolean {
  if (!color || color === "transparent" || color.includes("rgba(0, 0, 0, 0)")) {
    return true;
  }

  const normalized = color.trim().toLowerCase();
  const rgbMatch = normalized.match(/rgba?\((\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (rgbMatch) {
    const red = parseInt(rgbMatch[1], 10);
    const green = parseInt(rgbMatch[2], 10);
    const blue = parseInt(rgbMatch[3], 10);
    return Math.max(red, green, blue) - Math.min(red, green, blue) < 20;
  }

  const oklchMatch = normalized.match(
    /oklch\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/,
  );
  if (oklchMatch) {
    return parseFloat(oklchMatch[2]) < 0.04;
  }

  const hslMatch =
    normalized.match(/hsla?\(([\d.]+)deg?[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?/) ||
    normalized.match(/hsla?\(([\d.]+)[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?/);
  if (hslMatch) {
    const saturationText = hslMatch[2];
    const saturation = parseFloat(saturationText);
    return saturationText.includes("%") || saturation > 1
      ? saturation < 4
      : saturation < 0.04;
  }

  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      const red = parseInt(hex[0], 16);
      const green = parseInt(hex[1], 16);
      const blue = parseInt(hex[2], 16);
      return Math.max(red, green, blue) - Math.min(red, green, blue) < 2;
    }
    if (hex.length === 6 || hex.length === 8) {
      const red = parseInt(hex.slice(0, 2), 16);
      const green = parseInt(hex.slice(2, 4), 16);
      const blue = parseInt(hex.slice(4, 6), 16);
      return Math.max(red, green, blue) - Math.min(red, green, blue) < 20;
    }
  }

  return false;
}

/* ------------------------------- Component -------------------------------- */
function KineticClick({
  variant = "spark",
  color = "currentColor",
  colorFrom = "auto",
  count,
  size,
  duration,
  trigger = "mousedown",
  className,
  style,
  children,
  render,
  ...props
}: KineticClickProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [manager, setManager] = useState<GlobalCanvasManager | null>(null);

  useEffect(() => {
    // Instantiate lazy canvas manager on mount (client-side only)
    const m = GlobalCanvasManager.getInstance();
    m.retain();
    setManager(m);
    return () => m.release();
  }, []);

  const handleTrigger = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!manager || e.button !== 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const resolveTargetColor = (el: HTMLElement) => {
        if (color && color !== "currentColor") return color;
        try {
          const clone = el.cloneNode(false) as HTMLElement;
          clone.style.position = "absolute";
          clone.style.visibility = "hidden";
          clone.style.pointerEvents = "none";

          const parent = el.parentNode || document.body;
          parent.appendChild(clone);

          const cs = window.getComputedStyle(clone);
          const textColor = cs.color;
          const bgColor = cs.backgroundColor;
          const borderColor = cs.borderColor;

          parent.removeChild(clone);

          if (colorFrom === "text") return textColor || "#ffffff";
          if (colorFrom === "background") {
            return bgColor &&
              bgColor !== "transparent" &&
              !bgColor.includes("rgba(0, 0, 0, 0)")
              ? bgColor
              : "#ffffff";
          }
          if (colorFrom === "border") {
            return borderColor &&
              borderColor !== "transparent" &&
              !borderColor.includes("rgba(0, 0, 0, 0)")
              ? borderColor
              : "#ffffff";
          }

          if (!isNeutralColor(textColor)) return textColor;
          if (!isNeutralColor(bgColor)) return bgColor;
          if (!isNeutralColor(borderColor)) return borderColor;
          return textColor || "#ffffff";
        } catch {
          return "#ffffff";
        }
      };

      const target =
        (e.target as HTMLElement | null)?.closest?.(
          "button, a, [role='button']",
        ) || e.currentTarget;
      const computedColor = resolveTargetColor(target as HTMLElement);
      // A click from the keyboard (Enter/Space) has no pointer position
      // (detail 0, coordinates 0,0): burst from the element's centre.
      let x = e.clientX;
      let y = e.clientY;
      if (e.detail === 0 && x === 0 && y === 0) {
        // The wrapper is display: contents and has no box of its own.
        const origin = target === e.currentTarget ? e.target : target;
        const rect = (origin as HTMLElement).getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const list: Particle[] = [];
      const pid = Math.random().toString(36).slice(2, 9);

      switch (variant) {
        case "spark": {
          const pCount = count ?? 20;
          const pDur = duration ?? 750;
          const pSize = size ?? 1.5;
          const decay = 1 / (pDur / 16);

          for (let i = 0; i < pCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            list.push({
              id: `${pid}-${i}`,
              type: "spark",
              x,
              y,
              originX: x,
              originY: y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: pSize,
              life: 1.0,
              decay,
              color: computedColor,
            });
          }
          break;
        }

        case "ripple": {
          const rCount = count ?? 3;
          const rDur = duration ?? 800;
          const maxRadius = size ?? 40;
          const decay = 1 / (rDur / 16);

          for (let i = 0; i < rCount; i++) {
            const delayOffset = i * 6; // stagger ripple starts
            list.push({
              id: `${pid}-${i}`,
              type: "ripple",
              x,
              y,
              originX: x,
              originY: y,
              vx: maxRadius / (rDur / 16), // size expand velocity
              vy: Math.max(0.5, 2 - i * 0.5), // line width
              size: 0,
              life: 1.0,
              decay,
              color: computedColor,
              timer: delayOffset, // delay starts
            });
          }
          break;
        }

        case "embers": {
          const eCount = count ?? 25;
          const eDur = duration ?? 1200;
          const pSize = size ?? 2;
          const decay = 1 / (eDur / 16);

          for (let i = 0; i < eCount; i++) {
            const vx = (Math.random() - 0.5) * 1.5;
            const vy = -1 - Math.random() * 2;
            list.push({
              id: `${pid}-${i}`,
              type: "embers",
              x,
              y,
              originX: x,
              originY: y,
              vx,
              vy,
              size: pSize + Math.random() * 1.5,
              life: 1.0,
              decay,
              color: computedColor,
              wobble: Math.random() * Math.PI,
              wobbleSpeed: 0.05 + Math.random() * 0.05,
            });
          }
          break;
        }

        case "quantum": {
          const qCount = count ?? 10;
          const qDur = duration ?? 1200;
          const qSize = size ?? 4; // size of cross
          const decay = 1 / (qDur / 16);

          for (let i = 0; i < qCount; i++) {
            const spread = 60; // default spread radius
            const initialX = x + (Math.random() - 0.5) * spread;
            const initialY = y + (Math.random() - 0.5) * spread;

            list.push({
              id: `${pid}-${i}`,
              type: "quantum",
              x: initialX,
              y: initialY,
              originX: x,
              originY: y,
              vx: spread, // store spread in vx
              vy: 0,
              size: qSize,
              life: 1.0,
              decay,
              color: computedColor,
              timer: Math.random() * 8,
              teleportTimer: 10,
            });
          }
          break;
        }

        case "tesseract": {
          const tDur = duration ?? 1500;
          const limitSize = size ?? 30;
          const decay = 1 / (tDur / 16);

          list.push({
            id: `${pid}-0`,
            type: "tesseract",
            x,
            y,
            originX: x,
            originY: y,
            vx: limitSize, // store max size in vx
            vy: limitSize / (tDur / 32), // grow speed
            size: 5,
            life: 1.0,
            decay,
            color: computedColor,
            rotX: Math.random() * Math.PI,
            rotY: Math.random() * Math.PI,
            rotSpeedX: 0.015,
            rotSpeedY: 0.02,
          });
          break;
        }

        case "blackhole": {
          const bhCount = count ?? 40;
          const bhDur = duration ?? 1000;
          const bhSize = size ?? 2;
          const decay = 1 / (bhDur / 16);
          const baseDist = size ? size * 25 : 50;

          for (let i = 0; i < bhCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "blackhole",
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: bhSize,
              life: 1.0,
              decay,
              color: computedColor,
              angle: Math.random() * Math.PI * 2,
              dist: baseDist * (0.6 + Math.random() * 0.8),
              accretion: 0.93,
            });
          }
          break;
        }

        case "firework": {
          const fwCount = count ?? 35;
          const fwDur = duration ?? 1000;
          const fwSpeed = size ? size / 2 : 6;
          const decay = 1 / (fwDur / 16);

          for (let i = 0; i < fwCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const s = 2 + Math.random() * fwSpeed;
            list.push({
              id: `${pid}-${i}`,
              type: "firework",
              x,
              y,
              originX: x,
              originY: y,
              vx: Math.cos(angle) * s,
              vy: Math.sin(angle) * s,
              size: 1.5,
              life: 1.0,
              decay,
              color: computedColor,
              gravity: 0.08,
              friction: 0.96,
            });
          }
          break;
        }

        case "shatter": {
          const shCount = count ?? 12;
          const shDur = duration ?? 700;
          const spreadRadius = size ? size * 8 : 80;
          const decay = 1 / (shDur / 16);

          for (let i = 0; i < shCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "shatter",
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: 6 * (0.5 + Math.random() * 0.8),
              life: 1.0,
              decay,
              color: computedColor,
              angle: Math.random() * Math.PI * 2,
              dist: spreadRadius * (0.4 + Math.random() * 0.6),
              initialRotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() - 0.5) * 2,
              gravity: 0.6,
            });
          }
          break;
        }

        case "warp": {
          const wpCount = count ?? 30;
          const wpDur = duration ?? 1000;
          const decay = 1 / (wpDur / 16);
          const baseSpeed = 1;

          for (let i = 0; i < wpCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "warp",
              x,
              y,
              originX: x,
              originY: y,
              vx: baseSpeed + Math.random() * baseSpeed, // vx holds speed
              vy: 0,
              size: size ?? 4,
              life: 1.0,
              decay,
              color: computedColor,
              angle: Math.random() * Math.PI * 2,
              dist: 5,
              accel: 1.1 + Math.random() * 0.1,
            });
          }
          break;
        }

        case "matrix": {
          const mxCount = count ?? 10;
          const mxDur = duration ?? 1200;
          const spreadRadius = size ? size * 10 : 120;
          const decay = 1 / (mxDur / 16);
          const fallSpeed = 3;

          for (let i = 0; i < mxCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "matrix",
              x: x + (Math.random() - 0.5) * spreadRadius,
              y: y - Math.random() * 50,
              originX: x,
              originY: y,
              vx: 0,
              vy: fallSpeed + Math.random() * (fallSpeed * 0.7),
              size: 14,
              life: 1.0,
              decay,
              color: computedColor,
              trailLength: 8,
            });
          }
          break;
        }

        case "smoke": {
          const smCount = count ?? 8;
          const smDur = duration ?? 2500;
          const spreadX = size ? size : 10;
          const decay = 1 / (smDur / 16);
          const driftSpeed = 1;
          const minRiseSpeed = 0.5;
          const maxRiseSpeed = 1.5;

          for (let i = 0; i < smCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "smoke",
              x: x + (Math.random() - 0.5) * spreadX,
              y,
              originX: x,
              originY: y,
              vx: (Math.random() - 0.5) * driftSpeed,
              vy: -(
                minRiseSpeed +
                Math.random() * (maxRiseSpeed - minRiseSpeed)
              ),
              size: 5 + Math.random() * 10,
              life: 1.0,
              decay,
              color: computedColor,
              speed: 0.3,
              opacity: 0.15,
            });
          }
          break;
        }

        case "supernova": {
          const snDur = duration ?? 1000;
          const snDotCount = count ?? 30;
          const dotSize = size ?? 1.5;
          const ringSpeed = size ? size / 10 : 4;
          const decay = 1 / (snDur / 16);

          // Spawn ring
          list.push({
            id: `${pid}-ring`,
            type: "supernova",
            x,
            y,
            originX: x,
            originY: y,
            vx: ringSpeed, // vx is ring expansion velocity
            vy: 0,
            size: 0,
            life: 1.0,
            decay,
            color: computedColor,
            subType: "ring",
          });

          // Spawn dots
          for (let i = 0; i < snDotCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const s = 2 + Math.random() * 6;
            list.push({
              id: `${pid}-dot-${i}`,
              type: "supernova",
              x,
              y,
              originX: x,
              originY: y,
              vx: Math.cos(angle) * s,
              vy: Math.sin(angle) * s,
              size: dotSize,
              life: 1.0,
              decay,
              color: computedColor,
              subType: "dot",
              friction: 0.95,
            });
          }
          break;
        }

        case "holosphere": {
          const hsDur = duration ?? 2000;
          const hsCount = count ?? 40;
          const maxSize = size ? size * 4 : 40;
          const growSpeed = 2;
          const decay = 1 / (hsDur / 16);

          const pts: [number, number, number][] = Array.from(
            { length: hsCount },
            () => {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(2 * Math.random() - 1);
              return [
                Math.cos(theta) * Math.sin(phi),
                Math.cos(phi),
                Math.sin(theta) * Math.sin(phi),
              ];
            },
          );

          list.push({
            id: `${pid}-0`,
            type: "holosphere",
            x,
            y,
            originX: x,
            originY: y,
            vx: maxSize, // vx stores maxSize
            vy: growSpeed, // vy stores growSpeed
            size: 0,
            life: 1.0,
            decay,
            color: computedColor,
            pts,
            rotX: 0,
            rotY: 0,
            rotSpeedX: 0.02,
            rotSpeedY: 0.03,
          });
          break;
        }

        case "flowfield": {
          const ffDur = duration ?? 2000;
          const ffCount = count ?? 40;
          const decay = 1 / (ffDur / 16);
          const initialSpeed = 4;
          const fieldStrength = 0.2;
          const fieldScale = 0.05;
          const dotRadius = size ?? 1.5;

          for (let i = 0; i < ffCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "flowfield",
              x,
              y,
              originX: x,
              originY: y,
              vx: (Math.random() - 0.5) * initialSpeed,
              vy: (Math.random() - 0.5) * initialSpeed,
              size: dotRadius,
              life: 1.0,
              decay,
              color: computedColor,
              fieldScale,
              fieldStrength,
            });
          }
          break;
        }

        case "synapse": {
          const syDur = duration ?? 1500;
          const syCount = count ?? 10;
          const decay = 1 / (syDur / 16);
          const burstSpeed = 8;
          const friction = 0.88;
          const connectionDist = size ? size * 7 : 70;

          for (let i = 0; i < syCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "synapse",
              x,
              y,
              originX: x,
              originY: y,
              vx: (Math.random() - 0.5) * burstSpeed,
              vy: (Math.random() - 0.5) * burstSpeed,
              size: 2,
              life: 1.0,
              decay,
              color: computedColor,
              friction,
              dist: connectionDist, // dist holds connectionDist
              groupId: pid,
            });
          }
          break;
        }

        case "diffusion": {
          const dfDur = duration ?? 1000;
          const dfCount = count ?? 30;
          const radius = size ? size * 2.5 : 25;
          const decay = 1 / (dfDur / 16);

          for (let i = 0; i < dfCount; i++) {
            const angle = (i / dfCount) * Math.PI * 2;
            list.push({
              id: `${pid}-${i}`,
              type: "diffusion",
              x: x + (Math.random() - 0.5) * 100,
              y: y + (Math.random() - 0.5) * 100,
              originX: x,
              originY: y,
              vx: x + Math.cos(angle) * radius, // vx holds tx
              vy: y + Math.sin(angle) * radius, // vy holds ty
              size: 1.5,
              life: 1.0,
              decay,
              color: computedColor,
            });
          }
          break;
        }

        case "rain": {
          const rnDur = duration ?? 2000;
          const rnCount = count ?? 15;
          const decay = 1 / (rnDur / 16);
          const fallSpeed = 5;
          const maxExtraSpeed = 3;
          const spreadX = size ? size * 12 : 120;

          for (let i = 0; i < rnCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "rain",
              x: x + (Math.random() - 0.5) * spreadX,
              y: y - 80 - Math.random() * 50,
              originX: x,
              originY: y,
              vx: 0,
              vy: fallSpeed + Math.random() * maxExtraSpeed,
              size: 0, // ripple radius starts at 0
              life: 1.0,
              decay,
              color: computedColor,
              targetY: y + (Math.random() - 0.5) * 40,
              hit: false,
            });
          }
          break;
        }

        case "binary": {
          const biDur = duration ?? 1000;
          const biCount = count ?? 10;
          const spreadRadius = size ? size * 6 : 60;
          const decay = 1 / (biDur / 16);
          const chars = ["0", "1"];

          for (let i = 0; i < biCount; i++) {
            list.push({
              id: `${pid}-${i}`,
              type: "binary",
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: size ?? 12,
              life: 1.0,
              decay,
              color: computedColor,
              char: chars[Math.floor(Math.random() * chars.length)],
              angle: Math.random() * Math.PI * 2,
              dist: spreadRadius * (0.4 + Math.random() * 0.6),
            });
          }
          break;
        }

        case "fission": {
          const fiDur = duration ?? 1500;
          const decay = 1 / (fiDur / 16);
          const radius = size ?? 4;

          list.push({
            id: `${pid}-0`,
            type: "fission",
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            size: radius,
            life: 1.0,
            decay,
            color: computedColor,
          });
          break;
        }

        case "bullettime": {
          const btDur = duration ?? 1000;
          const btCount = count ?? 15;
          const decay = 1 / (btDur / 16);
          const speedMin = 8;
          const speedMax = 14;
          const friction = 0.92;
          const maxRadius = size ? size * 8 : 80;

          for (let i = 0; i < btCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = speedMin + Math.random() * (speedMax - speedMin);
            list.push({
              id: `${pid}-${i}`,
              type: "bullettime",
              x,
              y,
              originX: x,
              originY: y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 1.5 + Math.random() * 1.5,
              life: 1.0,
              decay,
              color: computedColor,
              friction,
              dist: maxRadius, // dist holds maxRadius
              angle,
            });
          }
          break;
        }
      }

      if (list.length > 0) {
        manager.addParticles(list);
      }
    },
    [manager, variant, count, size, duration, color, colorFrom],
  );

  const triggerHandlers = {
    [trigger === "mousedown" ? "onMouseDown" : "onClick"]: handleTrigger,
  };

  const defaultProps = {
    ref: containerRef,
    style: { display: "contents", ...style },
    className: cn(className),
    "data-slot": "kinetic-click",
    children,
    ...triggerHandlers,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export { KineticClick };
