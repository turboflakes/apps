import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
// import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Identicon from '@polkadot/react-identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import GradeIcon from './GradeIcon';
import GradeHistoryIcon from './GradeHistoryIcon';
// import tvpValid from '../assets/tvp_valid.svg';
// import tvpInvalid from '../assets/tvp_invalid.svg';
import {
  selectSessionCurrent,
  selectSessionHistory
} from '../features/api/sessionsSlice';
import {
  selectValProfileByAddress, 
  useGetValidatorProfileByAddressQuery,
} from '../features/api/valProfilesSlice';
import { stashDisplay } from '../util/display'
import {
  selectChainInfo
} from '../features/chain/chainSlice';
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';
import { stakeDisplay } from '../util/display'

export default function ValProfileText({address}) {
  // const theme = useTheme();
  const {isSuccess} = useGetValidatorProfileByAddressQuery(address)
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  
  console.log("___valProfile:", valProfile, isUndefined(valProfile));

  if (!isSuccess || isUndefined(valProfile)) {
    return (
      <span>{stashDisplay(address, 4)}</span>
    )
  }
  
  return (
    <span>{valProfile._identity}</span>
  );
}