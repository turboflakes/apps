import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {
  addressChanged,
  selectAddress
} from '../features/chain/chainSlice';
import {
  pageChanged,
} from '../features/layout/layoutSlice';

export default function DetailsIcon({address}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);

  const handleOnClick = () => {
    if (selectedAddress !== address) {
      dispatch(addressChanged(address));
      dispatch(pageChanged(`validator/${address}`));
      navigate(`/validator/${address}`)
      // navigate(`/one-t/${selectedChain}/validator/${address}`)
    }
  };

  return (
    <IconButton color="primary" onClick={handleOnClick} align="right">
      <SearchIcon />
    </IconButton>
  )
}

