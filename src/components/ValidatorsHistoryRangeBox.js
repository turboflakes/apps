import * as React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import isEqual from "lodash/isEqual";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Spinner from "./Spinner";
import SessionSliderRange from "./SessionSliderRange";
import {
  useGetSessionsQuery,
  sessionHistoryIdsChanged,
  sessionHistoryRangeChanged,
  selectSessionCurrent,
  selectSessionHistoryIds,
  selectSessionHistoryRange,
  selectSessionsByIds,
  buildSessionIdsArrayHelper,
} from "../features/api/sessionsSlice";
import { extendedApi } from "../features/api/validatorsSlice";

// The range always covers whole eras: the start is moved to the first session
// of its era and the end to the last session of its era (within the sessions
// of the timeline).
const snapRangeToEras = (range, sessions) => {
  const first = sessions.find((s) => s.six === range[0]);
  const last = sessions.find((s) => s.six === range[1]);
  if (isUndefined(first?.eix) || isUndefined(last?.eix)) {
    return range;
  }
  return [
    Math.min(...sessions.filter((s) => s.eix === first.eix).map((s) => s.six)),
    Math.max(...sessions.filter((s) => s.eix === last.eix).map((s) => s.six)),
  ];
};

export default function ValidatorsHistoryRangeBox({
  maxSessions,
  insetLeft,
  insetRight,
}) {
  const isAligned = insetLeft !== undefined && insetRight !== undefined;
  const dispatch = useDispatch();
  const currentSession = useSelector(selectSessionCurrent);
  const historySessionIds = useSelector(selectSessionHistoryIds);
  const range = useSelector(selectSessionHistoryRange);
  const [isFetching, setIsFetching] = React.useState(false);

  // the sessions of the timeline (stats and eras)
  const windowIds = React.useMemo(
    () => buildSessionIdsArrayHelper(currentSession - 1, maxSessions),
    [currentSession, maxSessions],
  );
  const { isFetching: isFetchingSessions } = useGetSessionsQuery(
    { number_last_sessions: maxSessions, stats: true },
    { skip: isNaN(currentSession) },
  );
  // NOTE: shallowEqual, as the selector returns a new array on every call
  const allSessions = useSelector(
    (state) => selectSessionsByIds(state, windowIds),
    shallowEqual,
  );
  const sessions = React.useMemo(
    () => allSessions.filter((s) => !isUndefined(s)),
    [allSessions],
  );

  // the slider covers the sessions of the timeline
  React.useEffect(() => {
    if (windowIds.length && !isEqual(windowIds, historySessionIds)) {
      dispatch(sessionHistoryIdsChanged(windowIds));
    }
  }, [windowIds, historySessionIds, dispatch]);

  // the range is kept inside the timeline and on whole eras
  React.useEffect(() => {
    if (!sessions.length || sessions.length < windowIds.length) {
      return;
    }
    const clamped = [
      Math.min(Math.max(range[0], windowIds[0]), windowIds[windowIds.length - 1]),
      Math.min(Math.max(range[1], windowIds[0]), windowIds[windowIds.length - 1]),
    ];
    const snapped = snapRangeToEras(clamped, sessions);
    if (!isEqual(snapped, range)) {
      dispatch(sessionHistoryRangeChanged(snapped));
    }
  }, [range, sessions, windowIds, dispatch]);

  // the eras of the range, with the first and the last session of each one
  const eras = React.useMemo(() => {
    const inRange = sessions.filter(
      (s) => s.six >= range[0] && s.six <= range[1],
    );
    return [...new Set(inRange.map((s) => s.eix))].map((eix) => {
      const ids = sessions.filter((s) => s.eix === eix).map((s) => s.six);
      return { from: Math.min(...ids), to: Math.max(...ids) };
    });
  }, [sessions, range]);
  // the effect only runs when the eras change, not on every store update
  const erasKey = JSON.stringify(eras);
  // eras already loaded (a loaded era is not requested again)
  const loadedEras = React.useRef(new Set());

  // loads the validators of every era of the range, one era at a time
  React.useEffect(() => {
    const pending = JSON.parse(erasKey).filter(
      (e) => !loadedEras.current.has(`${e.from}_${e.to}`),
    );
    if (!pending.length) {
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setIsFetching(true);
      for (const era of pending) {
        if (cancelled) {
          break;
        }
        try {
          const result = await dispatch(
            extendedApi.endpoints.getValidators.initiate(
              {
                role: "authority",
                from: era.from,
                to: era.to,
                summary: true,
                profile: true,
                discovery: true,
              },
              { subscribe: false },
            ),
          );
          if (!result.isError) {
            loadedEras.current.add(`${era.from}_${era.to}`);
          }
        } catch (err) {
          // the era is skipped
        }
      }
      if (!cancelled) {
        setIsFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [erasKey, dispatch]);

  const isLoading = isFetching || isFetchingSessions;

  if (!sessions.length) {
    return null;
  }

  return (
    <Box
      sx={{
        p: isAligned ? 0 : 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          my: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            flex: 1,
            ml: isAligned ? `${Math.max(0, insetLeft - 8)}px` : 0,
            mr: isAligned ? "-24px" : 0,
          }}
        >
          <SessionSliderRange
            isFetching={isLoading}
            sessions={sessions}
            range={range}
            onRangeChange={(newRange) =>
              dispatch(
                sessionHistoryRangeChanged(snapRangeToEras(newRange, sessions)),
              )
            }
          />
        </Box>
        <Box
          sx={{
            mx: isAligned ? 0 : 1,
            ...(isAligned
              ? {
                  width: `${insetRight}px`,
                  display: "flex",
                  justifyContent: "center",
                  mb: "20px",
                }
              : {}),
          }}
        >
          {isLoading ? <Spinner size={24} /> : null}
        </Box>
      </Box>
    </Box>
  );
}
