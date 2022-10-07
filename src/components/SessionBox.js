import * as React from 'react';
import { useSelector } from 'react-redux'
import isUndefined from 'lodash/isUndefined';
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
  selectSessionByIndex,
 } from '../features/api/sessionsSlice'
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';


function createData(name, value) {
  return { name, value };
}

const COLORS = ['#343434', '#C8C9CC'];

export default function SessionBox({sessionIndex}) {
  const {isSuccess: isBlockSuccess} = useGetBlockQuery("finalized");
  // const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex, {refetchOnMountOrArgChange: true});
  const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex);
  const blocks = useSelector(selectAll)
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex))
  const isLiveMode = useSelector(selectIsLiveMode)

  if (!isBlockSuccess || !isSessionSuccess || isUndefined(session)) {
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
      <Box sx={{ width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">Finalized block</Typography>
          <Typography variant="h5">{isBlockSuccess ? `# ${block.bix.format()}` : '-'}</Typography>
          <Typography variant="subtitle2">
            {isLiveMode ?
              <Typography variant="subtitle2">{isBlockSuccess ? `${diff.format()} finalized blocks since #${session.sbix.format()}` : `-`}</Typography> : 
              <Typography variant="subtitle2">{`${diff.format()} blocks from #${session.sbix.format()} to #${session.ebix.format()}`}</Typography>
            }
          </Typography>
          {/* 
          <Typography variant="subtitle2">
              {min > 0 ? <span>{`${min} mins`}</span> : null}
              {sec > 0 ? <span>{` ${sec} sec`}</span> : null}
              {` to finish`}
          </Typography> 
          */}
        </Box>
      </Box>
      {/* <Grid container>
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
              <Typography sx={{ml: 1, mr: 1}} variant="h5">{'//'}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Typography variant="caption">finalized</Typography>
                <Typography variant="h5">{isBlockSuccess ? `${block.bix.format()}` : '-'}</Typography>
              </Box>
            </Box>
            {isLiveMode ?
              <Typography variant="subtitle2">{isBlockSuccess ? `${diff.format()} finalized blocks since #${session.sbix.format()}` : `-`}</Typography> : 
              <Typography variant="subtitle2">{`${diff.format()} blocks from #${session.sbix.format()} to #${session.ebix.format()}`}</Typography>
            }
          </Box>
        </Grid>
      </Grid> */}
    </Paper>
  );
}