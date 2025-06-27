import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import { useGetBlockQuery, selectBestBlock } from "../features/api/blocksSlice";

export default function BestBlockBoxHeaderV0({ dark }) {
  const theme = useTheme();
  const { isSuccess, isFetching } = useGetBlockQuery(
    { blockId: "best" },
    { refetchOnMountOrArgChange: true },
  );
  const best = useSelector(selectBestBlock);

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
