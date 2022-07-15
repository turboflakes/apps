import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Identicon from '@polkadot/react-identicon';
import {
  selectChain
} from '../features/chain/chainSlice';
import { stashDisplay } from '../util/display'
import { chainAddress } from '../util/crypto'
import { 
  useGetValidatorByAddressQuery,
 } from '../features/api/validatorsSlice'
 import {
  selectChainInfo
} from '../features/chain/chainSlice';

export default function ValAddress({address}) {
  const {data, isSuccess, isFetching, isError} = useGetValidatorByAddressQuery(address);
  const chainInfo = useSelector(selectChainInfo)
  
  if (isFetching) {
    return null
  } else if (isSuccess) {
    return (
      <Box
        sx={{
          p: 2,
          // m: 2,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 120,
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
        <Box sx={{ display: "flex"}}>
          <Identicon style={{marginRight: '16px'}}
            value={address}
            size={64}
            theme={'polkadot'} />
          <Box>
            <Typography variant="h4">{data.identity}</Typography>
            <Typography variant="subtitle2">{stashDisplay(chainAddress(address, chainInfo.ss58Format))}</Typography>
          </Box>
        </Box>
      </Box>
    );
  } else {
    return null
  }
}