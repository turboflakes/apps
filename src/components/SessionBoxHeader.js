import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import {
  selectSessionByIndex,
  selectSessionCurrent,
  useGetSessionByIndexQuery,
} from "../features/api/sessionsSlice";
import {
  selectSessionByIndexAH,
  selectSessionCurrentIndexAH,
} from "../features/api/sessionsAHSlice";
import {
  selectSessionByIndexPP,
  selectSessionCurrentIndexPP,
} from "../features/api/sessionsPPSlice";

// Selectors of the current session index and of a session by chain
const SELECTORS = {
  rc: {
    current: selectSessionCurrent,
    byIndex: selectSessionByIndex,
  },
  ah: {
    current: selectSessionCurrentIndexAH,
    byIndex: selectSessionByIndexAH,
  },
  pp: {
    current: selectSessionCurrentIndexPP,
    byIndex: selectSessionByIndexPP,
  },
};

// Session of the relay chain (`rc`) or of a system chain (`ah` or `pp`)
export default function SessionBoxHeader({ dark, chain_key = "rc" }) {
  const theme = useTheme();
  const selectors = SELECTORS[chain_key];
  const currentSession = useSelector(selectors.current);
  const session = useSelector((state) =>
    selectors.byIndex(state, currentSession),
  );
  // the relay chain request has no `chain_key`
  useGetSessionByIndexQuery({
    index: currentSession,
    stats: true,
    ...(chain_key !== "rc" ? { chain_key } : {}),
  });
  const six = session?.six;

  if (isUndefined(six)) {
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
          session
        </Typography>
        <Typography
          variant="h6"
          color={
            dark ? theme.palette.text.secondary : theme.palette.text.primary
          }
        >
          {six.format()}
        </Typography>
      </Box>
    </Box>
  );
}
