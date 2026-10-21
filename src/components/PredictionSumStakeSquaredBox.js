import * as React from "react";
import { useSelector } from "react-redux";
import isNil from "lodash/isNil";
import PredictionStatBox from "./PredictionStatBox";
import {
  useGetPredictionByTargetQuery,
  selectPredictionByTarget,
} from "../features/api/predictionsSlice";
import { selectChainInfo } from "../features/chain/chainSlice";
import { stakeDisplayMillions } from "../util/display";

export default function PredictionSumStakeSquaredBox({ target }) {
  const { isFetching } = useGetPredictionByTargetQuery({ target });
  const prediction = useSelector((state) =>
    selectPredictionByTarget(state, target),
  );

  const chainInfo = useSelector(selectChainInfo);

  const raw = prediction?.solution_score?.sum_stake_squared;
  const value = isNil(raw)
    ? null
    : stakeDisplayMillions(raw, chainInfo, 2);

  return (
    <PredictionStatBox
      label="sum stake squared"
      value={value}
      isFetching={isFetching && isNil(prediction)}
    />
  );
}
