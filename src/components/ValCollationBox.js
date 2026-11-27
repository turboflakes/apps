import * as React from "react";
import { useSelector, shallowEqual } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import {
  useGetValidatorsQuery,
  selectCollationSummaryByAddressAndSessions,
} from "../features/api/validatorsSlice";
import {
  selectSessionCurrent,
  buildSessionIdsArrayHelper,
} from "../features/api/sessionsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import {
  useGetCollatorsQuery,
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { calculateMCR } from "../util/math";

function useOpenSlotBlocks(address, chainKey, skip) {
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
  return !skip && !isUndefined(slot) && !isUndefined(collator) &&
    slot.cix === collator.cix
    ? slot
    : undefined;
}

function useChainMcrs(address, chainKey, skip) {
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
  if (skip || !collators.some((c) => c.address === address)) {
    return [];
  }
  return collators
    .map((c) => calculateMCR(c.eb, c.pb))
    .filter((mcr) => !isUndefined(mcr));
}

// What each box shows, from the collation summary of the validator
const METRICS = {
  blocks: {
    caption: "collation blocks",
    value: (c) => (c.pb + c.open).format(),
    subtitle: (c) =>
      c.eb > 0
        ? `${Math.floor((c.pb * 1000) / c.eb) / 10}% from ${c.os.format()} owned slots`
        : `${c.os.format()} owned slots`,
    description: (c) =>
      c.open > 0
        ? `${c.pb.format()} + ${c.open.format()} in the current slot`
        : `${c.pb.format()} of ${c.eb.format()} expected blocks`,
  },
  points: {
    caption: "collation points",
    value: (c) => (c.pt + c.openPt).format(),
    description: (c) => `${c.os.format()} owned slots`,
  },
  mcr: {
    caption: "missed collation ratio",
    value: (c) => {
      const mcr = calculateMCR(c.eb, c.pb);
      return isUndefined(mcr) ? "-" : mcr !== 0 ? mcr.toFixed(4) : 0;
    },
    description: (c) => `${(c.eb - c.pb).format()} missed blocks`,
  },
};

export default function ValCollationBox({ address, metric, maxSessions }) {
  const theme = useTheme();
  const isHistory = !isUndefined(maxSessions);
  const currentSession = useSelector(selectSessionCurrent);
  // same request as the other history boxes of the validator
  useGetValidatorsQuery(
    {
      address,
      number_last_sessions: maxSessions,
      summary: true,
      stats: false,
      fetch_peers: true,
    },
    { skip: !isHistory },
  );
  const sessionIds = isHistory
    ? buildSessionIdsArrayHelper(currentSession - 1, maxSessions)
    : [currentSession];
  const collation = useSelector(
    (state) =>
      selectCollationSummaryByAddressAndSessions(state, address, sessionIds),
    shallowEqual,
  );

  const skipMcrs = isHistory || metric !== "mcr";
  const allMcrs = [
    ...useChainMcrs(address, "ah", skipMcrs),
    ...useChainMcrs(address, "pp", skipMcrs),
    ...useChainMcrs(address, "bu", skipMcrs),
  ];

  const skipSlots = isHistory || metric === "mcr";
  const openSlots = [
    useOpenSlotBlocks(address, "ah", skipSlots),
    useOpenSlotBlocks(address, "pp", skipSlots),
    useOpenSlotBlocks(address, "bu", skipSlots),
  ].filter((slot) => !isUndefined(slot));
  const open = openSlots.reduce((acc, slot) => acc + slot.pb, 0);
  const openPt = openSlots.reduce((acc, slot) => acc + slot.pt, 0);

  // NOTE: when a slot closes its blocks are no longer the open slot but are
  // only in the summary after it is refetched, so the total is not allowed to
  // go back within the same session
  const highest = React.useRef({ key: undefined, total: 0, points: 0 });

  if (isUndefined(collation)) {
    return null;
  }

  const key = `${address}-${currentSession}`;
  if (highest.current.key !== key) {
    highest.current = { key, total: 0, points: 0 };
  }
  const total = Math.max(collation.pb + open, highest.current.total);
  const points = Math.max(collation.pt + openPt, highest.current.points);
  highest.current.total = skipSlots ? 0 : total;
  highest.current.points = skipSlots ? 0 : points;
  const data = skipSlots
    ? { ...collation, open, openPt }
    : {
        ...collation,
        open: total - collation.pb,
        openPt: points - collation.pt,
      };
  const { caption, value, subtitle } = METRICS[metric];
  // difference (%) of the MCR to the average MCR of the collators
  const mcr = calculateMCR(collation.eb, collation.pb);
  const avg = allMcrs.length
    ? allMcrs.reduce((a, b) => a + b, 0) / allMcrs.length
    : 0;
  const diff =
    !skipMcrs && !!avg && !!mcr
      ? Math.round((mcr * 100 / avg - 100) * 10) / 10
      : undefined;
  const period = isHistory
    ? `last ${maxSessions.format()} sessions`
    : `since session ${currentSession.format()} started`;

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
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Box
        sx={{
          px: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          {caption}
        </Typography>
        <Typography variant="h6" sx={{ width: "fit-content" }}>
          {value(data)}
        </Typography>
        {!isUndefined(diff) ? (
          <Tooltip
            title={
              diff === 0
                ? "Same as the average of MCR of all collators of the chain."
                : `${Math.abs(diff)}% ${diff > 0 ? "more" : "less"} than the average of MCR of all collators of the chain in the current session.`
            }
            arrow
          >
            <Typography
              variant="subtitle2"
              sx={{
                lineHeight: 0.875,
                whiteSpace: "nowrap",
                width: "fit-content",
                color:
                  diff > 0
                    ? theme.palette.semantics.red
                    : theme.palette.semantics.green,
              }}
            >
              <b style={{ whiteSpace: "pre" }}>
                {diff !== 0 ? (diff > 0 ? `+${diff}%` : `-${Math.abs(diff)}%`) : " "}
              </b>
            </Typography>
          </Tooltip>
        ) : (
          <Typography
            variant="subtitle2"
            sx={{ whiteSpace: "nowrap", lineHeight: 0.875 }}
          >
            {subtitle ? subtitle(data) : period}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
