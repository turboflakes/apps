import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsGrid from './InsightsGrid';
import ValGroupsGrid from './ValGroupsGrid';
import ParachainsGrid from './ParachainsGrid';
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice';
 import {
  pageChanged,
} from '../features/layout/layoutSlice';
 import {
  selectChain,
} from '../features/chain/chainSlice';

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const tabPages = ["insights", "parachains", "val-groups"];

export default function OverviewTabs({sessionIndex, tab}) {
	// const theme = useTheme();
  const navigate = useNavigate();
	const dispatch = useDispatch();
  const selectedChain = useSelector(selectChain);
  const {isSuccess} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority", show_summary: true, show_profile: true}, {refetchOnMountOrArgChange: true});
  const handleChange = (event, newValue) => {
    dispatch(pageChanged(tabPages[newValue]));
    // navigate(`/one-t/${selectedChain}/${tabPages[newValue]}`)
    navigate(`/${tabPages[newValue]}`)
  };

  if (!isSuccess) {
    return null
  }

  return (
		<Box sx={{ my: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs textColor="inherit" sx={{ 
          '.MuiTabs-indicator': { display: 'none' }, 
          '& .Mui-selected': { 
            bgcolor: 'rgba(11, 19, 23, 0.08)',
            color: '#0B1317'
          }}} value={tab} onChange={handleChange} aria-label="Overview" >
          <Tab sx={{ my:1, mr: 2,  borderRadius: 3 }} label="Insights" {...a11yProps(0)} disableRipple disableFocusRipple />
          <Tab sx={{ my:1, mr: 2,  borderRadius: 3 }} label="Parachains" {...a11yProps(1)} disableRipple disableFocusRipple />
          <Tab sx={{ my:1,  borderRadius: 3 }} label="Val. Groups" {...a11yProps(2)} disableRipple disableFocusRipple />
        </Tabs>
      </Box>
      {tab === 0 ? (<InsightsGrid sessionIndex={sessionIndex} />) : (
        tab === 1 ? (<ParachainsGrid sessionIndex={sessionIndex} />) : 
        (<ValGroupsGrid sessionIndex={sessionIndex} />))
      }
		</Box>
  );
}