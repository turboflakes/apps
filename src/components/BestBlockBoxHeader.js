import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import { useGetBlockQuery, selectBestBlock } from "../features/api/blocksSlice";
import { selectBestBlockAH } from "../features/api/blocksAHSlice";
import { selectBestBlockPP } from "../features/api/blocksPPSlice";

const SELECTORS = {
  rc: selectBestBlock,
  ah: selectBestBlockAH,
  pp: selectBestBlockPP,
};

export default function BestBlockBoxHeader({ dark, chain_key = "rc" }) {
  const theme = useTheme();
  const { isSuccess, isFetching } = useGetBlockQuery(
    { blockId: "best",  ...(chain_key !== "rc" ? { chain_key } : {}), },
    { refetchOnMountOrArgChange: true },
  );
  const best = useSelector(SELECTORS[chain_key]);

  if (isFetching || isUndefined(best)) {
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
        >
          best block
        </Typography>
        <Typography
          variant="h6"
          color={
            dark ? theme.palette.text.secondary : theme.palette.text.primary
          }
        >
          {isSuccess ? (
            <React.Fragment>{`${best.block_number.format()}`}</React.Fragment>
          ) : (
            "-"
          )}
        </Typography>
      </Box>
    </Box>
  );
}
