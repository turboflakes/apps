import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import isUndefined from "lodash/isUndefined";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { selectCollatorsSummaryLatest } from "../features/api/collatorsSlice";
import {
  selectCollatorsChain,
  collatorsChainChanged,
  pageChanged,
} from "../features/layout/layoutSlice";

// Selects the system chain of the collators. The para id of the chain is kept
// in the url (`para`) and selects the chain when the page is loaded.
export default function ChainToggle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // shared with the overview, where the other chain is collapsed
  const chainKey = useSelector(selectCollatorsChain);

  const paraIds = {
    ah: useSelector((state) => selectCollatorsSummaryLatest(state, "ah"))
      ?.para_id,
    pp: useSelector((state) => selectCollatorsSummaryLatest(state, "pp"))
      ?.para_id,
    bu: useSelector((state) => selectCollatorsSummaryLatest(state, "bu"))
      ?.para_id,
  };
  const [searchParams, setSearchParams] = useSearchParams();

  const para = searchParams.get("para");
  const appliedPara = React.useRef(null);
  const paraChainKey = Object.keys(paraIds).find(
    (k) => !isUndefined(paraIds[k]) && String(paraIds[k]) === para,
  );
  React.useEffect(() => {
    if (!isUndefined(paraChainKey) && appliedPara.current !== para) {
      appliedPara.current = para;
      dispatch(collatorsChainChanged(paraChainKey));
    }
  }, [dispatch, para, paraChainKey]);

  const handleChainChange = (event, value) => {
    if (value === "rc") {
      const params = new URLSearchParams(searchParams);
      params.delete("para");
      const query = params.toString();
      dispatch(pageChanged("insights"));
      navigate(query ? `/insights?${query}` : "/insights");
    } else if (value !== null) {
      dispatch(collatorsChainChanged(value));
      if (!isUndefined(paraIds[value])) {
        searchParams.set("para", paraIds[value]);
        setSearchParams(searchParams);
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={chainKey}
      size="small"
      exclusive
      onChange={handleChainChange}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <ToggleButton
        value="rc"
        aria-label="Relay"
        disableRipple
        disableFocusRipple
        sx={{
          px: 2,
          mr: 1,
          border: 0,
          "&.Mui-selected": { borderRadius: 16 },
          "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
            borderRadius: 16,
          },
        }}
      >
        Relay
        <FontAwesomeIcon icon={faLink} style={{ marginLeft: 8 }} />
      </ToggleButton>
      <ToggleButton
        value="ah"
        aria-label="Asset Hub"
        disableRipple
        disableFocusRipple
        sx={{
          px: 2,
          mr: 1,
          border: 0,
          "&.Mui-selected": { borderRadius: 16 },
          "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
            borderRadius: 16,
          },
          "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
            borderRadius: 16,
          },
        }}
      >
        Asset Hub
        <FontAwesomeIcon icon={faLink} style={{ marginLeft: 8 }} />
      </ToggleButton>
      <ToggleButton
        value="pp"
        aria-label="People"
        disableRipple
        disableFocusRipple
        sx={{
          px: 2,
          mr: 1,
          border: 0,
          "&.Mui-selected": { borderRadius: 16 },
          "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
            borderRadius: 16,
          },
          "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
            borderRadius: 16,
          },
        }}
      >
        People
        <FontAwesomeIcon icon={faLink} style={{ marginLeft: 8 }} />
      </ToggleButton>
      <ToggleButton
        value="bu"
        aria-label="Bulletin"
        disableRipple
        disableFocusRipple
        sx={{
          px: 2,
          border: 0,
          "&.Mui-selected": { borderRadius: 16 },
          "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
            borderRadius: 16,
          },
        }}
      >
        Bulletin
        <FontAwesomeIcon icon={faLink} style={{ marginLeft: 8 }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
