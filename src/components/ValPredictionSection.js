import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import isUndefined from "lodash/isUndefined";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ValidatorsPredictionBox from "./ValidatorsPredictionBox";
import PredictionTargetFilter from "./PredictionTargetFilter";
import OwnStakeBoxPred from "./OwnStakeBoxPred";
import NodeVersionBoxPred from "./NodeVersionBoxPred";
import GradesWithFilterBoxPred from "./GradesWithFilterBoxPred";
import PredictionRoundBox from "./PredictionRoundBox";
import PredictionBlockBox from "./PredictionBlockBox";
import PredictionMinimalStakeBox from "./PredictionMinimalStakeBox";
import PredictionSumStakeBox from "./PredictionSumStakeBox";
import PredictionSumStakeSquaredBox from "./PredictionSumStakeSquaredBox";
import {
  selectAddress,
  addressChanged,
} from "../features/chain/chainSlice";
import {
  useGetPredictionByTargetQuery,
  useGetPredictionValidatorsQuery,
  selectPredictionSelected,
  predictionChanged,
} from "../features/api/predictionsSlice";
import {
  useGetBlockQuery,
  selectFinalizedBlock,
} from "../features/api/blocksSlice";
import { selectIsSocketConnected } from "../features/api/socketSlice";
// import { useGetValidatorsQuery } from "../features/api/validatorsSlice";

export default function ValPredictioneSection() {
  // const theme = useTheme();
  const { stash } = useParams();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const predictionTarget = useSelector(selectPredictionSelected);
  useGetBlockQuery({ blockId: "finalized", chain_key: "rc", show_stats: true });
  const activeSetSize = useSelector(
    (state) => selectFinalizedBlock(state)?.stats?.na,
  );
  const skip = isUndefined(predictionTarget);
  const { isSuccess: isSessionSuccess } = useGetPredictionByTargetQuery(
    { target: predictionTarget },
    { skip },
  );

  const { isSuccess } = useGetPredictionValidatorsQuery(
    {
      target: predictionTarget,
      show_profile: true,
    },
    { refetchOnMountOrArgChange: true, skip },
  );

  // default to the on-chain active set until the user picks another target
  React.useEffect(() => {
    if (isUndefined(predictionTarget) && !isUndefined(activeSetSize)) {
      dispatch(predictionChanged(activeSetSize));
    }
  }, [dispatch, predictionTarget, activeSetSize]);

  React.useEffect(() => {
    if (stash && stash !== selectedAddress) {
      dispatch(addressChanged(stash));
    }
  }, [dispatch, stash, selectedAddress]);

  if (skip || !isSocketConnected || !isSuccess || !isSessionSuccess) {
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
          <Typography variant="h4">Staking Miner Prediction</Typography>
          <Typography variant="subtitle">
            {`Prediction for a validator set of ${predictionTarget}`}
          </Typography>
        </Box>
        <PredictionTargetFilter />
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={2}>
          <PredictionRoundBox target={predictionTarget} />
        </Grid>
        <Grid item xs={2}>
          <PredictionBlockBox target={predictionTarget} />
        </Grid>
        <Grid item xs={2}>
          <PredictionMinimalStakeBox target={predictionTarget} />
        </Grid>
        <Grid item xs={2}>
          <PredictionSumStakeBox target={predictionTarget} />
        </Grid>
        <Grid item xs>
          <PredictionSumStakeSquaredBox target={predictionTarget} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <ValidatorsPredictionBox target={predictionTarget} />
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <GradesWithFilterBoxPred target={predictionTarget} />
            </Grid>
            <Grid item xs={12}>
              <OwnStakeBoxPred target={predictionTarget} />
            </Grid>
            <Grid item xs={12}>
              <NodeVersionBoxPred target={predictionTarget} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
