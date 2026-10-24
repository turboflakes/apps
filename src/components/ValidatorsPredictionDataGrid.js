import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import isNil from "lodash/isNil";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Identicon from "@polkadot/react-identicon";
import GridIdentityLink from "./GridIdentityLink";
import IdentityFilter from "./IdentityFilter";
import PredictionNominatorsDialog from "./PredictionNominatorsDialog";
import {
  useGetSessionByIndexQuery,
  selectSessionCurrent,
} from "../features/api/sessionsSlice";
import { useGetValidatorsQuery } from "../features/api/validatorsSlice";
import {
  selectPredictionValidatorsByTarget,
  useGetPredictionNominatorQuery,
  nominationsByValidator,
} from "../features/api/predictionsSlice";
import { selectChain, selectChainInfo } from "../features/chain/chainSlice";
import {
  selectIdentityFilter,
  selectSubsetFilter,
} from "../features/layout/layoutSlice";
import { stakeDisplay } from "../util/display";
import { chainAddress, isValidAddress, addressSS58 } from "../util/crypto";

const defineColumns = (theme, chain, chainInfo, onOpenNominators) => {
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
        const gradeValue = params.row.grade;
        if (gradeValue && gradeValue !== "-") {
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
    {
      field: "own_stake_pred",
      headerName: `Self Stake (${chainInfo.tokenSymbol})`,
      type: "number",
      width: 144,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.own_stake_pred) ? params.row.own_stake_pred : null,
      renderCell: (params) =>
        !isNull(params.row.own_stake_pred)
          ? Math.round(
              stakeDisplay(
                params.row.own_stake_pred,
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
      field: "nominators_counter_pred",
      headerName: `Nom. Counter`,
      type: "number",
      width: 128,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.nominators_counter_pred)
          ? params.row.nominators_counter_pred
          : null,
      renderCell: (params) =>
        !isNull(params.row.nominators_counter_pred) ? (
          <Link
            component="button"
            color="inherit"
            underline="always"
            sx={{ textDecorationThickness: "2px", textUnderlineOffset: "3px" }}
            onClick={() => onOpenNominators(params.row)}
          >
            {Math.round(params.row.nominators_counter_pred).format()}
          </Link>
        ) : null,
    },
    {
      field: "nominators_stake_pred",
      headerName: `Nom. Stake (${chainInfo.tokenSymbol})`,
      type: "number",
      width: 144,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.nominators_stake_pred)
          ? params.row.nominators_stake_pred
          : null,
      renderCell: (params) =>
        !isNull(params.row.nominators_stake_pred)
          ? Math.round(
              stakeDisplay(
                params.row.nominators_stake_pred,
                chainInfo,
                0,
                false,
                false,
                true,
              ),
            ).format()
          : null,
    },
    // {
    //   field: "nominators_stake",
    //   headerName: `Nom. Stake (${chainInfo.tokenSymbol})`,
    //   type: "number",
    //   width: 144,
    //   headerAlign: "right",
    //   align: "right",
    //   sortable: true,
    //   disableColumnMenu: true,
    //   valueGetter: (params) =>
    //     !isNull(params.row.nominators_stake)
    //       ? params.row.nominators_stake
    //       : null,
    //   renderCell: (params) =>
    //     !isNull(params.row.nominators_stake)
    //       ? Math.round(
    //           stakeDisplay(
    //             params.row.nominators_stake,
    //             chainInfo,
    //             0,
    //             false,
    //             false,
    //             true,
    //           ),
    //         ).format()
    //       : null,
    // },
    // {
    //   field: "nominators_stake_delta",
    //   headerName: `Δ Nom. Stake (${chainInfo.tokenSymbol})`,
    //   type: "number",
    //   width: 208,
    //   headerAlign: "right",
    //   align: "right",
    //   sortable: true,
    //   disableColumnMenu: true,
    //   valueGetter: (params) =>
    //     !isNil(params.row.nominators_stake_pred) &&
    //     !isNil(params.row.nominators_stake)
    //       ? params.row.nominators_stake_pred - params.row.nominators_stake
    //       : null,
    //   renderCell: (params) =>
    //     !isNull(params.value)
    //       ? Math.round(
    //           stakeDisplay(params.value, chainInfo, 0, false, false, true),
    //         ).format()
    //       : null,
    // },
    {
      field: "allocated_stake",
      headerName: `Allocated Stake (${chainInfo.tokenSymbol})`,
      type: "number",
      width: 192,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNil(params.row.allocated_stake)
          ? Number(params.row.allocated_stake)
          : null,
      renderCell: (params) =>
        !isNull(params.value)
          ? stakeDisplay(params.value, chainInfo, 2, true, false, false)
          : null,
    },
    {
      field: "allocated_stake_share",
      headerName: "% of Stake",
      type: "number",
      width: 112,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      // share of the validator total stake allocated by the nominator
      valueGetter: (params) =>
        !isNil(params.row.allocated_stake) &&
        Number(params.row.nominators_stake_pred) > 0
          ? (Number(params.row.allocated_stake) /
              Number(params.row.nominators_stake_pred)) *
            100
          : null,
      renderCell: (params) =>
        !isNull(params.value) ? `${params.value.toFixed(2)}%` : null,
    },
  ];
};

export default function ValidatorsPredictionDataGrid({ target, skip }) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);

  // if the filter is the address of a nominator, the validators nominated by it are
  // also presented, with the stake allocated by it
  const nominatorAddress = isValidAddress(identityFilter?.trim())
    ? addressSS58(identityFilter.trim())
    : undefined;
  // the endpoint fails for addresses that are not nominators, e.g. a validator
  const isValidator = useSelector((state) =>
    (state.predictions.validators[target] ?? []).some(
      (v) => v.address === nominatorAddress,
    ),
  );
  const { currentData: nominator } = useGetPredictionNominatorQuery(
    { target, address: nominatorAddress },
    { skip: !nominatorAddress || isValidator },
  );
  const nominations = nominationsByValidator(nominator);
  const hasNominations = Object.keys(nominations).length > 0;

  // grades are calculated from the para-validators performance in the latest session
  const currentSession = useSelector(selectSessionCurrent);
  const gradeSession = Number.isInteger(currentSession)
    ? currentSession - 1
    : undefined;
  useGetSessionByIndexQuery(
    { index: gradeSession },
    { skip: gradeSession === undefined },
  );
  useGetValidatorsQuery(
    { session: gradeSession, role: "para_authority", show_summary: true },
    { skip: gradeSession === undefined },
  );

  const rows = useSelector((state) =>
    selectPredictionValidatorsByTarget(
      state,
      target,
      identityFilter,
      subsetFilter,
      nominations,
    ),
  );

  const chainInfo = useSelector(selectChainInfo);
  // validator row for which the nominators dialog is opened
  const [nominatorsOf, setNominatorsOf] = React.useState(null);

  if (isUndefined(rows)) {
    return null;
  }

  let columns = defineColumns(theme, selectedChain, chainInfo, setNominatorsOf);

  // the allocated stake is only relevant when searching by a nominator
  if (!hasNominations) {
    columns = columns.filter(
      (c) => !["allocated_stake", "allocated_stake_share"].includes(c.field),
    );
  }

  const pageSize = selectedChain === "polkadot" ? 17 : 24;

  return (
    <Box
      sx={{
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
        {hasNominations ? (
          <Typography variant="subtitle2" sx={{ ml: 2, whiteSpace: "nowrap" }}>
            ← Showing validators nominated by this address
          </Typography>
        ) : null}

        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          {/* <InsightsInfoLegend />*/}
        </Box>
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
          // validators without stake allocated by the searched nominator
          "& .MuiDataGrid-row.not-allocated": {
            bgcolor: theme.palette.grey[100],
          },
        }}
        getRowClassName={(params) =>
          hasNominations && isNil(params.row.allocated_stake)
            ? "not-allocated"
            : ""
        }
        initialState={{
          pagination: {
            pageSize: pageSize,
          },
          sorting: {
            sortModel: [{ field: "score", sort: "desc" }],
          },
        }}
        // onRowClick={handleOnRowClick}
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[pageSize]}
        pagination
        disableSelectionOnClick
      />
      <PredictionNominatorsDialog
        open={!!nominatorsOf}
        onClose={() => setNominatorsOf(null)}
        target={target}
        stash={nominatorsOf?.address}
        totalStake={nominatorsOf?.nominators_stake_pred}
      />
    </Box>
  );
}
