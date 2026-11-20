import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { selectCollationKindLatest } from "../features/api/collationKindSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";
import CollationEmptyBox from "./CollationEmptyBox";

export default function CollationAuthoritiesBox({ chainKey, name }) {
  const selectedChain = useSelector(selectChain);
  const isReady = isCollationAvailable(selectedChain);
  const kind = useSelector((state) =>
    selectCollationKindLatest(state, chainKey),
  );

  if (!isReady || isUndefined(kind)) {
    return <CollationEmptyBox />;
  }

  const { i, p, v } = kind;

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 80,
        borderRadius: 3,
        bgcolor: 'default',
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
          {name} collators
        </Typography>
        <Typography variant="h6">{(i + p + v).format()}</Typography>
        <Typography
          variant="subtitle2"
          sx={{ whiteSpace: "nowrap", lineHeight: 0.875 }}
        >
          {`${v.format()} metanodes`}
        </Typography>
      </Box>
    </Paper>
  );
}
