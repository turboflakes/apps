import * as React from "react";
import { useSelector } from "react-redux";
import isNil from "lodash/isNil";
import PredictionStatBox from "./PredictionStatBox";
import {
  useGetPredictionByTargetQuery,
  selectPredictionByTarget,
} from "../features/api/predictionsSlice";
import { useGetBlockQuery } from "../features/api/blocksSlice";
import { selectFinalizedBlockAH } from "../features/api/blocksAHSlice";

const BLOCK_TIME_SECS = 2;

const elapsedDisplay = (secs) => {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (d > 0) {
    return `${d}d ${h}h`;
  }
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m ${secs % 60}s`;
};

export default function PredictionBlockBox({ target }) {
  const { isFetching } = useGetPredictionByTargetQuery({ target });
  useGetBlockQuery({ blockId: "finalized", chain_key: "ah" });
  const prediction = useSelector((state) =>
    selectPredictionByTarget(state, target),
  );
  const finalizedAH = useSelector(selectFinalizedBlockAH);

  const blockNumber = prediction?.block_number;
  const blocks =
    !isNil(blockNumber) && !isNil(finalizedAH)
      ? finalizedAH.block_number - blockNumber
      : null;

  const value = !isNil(blockNumber) ? `#${Number(blockNumber).format()}` : null;
  const caption =
    blocks !== null
      ? `predicted ${elapsedDisplay(Math.max(blocks, 0) * BLOCK_TIME_SECS)} ago`
      : null;

  return (
    <PredictionStatBox
      label="prediction block"
      value={value}
      caption={caption}
      isFetching={isFetching && isNil(prediction)}
    />
  );
}
