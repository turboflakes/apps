import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import Link from '@mui/material/Link';
import {
  addressChanged,
  selectAddress
} from '../features/chain/chainSlice';
import {
  selectValProfileByAddress, 
} from '../features/api/valProfilesSlice';
import {
  pageChanged,
} from '../features/layout/layoutSlice';

export default function GridIdentityLink({address}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedAddress = useSelector(selectAddress);
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));

  const handleOnClick = () => {
    if (selectedAddress !== address) {
      dispatch(addressChanged(address));
      dispatch(pageChanged(`validator/${address}`));
      navigate(`/validator/${address}`)
    }
  };

  return (
    <Link color="inherit" underline="none" onClick={handleOnClick} sx={{
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }}>
      {!isUndefined(valProfile) ? valProfile._identity : address}
    </Link>
  )
}

