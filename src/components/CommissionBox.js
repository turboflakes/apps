import * as React from "react";
import { useSelector } from "react-redux";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CommissionPieChart from "./CommissionPieChart";
import { selectValidatorsInsightsBySessions } from "../features/api/validatorsSlice";
import { selectSessionHistoryRangeIds } from "../features/api/sessionsSlice";
import { commissionDisplayNumber } from "../util/display";

export default function BackingBox({ sessionIndex, isHistoryMode }) {
  // const theme = useTheme();
  const historySessionRangeIds = useSelector(selectSessionHistoryRangeIds);
  const rows = useSelector((state) =>
    selectValidatorsInsightsBySessions(
      state,
      isHistoryMode ? historySessionRangeIds : [sessionIndex],
      isHistoryMode,
    ),
  );

  if (!rows.length) {
    return null;
  }

  const groupedByCommission = groupBy(rows, (v) => {
    const floor = Math.floor(commissionDisplayNumber(v.commission) / 10) * 10;
    const ceil = floor + 10;
    if (floor === 100) {
      return "100%";
    }
    return `${floor}-${ceil}%`;
  });

  const data = orderBy(
    Object.keys(groupedByCommission).map((commission) => ({
      commission,
      value: groupedByCommission[commission].length,
    })),
    "commission",
  );

  return (
    <Paper
      sx={{
        // m: 2,
        // p: 2,
        display: "flex",
        flexDirection: "column",
        // justifyContent: 'center',
        // alignItems: 'center',
        width: "100%",
        // width: 352,
        height: 352,
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", width: "90%" }}>
            <Box
              sx={{
                mr: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="h6"
                  sx={{ mr: 1, overflow: "hidden" }}
                  title="Distribution by commission"
                >
                  Distribution by commission
                </Typography>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  height: 16,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                paragraph
              >
                All active validators
              </Typography>
            </Box>
          </Box>
          <Box></Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CommissionPieChart data={data} size="md" showLegend showLabel />
        </Box>
      </Box>
    </Paper>
  );
}
