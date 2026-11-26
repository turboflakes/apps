import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import InsightsGrid from "./InsightsGrid";
import ValGroupsGrid from "./ValGroupsGrid";
import CoresGrid from "./CoresGrid";
import ParachainsGrid from "./ParachainsGrid";
import ValWaitingSection from "./ValWaitingSection";
import ValPredictionSection from "./ValPredictionSection";
import CollatorsSection from "./CollatorsSection";
import CollatorsHistoryTimeline from "./CollatorsHistoryTimeline";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";
import ModeSwitch from "./ModeSwitch";
import HistoryErasToggle from "./HistoryErasToggle";
import SessionHistoryTimelineChart from "./SessionHistoryTimelineChart";
import { useGetValidatorsQuery } from "../features/api/validatorsSlice";

import {
  pageChanged,
  selectMode,
  selectCollatorsChain,
  selectIsHistoryMode,
  selectMaxHistorySessions,
} from "../features/layout/layoutSlice";

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

// NOTE: the position of each page is the index of its tab
const tabPages = [
  "insights",
  "collators",
  "parachains",
  "val-groups",
  "val-waiting",
  "staking-prediction",
];

export default function OverviewTabs({ sessionIndex, tab }) {
  // const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedChain = useSelector(selectChain);
  const selectedMode = useSelector(selectMode);
  const collatorsChain = useSelector(selectCollatorsChain);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const maxHistorySessions = useSelector(selectMaxHistorySessions);

  const { isSuccess, isFetching } = useGetValidatorsQuery(
    {
      session: sessionIndex,
      role: "para_authority",
      summary: true,
      profile: true,
      discovery: true,
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleChange = (event, newValue) => {
    dispatch(pageChanged(tabPages[newValue]));
    navigate(`/${tabPages[newValue]}`);
  };

  // NOTE: `isSuccess` is false for one render when `sessionIndex` changes (the
  // new request is not started yet), the content is only hidden until the
  // first success so that it is not unmounted (and its requests repeated)
  const hasLoaded = React.useRef(false);
  if (isSuccess) {
    hasLoaded.current = true;
  }
  if (!hasLoaded.current) {
    return null;
  }

  return (
    <Box sx={{}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          // borderBottom: 1, borderColor: 'divider'
        }}
      >
        <Tabs
          textColor="inherit"
          sx={{
            ".MuiTabs-indicator": { display: "none" },
            "& .Mui-selected": {
              bgcolor: "rgba(11, 19, 23, 0.08)",
              color: "#0B1317",
            },
          }}
          value={tab}
          onChange={handleChange}
          aria-label="Overview"
        >
          <Tab
            sx={{ my: 1, mr: 2, borderRadius: 3 }}
            label="Insights"
            value={0}
            {...a11yProps(0)}
            disableRipple
            disableFocusRipple
          />
          {isCollationAvailable(selectedChain) ? (
            <Tab
              sx={{ my: 1, mr: 2, borderRadius: 3 }}
              label="Collators"
              value={1}
              {...a11yProps(1)}
              disableRipple
              disableFocusRipple
            />
          ) : null}
          <Tab
            sx={{ my: 1, mr: 2, borderRadius: 3 }}
            label="Parachains"
            value={2}
            {...a11yProps(2)}
            disableRipple
            disableFocusRipple
          />
          <Tab
            sx={{ my: 1, mr: 2, borderRadius: 3 }}
            label="Val. Groups"
            value={3}
            {...a11yProps(3)}
            disableRipple
            disableFocusRipple
          />
          <Tab
            sx={{ my: 1, mr: 2, borderRadius: 3 }}
            label="Val. Waiting"
            value={4}
            {...a11yProps(4)}
            disableRipple
            disableFocusRipple
          />

          {selectedChain === "polkadot" ? (
            <Tab
              sx={{ my: 1, mr: 2, borderRadius: 3 }}
              label="Predictions"
              value={5}
              {...a11yProps(5)}
              disableRipple
              disableFocusRipple
            />
          ) : null}
          {/* <Tab sx={{ my:1,  borderRadius: 3 }} label="Cores" {...a11yProps(3)} disableRipple disableFocusRipple /> */}
        </Tabs>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isHistoryMode && tab >= 0 && tab <= 3 ? <HistoryErasToggle /> : null}
          {tab !== 4 && tab !== 5 ? <ModeSwitch mode={selectedMode} /> : null}
        </Box>

      </Box>

      {/* <Divider sx={{
        opacity: 0.25,
        height: '1px',
        borderTop: '0px solid rgba(0, 0, 0, 0.08)',
        borderBottom: 'none',
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
        }} /> */}

      {isHistoryMode && (tab === 0 || tab === 2 || tab === 3) ? (
        <Box sx={{ my: 2 }}>
          <SessionHistoryTimelineChart
            maxSessions={maxHistorySessions}
            selection={tab === 0 ? "range" : "session"}
            isFetching={isFetching}
          />
        </Box>
      ) : null}
      {isHistoryMode && tab === 1 ? (
        <Box sx={{ my: 2 }}>
          <CollatorsHistoryTimeline
            chainKey={collatorsChain}
            maxSessions={maxHistorySessions}
          />
        </Box>
      ) : null}
      {tab === 0 ? (
        <InsightsGrid />
      ) : tab === 1 ? (
        <CollatorsSection />
      ) : tab === 2 ? (
        <ParachainsGrid sessionIndex={sessionIndex} />
      ) : tab === 3 ? (
        <ValGroupsGrid sessionIndex={sessionIndex} />
      ) : tab === 4 ? (
        <ValWaitingSection />
      ) : tab === 5 ? (
        <ValPredictionSection />
      )
      : (
        <CoresGrid sessionIndex={sessionIndex} />
      )}
    </Box>
  );
}
