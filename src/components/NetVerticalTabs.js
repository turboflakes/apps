import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import NetTotalValidatorsBox from './NetTotalValidatorsBox';
import NetActiveValidatorsBox from './NetActiveValidatorsBox';
import NetOversubscribedValidatorsBox from './NetOversubscribedValidatorsBox';
import NetPointsValidatorsBox from './NetPointsValidatorsBox';
import NetOwnStakeValidatorsBox from './NetOwnStakeValidatorsBox';


function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function NetVerticalTabs({sessionIndex, maxSessions, onChange}) {
  // const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue)
  };

  return (
    <Box
      sx={{ display: 'flex', height: 432 , ml: -19 }}
    >
      <Tabs
        orientation="vertical"
        aria-label="Vertical tabs example"
        textColor="inherit"
        sx={{ 
          width: 184,
          '.MuiTabs-indicator': { display: 'none' }, 
          '& .Mui-selected': { 
            bgcolor: 'rgba(11, 19, 23, 0.08)',
            color: '#0B1317'
          }}}
        value={value} onChange={handleChange}
      >
        <Tab sx={{ my:1, mr: 2,  borderRadius: 3, textTransform: 'none', width: 136 }} label="Total Val." {...a11yProps(0)} disableRipple disableFocusRipple />
        <Tab sx={{ my:1, mr: 2,  borderRadius: 3, textTransform: 'none', width: 136 }} label="Active Val." {...a11yProps(1)} disableRipple disableFocusRipple />
        <Tab sx={{ my:1, mr: 2,  borderRadius: 3, textTransform: 'none', width: 136 }} label="Oversubscribed" {...a11yProps(2)} disableRipple disableFocusRipple />
        <Tab sx={{ my:1, mr: 2,  borderRadius: 3, textTransform: 'none', width: 136 }} label="Own Stake" {...a11yProps(2)} disableRipple disableFocusRipple />
        <Tab sx={{ my:1, mr: 2,  borderRadius: 3, textTransform: 'none', width: 136 }} label="Era Points" {...a11yProps(2)} disableRipple disableFocusRipple />
        
      </Tabs>

      { value === 0 ? <NetTotalValidatorsBox sessionIndex={sessionIndex} maxSessions={maxSessions} /> : null }
      { value === 1 ? <NetActiveValidatorsBox sessionIndex={sessionIndex} maxSessions={maxSessions} /> : null }
      { value === 2 ? <NetOversubscribedValidatorsBox sessionIndex={sessionIndex} maxSessions={maxSessions} /> : null }
      { value === 3 ? <NetOwnStakeValidatorsBox sessionIndex={sessionIndex} maxSessions={maxSessions} /> : null }
      { value === 4 ? <NetPointsValidatorsBox sessionIndex={sessionIndex} maxSessions={maxSessions} /> : null }
      
    </Box>
  );
}