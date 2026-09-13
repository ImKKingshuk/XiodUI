"use client";

import * as React from "react";

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: {
  timeout?: number;
  onCopy?: () => void;
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false);
  // `ReturnType<typeof setTimeout>` rather than `NodeJS.Timeout` so the emitted
  // declarations don't pull @types/node into consumers' type graph.
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = (value: string): void => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    if (!value) return;

    void (async () => {
      try {
        await navigator.clipboard.writeText(value);
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
      } catch (error) {
        console.error(error);
      }
    })();
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
