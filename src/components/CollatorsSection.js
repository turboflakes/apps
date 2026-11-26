import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import CollatorsDataGrid from "./CollatorsDataGrid";
import {
  useGetCollatorsQuery,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import {
  selectCollatorsChain,
  collatorsChainChanged,
} from "../features/layout/layoutSlice";
import { isCollationAvailable } from "../constants";

const CHAIN_NAMES = { ah: "Asset Hub", pp: "People", bu: "Bulletin" };

export default function CollatorsSection() {
  const selectedChain = useSelector(selectChain);
  const skip = !isCollationAvailable(selectedChain);
  const dispatch = useDispatch();
  // shared with the overview, where the other chain is collapsed
  const chainKey = useSelector(selectCollatorsChain);

  // latest session of the selected system chain
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );

  // one of the chains is always selected
  const handleChainChange = (event, value) => {
    if (value !== null) {
      dispatch(collatorsChainChanged(value));
    }
  };

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
            {`${CHAIN_NAMES[chainKey]} collators in the current session ${summary?.session?.format() ?? ""}`.trim()}
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={chainKey}
          size="small"
          exclusive
          onChange={handleChainChange}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ToggleButton
            value="ah"
            aria-label="Asset Hub"
            disableRipple
            disableFocusRipple
            sx={{
              px: 2,
              mr: 1,
              border: 0,
              "&.Mui-selected": { borderRadius: 16 },
              "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
                borderRadius: 16,
              },
            }}
          >
            Asset Hub
            <FontAwesomeIcon icon={faLink} style={{ marginLeft: 8 }} />
          </ToggleButton>
          <ToggleButton
            value="pp"
            aria-label="People"
            disableRipple
            disableFocusRipple
            sx={{
              px: 2,
              mr: 1,
              border: 0,
              "&.Mui-selected": { borderRadius: 16 },
              "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                borderRadius: 16,
              },
              "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
                borderRadius: 16,
              },
            }}
          >
            People
            <FontAwesomeIcon icon={faLink} style={{ marginLeft: 8 }} />
          </ToggleButton>
          <ToggleButton
            value="bu"
            aria-label="Bulletin"
            disableRipple
            disableFocusRipple
            sx={{
              px: 2,
              border: 0,
              "&.Mui-selected": { borderRadius: 16 },
              "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                borderRadius: 16,
              },
            }}
          >
            Bulletin
            <FontAwesomeIcon icon={faLink} style={{ marginLeft: 8 }} />
          </ToggleButton>
        </ToggleButtonGroup>
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
