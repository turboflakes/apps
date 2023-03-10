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
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px' }}>↻</span>Total number of core assignments
            </Typography>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px' }}>✓i</span>Total number of implicit votes
            </Typography>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px'}}>✓e</span>Total number of explicit votes
            </Typography>
            <Typography variant="caption" paragraph>
              <span style={{ marginRight: '8px' }}>✗</span>Total number of missed Votes
            </Typography>
            <Typography variant="caption" paragraph>
              MVR = (✗) / (✓i + ✓e + ✗)
            </Typography>
            <Typography variant="caption" gutterBottom>
              SCORE = (1 - mvr) * 0.75 + ((avg_pv_pts - min_avg_pv_pts) / (max_avg_pv_pts - min_avg_pv_pts)) * 0.18 + (pv_sessions / total_sessions) * 0.07
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