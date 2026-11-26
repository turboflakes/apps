import * as React from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import Box from "@mui/material/Box";
import SessionSliderRange from "./SessionSliderRange";
import { useGetSessionsQuery } from "../features/api/sessionsSlice";
import {
  selectAllSessionsAH,
  selectSessionCurrentIndexAH,
} from "../features/api/sessionsAHSlice";
import {
  selectAllSessionsPP,
  selectSessionCurrentIndexPP,
} from "../features/api/sessionsPPSlice";
import {
  selectAllSessionsBU,
  selectSessionCurrentIndexBU,
} from "../features/api/sessionsBUSlice";
import {
  extendedApi,
  selectCollatorsSummaryByChainAndSession,
} from "../features/api/collatorsSlice";
import {
  selectCollatorsHistoryRange,
  collatorsHistoryRangeChanged,
} from "../features/layout/layoutSlice";

const SELECT_ALL = {
  ah: selectAllSessionsAH,
  pp: selectAllSessionsPP,
  bu: selectAllSessionsBU,
};

const SELECT_CURRENT = {
  ah: selectSessionCurrentIndexAH,
  pp: selectSessionCurrentIndexPP,
  bu: selectSessionCurrentIndexBU,
};

export const useCollatorsHistorySessions = (chainKey, maxSessions) => {
  const sessions = useSelector(SELECT_ALL[chainKey]);
  const currentSession = useSelector(SELECT_CURRENT[chainKey]);
  return React.useMemo(
    () =>
      sessions
        .filter((s) => s.six < currentSession)
        .sort((a, b) => a.six - b.six)
        .slice(-maxSessions),
    [sessions, currentSession, maxSessions],
  );
};

const SLIDER_MARGIN_LEFT = 8;
const SLIDER_MARGIN_RIGHT = 24;

export default function CollatorsHistoryRangeBox({
  chainKey,
  maxSessions,
  insetLeft = SLIDER_MARGIN_LEFT,
  insetRight = SLIDER_MARGIN_RIGHT,
}) {
  const dispatch = useDispatch();
  const store = useStore();
  useGetSessionsQuery({
    chain_key: chainKey,
    number_last_sessions: maxSessions,
    stats: true,
  });
  const sessions = useCollatorsHistorySessions(chainKey, maxSessions);
  const range = useSelector((state) =>
    selectCollatorsHistoryRange(state, chainKey),
  );
  const [isFetching, setIsFetching] = React.useState(false);

  // by default the latest era (6 sessions) of the timeline is selected
  React.useEffect(() => {
    if (!range && sessions.length) {
      dispatch(
        collatorsHistoryRangeChanged({
          chainKey,
          range: [
            sessions[Math.max(0, sessions.length - 6)].six,
            sessions[sessions.length - 1].six,
          ],
        }),
      );
    }
  }, [range, sessions, chainKey, dispatch]);

  // loads the collators of the sessions of the range that are not loaded yet
  React.useEffect(() => {
    if (!range) {
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setIsFetching(true);
      for (let session = range[0]; session <= range[1] && !cancelled; session++) {
        if (
          selectCollatorsSummaryByChainAndSession(
            store.getState(),
            chainKey,
            session,
          )
        ) {
          continue;
        }
        try {
          await dispatch(
            extendedApi.endpoints.getCollators.initiate(
              { chain_key: chainKey, session, stats: true },
              { subscribe: false },
            ),
          );
        } catch (err) {
          // the session is skipped
        }
      }
      if (!cancelled) {
        setIsFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [range, chainKey, dispatch, store]);

  if (!range || !sessions.length) {
    return null;
  }

  return (
    <Box
      sx={{
        ml: `${Math.max(0, insetLeft - SLIDER_MARGIN_LEFT)}px`,
        mr: `${Math.max(0, insetRight - SLIDER_MARGIN_RIGHT)}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SessionSliderRange
        isFetching={isFetching}
        sessions={sessions}
        range={range}
        onRangeChange={(newRange) =>
          dispatch(
            collatorsHistoryRangeChanged({ chainKey, range: newRange }),
          )
        }
      />
    </Box>
  );
}
