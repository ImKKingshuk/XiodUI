"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import * as React from "react";

// --- Types ---

export interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // Current progress fraction (0 to 1) or playback seconds
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  duration?: number; // Total duration (e.g., in seconds). Defaults to 1 for progress fraction
  active?: boolean; // Whether microphone / animation is actively running
  processing?: boolean; // AI "Thinking" state (breathing sine wave)
  mode?: "static" | "scrolling" | "live";
  microphone?: boolean; // Automatically setup microphone recording on active
  deviceId?: string;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  barColor?: string; // Inactive bar color (fallback to CSS variables)
  progressColor?: string; // Active bar color (fallback to CSS variables)
  fadeEdges?: boolean;
  fadeWidth?: number;
  sensitivity?: number;
  updateRate?: number;
  seed?: number; // Seed for deterministic random static waveform
  data?: number[]; // Custom static waveform data (values between 0 and 1)
}

interface WaveformContextValue {
  value: number;
  duration: number;
  onValueChange?: (value: number) => void;
  active: boolean;
  processing: boolean;
  mode: "static" | "scrolling" | "live";
  barWidth: number;
  barGap: number;
  barRadius: number;
  barColor?: string;
  progressColor?: string;
  fadeEdges: boolean;
  fadeWidth: number;
  sensitivity: number;
  updateRate: number;
  seed: number;
  data?: number[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  seekTo: (clientX: number) => void;
  liveDataRef: React.MutableRefObject<number[]>;
  needsRedrawRef: React.MutableRefObject<boolean>;
  triggerRedraw: () => void;
}

const WaveformContext = React.createContext<WaveformContextValue | null>(null);

export function useWaveform(): WaveformContextValue {
  const context = React.useContext(WaveformContext);
  if (!context) {
    throw new Error("Waveform components must be wrapped in <Waveform />");
  }
  return context;
}

// Helper to generate deterministic random wave data for SSR/client consistency
function generateDeterministicData(length: number, seed: number): number[] {
  const data: number[] = [];
  let currentSeed = seed;

  // Simple LCG random generator
  const rand = () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };

  for (let i = 0; i < length; i++) {
    const wave1 = Math.sin(i * 0.1) * 0.25;
    const wave2 = Math.cos(i * 0.05) * 0.15;
    const randomVal = rand() * 0.3;
    const val = Math.max(0.08, Math.min(0.9, 0.45 + wave1 + wave2 + randomVal));
    data.push(val);
  }
  return data;
}

// --- Component: Waveform (Root Container) ---

export function Waveform({
  children,
  className,
  value: controlledValue,
  defaultValue,
  onValueChange,
  duration = 1,
  active = false,
  processing = false,
  mode = "static",
  microphone = false,
  deviceId,
  barWidth = 3,
  barGap = 2,
  barRadius = 1.5,
  barColor,
  progressColor,
  fadeEdges = true,
  fadeWidth = 24,
  sensitivity = 1,
  updateRate = 30,
  seed = 42,
  data,
  ...props
}: WaveformProps): React.JSX.Element {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? 0);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const [isDragging, setIsDragging] = React.useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const liveDataRef = React.useRef<number[]>([]);
  const needsRedrawRef = React.useRef(true);

  // Audio Context references for microphone mode
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const triggerRedraw = React.useCallback(() => {
    needsRedrawRef.current = true;
  }, []);

  const seekTo = React.useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const progress = clickX / rect.width;
      const newValue = progress * duration;

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
      triggerRedraw();
    },
    [duration, onValueChange, controlledValue, triggerRedraw],
  );

  // Handle microphone input setup
  React.useEffect(() => {
    if (!active || !microphone) {
      // Clean up microphone connection
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      return;
    }

    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: deviceId
            ? {
                deviceId: { exact: deviceId },
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              }
            : {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
        });
        streamRef.current = stream;

        const AudioContextConstructor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;

        const audioContext = new AudioContextConstructor();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        liveDataRef.current = [];
      } catch (err) {
        console.error("Microphone access failed in Waveform root:", err);
      }
    };

    void setupMicrophone();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        void audioContextRef.current.close();
      }
    };
  }, [active, microphone, deviceId]);

  // Audio frequency capture loop
  React.useEffect(() => {
    if (!active || !microphone) return;

    let rafId: number;
    let lastTime = 0;

    const captureSample = (time: number) => {
      if (time - lastTime >= updateRate && analyserRef.current) {
        lastTime = time;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Slice to relevant frequency bins (skip super-low and high register noise)
        const start = Math.floor(bufferLength * 0.05);
        const end = Math.floor(bufferLength * 0.45);
        const sampleSlice = dataArray.slice(start, end);

        if (mode === "scrolling") {
          let sum = 0;
          for (let i = 0; i < sampleSlice.length; i++) {
            sum += sampleSlice[i];
          }
          const avg = (sum / sampleSlice.length / 255) * sensitivity;

          liveDataRef.current.push(Math.min(1, Math.max(0.08, avg)));
          if (liveDataRef.current.length > 120) {
            liveDataRef.current.shift();
          }
        } else {
          // Static live mode: update amplitude visualizer bars dynamically
          const bars: number[] = [];
          const count = Math.max(
            10,
            Math.floor(
              (containerRef.current?.getBoundingClientRect().width || 300) /
                (barWidth + barGap),
            ),
          );
          const half = Math.floor(count / 2);

          for (let i = 0; i < half; i++) {
            const dataIdx = Math.floor((i / half) * sampleSlice.length);
            const val = Math.min(1, (sampleSlice[dataIdx] / 255) * sensitivity);
            bars.unshift(Math.max(0.06, val));
          }
          for (let i = 0; i < half; i++) {
            const dataIdx = Math.floor((i / half) * sampleSlice.length);
            const val = Math.min(1, (sampleSlice[dataIdx] / 255) * sensitivity);
            bars.push(Math.max(0.06, val));
          }
          liveDataRef.current = bars;
        }
        needsRedrawRef.current = true;
      }
      rafId = requestAnimationFrame(captureSample);
    };

    rafId = requestAnimationFrame(captureSample);
    return () => cancelAnimationFrame(rafId);
  }, [active, microphone, mode, barWidth, barGap, sensitivity, updateRate]);

  // AI thinking state wave generation
  React.useEffect(() => {
    if (!processing || active) return;

    let rafId: number;
    let time = 0;

    const generateWave = () => {
      time += 0.04;
      const count = Math.max(
        10,
        Math.floor(
          (containerRef.current?.getBoundingClientRect().width || 300) /
            (barWidth + barGap),
        ),
      );

      const bars: number[] = [];
      if (mode === "scrolling") {
        const val = Math.min(
          1,
          Math.max(
            0.08,
            0.35 + Math.sin(time) * 0.2 + Math.cos(time * 1.7) * 0.1,
          ),
        );
        liveDataRef.current.push(val);
        if (liveDataRef.current.length > 120) {
          liveDataRef.current.shift();
        }
      } else {
        const half = Math.floor(count / 2);
        for (let i = 0; i < count; i++) {
          const normDist = (i - half) / half;
          const amplitudeWeight = 1 - Math.abs(normDist) * 0.45;
          const sine1 = Math.sin(time * 1.6 + normDist * 3.5) * 0.25;
          const sine2 = Math.sin(time * 0.9 - normDist * 2.2) * 0.18;
          const sine3 = Math.cos(time * 2.4 + normDist) * 0.12;
          const combined = sine1 + sine2 + sine3;
          bars.push(
            Math.max(0.06, Math.min(1, (0.35 + combined) * amplitudeWeight)),
          );
        }
        liveDataRef.current = bars;
      }

      needsRedrawRef.current = true;
      rafId = requestAnimationFrame(generateWave);
    };

    rafId = requestAnimationFrame(generateWave);
    return () => cancelAnimationFrame(rafId);
  }, [processing, active, mode, barWidth, barGap]);

  // Handle resizing, parameter change triggers, theme switches, and mount timing delays
  React.useEffect(() => {
    triggerRedraw();

    // Force redraws after brief delays to ensure CSS variables and fonts have loaded
    const t1 = setTimeout(triggerRedraw, 50);
    const t2 = setTimeout(triggerRedraw, 250);
    const t3 = setTimeout(triggerRedraw, 1000);

    // Watch for document-level theme toggles to redraw immediately
    let observer: MutationObserver | null = null;
    if (typeof document !== "undefined") {
      observer = new MutationObserver(() => {
        triggerRedraw();
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [triggerRedraw]);

  const contextValue = React.useMemo<WaveformContextValue>(
    () => ({
      value,
      duration,
      onValueChange,
      active,
      processing,
      mode,
      barWidth,
      barGap,
      barRadius,
      barColor,
      progressColor,
      fadeEdges,
      fadeWidth,
      sensitivity,
      updateRate,
      seed,
      data,
      canvasRef,
      containerRef,
      isDragging,
      setIsDragging,
      seekTo,
      liveDataRef,
      needsRedrawRef,
      triggerRedraw,
    }),
    [
      value,
      duration,
      onValueChange,
      active,
      processing,
      mode,
      barWidth,
      barGap,
      barRadius,
      barColor,
      progressColor,
      fadeEdges,
      fadeWidth,
      sensitivity,
      updateRate,
      seed,
      data,
      isDragging,
      seekTo,
      triggerRedraw,
    ],
  );

  return (
    <WaveformContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        data-slot="waveform"
        className={cn(
          "relative w-full select-none flex items-center justify-center min-h-[64px]",
          className,
        )}
        {...props}
      >
        {children || <WaveformVisual />}
      </div>
    </WaveformContext.Provider>
  );
}

// --- Component: WaveformVisual (Canvas bar rendering) ---

export interface WaveformVisualProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

export function WaveformVisual({
  className,
  ...props
}: WaveformVisualProps): React.JSX.Element {
  const {
    canvasRef,
    containerRef,
    data,
    seed,
    mode,
    active,
    processing,
    barWidth,
    barGap,
    barRadius,
    barColor,
    progressColor,
    fadeEdges,
    fadeWidth,
    value,
    duration,
    liveDataRef,
    needsRedrawRef,
  } = useWaveform();

  const animationRef = React.useRef<number>(0);
  const gradientCacheRef = React.useRef<CanvasGradient | null>(null);
  const lastWidthRef = React.useRef(0);

  // Resize handler to adjust canvas bounds
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      gradientCacheRef.current = null;
      lastWidthRef.current = rect.width;
      needsRedrawRef.current = true;
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [canvasRef, containerRef, needsRedrawRef]);

  // Main rendering logic inside Animation Loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!needsRedrawRef.current) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // Clear the canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Grab theme styling parameters
      const style = getComputedStyle(canvas);
      const computedBarColor =
        barColor ||
        style.getPropertyValue("--border").trim() ||
        style.getPropertyValue("--color-border").trim() ||
        "rgba(0, 0, 0, 0.16)";
      const computedProgressColor =
        progressColor ||
        style.getPropertyValue("--primary").trim() ||
        style.getPropertyValue("--color-primary").trim() ||
        "#000";

      const step = barWidth + barGap;
      const barCount = Math.floor(rect.width / step);
      const centerY = rect.height / 2;

      // Determine waveform data source
      let currentBars: number[] = [];
      const hasLiveData = active || processing;

      if (hasLiveData) {
        currentBars = [...liveDataRef.current];
      } else if (data && data.length > 0) {
        currentBars = data;
      } else {
        // Fallback: Generate deterministic wave data if no data was passed
        currentBars = generateDeterministicData(barCount, seed);
      }

      // Draw all bars
      const progressFraction =
        duration > 0 ? Math.min(1, Math.max(0, value / duration)) : 0;
      const progressX = rect.width * progressFraction;

      if (mode === "scrolling" && hasLiveData) {
        // Scrolling audio visualizer mode
        for (let i = 0; i < barCount && i < currentBars.length; i++) {
          const valIndex = currentBars.length - 1 - i;
          const val = currentBars[valIndex] || 0.08;
          const x = rect.width - (i + 1) * step;
          const height = Math.max(4, val * rect.height * 0.82);
          const y = centerY - height / 2;

          ctx.fillStyle = computedProgressColor;
          ctx.globalAlpha = 0.45 + val * 0.55;

          if (barRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, barRadius);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth, height);
          }
        }
      } else {
        // Static rendering (Standard Audio Player or symmetric mic visualization)
        const _renderLength = Math.min(barCount, currentBars.length);

        for (let i = 0; i < barCount; i++) {
          // Stretch or scale database indices to fill container
          const dataIndex = Math.min(
            currentBars.length - 1,
            Math.floor((i / barCount) * currentBars.length),
          );
          const val = currentBars[dataIndex] || 0.08;
          const x = i * step;
          const height = Math.max(4, val * rect.height * 0.82);
          const y = centerY - height / 2;

          // Paint played section in primary and remaining in background muted border
          const isPlayed = x < progressX && !hasLiveData;
          ctx.fillStyle = isPlayed ? computedProgressColor : computedBarColor;
          ctx.globalAlpha = isPlayed ? 1.0 : 0.45;

          if (barRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, barRadius);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth, height);
          }
        }
      }

      // Apply linear gradient masking to fade edges smoothly
      if (fadeEdges && fadeWidth > 0) {
        if (!gradientCacheRef.current || lastWidthRef.current !== rect.width) {
          const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
          const fadePercent = Math.min(0.35, fadeWidth / rect.width);

          gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
          gradient.addColorStop(fadePercent, "rgba(255, 255, 255, 0)");
          gradient.addColorStop(1 - fadePercent, "rgba(255, 255, 255, 0)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 1)");

          gradientCacheRef.current = gradient;
          lastWidthRef.current = rect.width;
        }

        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = gradientCacheRef.current;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.globalCompositeOperation = "source-over";
      }

      // Reset transparency
      ctx.globalAlpha = 1.0;

      // Throttle redraw checks if static
      needsRedrawRef.current = active || processing;
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [
    canvasRef,
    barWidth,
    barGap,
    barRadius,
    barColor,
    progressColor,
    fadeEdges,
    fadeWidth,
    value,
    duration,
    mode,
    active,
    processing,
    data,
    seed,
    liveDataRef,
    needsRedrawRef,
  ]);

  return (
    <canvas
      aria-hidden="true"
      ref={canvasRef}
      data-slot="waveform-visual"
      className={cn(
        "block w-full h-full text-foreground border-border",
        className,
      )}
      {...props}
    />
  );
}

// --- Component: WaveformScrubber (Interactive dragging area) ---

export interface WaveformScrubberProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WaveformScrubber({
  className,
  ...props
}: WaveformScrubberProps): React.JSX.Element {
  const {
    value,
    duration,
    onValueChange,
    seekTo,
    setIsDragging,
    triggerRedraw,
  } = useWaveform();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    seekTo(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      seekTo(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let delta = 0;
    const stepSize = duration * 0.01; // 1% steps
    const largeStepSize = duration * 0.1; // 10% steps

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        delta = stepSize;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        delta = -stepSize;
        break;
      case "PageUp":
        delta = largeStepSize;
        break;
      case "PageDown":
        delta = -largeStepSize;
        break;
      case "Home":
        onValueChange?.(0);
        triggerRedraw();
        return;
      case "End":
        onValueChange?.(duration);
        triggerRedraw();
        return;
      default:
        return;
    }

    e.preventDefault();
    const newValue = Math.min(duration, Math.max(0, value + delta));
    onValueChange?.(newValue);
    triggerRedraw();
  };

  return (
    <div
      role="slider"
      aria-label="Audio waveform scrubber"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={value}
      tabIndex={0}
      data-slot="waveform-scrubber"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        "absolute inset-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md select-none",
        "pointer-coarse:after:absolute pointer-coarse:after:inset-y-[-12px] pointer-coarse:after:inset-x-0 pointer-coarse:after:min-h-[44px]",
        className,
      )}
      {...props}
    />
  );
}

// --- Component: WaveformHandle (Seek track indicator) ---

export interface WaveformHandleProps extends useRender.ComponentProps<"div"> {}

export function WaveformHandle({
  className,
  render,
  ...props
}: WaveformHandleProps): React.ReactElement {
  const { value, duration } = useWaveform();

  const progressFraction =
    duration > 0 ? Math.min(1, Math.max(0, value / duration)) : 0;
  const progressPercent = `${progressFraction * 100}%`;

  const defaultProps = {
    "data-slot": "waveform-handle",
    className: cn(
      "absolute top-1/2 -translate-y-1/2 size-4.5 sm:size-4 rounded-full bg-primary border-2 border-background shadow-md/20 pointer-events-none transition-transform duration-100 ease-out",
      className,
    ),
    style: {
      left: progressPercent,
      transform: "translate(-50%, -50%)",
    },
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
