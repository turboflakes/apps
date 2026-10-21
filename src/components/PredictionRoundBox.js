import * as React from "react";
import { useSelector } from "react-redux";
import isNil from "lodash/isNil";
import PredictionStatBox from "./PredictionStatBox";
import {
  useGetPredictionByTargetQuery,
  selectPredictionByTarget,
} from "../features/api/predictionsSlice";

export default function PredictionRoundBox({ target }) {
  const { isFetching } = useGetPredictionByTargetQuery({ target });
  const prediction = useSelector((state) =>
    selectPredictionByTarget(state, target),
  );

  const raw = prediction?.round;
  const value = isNil(raw) ? null : raw;

  return (
    <PredictionStatBox
      label="round"
      value={value}
      isFetching={isFetching && isNil(prediction)}
    />
  );
}
