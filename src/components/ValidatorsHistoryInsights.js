import * as React from "react";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import ValidatorsHistoryDataGrid from "./ValidatorsHistoryDataGrid";
import {
  useGetSessionsQuery,
  selectSessionHistoryIds,
} from "../features/api/sessionsSlice";
import { useGetValidatorsQuery } from "../features/api/validatorsSlice";
import { selectChain } from "../features/chain/chainSlice";

export default function ValidatorsHistoryInsights({ skip }) {
  // const theme = useTheme();
  const historySessionIds = useSelector(selectSessionHistoryIds);
  const selectedChain = useSelector(selectChain);

  const { isFetching: isFetchingValidators } = useGetValidatorsQuery(
    {
      role: "authority",
      from: historySessionIds[0],
      to: historySessionIds[5],
      summary: true,
      profile: true,
      discovery: true,
    },
    { skip },
  );
  const { isFetching: isFetchingSessions } = useGetSessionsQuery(
    { from: historySessionIds[0], to: historySessionIds[5], stats: true },
    { skip },
  );

  const isFetching = isFetchingValidators || isFetchingSessions;

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
      <ValidatorsHistoryDataGrid isFetching={isFetching} />
    </Paper>
  );
}
