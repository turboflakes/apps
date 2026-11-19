import { createSlice, current } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import findLast from "lodash/findLast";
import {
  MAX_SYSTEM_CHAIN_BLOCKS,
  blocksAdapter,
  matchBlockReceived,
  matchBlocksReceived,
} from "./blocksSlice";

// NOTE: people chain blocks (chain_key "pp")
const blocksPPSlice = createSlice({
  name: "blocks_pp",
  initialState: blocksAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(matchBlockReceived, (state, action) => {
        const block = action.payload;
        if (block.chain_key !== "pp") {
          return;
        }
        // Only kept the last MAX_SYSTEM_CHAIN_BLOCKS blocks in the store
        let currentState = current(state);
        if (currentState.ids.length >= MAX_SYSTEM_CHAIN_BLOCKS) {
          blocksAdapter.removeOne(state, currentState.ids[0]);
        }
        blocksAdapter.upsertOne(state, {
          ...block,
          _ts: +new Date(),
          // time the best block was first received (kept when the block is
          // finalized later)
          ...(isUndefined(block.is_finalized)
            ? {
                _ts_best:
                  currentState.entities[block.block_number]?._ts_best ??
                  +new Date(),
              }
            : {}),
        });
      })
      .addMatcher(matchBlocksReceived, (state, action) => {
        const blocks = action.payload.data
          .filter((block) => block.chain_key === "pp")
          .map((block) => ({ ...block, _ts: +new Date() }));
        blocksAdapter.upsertMany(state, blocks);
      });
  },
});

export default blocksPPSlice;

// Selectors
export const { selectAll: selectAllBlocksPP } = blocksAdapter.getSelectors(
  (state) => state.blocks_pp,
);
const selectAll = selectAllBlocksPP;

export const selectFinalizedBlockPP = (state) =>
  findLast(
    selectAll(state),
    (block) => !isUndefined(block.is_finalized) && block.is_finalized,
  );
