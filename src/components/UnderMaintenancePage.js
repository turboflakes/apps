import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import onetSVG from '../assets/onet.svg';

export default function DashboardPage() {
  
  return (
    <Box sx={{ mb: 10, display: 'flex', justifyContent: 'center'}}>
		<Container sx={{ }}>
      <Box sx={{display: "flex", justifyContent:"center", 
                alignItems: "center", height: "80vh", }}>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <img src={onetSVG} style={{ 
              margin: "32px",
              opacity: 0.1,
              width: 256,
              height: 256 }} alt={"ONE-T logo"}/>
          <Typography variant="h6" color="secondary">Under Maintenance. ONE-T should be up shortly.</Typography>
        </Box>
      </Box>
		</Container>
    </Box>
  );
}