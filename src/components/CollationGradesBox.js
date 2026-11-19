import * as React from "react";
import { useSelector } from "react-redux";
import GradesSmallBox from "./GradesSmallBox";
import {
  selectCollatorsAll,
} from "../features/api/collatorsSlice";
import { gradeByRatios } from "../util/grade";
import { calculateMCR } from "../util/math";

// Grade majority of the collators of a system chain (paraId) in its latest
// session. The grade of a collator is 1 - MCR, where MCR is the ratio of
// expected blocks that were missed in the closed slots.
export default function CollationGradesBox({ paraId, name }) {

  const collators = useSelector(selectCollatorsAll);
  const summaries = useSelector((state) => state.collators.summaries);

  const grades = React.useMemo(() => {
    const latest = Math.max(
      -1,
      ...Object.values(summaries)
        .filter((s) => s.para_id === paraId)
        .map((s) => s.session),
    );
    return collators
      .filter((c) => c.para_id === paraId && c.session === latest)
      .map((c) =>
        gradeByRatios(undefined, undefined, calculateMCR(c.eb, c.pb)),
      );
  }, [collators, summaries, paraId]);

  return (
    <GradesSmallBox
      grades={grades}
      label={`${name} collation grade`}
      unit="collators"
      variant="h6"
      height={80}
      pieSize="xs"
    />
  );
}
