"use client";

import * as React from "react";

// `navigator.clipboard` only exists in secure contexts (https, localhost).
// Elsewhere, copy through a selected off-screen textarea.
function copyWithSelection(value: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  const active = document.activeElement;
  document.body.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  if (active instanceof HTMLElement) active.focus();
  return copied;
}

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
  onError,
}: {
  timeout?: number;
  onCopy?: () => void;
  /** Called when the browser refuses the copy. */
  onError?: (error: unknown) => void;
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false);
  // `ReturnType<typeof setTimeout>` rather than `NodeJS.Timeout` so the emitted
  // declarations don't pull @types/node into consumers' type graph.
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Resolves to whether the value reached the clipboard. */
  const copyToClipboard = async (value: string): Promise<boolean> => {
    if (typeof window === "undefined" || !value) return false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (!copyWithSelection(value)) {
        throw new Error("Copying to the clipboard is not supported here.");
      }
    } catch (error) {
      if (onError) onError(error);
      else console.error(error);
      return false;
    }

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    setIsCopied(true);

    onCopy?.();

    if (timeout !== 0) {
      timeoutIdRef.current = setTimeout(() => {
        setIsCopied(false);
        timeoutIdRef.current = null;
      }, timeout);
    }
    return true;
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return { copyToClipboard, isCopied };
}
