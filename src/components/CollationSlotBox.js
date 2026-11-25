import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import {
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import {
  selectValProfileByAddress,
  useGetValidatorProfileByAddressQuery,
} from "../features/api/valProfilesSlice";
import { isCollationAvailable, getNetworkSS58Format } from "../constants";
import { nameDisplay, nameDisplayMiddle, stashDisplay } from "../util/display";
import { chainAddress } from "../util/crypto";
import CollationEmptyBox from "./CollationEmptyBox";

const BLOCKS_PER_SLOT = 12;

export default function CollationSlotBox({ chainKey, name }) {
  const selectedChain = useSelector(selectChain);
  const currentSession = useSelector(selectSessionCurrent);
  const isReady = isCollationAvailable(selectedChain) && !isNaN(currentSession);

  // latest session of the system chain (not the relay chain session)
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );
  // open slot of the chain, tied to the current relay session
  const slot = useSelector((state) =>
    selectCollationSlotBySessionAndPid(
      state,
      currentSession,
      summary?.para_id,
    ),
  );

  // identity of the collator that owns the slot (set only for metanodes or
  // collators that have a validator profile)
  useGetValidatorProfileByAddressQuery(slot?.owner, {
    skip: isUndefined(slot),
  });
  const profile = useSelector((state) =>
    selectValProfileByAddress(state, slot?.owner),
  );

  const collators = useSelector((state) =>
    selectCollatorsByChainAndSession(state, chainKey, summary?.session),
  );
  const nextOwner = React.useMemo(() => {
    if (isUndefined(slot) || !collators.length) {
      return undefined;
    }
    const total = Math.max(...collators.map((c) => c.cix)) + 1;
    return collators.find((c) => c.cix === (slot.cix + 1) % total)?.address;
  }, [collators, slot]);
  useGetValidatorProfileByAddressQuery(nextOwner, {
    skip: isUndefined(nextOwner),
  });
  const nextProfile = useSelector((state) =>
    selectValProfileByAddress(state, nextOwner),
  );

  if (!isReady || isUndefined(slot)) {
    return (
      <CollationEmptyBox bgcolor={(theme) => theme.palette.neutrals[200]} />
    );
  }

  const owner = chainAddress(slot.owner, getNetworkSS58Format(selectedChain));

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
        bgcolor: (theme) => theme.palette.neutrals[200],
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
          {name} current slot
        </Typography>
        <Typography variant="h6">
          {profile?.identity
            ? nameDisplay(profile._identity, 32)
            : stashDisplay(owner, 4)}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tooltip
            title={`${slot.pb.format()} of ${BLOCKS_PER_SLOT} blocks produced · ${slot.pt.format()} points`}
            arrow
          >
            <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {Array.from({ length: BLOCKS_PER_SLOT }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: (theme) => i < slot.pb ? theme.palette.neutrals[300] : theme.palette.neutrals[100],
                  }}
                />
              ))}
            </Box>
          </Tooltip>

        {!isUndefined(nextOwner) && (
            <Typography variant="caption"
              sx={{ whiteSpace: "nowrap" }}>
              {`next ${
                nextProfile?.identity
                  ? nameDisplayMiddle(nextProfile._identity, 20)
                  : stashDisplay(
                      chainAddress(
                        nextOwner,
                        getNetworkSS58Format(selectedChain),
                      ),
                      4,
                    )
              }`}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
