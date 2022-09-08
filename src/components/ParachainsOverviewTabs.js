import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ValGroupsGrid from './ValGroupsGrid';
import ParachainsOverviewGrid from './ParachainsOverviewGrid';
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice'

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function ParachainsOverviewTabs({sessionIndex}) {
	// const theme = useTheme();
  const {isSuccess} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority", show_summary: true});
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!isSuccess) {
    return null
  }

  return (
		<Box sx={{ my: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs textColor="inherit" sx={{ '.MuiTabs-indicator': { display: 'none' }, '& .Mui-selected': { bgcolor: "rgba(0, 0, 0, 0.22)", fontWeight: 600}}} value={value} onChange={handleChange} aria-label="Parachains" >
          <Tab sx={{ my:1, mr: 2,  borderRadius: 3, bgcolor: "rgba(0, 0, 0, 0.06)",  }} label="Overview" {...a11yProps(0)} disableRipple disableFocusRipple />
          <Tab sx={{ my:1,  borderRadius: 3, bgcolor: "rgba(0, 0, 0, 0.06)",  }} label="Val. Groups" {...a11yProps(1)} disableRipple disableFocusRipple />
        </Tabs>
      </Box>
      {value === 0 ? 
        (<ParachainsOverviewGrid sessionIndex={sessionIndex} />) :
        (<ValGroupsGrid sessionIndex={sessionIndex} />)
      }     
		</Box>
  );
}