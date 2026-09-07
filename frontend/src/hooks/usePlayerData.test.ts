import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePlayerData } from "./usePlayerData";
import { toast } from "sonner";
import type { Player } from "@/lib/services/playerService";

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

const player = (id: number, name: string) =>
  ({ id, name, team: "LAL", season: "2022-23", country: "USA" }) as Player;

describe("usePlayerData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with no players, not loading, and no selection", () => {
    const { result } = renderHook(() => usePlayerData());

    expect(result.current.players).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedPlayer).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
  });

  it("handleSuccess stores the players", () => {
    const { result } = renderHook(() => usePlayerData());

    act(() => result.current.handleSuccess([player(1, "LeBron James")]));

    expect(result.current.players).toHaveLength(1);
    expect(result.current.players[0].name).toBe("LeBron James");
  });

  it("handleSuccess invokes the onSuccess callback with the data", () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => usePlayerData({ onSuccess }));
    const data = [player(1, "LeBron James")];

    act(() => result.current.handleSuccess(data));

    expect(onSuccess).toHaveBeenCalledWith(data);
  });

  it("handleSuccess works when no onSuccess callback was supplied", () => {
    const { result } = renderHook(() => usePlayerData());

    expect(() =>
      act(() => result.current.handleSuccess([player(1, "X")])),
    ).not.toThrow();
  });

  it("handleSuccess replaces the previous results", () => {
    const { result } = renderHook(() => usePlayerData());

    act(() => result.current.handleSuccess([player(1, "A"), player(2, "B")]));
    act(() => result.current.handleSuccess([player(3, "C")]));

    expect(result.current.players).toHaveLength(1);
    expect(result.current.players[0].name).toBe("C");
  });

  it("handlePlayerClick selects the player and opens the modal", () => {
    const { result } = renderHook(() => usePlayerData());
    const selected = player(1, "LeBron James");

    act(() => result.current.handlePlayerClick(selected));

    expect(result.current.selectedPlayer).toEqual(selected);
    expect(result.current.isModalOpen).toBe(true);
  });

  it("handleModalClose clears the selection and closes the modal", () => {
    const { result } = renderHook(() => usePlayerData());

    act(() => result.current.handlePlayerClick(player(1, "LeBron James")));
    act(() => result.current.handleModalClose());

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.selectedPlayer).toBeNull();
  });

  it("handleError shows a toast with the message", () => {
    const { result } = renderHook(() => usePlayerData());

    act(() => result.current.handleError(new Error("boom"), "Could not load"));

    expect(toast.error).toHaveBeenCalledWith("Could not load");
  });

  it("handleError invokes the onError callback with the original error", () => {
    const onError = vi.fn();
    const { result } = renderHook(() => usePlayerData({ onError }));
    const error = new Error("boom");

    act(() => result.current.handleError(error, "Could not load"));

    expect(onError).toHaveBeenCalledWith(error);
  });

  it("handleError leaves previously loaded players in place", () => {
    // A failed follow-up search should not blank out results already on screen.
    const { result } = renderHook(() => usePlayerData());

    act(() => result.current.handleSuccess([player(1, "LeBron James")]));
    act(() => result.current.handleError(new Error("boom"), "Could not load"));

    expect(result.current.players).toHaveLength(1);
  });

  it("setIsLoading toggles the loading flag", () => {
    const { result } = renderHook(() => usePlayerData());

    act(() => result.current.setIsLoading(true));
    expect(result.current.isLoading).toBe(true);

    act(() => result.current.setIsLoading(false));
    expect(result.current.isLoading).toBe(false);
  });

  it("keeps state separate between independent consumers", () => {
    // Unlike the country store, this is local component state: two pages using
    // the hook must not see each other's results.
    const first = renderHook(() => usePlayerData());
    const second = renderHook(() => usePlayerData());

    act(() => first.result.current.handleSuccess([player(1, "A")]));

    expect(second.result.current.players).toEqual([]);
  });
});
