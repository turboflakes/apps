import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupBox from './ValGroupBox';
import { 
  selectValidatorBySessionAndAddress,
} from '../features/api/validatorsSlice';
import onetSVG from '../assets/onet.svg';

export default function ValBodyBox({address, sessionIndex}) {
	// const theme = useTheme();
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))
  if (isUndefined(validator)) {
    return null
  }

  const status = validator.is_auth && validator.is_para ? 
    `The validator is PARA-AUTHORITY at session ${validator.session}.` : 
      (validator.is_auth ? 
        `The validator is AUTHORITY at session ${validator.session}.`  : 
          `The validator is NOT AUTHORITY at session ${validator.session}.`);

  if (validator.is_auth && validator.is_para) {
    return (<ValGroupBox address={address} sessionIndex={sessionIndex} />)
  }

  if ((validator.is_auth && !validator.is_para) || !validator.is_auth) {
    return (
      <Box sx={{display: "flex", justifyContent:"center", 
                alignItems: "center", height: "50vh", }}>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <img src={onetSVG} style={{ 
              margin: "32px",
              opacity: 0.1,
              width: 256,
              height: 256 }} alt={"ONE-T logo"}/>
          <Typography variant="h6">{status}</Typography>
        </Box>
      </Box>
    )
  }

  return null

}