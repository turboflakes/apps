import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled, useTheme } from '@mui/material/styles';
import NodeVersionChart from './NodeVersionChart';
import Tooltip from './Tooltip';
import {
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'
import { 
  selectIdentityFilter,
  selectSubsetFilter
 } from '../features/layout/layoutSlice'
import { 
  selectSessionHistoryRangeIds,
} from '../features/api/sessionsSlice'
import { versionDisplay } from '../util/display'


export default function NodeVersionBox({sessionIndex, isHistoryMode}) {
  const theme = useTheme();
  const [showPie, setShowPie] = React.useState(true);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);
  const historySessionRangeIds = useSelector(selectSessionHistoryRangeIds);
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, isHistoryMode ? historySessionRangeIds : [sessionIndex], isHistoryMode, identityFilter, subsetFilter));
  
  if (!rows.length) {
    return null
  }

  const groupedByVersion = groupBy(rows, v => versionDisplay(v.node_version));
  const data = orderBy(Object.keys(groupedByVersion).map(subset => ({ subset, value: groupedByVersion[subset].length })), 'subset');
  
  return (
    <Paper sx={{ 
      // m: 2,
      // p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      // width: 352,
      height: 352,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box sx={{ display: 'flex'}}>
            <Typography variant="h6" sx={{ mr: 1, overflow: "hidden", textOverflow: "ellipsis" }} title="Distribution by node version">
            Distribution by version
            </Typography>
          </Box>
          <Tooltip
            disableFocusListener
            placement="top"
            title={
              <Box sx={{ p: 1}}>
                <Typography el variant="caption" paragraph>{"The node version is collected from the Kademlia Distributed Hash Table (DHT) subsystem in libp2p."}</Typography>
                <Typography variant="caption" paragraph>{"The task to crawl and discover peer nodes in the network is executed every new session."}</Typography>
                <Typography variant="caption" >{"Nodes that are not reached within the discovery process have their node version set to 'N/D'."}</Typography>
              </Box>
            }
            >
            <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300]}}/>
          </Tooltip>
        </Box>
        <Typography variant="subtitle2" sx={{ height: 16, overflow: "hidden", textOverflow: "ellipsis" }}>
          {subsetFilter !== '' ? <span>Only for subset {subsetFilter}</span> : 'All active validators'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
          <NodeVersionChart data={data} size="md" showLegend showLabel />
        </Box>
      </Box>
    </Paper>
  )
}