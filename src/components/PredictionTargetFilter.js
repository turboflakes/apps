import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import isNull from "lodash/isNull";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  useGetBlockQuery,
  selectFinalizedBlock,
} from "../features/api/blocksSlice";
import {
  selectPredictionSelected,
  predictionChanged,
} from "../features/api/predictionsSlice";

export const PREDICTION_TARGETS = [600, 500, 400, 320];

const invertedSx = {
  bgcolor: "#0B1317",
  color: "#fff",
  "&:hover, &.Mui-selected, &.Mui-selected:hover": {
    bgcolor: "#0B1317",
    color: "#fff",
  },
};

export default function PredictionTargetFilter() {
  const dispatch = useDispatch();
  const target = useSelector(selectPredictionSelected);

  useGetBlockQuery({
    blockId: "finalized",
    chain_key: "rc",
    show_stats: true,
  });
  const activeSetSize = useSelector(
    (state) => selectFinalizedBlock(state)?.stats?.na,
  );

  const handleChange = (event, newTarget) => {
    if (isNull(newTarget)) {
      return;
    }
    dispatch(predictionChanged(newTarget));
  };

  return (
    <Box>
      <ToggleButtonGroup
        sx={{ mx: 2 }}
        value={target}
        exclusive
        onChange={handleChange}
        aria-label="prediction target"
      >
        {PREDICTION_TARGETS.map((value) => (
          <ToggleButton
            key={value}
            value={value}
            aria-label={`${value === activeSetSize ? "On-chain" : "target"} ${value}`}
            sx={{
              minWidth: 96,
              mr: 1,
              border: 0,
              "&.Mui-selected": { borderRadius: 16, pr: 2 },
              "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
                borderRadius: 16,
              },
              "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                borderRadius: 16,
              },
              ...(value === activeSetSize ? invertedSx : {}),
            }}
          >
            {`${value === activeSetSize ? "On-chain" : "target"} ${value}`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
