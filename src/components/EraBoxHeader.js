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

export default function EraBoxHeader({ dark }) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);

  const { isSuccess: isSessionSuccess, isFetching: isFetchingSession } =
    useGetSessionByIndexQuery({ index: currentSession });
  const session = useSelector((state) =>
    selectSessionByIndex(state, currentSession),
  );
  if (isFetchingSession || isUndefined(session)) {
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

  if (!isSessionSuccess) {
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
          {isSessionSuccess ? `${session.eix.format()}` : "-"}
        </Typography>
      </Box>
    </Box>
  );
}
