"use client";

const STORAGE_KEY = "npa_analytics";

type AnalyticsState = {
  consumer: {
    questionsAsked: number;
    expertsUsed: Record<string, number>;
  };
  provider: {
    widgetViews: number;
    embedCopied: number;
    widgetOpens: number;
  };
};

const defaultState: AnalyticsState = {
  consumer: {
    questionsAsked: 0,
    expertsUsed: {},
  },
  provider: {
    widgetViews: 0,
    embedCopied: 0,
    widgetOpens: 0,
  },
};

function loadState(): AnalyticsState {
  if (typeof window === "undefined") return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    return JSON.parse(raw) as AnalyticsState;
  } catch {
    return defaultState;
  }
}

function saveState(state: AnalyticsState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function trackConsumerQuestion(mascotId: string) {
  const state = loadState();
  state.consumer.questionsAsked += 1;
  state.consumer.expertsUsed[mascotId] =
    (state.consumer.expertsUsed[mascotId] ?? 0) + 1;
  saveState(state);
}

export function trackProviderWidgetView() {
  const state = loadState();
  state.provider.widgetViews += 1;
  saveState(state);
}

export function trackProviderEmbedCopied() {
  const state = loadState();
  state.provider.embedCopied += 1;
  saveState(state);
}

export function trackProviderWidgetOpen() {
  const state = loadState();
  state.provider.widgetOpens += 1;
  saveState(state);
}
