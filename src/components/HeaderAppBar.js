import React from "react";
import { useSelector } from "react-redux";
import { useTheme, styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchSmall from "./SearchSmall";
import SessionPerformancePieChartHeader from "./SessionPerformancePieChartHeader";
import SessionPieChartHeader from "./SessionPieChartHeader";
import EraBoxHeader from "./EraBoxHeader";
import SessionBoxHeader from "./SessionBoxHeader";
import BestBlockBoxHeaderV0 from "./BestBlockBoxHeaderV0";
import BestBlockBoxHeaderV1 from "./BestBlockBoxHeaderV1";
import FinalizedBlockBoxHeaderV0 from "./FinalizedBlockBoxHeaderV0";
import FinalizedBlockBoxHeaderV1 from "./FinalizedBlockBoxHeaderV1";
import { getNetworkIcon, getNetworkName } from "../constants";
import { selectVersionV1 } from "../features/api/pkgSlice";
import { selectApp } from "../features/app/appSlice";
import { selectChain } from "../features/chain/chainSlice";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, leftopened, leftclosed }) => ({
  zIndex: theme.zIndex.drawer + 1,
  left: theme.spacing(7),
  width: `calc(100% - ${leftclosed}px)`,
  transition: theme.transitions.create(["width", "left"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    left: leftopened,
    width: `calc(100% - ${leftopened}px)`,
    transition: theme.transitions.create(["width", "left"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function HeaderAppBar({
  openLeftDrawer,
  leftDrawerWidth,
  leftDrawerWidthClosed,
}) {
  const theme = useTheme();
  const selectedApp = useSelector(selectApp);
  const selectedChain = useSelector(selectChain);
  const isVersionV1 = useSelector(selectVersionV1);

  return (
    <AppBar
      position="absolute"
      open={openLeftDrawer}
      leftopened={leftDrawerWidth}
      leftclosed={leftDrawerWidthClosed}
      color="transparent"
      elevation={0}
    >
      <Toolbar
        sx={{
          height: 72,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 1 / 2,
          // pr: '24px', // keep right padding when drawer closed
          bgcolor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(16px)",
        }}
        id="top-toolbar"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",

            // height: '100%'
          }}
        >
          {/* network logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={getNetworkIcon(selectedChain)}
              style={{ height: 24 }}
              alt={selectedChain}
            />
            <Typography
              variant="h6"
              sx={{
                ml: 1,
                color: theme.palette.text.primary,
                minWidth: 96,
                // fontSize: "0.875rem",
                // lineHeight: 0,
                // fontWeight: 600,
              }}
            >
              {getNetworkName(selectedChain).toUpperCase()}
            </Typography>
            {/* <Divider
              orientation="vertical"
              sx={{
                mx: 1,
                height: 24,
                bgcolor: theme.palette.text.primary,
                transform: "rotate(20deg)",
              }}
            />
            <Divider
              orientation="vertical"
              sx={{
                mr: 1,
                height: 24,
                bgcolor: theme.palette.text.primary,
                transform: "rotate(20deg)",
              }}
            />

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "0.875rem",
                lineHeight: 0,
                fontWeight: 600,
              }}
            >
              {selectedApp === "onet" ? `ONE-T` : null}
              {selectedApp === "nomi" ? `NOMI` : null}
            </Typography> */}
          </Box>

          {/* search validator */}
          {selectedApp === "onet" ? (
            <Box sx={{ ml: 4, flexGrow: 1, display: "flex" }}>
              <SearchSmall width={openLeftDrawer ? 384 : 320} />
            </Box>
          ) : null}
          <Box sx={{ ml: 1, flexGrow: 1, display: "flex" }}></Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* TODO: review CoreUsageHeader
                {!openLeftDrawer ? <CoreUsageHeader /> : null}
              */}
            <SessionPerformancePieChartHeader />
            <SessionPieChartHeader />
            <EraBoxHeader />
            <SessionBoxHeader />
            {isVersionV1 ? (
              <FinalizedBlockBoxHeaderV1 />
            ) : (
              <FinalizedBlockBoxHeaderV0 />
            )}
            {isVersionV1 ? <BestBlockBoxHeaderV1 /> : <BestBlockBoxHeaderV0 />}
          </Box>
          {/* mode switch live/history */}
          {/* { selectedPage !== 'dashboard' ? <ModeSwitch mode={selectedMode} /> : null } */}
        </Box>
        {/* { selectedPage !== 'dashboard' && isHistoryMode ?
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              {selectedPage !== 'validators/insights' ?
                <SessionSlider maxSessions={maxHistorySessions} /> : <SessionSliderRange />}
            </Box> : null} */}
      </Toolbar>
    </AppBar>
  );
}
