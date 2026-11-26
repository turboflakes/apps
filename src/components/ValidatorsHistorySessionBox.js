import * as React from "react";
import Box from "@mui/material/Box";
import Spinner from "./Spinner";
import SessionSlider from "./SessionSlider";

// space (px) `SessionSlider` leaves on each side (margin of 48px) and below
// the slider (margin of 8px), without a legend
const SLIDER_SPACE = 48;
const SLIDER_SPACE_BELOW = 8;

// Slider to select a session, placed like `ValidatorsHistoryRangeBox` places
// the range slider: the slider track starts `insetLeft` from the left and ends
// `insetRight` from the right (e.g. to align it with the plot area of a chart
// with axes), where the spinner is placed, and it has the same space above and
// below. `isFetching` shows the spinner while the data of the session loads.
export default function ValidatorsHistorySessionBox({
  maxSessions,
  insetLeft,
  insetRight,
  isFetching,
}) {
  return (
    <Box
      sx={{
        // the range box has a margin of 8px above and below the slider
        mt: 1,
        mb: `${8 - SLIDER_SPACE_BELOW}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          flex: 1,
          ml: `${Math.max(0, insetLeft - SLIDER_SPACE)}px`,
          mr: `-${SLIDER_SPACE}px`,
        }}
      >
        <SessionSlider maxSessions={maxSessions} showLegend={false} />
      </Box>
      {/* the spinner takes the space of the axes on the right, centered with
          the slider track (the slider has a bottom margin of 20px because its
          marks have labels) */}
      <Box
        sx={{
          width: `${insetRight}px`,
          display: "flex",
          justifyContent: "center",
          mb: "20px",
        }}
      >
        {isFetching ? <Spinner size={24} /> : null}
      </Box>
    </Box>
  );
}
