import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { DataGrid } from "@mui/x-data-grid";
import Identicon from "@polkadot/react-identicon";
import GridIdentityLink from "./GridIdentityLink";
import IdentityFilter from "./IdentityFilter";
import {
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectCollationSlotBySessionAndPid } from "../features/api/collationSlotsSlice";
import { selectSessionCurrent } from "../features/api/sessionsSlice";
import { selectAll as selectValProfilesAll } from "../features/api/valProfilesSlice";
import { selectIdentityFilter } from "../features/layout/layoutSlice";
import { selectChainInfo, selectChain } from "../features/chain/chainSlice";
import { gradeByRatios } from "../util/grade";
import { calculateMCR } from "../util/math";
import { chainAddress } from "../util/crypto";
import { stashDisplay } from "../util/display";
import { getNetworkSS58Format } from "../constants";

const KINDS = { i: "Invulnerable", p: "Permissionless", v: "Metanode" };

const defineColumns = (theme, chainInfo, selectedChain) => [
  {
    field: "id",
    headerName: "",
    width: 48,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Identicon
        value={chainAddress(params.row.address, chainInfo.ss58Format)}
        size={24}
        theme={"polkadot"}
      />
    ),
  },
  {
    field: "identity",
    headerName: "Identity",
    width: 288,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) =>
      // only metanodes are validators, with a validator page to link to
      params.row.kind === "v" ? (
        <GridIdentityLink address={params.row.address} />
      ) : (
        stashDisplay(
          chainAddress(params.row.address, getNetworkSS58Format(selectedChain)),
        )
      ),
  },
  {
    field: "grade",
    headerName: "Grade",
    width: 80,
    headerAlign: "left",
    align: "left",
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const grade = params.row.grade;
      if (grade === "-") {
        return "-";
      }
      return (
        <Box>
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              bgcolor: theme.palette.grade[grade],
              display: "inline-block",
            }}
          ></Box>
          <Box sx={{ ml: 1, display: "inline-block" }}>{grade}</Box>
        </Box>
      );
    },
  },
  {
    field: "kind",
    headerName: "Kind",
    width: 128,
    disableColumnMenu: true,
    sortable: true,
    valueGetter: (params) => KINDS[params.row.kind] ?? params.row.kind,
  },
  ...[
    ["os", "◷ Owned Slots"],
    ["pb", "■ Authored Blocks"],
    ["mb", "✗■ Missed Blocks"],
    ["ms", "✗◷ Missed Slots"],
    // points are only calculated for metanodes
    ["pt", "Points", (row) => row.kind === "v"],
  ].map(([field, headerName, isAvailable]) => ({
    field,
    headerName,
    type: "number",
    width: 144,
    headerAlign: "right",
    align: "right",
    sortable: true,
    disableColumnMenu: true,
    valueGetter: (params) =>
      isAvailable && !isAvailable(params.row) ? null : params.row[field],
    renderCell: (params) =>
      isUndefined(params.value) || params.value === null
        ? isAvailable
          ? "-"
          : null
        : params.value.format(),
  })),
];

// Collators of the system chain (`chainKey`) in its latest session
export default function CollatorsDataGrid({ chainKey }) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const chainInfo = useSelector(selectChainInfo);
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );
  const collators = useSelector((state) =>
    selectCollatorsByChainAndSession(state, chainKey, summary?.session),
  );

  // open slot of the chain, tied to the current relay session
  const currentSession = useSelector(selectSessionCurrent);
  const slot = useSelector((state) =>
    selectCollationSlotBySessionAndPid(
      state,
      currentSession,
      summary?.para_id,
    ),
  );

  const identityFilter = useSelector(selectIdentityFilter);
  const profiles = useSelector(selectValProfilesAll);
  const [onlyMetanodes, setOnlyMetanodes] = React.useState(false);
  const [onlyLowGrades, setOnlyLowGrades] = React.useState(false);

  const rows = React.useMemo(
    () =>
      collators.map((c) => {
        // the collator that owns the open slot also counts it (the slot is
        // not part of the session stats until it is closed)
        const isOwner = !isUndefined(slot) && c.address === slot.owner;
        return {
          ...c,
          id: `${c.chain_key}_${c.address}`,
          // grade of the closed slots only
          grade: gradeByRatios(undefined, undefined, calculateMCR(c.eb, c.pb)),
          // expected - authored, of the closed slots only
          mb: c.eb - c.pb,
          os: isOwner ? c.os + 1 : c.os,
          pb: isOwner ? c.pb + slot.pb : c.pb,
          pt: isOwner ? c.pt + slot.pt : c.pt,
        };
      }),
    [collators, slot],
  );

  if (isUndefined(chainInfo)) {
    return null;
  }

  // filter by identity (when a profile is available) or by address
  const filter = identityFilter?.toLowerCase();
  const rowsByIdentity = !filter
    ? rows
    : rows.filter(
        (c) =>
          profiles
            .find((p) => p.stash === c.address)
            ?._identity?.toLowerCase()
            .includes(filter) ||
          c.address.toLowerCase().includes(filter) ||
          chainAddress(c.address, chainInfo.ss58Format)
            .toLowerCase()
            .includes(filter),
      );
  const metanodesCounter = rows.filter((c) => c.kind === "v").length;
  const lowGradesCounter = rows.filter((c) => c.grade === "F").length;
  const rowsFiltered = rowsByIdentity
    .filter((c) => !onlyMetanodes || c.kind === "v")
    .filter((c) => !onlyLowGrades || c.grade === "F");

  const columns = defineColumns(theme, chainInfo, selectedChain);
  const pageSize = 17;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <IdentityFilter />
        <FormGroup sx={{ ml: 4, display: "flex", flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                disabled={
                  metanodesCounter === 0 || metanodesCounter === rows.length
                }
                checked={onlyMetanodes}
                onChange={(event) => setOnlyMetanodes(event.target.checked)}
              />
            }
            label="Show only metanodes"
            sx={{
              "& .MuiFormControlLabel-label": { ...theme.typography.caption },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                disabled={lowGradesCounter === 0}
                checked={onlyLowGrades}
                onChange={(event) => setOnlyLowGrades(event.target.checked)}
              />
            }
            label="Show only low grades"
            sx={{
              "& .MuiFormControlLabel-label": { ...theme.typography.caption },
            }}
          />
        </FormGroup>
      </Box>
      <DataGrid
        sx={{
          bgcolor: "#FFF",
          width: "100%",
          borderRadius: 0,
          border: 0,
          "& .MuiDataGrid-footerContainer": { borderTop: 0 },
          "& .MuiDataGrid-cell:focus": { border: 0 },
          // collator that owns the current slot
          "& .current-slot, & .current-slot:hover": {
            bgcolor: theme.palette.neutrals[200],
          },
        }}
        getRowClassName={(params) =>
          !isUndefined(slot) && params.row.address === slot.owner
            ? "current-slot"
            : ""
        }
        initialState={{
          pagination: { pageSize },
          sorting: { sortModel: [{ field: "pt", sort: "desc" }] },
        }}
        rows={rowsFiltered}
        columns={columns}
        rowsPerPageOptions={[pageSize]}
        pagination
        disableSelectionOnClick
      />
    </Box>
  );
}
