import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import SessionPerformance600Timeline from "./SessionPerformance600Timeline";
import NetTotalStakedBox from "./NetTotalStakedBox";
import NetLastRewardBox from "./NetLastRewardBox";
import HistoryErasMenu from "./HistoryErasMenu";
import ValidatorsRankingBox from "./ValidatorsRankingBox";
import PoolsValidatorsRankingBox from "./PoolsValidatorsRankingBox";
import NetVerticalTabs from "./NetVerticalTabs";
import GradesBox from "./GradesBox";
import NetPoolHistoryBox from "./NetPoolHistoryBox";
import onetSVG from "../assets/onet.svg";
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectMaxHistorySessions } from "../features/layout/layoutSlice";
import { selectIsSocketConnected } from "../features/api/socketSlice";
import { selectChain } from "../features/chain/chainSlice";
import { getNetworkName, getNetworkURL } from "../constants";

const SKILLS = [
  "explorer",
  "indexer",
  "reporter",
  "nominator",
  "matrix",
  "rust",
];

export default function DashboardPage() {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const selectedChain = useSelector(selectChain);
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const currentSession = useSelector(selectSessionCurrent);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (index === SKILLS.length - 1) {
        setIndex(0);
      }
      setIndex((index) => index + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [index]);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return <Box sx={{ m: 2, minHeight: "100vh" }}></Box>;
  }

  return (
    <Box sx={{ mb: 10, display: "flex", justifyContent: "center" }}>
      <Container>
        <Grid container spacing={2}>
          <Grid sx={{ mt: 18 }} item xs={7}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Box
                sx={{
                  minHeight: 288,
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      // ml: -20,
                      mt: -4,
                      width: 144,
                      height: 144,
                      position: "relative",
                      // boxShadow: 'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                      // boxShadow: 'rgba(240, 46, 170, 0.4) 5px 5px, rgba(240, 46, 170, 0.3) 10px 10px, rgba(240, 46, 170, 0.2) 15px 15px, rgba(240, 46, 170, 0.1) 20px 20px, rgba(240, 46, 170, 0.05) 25px 25px;',
                      // boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
                      // boxShadow: 'rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset',
                      zIndex: 30,
                      "&:before": {
                        content: '" "',
                        display: "block",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        // opacity: 0.8,
                        backgroundImage: `url(${onetSVG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "50% 50%",
                        backgroundSize: "144px 144px",
                      },
                    }}
                  ></Box>
                  <Box sx={{ width: 544, ml: 2 }}>
                    <Typography component="h1" variant="h3" align="left">
                      <Typography
                        component="div"
                        variant="h5"
                        sx={{ fontWeight: 400 }}
                      >
                        Substrate Blockchain Analytics
                      </Typography>
                      {`ONE-T // ${SKILLS[index]} bot`}
                      <Typography component="div" variant="subtitle">
                        by Turboflakes
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ my: 4 }} variant="subtitle1" align="left">
                  Monitor and explore the{" "}
                  <Link
                    sx={{
                      fontWeight: 600,
                      textDecoration: "underline",
                      textDecorationThickness: 4,
                      textDecorationColor:
                        selectedChain === "polkadot"
                          ? theme.palette.polkadot
                          : theme.palette.background.secondary,
                      "&:hover": {
                        textDecorationThickness: 5,
                      },
                    }}
                    href={getNetworkURL(selectedChain)}
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    {getNetworkName(selectedChain)}
                  </Link>{" "}
                  network — search for your favourite Validators or Nomination
                  Pools and visualize historic or realtime blockchain data
                  analytics
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid sx={{ mt: 8 }} item xs={5}>
            <GradesBox sessionIndex={currentSession} size="lg" />
          </Grid>

          <Grid item xs={12} sx={{ my: 2 }}>
            <SessionPerformance600Timeline
              sessionIndex={currentSession}
              skip={isNaN(currentSession)}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    mb: -1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ ml: 2, mb: 0 }} variant="h6">
                    Staking
                  </Typography>
                  <Box>
                    <HistoryErasMenu />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <NetTotalStakedBox
                      sessionIndex={currentSession}
                      maxSessions={maxHistorySessions}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <NetLastRewardBox
                      sessionIndex={currentSession}
                      maxSessions={maxHistorySessions}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <NetVerticalTabs
                      sessionIndex={currentSession}
                      maxSessions={maxHistorySessions}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={4}>
                <ValidatorsRankingBox
                  sessionIndex={currentSession}
                  maxSessions={maxHistorySessions}
                  skip={isNaN(currentSession)}
                />
              </Grid>
            </Grid>
          </Grid>

          {selectedChain !== "paseo" ? (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ ml: 2 }} variant="h6">
                    Nomination Pools
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <PoolsValidatorsRankingBox
                    sessionIndex={currentSession}
                    maxSessions={maxHistorySessions}
                    skip={isNaN(currentSession)}
                  />
                </Grid>
                <Grid item xs={8}>
                  <NetPoolHistoryBox
                    sessionIndex={currentSession}
                    skip={isNaN(currentSession)}
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
}
