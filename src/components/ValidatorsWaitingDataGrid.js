import * as React from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Identicon from "@polkadot/react-identicon";
import GridIdentityLink from "./GridIdentityLink";
import IdentityFilter from "./IdentityFilter";
import InsightsInfoLegend from "./InsightsInfoLegend";
import { commissionDisplayNumber } from "../util/display";
import { selectValidatorsWaitingBySessions } from "../features/api/validatorsSlice";
import { selectChain, selectChainInfo } from "../features/chain/chainSlice";
import {
  selectIdentityFilter,
  selectSubsetFilter,
} from "../features/layout/layoutSlice";
import { stakeDisplay } from "../util/display";
import { chainAddress } from "../util/crypto";

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
      field: "commission",
      headerName: "Commission",
      width: 112,
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
      field: "own_stake",
      headerName: `Self Stake (${chainInfo.tokenSymbol})`,
      type: "number",
      width: 144,
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
      field: "nominators_counter",
      headerName: `Nom. Counter`,
      type: "number",
      width: 128,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.nominators_counter)
          ? params.row.nominators_counter
          : null,
      renderCell: (params) =>
        !isNull(params.row.nominators_counter)
          ? Math.round(params.row.nominators_counter).format()
          : null,
    },
    {
      field: "nominators_stake",
      headerName: `Nom. Stake (${chainInfo.tokenSymbol})`,
      type: "number",
      width: 144,
      headerAlign: "right",
      align: "right",
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) =>
        !isNull(params.row.nominators_stake)
          ? params.row.nominators_stake
          : null,
      renderCell: (params) =>
        !isNull(params.row.nominators_stake)
          ? Math.round(
              stakeDisplay(
                params.row.nominators_stake,
                chainInfo,
                0,
                false,
                false,
                true,
              ),
            ).format()
          : null,
    },
  ];
};

export default function ValidatorsWaitingDataGrid({ sessionIndex, skip }) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);

  const rows = useSelector((state) =>
    selectValidatorsWaitingBySessions(
      state,
      [sessionIndex],
      false,
      identityFilter,
      subsetFilter,
    ),
  );

  const chainInfo = useSelector(selectChainInfo);

  if (isUndefined(rows)) {
    return null;
  }

  let columns = defineColumns(theme, selectedChain, chainInfo);

  columns =
    selectedChain !== "polkadot"
      ? columns
      : columns.filter((c) => c.field !== "commission");

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

        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          <InsightsInfoLegend />
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
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[pageSize]}
        pagination
        disableSelectionOnClick
      />
    </Box>
  );
}
