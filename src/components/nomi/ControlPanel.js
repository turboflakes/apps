import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RightIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import NominateIcon from '@mui/icons-material/PanToolRounded';
import VisibilityIcon from '@mui/icons-material/VisibilityRounded';
import { isValidAddress } from '../../util/crypto'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';

/// Array of Weight Sliders 
/// 
/// Position 0 - Higher Inclusion rate is preferable
/// Position 1 - Lower Commission is preferable
/// Position 2 - Lower Nominators is preferable (limit to 256 -> oversubscribed)
/// Position 3 - Higher Reward Points is preferable
/// Position 4 - If reward is staked is preferable
/// Position 5 - If in active set is preferable
/// Position 6 - Higher own stake is preferable
/// Position 7 - Lower total stake is preferable
/// Position 8 - Higher number of Reasonable or KnownGood judgements is preferable
/// Position 9 - Lower number of sub-accounts is preferable

export default function ControlPanel() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nominate, setNominate] = React.useState(false);

  // TODO fetch data
  const quantity = 32
  const apiCacheInfo = {
    validators: 1000
  }
  const nominations = []
  const account = {
    address: 'abc'
  }
  const totalCandidates = 16


  const handleOnClickNominate = () => {
    console.log("TODO___handleOnClickNominate");
		if (nominate) {
			// this.handleNominate()
			return
		}
		setNominate(true)
	}

  console.log("TODO___ControlPanel");

  return (
    <Box sx={{ 
      position: "relative",
      color: theme.palette.text.secondary,
      // borderBottomRightRadius: theme.spacing(3),
      overflow: "hidden" }}>

      <Box sx={{
        borderTopRightRadius: theme.spacing(3),
        backgroundColor: "rgba(77,77,77,0.95)",
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
        display: "flex",
        marginBottom: 1
      }} >
        <Box align="left">
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Display Top {quantity} {!!apiCacheInfo.validators ? `out of ${apiCacheInfo.validators} ` : `...`}Validators
          </Typography>
          {/* <QuantitySlider /> */}
        </Box>
        <Box sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          flexGrow: 1
        }}>
          <Button variant="contained" 
            color="primary"
            onClick={handleOnClickNominate}
            startIcon={<span style={{
              backgroundColor: "#FFF",
              borderRadius: "50%",
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: `0 ${theme.spacing(1)}px 0px 0`,
              color: theme.palette.text.primary,
              fontSize: "inherit !important"
            }}>{`${totalCandidates}`}</span>}
            endIcon={nominate ? <NominateIcon /> : <VisibilityIcon />}
            disabled={nominate && (!nominations.length || !account.address)}
            >
            Nominate            
          </Button>
        </Box>
      </Box>
        
    </Box>
  );
}