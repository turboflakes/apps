import {
  createSlice,
  createEntityAdapter,
  createSelector,
  isAnyOf,
} from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import {
  extendedApi,
  selectSessionByIndex,
  socketSessionReceived,
  socketSessionsReceived,
} from "./sessionsSlice";
import { selectCollationSlotsPointsBySession } from "./collationSlotsSlice";

// Collation stats are tied to the session of the chain that reports them
// (`chain_key` + `six`) and are stored per system chain (`pid`), e.g.
// `rc_57800_1000`. Stats tied to an asset hub or people session in the future
// only need a different `chain_key`.
const RELAY_CHAIN_KEY = "rc";

const adapter = createEntityAdapter({
  selectId: (data) => `${data.chain_key}_${data.six}_${data.pid}`,
});

const matchCollationStatsReceived = isAnyOf(
  socketSessionReceived,
  socketSessionsReceived,
  extendedApi.endpoints.getSessionByIndex.matchFulfilled,
  extendedApi.endpoints.getSessions.matchFulfilled,
);

const collationStatsSlice = createSlice({
  name: "collation_stats",
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(matchCollationStatsReceived, (state, action) => {
      // payload is a single session or a list of sessions
      const sessions = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      const entries = [];
      sessions.forEach((session) => {
        if (isUndefined(session?.collation_stats)) {
          return;
        }
        Object.entries(session.collation_stats).forEach(([pid, data]) => {
          // the open slot is kept apart in the collation slots slice
          const { slot, ...stats } = data;
          entries.push({
            ...stats,
            chain_key: RELAY_CHAIN_KEY,
            six: session.six,
            pid: Number(pid),
            _ts: +new Date(),
          });
        });
      });
      adapter.upsertMany(state, entries);
    });
  },
});

export default collationStatsSlice;

// Selectors
const { selectAll, selectById } = adapter.getSelectors(
  (state) => state.collation_stats,
);

// Stats of a system chain for a session
export const selectCollationStatsBySessionAndPid = (
  state,
  six,
  pid,
  chainKey = RELAY_CHAIN_KEY,
) => selectById(state, `${chainKey}_${six}_${pid}`);

// Stats of all the system chains for a session (undefined when none is available)
export const selectCollationStatsBySession = createSelector(
  [selectAll, (_, six) => six, (_, __, chainKey) => chainKey],
  (all, six, chainKey = RELAY_CHAIN_KEY) => {
    const stats = all.filter((s) => s.six === six && s.chain_key === chainKey);
    return stats.length ? stats : undefined;
  },
);

// Collation points of all the system chains for a session. Returns undefined
// (unknown) and not 0 when the session has no collation stats.
export const selectCollationPointsBySession = (state, six, chainKey) => {
  const stats = selectCollationStatsBySession(state, six, chainKey);
  return isUndefined(stats)
    ? undefined
    : stats.reduce((acc, s) => acc + (s.pt ?? 0), 0);
};

// Collation points of all the sessions of the era of a session (the open slots
// are added for the session itself). Returns undefined (unknown) while any of
// the sessions has no collation stats loaded yet.
export const selectEraCollationPointsBySession = (state, sessionId) => {
  const session = selectSessionByIndex(state, sessionId);
  if (isUndefined(session)) {
    return undefined;
  }
  let total = selectCollationSlotsPointsBySession(state, session.six);
  for (let i = 0; i < session.esix; i++) {
    const points = selectCollationPointsBySession(state, session.six - i);
    if (isUndefined(points)) {
      return undefined;
    }
    total += points;
  }
  return total;
};
