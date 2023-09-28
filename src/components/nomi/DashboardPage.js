import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import BoardAnimationCanvas from './BoardAnimationCanvas';


export default function DashboardPage() {
  return (
    <Box sx={{ mb: 10, display: 'flex', justifyContent: 'center'}}>
        <Box sx={{ height: '95vh', position: 'relative'}}>
          <BoardAnimationCanvas 
            width={window.innerWidth} 
            height={window.innerHeight * 0.95}
            topY={496} // heroBox height = 496
          />
          {/* <AccountInfoTable onClose={this.handleOnAccountInfoClose} />
          <Leaderboard /> */}
        </Box>
    </Box>
  );
}