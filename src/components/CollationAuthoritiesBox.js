import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "./Tooltip";
import { selectCollationKindLatest } from "../features/api/collationKindSlice";
import {
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import {
  pageChanged,
  collatorsChainChanged,
} from "../features/layout/layoutSlice";
import { gradeByRatios } from "../util/grade";
import { calculateMCR } from "../util/math";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";
import CollationEmptyBox from "./CollationEmptyBox";

const customTitle = (lowGrades, theme) => (
  <Box sx={{ p: 1, minWidth: "144px" }}>
    <Typography variant="h6" color="textSecondary" gutterBottom>
      <b>Some collators need attention!</b>
    </Typography>
    <Typography
      component="div"
      variant="caption"
      color="textSecondary"
      gutterBottom
    >
      <span style={{ color: theme.palette.text.primary }}></span>Low Grade F:{" "}
      <b>
        {lowGrades} {lowGrades > 1 ? `collators` : `collator`}
      </b>
    </Typography>
  </Box>
);

export default function CollationAuthoritiesBox({ chainKey, name }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const isReady = isCollationAvailable(selectedChain);
  const kind = useSelector((state) =>
    selectCollationKindLatest(state, chainKey),
  );

  // collators of the latest session with the lowest grade
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );
  const collators = useSelector((state) =>
    selectCollatorsByChainAndSession(state, chainKey, summary?.session),
  );
  const lowGrades = collators.filter(
    (c) => gradeByRatios(undefined, undefined, calculateMCR(c.eb, c.pb)) === "F",
  ).length;

  if (!isReady || isUndefined(kind)) {
    return <CollationEmptyBox />;
  }

  const { i, p, v } = kind;

  const handleOnClick = () => {
    dispatch(collatorsChainChanged(chainKey));
    dispatch(pageChanged("collators"));
    navigate("/collators", { state: { onlyLowGrades: true } });
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 80,
        borderRadius: 3,
        bgcolor: 'default',
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box
        sx={{
          px: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          {name} collators
        </Typography>
        <Typography variant="h6">{(i + p + v).format()}</Typography>
        <Typography
          variant="subtitle2"
          sx={{ whiteSpace: "nowrap", lineHeight: 0.875 }}
        >
          {`${v.format()} metanodes`}
        </Typography>
      </Box>
      {lowGrades > 0 ? (
        <Box
          sx={{
            px: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <Tooltip
            disableFocusListener
            placement="bottom-start"
            bgcolor={theme.palette.semantics.red}
            title={customTitle(lowGrades, theme)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "right",
                bgcolor: "transparent",
                cursor: "pointer",
              }}
              onClick={handleOnClick}
            >
              <Box sx={{ width: "16px" }}>
                <Box
                  sx={{
                    animation: "pulse 1s infinite ease-in-out alternate",
                    borderRadius: "50%",
                    boxShadow: "rgba(223, 35, 38, 0.8) 0px 0px 16px",
                  }}
                >
                  <Box
                    sx={{
                      width: "16px",
                      height: "16px",
                      bgcolor: theme.palette.semantics.red,
                      borderRadius: "50%",
                      textAlign: "center",
                    }}
                  ></Box>
                </Box>
              </Box>
              <Typography
                sx={{ ml: 1 }}
                variant="h6"
                color={theme.palette.semantics.red}
              >
                {lowGrades}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      ) : null}
    </Paper>
  );
}
