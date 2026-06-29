import * as React from "react";
import { useSelector } from "react-redux";
import groupBy from "lodash/groupBy";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import PieChartIcon from "@mui/icons-material/PieChart";
import ListIcon from "@mui/icons-material/List";
import { useTheme } from "@mui/material/styles";
import OwnStakeChart from "./OwnStakeChart";
import { selectValidatorsInsightsBySessions } from "../features/api/validatorsSlice";
import {
  selectIdentityFilter,
  selectSubsetFilter,
} from "../features/layout/layoutSlice";
import { selectSessionHistoryRangeIds } from "../features/api/sessionsSlice";
import { selectChain, selectChainInfo } from "../features/chain/chainSlice";
import { stakeDisplayNumber, stakeDisplay, ratioToHex } from "../util/display";
import { getStepUnits, getStepMultiplier } from "../constants";

export default function OwnStakeBox({ sessionIndex, isHistoryMode }) {
  const theme = useTheme();
  const [showPie, setShowPie] = React.useState(true);
  const selectedChain = useSelector(selectChain);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);
  const historySessionRangeIds = useSelector(selectSessionHistoryRangeIds);
  const chainInfo = useSelector(selectChainInfo);

  const rows = useSelector((state) =>
    selectValidatorsInsightsBySessions(
      state,
      isHistoryMode ? historySessionRangeIds : [sessionIndex],
      isHistoryMode,
      identityFilter,
      subsetFilter,
    ),
  );

  const handleView = () => {
    setShowPie(!showPie);
  };

  if (!rows.length) {
    return null;
  }

  const groupedByOwnStake = groupBy(rows, (v) => {
    let tokenDecimals = chainInfo?.tokenDecimals
      ? chainInfo.tokenDecimals[0]
      : 10;

    const networkDecimals = Math.pow(10, tokenDecimals);
    const stepUnit = getStepUnits(selectedChain);
    const stepMult = getStepMultiplier(selectedChain);
    const floor =
      Math.floor(
        stakeDisplayNumber(v.own_stake, chainInfo) /
          (networkDecimals * stepMult * stepUnit),
      ) *
      (networkDecimals * stepMult * stepUnit);

    const ceil = networkDecimals * stepMult * stepUnit + floor;
    // Group by own stake, display in Kilo
    let showK =
      stepUnit > 1 &&
      stakeDisplay(floor / stepUnit, chainInfo, 0, false, false, true) !== "0";
    return `${stakeDisplay(floor / stepUnit, chainInfo, 0, false, false, true)}${showK ? "K" : ""}  - ${stakeDisplay(ceil / stepUnit, chainInfo, 0, false, false, true)}${showK ? "K" : ""}`;
  });

  const data = Object.entries(groupedByOwnStake)
    .map(([legend, arr]) => ({
      legend,
      value: arr.length,
    }))
    .sort(
      (a, b) => (parseInt(a.legend, 10) || 0) - (parseInt(b.legend, 10) || 0),
    );

  const total = data.map((d) => d.value).reduce((a, b) => a + b, 0);
  const tokenSymbol = chainInfo?.tokenSymbol ? chainInfo.tokenSymbol[0] : "";
  const stepUnit = getStepUnits(selectedChain);
  const stepMult = getStepMultiplier(selectedChain);

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
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="h6"
              sx={{ mr: 1, overflow: "hidden", textOverflow: "ellipsis" }}
              title="Distribution by self stake"
            >
              {`Distribution by self stake (${tokenSymbol})`}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="subtitle2"
          sx={{ height: 16, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {subsetFilter !== "" ? (
            <span>Only for subset {subsetFilter}</span>
          ) : (
            "All active validators"
          )}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton aria-label="grade-details" onClick={handleView}>
            {!showPie ? (
              <PieChartIcon fontSize="small" />
            ) : (
              <ListIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {showPie ? (
            <OwnStakeChart data={data} size="md" showLegend showLabel />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "256px",
                height: 234,
                overflowY: "auto",
              }}
            >
              <List dense>
                {data.map((g, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      "+ :last-child": { borderBottom: "none" },
                    }}
                    secondaryAction={
                      <Typography variant="caption">{`${g.value} (${Math.round((g.value / total) * stepMult * stepUnit) / 100}%)`}</Typography>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: "24px" }}>
                      <Box
                        sx={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          bgcolor: ratioToHex(g.value / total, 35, 100),
                          display: "inline-block",
                        }}
                      ></Box>
                    </ListItemIcon>
                    <ListItemText sx={{ m: 0 }} primary={`${g.legend}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
