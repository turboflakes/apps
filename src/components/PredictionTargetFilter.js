import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import isNull from "lodash/isNull";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  selectPredictionSelected,
  predictionChanged,
} from "../features/api/predictionsSlice";

export const PREDICTION_TARGETS = [600, 500, 400, 320];

export default function PredictionTargetFilter() {
  const dispatch = useDispatch();
  const target = useSelector(selectPredictionSelected);

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
            aria-label={`target ${value}`}
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
            }}
          >
            {`target ${value}`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
