import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  selectSessionCurrent,
  useGetSessionByIndexQuery,
} from "../features/api/sessionsSlice";
import { selectCollationStatsBySessionAndPid } from "../features/api/collationStatsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";

export default function CollationPointsBox({ paraId, name }) {
  const selectedChain = useSelector(selectChain);
  const currentSession = useSelector(selectSessionCurrent);
  const isReady = isCollationAvailable(selectedChain) && !isNaN(currentSession);

  useGetSessionByIndexQuery(
    { index: "current", collation_stats: true },
    { skip: !isReady },
  );
  const stats = useSelector((state) =>
    selectCollationStatsBySessionAndPid(state, currentSession, paraId),
  );
  const slot = useSelector((state) =>
    selectCollationSlotBySessionAndPid(state, currentSession, paraId),
  );

  if (!isReady || isUndefined(stats)) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 80,
        borderRadius: 3,
        bgcolor: (theme) => theme.palette.grey[300],
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box
        sx={{
          px: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          {name} collation points
        </Typography>
        <Typography variant="h6">
          {(stats.pt + (slot?.pt ?? 0)).format()}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ whiteSpace: "nowrap", lineHeight: 0.875 }}
        >
          {`since session ${stats.six.format()} started`}
        </Typography>
      </Box>
    </Paper>
  );
}
