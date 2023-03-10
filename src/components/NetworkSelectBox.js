import * as React from 'react';
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import {
  chainInfoChanged,
  chainChanged,
  selectChain,
} from '../features/chain/chainSlice';
import { getNetworkName, getNetworkIcon } from '../constants'

export default function AccountMenu() {
  const selectedChain = useSelector(selectChain);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{  }}
          aria-controls={open ? 'network-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <img src={getNetworkIcon(selectedChain)}  style={{ 
                  width: 32,
                  height: 32 }} alt={selectedChain}/>
        </IconButton>
        <Typography variant='h5' sx={{ ml: 1, minWidth: 128, textTransform: 'uppercase' }}>{getNetworkName(selectedChain)}</Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="network-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: '#fff',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
            borderRadius: 16,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              // mr: 1,
            },
            '&:hover': {
              // bgcolor: '#fff',
              borderRadius: 16,
            }
            // '&:before': {
            //   content: '""',
            //   display: 'block',
            //   position: 'absolute',
            //   top: 0,
            //   left: 10,
            //   width: 10,
            //   height: 10,
            //   bgcolor: 'background.paper',
            //   transform: 'translateY(-50%) rotate(45deg)',
            //   zIndex: 0,
            // },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {selectedChain === "kusama" ?
          <MenuItem>
            <img src={getNetworkIcon("polkadot")}  style={{ 
                    width: 32,
                    height: 32,
                    mr: 2 }} alt={"polkadot"}/> Polkadot
          </MenuItem> : null}
        {selectedChain === "polkadot" ?
          <MenuItem>
            <img src={getNetworkIcon("kusama")}  style={{ 
                    width: 32,
                    height: 32,
                    mr: 2 }} alt={"kusama"}/> Kusama
          </MenuItem> : null}
      </Menu>
    </React.Fragment>
  );
}
