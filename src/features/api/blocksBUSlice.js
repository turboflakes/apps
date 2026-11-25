import { createSlice, current } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import findLast from "lodash/findLast";
import {
  MAX_SYSTEM_CHAIN_BLOCKS,
  blocksAdapter,
  matchBlockReceived,
  matchBlocksReceived,
} from "./blocksSlice";

// NOTE: bulletin chain blocks (chain_key "bu")
const blocksBUSlice = createSlice({
  name: "blocks_bu",
  initialState: blocksAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(matchBlockReceived, (state, action) => {
        const block = action.payload;
        if (block.chain_key !== "bu") {
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
          .filter((block) => block.chain_key === "bu")
          .map((block) => ({ ...block, _ts: +new Date() }));
        blocksAdapter.upsertMany(state, blocks);
      });
  },
});

export default blocksBUSlice;

// Selectors
export const { selectAll: selectAllBlocksBU } = blocksAdapter.getSelectors(
  (state) => state.blocks_bu,
);
const selectAll = selectAllBlocksBU;

export const selectFinalizedBlockBU = (state) =>
  findLast(
    selectAll(state),
    (block) => !isUndefined(block.is_finalized) && block.is_finalized,
  );

export const selectBestBlockBU = (state) =>
  findLast(selectAll(state), (block) => isUndefined(block.is_finalized));
