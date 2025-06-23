import { createSlice, current } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import findLast from "lodash/findLast";
import { selectSessionByIndex } from "./sessionsSlice";
import {
  blocksAdapter,
  matchBlockReceived,
  matchBlocksReceived,
} from "./blocksSlice";

const blocksAHSlice = createSlice({
  name: "blocks_ah",
  initialState: blocksAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(matchBlockReceived, (state, action) => {
        // Only kept the last 1000 blocks in the store
        let currentState = current(state);
        if (currentState.ids.length >= 1000) {
          blocksAdapter.removeOne(state, currentState.ids[0]);
        }
        const block = action.payload;

        // NOTE: Only map asset-hub blocks
        if (block.chain_key !== "ah") {
          return;
        }

        blocksAdapter.upsertOne(state, {
          ...action.payload,
          _ts: +new Date(),
        });
      })
      .addMatcher(matchBlocksReceived, (state, action) => {
        // NOTE: filter out non-asset-hub blocks
        const blocks = action.payload.data
          .filter((block) => block.chain_key === "ah")
          .map((block, i) => {
            return {
              ...block,
              _ts: +new Date(),
            };
          });
        blocksAdapter.upsertMany(state, blocks);
      });
  },
});

export default blocksAHSlice;

// Selectors
export const { selectAll, selectById: selectBlockById } =
  blocksAdapter.getSelectors((state) => state.blocks_ah);

export const selectBlockAH = (state) =>
  !!state.blocks_ah.ids.length
    ? state.blocks_ah.entities[
        state.blocks_ah.ids[state.blocks_ah.ids.length - 1]
      ]
    : undefined;

export const selectBestBlockAH = (state) => {
  if (!!state.blocks_ah.ids.length) {
    const block = findLast(selectAll(state), (block) =>
      isUndefined(block.is_finalized),
    );
    if (!isUndefined(block)) {
      return block;
    }
  }
};

export const selectFinalizedBlockAH = (state) => {
  console.log("__state.blocks_ah", state.blocks_ah);
  if (!!state.blocks_ah.ids.length) {
    const block = findLast(
      selectAll(state),
      (block) => !isUndefined(block.is_finalized) && block.is_finalized,
    );
    if (!isUndefined(block)) {
      return block;
    }
  }
};

export const selectPreviousFinalizedBlockAH = (state) => {
  const finalized = selectFinalizedBlockAH(state);
  if (!isUndefined(finalized)) {
    return selectBlockById(state, finalized.block_number - 1);
  }
};

export const selectBlocksBySessionAH = (state, sessionIndex) => {
  const session = selectSessionByIndex(state, sessionIndex);
  if (!isUndefined(session)) {
    return selectAll(state).filter(
      (b) => b.is_finalized && b.block_number >= session.sbix,
    );
  }
  return [];
};

export const selectLastXBlocks = (state, x = 600) => {
  // const finalizedBlocks = selectAll(state).filter(b => b.is_finalized && !isUndefined(b.stats) ? b.stats.ev + b.stats.iv + b.stats.mv !== 0 : false)
  //
  const finalizedBlocks = selectAll(state);
  return finalizedBlocks.slice(Math.max(finalizedBlocks.length - x, 1));
};
