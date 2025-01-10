import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, Cell, ReferenceLine, 
  CartesianGrid, Tooltip as TooltipChart, ResponsiveContainer, Rectangle, Legend } from 'recharts';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircleIcon from '@mui/icons-material/Circle';
import HistoryErasMenu from './HistoryErasMenu';
import Spinner from './Spinner';
import {
  useGetValidatorsQuery,
  selectValidatorsByAddressAndSessions,
  selectParaAuthoritySessionsByAddressAndSessions
} from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
  selectSessionHistory,
  selectMVRBySessions,
  selectBARBySessions,
  selectSessionByIndex,
  sessionHistoryChanged,
  useGetSessionByIndexQuery,
  buildSessionIdsArrayHelper
} from '../features/api/sessionsSlice';
import {
  selectValProfileByAddress,
} from '../features/api/valProfilesSlice';
import { grade } from '../util/grade'
import { calculateMVR } from '../util/mvr'
import { nameDisplay } from '../util/display'

const renderTooltip = (props, identiy, theme) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          p: 2,
          m: 0,
          borderRadius: 1,
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Box sx={{mb: 2}}>
          <Typography component="div" variant="caption" color="inherit">
            <b>{identiy}</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>Session // {data.session}</i>
          </Typography>
        </Box>
        {data.isAuth ? 
          <Box sx={{ minWidth: '192px'}}>
            {/* <Typography component="div" variant="caption" color="inherit" gutterBottom>
              <b>Backing subsystem</b>
            </Typography>
            <Typography component="div" variant="caption" color="inherit">
              (✓i) Seconded: {data.iv}
            </Typography>
            <Typography component="div" variant="caption" color="inherit">
              (✓e) Valid: {data.ev}
            </Typography>
            <Typography component="div" variant="caption" color="inherit">
              (✗) Missed: {data.mv}
            </Typography>
            <Divider sx={{ my: 1 }} /> */}
            {/* <Typography component="div" variant="caption" color="inherit" gutterBottom>
              <b>Legend</b>
            </Typography> */}
            {data.isPara ?
            <Box>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.grade[data.gradeValue]}}>❚</span>Backing Points: <b>{data.pvPoints.format()}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.secondary.main }}>❚</span>Authored Block Points: <b>{data.abPoints.format()}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.semantics.red}}>❚</span>Disputes: <b>{data.disputes.format()}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.primary.main }}>●</span>MVR: <b>{Math.round(data.valMvr * 10000) / 10000}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.semantics.purple }}>●</span>MVR (Val. Group {`${data.group}`}): <b>{Math.round(data.valGroupMvr * 10000) / 10000}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>●</span>MVR (All Para-Authorities): <b>{Math.round(data.sessionMvr * 10000) / 10000}</b>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography component="div" variant="subtitle2" color="inherit">
                Para-Authority
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                  <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', 
                              bgcolor: theme.palette.grade[data.gradeValue] }}>
                  </Box>
                  <Typography variant="caption" sx={{ml: 1}}><b>{data.gradeValue}</b></Typography>
                </Box>
              </Box>
            </Box> : 
            <Box>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.secondary.main }}>❚</span>Authored Block Points: <b>{data.abPoints}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>●</span>MVR (All Para-Authorities): <b>{Math.round(data.sessionMvr * 10000) / 10000}</b>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography component="div" variant="subtitle2" color="inherit">
                Authority
              </Typography>
            </Box>}
          </Box> : 
          <Box>
            <Box>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>●</span>MVR (All Para-Authorities): <b>{Math.round(data.sessionMvr * 10000) / 10000}</b>
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography component="div" variant="subtitle2" color="inherit">
              Not Authority
            </Typography>
          </Box>
        }
        
      </Box>
    );
  }

  return null;
};

const renderLegend = (theme) => {
  return (
    <Box sx={{mt: -1, mr: 9, display: 'flex', justifyContent: 'flex-end'}}>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.secondary.main}}>❚</span>Backing Points
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.secondary.main }}>❚</span>Authored Block Points
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.semantics.red }}>❚</span>Disputes
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.primary.main }}>●</span>MVR
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.semantics.purple }}>●</span>MVR (Val. Group)
      </Typography>
      <Typography variant="caption" color="inherit">
        <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>●</span>MVR (All Para-Authorities)
      </Typography>
    </Box>
  );
}

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function ValidatorSessionHistoryTimelineChart({address, maxSessions, noBorderRadius, showDark, noDots}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentSession = useSelector(selectSessionCurrent);
  const historySession = useSelector(selectSessionHistory);
  const { isFetching: isFetchingSession } = useGetSessionByIndexQuery({index: historySession});
  // const {isSuccess: isSessionSuccess } = useGetSessionsQuery({number_last_sessions: maxSessions, show_stats: true});
  const {isFetching} = useGetValidatorsQuery({address: address, number_last_sessions: maxSessions, show_summary: true, show_stats: false, fetch_peers: true });
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1 , maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds));
  const allMVRs = useSelector(state => selectMVRBySessions(state, historySessionIds));

  // TODO: add bitfields availability to the chart
  // const allBARs = useSelector(state => selectBARBySessions(state, historySessionIds));
  
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const paraSessions = useSelector(state => selectParaAuthoritySessionsByAddressAndSessions(state, address, historySessionIds));
  // const [sessionIndex, setSessionIndex] = useSessionIndex(historySession);
  const prevCount = usePrevious(paraSessions.length);
  const historySessionSelected = useSelector(state => selectSessionByIndex(state, historySession));
  
  if (isFetching || isUndefined(paraSessions) || isUndefined(historySessionSelected)) {
    return (<Skeleton variant="rounded" sx={{
      mt: 2,
      width: '100%',
      minHeight: 400,
      borderRadius: noBorderRadius ? 0 : 3,
      boxShadow: showDark ? 'rgba(149, 157, 165, 0) 0px 8px 24px' : 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: showDark ? theme.palette.background.secondary : theme.palette.background.primary
    }} />)
  }

  if (!isUndefined(prevCount) && paraSessions.length > 0 && prevCount !== paraSessions.length) {
    setTimeout(() => (dispatch(sessionHistoryChanged(paraSessions[paraSessions.length - 1])), 100));
  }

  if (validators.filter(v => !isUndefined(v)).length !== maxSessions || allMVRs.length !== maxSessions) {
    return null
  }

  const data = validators.map((v, i) => ({
    session: v.session,
    isAuth: v.is_auth ? 1 : 0,
    isPara: v.is_para ? 1 : 0,
    abPoints: v.is_auth ? v.auth.ab.length * 20 : 0,
    pvPoints: v.is_para && (v.auth.ep - v.auth.sp) >= (v.auth.ab.length * 20) ? (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20) : 0,
    gradeValue: v.is_para && !isUndefined(v.para_summary) ? grade(1 - calculateMVR(v.para_summary?.ev, v.para_summary?.iv, v.para_summary?.mv)) : '',
    valMvr: v.is_para && !isUndefined(v.para_summary) ? calculateMVR(v.para_summary?.ev, v.para_summary?.iv, v.para_summary?.mv) : 0,
    valGroupMvr: v.is_para ? v._val_group_mvr : 0,  
    disputes: v.is_para && !isUndefined(v.para) && !isUndefined(v.para.disputes) ? v.para.disputes.length : 0,
    group: v.is_para ? v.para.group : '',
    sessionMvr: allMVRs[i]
  }));

  const totalDisputes = validators
    .map(v => v.is_para && !isUndefined(v.para) && !isUndefined(v.para.disputes) ? v.para.disputes.length : 0)
    .reduce((a, b) => a + b, 0);

  const handleClick = (newSession) => {
    // setSessionIndex(newSession);
    if (historySession !== newSession) {
      setTimeout(() => dispatch(sessionHistoryChanged(newSession)), 50);
    }
  };

  return (
    <Paper sx={{ 
      mt: 2,
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: "100%",
      minHeight: noDots ? 256 : 400,
      borderRadius: noBorderRadius ? 0 : 3,
      // bgcolor: theme.palette.neutrals[300],
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' 
      }}>
      <Box sx={{ mb:2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{minHeight: 42}}>
          <Typography variant="h6">History Timeline</Typography>
          {isFetchingSession ? 
            <Skeleton variant="text" sx={{ minWidth: 128, height: "12px"}} /> :
            <Typography variant="subtitle2">Session {historySessionSelected.six.format()} at Era {historySessionSelected.eix.format()} selected</Typography>
          }
        </Box>
        <Box sx={{ display: 'flex'}} >
          <HistoryErasMenu />
          {isFetchingSession ? <Spinner size={24}/> : null}
        </Box>
      </Box>
      <ResponsiveContainer width="100%" height={228}>
        <ComposedChart
          // width={500}
          // layout="vertical"
          height={228}
          data={data}
          margin={{
            top: 8,
            right: 0,
            left: 0,
            bottom: 8,
          }}
        >
          <CartesianGrid strokeDasharray="1 4" vertical={false} horizontal={true} />
      
          {/* is_authority */}
          <YAxis yAxisId="rightAuth" orientation="right"
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            axisLine={{stroke: '#C8C9CC', strokeWidth: 1, width: 100}} 
            hide={true}
          />
          <Area yAxisId="rightAuth" type="step" dataKey="isAuth" 
            activeDot={false} dot={false} 
            fill={theme.palette.neutrals[100]} strokeWidth={0} />

          <ReferenceLine x={historySession} stroke={theme.palette.neutrals[300]} 
            strokeWidth={2}/>

          {/* points */}
          <XAxis style={{ fontSize: '0.8rem' }} dataKey="session" type="category" 
            axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} angle={-30} tickMargin={8}/>         
          <YAxis type="number" 
            width={64}
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            axisLine={{stroke: '#C8C9CC', strokeWidth: 1, width: 100}} 
            />
          <Bar dataKey="abPoints" stackId="points" barSize={12} fill={theme.palette.secondary.main} />
          <Bar dataKey="pvPoints" stackId="points" barSize={12} shape={<Rectangle radius={[8, 8, 0, 0]} />} >
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} cursor="pointer" 
                  onClick={() => handleClick(entry.session)}
                  stroke={theme.palette.neutrals[300]}
                  strokeWidth={historySession === entry.session ? 4 : 0}
                  fill={theme.palette.grade[entry.gradeValue]} />
                ))
            }
          </Bar>

          {/* mvr & group mvr */}
          <YAxis yAxisId="rightMVR" orientation="right"
            width={64}
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            axisLine={{stroke: '#C8C9CC', strokeWidth: 1, width: 100}} 
            />
          <Line yAxisId="rightMVR" type="monotone" dataKey="valMvr" dot={false} 
            stroke={theme.palette.primary.main} strokeWidth={2} />
          <Line yAxisId="rightMVR" type="monotone" dataKey="valGroupMvr" dot={false} 
            stroke={theme.palette.semantics.purple} strokeWidth={2} />
          <Line yAxisId="rightMVR" type="monotone" dataKey="sessionMvr" dot={false} 
            stroke={theme.palette.semantics.amber} strokeWidth={2} />
          
          {/* disputes */}
          {totalDisputes > 0 ? 
            <YAxis type="number" yAxisId="rightDisputes"
              hide={true}
              width={64}
              style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1, width: 100}} 
              /> : null }
          {totalDisputes > 0 ? 
            <Bar dataKey="disputes" yAxisId="rightDisputes" barSize={6} shape={<Rectangle radius={[8, 8, 0, 0]} />} >
              {
                data.map((entry, index) => (
                <Cell key={`cell-${index}`} cursor="pointer" 
                  onClick={() => handleClick(entry.session)}
                  stroke={theme.palette.neutrals[300]}
                  strokeWidth={historySession === entry.session ? 4 : 0}
                  fill={theme.palette.semantics.red} />))
              }
            </Bar> : null}

          <TooltipChart 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, nameDisplay(!isUndefined(valProfile) ? valProfile._identity : '-'), theme)} />
          <Legend verticalAlign="top" content={() => renderLegend(theme)} height={24} />
        </ComposedChart>
      </ResponsiveContainer>
      {!noDots ? 
        <Box sx={{mt: 2, width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Box>
            {data.filter(d => d.isPara).map((d, i) => 
              (<Tooltip key={i} title={`Grade ${d.gradeValue} at Session ${d.session.format()}`}>
                <IconButton key={i} aria-label={d.session} onClick={() => handleClick(d.session)} size="small"
                  sx={{mr: 1/4, bgcolor: historySession === d.session ? theme.palette.grey[800] : 'transparent'}} 
                  >
                  <CircleIcon fontSize="inherit" sx={{ color: theme.palette.grade[d.gradeValue] }}/>
                </IconButton>
              </Tooltip>)
            )}
          </Box>
          <Box>
            <Typography variant="caption">para-validator sessions</Typography>
          </Box>
        </Box> : null}
    </Paper>
  );
}