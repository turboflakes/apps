import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InsightsGrid from './InsightsGrid';
import ValGroupsGrid from './ValGroupsGrid';
import CoresGrid from './CoresGrid';
import ParachainsGrid from './ParachainsGrid';
import ModeSwitch from './ModeSwitch';
import SessionHistoryTimelineChart from './SessionHistoryTimelineChart';
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice';
import {
  pageChanged,
  selectMode,
  selectIsHistoryMode,
  selectMaxHistorySessions
} from '../features/layout/layoutSlice';

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const tabPages = ["insights", "parachains", "val-groups", "cores"];

export default function OverviewTabs({sessionIndex, tab}) {
	// const theme = useTheme();
  const navigate = useNavigate();
	const dispatch = useDispatch();
  const selectedMode = useSelector(selectMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const {isSuccess} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority", show_summary: true, show_profile: true}, {refetchOnMountOrArgChange: true});
  
  const handleChange = (event, newValue) => {
    dispatch(pageChanged(tabPages[newValue]));
    navigate(`/${tabPages[newValue]}`)
  };

  if (!isSuccess) {
    return null
  }

  return (
		<Box sx={{  }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', 
        // borderBottom: 1, borderColor: 'divider' 
        }}>
        <Tabs textColor="inherit" sx={{ 
          '.MuiTabs-indicator': { display: 'none' }, 
          '& .Mui-selected': { 
            bgcolor: 'rgba(11, 19, 23, 0.08)',
            color: '#0B1317'
          }}} value={tab} onChange={handleChange} aria-label="Overview" >
          <Tab sx={{ my:1, mr: 2,  borderRadius: 3 }} label="Insights" {...a11yProps(0)} disableRipple disableFocusRipple />
          <Tab sx={{ my:1, mr: 2,  borderRadius: 3 }} label="Parachains" {...a11yProps(1)} disableRipple disableFocusRipple />
          <Tab sx={{ my:1,  mr: 2, borderRadius: 3 }} label="Val. Groups" {...a11yProps(2)} disableRipple disableFocusRipple />
          <Tab sx={{ my:1,  borderRadius: 3 }} label="Cores" {...a11yProps(3)} disableRipple disableFocusRipple />
        </Tabs>
        { tab !== 3 ? <ModeSwitch mode={selectedMode} /> : null }
      </Box>
      
      {/* <Divider sx={{ 
        opacity: 0.25,
        height: '1px',
        borderTop: '0px solid rgba(0, 0, 0, 0.08)',
        borderBottom: 'none',
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
        }} /> */}
      
      {isHistoryMode && (tab === 1 || tab === 2) ? 
        <Box sx={{ my: 2 }}>
          <SessionHistoryTimelineChart maxSessions={maxHistorySessions} />
        </Box> : null}
      {tab === 0 ? (<InsightsGrid />) : (
        tab === 1 ? (<ParachainsGrid sessionIndex={sessionIndex} />) : (
          tab === 2 ? (<ValGroupsGrid sessionIndex={sessionIndex} />) :
          (<CoresGrid sessionIndex={sessionIndex} />)
          ))
      }
		</Box>
  );
}