import * as React from "react";
import Paper from "@mui/material/Paper";

// Empty box that holds the space of a collation box while its data is loading
export default function CollationEmptyBox({ bgcolor = "default" }) {
  return (
    <Paper
      sx={{
        p: 2,
        width: "100%",
        height: 80,
        borderRadius: 3,
        bgcolor,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    />
  );
}
