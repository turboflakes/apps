import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import isNull from "lodash/isNull";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { selectChain } from "../features/chain/chainSlice";
import {
  selectSubsetFilter,
  subsetFilterChanged,
} from "../features/layout/layoutSlice";
import { isDNAvailable } from "../constants";

export default function SubsetFilter() {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const subsetFilter = useSelector(selectSubsetFilter);
  const selectedChain = useSelector(selectChain);

  const handleSubsetFilter = (event, newFilter) => {
    if (isNull(newFilter)) {
      return;
    }
    dispatch(subsetFilterChanged(newFilter));
  };

  return (
    <Box>
      <ToggleButtonGroup
        sx={{ mx: 2 }}
        value={subsetFilter}
        exclusive
        onChange={handleSubsetFilter}
        aria-label="text alignment"
      >
        <ToggleButton
          value=""
          aria-label="left aligned"
          sx={{
            minWidth: 128,
            mr: 1,
            border: 0,
            "&.Mui-selected": { borderRadius: 16, pr: 2 },
            "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
              borderRadius: 16,
            },
          }}
        >
          All
        </ToggleButton>
        <ToggleButton
          value="C100"
          aria-label="justified"
          sx={{
            minWidth: 128,
            mr: 1,
            border: 0,
            "&.Mui-selected": { borderRadius: 16, pr: 2 },
            "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
              borderRadius: 16,
            },
          }}
        >
          100% Com.
        </ToggleButton>
        <ToggleButton
          value="Others"
          aria-label="right aligned"
          sx={{
            minWidth: 128,
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
          Others
        </ToggleButton>
        {isDNAvailable(selectedChain) ? (
          <ToggleButton
            value="DN"
            aria-label="centered"
            sx={{
              minWidth: 128,
              mr: 1,
              border: 0,
              "&.Mui-selected": { borderRadius: 16, pr: 2 },
              "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                borderRadius: 16,
              },
            }}
          >
            <b>DN</b>
          </ToggleButton>
        ) : null}
      </ToggleButtonGroup>
    </Box>
  );
}
