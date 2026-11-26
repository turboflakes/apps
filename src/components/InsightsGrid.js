import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ValidatorsInsights from "./ValidatorsInsights";
import ValidatorsHistoryInsights from "./ValidatorsHistoryInsights";
import CommissionBox from "./CommissionBox";
import OwnStakeBox from "./OwnStakeBox";
import NodeVersionBox from "./NodeVersionBox";
// import SubsetFilter from "./SubsetFilter";
import GradesWithFilterBox from "./GradesWithFilterBox";
import {
  selectAddress,
  addressChanged,
  selectChain,
} from "../features/chain/chainSlice";
import {
  selectSessionHistory,
  selectSessionCurrent,
  selectSessionHistoryRangeIds,
} from "../features/api/sessionsSlice";
import {
  selectIsLiveMode,
  selectIsHistoryMode,
  selectInsightsColumnVisibilityModel,
} from "../features/layout/layoutSlice";
import { selectIsSocketConnected } from "../features/api/socketSlice";

export default function InsightsGrid() {
  // const theme = useTheme();
  const { stash } = useParams();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const historySessionRangeIds = useSelector(selectSessionHistoryRangeIds);
  const selectedChain = useSelector(selectChain);
  const columnVisibilityModel = useSelector(
    selectInsightsColumnVisibilityModel,
  );
  // the boxes follow the columns of the grids
  const isGradesBoxVisible = columnVisibilityModel.score !== false;
  const isVersionBoxVisible = columnVisibilityModel.node_version !== false;
  const isOwnStakeBoxVisible = columnVisibilityModel.own_stake !== false;
  const isCommissionBoxVisible =
    selectedChain !== "polkadot" && columnVisibilityModel.commission !== false;
  // the grid takes the full width if there is no box to show
  const hasBoxes =
    isGradesBoxVisible ||
    isVersionBoxVisible ||
    isOwnStakeBoxVisible ||
    isCommissionBoxVisible;
  const sessionIndex = isLiveMode
    ? currentSession
    : !!historySession
      ? historySession
      : currentSession;

  React.useEffect(() => {
    if (stash && stash !== selectedAddress) {
      dispatch(addressChanged(stash));
    }
  }, [stash, selectedAddress, dispatch]);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return <Box sx={{ m: 2, minHeight: "100vh" }}></Box>;
  }

  return (
    <Box sx={{ m: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">Validator Insights</Typography>
          <Typography variant="subtitle">
            {isLiveMode
              ? `Active validators in the current session ${sessionIndex?.format()}`
              : `Active validators between session ${historySessionRangeIds[0].format()} and ${historySessionRangeIds[historySessionRangeIds.length - 1].format()}`}
          </Typography>
        </Box>
        {/* TODO: Review subset filter */}
        {/* <SubsetFilter />*/}
      </Box>
      <Grid container spacing={2}>
        {isLiveMode ? (
          <Grid item xs={hasBoxes ? 10 : 12}>
            <ValidatorsInsights
              sessionIndex={sessionIndex}
              skip={isNaN(sessionIndex)}
            />
          </Grid>
        ) : null}
        {isHistoryMode ? (
          <Grid item xs={hasBoxes ? 10 : 12}>
            <ValidatorsHistoryInsights skip={isNaN(sessionIndex)} />
          </Grid>
        ) : null}
        {hasBoxes ? (
          <Grid item xs={2}>
            <Grid container spacing={2}>
              {isGradesBoxVisible ? (
                <Grid item xs={12}>
                  <GradesWithFilterBox
                    sessionIndex={sessionIndex}
                    isHistoryMode={isHistoryMode}
                  />
                </Grid>
              ) : null}
              {isVersionBoxVisible ? (
                <Grid item xs={12}>
                  <NodeVersionBox
                    sessionIndex={sessionIndex}
                    isHistoryMode={isHistoryMode}
                  />
                </Grid>
              ) : null}
              {isOwnStakeBoxVisible ? (
                <Grid item xs={12}>
                  <OwnStakeBox
                    sessionIndex={sessionIndex}
                    isHistoryMode={isHistoryMode}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                {isCommissionBoxVisible ? (
                  <CommissionBox
                    sessionIndex={sessionIndex}
                    isHistoryMode={isHistoryMode}
                  />
                ) : null}
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}
