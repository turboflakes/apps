import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  selectMaxHistoryEras,
  maxHistoryErasChanged
} from '../features/layout/layoutSlice';
import {
  selectChain,
} from '../features/chain/chainSlice';

const OPTIONS = (selectedChain) => ([
  // {value: 1, description: "1 era"},
  // {value: 2, description: "2 eras"},
  {value: 4, description: "4 eras"},
  {value: 8, description: "8 eras"},
  {value: 16, description: "16 eras"},
  // NOTE: remove 24 eras for polkadot in a future release
  selectedChain === "polkadot" ?
    {value: 24, description: "24 eras"} :
    {value: 32, description: "32 eras"}
])

const CustomMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    // minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      ...theme.typography.caption,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function HistoryErasMenu() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const selectedChain = useSelector(selectChain);
  const maxHistoryEras = useSelector(selectMaxHistoryEras);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (event) => {
    setAnchorEl(null);
    if (!isUndefined(event.target.value)) {
      dispatch(maxHistoryErasChanged(event.target.value));
    }
  };

  return (
    <React.Fragment>
      <Button
        id="history-button"
        sx={{ ...theme.typography.caption, 
          width: 128,
          // textTransform: 'none', 
          fontWeight: 600,
          color: theme.palette.text.primary,
          '& > .MuiButton-endIcon': {
            ml: 0
          } }}
        aria-controls={open ? 'history-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        disableFocusRipple
        disableRipple
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon sx={{ ml: 1}} />}
      >
        {`${OPTIONS(selectedChain).filter(o => o.value === maxHistoryEras)[0].description}`}
      </Button>
      <CustomMenu
        id="history-menu"
        MenuListProps={{
          'aria-labelledby': 'history-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {OPTIONS(selectedChain).map((o, i) => (
          <MenuItem key={i} value={o.value} onClick={handleClose} 
            sx={{width: 128}}
            disableRipple dense>
            {o.description}
          </MenuItem>))}
      </CustomMenu>
    </React.Fragment>
  );
}
