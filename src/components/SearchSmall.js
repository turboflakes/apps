import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { isValidAddress } from '../util/crypto'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';

export default function SearchSmall({width = 512}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const currentSelected = useSelector(selectAddress);
  const [address, setAddress] = React.useState("");
  let [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event) => {
    setAddress(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isValidAddress(address)) {
      // setSearchParams({address});
      // dispatch(addressChanged(address));
      // setAddress("");
      dispatch(addressChanged(address));
      dispatch(pageChanged(`validator/${address}`));
      // navigate(`/one-t/${selectedChain}/validator/${address}`);
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
          placeholder="Search by validator stash address"
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