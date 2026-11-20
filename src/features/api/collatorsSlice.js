import {
  createAction,
  createSlice,
  createEntityAdapter,
  createSelector,
  isAnyOf,
} from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import maxBy from "lodash/maxBy";
import apiSlice from "./apiSlice";
import { socketActions } from "./socketSlice";
import { selectSessionCurrent } from "./sessionsSlice";

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ["Collators"],
  endpoints: (builder) => ({
    getCollators: builder.query({
      query: ({
        chain,
        chain_key,
        session,
        stats,
        slot,
        kind_counter,
        block_numbers,
        missed_slots,
      }) => ({
        url: `/collators`,
        params: {
          chain,
          chain_key,
          session,
          stats,
          slot,
          kind_counter,
          block_numbers,
          missed_slots,
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Collators", id: arg }],
      async onQueryStarted(params, { dispatch, getState, queryFulfilled }) {
        // subscribe the current session of the system chain (the server
        // ignores duplicated subscriptions)
        const chainKey = params.chain_key ?? params.chain;
        if (
          !isUndefined(chainKey) &&
          (isUndefined(params.session) || params.session === "current")
        ) {
          // with `slot` both subscriptions are queued
          (params.slot
            ? [[chainKey], [chainKey, "slot"]]
            : [[chainKey]]
          ).forEach((subscription) =>
            dispatch(
              socketActions.messageQueued(
                JSON.stringify({
                  method: "subscribe_collators",
                  params: subscription,
                }),
              ),
            ),
          );
          // the stats and the open slot of the current session are also
          // loaded from the response (when requested), as if they were
          // pushed, tied to the current relay session. Without `slot` the
          // response has no slot and it would remove the one in the state.
          try {
            const { data } = await queryFulfilled;
            if (!params.slot) {
              return;
            }
            dispatch(
              socketCollatorsReceived({
                ...data,
                relay_six: selectSessionCurrent(getState()),
              }),
            );
          } catch (err) {
            // the request failed, nothing to load
          }
        }
      },
    }),
  }),
});

export const { useGetCollatorsQuery } = extendedApi;

export const socketCollatorsReceived = createAction(
  "collators/collatorsReceived",
);

export const matchCollatorsReceived = isAnyOf(
  socketCollatorsReceived,
  extendedApi.endpoints.getCollators.matchFulfilled,
);

// Slice
// NOTE: `session` is the session of the system chain (`chain_key`), not the
// relay chain session
const adapter = createEntityAdapter({
  selectId: (data) => `${data.chain_key}_${data.session}_${data.address}`,
});

const collatorsSlice = createSlice({
  name: "collators",
  initialState: adapter.getInitialState({
    // summary (stats) by `${chain_key}_${session}`
    summaries: {},
  }),
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(matchCollatorsReceived, (state, action) => {
      // `payload` is the response itself or the one pushed by the websocket
      // eslint-disable-next-line no-unused-vars
      // the open slot is kept apart in the collation slots slice
      // the kind counter is kept apart in the collation kind slice
      const { data, relay_six, slot, kind_counter, ...summary } =
        action.payload;
      const { chain_key, session } = summary;
      // summaries are replaced as a whole
      state.summaries[`${chain_key}_${session}`] = {
        ...summary,
        _ts: +new Date(),
      };
      adapter.upsertMany(
        state,
        (data || []).map((collator) => ({
          ...collator,
          chain_key,
          para_id: summary.para_id,
          session,
          _ts: +new Date(),
        })),
      );
    });
  },
});

export default collatorsSlice;

// Selectors
export const { selectAll: selectCollatorsAll, selectById: selectCollatorById } =
  adapter.getSelectors((state) => state.collators);

export const selectCollatorByChainSessionAndAddress = (
  state,
  chainKey,
  session,
  address,
) => selectCollatorById(state, `${chainKey}_${session}_${address}`);

export const selectCollatorsByChainAndSession = createSelector(
  [selectCollatorsAll, (_, chainKey) => chainKey, (_, __, session) => session],
  (all, chainKey, session) =>
    all.filter((c) => c.chain_key === chainKey && c.session === session),
);

export const selectCollatorsSummaryByChainAndSession = (
  state,
  chainKey,
  session,
) => state.collators.summaries[`${chainKey}_${session}`];

// Summary of the latest session loaded for a system chain
export const selectCollatorsSummaryLatest = (state, chainKey) =>
  maxBy(
    Object.values(state.collators.summaries).filter(
      (s) => s.chain_key === chainKey,
    ),
    (s) => s.session,
  );

export const selectCollatorsNumberByChain = (state, chainKey) => {
  const summary = selectCollatorsSummaryLatest(state, chainKey);
  return isUndefined(summary) ? undefined : summary.stats?.nc;
};
