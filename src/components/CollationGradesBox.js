import * as React from "react";
import { useSelector } from "react-redux";
import GradesSmallBox from "./GradesSmallBox";
import {
  selectCollatorsByChainAndSession,
  selectCollatorsSummaryLatest,
} from "../features/api/collatorsSlice";
import { gradeByRatios } from "../util/grade";
import { calculateMCR } from "../util/math";

// Grade majority of the collators of a system chain (`chainKey`) in its latest
// session. The grade of a collator is 1 - MCR, where MCR is the ratio of
// expected blocks that were missed in the closed slots.
export default function CollationGradesBox({ chainKey }) {
  // latest session of the system chain
  const summary = useSelector((state) =>
    selectCollatorsSummaryLatest(state, chainKey),
  );
  const collators = useSelector((state) =>
    selectCollatorsByChainAndSession(state, chainKey, summary?.session),
  );

  const grades = React.useMemo(
    () =>
      collators.map((c) =>
        gradeByRatios(undefined, undefined, calculateMCR(c.eb, c.pb)),
      ),
    [collators],
  );

  return (
    <GradesSmallBox
      grades={grades}
      unit="collators"
      variant="h6"
      height={80}
      pieSize="xs"
    />
  );
}
