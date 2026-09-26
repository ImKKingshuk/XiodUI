"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import * as React from "react";
import { ChevronDown } from "xiod-icons/icons/ChevronDown";
import { Dropper as Pipette } from "xiod-icons/icons/Dropper";

import { IconSlot } from "./icon-provider";

// ==========================================
// Types
// ==========================================

export interface BlossomColorPickerValue {
  hue: number;
  saturation: number; // Slider position (0-100)
  lightness?: number;
  originalSaturation?: number; // Base saturation of the selected petal
  alpha: number;
  layer: "inner" | "outer";
}

export interface BlossomColorPickerColor extends BlossomColorPickerValue {
  hex: string;
  hsl: string;
  hsla: string;
  rgb: string;
  rgba: string;
  r: number;
  g: number;
  b: number;
}

export type ColorInput = string | { h: number; s: number; l: number };

export type SliderPosition = "top" | "bottom" | "left" | "right";

// ==========================================
// Constants
// ==========================================

export const OUTER_COLORS = [
  { h: 47, s: 97, l: 65 }, // #FCD752
  { h: 37, s: 98, l: 65 }, // #FDBA50
  { h: 27, s: 95, l: 64 }, // #FA9C4D
  { h: 14, s: 90, l: 64 }, // #F6774F
  { h: 0, s: 85, l: 64 }, // #F15656
  { h: 327, s: 75, l: 62 }, // #E756A6
  { h: 285, s: 51, l: 59 }, // #B261CC
  { h: 257, s: 65, l: 64 }, // #8966DF
  { h: 225, s: 71, l: 65 }, // #6586E5
  { h: 202, s: 68, l: 65 }, // #69B5E2
  { h: 151, s: 43, l: 63 }, // #77C9A2
  { h: 96, s: 49, l: 67 }, // #A4D483
];

export const INNER_COLORS = [
  { h: 50, s: 95, l: 85 }, // #FDF1B6
  { h: 26, s: 89, l: 89 }, // #FCE0CA
  { h: 345, s: 77, l: 88 }, // #F8C8D4
  { h: 283, s: 47, l: 84 }, // #DEC2E9
  { h: 209, s: 70, l: 87 }, // #C6DEF5
  { h: 116, s: 42, l: 87 }, // #D2ECD0
];

export const DEFAULT_COLORS = [...INNER_COLORS, ...OUTER_COLORS];

const BLOOM_EASING_CSS =
  "linear(0, 0.060 3%, 0.200 7%, 0.420 13%, 0.680 20%, 0.900 28%, 1.020 35%, 1.060 45%, 1.025 53%, 0.997 62%, 1.0 68%)";

const _HOVER_DELAY = 100;
const PETAL_STAGGER = 20;
const BAR_GAP = 20;
const BAR_WIDTH = 12;
const SLIDER_OFFSET = 30;
const ARC_GRADIENT_STEPS = 11;

const DEFAULT_VALUE: BlossomColorPickerValue = {
  hue: 330,
  saturation: 70,
  alpha: 50,
  layer: "outer",
};

// ==========================================
// Geometry & Color Converters
// ==========================================

export function lightnessToSliderValue(l: number): number {
  const minLightness = 20;
  const maxLightness = 100;
  const clampedL = Math.max(minLightness, Math.min(maxLightness, l));
  return ((maxLightness - clampedL) / (maxLightness - minLightness)) * 100;
}

export function sliderValueToLightness(sliderValue: number): number {
  const minLightness = 20;
  const maxLightness = 100;
  return maxLightness - (sliderValue / 100) * (maxLightness - minLightness);
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function parseColor(input: ColorInput): {
  h: number;
  s: number;
  l: number;
} {
  if (typeof input === "object") return input;

  const str = input.trim().toLowerCase();

  if (str.startsWith("#")) return hexToHsl(str);

  const hslMatch = str.match(
    /^hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%?[\s,]+([\d.]+)%?/,
  );
  if (hslMatch) {
    return {
      h: Math.round(parseFloat(hslMatch[1])),
      s: Math.round(parseFloat(hslMatch[2])),
      l: Math.round(parseFloat(hslMatch[3])),
    };
  }

  const rgbMatch = str.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (rgbMatch) {
    return rgbToHsl(
      parseFloat(rgbMatch[1]),
      parseFloat(rgbMatch[2]),
      parseFloat(rgbMatch[3]),
    );
  }

  return { h: 0, s: 0, l: 50 };
}

export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getVisualSaturation(
  sliderValue: number,
  baseSaturation: number,
): number {
  return sliderValue < 10
    ? (sliderValue / 10) * baseSaturation
    : baseSaturation;
}

export function hslToString(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

export function hslaToString(
  h: number,
  s: number,
  l: number,
  a: number,
): string {
  return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${(a / 100).toFixed(2)})`;
}

export function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) =>
    lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

export function rgbaToString(
  r: number,
  g: number,
  b: number,
  a: number,
): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${(a / 100).toFixed(2)})`;
}

export function createColorOutput(
  hue: number,
  sliderValue: number,
  visualSaturation: number,
  baseSaturation: number,
  lightness: number,
  alpha: number,
  layer: "inner" | "outer",
): BlossomColorPickerColor {
  const { r, g, b } = hslToRgb(hue, visualSaturation, lightness);
  return {
    hue,
    saturation: sliderValue,
    originalSaturation: baseSaturation,
    lightness,
    alpha,
    layer,
    r,
    g,
    b,
    hex: hslToHex(hue, visualSaturation, lightness),
    hsl: hslToString(hue, visualSaturation, lightness),
    hsla: hslaToString(hue, visualSaturation, lightness, alpha),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: rgbaToString(r, g, b, alpha),
  };
}

export function organizeColorsIntoLayers(
  colors: { h: number; s: number; l: number }[],
): { h: number; s: number; l: number }[][] {
  if (!colors || colors.length === 0) return [];

  const sortedByLightness = colors.toSorted((a, b) => b.l - a.l);
  const total = sortedByLightness.length;

  let layerCounts: number[] = [];

  if (total <= 10) {
    layerCounts = [total];
  } else if (total <= 24) {
    const inner = Math.max(4, Math.floor(total * 0.35));
    layerCounts = [inner, total - inner];
  } else if (total <= 42) {
    const inner = Math.max(5, Math.floor(total * 0.15));
    const middle = Math.floor(total * 0.35);
    layerCounts = [inner, middle, total - inner - middle];
  } else {
    const inner = Math.max(6, Math.floor(total * 0.1));
    const mid1 = Math.floor(total * 0.2);
    const mid2 = Math.floor(total * 0.3);
    layerCounts = [inner, mid1, mid2, total - inner - mid1 - mid2];
  }

  const layers: { h: number; s: number; l: number }[][] = [];
  let currentIndex = 0;

  for (let i = 0; i < layerCounts.length; i++) {
    const count = layerCounts[i];
    const itemsForThisLayer = sortedByLightness.slice(
      currentIndex,
      currentIndex + count,
    );

    itemsForThisLayer.sort((a, b) => a.h - b.h);

    if (itemsForThisLayer.length > 0) {
      layers.push(itemsForThisLayer);
    }
    currentIndex += count;
  }

  return layers;
}

export function calculateLayerRadii(
  layers:
    | { h: number; s: number; l: number }[][]
    | { h: number; s: number; l: number }[][],
  coreSize: number,
  petalSize: number,
): number[] {
  const radii: number[] = [];
  const W = petalSize;
  const Rc = coreSize / 2;
  const Rp = petalSize / 2;

  for (let i = 0; i < layers.length; i++) {
    const N = layers[i].length;
    const overlapFactor = N <= 8 ? 0.45 : N <= 12 ? 0.5 : 0.55;
    const lateralGaplessR = (N * W * overlapFactor) / (2 * Math.PI);

    let r = 0;

    if (i === 0) {
      const coreOverlap = N <= 5 ? W * 0.35 : W * 0.25;
      const idealCoreR = Rc + Rp - coreOverlap;
      r = Math.max(idealCoreR, lateralGaplessR);
    } else {
      const prevR = radii[i - 1];
      const prevN = layers[i - 1].length;

      const circumference = 2 * Math.PI * prevR;
      const coverage = prevN * W;
      const sparsity = coverage / circumference;

      let adaptiveStep = W * 0.35;

      if (sparsity < 0.85) {
        adaptiveStep = W * 0.15;
      } else if (sparsity > 1.1) {
        adaptiveStep = W * 0.45;
      }

      const idealNestleR = prevR + adaptiveStep;
      r = Math.max(idealNestleR, lateralGaplessR);
      r = Math.max(r, prevR + W * 0.1);
    }

    radii.push(r);
  }

  return radii;
}

export function calculateLayerRotations(
  layers: { h: number; s: number; l: number }[][],
): number[] {
  const rotations: number[] = [0];

  for (let i = 1; i < layers.length; i++) {
    const prevCount = layers[i - 1].length;
    const offset = 360 / prevCount / 2;
    rotations.push(offset);
  }

  return rotations;
}

export function calculateBarRadius(
  layerRadii: number[],
  petalSize: number,
  coreSize: number,
  barGap: number,
): number {
  return layerRadii.length > 0
    ? layerRadii[layerRadii.length - 1] + petalSize / 2 + barGap
    : coreSize / 2 + barGap;
}

export function calculateContainerSize(
  barRadius: number,
  circularBarWidth: number,
  showAlphaSlider: boolean,
  showOpacitySlider: boolean,
  sliderOffset: number,
  sliderWidth: number,
): number {
  const barExtent = barRadius + circularBarWidth / 2;
  const sliderExtent =
    showAlphaSlider || showOpacitySlider
      ? barRadius + sliderOffset + sliderWidth / 2
      : 0;
  return Math.max(barExtent, sliderExtent) * 2 + 4;
}

export function getPetalZIndex(
  index: number,
  bottomIndex: number,
  totalPetals: number,
  layerIdx: number,
  totalLayers: number,
  isBottomLeft = false,
  isBottomRight = false,
): number {
  const baseZ = (totalLayers - layerIdx) * 100;
  const maxLocalZ = totalPetals + 10;

  if (index === bottomIndex) {
    if (isBottomRight) return baseZ + maxLocalZ;
    if (isBottomLeft) return baseZ;
    return baseZ;
  }

  const steps = (index - bottomIndex + totalPetals) % totalPetals;
  return baseZ + steps;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleInDegrees: number,
): { x: number; y: number } {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAng: number,
  endAng: number,
): string {
  const start = polarToCartesian(cx, cy, r, startAng);
  const end = polarToCartesian(cx, cy, r, endAng);
  const largeArcFlag = Math.abs(endAng - startAng) > 180 ? "1" : "0";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function getCenterAngle(position: SliderPosition): number {
  switch (position) {
    case "top":
      return -90;
    case "bottom":
      return 90;
    case "left":
      return 180;
    default:
      return 0;
  }
}

export function getOppositePosition(position: SliderPosition): SliderPosition {
  switch (position) {
    case "left":
      return "right";
    case "right":
      return "left";
    case "top":
      return "bottom";
    default:
      return "top";
  }
}

export function calculateSliderValueFromPoint(
  dx: number,
  dy: number,
  centerAngle: number,
  halfSweep: number,
  position: SliderPosition,
): number {
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  let normalizedAngle = angle - centerAngle;
  while (normalizedAngle > 180) normalizedAngle -= 360;
  while (normalizedAngle < -180) normalizedAngle += 360;

  normalizedAngle = Math.max(-halfSweep, Math.min(halfSweep, normalizedAngle));

  let newValue: number;
  if (position === "left") {
    newValue = ((halfSweep - normalizedAngle) / (2 * halfSweep)) * 100;
  } else {
    newValue = ((normalizedAngle + halfSweep) / (2 * halfSweep)) * 100;
  }

  return Math.round(Math.max(0, Math.min(100, newValue)));
}

export function calculateArcGradientColors(
  hue: number,
  baseSaturation: number,
  steps: number,
): string[] {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const saturation = getVisualSaturation(t * 100, baseSaturation);
    const lightness = 100 - t * 80;
    return hslToString(hue, saturation, lightness);
  });
}

export interface ComputeAdaptivePositionInput {
  elementRect: DOMRect;
  containerSize: number;
  currentShiftOffset: { x: number; y: number };
  windowWidth: number;
  windowHeight: number;
  sliderPosition?: SliderPosition;
  adaptivePositioning: boolean;
  circularBarWidth: number;
  sliderOffset: number;
}

export interface ComputeAdaptivePositionResult {
  effectivePosition: SliderPosition;
  shiftOffset: { x: number; y: number };
}

export function computeAdaptivePosition({
  elementRect,
  containerSize,
  currentShiftOffset,
  windowWidth,
  windowHeight,
  sliderPosition,
  adaptivePositioning,
  circularBarWidth,
  sliderOffset,
}: ComputeAdaptivePositionInput): ComputeAdaptivePositionResult {
  const halfSize = containerSize / 2;
  const centerX =
    elementRect.left + elementRect.width / 2 - currentShiftOffset.x;
  const centerY =
    elementRect.top + elementRect.height / 2 - currentShiftOffset.y;

  let newShiftX = 0;
  let newShiftY = 0;

  if (adaptivePositioning) {
    const padding = 10;

    if (centerX + halfSize > windowWidth - padding) {
      newShiftX = windowWidth - padding - (centerX + halfSize);
    } else if (centerX - halfSize < padding) {
      newShiftX = padding - (centerX - halfSize);
    }

    if (centerY + halfSize > windowHeight - padding) {
      newShiftY = windowHeight - padding - (centerY + halfSize);
    } else if (centerY - halfSize < padding) {
      newShiftY = padding - (centerY - halfSize);
    }
  }

  let effectivePosition: SliderPosition = sliderPosition || "right";

  // An explicit `sliderPosition` pins the axis, and `adaptivePositioning: false`
  // means "do not adapt" — both must agree with the resting value the component
  // falls back to when it collapses, or the sliders jump as they fade out.
  if (!sliderPosition && adaptivePositioning) {
    const spaceRight = windowWidth - (centerX + newShiftX + halfSize);
    const spaceLeft = centerX + newShiftX - halfSize;
    const spaceTop = centerY + newShiftY - halfSize;
    const spaceBottom = windowHeight - (centerY + newShiftY + halfSize);

    const threshold = sliderOffset + circularBarWidth + 20;

    // The two arcs sit on opposite sides, so an axis is only usable when BOTH
    // of its sides have room. Testing one side at a time let a cramped top
    // force a vertical placement even when left and right were both wide open.
    const horizontal = Math.min(spaceLeft, spaceRight);
    const vertical = Math.min(spaceTop, spaceBottom);
    const widest = (): SliderPosition =>
      spaceRight >= spaceLeft ? "right" : "left";
    const tallest = (): SliderPosition =>
      spaceBottom >= spaceTop ? "bottom" : "top";

    if (horizontal >= threshold) {
      effectivePosition = widest();
    } else if (vertical >= threshold) {
      effectivePosition = tallest();
    } else {
      effectivePosition = horizontal >= vertical ? widest() : tallest();
    }
  }

  return {
    effectivePosition,
    shiftOffset: { x: newShiftX, y: newShiftY },
  };
}

// ==========================================
// BlossomColorPicker Component
// ==========================================

export interface BlossomColorPickerProps extends Omit<
  useRender.ComponentProps<"div">,
  "value" | "defaultValue" | "onChange"
> {
  value?: BlossomColorPickerValue;
  defaultValue?: BlossomColorPickerValue;
  colors?: ColorInput[];
  onChange?: (color: BlossomColorPickerColor) => void;
  onCollapse?: (color: BlossomColorPickerColor) => void;
  disabled?: boolean;
  openOnHover?: boolean;
  initialExpanded?: boolean;
  animationDuration?: number;
  showAlphaSlider?: boolean; // Circular arc slider
  showOpacitySlider?: boolean; // Circular opacity/alpha slider on the opposite side
  coreSize?: number;
  petalSize?: number;
  showCoreColor?: boolean;
  sliderPosition?: SliderPosition;
  adaptivePositioning?: boolean;
  circularBarWidth?: number;
  sliderWidth?: number;
  sliderOffset?: number;
  collapsible?: boolean;
}

export function BlossomColorPicker({
  value,
  defaultValue,
  colors,
  onChange,
  onCollapse,
  disabled = false,
  openOnHover = false,
  initialExpanded = false,
  animationDuration = 300,
  showAlphaSlider = true,
  showOpacitySlider = true,
  coreSize = 32,
  petalSize = 32,
  showCoreColor = true,
  sliderPosition,
  adaptivePositioning = true,
  circularBarWidth = BAR_WIDTH,
  sliderWidth = BAR_WIDTH,
  sliderOffset = SLIDER_OFFSET,
  collapsible = true,
  className,
  ref,
  render,
  ...props
}: BlossomColorPickerProps & {
  ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const alphaSvgRef = React.useRef<SVGSVGElement>(null);
  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  // States
  const [internalValue, setInternalValue] =
    React.useState<BlossomColorPickerValue>(defaultValue ?? DEFAULT_VALUE);
  const [isExpanded, setIsExpanded] = React.useState(
    !collapsible || initialExpanded,
  );
  const [mousePos, setMousePos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isHoveringCore, setIsHoveringCore] = React.useState(false);
  const [hoveredPetal, setHoveredPetal] = React.useState<{
    layer: number;
    index: number;
  } | null>(null);
  const [shiftOffset, setShiftOffset] = React.useState({ x: 0, y: 0 });
  const [effectivePosition, setEffectivePosition] =
    React.useState<SliderPosition>(sliderPosition || "right");
  const [isDraggingSlider, setIsDraggingSlider] = React.useState(false);
  const [isDraggingAlpha, setIsDraggingAlpha] = React.useState(false);

  const prevExpandedRef = React.useRef(isExpanded);

  const [hasEyeDropper, setHasEyeDropper] = React.useState(false);
  React.useEffect(() => {
    setHasEyeDropper(typeof window !== "undefined" && "EyeDropper" in window);
  }, []);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Resolve current active value
  const currentValue = value ?? internalValue;

  // Organize layout geometry
  const normalizedColors = React.useMemo(() => {
    return colors && colors.length > 0
      ? colors.map(parseColor)
      : DEFAULT_COLORS;
  }, [colors]);

  const {
    layers,
    allColors,
    layerPrefixCounts,
    layerRadii,
    layerRotations,
    barRadius,
    containerSize,
  } = React.useMemo(() => {
    const lay = organizeColorsIntoLayers(normalizedColors);
    const allCol = lay.flat();
    const lpc = [0];
    for (let i = 1; i < lay.length; i++) {
      lpc.push(lpc[i - 1] + lay[i - 1].length);
    }
    const radii = calculateLayerRadii(lay, coreSize, petalSize);
    const rots = calculateLayerRotations(lay);
    const bRad = calculateBarRadius(radii, petalSize, coreSize, BAR_GAP);
    const cSize = calculateContainerSize(
      bRad,
      circularBarWidth,
      showAlphaSlider,
      showOpacitySlider,
      sliderOffset,
      sliderWidth,
    );

    return {
      layers: lay,
      allColors: allCol,
      layerPrefixCounts: lpc,
      layerRadii: radii,
      layerRotations: rots,
      barRadius: bRad,
      containerSize: cSize,
    };
  }, [
    normalizedColors,
    coreSize,
    petalSize,
    circularBarWidth,
    showAlphaSlider,
    showOpacitySlider,
    sliderOffset,
    sliderWidth,
  ]);

  const baseSaturation = React.useMemo(() => {
    if (currentValue.originalSaturation !== undefined) {
      return currentValue.originalSaturation;
    }
    const match = allColors.find((c) => c.h === currentValue.hue);
    return match?.s ?? 70;
  }, [allColors, currentValue.hue, currentValue.originalSaturation]);

  const currentLightness = React.useMemo(() => {
    return (
      currentValue.lightness ?? sliderValueToLightness(currentValue.saturation)
    );
  }, [currentValue.lightness, currentValue.saturation]);

  const visualSaturation = React.useMemo(() => {
    return getVisualSaturation(currentValue.saturation, baseSaturation);
  }, [currentValue.saturation, baseSaturation]);

  const coreColorString = React.useMemo(() => {
    if (isExpanded && !showCoreColor) return "#FFFFFF";
    return hslaToString(
      currentValue.hue,
      baseSaturation,
      currentLightness,
      currentValue.alpha,
    );
  }, [
    isExpanded,
    showCoreColor,
    currentValue.hue,
    baseSaturation,
    currentLightness,
    currentValue.alpha,
  ]);

  const outputColor = React.useMemo(() => {
    return createColorOutput(
      currentValue.hue,
      currentValue.saturation,
      visualSaturation,
      baseSaturation,
      currentLightness,
      currentValue.alpha,
      currentValue.layer,
    );
  }, [currentValue, visualSaturation, baseSaturation, currentLightness]);

  // Handle adaptive positioning on expand
  React.useEffect(() => {
    if (isExpanded && rootRef.current) {
      const rootRect = rootRef.current.getBoundingClientRect();
      const result = computeAdaptivePosition({
        elementRect: rootRect,
        containerSize,
        currentShiftOffset: { x: 0, y: 0 },
        windowWidth: typeof window !== "undefined" ? window.innerWidth : 1000,
        windowHeight: typeof window !== "undefined" ? window.innerHeight : 800,
        sliderPosition,
        adaptivePositioning,
        circularBarWidth,
        sliderOffset,
      });
      setShiftOffset(result.shiftOffset);
      setEffectivePosition(result.effectivePosition);
    } else if (!isExpanded) {
      // The arcs stay mounted and fade out over `animationDuration`, so they
      // are still on screen during the collapse. Resetting the axis here made
      // them jump to the resting side for the length of that fade. Keep the
      // position that was in effect while open; the next expand recomputes it.
      setShiftOffset({ x: 0, y: 0 });
    }
    prevExpandedRef.current = isExpanded;
  }, [
    isExpanded,
    containerSize,
    sliderPosition,
    adaptivePositioning,
    circularBarWidth,
    sliderOffset,
  ]);

  // Handle click outside to collapse
  React.useEffect(() => {
    if (!collapsible || !isExpanded) return;
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current) return;

      const rect = rootRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxRadius = Math.max(
        barRadius + circularBarWidth / 2,
        showAlphaSlider || showOpacitySlider
          ? barRadius + sliderOffset + sliderWidth / 2
          : 0,
      );

      const isOutsideCircle = distance > maxRadius + 4; // 4px tolerance buffer

      if (isOutsideCircle || !rootRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        if (onCollapse) {
          onCollapse(outputColor);
        }
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [
    collapsible,
    isExpanded,
    onCollapse,
    outputColor,
    barRadius,
    circularBarWidth,
    showAlphaSlider,
    showOpacitySlider,
    sliderOffset,
    sliderWidth,
  ]);

  // Sync callbacks
  const updateValue = (nextVal: BlossomColorPickerValue) => {
    if (!value) {
      setInternalValue(nextVal);
    }
    if (onChange) {
      const newBaseSaturation =
        nextVal.originalSaturation ??
        allColors.find((c) => c.h === nextVal.hue)?.s ??
        70;
      const nextLightness =
        nextVal.lightness ?? sliderValueToLightness(nextVal.saturation);
      const nextVisualSat = getVisualSaturation(
        nextVal.saturation,
        newBaseSaturation,
      );

      const { r, g, b } = hslToRgb(nextVal.hue, nextVisualSat, nextLightness);
      onChange({
        ...nextVal,
        originalSaturation: newBaseSaturation,
        lightness: nextLightness,
        hex: hslToHex(nextVal.hue, nextVisualSat, nextLightness),
        hsl: hslToString(nextVal.hue, nextVisualSat, nextLightness),
        hsla: hslaToString(
          nextVal.hue,
          nextVisualSat,
          nextLightness,
          nextVal.alpha,
        ),
        rgb: `rgb(${r}, ${g}, ${b})`,
        rgba: rgbaToString(r, g, b, nextVal.alpha),
        r,
        g,
        b,
      });
    }
  };

  const handleCoreClick = async () => {
    if (disabled) return;

    if (isExpanded && hasEyeDropper) {
      try {
        const EyeDropperClass = (
          window as unknown as {
            EyeDropper: new () => {
              open: () => Promise<{ sRGBHex: string }>;
            };
          }
        ).EyeDropper;
        const eyeDropper = new EyeDropperClass();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const hex = result.sRGBHex;
          const hsl = hexToHsl(hex);
          updateValue({
            hue: hsl.h,
            saturation: lightnessToSliderValue(hsl.l),
            lightness: hsl.l,
            originalSaturation: hsl.s,
            alpha: currentValue.alpha,
            layer: "outer",
          });
        }
      } catch (err) {
        console.warn("EyeDropper failed or was cancelled:", err);
      }
      return;
    }

    if (collapsible) {
      const next = !isExpanded;
      setIsExpanded(next);
      if (!next && onCollapse) {
        onCollapse(outputColor);
      }
    }
  };

  const handlePetalClick = (
    color: { h: number; s: number; l: number },
    layerIdx: number,
  ) => {
    updateValue({
      hue: color.h,
      saturation: lightnessToSliderValue(color.l),
      lightness: color.l,
      originalSaturation: color.s,
      alpha: currentValue.alpha,
      layer: layerIdx === 0 ? "inner" : "outer",
    });
  };

  const handleSliderChange = (val: number) => {
    const lightness = sliderValueToLightness(val);
    updateValue({
      ...currentValue,
      saturation: val,
      lightness,
      originalSaturation: currentValue.originalSaturation ?? baseSaturation,
    });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    if (openOnHover && collapsible) {
      setIsExpanded(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isExpanded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  // SVG Slider Interaction via global window events to avoid pointer-events: none issues
  const handleSliderPointerDown = (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    setIsDraggingSlider(true);
    updateSliderFromPointer(e.clientX, e.clientY);
  };

  const updateSliderFromPointer = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const centerAngle = getCenterAngle(effectivePosition);
    const val = calculateSliderValueFromPoint(
      dx,
      dy,
      centerAngle,
      30,
      effectivePosition,
    );
    handleSliderChange(val);
  };

  const updateSliderFromPointerRef = React.useRef(updateSliderFromPointer);
  React.useEffect(() => {
    updateSliderFromPointerRef.current = updateSliderFromPointer;
  });

  React.useEffect(() => {
    if (!isDraggingSlider) return;

    const handlePointerMove = (e: PointerEvent) => {
      updateSliderFromPointerRef.current(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      setIsDraggingSlider(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDraggingSlider]);

  const handleAlphaPointerDown = (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    setIsDraggingAlpha(true);
    updateAlphaFromPointer(e.clientX, e.clientY);
  };

  const updateAlphaFromPointer = (clientX: number, clientY: number) => {
    if (!alphaSvgRef.current) return;
    const rect = alphaSvgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const alphaPosition = getOppositePosition(effectivePosition);
    const centerAngle = getCenterAngle(alphaPosition);
    // Opacity slider downside (or left) is always 0, upside (or right) is always 100.
    // The bottom position uses negative correlation, others use positive correlation.
    const mathPosition = alphaPosition === "bottom" ? "left" : "right";
    const val = calculateSliderValueFromPoint(
      dx,
      dy,
      centerAngle,
      30,
      mathPosition,
    );
    updateValue({
      ...currentValue,
      alpha: val,
    });
  };

  const updateAlphaFromPointerRef = React.useRef(updateAlphaFromPointer);
  React.useEffect(() => {
    updateAlphaFromPointerRef.current = updateAlphaFromPointer;
  });

  React.useEffect(() => {
    if (!isDraggingAlpha) return;

    const handlePointerMove = (e: PointerEvent) => {
      updateAlphaFromPointerRef.current(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      setIsDraggingAlpha(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDraggingAlpha]);

  // Rendering Helpers
  const renderPetals = () => {
    const totalLayers = layers.length;
    const items: React.ReactNode[] = [];

    for (let layerIdx = 0; layerIdx < totalLayers; layerIdx++) {
      const layerColors = layers[layerIdx];
      const radius = layerRadii[layerIdx];
      const rotation = layerRotations[layerIdx];
      const previousItemsCount = layerPrefixCounts[layerIdx];
      const totalPetals = layerColors.length;
      const baseZ = (totalLayers - layerIdx) * 100;

      // Find petal closest to 90 degrees (6 o'clock)
      let bottomIndex = 0;
      let minDiff = Infinity;
      for (let i = 0; i < totalPetals; i++) {
        const angle = (i / totalPetals) * 360 - 90 + rotation;
        const normalizedAngle = ((angle % 360) + 360) % 360;
        const diff = Math.min(
          Math.abs(normalizedAngle - 90),
          360 - Math.abs(normalizedAngle - 90),
        );
        if (diff < minDiff) {
          minDiff = diff;
          bottomIndex = i;
        }
      }

      for (let index = 0; index < totalPetals; index++) {
        const color = layerColors[index];
        const staggerDelay =
          previousItemsCount * PETAL_STAGGER + index * PETAL_STAGGER;

        const isSelected = currentValue.hue === color.h;

        const createPetalStyle = (
          clip?: "left" | "right",
          zIndexOverride?: number,
          isInteraction = false,
        ): React.CSSProperties => {
          const angle = (index / totalPetals) * 360 - 90 + rotation;
          const radian = (angle * Math.PI) / 180;
          let px = Math.cos(radian) * radius;
          let py = Math.sin(radian) * radius;

          const isHovered =
            hoveredPetal?.layer === layerIdx && hoveredPetal?.index === index;

          // Push effect
          if (isExpanded && mousePos && !isHovered && !isInteraction) {
            const dx = px - mousePos.x;
            const dy = py - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDistance = 60;
            if (dist < minDistance) {
              const pushStrength = (1 - dist / minDistance) * 6;
              const pushAngle = Math.atan2(dy, dx);
              px += Math.cos(pushAngle) * pushStrength;
              py += Math.sin(pushAngle) * pushStrength;
            }
          }

          const scale = isHovered && !isInteraction ? 1.1 : 1;
          const colorString = hslaToString(
            color.h,
            color.s,
            color.l,
            isInteraction ? 0 : 100,
          );

          return {
            backgroundColor: colorString,
            transform: isExpanded
              ? `translate(${px}px, ${py}px) scale(${scale})`
              : "translate(0px, 0px) scale(0)",
            opacity: isExpanded ? 1 : 0,
            filter:
              isHovered && !isInteraction ? "brightness(1.1)" : "brightness(1)",
            boxShadow:
              isExpanded && !isInteraction
                ? isHovered
                  ? "0 4px 12px rgba(0,0,0,0.25)"
                  : "0 2px 6px rgba(0,0,0,0.15)"
                : "none",
            zIndex: zIndexOverride ?? baseZ + index,
            pointerEvents: isExpanded
              ? index === bottomIndex
                ? isInteraction
                  ? "auto"
                  : "none"
                : "auto"
              : "none",
            clipPath:
              clip === "left"
                ? "polygon(0% -50%, 50% -50%, 50% 150%, 0% 150%)"
                : clip === "right"
                  ? "polygon(50% -50%, 100% -50%, 100% 150%, 50% 150%)"
                  : undefined,
            transition: `
              transform ${isExpanded && mousePos && !isHovered ? "150ms ease-out" : `${animationDuration}ms ${BLOOM_EASING_CSS} ${isExpanded && !isHovered ? staggerDelay : 0}ms`},
              opacity ${animationDuration}ms ${BLOOM_EASING_CSS} ${isExpanded && !isHovered ? staggerDelay : 0}ms,
              background-color 200ms ease,
              box-shadow 200ms ease,
              filter 200ms ease
            `,
          };
        };

        if (index === bottomIndex) {
          const uZ = baseZ - 1;
          const lZ = getPetalZIndex(
            index,
            bottomIndex,
            totalPetals,
            layerIdx,
            totalLayers,
            true,
            false,
          );
          const rZ = getPetalZIndex(
            index,
            bottomIndex,
            totalPetals,
            layerIdx,
            totalLayers,
            false,
            true,
          );
          const iZ = baseZ + totalPetals + 20;

          items.push(
            <div
              key={`${layerIdx}-${index}-underlay`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${petalSize}px`,
                height: `${petalSize}px`,
                marginLeft: `${-petalSize / 2}px`,
                marginTop: `${-petalSize / 2}px`,
                left: "50%",
                top: "50%",
                ...createPetalStyle(undefined, uZ),
              }}
            />,
            <div
              key={`${layerIdx}-${index}-left`}
              className={cn(
                "absolute rounded-full pointer-events-none",
                isSelected &&
                  isExpanded &&
                  "ring-2 ring-white ring-offset-2 ring-offset-background",
              )}
              style={{
                width: `${petalSize}px`,
                height: `${petalSize}px`,
                marginLeft: `${-petalSize / 2}px`,
                marginTop: `${-petalSize / 2}px`,
                left: "50%",
                top: "50%",
                ...createPetalStyle("left", lZ),
              }}
            />,
            <div
              key={`${layerIdx}-${index}-right`}
              className={cn(
                "absolute rounded-full pointer-events-none",
                isSelected &&
                  isExpanded &&
                  "ring-2 ring-white ring-offset-2 ring-offset-background",
              )}
              style={{
                width: `${petalSize}px`,
                height: `${petalSize}px`,
                marginLeft: `${-petalSize / 2}px`,
                marginTop: `${-petalSize / 2}px`,
                left: "50%",
                top: "50%",
                ...createPetalStyle("right", rZ),
              }}
            />,
            <button
              key={`${layerIdx}-${index}-interaction`}
              type="button"
              tabIndex={isExpanded ? 0 : -1}
              onClick={() => handlePetalClick(color, layerIdx)}
              onMouseEnter={() => setHoveredPetal({ layer: layerIdx, index })}
              onMouseLeave={() => setHoveredPetal(null)}
              aria-label={`Select color hue ${color.h}`}
              className="absolute rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                width: `${petalSize}px`,
                height: `${petalSize}px`,
                marginLeft: `${-petalSize / 2}px`,
                marginTop: `${-petalSize / 2}px`,
                left: "50%",
                top: "50%",
                ...createPetalStyle(undefined, iZ, true),
              }}
            />,
          );
        } else {
          items.push(
            <button
              key={`${layerIdx}-${index}`}
              type="button"
              tabIndex={isExpanded ? 0 : -1}
              onClick={() => handlePetalClick(color, layerIdx)}
              onMouseEnter={() => setHoveredPetal({ layer: layerIdx, index })}
              onMouseLeave={() => setHoveredPetal(null)}
              aria-label={`Select color hue ${color.h}`}
              className={cn(
                "absolute rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                isSelected &&
                  isExpanded &&
                  "ring-2 ring-white ring-offset-2 ring-offset-background",
              )}
              style={{
                width: `${petalSize}px`,
                height: `${petalSize}px`,
                marginLeft: `${-petalSize / 2}px`,
                marginTop: `${-petalSize / 2}px`,
                left: "50%",
                top: "50%",
                ...createPetalStyle(
                  undefined,
                  getPetalZIndex(
                    index,
                    bottomIndex,
                    totalPetals,
                    layerIdx,
                    totalLayers,
                  ),
                ),
              }}
            />,
          );
        }
      }
    }

    return items;
  };

  const renderArcSlider = () => {
    if (!showAlphaSlider) return null;

    const centerAngle = getCenterAngle(effectivePosition);
    const drawStartAngle = centerAngle - 30;
    const drawEndAngle = centerAngle + 30;

    const size =
      (barRadius + sliderOffset + sliderWidth / 2 + circularBarWidth) * 2 + 20;
    const center = size / 2;

    const arcD = describeArc(
      center,
      center,
      barRadius + sliderOffset,
      drawStartAngle,
      drawEndAngle,
    );

    const valStartAngle =
      effectivePosition === "left" ? drawEndAngle : drawStartAngle;
    const valEndAngle =
      effectivePosition === "left" ? drawStartAngle : drawEndAngle;

    const gradStart = polarToCartesian(
      center,
      center,
      barRadius + sliderOffset,
      valStartAngle,
    );
    const gradEnd = polarToCartesian(
      center,
      center,
      barRadius + sliderOffset,
      valEndAngle,
    );

    const handleAngle =
      valStartAngle +
      (currentValue.saturation / 100) * (valEndAngle - valStartAngle);
    const handlePos = polarToCartesian(
      center,
      center,
      barRadius + sliderOffset,
      handleAngle,
    );

    const handleLightness = sliderValueToLightness(currentValue.saturation);
    const handleSaturation = getVisualSaturation(
      currentValue.saturation,
      baseSaturation,
    );
    const handleColor = hslToString(
      currentValue.hue,
      handleSaturation,
      handleLightness,
    );

    const gradientColors = calculateArcGradientColors(
      currentValue.hue,
      baseSaturation,
      ARC_GRADIENT_STEPS,
    );

    // `size-auto` is load-bearing on this svg and the two below it. The root
    // normalizes icons with `[&_svg:not([class*='size-'])]:size-4`, and these
    // are sized structural canvases, not icons — without a `size-` class they
    // match that rule and collapse to 16px, so the arc sliders and the ring
    // disappear while the picker looks otherwise fine.
    return (
      <svg
        ref={svgRef}
        width={size}
        height={size}
        onPointerDown={handleSliderPointerDown}
        className="size-auto absolute pointer-events-none select-none"
        style={{
          left: "50%",
          top: "50%",
          marginLeft: `${-size / 2}px`,
          marginTop: `${-size / 2}px`,
          zIndex: 50,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "scale(1)" : "scale(0.8)",
          transition: `opacity ${animationDuration}ms ${BLOOM_EASING_CSS} ${animationDuration / 2}ms, transform ${animationDuration}ms ${BLOOM_EASING_CSS} ${animationDuration / 2}ms`,
        }}
      >
        <title>Saturation & Lightness Arc Slider</title>
        <defs>
          <linearGradient
            id={`bcp-arc-grad-${currentValue.hue}`}
            gradientUnits="userSpaceOnUse"
            x1={gradStart.x}
            y1={gradStart.y}
            x2={gradEnd.x}
            y2={gradEnd.y}
          >
            {gradientColors.map((col, i) => (
              <stop
                key={`${col}-${i}`}
                offset={`${(i / (ARC_GRADIENT_STEPS - 1)) * 100}%`}
                stopColor={col}
              />
            ))}
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d={arcD}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={sliderWidth}
          strokeLinecap="round"
        />

        {/* Gradient overlay */}
        <path
          d={arcD}
          fill="none"
          stroke={`url(#bcp-arc-grad-${currentValue.hue})`}
          strokeWidth={sliderWidth}
          strokeLinecap="round"
          className={cn(
            "touch-none",
            isExpanded
              ? "pointer-events-auto cursor-pointer"
              : "pointer-events-none",
          )}
        />

        {/* Handle circle */}
        <circle
          cx={handlePos.x}
          cy={handlePos.y}
          r={sliderWidth / 2}
          fill={handleColor}
          stroke="white"
          strokeWidth="2"
          className={cn(
            "touch-none active:cursor-grabbing shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
            isExpanded
              ? "pointer-events-auto cursor-grab"
              : "pointer-events-none",
          )}
          style={{
            transition: isDraggingSlider
              ? "none"
              : `cx ${animationDuration / 3}ms ease, cy ${animationDuration / 3}ms ease`,
          }}
        />
      </svg>
    );
  };

  const renderAlphaSlider = () => {
    if (!showOpacitySlider) return null;

    const alphaPosition = getOppositePosition(effectivePosition);
    const centerAngle = getCenterAngle(alphaPosition);
    const drawStartAngle = centerAngle - 30;
    const drawEndAngle = centerAngle + 30;

    const size =
      (barRadius + sliderOffset + sliderWidth / 2 + circularBarWidth) * 2 + 20;
    const center = size / 2;

    const arcD = describeArc(
      center,
      center,
      barRadius + sliderOffset,
      drawStartAngle,
      drawEndAngle,
    );

    // Opacity slider downside (or left) is always 0, upside (or right) is always 100.
    // The bottom position draws 0 on left (drawEndAngle) and 100 on right (drawStartAngle).
    // Other positions draw 0 on downside/left (drawStartAngle) and 100 on upside/right (drawEndAngle).
    const valStartAngle =
      alphaPosition === "bottom" ? drawEndAngle : drawStartAngle;
    const valEndAngle =
      alphaPosition === "bottom" ? drawStartAngle : drawEndAngle;

    const gradStart = polarToCartesian(
      center,
      center,
      barRadius + sliderOffset,
      valStartAngle,
    );
    const gradEnd = polarToCartesian(
      center,
      center,
      barRadius + sliderOffset,
      valEndAngle,
    );

    const handleAngle =
      valStartAngle +
      (currentValue.alpha / 100) * (valEndAngle - valStartAngle);
    const handlePos = polarToCartesian(
      center,
      center,
      barRadius + sliderOffset,
      handleAngle,
    );

    const colorStart = hslaToString(
      currentValue.hue,
      visualSaturation,
      currentLightness,
      0,
    );
    const colorEnd = hslaToString(
      currentValue.hue,
      visualSaturation,
      currentLightness,
      100,
    );

    return (
      <svg
        ref={alphaSvgRef}
        width={size}
        height={size}
        onPointerDown={handleAlphaPointerDown}
        className="size-auto absolute pointer-events-none select-none"
        style={{
          left: "50%",
          top: "50%",
          marginLeft: `${-size / 2}px`,
          marginTop: `${-size / 2}px`,
          zIndex: 51,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "scale(1)" : "scale(0.8)",
          transition: `opacity ${animationDuration}ms ${BLOOM_EASING_CSS} ${animationDuration / 2}ms, transform ${animationDuration}ms ${BLOOM_EASING_CSS} ${animationDuration / 2}ms`,
        }}
      >
        <title>Alpha Opacity Arc Slider</title>
        <defs>
          <pattern
            id="bcp-checkerboard"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <rect width="8" height="8" fill="white" />
            <rect width="4" height="4" fill="#e2e8f0" />
            <rect x="4" y="4" width="4" height="4" fill="#e2e8f0" />
          </pattern>
          <linearGradient
            id={`bcp-alpha-grad-${currentValue.hue}`}
            gradientUnits="userSpaceOnUse"
            x1={gradStart.x}
            y1={gradStart.y}
            x2={gradEnd.x}
            y2={gradEnd.y}
          >
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d={arcD}
          fill="none"
          stroke="url(#bcp-checkerboard)"
          strokeWidth={sliderWidth}
          strokeLinecap="round"
        />

        {/* Gradient overlay */}
        <path
          d={arcD}
          fill="none"
          stroke={`url(#bcp-alpha-grad-${currentValue.hue})`}
          strokeWidth={sliderWidth}
          strokeLinecap="round"
          className={cn(
            "touch-none",
            isExpanded
              ? "pointer-events-auto cursor-pointer"
              : "pointer-events-none",
          )}
        />

        {/* Handle circle */}
        <circle
          cx={handlePos.x}
          cy={handlePos.y}
          r={sliderWidth / 2}
          fill={colorEnd}
          stroke="white"
          strokeWidth="2"
          className={cn(
            "touch-none active:cursor-grabbing shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
            isExpanded
              ? "pointer-events-auto cursor-grab"
              : "pointer-events-none",
          )}
          style={{
            transition: isDraggingAlpha
              ? "none"
              : `cx ${animationDuration / 3}ms ease, cy ${animationDuration / 3}ms ease`,
          }}
        />
      </svg>
    );
  };

  const renderColorBar = () => {
    const size = (barRadius + circularBarWidth / 2) * 2 + 4;
    const strokeColor = hslaToString(
      currentValue.hue,
      visualSaturation,
      currentLightness,
      currentValue.alpha,
    );

    return (
      <svg
        width={size}
        height={size}
        className="size-auto absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          marginLeft: `${-size / 2}px`,
          marginTop: `${-size / 2}px`,
          zIndex: 5,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "scale(1)" : "scale(0.8)",
          transition: `opacity ${animationDuration}ms ${BLOOM_EASING_CSS}, transform ${animationDuration}ms ${BLOOM_EASING_CSS}`,
        }}
      >
        <title>Current Color Ring</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={barRadius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={circularBarWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={barRadius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={circularBarWidth}
        />
      </svg>
    );
  };

  const size = !mounted
    ? collapsible && !initialExpanded
      ? coreSize
      : containerSize
    : isExpanded
      ? containerSize
      : coreSize;
  const initialH = defaultValue?.hue ?? DEFAULT_VALUE.hue;
  const initialS = defaultValue?.saturation ?? DEFAULT_VALUE.saturation;
  const initialL = defaultValue?.lightness ?? sliderValueToLightness(initialS);
  const initialA = (defaultValue?.alpha ?? DEFAULT_VALUE.alpha) / 100;
  const initialBgColor = `hsla(${initialH}, ${initialS}%, ${initialL}%, ${initialA})`;

  const defaultProps = {
    ref: rootRef,
    role: "group",
    "aria-label": "Color picker",
    "data-slot": "blossom-color-picker",
    className: cn(
      "relative inline-flex items-center justify-center select-none",
      mounted &&
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    style: {
      width: `${size}px`,
      height: `${size}px`,
      ...(mounted
        ? {
            transition: `width ${animationDuration}ms ${BLOOM_EASING_CSS}, height ${animationDuration}ms ${BLOOM_EASING_CSS}`,
          }
        : {}),
    },
    ...(mounted
      ? {
          onMouseEnter: handleMouseEnter,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
        }
      : {}),
    children: !mounted ? (
      <div
        className="relative rounded-full border border-black/5 dark:border-white/10"
        style={{
          width: `${coreSize}px`,
          height: `${coreSize}px`,
          backgroundColor: initialBgColor,
        }}
      />
    ) : (
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: isExpanded ? `${containerSize}px` : `${coreSize}px`,
          height: isExpanded ? `${containerSize}px` : `${coreSize}px`,
          transform: `translate(calc(-50% + ${shiftOffset.x}px), calc(-50% + ${shiftOffset.y}px))`,
          transition: `width ${animationDuration}ms ${BLOOM_EASING_CSS}, height ${animationDuration}ms ${BLOOM_EASING_CSS}, transform ${animationDuration}ms ${BLOOM_EASING_CSS}`,
          left: "50%",
          top: "50%",
          zIndex: isExpanded ? 50 : 0,
        }}
      >
        {/* Color bar */}
        {renderColorBar()}

        {/* Petals */}
        {renderPetals()}

        {/* Arc Slider */}
        {renderArcSlider()}

        {/* Alpha Opacity Arc Slider */}
        {renderAlphaSlider()}

        {/* Central Core Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleCoreClick}
          onMouseEnter={() => setIsHoveringCore(true)}
          onMouseLeave={() => setIsHoveringCore(false)}
          aria-label={
            isExpanded && hasEyeDropper
              ? "Pick color from screen"
              : `Color picker${isExpanded ? ", expanded" : ""}`
          }
          aria-expanded={isExpanded}
          className={cn(
            "relative rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-64 disabled:cursor-not-allowed border border-black/5 dark:border-white/10 flex items-center justify-center text-white",
          )}
          style={{
            width: `${coreSize}px`,
            height: `${coreSize}px`,
            backgroundColor: coreColorString,
            transform: isExpanded
              ? "scale(1)"
              : isHoveringCore
                ? "scale(1.08)"
                : "scale(1)",
            boxShadow: isExpanded
              ? "0 0 0 2px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15)"
              : "0 2px 8px rgba(0,0,0,0.15)",
            transition: `transform ${animationDuration}ms ${BLOOM_EASING_CSS}, box-shadow ${animationDuration}ms ${BLOOM_EASING_CSS}, background-color 200ms ease`,
            zIndex: 1000,
          }}
        >
          {isExpanded && hasEyeDropper && (
            <IconSlot
              name="Dropper"
              fallback={Pipette}
              className="size-4 shrink-0 transition-opacity duration-200"
              style={{
                color: currentLightness > 70 ? "rgba(0,0,0,0.6)" : "white",
              }}
            />
          )}
        </button>
      </div>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

// ==========================================
// ColorPicker (aka ChromePicker Panel) Component
// ==========================================

export interface ColorPickerProps extends Omit<
  BlossomColorPickerProps,
  "className"
> {
  darkMode?: boolean;
  className?: string;
}

export function ColorPicker({
  value,
  defaultValue,
  colors,
  onChange,
  onCollapse,
  disabled = false,
  openOnHover = false,
  initialExpanded = true, // By default expanded for the panel
  animationDuration = 300,
  showAlphaSlider = true,
  coreSize = 36,
  petalSize = 32,
  showCoreColor = true,
  sliderPosition,
  adaptivePositioning = true,
  circularBarWidth = BAR_WIDTH,
  sliderWidth = BAR_WIDTH,
  sliderOffset = SLIDER_OFFSET,
  collapsible = false, // Usually fixed/non-collapsible for direct panels
  darkMode,
  className,
  ref,
  render,
  triggerIcon,
  ...props
}: ColorPickerProps & {
  ref?: React.Ref<HTMLDivElement> /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */;
  triggerIcon?: React.ReactNode;
}): React.JSX.Element {
  // Mode of inputs: HEX, RGBA, HSLA
  const [colorMode, setColorMode] = React.useState<"HEX" | "RGBA" | "HSLA">(
    "HEX",
  );

  // Internal value matching the radial picker
  const [internalPickerVal, setInternalPickerVal] =
    React.useState<BlossomColorPickerValue>(
      defaultValue ?? {
        hue: 210,
        saturation: 50,
        alpha: 100,
        layer: "outer",
      },
    );

  const currentValue = value ?? internalPickerVal;

  // Resolve color output parameters
  const normalizedColors = React.useMemo(() => {
    return colors && colors.length > 0
      ? colors.map(parseColor)
      : DEFAULT_COLORS;
  }, [colors]);

  const baseSaturation = React.useMemo(() => {
    if (currentValue.originalSaturation !== undefined) {
      return currentValue.originalSaturation;
    }
    const match = normalizedColors.find((c) => c.h === currentValue.hue);
    return match?.s ?? 70;
  }, [normalizedColors, currentValue.hue, currentValue.originalSaturation]);

  const currentLightness = React.useMemo(() => {
    return (
      currentValue.lightness ?? sliderValueToLightness(currentValue.saturation)
    );
  }, [currentValue.lightness, currentValue.saturation]);

  const visualSaturation = React.useMemo(() => {
    return getVisualSaturation(currentValue.saturation, baseSaturation);
  }, [currentValue.saturation, baseSaturation]);

  const parsedOutput = React.useMemo(() => {
    return createColorOutput(
      currentValue.hue,
      currentValue.saturation,
      visualSaturation,
      baseSaturation,
      currentLightness,
      currentValue.alpha,
      currentValue.layer,
    );
  }, [currentValue, visualSaturation, baseSaturation, currentLightness]);

  // Local inputs value text state to avoid cursor jump while typing
  const [hexInput, setHexInput] = React.useState(
    parsedOutput.hex.toUpperCase(),
  );
  const [rgbaInputs, setRgbaInputs] = React.useState({
    r: String(parsedOutput.r),
    g: String(parsedOutput.g),
    b: String(parsedOutput.b),
    a: String(
      parsedOutput.alpha === 100 ? 1 : (parsedOutput.alpha / 100).toFixed(2),
    ),
  });
  const [hslaInputs, setHslaInputs] = React.useState({
    h: String(Math.round(parsedOutput.hue)),
    s: String(Math.round(parsedOutput.saturation)),
    l: String(Math.round(parsedOutput.lightness ?? 50)),
    a: String(
      parsedOutput.alpha === 100 ? 1 : (parsedOutput.alpha / 100).toFixed(2),
    ),
  });

  // Synchronize inputs whenever parsedOutput changes
  React.useEffect(() => {
    setHexInput(parsedOutput.hex.toUpperCase());
    setRgbaInputs({
      r: String(parsedOutput.r),
      g: String(parsedOutput.g),
      b: String(parsedOutput.b),
      a: String(
        parsedOutput.alpha === 100 ? 1 : (parsedOutput.alpha / 100).toFixed(2),
      ),
    });
    setHslaInputs({
      h: String(Math.round(parsedOutput.hue)),
      s: String(Math.round(parsedOutput.saturation)),
      l: String(Math.round(parsedOutput.lightness ?? 50)),
      a: String(
        parsedOutput.alpha === 100 ? 1 : (parsedOutput.alpha / 100).toFixed(2),
      ),
    });
  }, [parsedOutput]);

  const updateColor = (nextVal: BlossomColorPickerValue) => {
    if (!value) {
      setInternalPickerVal(nextVal);
    }
    if (onChange) {
      const newBaseSaturation =
        nextVal.originalSaturation ??
        normalizedColors.find((c) => c.h === nextVal.hue)?.s ??
        70;
      const nextLightness =
        nextVal.lightness ?? sliderValueToLightness(nextVal.saturation);
      const nextVisualSat = getVisualSaturation(
        nextVal.saturation,
        newBaseSaturation,
      );

      const { r, g, b } = hslToRgb(nextVal.hue, nextVisualSat, nextLightness);

      onChange({
        ...nextVal,
        originalSaturation: newBaseSaturation,
        lightness: nextLightness,
        hex: hslToHex(nextVal.hue, nextVisualSat, nextLightness),
        hsl: hslToString(nextVal.hue, nextVisualSat, nextLightness),
        hsla: hslaToString(
          nextVal.hue,
          nextVisualSat,
          nextLightness,
          nextVal.alpha,
        ),
        rgb: `rgb(${r}, ${g}, ${b})`,
        rgba: rgbaToString(r, g, b, nextVal.alpha),
        r,
        g,
        b,
      });
    }
  };

  const handleRadialPickerChange = (color: BlossomColorPickerColor) => {
    updateColor({
      hue: color.hue,
      saturation: color.saturation,
      lightness: color.lightness,
      originalSaturation: color.originalSaturation,
      alpha: currentValue.alpha,
      layer: color.layer,
    });
  };

  const handleAlphaChange = (nextAlpha: number) => {
    updateColor({
      ...currentValue,
      alpha: nextAlpha,
    });
  };

  // Mode toggler
  const toggleMode = () => {
    setColorMode((prev) => {
      if (prev === "HEX") return "RGBA";
      if (prev === "RGBA") return "HSLA";
      return "HEX";
    });
  };

  // Sync from Hex typing
  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val) || /^[0-9A-F]{6}$/i.test(val)) {
      const hexStr = val.startsWith("#") ? val : `#${val}`;
      const hsl = hexToHsl(hexStr);
      updateColor({
        hue: hsl.h,
        saturation: lightnessToSliderValue(hsl.l),
        lightness: hsl.l,
        originalSaturation: hsl.s,
        alpha: currentValue.alpha,
        layer: currentValue.layer,
      });
    }
  };

  // Sync from RGBA typing
  const handleRgbaInputChange = (key: keyof typeof rgbaInputs, val: string) => {
    const nextRgba = { ...rgbaInputs, [key]: val };
    setRgbaInputs(nextRgba);

    const r = parseInt(nextRgba.r, 10);
    const g = parseInt(nextRgba.g, 10);
    const b = parseInt(nextRgba.b, 10);
    const a = parseFloat(nextRgba.a);

    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      const hsl = rgbToHsl(r, g, b);
      updateColor({
        hue: hsl.h,
        saturation: lightnessToSliderValue(hsl.l),
        lightness: hsl.l,
        originalSaturation: hsl.s,
        alpha: Number.isNaN(a)
          ? currentValue.alpha
          : Math.max(0, Math.min(100, a * 100)),
        layer: currentValue.layer,
      });
    }
  };

  // Sync from HSLA typing
  const handleHslaInputChange = (key: keyof typeof hslaInputs, val: string) => {
    const nextHsla = { ...hslaInputs, [key]: val };
    setHslaInputs(nextHsla);

    const h = parseInt(nextHsla.h, 10);
    const s = parseInt(nextHsla.s, 10);
    const l = parseInt(nextHsla.l, 10);
    const a = parseFloat(nextHsla.a);

    if (!Number.isNaN(h) && !Number.isNaN(s) && !Number.isNaN(l)) {
      updateColor({
        hue: Math.max(0, Math.min(360, h)),
        saturation: Math.max(0, Math.min(100, s)),
        lightness: Math.max(0, Math.min(100, l)),
        originalSaturation: baseSaturation,
        alpha: Number.isNaN(a)
          ? currentValue.alpha
          : Math.max(0, Math.min(100, a * 100)),
        layer: currentValue.layer,
      });
    }
  };

  const defaultProps = {
    ref,
    "data-slot": "color-picker",
    className: cn(
      "inline-flex flex-col rounded-2xl border bg-card text-card-foreground shadow-xs/5 overflow-hidden w-[250px] select-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      darkMode && "dark",
      className,
    ),
    children: (
      <>
        {/* Top region: blossom color picker */}
        <div className="flex justify-center items-center pt-10 pb-[calc(--spacing(10)-1px)] px-4 bg-muted/20 border-b">
          <BlossomColorPicker
            value={currentValue}
            colors={colors}
            onChange={handleRadialPickerChange}
            onCollapse={onCollapse}
            disabled={disabled}
            openOnHover={openOnHover}
            initialExpanded={initialExpanded}
            animationDuration={animationDuration}
            showAlphaSlider={showAlphaSlider}
            showOpacitySlider={false}
            coreSize={coreSize}
            petalSize={petalSize}
            showCoreColor={showCoreColor}
            sliderPosition={sliderPosition}
            adaptivePositioning={adaptivePositioning}
            circularBarWidth={circularBarWidth}
            sliderWidth={sliderWidth}
            sliderOffset={sliderOffset}
            collapsible={collapsible}
          />
        </div>

        {/* Bottom region: sliders, inputs, formats */}
        <div className="p-4 flex flex-col gap-4">
          {/* Alpha slider row */}
          <div className="flex items-center gap-3">
            {/* Color Swatch Preview */}
            <div className="relative size-9 rounded-full border border-black/5 dark:border-white/10 overflow-hidden shrink-0">
              {/* Swatch checkerboard grid */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-size-[8px_8px] bg-position-[0_0,0_4px,4px_-4px,-4px_0px] bg-white opacity-40" />
              <div
                className="absolute inset-0 rounded-full shadow-inner"
                style={{ backgroundColor: parsedOutput.rgba }}
              />
            </div>

            {/* Custom Alpha Slider */}
            <div className="relative flex-1 h-3 flex items-center">
              <div className="relative w-full h-2.5 rounded-full border border-black/5 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-size-[8px_8px] bg-position-[0_0,0_4px,4px_-4px,-4px_0px] bg-white opacity-40" />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, rgba(${parsedOutput.r}, ${parsedOutput.g}, ${parsedOutput.b}, 0), rgb(${parsedOutput.r}, ${parsedOutput.g}, ${parsedOutput.b}))`,
                  }}
                />
              </div>

              {/* Slider thumb */}
              <div
                className="absolute size-3.5 -ml-1.75 bg-card border border-input shadow-xs/5 rounded-full pointer-events-none top-1/2 -translate-y-1/2"
                style={{ left: `${currentValue.alpha}%` }}
              />

              <input
                type="range"
                aria-label="Opacity"
                min={0}
                max={100}
                disabled={disabled}
                value={currentValue.alpha}
                onChange={(e) => handleAlphaChange(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Formats and inputs row */}
          <div className="flex gap-2 items-start">
            <div className="flex-1 flex gap-1.5 min-w-0">
              {colorMode === "HEX" && (
                <div className="flex-1 flex flex-col items-center gap-1">
                  <input
                    type="text"
                    aria-label="Hex color"
                    disabled={disabled}
                    value={hexInput}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    className="w-full h-7 rounded-md border border-input bg-background/50 px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1)-1px)] text-center font-mono text-xs uppercase shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                  />
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    Hex
                  </span>
                </div>
              )}

              {colorMode === "RGBA" && (
                <>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Red"
                      disabled={disabled}
                      value={rgbaInputs.r}
                      onChange={(e) =>
                        handleRgbaInputChange("r", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      R
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Green"
                      disabled={disabled}
                      value={rgbaInputs.g}
                      onChange={(e) =>
                        handleRgbaInputChange("g", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      G
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Blue"
                      disabled={disabled}
                      value={rgbaInputs.b}
                      onChange={(e) =>
                        handleRgbaInputChange("b", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      B
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Alpha"
                      disabled={disabled}
                      value={rgbaInputs.a}
                      onChange={(e) =>
                        handleRgbaInputChange("a", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      A
                    </span>
                  </div>
                </>
              )}

              {colorMode === "HSLA" && (
                <>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Hue"
                      disabled={disabled}
                      value={hslaInputs.h}
                      onChange={(e) =>
                        handleHslaInputChange("h", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      H
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Saturation"
                      disabled={disabled}
                      value={hslaInputs.s}
                      onChange={(e) =>
                        handleHslaInputChange("s", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      S
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Lightness"
                      disabled={disabled}
                      value={hslaInputs.l}
                      onChange={(e) =>
                        handleHslaInputChange("l", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      L
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                      type="text"
                      aria-label="Alpha"
                      disabled={disabled}
                      value={hslaInputs.a}
                      onChange={(e) =>
                        handleHslaInputChange("a", e.target.value)
                      }
                      className="w-full h-7 rounded-md border border-input bg-background/50 py-[calc(--spacing(1)-1px)] text-center font-mono text-xs shadow-2xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-64"
                    />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      A
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Switch format button */}
            <button
              type="button"
              disabled={disabled}
              onClick={toggleMode}
              aria-label="Switch color format"
              className="relative flex items-center justify-center h-7 px-[calc(--spacing(2)-1px)] rounded-md border border-input bg-background/30 hover:bg-muted/70 active:bg-muted/90 cursor-pointer text-muted-foreground transition-colors disabled:opacity-64 disabled:cursor-not-allowed shadow-2xs focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11"
            >
              <IconSlot
                name="ChevronDown"
                icon={triggerIcon}
                fallback={ChevronDown}
                className="size-3.5"
              />
            </button>
          </div>
        </div>
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
