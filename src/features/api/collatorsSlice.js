import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import maxBy from "lodash/maxBy";
import apiSlice from "./apiSlice";

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ["Collators"],
  endpoints: (builder) => ({
    getCollators: builder.query({
      query: ({
        chain,
        chain_key,
        session,
        stats,
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
          kind_counter,
          block_numbers,
          missed_slots,
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Collators", id: arg }],
    }),
  }),
});

export const { useGetCollatorsQuery } = extendedApi;

// Slice
// NOTE: `session` is the session of the system chain (`chain_key`), not the
// relay chain session
const adapter = createEntityAdapter({
  selectId: (data) => `${data.chain_key}_${data.session}_${data.address}`,
});

const collatorsSlice = createSlice({
  name: "collators",
  initialState: adapter.getInitialState({
    // summary (stats, kind counter and open slot) by `${chain_key}_${session}`
    summaries: {},
  }),
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      extendedApi.endpoints.getCollators.matchFulfilled,
      (state, action) => {
        const { data, ...summary } = action.payload;
        const { chain_key, session } = summary;
        // summaries are replaced as a whole so a stale open slot is not kept
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
      },
    );
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
