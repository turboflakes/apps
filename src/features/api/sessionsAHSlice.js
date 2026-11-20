import { createSlice, createEntityAdapter, isAnyOf } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import { extendedApi } from "./sessionsSlice";
import { selectFinalizedBlockAH } from "./blocksAHSlice";

// Sessions of the `ah` system chain (requested with `chain_key: "ah"`). They
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
  action.meta?.arg?.originalArgs?.chain_key === "ah";

const sessionsAHSlice = createSlice({
  name: "sessions_ah",
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
          chain_key: "ah",
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
            chain_key: "ah",
            _ts: +new Date(),
          })),
        );
      });
  },
});

export default sessionsAHSlice;

// Selectors
export const {
  selectAll: selectAllSessionsAH,
  selectById: selectSessionByIndexAH,
} = adapter.getSelectors((state) => state.sessions_ah);

export const selectSessionCurrentIndexAH = (state) => state.sessions_ah.current;

// Current session of the chain (undefined while it is not loaded)
export const selectSessionCurrentAH = (state) =>
  selectSessionByIndexAH(state, state.sessions_ah.current);

// Points of the sessions of the chain (undefined when its stats are not loaded)
export const selectTotalPointsBySessionsAH = (state, sessionIds = []) =>
  sessionIds.map((id) => selectSessionByIndexAH(state, id)?.stats?.pt);

// Points of the era of a session: the previous sessions of the era plus the
// current session points from the last finalized block
export const selectEraPointsBySessionAH = (state, sessionId) => {
  const session = selectSessionByIndexAH(state, sessionId);
  if (!isUndefined(session)) {
    // Calculate previous sessions points
    let sessionIds = [];
    for (let i = 1; i < session.esix; i++) {
      sessionIds.push(session.six - i);
    }
    const previousPoints = selectTotalPointsBySessionsAH(state, sessionIds);
    // NOTE: unknown (and not a partial total or NaN) while any previous
    // session has no stats loaded yet
    if (previousPoints.some((p) => isUndefined(p))) {
      return undefined;
    }
    const previousSessionsPoints = previousPoints.reduce((a, b) => a + b, 0);
    // Get current session points from last finalized block
    const block = selectFinalizedBlockAH(state);
    if (!isUndefined(block?.stats)) {
      return previousSessionsPoints + block.stats.pt;
    }
    return previousSessionsPoints;
  }
  // unknown while the session is not loaded
  return undefined;
};
