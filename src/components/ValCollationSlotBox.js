import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import AlertTooltip from "./Tooltip";
import { useTheme } from "@mui/material/styles";
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import {
  useGetCollatorsQuery,
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import {
  pageChanged,
  collatorsChainChanged,
  collationHiddenChanged,
} from "../features/layout/layoutSlice";
import { isCollationAvailable, getCollationBlocksPerSlot } from "../constants";
import { gradeByRatios } from "../util/grade";
import { calculateMCR } from "../util/math";
import { useAvgBlockTime } from "./AvgBlockTime";

// Time as `N secs`, `N min(s)` or `Xh Ym`
const timeDisplay = (seconds) => {
  if (seconds < 60) {
    const secs = Math.max(1, Math.ceil(seconds));
    return `${secs} ${secs > 1 ? "secs" : "sec"}`;
  }
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes > 1 ? "mins" : "min"}`;
  }
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

export default function ValCollationSlotBox({ address, chainKey, name }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedChain = useSelector(selectChain);
  const currentSession = useSelector(selectSessionCurrent);
  const isReady = isCollationAvailable(selectedChain) && !isNaN(currentSession);
  // also subscribes to the updates of the chain
  useGetCollatorsQuery(
    { chain_key: chainKey, stats: true, slot: true },
    { skip: !isReady },
  );
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );
  const collators = useSelector((state) =>
    selectCollatorsByChainAndSession(state, chainKey, summary?.session),
  );
  // open slot of the chain, tied to the current relay session
  const slot = useSelector((state) =>
    selectCollationSlotBySessionAndPid(
      state,
      currentSession,
      summary?.para_id,
    ),
  );
  const avgBlockTime = useAvgBlockTime(chainKey);
  const blocksPerSlot = getCollationBlocksPerSlot(selectedChain, chainKey);

  const collator = collators.find((c) => c.address === address);

  if (!isReady || isUndefined(collator)) {
    return null;
  }

  // opens the collators page with the chain selected
  const handleOnClick = () => {
    dispatch(collatorsChainChanged(chainKey));
    dispatch(collationHiddenChanged(false));
    dispatch(pageChanged("collators"));
    const params = new URLSearchParams(searchParams);
    params.set("para", summary.para_id);
    navigate(`/collators?${params.toString()}`);
  };

  // the collator needs attention when its grade in the chain is F
  const isLowGrade =
    gradeByRatios(undefined, undefined, calculateMCR(collator.eb, collator.pb)) ===
    "F";
  const missedBlocks = collator.eb - collator.pb;

  const isOwner = !isUndefined(slot) && slot.cix === collator.cix;

  const total = Math.max(...collators.map((c) => c.cix)) + 1;
  const slotsAhead = !isUndefined(slot)
    ? (collator.cix - slot.cix + total) % total
    : undefined;
  // the rest of the open slot plus the slots in between
  const seconds =
    !isUndefined(slotsAhead) && !isUndefined(avgBlockTime)
      ? ((blocksPerSlot - slot.pb) +
          (slotsAhead - 1) * blocksPerSlot) *
        avgBlockTime
      : undefined;

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
        bgcolor: isOwner ? (theme) => theme.palette.neutrals[200] : "default",
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
        <Typography
          variant="caption"
          onClick={handleOnClick}
          sx={{
            whiteSpace: "nowrap",
            width: "fit-content",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {isOwner ? `${name} current slot` : `${name}`}
        </Typography>
        <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
          {isOwner
            ? `${slot.pb.format()} of ${blocksPerSlot} blocks`
            : !isUndefined(seconds)
              ? `Slot in ~${timeDisplay(seconds)}`
              : "-"}
        </Typography>
        <Tooltip
          title={
            isOwner
              ? `${slot.pb.format()} of ${blocksPerSlot} blocks produced · ${slot.pt.format()} points`
              : `${blocksPerSlot} blocks per slot`
          }
          arrow
        >
          <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {Array.from({ length: blocksPerSlot }, (_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: (theme) =>
                    isOwner
                      ? i < slot.pb
                        ? theme.palette.neutrals[300]
                        : theme.palette.neutrals[100]
                      : theme.palette.neutrals[200],
                }}
              />
            ))}
          </Box>
        </Tooltip>
      </Box>
      {isLowGrade ? (
        <Box
          sx={{
            px: 1,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <AlertTooltip
            disableFocusListener
            placement="bottom-start"
            bgcolor={theme.palette.semantics.red}
            title={
              <Box sx={{ p: 1, minWidth: "144px" }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  <b>This collator needs attention!</b>
                </Typography>
                <Typography
                  component="div"
                  variant="caption"
                  color="textSecondary"
                >
                  Low Grade F: <b>{missedBlocks.format()} missed blocks</b> of{" "}
                  {collator.eb.format()} expected
                </Typography>
              </Box>
            }
          >
            {/* NOTE: the tooltip passes its bgcolor to this child, so it is reset */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "transparent",
                cursor: "pointer",
              }}
            >
              <Box sx={{ width: "16px", height: "16px", flexShrink: 0 }}>
                <Box
                  sx={{
                    width: "16px",
                    height: "16px",
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
                    }}
                  ></Box>
                </Box>
              </Box>
              <Typography
                sx={{ ml: 1 }}
                variant="h6"
                color={theme.palette.semantics.red}
              >
                {missedBlocks.format()}
              </Typography>
            </Box>
          </AlertTooltip>
        </Box>
      ) : null}
    </Paper>
  );
}
