import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
// import FormHelperText from '@mui/material/FormHelperText';
import Switch from "@mui/material/Switch";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { DataGrid } from "@mui/x-data-grid";
import Identicon from "@polkadot/react-identicon";
import DetailsIcon from "./DetailsIcon";
import Tooltip from "./Tooltip";
import GridIdentityLink from "./GridIdentityLink";
import IdentityFilter from "./IdentityFilter";
import InsightsInfoLegend from "./InsightsInfoLegend";
import { gradeByRatios } from "../util/grade";
import { commissionDisplayNumber } from "../util/display";
import {
  useGetValidatorsQuery,
  selectValidatorsInsightsBySessions,
} from "../features/api/validatorsSlice";
import { selectPredictionsByValidator } from "../features/api/predictionsSlice";
import { PREDICTION_TARGETS } from "./PredictionTargetFilter";
import { selectChain, selectChainInfo } from "../features/chain/chainSlice";
import {
  selectIdentityFilter,
  selectSubsetFilter,
  selectInsightsColumnVisibilityModel,
  insightsColumnVisibilityModelChanged,
} from "../features/layout/layoutSlice";
import { stakeDisplay, scoreDisplay, versionDisplay } from "../util/display";
import {
  isChainSupported,
  getChainName,
  isCollationAvailable,
} from "../constants";
import { chainAddress } from "../util/crypto";

// One circle for each prediction target, filled if the validator is included in
// that target and with a visible border and white background if not
function PredictionsCell({ targets, mvr, bur, mcr }) {
  const theme = useTheme();
  // filled with the current grade of the validator, if it has one
  const grade = gradeByRatios(mvr, bur, mcr);
  const gradeColor =
    grade !== "-" ? theme.palette.grade[grade] : theme.palette.grey[900];
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {PREDICTION_TARGETS.map((target) => {
        const isIncluded = !!targets?.includes(target);
        return (
          <Tooltip key={target} title={
            isIncluded ? `Included in prediction target ${target}` : `Not included in prediction target ${target}`
          } placement="top" arrow>
            <Box
              sx={{
                boxSizing: "border-box",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: `1px solid ${
                  isIncluded ? gradeColor : theme.palette.grey[400]
                }`,
                bgcolor: isIncluded ? gradeColor : "#fff",
                display: "inline-block",
              }}
            ></Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}

// preset groups of columns, toggled together
const COLUMN_GROUPS = [
  {
    label: "Performance",
    fields: ["grade","mvr", "bar", "mcr", "score"],
  },
  { label: "Stake", fields: ["own_stake", "commission"] },
  { label: "Predictions", fields: ["predictions"] },
  { label: "Version", fields: ["node_version"] },
  { label: "Authority", fields: ["authored_blocks", "authored_pts"] },
  {
    label: "Para-Validation",
    fields: [
      "paraId",
      "core_assignments",
      "implicit_votes",
      "explicit_votes",
      "missed_votes",
      "availability",
      "unavailability",
      "disputes",
      "avg_pts"
    ],
  },
  {
    label: "Collation",
    fields: ["collation_owned_slots", "collation_produced_blocks", "collation_missed_blocks", "collation_missed_slots", "collation_points", "collation_chains", "mcr"],
  },
];

const defineColumns = (theme, chain, chainInfo) => {
  return [
    {
      field: "id",
      headerName: "",
      width: 48,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.address) {
          return (
            <Identicon
              value={chainAddress(params.row.address, chainInfo.ss58Format)}
              size={24}
              theme={"polkadot"}
            />
          );
        }
        return <div>-</div>;
      },
    },
    {
      field: "identity",
      headerName: "Identity",
      width: 288,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        if (!params.row.address) {
          return null;
        }
        return <GridIdentityLink address={params.row.address} />;
      },
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 64,
      headerAlign: "left",
      align: "left",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const gradeValue = gradeByRatios(
          params.row.mvr,
          params.row.bur,
          params.row.mcr,
        );
        if (gradeValue !== "-") {
          return (
            <Box>
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  bgcolor: theme.palette.grade[gradeValue],
                  display: "inline-block",
                }}
              ></Box>
              <Box sx={{ ml: 1, display: "inline-block" }}>{gradeValue}</Box>
            </Box>
          );
        }
        return "-";
      },
    },
    // {
    //   field: "subset",
    //   headerName: "Subset",
    //   width: 80,
    //   headerAlign: "left",
    //   align: "left",
    //   sortable: false,
    //   disableColumnMenu: true,
    // },
    {
      field: "own_stake",
      headerName: `Self Stake (${chainInfo.tokenSymbol})`,
      type: "number",
      width: 96,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.own_stake) ? params.row.own_stake : null,
      renderCell: (params) =>
        !isNull(params.row.own_stake)
          ? Math.round(
              stakeDisplay(
                params.row.own_stake,
                chainInfo,
                0,
                false,
                false,
                true,
              ),
            ).format()
          : null,
    },
    {
      field: "commission",
      headerName: "Commission",
      width: 80,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.own_stake)
          ? commissionDisplayNumber(params.row.commission)
          : null,
      renderCell: (params) =>
        !isNull(params.row.own_stake)
          ? `${commissionDisplayNumber(params.row.commission)}%`
          : null,
    },
    {
      field: "predictions",
      headerName: "Prediction",
      width: 96,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      // sorted by the number of prediction targets available
      valueGetter: (params) => params.row.predictions?.length ?? 0,
      renderCell: (params) => (
        <PredictionsCell
          targets={params.row.predictions}
          mvr={params.row.mvr}
          bur={params.row.bur}
          mcr={params.row.mcr}
        />
      ),
    },
    {
      field: "node_version",
      headerName: "Version",
      width: 80,
      headerAlign: "right",
      align: "right",
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!isNull(params.row.node_version)) {
          const version = versionDisplay(params.row.node_version);
          return <Box title={params.row.node_version}>{version}</Box>;
        }
        return "-";
      },
    },
    {
      field: "authored_blocks",
      headerName: "❒",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "authored_pts",
      headerName: "Authored Points",
      type: "number",
      width: 96,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.authored_blocks)
          ? params.row.authored_blocks * 20
          : null,
    },
    {
      field: "paraId",
      headerName: "Backing Parachain",
      width: 128,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.paraId)
          ? isChainSupported(chain, params.row.paraId)
            ? getChainName(chain, params.row.paraId)
            : params.row.paraId
          : null,
    },
    {
      field: "disputes",
      headerName: "↔",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "core_assignments",
      headerName: "↻",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "implicit_votes",
      headerName: "✓i",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "explicit_votes",
      headerName: "✓e",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "missed_votes",
      headerName: "✗v",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "mvr",
      headerName: "MVR",
      type: "number",
      width: 96,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.mvr)
          ? Math.round(params.row.mvr * 10000) / 10000
          : null,
    },
    {
      field: "availability",
      headerName: "✓b",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "unavailability",
      headerName: "✗b",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "bar",
      headerName: "BAR",
      type: "number",
      width: 96,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.bar)
          ? params.row.bar !== 0
            ? params.row.bar.toFixed(4)
            : 0
          : null,
    },
    {
      field: "avg_pts",
      headerName: "Backing Points",
      type: "number",
      width: 128,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.avg_pts) ? Math.round(params.row.avg_pts) : null,
    },
    {
      field: "collation_owned_slots",
      headerName: "◷",
      type: "number",
      width: 64,
      disableColumnMenu: true,
    },
    {
      field: "collation_chains",
      headerName: "Collation Chains",
      width: 128,
      disableColumnMenu: true,
      valueGetter: (params) =>
        params.row.collation_chains?.length
          ? params.row.collation_chains
              .map((pid) =>
                isChainSupported(chain, pid) ? getChainName(chain, pid) : pid,
              )
              .join(", ")
          : null,
    },
    {
      field: "collation_produced_blocks",
      headerName: "■",
      type: "number",
      width: 72,
      disableColumnMenu: true,
    },
    {
      field: "collation_missed_blocks",
      headerName: "✗b",
      type: "number",
      width: 72,
      disableColumnMenu: true,
    },
    {
      field: "collation_missed_slots",
      headerName: "✗s",
      type: "number",
      width: 72,
      disableColumnMenu: true,
    },
    {
      field: "mcr",
      headerName: "MCR",
      type: "number",
      width: 96,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.mcr)
          ? params.row.mcr !== 0
            ? params.row.mcr.toFixed(4)
            : 0
          : null,
    },
    {
      field: "collation_points",
      headerName: "Collation Points",
      type: "number",
      width: 128,
      disableColumnMenu: true,
    },
    {
      field: "score",
      headerName: "Score",
      type: "number",
      width: 96,
      disableColumnMenu: true,
      // sortingOrder: ['asc', 'desc'],
      valueGetter: (params) => scoreDisplay(params.row.score),
    },
    {
      field: "options",
      headerName: "",
      width: 72,
      align: "right",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.row.address) {
          return null;
        }
        return <DetailsIcon address={params.row.address} />;
      },
    },
  ];
};

export default function ValidatorsDataGrid({ sessionIndex, skip }) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);

  const { isSuccess } = useGetValidatorsQuery(
    {
      session: sessionIndex,
      role: "authority",
      show_summary: true,
      show_profile: true,
      show_preds: true,
      show_discovery: true,
    },
    { refetchOnMountOrArgChange: true, skip },
  );
  const rows = useSelector((state) =>
    selectValidatorsInsightsBySessions(
      state,
      [sessionIndex],
      false,
      identityFilter,
      subsetFilter,
    ),
  );
  const predictionsByValidator = useSelector(selectPredictionsByValidator);
  const [showOnlyPV, setShowOnlyPV] = React.useState(true);
  // const [showAllGrades, setShowAllGrades] = React.useState(false);
  const [onlyDisputes, setOnlyDisputes] = React.useState(false);
  const [onlyLowGrades, setOnlyLowGrades] = React.useState(false);
  const [onlyMetanodes, setOnlyMetanodes] = React.useState(false);
  // columns hidden by the user: { [field]: false }
  // shared by the insights grids and boxes, so the boxes can follow the columns
  const dispatch = useDispatch();
  const columnVisibilityModel = useSelector(
    selectInsightsColumnVisibilityModel,
  );
  const setColumnVisibilityModel = (model) =>
    dispatch(insightsColumnVisibilityModelChanged(model));
  const [columnsAnchor, setColumnsAnchor] = React.useState(null);
  const chainInfo = useSelector(selectChainInfo);

  if (isUndefined(rows) && !isSuccess) {
    return null;
  }

  const rowsFiltered1 = showOnlyPV ? rows.filter((v) => !isNull(v.mvr)) : rows;
  // const rowsFiltered2 = showAllGrades ? rowsFiltered1 : rowsFiltered1.filter((v) => !isUndefined(v.mvr) ? grade(1-v.mvr) !== 'F' : false);
  const rowsFiltered3 = onlyDisputes
    ? rows.filter((v) => v.disputes > 0)
    : rowsFiltered1;
  const rowsFiltered4 = onlyLowGrades
    ? rows.filter((v) => gradeByRatios(v.mvr, v.bur, v.mcr) === "F")
    : rowsFiltered3;
  const metanodesCounter = rows.filter((v) => v.is_collator).length;
  const rowsFiltered5 = onlyMetanodes
    ? rows.filter((v) => v.is_collator)
    : rowsFiltered4;
  const gradeFsCounter = rowsFiltered1.filter(
    (v) => gradeByRatios(v.mvr, v.bur, v.mcr) === "F",
  ).length;
  const disputesCounter = rows.filter((v) => v.disputes > 0).length;

  let columns =
    disputesCounter > 0
      ? defineColumns(theme, selectedChain, chainInfo)
      : defineColumns(theme, selectedChain, chainInfo).filter(
          (c) => c.field !== "disputes",
        );

  columns =
    selectedChain !== "polkadot"
      ? columns
      : columns.filter((c) => c.field !== "commission");

  // predictions are only available for polkadot
  columns =
    selectedChain === "polkadot"
      ? columns
      : columns.filter((c) => c.field !== "predictions");

  // collation columns are only available for the networks that support it
  columns = isCollationAvailable(selectedChain)
    ? columns
    : columns.filter(
        (c) => c.field !== "mcr" && !c.field.startsWith("collation_"),
      );

  const handleOnlyPVChange = (event) => {
    setShowOnlyPV(event.target.checked);
  };

  // const handleViewAllGradesChange = (event) => {
  //   setShowAllGrades(event.target.checked);
  // };

  const handleOnlyDisputesChange = (event) => {
    setOnlyDisputes(event.target.checked);
  };

  const handleOnlyLowGradesChange = (event) => {
    setOnlyLowGrades(event.target.checked);
  };

  const handleOnlyMetanodesChange = (event) => {
    setOnlyMetanodes(event.target.checked);
  };

  const pageSize = selectedChain === "polkadot" ? 17 : 24;

  return (
    <Box
      sx={{
        position: "relative",
        // p: 2,
        // m: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        // height: '2768px',
        // borderRadius: 3,
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
    >
      <Box
        sx={{
          position: "relative",
          mb: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IdentityFilter />
        <FormGroup sx={{ ml: 4, display: "flex", flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showOnlyPV}
                onChange={handleOnlyPVChange}
              />
            }
            label="Show only active para-validators"
            sx={{
              "& .MuiFormControlLabel-label": {
                ...theme.typography.caption,
              },
            }}
          />
          {isCollationAvailable(selectedChain) ? (
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  disabled={
                    metanodesCounter === 0 || metanodesCounter === rows.length
                  }
                  checked={onlyMetanodes}
                  onChange={handleOnlyMetanodesChange}
                />
              }
              label="Show only metanodes"
              sx={{
                "& .MuiFormControlLabel-label": {
                  ...theme.typography.caption,
                },
              }}
            />
          ) : null}
          <FormControlLabel
            control={
              <Switch
                size="small"
                disabled={disputesCounter === 0}
                checked={onlyDisputes}
                onChange={handleOnlyDisputesChange}
              />
            }
            label="Show only disputes"
            sx={{
              "& .MuiFormControlLabel-label": {
                ...theme.typography.caption,
              },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                disabled={gradeFsCounter === 0}
                checked={onlyLowGrades}
                onChange={handleOnlyLowGradesChange}
              />
            }
            label="Show only low grades"
            sx={{
              "& .MuiFormControlLabel-label": {
                ...theme.typography.caption,
              },
            }}
          />
          {/* <FormControlLabel control={
              <Switch size="small" disabled={gradeFsCounter === 0 || onlyDisputes || onlyLowGrades} checked={showAllGrades || onlyDisputes || onlyLowGrades}
                onChange={handleViewAllGradesChange} />
            }
            label="Show all grades"
            sx={{
              '& .MuiFormControlLabel-label' : {
                ...theme.typography.caption
              }
            }}/> */}
        </FormGroup>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            size="medium"
            onClick={(e) => setColumnsAnchor(e.currentTarget)}
          >
            <ViewColumnIcon fontSize="small" />
          </IconButton>
        </Box>
        <Menu
          anchorEl={columnsAnchor}
          open={Boolean(columnsAnchor)}
          onClose={() => setColumnsAnchor(null)}
        >
          {COLUMN_GROUPS.map((group) => {
            const fields = group.fields.filter((f) =>
              columns.some((c) => c.field === f),
            );
            if (!fields.length) {
              return null;
            }
            const visible = fields.filter(
              (f) => columnVisibilityModel[f] !== false,
            ).length;
            return (
              <MenuItem
                key={group.label}
                dense
                onClick={() =>
                  setColumnVisibilityModel({
                    ...columnVisibilityModel,
                    // hide the whole group if all visible, show it otherwise
                    ...Object.fromEntries(
                      fields.map((f) => [f, visible < fields.length]),
                    ),
                  })
                }
              >
                <Checkbox
                  size="small"
                  edge="start"
                  checked={visible === fields.length}
                  indeterminate={visible > 0 && visible < fields.length}
                />
                <Typography variant="caption">
                  <b>{group.label}</b>
                </Typography>
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      <DataGrid
        sx={{
          bgcolor: "#FFF",
          width: "100%",
          borderRadius: 0,
          border: 0,
          "& .MuiDataGrid-footerContainer": {
            borderTop: 0,
          },
          "& .MuiDataGrid-cell:focus": {
            border: 0,
          },
        }}
        initialState={{
          pagination: {
            pageSize: pageSize,
          },
          sorting: {
            sortModel: [{ field: "score", sort: "desc" }],
          },
        }}
        // onRowClick={handleOnRowClick}
        rows={rowsFiltered5.map((v) => ({
          ...v,
          predictions: predictionsByValidator[v.address]?.targets,
        }))}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        rowsPerPageOptions={[pageSize]}
        pagination
        disableSelectionOnClick
      />
      {/* bottom left corner of the grid, the footer pagination is on the right */}
      <Box sx={{ position: "absolute", left: 8, bottom: 8 }}>
        <InsightsInfoLegend placement="right-end" />
      </Box>
    </Box>
  );
}
