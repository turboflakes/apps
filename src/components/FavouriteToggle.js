import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import {
  selectSessionByIndex,
  // selectSessionCurrent,
} from '../features/api/sessionsSlice';
import { 
  selectValidatorBySessionAndAddress,
 } from '../features/api/validatorsSlice'

const ORDER = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

export default function FavouriteToggle({address}) {
  const theme = useTheme();
  const [isFavourite, setIsFavourite] = React.useState(true);
  // const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))
  // // const currentSession = useSelector(selectSessionCurrent);
  // const session = useSelector(state => selectSessionByIndex(state, sessionIndex))
  
  // if (isUndefined(validator) || isUndefined(session) || !validator.is_auth) {
  //   return null
  // }

  // const status = validator.is_auth && validator.is_para ? 'Para-Authority' : (validator.is_auth ? 'Authority' : 'Not Authority');

  const handleToggle = () => {
    setIsFavourite(!isFavourite);
  };

  return (
      <IconButton sx={{ml: theme.spacing(1)}} aria-label="favourite" color="primary" size="small" onClick={handleToggle}>
        {isFavourite ? <StarRoundedIcon fontSize='inherit' /> : <StarOutlineRoundedIcon fontSize='inherit' /> }
      </IconButton>
  );
}