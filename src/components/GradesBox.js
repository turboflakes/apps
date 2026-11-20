import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";
import GradesPieChart from "./GradesPieChart";
import Tooltip from "./Tooltip";
import GradesInfoBox from "./GradesInfoBox";
import { useGetValidatorsQuery } from "../features/api/validatorsSlice";
import { selectGradesBySession } from "../features/api/sessionsSlice";

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];

export default function GradesBox({ sessionIndex, size }) {
  const theme = useTheme();
  useGetValidatorsQuery(
    {
      session: sessionIndex,
      role: "para_authority",
      summary: true,
    },
    { skip: isNaN(sessionIndex) },
  );
  const rawGrades = useSelector((state) =>
    selectGradesBySession(state, sessionIndex),
  );
  const currentGrades = rawGrades.filter((g) => !isUndefined(g) && !isNull(g));

  if (!rawGrades.length || !currentGrades.length) {
    return (
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: 320,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              width: size === "lg" ? 288 : size === "md" ? 208 : 64,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Skeleton
              variant="circular"
              sx={{ mr: 1, mb: 1 }}
              width={size === "lg" ? 256 : 192}
              height={size === "lg" ? 256 : 192}
            />
          </Box>
          <Box
            sx={{
              ml: 4,
              display: "flex",
              flexDirection: "column",
              width: 144,
              visibility: "hidden",
            }}
          >
            <Box sx={{ ml: 1, display: "flex" }}>
              <InfoOutlinedIcon fontSize="small" />
            </Box>
            <List dense>
              {grades.map((g) => (
                <ListItem key={g}>
                  <ListItemText sx={{ m: 0 }} primary={g} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    );
  }

  const gradesData = grades.map((g) => {
    const quantity = currentGrades.filter((cg) => cg === g).length;
    const percentage = (quantity * 100) / currentGrades.length;
    return {
      name: g,
      value: percentage,
      quantity,
    };
  });

  return (
    <Box
      sx={{
        // m: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        // justifyContent: 'center',
        // alignItems: 'center',
        width: "100%",
        height: 320,
        // borderRadius: 3,
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
    >
      <Box sx={{ display: "flex" }}>
        <GradesPieChart data={gradesData} size={size} showNetworkIcon />
        <Box
          sx={{ ml: 4, display: "flex", flexDirection: "column", width: 144 }}
        >
          <Box sx={{ ml: 1, display: "flex" }}>
            {/* <Typography variant="caption">validator grades</Typography> */}
            <Tooltip
              disableFocusListener
              placement="bottom-end"
              componentsProps={{ tooltip: { sx: { maxWidth: 480 } } }}
              title={
                <GradesInfoBox />
              }
            >
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: theme.palette.action.active }}
              />
            </Tooltip>
          </Box>
          <List dense>
            {gradesData.map((g, i) => (
              <ListItem
                key={i}
                sx={
                  {
                    // bgcolor: theme.palette.grade[g],
                    // borderBottom: `1px solid ${theme.palette.divider}`,
                    // '+ :last-child': { borderBottom: 'none'}
                  }
                }
                secondaryAction={
                  <Typography variant="caption">{`${Math.round(g.value * 100) / 100}%`}</Typography>
                }
              >
                <ListItemIcon sx={{ minWidth: "24px" }}>
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      bgcolor: theme.palette.grade[g.name],
                      display: "inline-block",
                    }}
                  ></Box>
                </ListItemIcon>
                <ListItemText sx={{ m: 0 }} primary={`${g.name}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}
