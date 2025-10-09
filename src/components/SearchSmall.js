import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { isValidAddress, addressSS58 } from '../util/crypto'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import { useGetValidatorsQuery } from '../features/api/validatorsSlice';

export default function SearchSmall({width = 512}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const currentSelected = useSelector(selectAddress);
  const [address, setAddress] = React.useState("");
  let [searchParams, setSearchParams] = useSearchParams();
  
  const { data: validators } = useGetValidatorsQuery({
    show_profile: true,
    size: 20
  }, {
    skip: !address || address.length < 3
  });

  const handleChange = (event) => {
    setAddress(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validatorMatch = validators?.data?.find(v => 
      v.identity?.display?.toLowerCase() === address.toLowerCase()
    );
    
    if (validatorMatch) {
      const defaultSS58 = addressSS58(validatorMatch.address);
      dispatch(addressChanged(defaultSS58));
      dispatch(pageChanged(`validator/${defaultSS58}`));
      navigate(`/validator/${validatorMatch.address}`)
      setAddress("");
    } else if (isValidAddress(address)) {
      const defaultSS58 = addressSS58(address)
      dispatch(addressChanged(defaultSS58));
      dispatch(pageChanged(`validator/${defaultSS58}`));
      navigate(`/validator/${address}`)
      setAddress("");
    }
  }

    return (
      <form style={{ display: "flex", alignItems: "center"}} 
        noValidate autoComplete="off"
        onSubmit={handleSubmit}>
        <TextField
          sx={{
            // backgroundColor: theme.palette.neutrals[100],
            borderRadius: 30,
            width,
          }}
          variant="outlined"
          placeholder="Search by identity or stash address"
          color="primary"
          value={address}
          onChange={handleChange}
          size="small"
          fullWidth
          // error={!isValidAddress(this.state.address)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton sx={{ ml: 1}} onClick={handleSubmit} size="small"
                  color="primary" 
                  // disabled={!isValidAddress(this.state.address)}
                  >
                  <SearchIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 30,
              paddingLeft: '4px',
              '> .MuiOutlinedInput-input': {
                fontSize: "0.925rem",
                height: "30px",
                // fontSize: "0.825rem",
                // lineHeight: "1rem",
              },
            }
          }}
      />
      </form>
    )
}
