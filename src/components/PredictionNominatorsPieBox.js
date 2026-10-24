import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isNil from "lodash/isNil";
import PredictionPieBox from "./PredictionPieBox";
import {
  useGetPredictionByTargetQuery,
  selectPredictionByTarget,
} from "../features/api/predictionsSlice";

export default function PredictionNominatorsPieBox({ target }) {
  const theme = useTheme();
  const { isFetching } = useGetPredictionByTargetQuery({ target });
  const prediction = useSelector((state) =>
    selectPredictionByTarget(state, target),
  );

  const nominators = prediction?.nominators;
  const isLoading =
    (isFetching && isNil(prediction)) || isNil(nominators?.nominators_counter);

  const total = Number(nominators?.nominators_counter ?? 0);
  const active = Number(nominators?.active_counter ?? 0);
  const waiting = Number(nominators?.waiting_only_counter ?? 0);

  return (
    <PredictionPieBox
      isLoading={isLoading}
      label="active nominators"
      value={Number(active).format()}
      subtitle={`${waiting.format()} waiting of ${total.format()} total`}
      slices={[
        {
          name: "Active",
          value: active,
          display: active.format(),
          color: theme.palette.semantics.green,
        },
        {
          name: "Waiting",
          value: waiting,
          display: waiting.format(),
          color: theme.palette.grey[900],
        },
      ]}
    />
  );
}
