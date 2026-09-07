import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useInfiniteScroll from "./useInfiniteScroll";

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

/**
 * jsdom has no IntersectionObserver, so it is stubbed here. The stub also
 * captures the callback, which is what lets the tests drive an intersection.
 */
let latestCallback: ObserverCallback | undefined;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback: ObserverCallback) {
    latestCallback = callback;
  }
  observe = observe;
  unobserve = unobserve;
  disconnect = disconnect;
}

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    latestCallback = undefined;
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a ref for the sentinel element", () => {
    const { result } = renderHook(() => useInfiniteScroll(vi.fn()));

    expect(result.current).toHaveProperty("observerRef");
    expect(result.current.observerRef.current).toBeNull();
  });

  it("creates an observer on mount", () => {
    renderHook(() => useInfiniteScroll(vi.fn()));

    expect(latestCallback).toBeTypeOf("function");
  });

  it("does not call back before anything intersects", () => {
    const callback = vi.fn();
    renderHook(() => useInfiniteScroll(callback));

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls back when the sentinel intersects", () => {
    const callback = vi.fn();
    renderHook(() => useInfiniteScroll(callback));

    latestCallback?.([{ isIntersecting: true }]);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call back when the sentinel leaves the viewport", () => {
    const callback = vi.fn();
    renderHook(() => useInfiniteScroll(callback));

    latestCallback?.([{ isIntersecting: false }]);

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls back once per intersection", () => {
    const callback = vi.fn();
    renderHook(() => useInfiniteScroll(callback));

    latestCallback?.([{ isIntersecting: true }]);
    latestCallback?.([{ isIntersecting: true }]);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("only inspects the first entry", () => {
    const callback = vi.fn();
    renderHook(() => useInfiniteScroll(callback));

    latestCallback?.([{ isIntersecting: false }, { isIntersecting: true }]);

    expect(callback).not.toHaveBeenCalled();
  });

  it("observes nothing while the ref is unattached", () => {
    // The hook guards on observerRef.current, so an unmounted sentinel must not
    // reach observe().
    renderHook(() => useInfiniteScroll(vi.fn()));

    expect(observe).not.toHaveBeenCalled();
  });

  it("uses the latest callback after a re-render", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useInfiniteScroll(cb), {
      initialProps: { cb: first },
    });

    rerender({ cb: second });
    latestCallback?.([{ isIntersecting: true }]);

    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });
});
