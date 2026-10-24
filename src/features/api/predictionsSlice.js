import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import { selectValProfileByAddress } from "./valProfilesSlice";
import {
  matchValidatorReceived,
  matchValidatorsReceived,
  selectValidatorGradeBySessionAndAddress,
} from "./validatorsSlice";
import { selectSessionCurrent } from "./sessionsSlice";
import apiSlice from "./apiSlice";
import { selectChainInfo } from "../chain/chainSlice";
import { chainAddress } from "../../util/crypto";

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ["Predictions", "PredictionValidators"],
  endpoints: (builder) => ({
    // GET /preds
    getPredictions: builder.query({
      query: () => ({ url: `/preds` }),
      providesTags: [{ type: "Predictions", id: "LIST" }],
    }),
    // GET /preds/{target}
    getPredictionByTarget: builder.query({
      query: ({ target }) => ({ url: `/preds/${target}` }),
      providesTags: (result, error, arg) => [
        { type: "Predictions", id: arg.target },
      ],
    }),
    // GET /preds/{target}/validators
    getPredictionValidators: builder.query({
      query: ({ target }) => ({ url: `/preds/${target}/validators` }),
      providesTags: (result, error, arg) => [
        { type: "PredictionValidators", id: arg.target },
      ],
    }),
    // GET /preds/{target}/validators/{stash}
    getPredictionValidator: builder.query({
      query: ({ target, stash }) => ({ url: `/preds/${target}/validators/${stash}` }),
      providesTags: (result, error, arg) => [
        { type: "PredictionValidators", id: `${arg.target}_${arg.stash}` },
      ],
    }),
    // GET /preds/{target}/nominators/{address}
    getPredictionNominator: builder.query({
      query: ({ target, address }) => ({
        url: `/preds/${target}/nominators/${address}`,
      }),
      providesTags: (result, error, arg) => [
        { type: "PredictionNominators", id: `${arg.target}_${arg.address}` },
      ],
    }),
    // GET /preds/{target}/validators/{stash}/nominators?page=&size=
    getPredictionValidatorNominators: builder.query({
      query: ({ target, stash, page, size }) => ({
        url: `/preds/${target}/validators/${stash}/nominators`,
        params: { page, size },
      }),
      providesTags: (result, error, arg) => [
        {
          type: "PredictionNominators",
          id: `${arg.target}_${arg.stash}_${arg.page}_${arg.size}`,
        },
      ],
    }),
  }),
});

export const {
  useGetPredictionsQuery,
  useGetPredictionByTargetQuery,
  useGetPredictionValidatorsQuery,
  useGetPredictionValidatorQuery,
  useGetPredictionValidatorNominatorsQuery,
  useGetPredictionNominatorQuery,
} = extendedApi;

// Normalizes the `preds` field of a validator, if it is sent by the backend
const upsertValidatorPreds = (state, validator) => {
  if (!validator?.address || !Array.isArray(validator.preds)) {
    return;
  }
  const entry = state.byValidator[validator.address] ?? {
    targets: [],
    data: {},
  };
  validator.preds.forEach(({ p, tts, nc, ts }) => {
    entry.data[p] = { tts, nc, ts };
  });
  // the same order as sent by the backend
  entry.targets = validator.preds.map((pred) => pred.p);
  state.byValidator[validator.address] = entry;
};

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => data.n,
  sortComparer: (a, b) => a.n - b.n,
});

const predictionsSlice = createSlice({
  name: "predictions",
  initialState: {
    // defaults to the on-chain active set size once it is known
    selected: undefined,
    // validators list by target
    validators: {},
    // validator summary/metadata by `${target}_${stash}`
    validator: {},
    // nominators page by `${target}_${stash}`
    nominators: {},
    // predictions normalized by validator address, from validators `preds` field:
    // { [address]: { targets: [600, 500, ...], data: { [target]: { tts, nc, ts } } } }
    byValidator: {},
    ...adapter.getInitialState(),
  },
  reducers: {
    predictionChanged: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.getPredictions.matchFulfilled,
        (state, action) => {
          console.log("getPredictions", action.payload);
          const preds = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.data || [];
          adapter.upsertMany(
            state,
            preds.map((p) => ({ ...p, _ts: +new Date() })),
          );
        },
      )
      .addMatcher(
        extendedApi.endpoints.getPredictionByTarget.matchFulfilled,
        (state, action) => {
          const { target } = action.meta.arg.originalArgs;
          adapter.upsertOne(state, {
            ...action.payload,
            n: Number(target),
            _ts: +new Date(),
          });
        },
      )
      .addMatcher(
        extendedApi.endpoints.getPredictionValidators.matchFulfilled,
        (state, action) => {
          const { target } = action.meta.arg.originalArgs;
          state.validators[target] = action.payload;
        },
      )
      .addMatcher(
        extendedApi.endpoints.getPredictionValidator.matchFulfilled,
        (state, action) => {
          const { target, stash } = action.meta.arg.originalArgs;
          state.validator[`${target}_${stash}`] = {
            ...action.payload,
            _ts: +new Date(),
          };
        },
      )
      .addMatcher(
        extendedApi.endpoints.getPredictionValidatorNominators.matchFulfilled,
        (state, action) => {
          const { target, stash, page } = action.meta.arg.originalArgs;
          const key = `${target}_${stash}`;
          if (isUndefined(state.nominators[key])) {
            state.nominators[key] = {};
          }
          state.nominators[key][page] = action.payload;
        },
      )
      .addMatcher(matchValidatorsReceived, (state, action) => {
        action.payload.data.forEach((v) => upsertValidatorPreds(state, v));
      })
      .addMatcher(matchValidatorReceived, (state, action) => {
        upsertValidatorPreds(state, action.payload);
      });
  },
});

// Actions
export const { predictionChanged } = predictionsSlice.actions;

// Selectors
export const {
  selectAll: selectPredictionsAll,
  selectById: selectPredictionByTarget,
} = adapter.getSelectors((state) => state.predictions);

export const selectPredictionsByValidator = (state) =>
  state.predictions.byValidator;

export const selectPredictionTargetsByAddress = (state, address) =>
  state.predictions.byValidator[address]?.targets;

export const selectPredictionByAddressAndTarget = (state, address, target) =>
  state.predictions.byValidator[address]?.data[target];

export const selectPredictionSelected = (state) => state.predictions.selected;

function createRows(
  id,
  identity,
  address,
  own_stake,
  nominators_stake,
  nominators_counter,
  own_stake_pred,
  nominators_stake_pred,
  nominators_counter_pred,
) {
  return {
    id,
    identity,
    address,
    own_stake,
    nominators_stake,
    nominators_counter,
    own_stake_pred,
    nominators_stake_pred,
    nominators_counter_pred,
  };
}


// Maps the validators nominated by a nominator, given by the response of the
// nominator endpoint, to the nomination: its state (active, waiting or inactive)
// and the stake allocated to the validator, only known if it is active
export const nominationsByValidator = (nominator) => {
  const nominations = {};
  const addressOf = (v) => v?.address ?? v;
  (nominator?.inactive_validators ?? []).forEach((v) => {
    nominations[addressOf(v)] = { state: "inactive" };
  });
  (nominator?.waiting_validators ?? []).forEach((v) => {
    nominations[addressOf(v)] = { state: "waiting" };
  });
  (nominator?.active_validators ?? []).forEach((v) => {
    nominations[addressOf(v)] = {
      state: "active",
      allocated_stake: v.allocated_stake,
    };
  });
  return nominations;
};

export const selectPredictionValidatorsByTarget = (
  state,
  target,
  identityFilter,
  subsetFilter,
  nominations = {},
) => {
  const chainInfo = selectChainInfo(state);
  const validators = state.predictions.validators[target] ?? [];
  // the grade is given by the performance of the validator in the latest session
  const currentSession = selectSessionCurrent(state);
  const gradeSession = Number.isInteger(currentSession)
    ? currentSession - 1
    : undefined;

  const rows = validators.map((x, i) => {
    const address = x.address;
    const profile = selectValProfileByAddress(state, address);
    const row = createRows(
      i + 1,
      profile?._identity ?? null,
      address,
      profile?.own_stake ?? null,
      profile?.nominators_stake ?? null,
      profile?.nominators_counter ?? null,
      x.own_stake,
      x.total_stake,
      x.nominators_counter,
    );
    return {
      ...row,
      grade:
        gradeSession !== undefined
          ? selectValidatorGradeBySessionAndAddress(state, gradeSession, address)
          : "-",
      nomination: nominations[address]?.state ?? null,
      allocated_stake: nominations[address]?.allocated_stake ?? null,
    };
  });

  const query = identityFilter?.trim().toLowerCase();
  if (!query) {
    return rows;
  }

  const filteredRows = rows.filter((v) => {
    if (!v.address) {
      return false;
    }
    return (
      !isNull(v.nomination) ||
      v.identity?.toLowerCase().includes(query) ||
      v.address.toLowerCase().includes(query) ||
      chainAddress(v.address, chainInfo.ss58Format)
        .toLowerCase()
        .includes(query)
    );
  });

  return filteredRows;

}


export const selectPredictionValidator = (state, target, stash) =>
  state.predictions.validator[`${target}_${stash}`];

export const selectPredictionNominators = (state, target, stash, page = 0) =>
  state.predictions.nominators[`${target}_${stash}`]?.[page];

export default predictionsSlice;
