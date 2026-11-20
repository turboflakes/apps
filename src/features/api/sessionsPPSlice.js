import { createSlice, createEntityAdapter, isAnyOf } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import { extendedApi } from "./sessionsSlice";
import { selectFinalizedBlockPP } from "./blocksPPSlice";

// Sessions of the `pp` system chain (requested with `chain_key: "pp"`). They
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
  action.meta?.arg?.originalArgs?.chain_key === "pp";

const sessionsPPSlice = createSlice({
  name: "sessions_pp",
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
          chain_key: "pp",
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
            chain_key: "pp",
            _ts: +new Date(),
          })),
        );
      });
  },
});

export default sessionsPPSlice;

// Selectors
export const {
  selectAll: selectAllSessionsPP,
  selectById: selectSessionByIndexPP,
} = adapter.getSelectors((state) => state.sessions_pp);

export const selectSessionCurrentIndexPP = (state) => state.sessions_pp.current;

// Current session of the chain (undefined while it is not loaded)
export const selectSessionCurrentPP = (state) =>
  selectSessionByIndexPP(state, state.sessions_pp.current);

// Points of the sessions of the chain (undefined when its stats are not loaded)
export const selectTotalPointsBySessionsPP = (state, sessionIds = []) =>
  sessionIds.map((id) => selectSessionByIndexPP(state, id)?.stats?.pt);

// Points of the era of a session: the previous sessions of the era plus the
// current session points from the last finalized block
export const selectEraPointsBySessionPP = (state, sessionId) => {
  const session = selectSessionByIndexPP(state, sessionId);
  if (!isUndefined(session)) {
    // Calculate previous sessions points
    let sessionIds = [];
    for (let i = 1; i < session.esix; i++) {
      sessionIds.push(session.six - i);
    }
    const previousPoints = selectTotalPointsBySessionsPP(state, sessionIds);
    // NOTE: unknown (and not a partial total or NaN) while any previous
    // session has no stats loaded yet
    if (previousPoints.some((p) => isUndefined(p))) {
      return undefined;
    }
    const previousSessionsPoints = previousPoints.reduce((a, b) => a + b, 0);
    // Get current session points from last finalized block
    const block = selectFinalizedBlockPP(state);
    if (!isUndefined(block?.stats)) {
      return previousSessionsPoints + block.stats.pt;
    }
    return previousSessionsPoints;
  }
  // unknown while the session is not loaded
  return undefined;
};
