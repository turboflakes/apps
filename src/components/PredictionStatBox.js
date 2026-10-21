import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

export default function PredictionStatBox({ label, value, caption, isFetching }) {
  if (isFetching) {
    return (
      <Skeleton
        variant="rounded"
        sx={{
          width: "100%",
          height: 96,
          borderRadius: 3,
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          bgcolor: "white",
        }}
      />
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 96,
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box sx={{ pl: 1, pr: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          {label}
        </Typography>
        <Typography variant="h4">{value ?? "-"}</Typography>
        {caption ? (
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            {caption}
          </Typography>
        ) : null}
      </Box>
    </Paper>
  );
}
