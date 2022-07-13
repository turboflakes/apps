import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
// import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { isValidAddress } from '../util/crypto'
import {
  addressChanged,
  selectAddress
} from '../features/chain/chainSlice';

export default function SearchSmall(props) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentSelected = useSelector(selectAddress);
  const [address, setAddress] = React.useState("");

  const handleChange = (event) => {
    setAddress(event.target.value);
  }

  const changeParams = (query, value) => {
    query.set("a", value)
		const location = {
			search: `?${query.toString()}`
		}
		history.replace(location)
	}

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isValidAddress(address) && currentSelected !== address) {
      let query = new URLSearchParams(history.location.search)
		  changeParams(query, address)
      dispatch(addressChanged(address));
      setAddress("");
    }
  }

    return (
      <Box>
        <form style={{ display: "flex", alignItems: "center"}} 
          noValidate autoComplete="off"
          onSubmit={handleSubmit}>
          <TextField
            sx={{
              // backgroundColor: theme.palette.neutrals[100],
              borderRadius: 30,
              width: 512
            }}
            variant="outlined"
            placeholder="Search by validator address"
            color="primary"
            value={address}
            onChange={handleChange}
            size="small"
            fullWidth
            // error={!isValidAddress(this.state.address)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={handleSubmit} size="small"
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
                  fontSize: "1rem",
                },
              }
            }}
        />
        </form>
      </Box>
    )
}