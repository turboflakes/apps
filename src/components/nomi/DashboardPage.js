import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import BoardAnimationCanvas from './BoardAnimationCanvas';
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

  return (
    <Box sx={{ mb: 10, display: 'flex', justifyContent: 'center', backgroundColor: '#3D3D3D'}}>
        <Box sx={{ height: '95vh', position: 'relative', backgroundColor: '#3D3D3D'}}>
          <BoardAnimationCanvas 
            width={window.innerWidth - 56} 
            height={window.innerHeight * 0.95}
            topY={64}
            onBallClick={handleOnBallClick}
          />
          {/* <AccountInfoTable onClose={this.handleOnAccountInfoClose} />
          <Leaderboard /> */}
        </Box>
    </Box>
  );
}