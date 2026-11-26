import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  selectMaxHistoryEras,
  maxHistoryErasChanged,
} from "../features/layout/layoutSlice";

const OPTIONS = [4, 8, 16, 32];

export default function HistoryErasToggle() {
  const dispatch = useDispatch();
  const maxHistoryEras = useSelector(selectMaxHistoryEras);

  const handleChange = (event, value) => {
    if (value !== null) {
      dispatch(maxHistoryErasChanged(value));
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ToggleButtonGroup
        value={maxHistoryEras}
        size="small"
        exclusive
        onChange={handleChange}
        aria-label="history eras"
        sx={{ display: "flex", alignItems: "center" }}
      >
        {OPTIONS.map((o, i) => (
          <ToggleButton
            key={o}
            value={o}
            aria-label={`${o} eras`}
            disableRipple
            disableFocusRipple
            sx={{
              minWidth: 40,
              px: 2,
              // mr: 1,
              mr: i < OPTIONS.length - 1 ? 0.5 : 0,
              border: 0,
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: 16,
              "&.Mui-selected": { borderRadius: 16 },
              "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                borderRadius: 16,
              },
              "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
                borderRadius: 16,
              },
            }}
          >
            {`${o} eras`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
