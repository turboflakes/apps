import * as React from "react";
import { useSelector, shallowEqual } from "react-redux";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import PieChartIcon from "@mui/icons-material/PieChart";
import ListIcon from "@mui/icons-material/List";
import { useTheme } from "@mui/material/styles";
import NodeVersionChart from "./NodeVersionChart";
import Tooltip from "./Tooltip";
import {
  useGetValidatorsQuery,
  selectValidatorBySessionAndAddress,
} from "../features/api/validatorsSlice";
import { selectPredictionValidatorsByTarget } from "../features/api/predictionsSlice";
import {
  useGetSessionByIndexQuery,
  selectSessionCurrent,
} from "../features/api/sessionsSlice";
import {
  selectIdentityFilter,
  selectSubsetFilter,
} from "../features/layout/layoutSlice";
import { versionDisplay, versionToNumber } from "../util/display";

export default function NodeVersionBoxPred({ target }) {
  const theme = useTheme();
  const [showPie, setShowPie] = React.useState(true);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);
  const currentSession = useSelector(selectSessionCurrent);
  const sessionIndex = Number.isInteger(currentSession)
    ? currentSession - 1
    : undefined;
  const skip = sessionIndex === undefined;

  // node versions are collected from the discovery of the latest session
  useGetSessionByIndexQuery({ index: sessionIndex }, { skip });
  useGetValidatorsQuery(
    { session: sessionIndex, role: "authority", show_discovery: true },
    { skip },
  );
  useGetValidatorsQuery(
    { session: sessionIndex, role: "waiting", show_discovery: true },
    { skip },
  );

  const rows = useSelector((state) =>
    selectPredictionValidatorsByTarget(
      state,
      target,
      identityFilter,
      subsetFilter,
    ).map((v) => v.address),
    shallowEqual,
  );
  const versions = useSelector(
    (state) =>
      rows.map(
        (address) =>
          selectValidatorBySessionAndAddress(state, sessionIndex, address)
            ?.discovery?.nv ?? "",
      ),
    shallowEqual,
  );

  const handleView = () => {
    setShowPie(!showPie);
  };

  if (!versions.length) {
    return null;
  }

  const groupedByVersion = groupBy(versions, (nv) => versionDisplay(nv));
  const data = orderBy(
    Object.keys(groupedByVersion).map((subset) => ({
      subset,
      value: groupedByVersion[subset].length,
      n: versionToNumber(subset),
    })),
    "n",
  );
  const total = data.map((d) => d.value).reduce((a, b) => a + b, 0);

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
              title="Distribution by node version"
            >
              Distribution by version
            </Typography>
          </Box>
          <Tooltip
            disableFocusListener
            placement="top"
            title={
              <Box sx={{ p: 1 }}>
                <Typography el variant="caption" paragraph>
                  {
                    "The node version is collected from the Kademlia Distributed Hash Table (DHT) subsystem in libp2p."
                  }
                </Typography>
                <Typography variant="caption" paragraph>
                  {
                    "The task to crawl and discover peer nodes in the network is executed every new session."
                  }
                </Typography>
                <Typography variant="caption">
                  {
                    "Nodes that are not reached within the discovery process have their node version set to 'N/D'."
                  }
                </Typography>
              </Box>
            }
          >
            <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300] }} />
          </Tooltip>
        </Box>
        <Typography
          variant="subtitle2"
          sx={{ height: 16, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {subsetFilter !== "" ? (
            <span>Only for subset {subsetFilter}</span>
          ) : (
            `All validators in the predicted set of ${target}`
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
            <NodeVersionChart data={data} size="md" showLegend showLabel />
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
                {data.reverse().map((g, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      "+ :last-child": { borderBottom: "none" },
                    }}
                    secondaryAction={
                      <Typography variant="caption">{`${Math.round((g.value / total) * 10000) / 100}%`}</Typography>
                    }
                  >
                    <ListItemText
                      sx={{ m: 0 }}
                      primary={g.subset === "" ? "N/D" : `v${g.subset}`}
                    />
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
