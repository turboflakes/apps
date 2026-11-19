import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  useGetCollatorsQuery,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";

export default function CollationAuthoritiesBox({ chainKey, name }) {
  const selectedChain = useSelector(selectChain);
  const isReady = isCollationAvailable(selectedChain);

  useGetCollatorsQuery(
    { chain_key: chainKey, infra: true },
    { skip: !isReady },
  );
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );

  if (!isReady || isUndefined(summary?.infra)) {
    return null;
  }

  const { ni, np, nv } = summary.infra;

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
        bgcolor: (theme) => theme.palette.grey[50],
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
        <Typography variant="h6">{(ni + np + nv).format()}</Typography>
        <Typography
          variant="subtitle2"
          sx={{ whiteSpace: "nowrap", lineHeight: 0.875 }}
        >
          {`${nv.format()} metanodes`}
        </Typography>
      </Box>
    </Paper>
  );
}
