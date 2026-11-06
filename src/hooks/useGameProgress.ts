import { useSyncExternalStore } from "react";
import { exams } from "@/data/exams";
import { wordBank } from "@/data/wordBank";
import {
  createInitialState,
  getGameState,
  replaceGameState,
  subscribeGameState,
  updateGameState,
} from "@/lib/storage";
import type { WordSets } from "@/types/game";

function drawWordSets(): WordSets {
  const pool = [...wordBank];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = pool[index]!;
    pool[index] = pool[swap]!;
    pool[swap] = current;
  }
  return {
    students: [pool.slice(0, 5), pool.slice(5, 10), pool.slice(10, 15)],
  };
}

function startFirstExam() {
  updateGameState((current) => ({
    ...current,
    screen: "exam",
    currentExamIndex: 0,
  }));
}

function ensureExamStarted(examId: string, at = Date.now()) {
  updateGameState((current) => {
    if (current.examStartedAt[examId]) return current;
    return {
      ...current,
      examStartedAt: { ...current.examStartedAt, [examId]: at },
    };
  });
}

function completeExam(examId: string) {
  updateGameState((current) => {
    if (current.completedExamIds.includes(examId)) return current;
    return {
      ...current,
      completedExamIds: [...current.completedExamIds, examId],
    };
  });
}

function advanceAfterExam(examIndex: number) {
  updateGameState((current) => {
    if (examIndex < 6) {
      return { ...current, screen: "exam", currentExamIndex: examIndex + 1 };
    }
    if (examIndex === 6) {
      return { ...current, screen: "special" };
    }
    return { ...current, screen: "graduation", graduated: true };
  });
}

function completeSpecial() {
  updateGameState((current) => {
    if (current.specialCompleted) return current;
    return { ...current, specialCompleted: true };
  });
}

function continueToElementsExam() {
  updateGameState((current) => {
    if (!current.specialCompleted) return current;
    return { ...current, screen: "exam", currentExamIndex: 7 };
  });
}

function saveWordSets(overwrite = false) {
  updateGameState((current) => {
    if (current.wordSets && !overwrite) return current;
    return { ...current, wordSets: drawWordSets() };
  });
}

function jumpToExam(index: number) {
  if (index < 0 || index >= exams.length) return;
  updateGameState((current) => ({
    ...current,
    screen: "exam",
    currentExamIndex: index,
  }));
}

function jumpToScreen(screen: "welcome" | "special" | "graduation") {
  updateGameState((current) => ({
    ...current,
    screen,
    graduated: screen === "graduation" ? true : current.graduated,
  }));
}

function markExamCompleted(examId: string) {
  completeExam(examId);
}

function resetCurrentExam() {
  updateGameState((current) => {
    if (current.screen !== "exam") return current;
    const exam = exams[current.currentExamIndex];
    if (!exam) return current;
    const examStartedAt = { ...current.examStartedAt };
    delete examStartedAt[exam.id];
    return {
      ...current,
      completedExamIds: current.completedExamIds.filter((id) => id !== exam.id),
      examStartedAt,
      wordSets: exam.id === "literature" ? null : current.wordSets,
    };
  });
}

function resetAllProgress() {
  replaceGameState(createInitialState());
}

function setTimerBypass(timerBypass: boolean) {
  updateGameState((current) => {
    if (current.timerBypass === timerBypass) return current;
    return { ...current, timerBypass };
  });
}

const actions = {
  startFirstExam,
  ensureExamStarted,
  completeExam,
  advanceAfterExam,
  completeSpecial,
  continueToElementsExam,
  saveWordSets,
  jumpToExam,
  jumpToScreen,
  markExamCompleted,
  resetCurrentExam,
  resetAllProgress,
  setTimerBypass,
};

export function useGameProgress() {
  const state = useSyncExternalStore(subscribeGameState, getGameState, getGameState);
  return { state, ...actions };
}
