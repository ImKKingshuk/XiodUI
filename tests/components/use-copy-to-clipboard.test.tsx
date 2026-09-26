import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useCopyToClipboard } from "../../src/hooks/use-copy-to-clipboard";

const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function setClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value,
  });
}

afterEach(() => {
  if (original) Object.defineProperty(navigator, "clipboard", original);
  else Reflect.deleteProperty(navigator, "clipboard");
  vi.restoreAllMocks();
});

describe("useCopyToClipboard", () => {
  it("copies and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    const onCopy = vi.fn();
    const { result } = renderHook(() => useCopyToClipboard({ onCopy }));

    let copied = false;
    await act(async () => {
      copied = await result.current.copyToClipboard("hello");
    });
    expect(copied).toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(onCopy).toHaveBeenCalledOnce();
    expect(result.current.isCopied).toBe(true);
  });

  it("reports a refused copy without claiming success", async () => {
    const error = new Error("denied");
    setClipboard({ writeText: vi.fn().mockRejectedValue(error) });
    const onError = vi.fn();
    const { result } = renderHook(() => useCopyToClipboard({ onError }));

    let copied = true;
    await act(async () => {
      copied = await result.current.copyToClipboard("hello");
    });
    expect(copied).toBe(false);
    expect(onError).toHaveBeenCalledWith(error);
    expect(result.current.isCopied).toBe(false);
  });

  it("falls back to a selection copy without the Clipboard API", async () => {
    // Insecure origins have no navigator.clipboard at all.
    setClipboard(undefined);
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });
    const { result } = renderHook(() => useCopyToClipboard());

    let copied = false;
    await act(async () => {
      copied = await result.current.copyToClipboard("hello");
    });
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(copied).toBe(true);
    expect(document.querySelector("textarea")).toBeNull();
    Reflect.deleteProperty(document, "execCommand");
  });
});
