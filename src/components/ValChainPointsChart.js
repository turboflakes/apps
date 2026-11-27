import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectValidatorBySessionAndAddress } from "../features/api/validatorsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import {
  useGetCollatorsQuery,
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";

const CHAINS = [
  ["ah", "Asset Hub"],
  ["pp", "People"],
  ["bu", "Bulletin"],
];

const renderTooltip = (props, theme) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <Box
        sx={{
          bgcolor: "#fff",
          p: 2,
          m: 0,
          borderRadius: 1,
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <Typography component="div" variant="caption" color="inherit">
          <b>{data.name}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" paragraph>
          {data.detail}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography component="div" variant="caption" color="inherit">
          <b>Total points: {data.points.format()}</b>
        </Typography>
      </Box>
    );
  }
  return null;
};

// Para id of the system chain and the points and blocks of the slot the address
// currently owns in it (0 if it does not own the slot)
function useChainOpenSlot(address, chainKey, skip) {
  const currentSession = useSelector(selectSessionCurrent);
  useGetCollatorsQuery(
    { chain_key: chainKey, stats: true, slot: true },
    { skip },
  );
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );
  const collators = useSelector((state) =>
    selectCollatorsByChainAndSession(state, chainKey, summary?.session),
  );
  const slot = useSelector((state) =>
    selectCollationSlotBySessionAndPid(
      state,
      currentSession,
      summary?.para_id,
    ),
  );
  const collator = collators.find((c) => c.address === address);
  const isOwner =
    !skip &&
    !isUndefined(slot) &&
    !isUndefined(collator) &&
    slot.cix === collator.cix;
  return {
    paraId: summary?.para_id,
    pt: isOwner ? slot.pt : 0,
    pb: isOwner ? slot.pb : 0,
  };
}

export default function ValChainPointsChart({ address }) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const currentSession = useSelector(selectSessionCurrent);
  const skip = !isCollationAvailable(selectedChain);
  const validator = useSelector((state) =>
    selectValidatorBySessionAndAddress(state, currentSession, address),
  );
  const open = {
    ah: useChainOpenSlot(address, "ah", skip),
    pp: useChainOpenSlot(address, "pp", skip),
    bu: useChainOpenSlot(address, "bu", skip),
  };

  const data = [];
  if (validator?.is_auth && !isUndefined(validator.auth)) {
    data.push({
      name: "Relay",
      points: Math.max(validator.auth.ep - validator.auth.sp, 0),
      detail: "Backing and authored block points",
      fill: theme.palette.neutrals[300],
    });
  }
  CHAINS.forEach(([chainKey, name]) => {
    const { paraId, pt, pb } = open[chainKey];
    const stats = validator?.collation_stats?.[paraId];
    if (!isUndefined(stats)) {
      data.push({
        name,
        points: stats.pt + pt,
        detail: `${(stats.pb + pb).format()} authored blocks in ${stats.os.format()} owned slots`,
        fill: theme.palette.neutrals[200],
      });
    }
  });

  if (!data.length) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: 96 + data.length * 40,
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box>
        <Typography variant="h6">Points per service</Typography>
        <Typography variant="subtitle2">
          {`Since session ${currentSession.format()} started`}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 16, right: 32, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="1 4"
            vertical={true}
            horizontal={false}
          />
          <XAxis
            style={{ fontSize: "0.8rem" }}
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1 }}
            type="number"
          />
          <YAxis
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            dataKey="name"
            type="category"
            width={96}
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1 }}
          />
          <Bar
            dataKey="points"
            barSize={12}
            shape={<Rectangle radius={[0, 8, 8, 0]} />}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
          <Tooltip
            cursor={{ fill: theme.palette.divider }}
            offset={24}
            wrapperStyle={{ zIndex: 100 }}
            content={(props) => renderTooltip(props, theme)}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
