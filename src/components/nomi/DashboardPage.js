import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import BoardAnimationCanvas from './BoardAnimationCanvas';
// import Leaderboard from './Leaderboard';
import { isValidAddress } from '../../util/crypto'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnBallClick = (address) => {
    console.log("TODO__handleOnBallClick ");
    if (isValidAddress(address)) {
      dispatch(addressChanged(address));
      navigate({
        search: `?a=${address}`,
      })
    }
  }

  console.log("___DashboardPage");

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ height: '95vh', position: 'relative' }}>
          <BoardAnimationCanvas 
            width={window.innerWidth - 56} 
            height={window.innerHeight * 0.95}
            topY={64}
            onBallClick={handleOnBallClick}
          />
          {/* <AccountInfoTable onClose={this.handleOnAccountInfoClose} /> */}
          {/* <Leaderboard />  */}
        </Box>
    </Box>
  );
}