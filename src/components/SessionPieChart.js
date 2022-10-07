import * as React from 'react';
import { useSelector } from 'react-redux'
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { PieChart, Pie, Cell } from 'recharts';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectAll,
 } from '../features/api/blocksSlice'
import { 
  useGetSessionByIndexQuery,
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
  // const theme = useTheme();
  const {isSuccess: isBlockSuccess} = useGetBlockQuery("finalized");
  // const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex, {refetchOnMountOrArgChange: true});
  const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex);
  const blocks = useSelector(selectAll)
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex))
  const isLiveMode = useSelector(selectIsLiveMode)

  if (!isBlockSuccess || !isSessionSuccess || isUndefined(session)) {
    return null
  }

  const block = blocks[blocks.length-1];
  const diff = isLiveMode ? block.bix - session.sbix : session.ebix - session.sbix;
  const donePercentage = Math.round((diff * 100)/600);
  const pieData = [
    createData('done', donePercentage),
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
        alignItems: 'flex-start',
        width: '100%',
        height: 112,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">Epoch countdown</Typography>
          <Typography variant="h5">{min > 0 ? `${min} mins` : ` ${sec} secs`}</Typography>
          <Typography variant="subtitle2">
            {`${donePercentage}% completed`}
          </Typography>
          {/* <Typography variant="subtitle2">
              {min > 0 ? <span>{`${min} mins`}</span> : null}
              {sec > 0 ? <span>{` ${sec} sec`}</span> : null}
              {` to finish`}
          </Typography> */}
        </Box>
      </Box>
      <Box sx={{ width: '50%', display: 'flex', justifyContent: 'flex-end'}}>
        <PieChart width={100} height={80}>
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
            {/* <text x="50%" y="50%" fill="#343434" style={{ fontSize: '1rem' }} 
              textAnchor={'middle'} dominantBaseline="central">
              {pieData[0].value}%
            </text> */}
          </PieChart>
      </Box>
    </Paper>
  );
}