import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import { useGetBlockQuery, selectBestBlock } from "../features/api/blocksSlice";
import { selectBestBlockAH } from "../features/api/blocksAHSlice";

export default function BestBlockBoxHeader({ dark }) {
  const theme = useTheme();
  const { isSuccess, isFetching } = useGetBlockQuery(
    { blockId: "best", chain_key: "rc" },
    { refetchOnMountOrArgChange: true },
  );
  const { isSuccess: isSuccessAH, isFetching: isFetchingAH } = useGetBlockQuery(
    {
      blockId: "best",
      chain_key: "ah",
    },
  );
  const best = useSelector(selectBestBlock);
  const bestAH = useSelector(selectBestBlockAH);

  if (isFetching || isFetchingAH || isUndefined(best) || isUndefined(bestAH)) {
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
          {isSuccessAH ? (
            <React.Fragment>
              {/* <Typography variant="caption1" sx={{ ml: -4, pr: 1 }}>
                AH
              </Typography> */}
              {`${bestAH.block_number.format()}`}
            </React.Fragment>
          ) : (
            "-"
          )}
        </Typography>
        <Typography variant="subtitle3">
          {isSuccess ? (
            <React.Fragment>
              {/* <Typography variant="caption1" sx={{ ml: -4, pr: 1 }}>
                RC
              </Typography> */}
              {`${best.block_number.format()}`}
            </React.Fragment>
          ) : (
            "-"
          )}
        </Typography>
      </Box>
    </Box>
  );
}
