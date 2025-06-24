import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import {
  selectSessionCurrent,
  selectCoreIdsBySession,
} from "../features/api/sessionsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { getTotalCores } from "../constants";

const TOTAL_BARS = 10;

function CoreBar({ highlight }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: theme.spacing(1 / 4),
        height: theme.spacing(2),
        bgcolor: highlight ? "rgb(11, 19, 23)" : "#EEEEEE",
        mr: "2px",
      }}
    ></Box>
  );
}

export default function CoreUsageHeader() {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const currentSession = useSelector(selectSessionCurrent);
  const coreIds = useSelector((state) =>
    selectCoreIdsBySession(state, currentSession),
  );

  if (isUndefined(selectedChain)) {
    return null;
  }

  const usage = (coreIds.length / getTotalCores(selectedChain)) * 100;
  const usage_bars = Math.round((TOTAL_BARS * usage) / 100);

  return (
    <Box
      sx={{
        mx: 1,
        display: "flex",
        alignItems: "center",
        width: 224,
      }}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            minWidth: "64px",
            marginRight: theme.spacing(1),
          }}
        >
          {[...Array(TOTAL_BARS).keys()].map((i) => (
            <CoreBar key={i} highlight={i > TOTAL_BARS - usage_bars - 1} />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          mx: 1,
          width: "60%",
          display: "flex",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="caption1">cores usage</Typography>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6">
              {!isUndefined(usage) ? `${Math.round(usage)}%` : "-"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
