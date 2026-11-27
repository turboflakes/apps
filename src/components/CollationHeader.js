import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  useGetCollatorsQuery,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { selectChain } from "../features/chain/chainSlice";
import {
  selectCollationHidden,
  pageChanged,
  collatorsChainChanged,
  collationHiddenChanged,
} from "../features/layout/layoutSlice";
import { isCollationAvailable } from "../constants";
import SessionBoxHeader from "./SessionBoxHeader";
import FinalizedBlockBoxHeader from "./FinalizedBlockBoxHeader";
import FinalityLagBoxHeader from "./FinalityLagBoxHeader";
import AvgBlockTimeBoxHeader from "./AvgBlockTimeBoxHeader";
import CollationGradesBoxHeader from "./CollationGradesBoxHeader";

export default function CollationHeader({ chainKey, name, isCollatorsTab }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedChain = useSelector(selectChain);
  const isReady = isCollationAvailable(selectedChain);
  const hidden = useSelector((state) => selectCollationHidden(state, chainKey));

  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );

  useGetCollatorsQuery(
    { chain_key: chainKey, kind_counter: true, slot: true, stats: true },
    { skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  const handleOnClick = () => {
    dispatch(collatorsChainChanged(chainKey));
    dispatch(collationHiddenChanged(false));
    dispatch(pageChanged("collators"));
    const params = new URLSearchParams(searchParams);
    if (summary?.para_id) {
      params.set("para", summary.para_id);
    }
    const query = params.toString();
    navigate(query ? `/collators?${query}` : "/collators");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 40,
        mb: 0,
      }}
    >
      <Typography
        variant="h6"
        ml={1}
        onClick={isCollatorsTab ? undefined : handleOnClick}
        sx={
          isCollatorsTab
            ? undefined
            : { cursor: "pointer", "&:hover": { textDecoration: "underline" } }
        }
      >
        {name}
      </Typography>
      {hidden && !isCollatorsTab ? (
        <CollationGradesBoxHeader chain_key={chainKey} />
      ) : null}
      <Box sx={{ ml: 1, flexGrow: 1, display: "flex" }}></Box>
      {/* right aligned in the collators tab */}
      {hidden && isCollatorsTab ? (
        <CollationGradesBoxHeader chain_key={chainKey} />
      ) : null}
      <Box sx={{ display: "flex", alignItems: "center" }}>

        {isCollatorsTab ? <SessionBoxHeader chain_key={chainKey} /> : null}
        <FinalizedBlockBoxHeader chain_key={chainKey} />
        <FinalityLagBoxHeader chain_key={chainKey} />
        {isCollatorsTab ? <AvgBlockTimeBoxHeader chain_key={chainKey} /> : null}
      </Box>
    </Box>
  );
}
