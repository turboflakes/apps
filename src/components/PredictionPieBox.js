import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

// `slices` is a list of `{ name, value, color, display }`, where `display` is the
// formatted value presented in the tooltip. The percentage of the first slice is
// presented in the center of the pie.
const renderTooltip = (props) => {
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
          minWidth: "176px",
        }}
      >
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: "8px", color: data.fill }}>●</span>
          {data.payload.name}: <b>{data.payload.display}</b> (
          {Math.round((data.payload.value / data.payload.total) * 100)}%)
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function PredictionPieBox({
  label,
  value,
  subtitle,
  slices,
  isLoading,
}) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        sx={{
          width: "100%",
          height: 96,
          borderRadius: 3,
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          bgcolor: "white",
        }}
      />
    );
  }

  const total = slices.map((s) => s.value).reduce((a, b) => a + b, 0);
  const pieData = slices.map((s) => ({ ...s, total }));

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 96,
        borderRadius: 3,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box sx={{ px: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          {label}
        </Typography>
        <Typography variant="h5">{value}</Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ px: 1, display: "flex", justifyContent: "flex-end" }}>
        <PieChart width={64} height={64}>
          <Pie
            isAnimationActive={false}
            dataKey="value"
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={32}
            innerRadius={20}
            startAngle={90}
            endAngle={-360}
            labelLine={false}
          >
            {pieData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                stroke={theme.palette.background.paper}
                strokeWidth={1}
              />
            ))}
          </Pie>
          {total > 0 ? (
            <text
              x="50%"
              y="50%"
              fill="#343434"
              style={{
                fontFamily: theme.typography.caption.fontFamily,
                fontSize: theme.typography.caption.fontSize,
                fontWeight: "bold",
              }}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {`${Math.round((pieData[0].value / total) * 100)}%`}
            </text>
          ) : null}
          <Tooltip
            cursor={{ fill: "transparent" }}
            wrapperStyle={{ zIndex: 100 }}
            content={renderTooltip}
          />
        </PieChart>
      </Box>
    </Paper>
  );
}
