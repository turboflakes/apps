import * as React from 'react';
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectAll,
 } from '../features/api/blocksSlice'

 import { 
  useGetSessionByIndexQuery,
  selectSessionsAll,
  selectSessionByIndex,
 } from '../features/api/sessionsSlice'
 import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';

function createData(name, value) {
  return { name, value };
}

const COLORS = ['#343434', '#C8C9CC'];

export default function SessionPieChart({sessionIndex}) {
  const {isSuccess: isBlockSuccess} = useGetBlockQuery("best");
  // const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex, {refetchOnMountOrArgChange: true});
  const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex);
  const blocks = useSelector(selectAll)
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex))
  const isLiveMode = useSelector(selectIsLiveMode)

  if (!isBlockSuccess || !isSessionSuccess || !session) {
    return null
  }

  const block = blocks[blocks.length-1]
  const diff = isLiveMode ? block.bix - session.sbix : session.ebix - session.sbix
  const pieData = [
    createData('done', Math.round((diff * 100)/600)),
    createData('progress', Math.round(((600-diff) * 100)/600)),
  ];

  const min = Math.floor(((600-diff)*6)/60)
  const dec = (((600-diff)*6)/60) % 1
  const sec = parseFloat(dec.toPrecision(4))*60

  return (
    <Paper
      sx={{
        p: `16px 24px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 112,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Grid container>
        <Grid item xs={12} sm={isLiveMode ? 7 : 12} sx={{display: 'flex', alignItems: 'center',}}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Typography variant="caption">era</Typography>
                <Typography variant="h5">{isSessionSuccess ? session.eix.format() : '-'}</Typography>
              </Box>
              <Typography sx={{ml: 1, mr: 1}} variant="h5">{'//'}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Typography variant="caption">session</Typography>
                <Typography variant="h5">{isSessionSuccess ? session.six.format() : '-'}</Typography>
              </Box>
            </Box>
            {isLiveMode ?
              <Typography variant="subtitle2">{isBlockSuccess ? `${diff.format()} blocks since #${session.sbix.format()}` : `-`}</Typography> : 
              <Typography variant="subtitle2">{`${diff.format()} blocks from #${session.sbix.format()} to #${session.ebix.format()}`}</Typography>
            }
          </Box>
        </Grid>
        {isLiveMode ? 
          <Grid item xs={12} sm={5} sx={{width: '100%', height: 84, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
            <Box sx={{ mr: 1, display: 'flex', flexDirection: 'column'}}>
              <Typography variant="caption" align='right'>epoch</Typography>
              <Typography variant="h5" align='right' sx={{fontFamily: "'Roboto', sans-serif"}}>1 hr</Typography>
              <Typography variant="body2" align='right'>
                {min > 0 ? <span style={{ marginRight: '4px'}}>{`${min} mins`}</span> : null}
                {sec > 0 ? <span>{`${sec} s`}</span> : null}
              </Typography>
            </Box>
            <ResponsiveContainer width='40%' height='100%'>
              <PieChart>
              <Pie
                  dataKey="value"
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={36}
                  innerRadius={24}
                  startAngle={90}
                  endAngle={-360}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <text x="50%" y="50%" fill="#343434" style={{ fontSize: '1rem' }} textAnchor={'middle'} dominantBaseline="central">
                  {pieData[0].value}%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </Grid> : null}
      </Grid>
    </Paper>
  );
}