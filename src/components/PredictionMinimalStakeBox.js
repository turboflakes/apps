import * as React from "react";
import { useSelector } from "react-redux";
import isNil from "lodash/isNil";
import PredictionStatBox from "./PredictionStatBox";
import {
  useGetPredictionByTargetQuery,
  selectPredictionByTarget,
  selectPredictionValidatorsByTarget,
} from "../features/api/predictionsSlice";
import { selectChainInfo } from "../features/chain/chainSlice";
import { stakeDisplayMillions } from "../util/display";

export default function PredictionMinimalStakeBox({ target }) {
  const { isFetching } = useGetPredictionByTargetQuery({ target });
  const prediction = useSelector((state) =>
    selectPredictionByTarget(state, target),
  );
  const chainInfo = useSelector(selectChainInfo);

  const averageStake = useSelector((state) => {
    const stakes = selectPredictionValidatorsByTarget(state, target, "", "")
      .filter((v) => !isNil(v.nominators_stake_pred))
      .map((v) => Number(v.nominators_stake_pred));
    return stakes.length
      ? stakes.reduce((a, b) => a + b, 0) / stakes.length
      : undefined;
  });

  const raw = prediction?.solution_score?.minimal_stake;
  const value = isNil(raw)
    ? null
    : stakeDisplayMillions(raw, chainInfo);

  const caption = !isNil(averageStake)
    ? `${stakeDisplayMillions(averageStake, chainInfo)} average stake`
    : null;

  return (
    <PredictionStatBox
      label="minimal stake"
      value={value}
      caption={caption}
      isFetching={isFetching && isNil(prediction)}
    />
  );
}
