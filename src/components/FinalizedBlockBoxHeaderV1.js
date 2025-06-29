import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import {
  useGetBlockQuery,
  selectFinalizedBlock,
} from "../features/api/blocksSlice";
import { selectFinalizedBlockAH } from "../features/api/blocksAHSlice";

export default function FinalizedBlockBoxHeaderV1({ dark }) {
  const theme = useTheme();
  const { isSuccess, isFetching } = useGetBlockQuery(
    { blockId: "finalized", chain_key: "rc", show_stats: true },
    { refetchOnMountOrArgChange: true },
  );
  const { isSuccess: isSuccessAH, isFetching: isFetchingAH } = useGetBlockQuery(
    {
      blockId: "finalized",
      chain_key: "ah",
    },
  );

  const finalized = useSelector(selectFinalizedBlock);
  const finalizedAH = useSelector(selectFinalizedBlockAH);

  if (
    isFetching ||
    isFetchingAH ||
    isUndefined(finalized) ||
    isUndefined(finalizedAH)
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
          ml: 4,
          // mr: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          variant="caption1"
          color={dark ? theme.palette.text.secondary : "default"}
        >
          finalized block
        </Typography>
        <Typography
          variant="h6"
          color={
            dark ? theme.palette.text.secondary : theme.palette.text.primary
          }
        >
          {isSuccessAH ? (
            <React.Fragment>
              <Typography
                variant="caption1"
                sx={{ ml: -3, pr: 1, lineHeight: 0 }}
              >
                AH
              </Typography>
              {`${finalizedAH.block_number.format()}`}
            </React.Fragment>
          ) : (
            "-"
          )}
        </Typography>
        <Typography variant="subtitle3">
          {isSuccess ? (
            <React.Fragment>
              <Typography
                variant="caption1"
                sx={{ ml: -3, pr: 1, lineHeight: 0 }}
              >
                RC
              </Typography>
              {`${finalized.block_number.format()}`}
            </React.Fragment>
          ) : (
            "-"
          )}
        </Typography>
      </Box>
    </Box>
  );
}
