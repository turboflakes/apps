import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectCollationStatsBySessionAndPid } from "../features/api/collationStatsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";
import CollationEmptyBox from "./CollationEmptyBox";

// Blocks of the latest session of the system chain (`chainKey`)
export default function CollationBlocksBox({ chainKey, name }) {
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

  if (!isReady || isUndefined(stats)) {
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
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          {name} authored blocks
        </Typography>
        <Typography variant="h6">
          {(stats.pb + (slot?.pb ?? 0)).format()}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ whiteSpace: "nowrap", lineHeight: 0.875 }}
        >
          {!isUndefined(slot) ? `last #${slot.bix.format()}` : "-"}
        </Typography>
      </Box>
    </Paper>
  );
}
