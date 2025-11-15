import { createSlice, createEntityAdapter, isAnyOf } from "@reduxjs/toolkit";
import uniq from "lodash/uniq";
import isUndefined from "lodash/isUndefined";
import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import apiSlice from "./apiSlice";
import { selectPoolIdsBySession } from "./sessionsSlice";
import { SUBSET, selectValidatorBySessionAndAddress } from "./validatorsSlice";
import { selectValProfileByAddress } from "./valProfilesSlice";

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ["Pools"],
  endpoints: (builder) => ({
    getPools: builder.query({
      query: ({
        session,
        pool,
        number_last_sessions,
        from,
        to,
        show_metadata,
        show_nominees,
        show_stats,
        show_nomstats,
      }) => ({
        url: `/pools`,
        params: {
          session,
          pool,
          number_last_sessions,
          from,
          to,
          show_metadata,
          show_nominees,
          show_stats,
          show_nomstats,
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Pools", id: arg }],
    }),
  }),
});

export const {
  useGetPoolsQuery,
  // useGetSessionByIndexQuery,
} = extendedApi;

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => `${data.session}_${data.id}`,
});

export const matchPoolsReceived = isAnyOf(
  extendedApi.endpoints.getPools.matchFulfilled,
);

const poolsSlice = createSlice({
  name: "pools",
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(matchPoolsReceived, (state, action) => {
      const pools = action.payload.data.map((pool) => ({
        ...pool,
        _ts: +new Date(),
      }));
      adapter.upsertMany(state, pools);
    });
  },
});

// Selectors
export const { selectAll: selectPoolsAll, selectById } = adapter.getSelectors(
  (state) => state.pools,
);

export const selectPoolBySessionAndPoolId = (state, session, poolId) =>
  selectById(state, `${session}_${poolId}`);

export const selectNomineesBySessionAndPoolId = (state, session, poolId) => {
  const pool = selectPoolBySessionAndPoolId(state, session, poolId);
  if (!isUndefined(pool.nominees)) {
    return pool.nominees.nominees.map((id) => {
      return {
        address: id,
        profile: selectValProfileByAddress(state, id),
      };
    });
  }
  return [];
};

export const selectActiveNomineesBySessionAndPoolId = (
  state,
  session,
  poolId,
) => {
  const pool = selectPoolBySessionAndPoolId(state, session, poolId);
  if (!isUndefined(pool.nominees)) {
    return pool.nominees.active.map((active) => {
      const validator = selectValidatorBySessionAndAddress(
        state,
        session,
        active.account,
      );
      return {
        ...validator,
        profile: selectValProfileByAddress(state, active.account),
      };
    });
  }
  return [];
};

export const selectTotalMembersBySession = (state, session) =>
  selectPoolIdsBySession(state, session)
    .map((id) => {
      const pool = selectPoolBySessionAndPoolId(state, session, id);
      return !isUndefined(pool.stats) ? pool.stats.member_counter : 0;
    })
    .reduce((a, b) => a + b, 0);

export const selectTotalPointsBySession = (state, session) =>
  selectPoolIdsBySession(state, session)
    .map((id) => {
      const pool = selectPoolBySessionAndPoolId(state, session, id);
      return !isUndefined(pool.stats) ? pool.stats.points : 0;
    })
    .reduce((a, b) => a + b, 0);

export const selectTotalPendingRewardsBySession = (state, session) =>
  selectPoolIdsBySession(state, session)
    .map((id) => {
      const pool = selectPoolBySessionAndPoolId(state, session, id);
      return !isUndefined(pool.stats) ? pool.stats.reward : 0;
    })
    .reduce((a, b) => a + b, 0);

export const selectTotalStakedBySession = (state, session) =>
  selectPoolIdsBySession(state, session)
    .map((id) => {
      const pool = selectPoolBySessionAndPoolId(state, session, id);
      return !isUndefined(pool.stats) ? pool.stats.staked : 0;
    })
    .reduce((a, b) => a + b, 0);

export const selectTotalUnbondingBySession = (state, session) =>
  selectPoolIdsBySession(state, session)
    .map((id) => {
      const pool = selectPoolBySessionAndPoolId(state, session, id);
      return !isUndefined(pool.stats) ? pool.stats.unbonding : 0;
    })
    .reduce((a, b) => a + b, 0);

export const selectTotalNomineesBySession = (state, session) =>
  selectPoolIdsBySession(state, session)
    .map((id) => {
      const pool = selectPoolBySessionAndPoolId(state, session, id);
      return !isUndefined(pool.nomstats) ? pool.nomstats.nominees : 0;
    })
    .reduce((a, b) => a + b, 0);

export const selectUniqueNomineesBySession = (state, session) =>
  uniq(
    flatten(
      selectPoolIdsBySession(state, session).map((id) => {
        const pool = selectPoolBySessionAndPoolId(state, session, id);
        return !isUndefined(pool.nominees) ? pool.nominees.nominees : [];
      }),
    ),
  );

export const selectTotalActiveBySession = (state, session) =>
  selectPoolIdsBySession(state, session)
    .map((id) => {
      const pool = selectPoolBySessionAndPoolId(state, session, id);
      return !isUndefined(pool.nomstats)
        ? pool.nomstats.active > 0
          ? 1
          : 0
        : 0;
    })
    .reduce((a, b) => a + b, 0);

export const selectTotalUniqueNomineesBySession = (state, session) =>
  selectUniqueNomineesBySession(state, session).length;

export const selectTotalNonValNomineesBySession = (state, session) =>
  selectUniqueNomineesBySession(state, session)
    .map((a) => selectValProfileByAddress(state, a))
    .filter((p) => isUndefined(p)).length;

export const selectNomineesBySessionGroupedBySubset = (state, session) => {
  const nominees = selectUniqueNomineesBySession(state, session).map((a) =>
    selectValProfileByAddress(state, a),
  );
  const groupedBySubset = groupBy(nominees, (v) =>
    !isUndefined(v) ? v.subset : "NONVAL",
  );
  return orderBy(
    Object.keys(groupedBySubset).map((subset) => ({
      subset: SUBSET[subset],
      value: groupedBySubset[subset].length,
    })),
    "subset",
  );
};

export const selectNomineesBySessionAggregatedBySubset = (state, session) => {
  const nominees = selectUniqueNomineesBySession(state, session).map((a) =>
    selectValProfileByAddress(state, a),
  );
  const groupedBySubset = groupBy(nominees, (v) =>
    !isUndefined(v) ? v.subset : "NONVAL",
  );
  orderBy(
    Object.keys(groupedBySubset).map((subset) => ({
      subset: SUBSET[subset],
      value: groupedBySubset[subset].length,
    })),
    "subset",
  );
  return groupedBySubset;
};

export default poolsSlice;
