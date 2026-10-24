import * as React from "react";
import { useSelector } from "react-redux";
import isNull from "lodash/isNull";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Identicon from "@polkadot/react-identicon";
import { useGetPredictionValidatorNominatorsQuery } from "../features/api/predictionsSlice";
import { selectValProfileByAddress } from "../features/api/valProfilesSlice";
import { selectChainInfo } from "../features/chain/chainSlice";
import { stakeDisplay, stashDisplay, nameDisplay } from "../util/display";
import { chainAddress } from "../util/crypto";

const PAGE_SIZES = [10, 25, 50];

const defineColumns = (chainInfo, totalStake) => [
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
    field: "address",
    headerName: "Nominator",
    width: 464,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params) =>
      chainAddress(params.row.address, chainInfo.ss58Format),
  },
  {
    field: "allocated_stake",
    headerName: `Allocated Stake (${chainInfo.tokenSymbol})`,
    type: "number",
    width: 192,
    headerAlign: "right",
    align: "right",
    sortable: true,
    disableColumnMenu: true,
    valueGetter: (params) => Number(params.row.allocated_stake),
    renderCell: (params) =>
      stakeDisplay(params.value, chainInfo, 2, true, false, false),
  },
  {
    field: "share",
    headerName: "% of Stake",
    type: "number",
    width: 112,
    headerAlign: "right",
    align: "right",
    sortable: true,
    disableColumnMenu: true,
    valueGetter: (params) =>
      Number(totalStake) > 0
        ? (Number(params.row.allocated_stake) / Number(totalStake)) * 100
        : null,
    renderCell: (params) =>
      !isNull(params.value) ? `${params.value.toFixed(2)}%` : null,
  },
];

// Nominators backing a validator in a prediction target. The list is paginated
// by the server.
export default function PredictionNominatorsDialog({
  open,
  onClose,
  target,
  stash,
  totalStake,
}) {
  const theme = useTheme();
  const chainInfo = useSelector(selectChainInfo);
  const profile = useSelector((state) =>
    selectValProfileByAddress(state, stash),
  );
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZES[0]);

  // start from the first page every time the dialog is opened for a validator
  React.useEffect(() => {
    setPage(0);
  }, [stash, target, open]);

  const { data, isFetching } = useGetPredictionValidatorNominatorsQuery(
    { target, stash, page, size: pageSize },
    { skip: !open || !stash },
  );

  const rows = (data?.data ?? []).map((n) => ({ ...n, id: n.address }));
  const identity = profile?._identity ?? stashDisplay(stash, 4);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Nominators backing {nameDisplay(identity, 32)}
        </Typography>
        <Typography variant="subtitle2" component="div">
          {`Prediction for a validator set of ${target}`}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ height: 644, width: "100%" }}>
          <DataGrid
            sx={{
              bgcolor: "#FFF",
              border: 0,
              "& .MuiDataGrid-footerContainer": { borderTop: 0 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
                {
                  fontFamily: theme.typography.body2.fontFamily,
                  fontSize: theme.typography.body2.fontSize,
                  lineHeight: theme.typography.body2.lineHeight,
                },
              "& .MuiDataGrid-cell:focus": { border: 0 },
            }}
            rows={rows}
            columns={defineColumns(chainInfo, totalStake)}
            loading={isFetching}
            localeText={{
              MuiTablePagination: { labelRowsPerPage: "Rows" },
            }}
            paginationMode="server"
            rowCount={data?.total ?? 0}
            page={page}
            pageSize={pageSize}
            rowsPerPageOptions={PAGE_SIZES}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(0);
            }}
            // the pagination is only needed if the nominators don't fit in the smallest page
            hideFooterPagination={(data?.total ?? 0) <= PAGE_SIZES[0]}
            pagination
            disableSelectionOnClick
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
