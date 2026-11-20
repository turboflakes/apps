import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import maxBy from "lodash/maxBy";
import { matchCollatorsReceived } from "./collatorsSlice";

// Number of collators by kind of each system chain session: invulnerables
// (`i`), permissionless (`p`) and validators acting as collators (`v`), also
// known as metanodes.
const adapter = createEntityAdapter({
  selectId: (data) => `${data.chain_key}_${data.session}`,
});

const collationKindSlice = createSlice({
  name: "collation_kind",
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(matchCollatorsReceived, (state, action) => {
      const { chain_key, para_id, session, data } = action.payload;
      // the response has the counter, the websocket does not so it is counted
      const kind_counter =
        action.payload.kind_counter ??
        (!!data?.length
          ? data.reduce(
              (acc, c) => ({ ...acc, [c.kind]: (acc[c.kind] ?? 0) + 1 }),
              { i: 0, p: 0, v: 0 },
            )
          : undefined);
      if (isUndefined(kind_counter)) {
        return;
      }
      adapter.setOne(state, {
        chain_key,
        para_id,
        session,
        ...kind_counter,
        _ts: +new Date(),
      });
    });
  },
});

export default collationKindSlice;

// Selectors
const { selectAll } = adapter.getSelectors((state) => state.collation_kind);

// Collators by kind of the latest session loaded for a system chain
export const selectCollationKindLatest = (state, chainKey) =>
  maxBy(
    selectAll(state).filter((k) => k.chain_key === chainKey),
    (k) => k.session,
  );
