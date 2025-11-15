import * as React from "react";
import { useSelector } from "react-redux";
// import { useTheme } from '@mui/material/styles';
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { selectFinalizedBlock } from "../features/api/blocksSlice";
import { selectSessionCurrent } from "../features/api/sessionsSlice";

export default function SessionPointsBox() {
  // const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const block = useSelector(selectFinalizedBlock);

  if (
    isUndefined(currentSession) ||
    currentSession === "current" ||
    isUndefined(block) ||
    isUndefined(block.stats)
  ) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        // flexDirection: 'column',
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 96,
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box
        sx={{
          px: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          session points
        </Typography>
        <Typography variant="h5">
          {!isUndefined(block.stats.pt) ? block.stats.pt.format() : "-"}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
          {`since session ${currentSession.format()} started`}
        </Typography>
      </Box>
    </Paper>
  );
}
