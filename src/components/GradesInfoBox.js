import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { selectChain } from "../features/chain/chainSlice";
import { isCollationAvailable } from "../constants";

// Content of the grades info tooltip.
// The collation ratios are described if `collation` is true. It defaults to
// whether the selected network supports collation.
export default function GradesInfoBox({ collation }) {
  const selectedChain = useSelector(selectChain);
  const isCollation = collation ?? isCollationAvailable(selectedChain);
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="caption">
        {isCollation
          ? "A grade is calculated based on the ratios of the services performed, namely validation (BVR and BAR) and collation (MCR):"
          : "A grade is calculated as 75% of the Backing Votes Ratio (BVR) combined with 25% of the Bitfields Availability Ratio (BAR) for one or more validators:"}
      </Typography>
      <ul>
        <li>{"A+ = RATIO > 99%"}</li>
        <li>{"A = RATIO > 95%"}</li>
        <li>{"B+ = RATIO > 90%"}</li>
        <li>{"B = RATIO > 80%"}</li>
        <li>{"C+ = RATIO > 70%"}</li>
        <li>{"C = RATIO > 60%"}</li>
        <li>{"D+ = RATIO > 50%"}</li>
        <li>{"D = RATIO > 40%"}</li>
        <li>{"F = RATIO <= 40%"}</li>
      </ul>
      {isCollation ? (
        <>
          <i>RATIO (validators) = 0.75*BVR + 0.25*BAR</i>
          <br />
          <i>RATIO (collators) = 1 - MCR</i>
          <br />
          <i>RATIO (metanodes) = 1 - (0.6*MVR + 0.15*BUR + 0.25*MCR)</i>
          <br />
        </>
      ) : (
        <>
          <i>RATIO = 0.75*BVR + 0.25*BAR</i>
          <br />
        </>
      )}
      <i>BVR = 1 - MVR</i>
      <br />
      <i>Backing Votes Ratio (BVR)</i>
      <br />
      <i>Missed Votes Ratio (MVR)</i>
      <br />
      <i>Bitfields Availability Ratio (BAR)</i>
      <br />
      {isCollation ? (
        <>
          <i>Bitfields Unavailability Ratio (BUR)</i>
          <br />
          <i>Missed Collation Ratio (MCR)</i>
          <br />
        </>
      ) : null}
    </Box>
  );
}
