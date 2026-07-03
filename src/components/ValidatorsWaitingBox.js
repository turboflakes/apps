import * as React from "react";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import ValidatorsWaitingDataGrid from "./ValidatorsWaitingDataGrid";
import { selectChain } from "../features/chain/chainSlice";

export default function ValidatorsWaitingBox({ sessionIndex, skip }) {
  const selectedChain = useSelector(selectChain);
  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: selectedChain === "polkadot" ? "1104px" : "1474px",
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <ValidatorsWaitingDataGrid sessionIndex={sessionIndex} skip={skip} />
    </Paper>
  );
}
