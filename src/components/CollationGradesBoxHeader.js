import * as React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import GradesPieChart from "./GradesPieChart";
import {
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { gradeByRatios } from "../util/grade";
import { calculateMCR } from "../util/math";

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];

// Grades of the collators of a system chain (`chain_key`) in its latest
// session, as a pie chart
export default function CollationGradesBoxHeader({ dark, chain_key }) {
  const theme = useTheme();
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chain_key),
  );
  const collators = useSelector((state) =>
    selectCollatorsByChainAndSession(state, chain_key, summary?.session),
  );

  const gradesData = React.useMemo(() => {
    const collatorGrades = collators
      .map((c) => gradeByRatios(undefined, undefined, calculateMCR(c.eb, c.pb)))
      .filter((g) => g !== "-");
    if (!collatorGrades.length) {
      return undefined;
    }
    return grades.map((g) => {
      const quantity = collatorGrades.filter((cg) => cg === g).length;
      return {
        name: g,
        value: Math.round((quantity * 100) / collatorGrades.length),
        quantity,
      };
    });
  }, [collators]);

  if (!gradesData) {
    return (
      <Skeleton
        variant="circular"
        sx={{ mx: 2, bgcolor: theme.palette.grey[100] }}
        width={40}
        height={40}
      />
    );
  }

  // grade with the highest percentage
  const topGrade = gradesData
    .slice()
    .filter((a) => !!a.quantity)
    .sort((a, b) => b.value - a.value)[0];

  return (
    <Box sx={{ mx: 2, display: "flex", alignItems: "center" }}>
      <GradesPieChart data={gradesData} size="xs" dark={dark} />
      <Box sx={{ mx: 2, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="caption1"
          color={dark ? theme.palette.text.secondary : "default"}
          sx={{ whiteSpace: 'nowrap' }}
        >
          top grade
        </Typography>
        <Typography
          variant="h6"
          color={
            dark ? theme.palette.text.secondary : theme.palette.text.primary
          }
        >
          {topGrade.name}
        </Typography>
      </Box>
    </Box>
  );
}
