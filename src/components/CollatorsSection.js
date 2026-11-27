import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CollatorsDataGrid from "./CollatorsDataGrid";
import ChainToggle from "./ChainToggle";
import {
  useGetCollatorsQuery,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import {
  selectCollatorsChain,
  selectCollatorsHistoryRange,
  selectIsHistoryMode,
} from "../features/layout/layoutSlice";
import { isCollationAvailable } from "../constants";

const CHAIN_NAMES = { ah: "Asset Hub", pp: "People", bu: "Bulletin" };

export default function CollatorsSection() {
  const selectedChain = useSelector(selectChain);
  const skip = !isCollationAvailable(selectedChain);
  // shared with the overview, where the other chain is collapsed
  const chainKey = useSelector(selectCollatorsChain);

  // range of sessions selected in history mode
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const historyRange = useSelector((state) =>
    selectCollatorsHistoryRange(state, chainKey),
  );

  // latest session of the selected system chain
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );

  // the collators of the current session of each system chain (also
  // subscribes to the updates of each chain)
  useGetCollatorsQuery({ chain_key: "ah", stats: true, slot: true }, { skip });
  useGetCollatorsQuery({ chain_key: "pp", stats: true, slot: true }, { skip });
  useGetCollatorsQuery({ chain_key: "bu", stats: true, slot: true }, { skip });

  return (
    <Box sx={{ m: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">Collators</Typography>
          <Typography variant="subtitle">
            {isHistoryMode
              ? `${CHAIN_NAMES[chainKey]} collators ${
                  !historyRange
                    ? ""
                    : historyRange[0] === historyRange[1]
                      ? `in session ${historyRange[0].format()}`
                      : `accumulated in sessions ${historyRange[0].format()} to ${historyRange[1].format()}`
                }`.trim()
              : `${CHAIN_NAMES[chainKey]} collators in the current session ${summary?.session?.format() ?? ""}`.trim()}
          </Typography>
        </Box>
        <ChainToggle />
      </Box>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "1104px",
          borderRadius: 3,
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <CollatorsDataGrid chainKey={chainKey} />
      </Paper>
    </Box>
  );
}
