import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
  current,
} from "@reduxjs/toolkit";
import uniq from "lodash/uniq";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import toNumber from "lodash/toNumber";
import isArray from "lodash/isArray";
import forEach from "lodash/forEach";
import groupBy from "lodash/groupBy";
import union from "lodash/union";
import join from "lodash/join";
import apiSlice from "./apiSlice";
import { socketActions } from "./socketSlice";
import {
  matchValidatorsReceived,
  selectValidatorById,
} from "./validatorsSlice";
import {
  selectParachainBySessionAndParaId,
  matchParachainsReceived,
} from "./parachainsSlice";
import { matchPoolsReceived, selectPoolBySessionAndPoolId } from "./poolsSlice";
import {
  selectValGroupBySessionAndGroupId,
  selectValidatorsBySessionAndGroupId,
  selectValidatorIdsBySessionAndGroupId,
} from "./valGroupsSlice";
import { selectFinalizedBlock } from "./blocksSlice";
import { selectValProfileByAddress } from "./valProfilesSlice";
import { selectValidatorBySessionAndAuthId } from "./authoritiesSlice";
import { selectChain, selectChainInfo } from "../chain/chainSlice";
import { matchBoardsReceived } from "./boardsSlice";
import { getChainName, isChainSupported } from "../../constants";
import { calculateMVR, calculateBAR, calculateBUR } from "../../util/math";
import { gradeByRatios } from "../../util/grade";
import { chainAddress } from "../../util/crypto";

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ["Sessions"],
  endpoints: (builder) => ({
    getSessions: builder.query({
      query: ({
        number_last_sessions,
        from,
        to,
        show_stats,
        show_netstats,
        retry,
      }) => ({
        url: `/sessions`,
        params: {
          number_last_sessions,
          from,
          to,
          show_stats,
          show_netstats,
          retry,
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Sessions", id: arg }],
      transformResponse: (responseData) => {
        return responseData.data;
      },
      async onQueryStarted(params, { getState, dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // `onSuccess` subscribe for updates
          if (params.from && params.to && params.show_netstats) {
            const session = selectSessionByIndex(getState(), params.to);
            if (session.is_syncing) {
              const parsed = parseInt(params.retry, 10);
              const retry = isNaN(parsed) ? 1 : parsed + 1;
              if (retry < 60) {
                setTimeout(() => {
                  dispatch(
                    extendedApi.endpoints.getSessions.initiate({
                      ...params,
                      retry,
                    }),
                  );
                }, 2000);
              }
            }
          }
        } catch (err) {
          // `onError` side-effect
          const parsed = parseInt(params.retry, 10);
          const retry = isNaN(parsed) ? 1 : parsed + 1;
          if (retry < 60) {
            setTimeout(() => {
              dispatch(
                extendedApi.endpoints.getSessions.initiate({
                  ...params,
                  retry,
                }),
              );
            }, 2000);
          }
        }
      },
    }),
    getSessionByIndex: builder.query({
      query: ({ index, retry }) => ({
        url: `/sessions/${index}`,
        params: { retry },
      }),
      providesTags: (result, error, arg) => [{ type: "Sessions", id: arg }],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // `onSuccess` subscribe for updates
          if (params.index === "current") {
            const msg = JSON.stringify({
              method: "subscribe_session",
              params: ["new"],
            });
            dispatch(socketActions.messageQueued(msg));
            // Fetch previous sessions stats for the current era
            dispatch(
              extendedApi.endpoints.getSessions.initiate({
                number_last_sessions: data.esix - 1,
                show_stats: true,
              }),
            );
          }
        } catch (err) {
          // `onError` side-effect
          const parsed = parseInt(params.retry, 10);
          const retry = isNaN(parsed) ? 1 : parsed + 1;
          if (retry < 60) {
            setTimeout(() => {
              dispatch(
                extendedApi.endpoints.getSessionByIndex.initiate({
                  ...params,
                  retry,
                }),
              );
            }, 1000);
          }
        }
      },
    }),
  }),
});

export const { useGetSessionsQuery, useGetSessionByIndexQuery } = extendedApi;

// Actions
export const socketSessionReceived = createAction("sessions/sessionReceived");

export const socketSessionsReceived = createAction("sessions/sessionsReceived");

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => data.six,
  sortComparer: (a, b) => a.six > b.six,
});

const matchSessionReceived = isAnyOf(
  socketSessionReceived,
  extendedApi.endpoints.getSessionByIndex.matchFulfilled,
);

export const matchSessionsReceived = isAnyOf(
  socketSessionsReceived,
  extendedApi.endpoints.getSessions.matchFulfilled,
);

const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    current: "current",
    ...adapter.getInitialState(),
  },
  reducers: {
    sessionHistoryChanged: (state, action) => {
      state.history = action.payload;
    },
    sessionHistoryRangeChanged: (state, action) => {
      state.history_range = action.payload;
    },
    sessionHistoryIdsChanged: (state, action) => {
      state.history_ids = action.payload;
    },
    sessionChanged: (state, action) => {
      state.current = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(matchSessionReceived, (state, action) => {
        // update session current from sessionReceived (needed when new session is received)
        if (action.payload.is_current) {
          state.current = action.payload.six;
        }
        // update session with timestamp
        adapter.upsertOne(state, { ...action.payload, _ts: +new Date() });
      })
      .addMatcher(matchSessionsReceived, (state, action) => {
        const sessions = action.payload.map((session) => ({
          ...session,
          _mvr: !isUndefined(session.stats)
            ? calculateMVR(session.stats.ev, session.stats.iv, session.stats.mv)
            : undefined,
          _bar: !isUndefined(session.stats)
            ? calculateBAR(session.stats.ba, session.stats.bu)
            : undefined,
          _ts: +new Date(),
        }));
        adapter.upsertMany(state, sessions);
      })
      .addMatcher(matchValidatorsReceived, (state, action) => {
        const setKey = (action, prefix) => {
          if (!isUndefined(action)) {
            if (!isUndefined(action.meta)) {
              if (!isUndefined(action.meta.arg)) {
                if (!isUndefined(action.meta.arg.originalArgs)) {
                  if (
                    !isUndefined(action.meta.arg.originalArgs.from) &&
                    !isUndefined(action.meta.arg.originalArgs.to)
                  ) {
                    return `${prefix}_insights`;
                  }
                }
              }
            }
          }
          return prefix;
        };

        // Filter validators if authority and p/v
        const filtered = action.payload.data.filter((v) => v.is_auth);

        // Group validators by session first
        const groupedBySession = groupBy(filtered, (v) =>
          !!v.session ? v.session : action.payload.session,
        );

        let currentState = current(state);

        forEach(groupedBySession, (validators, session) => {
          const filtered = validators.filter(
            (v) =>
              v.is_auth &&
              v.is_para &&
              !isUndefined(v.para_summary) &&
              !isUndefined(v.para),
          );
          const _group_ids = uniq(
            filtered
              .filter((v) => !isNaN(parseInt(v.para?.group)))
              .map((v) => toNumber(v.para?.group)),
          ).sort((a, b) => a - b);
          const _core_ids = uniq(
            filtered
              .filter((v) => !isNaN(parseInt(v.para?.core)))
              .map((v) => toNumber(v.para?.core)),
          ).sort((a, b) => a - b);
          const _mvrs = filtered.map((v) =>
            calculateMVR(
              v.para_summary.ev,
              v.para_summary.iv,
              v.para_summary.mv,
            ),
          );
          const _bars = filtered.map((v) =>
            calculateBAR(v.para.bitfields?.ba, v.para.bitfields?.bu),
          );
          const _grades = filtered.map((v) =>
            gradeByRatios(
              calculateMVR(
                v.para_summary.ev,
                v.para_summary.iv,
                v.para_summary.mv,
              ),
              calculateBUR(v.para.bitfields?.ba, v.para.bitfields?.bu),
            ),
          );
          const _validity_votes = filtered.map(
            (v) => v.para_summary.ev + v.para_summary.iv + v.para_summary.mv,
          );
          const _backing_points = filtered.map((v) =>
            v.auth.ep - v.auth.sp - v.auth.ab.length * 20 > 0
              ? v.auth.ep - v.auth.sp - v.auth.ab.length * 20
              : 0,
          );
          const _current_stashes = !isUndefined(currentState.entities[session])
            ? !isUndefined(currentState.entities[session]._stashes)
              ? currentState.entities[session]._stashes
              : []
            : [];
          const _stashes = union(
            _current_stashes,
            validators.map((v) => v.address),
          );
          const _dispute_stashes = filtered
            .filter((v) => !isUndefined(v.para.disputes))
            .map((v) => v.address);
          const _f_grade_stashes = filtered
            .filter(
              (v) =>
                gradeByRatios(
                  calculateMVR(
                    v.para_summary.ev,
                    v.para_summary.iv,
                    v.para_summary.mv,
                  ),
                  calculateBUR(v.para.bitfields?.ba, v.para.bitfields?.bu),
                ) === "F",
            )
            .map((v) => v.address);

          adapter.upsertOne(state, {
            six: parseInt(session, 10),
            [setKey(action, "_group_ids")]: _group_ids,
            [setKey(action, "_core_ids")]: _core_ids,
            [setKey(action, "_mvrs")]: _mvrs,
            [setKey(action, "_bars")]: _bars,
            [setKey(action, "_grades")]: _grades,
            [setKey(action, "_validity_votes")]: _validity_votes,
            [setKey(action, "_backing_points")]: _backing_points,
            [setKey(action, "_stashes")]: _stashes,
            [setKey(action, "_dispute_stashes")]: _dispute_stashes,
            [setKey(action, "_f_grade_stashes")]: _f_grade_stashes,
          });
        });
      })
      .addMatcher(matchParachainsReceived, (state, action) => {
        adapter.upsertOne(state, {
          six: action.payload.session,
          _parachain_ids: action.payload.data.map((p) => p.pid),
        });
      })
      .addMatcher(matchPoolsReceived, (state, action) => {
        // verify that query was not for a single pool
        if (!isUndefined(action)) {
          if (!isUndefined(action.meta)) {
            if (!isUndefined(action.meta.arg)) {
              if (!isUndefined(action.meta.arg.originalArgs)) {
                if (!isUndefined(action.meta.arg.originalArgs.pool)) {
                  return;
                }
              }
            }
          }
        }

        // Group pools by session first
        const groupedBySession = groupBy(action.payload.data, (v) =>
          !!v.session ? v.session : action.payload.session,
        );

        forEach(groupedBySession, (pools, session) => {
          if (!isUndefined(session)) {
            adapter.upsertOne(state, {
              six: parseInt(session, 10),
              _pool_ids: pools.map((p) => p.id),
              _pool_members: pools
                .map((p) =>
                  !isUndefined(p.stats) ? p.stats.member_counter : 0,
                )
                .reduce((a, b) => a + b, 0),
              _pool_staked: pools
                .map((p) => (!isUndefined(p.stats) ? p.stats.staked : 0))
                .reduce((a, b) => a + b, 0),
              _pool_reward: pools
                .map((p) => (!isUndefined(p.stats) ? p.stats.reward : 0))
                .reduce((a, b) => a + b, 0),
              _pool_points: pools
                .map((p) => (!isUndefined(p.stats) ? p.stats.points : 0))
                .reduce((a, b) => a + b, 0),
            });
          }
        });
      })
      .addMatcher(matchBoardsReceived, (state, action) => {
        // NOTE: when using NOMI app change history session so that validator history timeline can be loaded from this session
        state.history = action.payload.data[0].session;
      });
  },
});

// Selectors
export const {
  selectAll: selectSessionsAll,
  selectById: selectSessionByIndex,
} = adapter.getSelectors((state) => state.sessions);

export const selectSessionCurrent = (state) => state.sessions.current;
export const selectSessionHistory = (state) => state.sessions.history;
export const selectSessionHistoryRange = (state) =>
  isUndefined(state.sessions.history_range)
    ? [state.sessions.current - 6, state.sessions.current - 1]
    : state.sessions.history_range;
export const selectSessionHistoryRangeIds = (state) =>
  buildSessionIdsArrayHelper(
    selectSessionHistoryRange(state)[1],
    1 +
      selectSessionHistoryRange(state)[1] -
      selectSessionHistoryRange(state)[0],
  );
export const selectSessionHistoryIds = (state) =>
  isUndefined(state.sessions.history_ids)
    ? buildSessionIdsArrayHelper(state.sessions.current - 1, 6)
    : state.sessions.history_ids;
export const selectSessionsByIds = (state, sessionIds = []) =>
  sessionIds.map((id) => selectSessionByIndex(state, id));

export const selectValGroupIdsBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._group_ids)
      ? selectSessionByIndex(state, session)._group_ids
      : []
    : [];

export const selectValGroupIdsBySessionSortedBy = (
  state,
  session,
  sortBy,
  orderBy,
  identityFilter = "",
) => {
  const chainInfo = selectChainInfo(state);
  switch (sortBy) {
    case "backing_points": {
      const group_ids = selectValGroupIdsBySession(state, session)
        .map((group_id) =>
          selectValGroupBySessionAndGroupId(state, session, group_id),
        )
        .filter(
          (f) =>
            `val group ${f._group_id.toString()}` ===
              identityFilter.toLowerCase().trim() ||
            `group ${f._group_id.toString()}` ===
              identityFilter.toLowerCase().trim() ||
            (!isUndefined(f._validatorIds)
              ? join(
                  f._validatorIds.map((m) =>
                    !isUndefined(
                      selectValProfileByAddress(
                        state,
                        selectValidatorById(state, m).address,
                      ),
                    )
                      ? `${selectValProfileByAddress(state, selectValidatorById(state, m).address)._identity},${chainAddress(selectValidatorById(state, m).address, chainInfo.ss58Format)}`
                      : "",
                  ),
                  ",",
                )
                  .toLowerCase()
                  .includes(identityFilter.toLowerCase())
              : false),
        )
        .sort((a, b) =>
          orderBy
            ? b._backing_points - a._backing_points
            : a._backing_points - b._backing_points,
        )
        .map((o) => o._group_id);
      return group_ids;
    }
    case "mvr": {
      const group_ids = selectValGroupIdsBySession(state, session)
        .map((group_id) =>
          selectValGroupBySessionAndGroupId(state, session, group_id),
        )
        .filter(
          (f) =>
            `val group ${f._group_id.toString()}` ===
              identityFilter.toLowerCase().trim() ||
            `group ${f._group_id.toString()}` ===
              identityFilter.toLowerCase().trim() ||
            (!isUndefined(f._validatorIds)
              ? join(
                  f._validatorIds.map((m) =>
                    !isUndefined(
                      selectValProfileByAddress(
                        state,
                        selectValidatorById(state, m).address,
                      ),
                    )
                      ? `${selectValProfileByAddress(state, selectValidatorById(state, m).address)._identity},${chainAddress(selectValidatorById(state, m).address, chainInfo.ss58Format)}`
                      : "",
                  ),
                  ",",
                )
                  .toLowerCase()
                  .includes(identityFilter.toLowerCase())
              : false),
        )
        .sort((a, b) => (orderBy ? b._mvr - a._mvr : a._mvr - b._mvr))
        .map((o) => o._group_id);
      return group_ids;
    }
    case "group_id": {
      const group_ids = selectValGroupIdsBySession(state, session)
        .map((group_id) =>
          selectValGroupBySessionAndGroupId(state, session, group_id),
        )
        .filter(
          (f) =>
            `val group ${f._group_id.toString()}` ===
              identityFilter.toLowerCase().trim() ||
            `group ${f._group_id.toString()}` ===
              identityFilter.toLowerCase().trim() ||
            (!isUndefined(f._validatorIds)
              ? join(
                  f._validatorIds.map((m) =>
                    !isUndefined(
                      selectValProfileByAddress(
                        state,
                        selectValidatorById(state, m).address,
                      ),
                    )
                      ? `${selectValProfileByAddress(state, selectValidatorById(state, m).address)._identity},${chainAddress(selectValidatorById(state, m).address, chainInfo.ss58Format)}`
                      : "",
                  ),
                  ",",
                )
                  .toLowerCase()
                  .includes(identityFilter.toLowerCase())
              : false),
        )
        .sort((a, b) =>
          orderBy ? b._group_id - a._group_id : a._group_id - b._group_id,
        )
        .map((o) => o._group_id);
      return group_ids;
    }
    default: {
      return selectValGroupIdsBySession(state, session);
    }
  }
};

export const selectCoreIdsBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._core_ids)
      ? selectSessionByIndex(state, session)._core_ids
      : []
    : [];

export const selectPoolIdsBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._pool_ids)
      ? selectSessionByIndex(state, session)._pool_ids
      : []
    : [];

export const selectPoolIdsBySessionSortedBy = (
  state,
  session,
  sortBy,
  orderBy,
  identityFilter = "",
  stateFilter = "Open",
) => {
  switch (sortBy) {
    case "apr": {
      const pool_ids = selectPoolIdsBySession(state, session)
        .map((pool_id) => selectPoolBySessionAndPoolId(state, session, pool_id))
        .filter(
          (f) =>
            f.state === stateFilter &&
            (f.metadata.toLowerCase().includes(identityFilter.toLowerCase()) ||
              (!isUndefined(f.nominees)
                ? join(
                    !isUndefined(f.nominees)
                      ? f.nominees.nominees.map((m) =>
                          !isUndefined(selectValProfileByAddress(state, m))
                            ? selectValProfileByAddress(state, m)._identity
                            : "",
                        )
                      : "",
                    ",",
                  )
                    .toLowerCase()
                    .includes(identityFilter.toLowerCase())
                : false)),
        )
        .map((o) => {
          if (isUndefined(o.nomstats)) {
            return {
              ...o,
              nomstats: {
                apr: 0,
              },
            };
          }
          return o;
        })
        .sort((a, b) =>
          orderBy
            ? b.nomstats.apr - a.nomstats.apr
            : a.nomstats.apr - b.nomstats.apr,
        )
        .map((o) => o.id);
      return pool_ids;
    }
    case "members": {
      const pool_ids = selectPoolIdsBySession(state, session)
        .map((pool_id) => selectPoolBySessionAndPoolId(state, session, pool_id))
        .filter(
          (f) =>
            f.state === stateFilter &&
            (f.metadata.toLowerCase().includes(identityFilter.toLowerCase()) ||
              (!isUndefined(f.nominees)
                ? join(
                    !isUndefined(f.nominees)
                      ? f.nominees.nominees.map((m) =>
                          !isUndefined(selectValProfileByAddress(state, m))
                            ? selectValProfileByAddress(state, m)._identity
                            : "",
                        )
                      : "",
                    ",",
                  )
                    .toLowerCase()
                    .includes(identityFilter.toLowerCase())
                : false)),
        )
        .sort((a, b) =>
          !isUndefined(a.stats) && !isUndefined(b.stats)
            ? orderBy
              ? b.stats.member_counter - a.stats.member_counter
              : a.stats.member_counter - b.stats.member_counter
            : 0,
        )
        .map((o) => o.id);
      return pool_ids;
    }
    case "points": {
      const pool_ids = selectPoolIdsBySession(state, session)
        .map((pool_id) => selectPoolBySessionAndPoolId(state, session, pool_id))
        .filter(
          (f) =>
            f.state === stateFilter &&
            (f.metadata.toLowerCase().includes(identityFilter.toLowerCase()) ||
              (!isUndefined(f.nominees)
                ? join(
                    !isUndefined(f.nominees)
                      ? f.nominees.nominees.map((m) =>
                          !isUndefined(selectValProfileByAddress(state, m))
                            ? selectValProfileByAddress(state, m)._identity
                            : "",
                        )
                      : "",
                    ",",
                  )
                    .toLowerCase()
                    .includes(identityFilter.toLowerCase())
                : false)),
        )
        .sort((a, b) =>
          !isUndefined(a.stats) && !isUndefined(b.stats)
            ? orderBy
              ? b.stats.points - a.stats.points
              : a.stats.points - b.stats.points
            : 0,
        )
        .map((o) => o.id);
      return pool_ids;
    }
    case "pool_id": {
      const pool_ids = selectPoolIdsBySession(state, session)
        .map((pool_id) => selectPoolBySessionAndPoolId(state, session, pool_id))
        .filter(
          (f) =>
            f.state === stateFilter &&
            (f.metadata.toLowerCase().includes(identityFilter.toLowerCase()) ||
              (!isUndefined(f.nominees)
                ? join(
                    !isUndefined(f.nominees)
                      ? f.nominees.nominees.map((m) =>
                          !isUndefined(selectValProfileByAddress(state, m))
                            ? selectValProfileByAddress(state, m)._identity
                            : "",
                        )
                      : "",
                    ",",
                  )
                    .toLowerCase()
                    .includes(identityFilter.toLowerCase())
                : false)),
        )
        .sort((a, b) =>
          !isUndefined(a.stats) && !isUndefined(b.stats)
            ? orderBy
              ? b.id - a.id
              : a.id - b.id
            : 0,
        )
        .map((o) => o.id);
      return pool_ids;
    }
    default: {
      return selectPoolIdsBySession(state, session);
    }
  }
};

export const selectParachainIdsBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._parachain_ids)
      ? selectSessionByIndex(state, session)._parachain_ids
      : []
    : [];

export const selectParachainIdsBySessionSortedBy = (
  state,
  session,
  sortBy,
  orderBy,
  identityFilter = "",
) => {
  const chainInfo = selectChainInfo(state);
  switch (sortBy) {
    case "backing_points": {
      const para_ids = selectParachainIdsBySession(state, session)
        .map((para_id) =>
          selectParachainBySessionAndParaId(state, session, para_id),
        )
        .filter(
          (f) =>
            f.pid.toString().includes(identityFilter.toLowerCase().trim()) ||
            (isChainSupported(selectChain(state), f.pid)
              ? getChainName(selectChain(state), f.pid)
              : f.pid.toString()
            )
              .toLowerCase()
              .includes(identityFilter.toLowerCase()) ||
            join(
              f.auths.map((m) =>
                !isUndefined(
                  selectValProfileByAddress(
                    state,
                    selectValidatorBySessionAndAuthId(state, session, m)
                      .address,
                  ),
                )
                  ? `${selectValProfileByAddress(state, selectValidatorBySessionAndAuthId(state, session, m).address)._identity},${chainAddress(selectValidatorBySessionAndAuthId(state, session, m).address, chainInfo.ss58Format)}`
                  : "",
              ),
              ",",
            )
              .toLowerCase()
              .includes(identityFilter.toLowerCase()),
        )
        .sort((a, b) =>
          orderBy
            ? b._backing_points - a._backing_points
            : a._backing_points - b._backing_points,
        )
        .map((o) => o.pid);
      return para_ids;
    }
    case "mvr": {
      const para_ids = selectParachainIdsBySession(state, session)
        .map((para_id) =>
          selectParachainBySessionAndParaId(state, session, para_id),
        )
        .filter(
          (f) =>
            f.pid.toString().includes(identityFilter.toLowerCase().trim()) ||
            (isChainSupported(selectChain(state), f.pid)
              ? getChainName(selectChain(state), f.pid)
              : f.pid.toString()
            )
              .toLowerCase()
              .includes(identityFilter.toLowerCase()) ||
            join(
              f.auths.map((m) =>
                !isUndefined(
                  selectValProfileByAddress(
                    state,
                    selectValidatorBySessionAndAuthId(state, session, m)
                      .address,
                  ),
                )
                  ? `${selectValProfileByAddress(state, selectValidatorBySessionAndAuthId(state, session, m).address)._identity},${chainAddress(selectValidatorBySessionAndAuthId(state, session, m).address, chainInfo.ss58Format)}`
                  : "",
              ),
              ",",
            )
              .toLowerCase()
              .includes(identityFilter.toLowerCase()),
        )
        .sort((a, b) => (orderBy ? b._mvr - a._mvr : a._mvr - b._mvr))
        .map((o) => o.pid);
      return para_ids;
    }
    case "para_id": {
      const para_ids = selectParachainIdsBySession(state, session)
        .map((para_id) =>
          selectParachainBySessionAndParaId(state, session, para_id),
        )
        .filter(
          (f) =>
            f.pid.toString().includes(identityFilter.toLowerCase().trim()) ||
            (isChainSupported(selectChain(state), f.pid)
              ? getChainName(selectChain(state), f.pid)
              : f.pid.toString()
            )
              .toLowerCase()
              .includes(identityFilter.toLowerCase()) ||
            join(
              f.auths.map((m) =>
                !isUndefined(
                  selectValProfileByAddress(
                    state,
                    selectValidatorBySessionAndAuthId(state, session, m)
                      .address,
                  ),
                )
                  ? `${selectValProfileByAddress(state, selectValidatorBySessionAndAuthId(state, session, m).address)._identity},${chainAddress(selectValidatorBySessionAndAuthId(state, session, m).address, chainInfo.ss58Format)}`
                  : "",
              ),
              ",",
            )
              .toLowerCase()
              .includes(identityFilter.toLowerCase()),
        )
        .sort((a, b) => (orderBy ? b.pid - a.pid : a.pid - b.pid))
        .map((o) => o.pid);
      return para_ids;
    }
    default: {
      return selectParachainIdsBySession(state, session);
    }
  }
};

export const selectTotalParachainIdsBySession = (state, session) =>
  selectParachainIdsBySession(state, session).length;

export const selectScheduledParachainsBySession = (state, session) => {
  return selectParachainIdsBySession(state, session)
    .map((para_id) =>
      selectParachainBySessionAndParaId(state, session, para_id),
    )
    .filter((para) => !isUndefined(para) && !isNull(para.group)).length;
};

export const selectGradesBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._grades)
      ? selectSessionByIndex(state, session)._grades
      : []
    : [];

export const selectBARsBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._bars)
      ? selectSessionByIndex(state, session)._bars
      : []
    : [];

export const selectMVRsBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._mvrs)
      ? selectSessionByIndex(state, session)._mvrs
      : []
    : [];

export const selectDisputesBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._dispute_stashes)
      ? selectSessionByIndex(state, session)._dispute_stashes
      : []
    : [];

export const selectLowGradesBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._f_grade_stashes)
      ? selectSessionByIndex(state, session)._f_grade_stashes
      : []
    : [];

export const selectValidityVotesBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._validity_votes)
      ? selectSessionByIndex(state, session)._validity_votes
      : []
    : [];

export const selectBackingPointsBySession = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? isArray(selectSessionByIndex(state, session)._backing_points)
      ? selectSessionByIndex(state, session)._backing_points
      : []
    : [];

export const selectParaValidatorIdsBySessionGrouped = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? selectSessionByIndex(state, session)._group_ids.map((groupId) =>
        selectValidatorIdsBySessionAndGroupId(state, session, groupId),
      )
    : [];

export const selectParaValidatorsBySessionGrouped = (state, session) =>
  !!selectSessionByIndex(state, session)
    ? selectSessionByIndex(state, session)._group_ids.map((groupId) =>
        selectValidatorsBySessionAndGroupId(state, session, groupId),
      )
    : [];

export const selectMVRBySessions = (state, sessionIds = []) =>
  sessionIds.map((id) => {
    const session = selectSessionByIndex(state, id);
    if (!isUndefined(session)) {
      return session._mvr;
    }
    return undefined;
  });

export const selectBARBySessions = (state, sessionIds = []) =>
  sessionIds.map((id) => {
    const session = selectSessionByIndex(state, id);
    if (!isUndefined(session)) {
      return session._bar;
    }
    return undefined;
  });

export const selectBurBySessions = (state, sessionIds = []) =>
  sessionIds.map((id) => {
    const session = selectSessionByIndex(state, id);
    if (!isUndefined(session)) {
      return session._bur;
    }
    return undefined;
  });

export const selectBackingPointsBySessions = (state, sessionIds = []) =>
  sessionIds.map((id) => {
    const session = selectSessionByIndex(state, id);
    if (!isUndefined(session)) {
      if (!isUndefined(session.stats)) {
        return session.stats.pt - session.stats.ab * 20;
      }
    }
    return undefined;
  });
// .filter((v) => !isUndefined(v));

export const selectTotalPointsBySessions = (state, sessionIds = []) =>
  sessionIds.map((id) => {
    const session = selectSessionByIndex(state, id);
    if (!isUndefined(session)) {
      if (!isUndefined(session.stats)) {
        return session.stats.pt;
      }
    }
    return undefined;
  });
// .filter((v) => !isUndefined(v));

export const selectAuthoredBlocksBySessions = (state, sessionIds = []) =>
  sessionIds.map((id) => {
    const session = selectSessionByIndex(state, id);
    if (!isUndefined(session)) {
      if (!isUndefined(session.stats)) {
        return session.stats.ab;
      }
    }
    return undefined;
  });
// .filter((v) => !isUndefined(v));

export const selectDisputesBySessions = (state, sessionIds = []) =>
  sessionIds.map((id) => {
    const session = selectSessionByIndex(state, id);
    if (!isUndefined(session)) {
      if (!isUndefined(session.stats)) {
        return session.stats.di;
      }
    }
    return undefined;
  });
// .filter((v) => !isUndefined(v));

// Pools
export const selectPoolMembersBySessions = (state, sessionIds = []) =>
  sessionIds
    .map((id) => {
      const session = selectSessionByIndex(state, id);
      if (!isUndefined(session)) {
        return session._pool_members;
      }
      return undefined;
    })
    .filter((v) => !isUndefined(v));

export const selectPoolAvailableSessionsBySessions = (state, sessionIds = []) =>
  sessionIds
    .map((id) => {
      const session = selectSessionByIndex(state, id);
      if (!isUndefined(session) && !isUndefined(session._pool_ids)) {
        return session.six;
      }
      return undefined;
    })
    .filter((v) => !isUndefined(v));

export const selectPoolStakedBySessions = (state, sessionIds = []) =>
  sessionIds
    .map((id) => {
      const session = selectSessionByIndex(state, id);
      if (!isUndefined(session)) {
        return session._pool_staked;
      }
      return undefined;
    })
    .filter((v) => !isUndefined(v));

export const selectPoolRewardBySessions = (state, sessionIds = []) =>
  sessionIds
    .map((id) => {
      const session = selectSessionByIndex(state, id);
      if (!isUndefined(session)) {
        return session._pool_reward;
      }
      return undefined;
    })
    .filter((v) => !isUndefined(v));

export const selectPoolPointsBySessions = (state, sessionIds = []) =>
  sessionIds
    .map((id) => {
      const session = selectSessionByIndex(state, id);
      if (!isUndefined(session)) {
        return session._pool_points;
      }
      return undefined;
    })
    .filter((v) => !isUndefined(v));

// Era
export const selectEraPointsBySession = (state, sessionId) => {
  const session = selectSessionByIndex(state, sessionId);
  if (!isUndefined(session)) {
    // Calculate previous sessions points
    let sessionIds = [];
    for (let i = 1; i < session.esix; i++) {
      sessionIds.push(session.six - i);
    }
    let previousSessionsPoints = selectTotalPointsBySessions(
      state,
      sessionIds,
    ).reduce((a, b) => a + b, 0);
    // Get current session points from last finalized block
    const block = selectFinalizedBlock(state);
    if (!isUndefined(block)) {
      if (!isUndefined(block.stats)) {
        return previousSessionsPoints + block.stats.pt;
      }
    }
    return previousSessionsPoints;
  }
  return 0;
};

export const buildSessionIdsArrayHelper = (startSession, max = 0) => {
  if (isNaN(startSession)) {
    return [];
  }
  let out = [];
  for (let i = max - 1; i >= 0; i--) {
    out.push(startSession - i);
  }
  return out;
};

export const {
  sessionHistoryChanged,
  sessionHistoryRangeChanged,
  sessionHistoryIdsChanged,
} = sessionsSlice.actions;

export default sessionsSlice;
