import { useEffect, useState } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import { WALKTHROUGH } from "@/lib/walkthrough";

interface ExamTimerState {
  remainingMs: number;
  elapsedMs: number;
  ready: boolean;
  progress: number;
}

export function useExamTimer(examId: string, durationMs: number, enabled: boolean, ignoreWalkthrough = false): ExamTimerState {
  const { state, ensureExamStarted } = useGameProgress();
  const startedAt = state.examStartedAt[examId];
  const bypass = state.timerBypass || (WALKTHROUGH && !ignoreWalkthrough);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled || startedAt != null) return;
    ensureExamStarted(examId);
  }, [enabled, examId, startedAt, ensureExamStarted]);

  useEffect(() => {
    if (!enabled || bypass || startedAt == null) return;
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, [enabled, bypass, startedAt]);

  if (!enabled) {
    return { remainingMs: durationMs, elapsedMs: 0, ready: false, progress: 0 };
  }
  if (bypass) {
    return { remainingMs: 0, elapsedMs: durationMs, ready: true, progress: 1 };
  }
  if (startedAt == null) {
    return { remainingMs: durationMs, elapsedMs: 0, ready: false, progress: 0 };
  }

  const elapsedMs = Math.max(0, now - startedAt);
  const remainingMs = Math.max(0, durationMs - elapsedMs);
  return {
    remainingMs,
    elapsedMs,
    ready: remainingMs === 0,
    progress: Math.min(1, elapsedMs / durationMs),
  };
}
