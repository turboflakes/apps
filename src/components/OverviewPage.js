import * as React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OverviewTabs from './OverviewTabs';
import EraPointsBox from './EraPointsBox';
import SessionPointsBox from './SessionPointsBox';
import AuthoredBlocksBox from './AuthoredBlocksBox';
import BackingPointsBox from './BackingPointsBox';
import AuthoritiesBox from './AuthoritiesBox';
import GradesSmallBox from './GradesSmallBox';
import CollationAuthoritiesBox from './CollationAuthoritiesBox';
import CollationBlocksBox from './CollationBlocksBox';
import CollationEraPointsBox from './CollationEraPointsBox';
import CollationPointsBox from './CollationPointsBox';
import CollationGradesBox from './CollationGradesBox';
import CollationSlotBox from './CollationSlotBox';
import CollationHeader from './CollationHeader';

import {
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice'
import { selectChain } from '../features/chain/chainSlice';
import { isCollationAvailable } from '../constants';
import {
  selectIsLiveMode,
  selectCollatorsChain,
  selectCollationHidden,
  collationHiddenChanged,
} from '../features/layout/layoutSlice'
import {
  selectIsSocketConnected,
} from '../features/api/socketSlice'

export default function OverviewPage({tab}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const isLiveMode = useSelector(selectIsLiveMode);
  const selectedChain = useSelector(selectChain);
  const collatorsChain = useSelector(selectCollatorsChain);
  const isCollatorsTab = tab === 1;
  const isNotSelected = (chainKey) => isCollatorsTab && collatorsChain !== chainKey;
  // the hidden chains stay mounted, the requests are made by them
  const hiddenIfNotSelected = (chainKey) => isNotSelected(chainKey) ? { display: 'none' } : undefined;
  const collationHidden = useSelector(state => ({
    ah: selectCollationHidden(state, 'ah'),
    pp: selectCollationHidden(state, 'pp'),
  }), shallowEqual);
  const isAllHidden = collationHidden.ah && collationHidden.pp;
  // the button that hides or shows the details lives in the row of the last visible header
  const isButtonInAH = isCollatorsTab && collatorsChain === 'ah';

  const hiddenIfNotExpanded = (chainKey) => collationHidden[chainKey] ? { display: 'none' } : undefined;
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);

  // hides or shows the details of the chains
  const hideButton = (
    <IconButton
      size="medium"
      onClick={() => dispatch(collationHiddenChanged(!isAllHidden))}
      aria-label={isAllHidden ? 'show details' : 'hide details'}
    >
      {isAllHidden ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
    </IconButton>
  );

  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 2, mt: 2, pt: 1, minHeight: '100vh'}}>
      <Grid container spacing={2}>

        <Grid item xs={12} md={2}>
          <AuthoritiesBox sessionIndex={currentSession} />
        </Grid>
        <Grid item xs={12} md={2}>
          <GradesSmallBox sessionIndex={currentSession} />
        </Grid>
         <Grid item xs={12} md={2}>
          <AuthoredBlocksBox />
        </Grid>
        <Grid item xs={12} md={2}>
          <BackingPointsBox />
        </Grid>
        <Grid item xs={12} md={2}>
          <SessionPointsBox />
        </Grid>
        <Grid item xs={12} md={2}>
          <EraPointsBox />
        </Grid>

        {isCollationAvailable(selectedChain) && (
          <>
            <Grid item xs={12}>
              <Divider sx={{
                mt: 1,
                opacity: 0.25,
                height: '1px',
                borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                borderBottom: 'none',
                backgroundColor: 'transparent',
                backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                }} />
            </Grid>
            {/* Asset Hub */}
            <Grid item xs={12} md={isNotSelected("pp") ? 12 : 6} sx={{ position: 'relative', ...hiddenIfNotSelected("ah") }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* the button lives in the row of the last visible header */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <CollationHeader chainKey="ah" name="Asset Hub" />
                    </Box>
                    {isButtonInAH && hideButton}
                  </Box>
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("ah")}>
                  <CollationAuthoritiesBox chainKey="ah" />
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("ah")}>
                  <CollationBlocksBox chainKey="ah" />
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("ah")}>
                  <CollationPointsBox chainKey="ah" />
                </Grid>
                {isCollatorsTab && (<Grid item xs={12} md={3} sx={hiddenIfNotExpanded("ah")}>
                  <CollationEraPointsBox chainKey="ah" name="asset hub" />
                </Grid>)}
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("ah")}>
                  <CollationGradesBox chainKey="ah" name="asset hub" />
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 9 : 8} sx={hiddenIfNotExpanded("ah")}>
                  <CollationSlotBox chainKey="ah" />
                </Grid>
              </Grid>
            </Grid>
            {/* People */}
            <Grid item xs={12} md={isNotSelected("ah") ? 12 : 6} sx={hiddenIfNotSelected("pp")}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* the button lives in the row of the last visible header */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <CollationHeader chainKey="pp" name="People" />
                    </Box>
                    {!isButtonInAH && hideButton}
                  </Box>
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("pp")}>
                  <CollationAuthoritiesBox chainKey="pp" />
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("pp")}>
                  <CollationBlocksBox chainKey="pp" />
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("pp")}>
                  <CollationPointsBox chainKey="pp" />
                </Grid>
                {isCollatorsTab && (<Grid item xs={12} md={3} sx={hiddenIfNotExpanded("pp")}>
                  <CollationEraPointsBox chainKey="pp" name="people" />
                </Grid>)}
                <Grid item xs={12} md={isCollatorsTab ? 3 : 4} sx={hiddenIfNotExpanded("pp")}>
                  <CollationGradesBox chainKey="pp" name="people" />
                </Grid>
                <Grid item xs={12} md={isCollatorsTab ? 9 : 8} sx={hiddenIfNotExpanded("pp")}>
                  <CollationSlotBox chainKey="pp" />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Divider sx={{
            mt: 1,
            opacity: 0.25,
            height: '1px',
            borderTop: '0px solid rgba(0, 0, 0, 0.08)',
            borderBottom: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
            }} />
        </Grid>

        <Grid item xs={12}>
          <OverviewTabs sessionIndex={sessionIndex} tab={tab} />
        </Grid>

      </Grid>
		</Box>
  );
}
