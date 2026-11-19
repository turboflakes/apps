import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import {
  useGetSessionByIndexQuery,
  selectSessionByIndex,
  selectSessionCurrent,
} from "../features/api/sessionsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";

export default function EraBoxHeader({ dark }) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const selectedChain = useSelector(selectChain);

  const { isSuccess, isFetching } =
    useGetSessionByIndexQuery({
      index: currentSession,
      stats: true,
      // collation stats are only requested where collation is available
      collation_stats: isCollationAvailable(selectedChain) ? true : undefined,
    });
  const session = useSelector((state) =>
    selectSessionByIndex(state, currentSession),
  );
  if (isFetching || isUndefined(session)) {
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

  if (!isSuccess) {
    return null;
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
          era
        </Typography>
        <Typography
          variant="h6"
          color={
            dark ? theme.palette.text.secondary : theme.palette.text.primary
          }
        >
          {isSuccess ? `${session.eix.format()}` : "-"}
        </Typography>
      </Box>
    </Box>
  );
}
