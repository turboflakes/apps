import { createSlice, createEntityAdapter, isAnyOf } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import { extendedApi } from "./sessionsSlice";
import { selectFinalizedBlockBU } from "./blocksBUSlice";

// Sessions of the `bu` system chain (requested with `chain_key: "bu"`). They
// are kept apart from the relay chain sessions as their indexes are different.
const adapter = createEntityAdapter({
  selectId: (data) => data.six,
});

const matchSessionReceived = isAnyOf(
  extendedApi.endpoints.getSessionByIndex.matchFulfilled,
);

const matchSessionsReceived = isAnyOf(
  extendedApi.endpoints.getSessions.matchFulfilled,
);

const isRequestedForChain = (action) =>
  action.meta?.arg?.originalArgs?.chain_key === "bu";

const sessionsBUSlice = createSlice({
  name: "sessions_bu",
  initialState: {
    current: "current",
    ...adapter.getInitialState(),
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(matchSessionReceived, (state, action) => {
        if (!isRequestedForChain(action)) {
          return;
        }
        // update session current from sessionReceived
        if (action.payload.is_current) {
          state.current = action.payload.six;
        }
        adapter.upsertOne(state, {
          ...action.payload,
          chain_key: "bu",
          _ts: +new Date(),
        });
      })
      .addMatcher(matchSessionsReceived, (state, action) => {
        if (!isRequestedForChain(action)) {
          return;
        }
        adapter.upsertMany(
          state,
          action.payload.map((session) => ({
            ...session,
            chain_key: "bu",
            _ts: +new Date(),
          })),
        );
      });
  },
});

export default sessionsBUSlice;

// Selectors
export const {
  selectAll: selectAllSessionsBU,
  selectById: selectSessionByIndexBU,
} = adapter.getSelectors((state) => state.sessions_bu);

export const selectSessionCurrentIndexBU = (state) => state.sessions_bu.current;

// Current session of the chain (undefined while it is not loaded)
export const selectSessionCurrentBU = (state) =>
  selectSessionByIndexBU(state, state.sessions_bu.current);

// Points of the sessions of the chain (undefined when its stats are not loaded)
export const selectTotalPointsBySessionsBU = (state, sessionIds = []) =>
  sessionIds.map((id) => selectSessionByIndexBU(state, id)?.stats?.pt);

// Points of the previous sessions of the era of a session (the
// session itself is not included). Unknown (undefined) while the session or
// any previous session stats are not loaded.
export const selectEraPreviousPointsBySessionBU = (state, sessionId) => {
  const session = selectSessionByIndexBU(state, sessionId);
  if (isUndefined(session) || !Number.isInteger(session.esix)) {
    return undefined;
  }
  const sessionIds = [];
  for (let i = 1; i < session.esix; i++) {
    sessionIds.push(session.six - i);
  }
  const points = selectTotalPointsBySessionsBU(state, sessionIds);
  // unknown while any previous session has no stats loaded yet
  if (points.some((p) => isUndefined(p))) {
    return undefined;
  }
  return points.reduce((a, b) => a + b, 0);
};

// Points of the era of a session: the previous sessions of the era plus the
// current session points from the last finalized block
export const selectEraPointsBySessionBU = (state, sessionId) => {
  // NOTE: unknown (and not a partial total or NaN) while the session or any
  // previous session has no stats loaded yet
  const previousPoints = selectEraPreviousPointsBySessionBU(state, sessionId);
  if (isUndefined(previousPoints)) {
    return undefined;
  }
  // Get current session points from last finalized block
  const block = selectFinalizedBlockBU(state);
  return !isUndefined(block?.stats)
    ? previousPoints + block.stats.pt
    : previousPoints;
};

// Authored blocks of the sessions of the chain (undefined when its stats are not loaded)
export const selectTotalBlocksBySessionsBU = (state, sessionIds = []) =>
  sessionIds.map((id) => selectSessionByIndexBU(state, id)?.stats?.pb);

// Authored blocks of the previous sessions of the era of a session (the
// session itself is not included). Unknown (undefined) while the session or
// any previous session stats are not loaded.
export const selectEraPreviousBlocksBySessionBU = (state, sessionId) => {
  const session = selectSessionByIndexBU(state, sessionId);
  if (isUndefined(session) || !Number.isInteger(session.esix)) {
    return undefined;
  }
  const sessionIds = [];
  for (let i = 1; i < session.esix; i++) {
    sessionIds.push(session.six - i);
  }
  const blocks = selectTotalBlocksBySessionsBU(state, sessionIds);
  // unknown while any previous session has no stats loaded yet
  if (blocks.some((b) => isUndefined(b))) {
    return undefined;
  }
  return blocks.reduce((a, b) => a + b, 0);
};
