import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from './Tooltip';
import {
  selectSessionByIndex,
  selectSessionCurrent,
  selectEraPointsBySession
} from '../features/api/sessionsSlice';
import { selectEraCollationPointsBySession } from '../features/api/collationStatsSlice';
import { selectChain } from '../features/chain/chainSlice';
import { isCollationAvailable } from '../constants';

export default function EraPointsBox() {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const session = useSelector(state => selectSessionByIndex(state, currentSession))
  const selectedChain = useSelector(selectChain);
  const isCollation = isCollationAvailable(selectedChain);
  const relayPoints = useSelector(state => selectEraPointsBySession(state, currentSession))
  const collationPoints = useSelector(state => selectEraCollationPointsBySession(state, currentSession))
  // era points = relay points + collation points (unknown until both are loaded)
  const eraPoints = isCollation
    ? (isUndefined(relayPoints) || isUndefined(collationPoints) ? undefined : relayPoints + collationPoints)
    : relayPoints

  if (isUndefined(session)) {
    return null
  }

  return (
    <Paper sx={{
        p: 2,
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        position: 'relative',
        borderRadius: 3,
        // bgcolor: theme.palette.neutrals[200],
        bgcolor: theme.palette.background.secondary,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" color="textSecondary" sx={{whiteSpace: 'nowrap'}}>era points</Typography>
        <Typography variant="h5" color="textSecondary">
          {!isUndefined(eraPoints) ? eraPoints.format() : '-'}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
          {`since era ${session.eix.format()} started`}
        </Typography>
      </Box>
      {/* top right corner of the box */}
      {isCollation && (
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex' }}>
          <Tooltip
            disableFocusListener
            placement="bottom"
            componentsProps={{ tooltip: { sx: { maxWidth: 480 } } }}
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="caption">
                  Era points are the sum of relay chain points (authored blocks and backing) and system chain collation points (Asset Hub and People), over all sessions of the era so far.
                </Typography>
              </Box>
            }
          >
            <InfoOutlinedIcon fontSize="small" sx={{ color: theme.palette.common.white }} />
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
}
