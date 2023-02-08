import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { PieChart, Pie, Cell } from 'recharts';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectFinalizedBlock,
 } from '../features/api/blocksSlice'
import { 
  useGetSessionByIndexQuery,
  selectSessionByIndex,
  selectSessionCurrent
 } from '../features/api/sessionsSlice'
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';

function createData(name, value) {
  return { name, value };
}

export default function SessionPieChartHeader() {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const {
    isSuccess: isSuccessFinalizedBlock, 
    isFetching: isFetchingBlockSuccess} = useGetBlockQuery({blockId: "finalized", show_stats: true});
  const {
    isSuccess: isSuccessSession,
    isFetching: isFetchingSession } = useGetSessionByIndexQuery(currentSession);
  const finalized = useSelector(selectFinalizedBlock)
  const session = useSelector(state => selectSessionByIndex(state, currentSession))
  const isLiveMode = useSelector(selectIsLiveMode)

  if (isFetchingBlockSuccess || isFetchingSession || isUndefined(session)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 50,
      bgcolor: 'white'
    }} />)
  }

  if (!isSuccessFinalizedBlock || !isSuccessSession) {
    return null
  }

  const diff = isLiveMode ? finalized.block_number - session.sbix : session.ebix - session.sbix;
  const donePercentage = Math.round((diff * 100)/600);
  const pieEpochData = [
    createData('done', donePercentage),
    createData('progress', Math.round(((600-diff) * 100)/600)),
  ]
  const eraPercentage = Math.round(donePercentage * (session.esix / 6));
  
  let pieEraData = [];
  for (let i = 1; i <= 6; i++) {
    if (session.esix === i) {
      pieEraData.push({
        name: `S${i}.1`,
        status: "done",
        index: i, 
        value: donePercentage,

      })
      pieEraData.push({
        name: `S${i}.0`,
        status: "progress",
        index: i, 
        value: 100 - donePercentage
      })
    } else if (session.esix < i) {
      pieEraData.push({ name: `S${i}.0`, status: "pending", index: i, value: 100 });
    } else {
      pieEraData.push({ name: `S${i}.1`, status: "done", index: i, value: 100 });
    }
  }

  const min = Math.floor(((600-diff)*6)/60)
  const dec = (((600-diff)*6)/60) % 1
  const sec = parseFloat(dec.toPrecision(4))*60

  return (
    <Box
      sx={{
        mx: 2,
        display: 'flex',
        alignItems: 'center',
      }}
      >
      <Box sx={{ px: 1, width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption1">epoch countdown</Typography>
          <Typography variant="h6">{min > 0 ? `${min} mins` : ` ${sec} secs`}
            <span style={{
                  ...theme.typography.subtitle3,
                  marginLeft: '16px',
                }}>
                  {`${eraPercentage}% done`}
            </span>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <PieChart width={64} height={64}>
          <Pie
              data={pieEpochData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={16}
              outerRadius={24}
              startAngle={90}
              endAngle={-360}
            >
            {pieEpochData.map((entry, index) => (
              <Cell key={`cell-${index}`} strokeWidth={0} stroke={theme.palette.neutrals[300]}
                fill={index === 0 ? theme.palette.text.primary : theme.palette.grey[200] } />
            ))}
          </Pie>
          <Pie 
            data={pieEraData} 
            dataKey="value" 
            cx="50%" 
            cy="50%" 
            innerRadius={2} 
            outerRadius={12}
            startAngle={90}
            endAngle={-360}
            >
              {pieEraData.map((entry, index) => {
                if (entry.status === "done") {
                  return (<Cell key={`cell-${index}`} strokeWidth={1} stroke={theme.palette.text.secondary}
                    fill={theme.palette.text.primary} />)
                } else if (entry.status === "progress") {
                  return (<Cell key={`cell-${index}`} strokeWidth={0} stroke={theme.palette.text.secondary}
                    fill={theme.palette.grey[300]} />)
                } else {
                  return (<Cell key={`cell-${index}`} strokeWidth={1} stroke={theme.palette.text.secondary}
                    fill={theme.palette.grey[200]} />)
                }
              })}
            </Pie>
        </PieChart>
      </Box>
    </Box>
  );
}