import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useGetCollatorsQuery } from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { selectCollationHidden } from "../features/layout/layoutSlice";
import { isCollationAvailable } from "../constants";
import SessionBoxHeader from "./SessionBoxHeader";
import FinalizedBlockBoxHeader from "./FinalizedBlockBoxHeader";
import FinalityLagBoxHeader from "./FinalityLagBoxHeader";
import AvgBlockTimeBoxHeader from "./AvgBlockTimeBoxHeader";
import CollationGradesBoxHeader from "./CollationGradesBoxHeader";

export default function CollationHeader({ chainKey, name, isCollatorsTab }) {
  const selectedChain = useSelector(selectChain);
  const isReady = isCollationAvailable(selectedChain);
  const hidden = useSelector((state) => selectCollationHidden(state, chainKey));

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
        mb: 0,
      }}
    >
      <Typography variant="h6" ml={1}>
        {name}
      </Typography>
      {hidden ? <CollationGradesBoxHeader chain_key={chainKey} /> : null}
      <Box sx={{ ml: 1, flexGrow: 1, display: "flex" }}></Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>

        {isCollatorsTab ? <SessionBoxHeader chain_key={chainKey} /> : null}
        <FinalizedBlockBoxHeader chain_key={chainKey} />
        <FinalityLagBoxHeader chain_key={chainKey} />
        {isCollatorsTab ? <AvgBlockTimeBoxHeader chain_key={chainKey} /> : null}
      </Box>
    </Box>
  );
}
