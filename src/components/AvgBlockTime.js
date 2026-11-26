import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import {
  useGetBlockQuery,
  selectAll as selectAllBlocksRC,
} from "../features/api/blocksSlice";
import { selectAll as selectAllBlocksAH } from "../features/api/blocksAHSlice";
import { selectAllBlocksPP } from "../features/api/blocksPPSlice";
import { selectAllBlocksBU } from "../features/api/blocksBUSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";

const selectors = {
  rc: selectAllBlocksRC,
  ah: selectAllBlocksAH,
  pp: selectAllBlocksPP,
  bu: selectAllBlocksBU,
};

// Number of the latest blocks considered for the average. NOTE: the relay
// chain also receives the block of the previous session (same index) and its
// time of arrival is not related to the other blocks.
const WINDOW_BLOCKS = 50;

// Average block time of a chain (`rc`, `ah` or `pp`), from the time (`_ts_best`)
// the best blocks were received. It is the time between the first and the last
// block of the window over the number of blocks between them (the blocks are
// not necessarily received one by one).
export function useAvgBlockTime(chain_key = "rc") {
  const selectedChain = useSelector(selectChain);
  // the system chains are only available where collation is available
  const isReady = chain_key === "rc" || isCollationAvailable(selectedChain);

  useGetBlockQuery(
    { blockId: "best", ...(chain_key !== "rc" ? { chain_key } : {}) },
    { skip: !isReady },
  );
  const blocks = useSelector(selectors[chain_key]);
  const avgBlockTime = React.useMemo(() => {
    const sorted = blocks
      .filter((b) => !isUndefined(b._ts_best))
      .sort((a, b) => a.block_number - b.block_number);
    if (!sorted.length) {
      return undefined;
    }
    const last = sorted[sorted.length - 1];
    const window = sorted.filter(
      (b) => b.block_number > last.block_number - WINDOW_BLOCKS,
    );
    if (window.length < 2) {
      return undefined;
    }
    const first = window[0];
    const n = last.block_number - first.block_number;
    return n > 0 ? (last._ts_best - first._ts_best) / 1000 / n : undefined;
  }, [blocks]);

  return isReady ? avgBlockTime : undefined;
}

export default function AvgBlockTime({ chainKey = "rc" }) {
  const avgBlockTime = useAvgBlockTime(chainKey);

  if (isUndefined(avgBlockTime)) {
    return null;
  }

  return <>{`${avgBlockTime.toFixed(3)}s`}</>;
}
