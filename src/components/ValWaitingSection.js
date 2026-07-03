import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ValidatorsWaitingBox from "./ValidatorsWaitingBox";
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
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectIsSocketConnected } from "../features/api/socketSlice";
import { useGetValidatorsQuery } from "../features/api/validatorsSlice";

export default function ValWaitingSection() {
  // const theme = useTheme();
  const { stash } = useParams();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const currentSession = useSelector(selectSessionCurrent);
  const selectedChain = useSelector(selectChain);
  const sessionIndex = currentSession - 1;
  const { isSuccess } = useGetValidatorsQuery(
    {
      session: sessionIndex,
      role: "waiting",
      show_profile: true,
    },
    { refetchOnMountOrArgChange: true },
  );

  React.useEffect(() => {
    if (stash && stash !== selectedAddress) {
      dispatch(addressChanged(stash));
    }
  }, [dispatch, stash, selectedAddress]);

  if (!isSocketConnected || !isSuccess) {
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
          <Typography variant="h4">Waiting Validators</Typography>
          <Typography variant="subtitle">
            {`Waiting validators at the end of the previous session ${sessionIndex?.format()}`}
          </Typography>
        </Box>
        {/* TODO: Review subset filter */}
        {/* <SubsetFilter />*/}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <ValidatorsWaitingBox
            sessionIndex={sessionIndex}
            skip={isNaN(sessionIndex)}
          />
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <GradesWithFilterBox
                sessionIndex={sessionIndex}
                isHistoryMode={false}
              />
            </Grid>
            <Grid item xs={12}>
              <NodeVersionBox
                sessionIndex={sessionIndex}
                isHistoryMode={false}
              />
            </Grid>
            <Grid item xs={12}>
              <OwnStakeBox sessionIndex={sessionIndex} isHistoryMode={false} />
            </Grid>
            <Grid item xs={12}>
              {selectedChain !== "polkadot" ? (
                <CommissionBox
                  sessionIndex={sessionIndex}
                  isHistoryMode={false}
                />
              ) : null}
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
