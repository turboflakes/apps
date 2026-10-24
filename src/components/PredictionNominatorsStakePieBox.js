import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isNil from "lodash/isNil";
import PredictionPieBox from "./PredictionPieBox";
import {
  useGetPredictionByTargetQuery,
  selectPredictionByTarget,
} from "../features/api/predictionsSlice";
import { selectChainInfo } from "../features/chain/chainSlice";
import { stakeDisplayMillions } from "../util/display";

export default function PredictionNominatorsStakePieBox({ target }) {
  const theme = useTheme();
  const { isFetching } = useGetPredictionByTargetQuery({ target });
  const prediction = useSelector((state) =>
    selectPredictionByTarget(state, target),
  );
  const chainInfo = useSelector(selectChainInfo);

  const nominators = prediction?.nominators;
  const isLoading =
    (isFetching && isNil(prediction)) || isNil(nominators?.total_stake);

  const total = Number(nominators?.total_stake ?? 0);
  const active = Number(nominators?.active_stake ?? 0);
  const idle = Number(nominators?.idle_stake ?? 0);

  return (
    <PredictionPieBox
      isLoading={isLoading}
      label="nominators active stake"
      value={stakeDisplayMillions(nominators?.active_stake, chainInfo)}
      subtitle={`${stakeDisplayMillions(idle, chainInfo)} idle of ${stakeDisplayMillions(total, chainInfo)} total`}
      slices={[
        {
          name: "Active",
          value: active,
          display: stakeDisplayMillions(active, chainInfo),
          color: theme.palette.semantics.green,
        },
        {
          name: "Idle",
          value: idle,
          display: stakeDisplayMillions(idle, chainInfo),
          color: theme.palette.grey[900],
        },
      ]}
    />
  );
}
