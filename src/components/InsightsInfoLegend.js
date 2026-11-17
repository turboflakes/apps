import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSelector } from 'react-redux';
import Tooltip from './Tooltip';
import { selectChain } from '../features/chain/chainSlice';
import { isCollationAvailable } from '../constants';

const InsightsInfoLegend = ({showDisputes}) => {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const isCollation = isCollationAvailable(selectedChain);
  return (
    <Tooltip
      disableFocusListener
      placement="left"
      componentsProps={{ tooltip: { sx: { maxWidth: 480 } } }}
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
              Bitfields Availability Ratio (BAR)
            </Typography>
            <Typography variant="caption" gutterBottom>
              BAR = (✓b) / (✓b + ✗b)
            </Typography>
            <Typography variant="caption" gutterBottom>
              <span style={{ marginRight: '8px'}}>✓b</span>Total number of blocks with bitfields available
            </Typography>
            <Typography variant="caption" paragraph>
              <span style={{ marginRight: '8px' }}>✗b</span>Total number of blocks without bitfields or empty bitfields
            </Typography>
            {isCollation && (
              <>
              <Typography variant="caption" gutterBottom>
                Missed Collation Ratio (MCR)
              </Typography>
              <Typography variant="caption" gutterBottom>
                MCR = (❒e - ❒p) / (❒e)
              </Typography>
              <Typography variant="caption" gutterBottom>
                <span style={{ marginRight: '8px' }}>◷</span>Total number of slots owned by the collator
              </Typography>
              <Typography variant="caption" gutterBottom>
                <span style={{ marginRight: '8px' }}>❒e</span>Total number of blocks expected to be produced in the owned slots
              </Typography>
              <Typography variant="caption" gutterBottom>
                <span style={{ marginRight: '8px' }}>❒p</span>Total number of blocks produced
              </Typography>
              <Typography variant="caption" paragraph>
                <span style={{ marginRight: '8px' }}>✗s</span>Total number of owned slots where no block was produced
              </Typography>
              </>
            )}
            {isCollation ? (
              <>
              <Typography variant="caption" paragraph>
                GRADE RATIO (Validators only) = (1 - MVR) * 0.75 + BAR * 0.25
              </Typography>
              <Typography variant="caption" paragraph>
                GRADE RATIO (Collators only) = 1 - MCR
              </Typography>
              <Typography variant="caption" paragraph>
                GRADE RATIO (Metanodes) = 1 - (0.6 * MVR + 0.15 * BUR + 0.25 * MCR)
              </Typography>
              <Typography variant="caption" paragraph>
                SCORE (Validators only) = (1 - mvr) * 0.50 + bar * 0.25 + ((avg_pv_pts - min_avg_pv_pts) / (max_avg_pv_pts - min_avg_pv_pts)) * 0.18 + (pv_sessions / total_sessions) * 0.07
              </Typography>
              <Typography variant="caption" paragraph>
                SCORE (Metanodes) = SCORE * 0.75 + (1 - MCR) * 0.25
              </Typography>
              </>
            ) : (
              <>
                <Typography variant="caption" paragraph>
                  GRADE RATIO = (1 - MVR) * 0.75 + BAR * 0.25
                </Typography>
                <Typography variant="caption" paragraph>
                  SCORE = (1 - mvr) * 0.50 + bar * 0.25 + ((avg_pv_pts - min_avg_pv_pts) / (max_avg_pv_pts - min_avg_pv_pts)) * 0.18 + (pv_sessions / total_sessions) * 0.07
                </Typography>
              </>
            )}
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
