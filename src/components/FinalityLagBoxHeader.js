import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import {
  useGetBlockQuery,
  selectBestBlock,
  selectFinalizedBlock,
} from "../features/api/blocksSlice";
import {
  selectBestBlockAH,
  selectFinalizedBlockAH,
} from "../features/api/blocksAHSlice";
import {
  selectBestBlockPP,
  selectFinalizedBlockPP,
} from "../features/api/blocksPPSlice";
import {
  selectBestBlockBU,
  selectFinalizedBlockBU,
} from "../features/api/blocksBUSlice";

const BEST_SELECTORS = {
  rc: selectBestBlock,
  ah: selectBestBlockAH,
  pp: selectBestBlockPP,
  bu: selectBestBlockBU,
};

const FINALIZED_SELECTORS = {
  rc: selectFinalizedBlock,
  ah: selectFinalizedBlockAH,
  pp: selectFinalizedBlockPP,
  bu: selectFinalizedBlockBU,
};

// Number of blocks between the best and the finalized block of a chain
export default function FinalityLagBoxHeader({ dark, chain_key = "rc" }) {
  const theme = useTheme();
  const chainParams = chain_key !== "rc" ? { chain_key } : {};
  const { isSuccess: isBestSuccess, isFetching: isBestFetching } =
    useGetBlockQuery(
      { blockId: "best", ...chainParams },
      { refetchOnMountOrArgChange: true },
    );
  const { isSuccess: isFinalizedSuccess, isFetching: isFinalizedFetching } =
    useGetBlockQuery(
      { blockId: "finalized", stats: true, ...chainParams },
      { refetchOnMountOrArgChange: true },
    );
  const best = useSelector(BEST_SELECTORS[chain_key]);
  const finalized = useSelector(FINALIZED_SELECTORS[chain_key]);

  if (
    isBestFetching ||
    isFinalizedFetching ||
    isUndefined(best) ||
    isUndefined(finalized)
  ) {
    return (
      <Skeleton
        variant="rounded"
        sx={{
          minWidth: 64,
          height: 8,
          bgcolor: theme.palette.grey[100],
          borderRadius: 3,
        }}
      />
    );
  }

  const lag = Math.max(0, best.block_number - finalized.block_number);

  return (
    <Box
      sx={{
        mx: 2,
        minWidth: 96,
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          mx: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          variant="caption1"
          color={dark ? theme.palette.text.secondary : "default"}
          sx={{ whiteSpace: "nowrap" }}
        >
          finality lag
        </Typography>
        <Typography
          variant="h6"
          color={
            dark ? theme.palette.text.secondary : theme.palette.text.primary
          }
        >
          {isBestSuccess && isFinalizedSuccess ? (
            <React.Fragment>{`${lag.format()}`}</React.Fragment>
          ) : (
            "-"
          )}
        </Typography>
      </Box>
    </Box>
  );
}
