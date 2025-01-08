import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from './Tooltip';

const InsightsInfoLegend = ({showDisputes}) => {
  const theme = useTheme();
  return (
    <Tooltip
      disableFocusListener
      placement="top"
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="caption"><b>Legend:</b></Typography>
          <Box sx={{my: 1, display: 'flex', flexDirection: 'column'}}>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px'}}>❒</span>Total number of authored blocks
            </Typography>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px' }}>↔</span>Total number of disputes initiated
            </Typography>
            <Typography variant="caption" paragraph>
              <span style={{ marginRight: '8px' }}>↻</span>Total number of core assignments
            </Typography>
            <Typography variant="caption" gutterBottom>
              Missed Votes Ratio (MVR)
            </Typography>
            <Typography variant="caption" gutterBottom>
              MVR = (✗v) / (✓i + ✓e + ✗)
            </Typography>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px' }}>✓i</span>Total number of implicit votes
            </Typography>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px'}}>✓e</span>Total number of explicit votes
            </Typography>
            <Typography variant="caption" paragraph>
              <span style={{ marginRight: '8px' }}>✗v</span>Total number of missed votes
            </Typography>
            <Typography variant="caption" gutterBottom>
              Bitfields Unavailability Ratio (BUR)
            </Typography>
            <Typography variant="caption" gutterBottom>
              BUR = (✗bu) / (✓ba + ✗bu)
            </Typography>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px'}}>✓ba</span>Total number of blocks with available bitfields
            </Typography>
            <Typography variant="caption" paragraph>
              <span style={{ marginRight: '8px' }}>✗bu</span>Total number of blocks with unavailable bitfields
            </Typography>
            
            <Typography variant="caption" paragraph>
              SCORE = (1 - mvr) * 0.60 + (1 - bur) * 0.15 + ((avg_pv_pts - min_avg_pv_pts) / (max_avg_pv_pts - min_avg_pv_pts)) * 0.18 + (pv_sessions / total_sessions) * 0.07
            </Typography>
            <Typography variant="caption" gutterBottom>
              VERSION: The node version is collected from the Kademlia Distributed Hash Table (DHT). Nodes that are not reached within the discovery process (background task that runs every new session) have their node version set to ''.
            </Typography>
          </Box>
        </Box>
      }
      >
      <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300]}}/>
    </Tooltip>
  );
}

export default InsightsInfoLegend;