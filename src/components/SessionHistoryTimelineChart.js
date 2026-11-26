import * as React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import isUndefined from "lodash/isUndefined";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Cell,
  ReferenceArea,
  ReferenceLine,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
  Legend,
} from "recharts";
import { Typography } from "@mui/material";
import ValidatorsHistorySessionBox from "./ValidatorsHistorySessionBox";
import ValidatorsHistoryRangeBox from "./ValidatorsHistoryRangeBox";
import {
  selectSessionCurrent,
  selectSessionHistory,
  selectSessionHistoryRange,
  selectSessionByIndex,
  selectSessionsByIds,
  useGetSessionsQuery,
  selectMVRBySessions,
  selectBARBySessions,
  selectBackingPointsBySessions,
  selectAuthoredBlocksBySessions,
  selectDisputesBySessions,
  sessionHistoryChanged,
  buildSessionIdsArrayHelper,
} from "../features/api/sessionsSlice";
import { gradeByRatios } from "../util/grade";

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
        <Box sx={{ mb: 2 }}>
          <Typography component="div" variant="caption" color="inherit">
            <b>History</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>Session {data.session?.format() ?? "-"}</i>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>Era {data.era?.format() ?? "-"}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: "192px" }}>
          <Box>
            <Typography component="div" variant="caption" color="inherit">
              <span
                style={{
                  marginRight: "8px",
                  color: theme.palette.semantics.grey,
                }}
              >
                ●
              </span>
              Backing Points:{" "}
              <b>{!isUndefined(data.pvPoints) ? data.pvPoints.format() : ""}</b>
            </Typography>
            <Typography component="div" variant="caption" color="inherit">
              <span
                style={{
                  marginRight: "8px",
                  color: theme.palette.semantics.purple,
                }}
              >
                ●
              </span>
              Authored Block Points:{" "}
              <b>{!isUndefined(data.abPoints) ? data.abPoints.format() : ""}</b>
            </Typography>
            <Typography component="div" variant="caption" color="inherit">
              <span
                style={{
                  marginRight: "8px",
                  color: theme.palette.semantics.amber,
                }}
              >
                ●
              </span>
              MVR (All Para-Authorities):{" "}
              <b>{Math.round(data.mvr * 10000) / 10000}</b>
            </Typography>
            <Typography component="div" variant="caption" color="inherit">
              <span
                style={{
                  marginRight: "8px",
                  color: theme.palette.semantics.blue,
                }}
              >
                ●
              </span>
              BAR (All Para-Authorities):{" "}
              <b>{Math.round(data.bar * 10000) / 10000}</b>
            </Typography>
            <Typography component="div" variant="caption" color="inherit">
              <span
                style={{
                  marginRight: "8px",
                  color: theme.palette.semantics.red,
                  fontWeight: 600,
                }}
              >
                ❚
              </span>
              Disputes:{" "}
              <b>{!isUndefined(data.disputes) ? data.disputes.format() : ""}</b>
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

const AXIS_WIDTH = 64;

const renderLegend = (theme) => {
  return (
    <Box sx={{ mt: -1, mr: 9, display: "flex", justifyContent: "flex-end" }}>
      <Typography variant="caption" color="inherit" sx={{ mr: 1 }}>
        <span
          style={{ marginRight: "8px", color: theme.palette.semantics.grey }}
        >
          ●
        </span>
        Backing Points
      </Typography>
      <Typography variant="caption" color="inherit" sx={{ mr: 1 }}>
        <span
          style={{ marginRight: "8px", color: theme.palette.semantics.purple }}
        >
          ●
        </span>
        Authored Block Points
      </Typography>
      <Typography variant="caption" color="inherit" sx={{ mr: 1 }}>
        <span
          style={{ marginRight: "8px", color: theme.palette.semantics.amber }}
        >
          ●
        </span>
        MVR (All Para-Authorities)
      </Typography>
      <Typography variant="caption" color="inherit" sx={{ mr: 1 }}>
        <span
          style={{ marginRight: "8px", color: theme.palette.semantics.blue }}
        >
          ●
        </span>
        BAR (All Para-Authorities)
      </Typography>
      <Typography variant="caption" color="inherit">
        <span
          style={{
            marginRight: "8px",
            color: theme.palette.semantics.red,
            fontWeight: 600,
          }}
        >
          ❚
        </span>
        Disputes
      </Typography>
    </Box>
  );
};

export default function SessionHistoryTimelineChart({
  address,
  maxSessions,
  selection = "session",
  isFetching,
}) {
  const isRange = selection === "range";
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentSession = useSelector(selectSessionCurrent);
  const historySession = useSelector(selectSessionHistory);
  // loads the stats of the sessions of the timeline
  useGetSessionsQuery({ number_last_sessions: maxSessions, stats: true });
  const historySessionIds = buildSessionIdsArrayHelper(
    currentSession - 1,
    maxSessions,
  );
  const allBackingPoints = useSelector((state) =>
    selectBackingPointsBySessions(state, historySessionIds),
  );
  const allAuthoredBlocks = useSelector((state) =>
    selectAuthoredBlocksBySessions(state, historySessionIds),
  );
  const allMvrs = useSelector((state) =>
    selectMVRBySessions(state, historySessionIds),
  );
  const allBars = useSelector((state) =>
    selectBARBySessions(state, historySessionIds),
  );
  const allDisputes = useSelector((state) =>
    selectDisputesBySessions(state, historySessionIds),
  );
  const historyRange = useSelector(selectSessionHistoryRange);

  // NOTE: shallowEqual, as the selector returns a new array on every call
  const allSessions = useSelector(
    (state) => selectSessionsByIds(state, historySessionIds),
    shallowEqual,
  );

  const data = historySessionIds.map((sessionId, i) => ({
    session: sessionId,
    era: allSessions[i]?.eix,
    gradeValue: gradeByRatios(allMvrs[i], 1 - allBars[i]),
    pvPoints: allBackingPoints[i],
    abPoints: allAuthoredBlocks[i] * 20,
    disputes: allDisputes[i],
    mvr: allMvrs[i],
    bar: allBars[i],
  }));

  const handleClick = (state) => {
    const session = state?.activeLabel;
    if (!isRange && !isUndefined(session) && historySession !== session) {
      dispatch(sessionHistoryChanged(session));
    }
  };

  const historySessionSelected = useSelector((state) =>
    selectSessionByIndex(state, historySession),
  );

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
      <Box>
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
              {!isRange
                ? `Session ${historySessionSelected?.six?.format() ?? ""} at Era ${historySessionSelected?.eix?.format() ?? ""} selected`
                : historyRange[0] === historyRange[1]
                  ? `Session ${historyRange[0].format()} selected`
                  : `Sessions ${historyRange[0].format()} to ${historyRange[1].format()} selected`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <ResponsiveContainer width="100%" height={228}>
        <ComposedChart
          onClick={handleClick}
          height={292}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 8,
          }}
        >
          <CartesianGrid
            strokeDasharray="1 4"
            vertical={false}
            horizontal={true}
          />

          {/* is_authority */}
          <YAxis
            yAxisId="rightAuth"
            orientation="right"
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1, width: 100 }}
            hide={true}
          />
          <Area
            yAxisId="rightAuth"
            type="step"
            dataKey="isAuth"
            activeDot={false}
            dot={false}
            fill={theme.palette.neutrals[100]}
            strokeWidth={0}
          />

          {/* background of the selected session (or range of sessions) */}
          <ReferenceArea
            x1={isRange ? historyRange[0] : historySession}
            x2={isRange ? historyRange[1] : historySession}
            fill={theme.palette.neutrals[200]}
            fillOpacity={0.5}
          />
          {!isRange ? (
            <ReferenceLine
              x={historySession}
              stroke={theme.palette.neutrals[300]}
              strokeWidth={2}
            />
          ) : null}

          {/* points */}
          <XAxis
            style={{ fontSize: "0.8rem" }}
            dataKey="session"
            type="category"
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1 }}
            angle={-30}
            tickMargin={8}
          />
          <YAxis
            type="number"
            width={AXIS_WIDTH}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1, width: 100 }}
          />

          <Line
            type="monotone"
            dataKey="pvPoints"
            dot={false}
            stroke={theme.palette.semantics.grey}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="abPoints"
            dot={false}
            stroke={theme.palette.semantics.purple}
            strokeWidth={2}
          />

          {/* mvr & group mvr */}
          <YAxis
            yAxisId="rightMVR"
            orientation="right"
            width={AXIS_WIDTH}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{
              stroke: theme.palette.semantics.amber,
              strokeWidth: 1,
              width: 100,
            }}
          />
          {/* <Line yAxisId="rightMVR" type="monotone" dataKey="valMvr" dot={false} stroke={theme.palette.primary.main} />
          <Line yAxisId="rightMVR" type="monotone" dataKey="valGroupMvr" dot={false} stroke={theme.palette.semantics.purple} /> */}
          <Line
            yAxisId="rightMVR"
            type="monotone"
            dataKey="mvr"
            dot={false}
            stroke={theme.palette.semantics.amber}
            strokeWidth={2}
          />

          {/* BAR */}
          <YAxis
            yAxisId="rightBAR"
            orientation="right"
            width={AXIS_WIDTH}
            domain={["auto", "auto"]}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{
              stroke: theme.palette.semantics.blue,
              strokeWidth: 1,
              width: 100,
            }}
          />
          <Line
            yAxisId="rightBAR"
            type="monotone"
            dataKey="bar"
            dot={false}
            stroke={theme.palette.semantics.blue}
            strokeWidth={2}
          />

          {/* disputes */}
          <YAxis
            type="number"
            yAxisId="rightDisputes"
            hide={true}
            width={64}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            axisLine={{ stroke: "#C8C9CC", strokeWidth: 1, width: 100 }}
          />
          <Bar
            dataKey="disputes"
            yAxisId="rightDisputes"
            barSize={12}
            shape={<Rectangle radius={[8, 8, 0, 0]} />}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={theme.palette.semantics.red} />
            ))}
          </Bar>

          <Tooltip
            cursor={{ fill: theme.palette.divider }}
            offset={24}
            wrapperStyle={{ zIndex: 100 }}
            content={(props) => renderTooltip(props, theme)}
          />
          <Legend
            verticalAlign="top"
            content={() => renderLegend(theme)}
            height={24}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {isRange ? (
        <ValidatorsHistoryRangeBox
          maxSessions={maxSessions}
          insetLeft={AXIS_WIDTH}
          insetRight={2 * AXIS_WIDTH}
        />
      ) : (
        <ValidatorsHistorySessionBox
          maxSessions={maxSessions}
          insetLeft={AXIS_WIDTH}
          insetRight={2 * AXIS_WIDTH}
          isFetching={isFetching}
        />
      )}
    </Paper>
  );
}
