import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { selectCollatorsSummaryLatest } from "../features/api/collatorsSlice";
import { selectCollationStatsBySessionAndPid } from "../features/api/collationStatsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import {
  selectSessionByIndexAH,
  selectEraPreviousPointsBySessionAH,
  selectEraPreviousBlocksBySessionAH,
} from "../features/api/sessionsAHSlice";
import {
  selectSessionByIndexPP,
  selectEraPreviousPointsBySessionPP,
  selectEraPreviousBlocksBySessionPP,
} from "../features/api/sessionsPPSlice";
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";
import CollationEmptyBox from "./CollationEmptyBox";

const selectSessionByIndex = {
  ah: selectSessionByIndexAH,
  pp: selectSessionByIndexPP,
};

const selectPreviousPoints = {
  ah: selectEraPreviousPointsBySessionAH,
  pp: selectEraPreviousPointsBySessionPP,
};

const selectPreviousBlocks = {
  ah: selectEraPreviousBlocksBySessionAH,
  pp: selectEraPreviousBlocksBySessionPP,
};

// Collation points of the system chain (`chainKey`) since its era started: the
// previous sessions of the era plus the latest session (and its open slot)
export default function CollationEraPointsBox({ chainKey, name }) {
  const selectedChain = useSelector(selectChain);
  const isReady = isCollationAvailable(selectedChain);

  // latest session of the system chain (not the relay chain session)
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );
  const stats = useSelector((state) =>
    selectCollationStatsBySessionAndPid(
      state,
      summary?.session,
      summary?.para_id,
      chainKey,
    ),
  );
  // open slot of the chain, tied to the current relay session
  const currentSession = useSelector(selectSessionCurrent);
  const slot = useSelector((state) =>
    selectCollationSlotBySessionAndPid(
      state,
      currentSession,
      summary?.para_id,
    ),
  );
  const previousPoints = useSelector((state) =>
    selectPreviousPoints[chainKey]?.(state, summary?.session),
  );

  const previousBlocks = useSelector((state) =>
    selectPreviousBlocks[chainKey]?.(state, summary?.session),
  );

  // era of the latest session of the system chain
  const era = useSelector(
    (state) => selectSessionByIndex[chainKey]?.(state, summary?.session)?.eix,
  );

  if (
    !isReady ||
    isUndefined(stats) || isUndefined(previousPoints) ||
    isUndefined(previousBlocks)
  ) {
    return <CollationEmptyBox />;
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
        bgcolor: (theme) => theme.palette.background.secondary,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box
        sx={{
          px: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: "nowrap" }}>
          {name} era collation points
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {(previousPoints + stats.pt + (slot?.pt ?? 0)).format()}
        </Typography>
        <Typography
          variant="subtitle2" color="textSecondary"
          sx={{ whiteSpace: "nowrap", lineHeight: 0.875 }}
        >
          {`from ${(previousBlocks + stats.pb + (slot?.pb ?? 0)).format()} blocks since era ${era?.format() ?? "-"} started`}
        </Typography>
      </Box>
    </Paper>
  );
}
