import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  ComposedChart,
  Bar,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { calculateMCR } from "../util/math";
import { useGetSessionsQuery } from "../features/api/sessionsSlice";
import CollatorsHistoryRangeBox, {
  useCollatorsHistorySessions,
} from "./CollatorsHistoryRangeBox";
import {
  selectCollatorsHistoryRange,
  collatorsHistoryRangeChanged,
} from "../features/layout/layoutSlice";

// width (px) of the axes of the chart
const AXIS_WIDTH = 64;

const renderLegend = (theme) => (
  <Box sx={{ mt: -1, mr: 9, display: "flex", justifyContent: "flex-end" }}>
    <Typography variant="caption" color="inherit" sx={{ mr: 1 }}>
      <span
        style={{ marginRight: "8px", color: theme.palette.neutrals[200] }}
      >
        ●
      </span>
      Session Points
    </Typography>
    <Typography variant="caption" color="inherit" sx={{ mr: 1 }}>
      <span
        style={{ marginRight: "8px", color: theme.palette.neutrals[300] }}
      >
        ●
      </span>
      Selected Session
    </Typography>
    <Typography variant="caption" color="inherit">
      <span
        style={{ marginRight: "8px", color: theme.palette.semantics.purple }}
      >
        ●
      </span>
      Era Points
    </Typography>
    <Typography variant="caption" color="inherit" sx={{ ml: 1 }}>
      <span
        style={{ marginRight: "8px", color: theme.palette.semantics.amber }}
      >
        ●
      </span>
      MCR
    </Typography>
  </Box>
);

const renderTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }
  const data = payload[0].payload;
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        p: 2,
        borderRadius: 1,
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography component="div" variant="caption" color="inherit">
          <b>History</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <i>Session {data.session.format()}</i>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <i>Era {data.era?.format() ?? "-"}</i>
        </Typography>
      </Box>
      <Typography component="div" variant="caption">
        era points: <b>{data.eraTotal.format()}</b>
      </Typography>
      <Typography component="div" variant="caption">
        session points: <b>{data.points.format()}</b>
      </Typography>
      <Typography component="div" variant="caption">
        authored blocks: <b>{data.blocks.format()}</b>
      </Typography>
      <Typography component="div" variant="caption">
        MCR:{" "}
        <b>{!isUndefined(data.mcr) ? Math.round(data.mcr * 10000) / 10000 : "-"}</b>
      </Typography>
    </Box>
  );
};

export default function CollatorsHistoryTimeline({ chainKey, maxSessions }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  useGetSessionsQuery({
    chain_key: chainKey,
    number_last_sessions: maxSessions,
    stats: true,
  });
  const sessions = useCollatorsHistorySessions(chainKey, maxSessions);
  const range = useSelector((state) =>
    selectCollatorsHistoryRange(state, chainKey),
  );

  const data = React.useMemo(() => {
    const closed = sessions.map((s) => ({
        session: s.six,
        era: s.eix,
        points: s.stats?.pt ?? 0,
        blocks: s.stats?.pb ?? 0,
        mcr: calculateMCR(s.stats?.eb, s.stats?.pb),
    }));
    return closed.map((s) => ({
      ...s,
      eraTotal: closed
        .filter((c) => c.era === s.era)
        .reduce((acc, c) => acc + c.points, 0),
    }));
  }, [sessions]);

  // sessions of the range selected
  const isSelected = (session) =>
    !isUndefined(range) && !isNull(range) && session >= range[0] && session <= range[1];
  const selectedData = data.filter((d) => isSelected(d.session));

  const handleClick = (state) => {
    const session = state?.activeLabel;
    if (!isUndefined(session)) {
      dispatch(
        collatorsHistoryRangeChanged({ chainKey, range: [session, session] }),
      );
    }
  };

  const subtitle = !selectedData.length
    ? "\u00a0"
    : selectedData.length === 1
      ? `Session ${selectedData[0].session.format()} at Era ${selectedData[0].era?.format() ?? "-"} selected`
      : `Sessions ${selectedData[0].session.format()} to ${selectedData[selectedData.length - 1].session.format()} selected (${selectedData.length} sessions)`;

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6">History Timeline</Typography>
          <Typography variant="subtitle2">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <ResponsiveContainer width="100%" height={228}>
        <ComposedChart
          data={data}
          onClick={handleClick}
          margin={{ top: 8, right: 0, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="1 4" vertical={false} />
          <XAxis
            dataKey="session"
            style={{ fontSize: "0.8rem" }}
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1 }}
            angle={-30}
            tickMargin={8}
          />
          <YAxis
            width={AXIS_WIDTH}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1 }}
          />
          <Tooltip
            cursor={{ fill: theme.palette.divider }}
            offset={24}
            wrapperStyle={{ zIndex: 100 }}
            content={renderTooltip}
          />
          <Legend
            verticalAlign="top"
            content={() => renderLegend(theme)}
            height={24}
          />
          <Bar dataKey="points" cursor="pointer">
            {data.map((entry) => (
              <Cell
                key={entry.session}
                fill={
                  isSelected(entry.session)
                    ? theme.palette.neutrals[300]
                    : theme.palette.neutrals[200]
                }
              />
            ))}
          </Bar>
          <YAxis
            yAxisId="rightPoints"
            orientation="right"
            width={AXIS_WIDTH}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{
              stroke: theme.palette.semantics.purple,
              strokeWidth: 1,
            }}
          />
          <Line
            yAxisId="rightPoints"
            type="step"
            dataKey="eraTotal"
            dot={false}
            stroke={theme.palette.semantics.purple}
            strokeWidth={2}
          />
          {/* mcr */}
          <YAxis
            yAxisId="rightMCR"
            orientation="right"
            width={AXIS_WIDTH}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{
              stroke: theme.palette.semantics.amber,
              strokeWidth: 1,
            }}
          />
          <Line
            yAxisId="rightMCR"
            type="monotone"
            dataKey="mcr"
            dot={false}
            stroke={theme.palette.semantics.amber}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <CollatorsHistoryRangeBox
        chainKey={chainKey}
        maxSessions={maxSessions}
        insetLeft={AXIS_WIDTH}
        insetRight={2 * AXIS_WIDTH}
      />
    </Paper>
  );
}
