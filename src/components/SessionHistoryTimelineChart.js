import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, Cell, ReferenceLine, 
  CartesianGrid, Tooltip, ResponsiveContainer, Rectangle, Legend } from 'recharts';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import {
  useGetValidatorsQuery,
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
  selectSessionHistory,
  selectMvrBySessions,
  sessionHistoryChanged,
} from '../features/api/sessionsSlice';
import {
  selectValProfileByAddress,
} from '../features/api/valProfilesSlice';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'
import { nameDisplay } from '../util/display'

const renderTooltip = (props, theme) => {
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
            <b>History</b>
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
                <span style={{ marginRight: '8px', color: theme.palette.grade[data.gradeValue]}}>❚</span>Backing Points: <b>{data.pvPoints}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.secondary.main }}>❚</span>Authored Block Points: <b>{data.abPoints}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.primary.main }}>―</span>MVR: <b>{Math.round(data.valMvr * 10000) / 10000}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.semantics.purple }}>―</span>MVR (Val. Group {`${data.group}`}): <b>{Math.round(data.valGroupMvr * 10000) / 10000}</b>
              </Typography>
              <Typography component="div" variant="caption" color="inherit">
                <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>―</span>MVR (All Para-Authorities): <b>{Math.round(data.sessionMvr * 10000) / 10000}</b>
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
                <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>―</span>MVR (All Para-Authorities): <b>{Math.round(data.sessionMvr * 10000) / 10000}</b>
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
                <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>―</span>MVR (All Para-Authorities): <b>{Math.round(data.sessionMvr * 10000) / 10000}</b>
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
        <span style={{ marginRight: '8px', color: theme.palette.secondary.main}}>⚝</span>Backing Points
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.secondary.main }}>❚</span>Authored Block Points
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.primary.main }}>―</span>MVR
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.semantics.purple }}>―</span>MVR (Val. Group)
      </Typography>
      <Typography variant="caption" color="inherit">
        <span style={{ marginRight: '8px', color: theme.palette.semantics.amber }}>―</span>MVR (All Para-Authorities)
      </Typography>
    </Box>
  );
}

export default function SessionHistoryTimelineChart({address, maxSessions}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentSession = useSelector(selectSessionCurrent);
  const historySession = useSelector(selectSessionHistory);
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1 , maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds));
  const allMvrs = useSelector(state => selectMvrBySessions(state, historySessionIds));
  
  // if (!isSuccess) {
  //   return null
  // }

  // if (validators.filter(v => !isUndefined(v)).length !== maxSessions || allMvrs.length !== maxSessions) {
  //   return null
  // }

  const data = validators.map((v, i) => ({
    session: v.session,
    isAuth: v.is_auth ? 1 : 0,
    isPara: v.is_para ? 1 : 0,
    abPoints: v.is_auth ? v.auth.ab.length * 20 : 0,
    pvPoints: v.is_para && (v.auth.ep - v.auth.sp) >= (v.auth.ab.length * 20) ? (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20) : 0,
    gradeValue: v.is_para ? grade(1 - calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv)) : '',
    valMvr: v.is_para ? calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv) : 0,
    valGroupMvr: v.is_para ? v._val_group_mvr : 0,  
    group: v.is_para ? v.para.group : '',
    sessionMvr: allMvrs[i]
  }))

  const handleClick = (data) => {
    if (historySession !== data.session) {
      setTimeout(() => dispatch(sessionHistoryChanged(data.session)), 50);
    }
  };

  return (
    <Paper sx={{ 
      p: 2,
      // mt: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      // height: 256,
      borderRadius: 3,
      // bgcolor: theme.palette.neutrals[300],
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' 
      }}>
      <Box>
        <Typography variant="h6" paragraph>Timeline</Typography>
      </Box>
      <ResponsiveContainer width="100%" height={228}>
        <ComposedChart
          // width={500}
          // layout="vertical"
          height={228}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
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

          <ReferenceLine x={historySession} stroke={theme.palette.neutrals[300]} strokeWidth={2}/>

          {/* points */}
          <XAxis style={{ fontSize: '0.8rem' }} dataKey="session" type="category" 
            axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} angle={-30} tickMargin={8}/>         
          <YAxis type="number" 
            width={64}
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            axisLine={{stroke: '#C8C9CC', strokeWidth: 1, width: 100}} 
            />
          <Bar dataKey="abPoints" stackId="points" barSize={12} fill={theme.palette.secondary.main} />
          <Bar dataKey="pvPoints" stackId="points" barSize={12} shape={<Rectangle radius={[8, 8, 0, 0]} />} 
            onClick={handleClick} >
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} cursor="pointer" 
                  stroke={theme.palette.neutrals[300]}
                  strokeWidth={historySession === entry.session ? 2 : 0}
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
          <Line yAxisId="rightMVR" type="monotone" dataKey="valMvr" dot={false} stroke={theme.palette.primary.main} />
          <Line yAxisId="rightMVR" type="monotone" dataKey="valGroupMvr" dot={false} stroke={theme.palette.semantics.purple} />
          <Line yAxisId="rightMVR" type="monotone" dataKey="sessionMvr" dot={false} stroke={theme.palette.semantics.amber} />
          
          <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
          <Legend verticalAlign="top" content={() => renderLegend(theme)} height={24} />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
}