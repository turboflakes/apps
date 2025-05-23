import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
} from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import groupBy from "lodash/groupBy";
import mergeWith from "lodash/mergeWith";
import isArray from "lodash/isArray";
import max from "lodash/max";
import min from "lodash/min";
import apiSlice from "./apiSlice";
import { calculateMVR, calculateBAR, calculateBUR } from "../../util/math";
import { isValidAddress, addressSS58 } from "../../util/crypto";
import { socketActions } from "./socketSlice";
import { selectSessionByIndex } from "./sessionsSlice";
import { selectIsLiveMode } from "../layout/layoutSlice";
import { selectValGroupMvrBySessionAndGroupId } from "./valGroupsSlice";
import { selectChainInfo } from "../chain/chainSlice";
import { selectValProfileByAddress } from "./valProfilesSlice";
import { gradeByRatios } from "../../util/grade";
import { chainAddress } from "../../util/crypto";

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ["Validators"],
  endpoints: (builder) => ({
    getValidators: builder.query({
      query: ({
        address,
        session,
        role,
        number_last_sessions,
        from,
        to,
        ranking,
        size,
        subset,
        nominees_only,
        show_summary,
        show_stats,
        show_profile,
        show_discovery,
        fetch_peers,
      }) => ({
        url: `/validators`,
        params: {
          address,
          session,
          role,
          number_last_sessions,
          from,
          to,
          ranking,
          size,
          subset,
          nominees_only,
          show_summary,
          show_stats,
          show_profile,
          show_discovery,
          fetch_peers,
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Validators", id: arg }],
      async onQueryStarted(
        params,
        { getState, extra, dispatch, queryFulfilled },
      ) {
        try {
          await queryFulfilled;

          // `onSuccess` subscribe for updates
          const session = selectSessionByIndex(getState(), params.session);

          if (
            (params.role === "authority" ||
              params.role === "para_authority" ||
              params.nominees_only === true) &&
            session.is_current
          ) {
            if (params.show_summary) {
              let msg = JSON.stringify({
                method: "subscribe_para_authorities_summary",
                params: [params.session.toString()],
              });
              dispatch(socketActions.messageQueued(msg));
              // NOTE: always unsubscribe previous session
              msg = JSON.stringify({
                method: "unsubscribe_para_authorities_summary",
                params: [(params.session - 1).toString()],
              });
              dispatch(socketActions.messageQueued(msg));
            } else if (params.show_stats) {
              let msg = JSON.stringify({
                method: "subscribe_para_authorities_stats",
                params: [params.session.toString()],
              });
              dispatch(socketActions.messageQueued(msg));
              // NOTE: always unsubscribe previous session
              msg = JSON.stringify({
                method: "unsubscribe_para_authorities_stats",
                params: [(params.session - 1).toString()],
              });
              dispatch(socketActions.messageQueued(msg));
            }
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.messageQueued(msg))
        }
      },
    }),
    getValidatorByAddress: builder.query({
      query: ({
        address,
        session,
        show_summary,
        show_stats,
        show_discovery,
      }) => ({
        url: `/validators/${address}`,
        params: { session, show_summary, show_stats, show_discovery },
      }),
      providesTags: (result, error, arg) => [{ type: "Validators", id: arg }],
      async onQueryStarted(
        { address, session, show_summary, show_stats, show_discovery },
        { getState, dispatch, queryFulfilled },
      ) {
        try {
          const { data } = await queryFulfilled;
          // `onSuccess` subscribe for updates
          const isLiveMode = selectIsLiveMode(getState());
          if (isLiveMode) {
            const msg = JSON.stringify({
              method: "subscribe_validator",
              params: [address.toString()],
            });
            dispatch(socketActions.messageQueued(msg));
          }
          if (data.is_para) {
            data.para.peers.forEach((peer) => {
              dispatch(
                extendedApi.endpoints.getValidatorPeerByAuthority.initiate(
                  {
                    address,
                    peer,
                    session,
                    show_summary,
                    show_stats,
                    show_discovery,
                  },
                  { forceRefetch: true },
                ),
              );
            });
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.messageQueued(msg))
        }
      },
    }),
    getValidatorPeerByAuthority: builder.query({
      query: ({
        address,
        peer,
        session,
        show_summary,
        show_stats,
        show_discovery,
      }) => ({
        url: `/validators/${address}/peers/${peer}`,
        params: { session, show_summary, show_stats, show_discovery },
      }),
      providesTags: (result, error, arg) => [{ type: "Validators", id: arg }],
      async onQueryStarted(_, { getState, dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // `onSuccess` subscribe for updates
          const isLiveMode = selectIsLiveMode(getState());
          if (isLiveMode && data.is_auth) {
            const msg = JSON.stringify({
              method: "subscribe_validator",
              params: [data.address.toString()],
            });
            dispatch(socketActions.messageQueued(msg));
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.messageQueued(msg))
        }
      },
    }),
    getValidatorGradeByAddress: builder.query({
      query: ({ address, number_last_sessions, show_summary, show_stats }) => ({
        url: `/validators/${address}/grade`,
        params: { address, number_last_sessions, show_summary, show_stats },
      }),
      providesTags: (result, error, arg) => [{ type: "Validators", id: arg }],
    }),
  }),
});

export const {
  useGetValidatorsQuery,
  useGetValidatorByAddressQuery,
  useGetValidatorPeerByAuthorityQuery,
  useGetValidatorGradeByAddressQuery,
} = extendedApi;

// Actions
export const socketValidatorReceived = createAction(
  "validators/validatorReceived",
);

export const socketValidatorsReceived = createAction(
  "validators/validatorsReceived",
);

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => `${data.session}_${data.address}`,
});

export const matchValidatorReceived = isAnyOf(
  socketValidatorReceived,
  extendedApi.endpoints.getValidatorByAddress.matchFulfilled,
  extendedApi.endpoints.getValidatorPeerByAuthority.matchFulfilled,
);

export const matchValidatorsReceived = isAnyOf(
  socketValidatorsReceived,
  extendedApi.endpoints.getValidators.matchFulfilled,
);

const validatorsSlice = createSlice({
  name: "validators",
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(matchValidatorReceived, (state, action) => {
        adapter.upsertOne(state, { ...action.payload, _ts: +new Date() });
      })
      .addMatcher(matchValidatorsReceived, (state, action) => {
        const validators = action.payload.data.map((validator) => ({
          ...validator,
          session: !!validator.session
            ? validator.session
            : action.payload.session,
          _ts: +new Date(),
        }));
        adapter.upsertMany(state, validators);
      });
  },
});

export default validatorsSlice;

// Selectors
export const {
  selectAll: selectValidatorsAll,
  selectById: selectValidatorById,
} = adapter.getSelectors((state) => state.validators);

export const selectValidatorBySessionAndAddress = (state, session, address) =>
  selectValidatorById(state, `${session}_${address}`);
export const selectValidatorsByAddressAndSessions = (
  state,
  address,
  sessions = [],
  exclude_partial_sessions = false,
) =>
  sessions
    .map((sessionId) => {
      if (exclude_partial_sessions) {
        const session = selectSessionByIndex(state, sessionId);
        if (isUndefined(session)) return;
      }
      const validator = selectValidatorById(state, `${sessionId}_${address}`);
      if (!isUndefined(validator)) {
        if (validator.is_para) {
          return {
            ...validator,
            _val_group_mvr: selectValGroupMvrBySessionAndGroupId(
              state,
              sessionId,
              validator.para.group,
            ),
          };
        }
        return {
          ...validator,
        };
      }
    })
    .filter((v) => !isUndefined(v));

export const selectValidatorGradeBySessionAndAddress = (
  state,
  session,
  address,
) => {
  const v = selectValidatorBySessionAndAddress(state, session, address);
  if (!isUndefined(v) && !isUndefined(v.para_summary) && !isUndefined(v.para)) {
    return gradeByRatios(
      calculateMVR(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv),
      calculateBUR(v.para.bitfields?.ba, v.para.bitfields?.bu),
    );
  }
  return "-";
};

export const selectValidatorPoolCounterBySessionAndAddress = (
  state,
  session,
  address,
) => {
  const v = selectValidatorBySessionAndAddress(state, session, address);
  if (!isUndefined(v) && !isUndefined(v.pool_counter)) {
    return v.pool_counter;
  }
  return "-";
};

export const selectParaAuthoritySessionsByAddressAndSessions = (
  state,
  address,
  sessions = [],
) =>
  selectValidatorsByAddressAndSessions(state, address, sessions)
    .filter((v) => v.is_auth && v.is_para)
    .map((v) => v.session);

function mergeArrays(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const selectValidatorsBySessions = (state, sessions = [], suffix = "") => {
  let validators = {};
  sessions.forEach((sessionId) => {
    const session = selectSessionByIndex(state, sessionId);
    const key = `_stashes${suffix}`;
    if (!isUndefined(session) && !isUndefined(session[key])) {
      const a = session[key].map((s) =>
        selectValidatorBySessionAndAddress(state, sessionId, s),
      );
      const b = groupBy(a, (v) => v.address);
      mergeWith(validators, b, mergeArrays);
    }
  });
  return Object.values(validators);
};

function createRows(
  id,
  identity,
  address,
  validator_index,
  node_version,
  subset,
  active_sessions,
  para_sessions,
  authored_blocks,
  core_assignments,
  explicit_votes,
  implicit_votes,
  missed_votes,
  disputes,
  avg_pts,
  commission,
  paraId,
  availability,
  unavailability,
  timeline,
) {
  return {
    id,
    identity,
    address,
    validator_index,
    node_version,
    subset,
    active_sessions,
    para_sessions,
    authored_blocks,
    core_assignments,
    explicit_votes,
    implicit_votes,
    missed_votes,
    disputes,
    avg_pts,
    commission,
    paraId,
    availability,
    unavailability,
    timeline,
  };
}

// SCORES
// https://github.com/turboflakes/one-t/blob/main/SCORES.md
//
// Performance Score
// performance_score = (1 - mvr) * 0.5 + bar * 0.25 + ((avg_pts - min_avg_pts) / (max_avg_pts - min_avg_pts)) * 0.18 + (pv_sessions / total_sessions) * 0.07

// Commission Score
// commission_score = performance_score * 0.25 + (1 - commission) * 0.75

const performance_score = (
  mvr,
  bar,
  avg_pts,
  min_avg_pts,
  max_avg_pts,
  para_sessions,
  total_sessions,
) => {
  return (
    (1 - mvr) * 0.5 +
    bar * 0.25 +
    ((avg_pts - min_avg_pts) / (max_avg_pts - min_avg_pts)) * 0.18 +
    (para_sessions / total_sessions) * 0.07
  );
};

// Timeline
//
// NOTE: MVR_LEVELS are configurable in ONE-T bot.
// Default values are:
// fn default_mvr_level_1() -> u32 {
//   2000
// }
// fn default_mvr_level_2() -> u32 {
//   4000
// }
// fn default_mvr_level_3() -> u32 {
//   6000
// }
// fn default_mvr_level_4() -> u32 {
//   9000
// }
// They should be in sync to whatever is defined there.
//
const RATIO_LEVELS = [9000, 6000, 4000, 2000, -1];

const GLYPHS = {
  waiting: "_",
  active: "•",
  activePVL0: "❚",
  activePVL1: "❙",
  activePVL2: "❘",
  activePVL3: "!",
  activePVL4: "¿",
  activeIdle: "?",
  NA: ".",
  fromRatios: function (mvr, bur) {
    if (isUndefined(mvr) || isUndefined(bur)) {
      return this.activeIdle;
    }
    const rounded = Math.round((1 - (mvr * 0.8 + bur * 0.2)) * 10000);
    const index = RATIO_LEVELS.findIndex((l) => rounded > l);
    return this[`activePVL${index}`];
  },
};

export const SUBSET = {
  TVP: "DN",
  NONTVP: "Others",
  C100: "C100",
  NONVAL: "Non-validator",
};

export const selectValidatorsInsightsBySessions = (
  state,
  sessions = [],
  isHistory = false,
  identityFilter = "",
  subsetFilter = "",
  isFetching,
) => {
  const chainInfo = selectChainInfo(state);
  const validators = selectValidatorsBySessions(
    state,
    sessions,
    isHistory ? "_insights" : "",
  );
  const rows = validators.map((x, i) => {
    const f1 = x.filter((y) => y.is_auth);
    const authored_blocks = f1
      .map((v) => v.auth.ab.length)
      .reduce((a, b) => a + b, 0);
    const f2 = x.filter(
      (y) =>
        y.is_auth &&
        y.is_para &&
        !isUndefined(y.para_summary) &&
        !isUndefined(y.para),
    );
    // const para_points = f2.length > 0 ? f2.map(v => v.para_summary.pt - (v.para_summary.ab * 20)).reduce((a, b) => a + b, 0) : null;
    const para_points =
      f2.length > 0
        ? f2
            .map((v) => v.auth.ep - v.auth.sp - v.auth.ab.length * 20)
            .reduce((a, b) => a + b, 0)
        : null;
    const core_assignments =
      f2.length > 0
        ? f2.map((v) => v.para_summary.ca).reduce((a, b) => a + b, 0)
        : null;
    const implicit_votes =
      f2.length > 0
        ? f2.map((v) => v.para_summary.iv).reduce((a, b) => a + b, 0)
        : null;
    const explicit_votes =
      f2.length > 0
        ? f2.map((v) => v.para_summary.ev).reduce((a, b) => a + b, 0)
        : null;
    const missed_votes =
      f2.length > 0
        ? f2.map((v) => v.para_summary.mv).reduce((a, b) => a + b, 0)
        : null;
    const disputes =
      f2.length > 0
        ? f2
            .map((v) =>
              !isUndefined(v.para.disputes) ? v.para.disputes.length : 0,
            )
            .reduce((a, b) => a + b, 0)
        : null;
    const avg_bck_pts = f2.length > 0 ? para_points / f2.length : null;
    const paraId = f2.length > 0 ? f2.map((v) => v.para.pid) : null;
    const validator_index = !!f1.length ? f1[0].auth.aix : null;

    const timeline = sessions.map((s) => {
      const y = x.find((e) => e.session === s);
      if (!isUndefined(y)) {
        if (
          y.is_auth &&
          y.is_para &&
          !isUndefined(y.para_summary) &&
          !isUndefined(y.para)
        ) {
          const mvr = calculateMVR(
            y.para_summary.ev,
            y.para_summary.iv,
            y.para_summary.mv,
          );
          const bur = calculateBUR(y.para.bitfields?.ba, y.para.bitfields?.bu);
          return GLYPHS.fromRatios(mvr, bur);
        } else if (y.is_auth) {
          return GLYPHS.active;
        } else {
          return GLYPHS.NA;
        }
      } else {
        return GLYPHS.waiting;
      }
    });

    // NOTE: the most recent session is given by the last element
    let session = x.length - 1;
    const profile = selectValProfileByAddress(state, x[session].address);
    const address = x[session].address;
    const node_version = x[session].discovery ? x[session].discovery.nv : "";

    // Bitfields availability
    const availability =
      f2.length > 0
        ? f2.map((v) => v.para.bitfields?.ba).reduce((a, b) => a + b, 0)
        : null;
    const unavailability =
      f2.length > 0
        ? f2.map((v) => v.para.bitfields?.bu).reduce((a, b) => a + b, 0)
        : null;

    return createRows(
      i + 1,
      !isUndefined(profile) ? profile._identity : null,
      address,
      validator_index,
      node_version,
      !isUndefined(profile) ? SUBSET[profile.subset] : null,
      f1.length,
      f2.length,
      authored_blocks,
      core_assignments,
      explicit_votes,
      implicit_votes,
      missed_votes,
      disputes,
      avg_bck_pts,
      !isUndefined(profile) ? profile.commission : null,
      paraId,
      availability,
      unavailability,
      timeline.join(""),
    );
  });

  const min_avg_pts = min(
    rows.filter((v) => !isNull(v.avg_pts)).map((v) => v.avg_pts),
  );
  const max_avg_pts = max(
    rows.filter((v) => !isNull(v.avg_pts)).map((v) => v.avg_pts),
  );

  const filteredRows = rows
    .map((v) => {
      const mvr =
        v.para_sessions > 0
          ? calculateMVR(v.explicit_votes, v.implicit_votes, v.missed_votes)
          : null;
      const bar =
        v.para_sessions > 0
          ? calculateBAR(v.availability, v.unavailability)
          : null;

      const bur =
        v.para_sessions > 0
          ? calculateBUR(v.availability, v.unavailability)
          : null;
      const score =
        v.para_sessions > 0
          ? performance_score(
              mvr,
              bar,
              v.avg_pts,
              min_avg_pts,
              max_avg_pts,
              v.para_sessions,
              sessions.length,
            )
          : null;
      return {
        ...v,
        mvr,
        bar,
        bur,
        score,
        isFetching,
      };
    })
    .filter((v) =>
      !isUndefined(v.identity) && !isUndefined(v.address)
        ? v.identity?.toLowerCase().includes(identityFilter?.toLowerCase()) ||
          v.address?.toLowerCase().includes(identityFilter?.toLowerCase()) ||
          chainAddress(v.address, chainInfo.ss58Format)
            .toLowerCase()
            .includes(identityFilter?.toLowerCase())
        : false,
    );

  if (subsetFilter !== "") {
    return filteredRows.filter((v) =>
      !isUndefined(v.subset) ? v.subset === subsetFilter : false,
    );
  }
  return filteredRows;
};
