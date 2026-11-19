import { createSlice, createEntityAdapter, isAnyOf } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import {
  extendedApi,
  socketSessionReceived,
  socketSessionsReceived,
} from "./sessionsSlice";

// The open slot of each system chain (`pid`) in the current relay session. Only
// the latest slot is kept per chain: it is replaced on every update and removed
// when the chain has no open slot.
const adapter = createEntityAdapter({
  selectId: (data) => data.pid,
});

const matchCollationSlotsReceived = isAnyOf(
  socketSessionReceived,
  socketSessionsReceived,
  extendedApi.endpoints.getSessionByIndex.matchFulfilled,
  extendedApi.endpoints.getSessions.matchFulfilled,
);

const collationSlotsSlice = createSlice({
  name: "collation_slots",
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(matchCollationSlotsReceived, (state, action) => {
      // payload is a single session or a list of sessions
      const sessions = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      sessions.forEach((session) => {
        // only the current session has an open slot
        if (!session?.is_current || isUndefined(session.collation_stats)) {
          return;
        }
        Object.entries(session.collation_stats).forEach(([pid, data]) => {
          if (isUndefined(data.slot)) {
            adapter.removeOne(state, Number(pid));
            return;
          }
          adapter.setOne(state, {
            ...data.slot,
            pid: Number(pid),
            six: session.six,
            _ts: +new Date(),
          });
        });
      });
    });
  },
});

export default collationSlotsSlice;

// Selectors
const { selectAll, selectById } = adapter.getSelectors(
  (state) => state.collation_slots,
);

// Open slot of a system chain for a session (undefined when there is none)
export const selectCollationSlotBySessionAndPid = (state, six, pid) => {
  const slot = selectById(state, pid);
  return slot?.six === six ? slot : undefined;
};

// Points of the open slots of all the system chains for a session
export const selectCollationSlotsPointsBySession = (state, six) =>
  selectAll(state)
    .filter((slot) => slot.six === six)
    .reduce((acc, slot) => acc + (slot.pt ?? 0), 0);
