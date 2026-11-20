import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useGetCollatorsQuery } from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";
import SessionBoxHeader from "./SessionBoxHeader";
import FinalizedBlockBoxHeader from "./FinalizedBlockBoxHeader";
import BestBlockBoxHeader from "./BestBlockBoxHeader";
import AvgBlockTimeBoxHeader from "./AvgBlockTimeBoxHeader";

export default function CollationHeader({ chainKey, name }) {
  const selectedChain = useSelector(selectChain);
  const isReady = isCollationAvailable(selectedChain);

  useGetCollatorsQuery(
    { chain_key: chainKey, kind_counter: true, slot: true, stats: true },
    { skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 40,
        mb: 0
      }}
    >
      <Typography variant="h6" ml={3}>{name}</Typography>
      <Box sx={{ ml: 1, flexGrow: 1, display: "flex" }}></Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <SessionBoxHeader chain_key={chainKey} />
        <FinalizedBlockBoxHeader chain_key={chainKey} />
        <BestBlockBoxHeader chain_key={chainKey} />
        <AvgBlockTimeBoxHeader chain_key={chainKey} />
      </Box>
    </Box>
  );
}
