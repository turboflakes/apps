import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import BoardAnimationCanvas from './BoardAnimationCanvas';
import LeaderboardBox from './LeaderboardBox';
import { isValidAddress } from '../../util/crypto'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    margin: "0 auto",
    width: window.innerWidth - 56,
    marginRight: 0,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: window.innerWidth - 56 - drawerWidth,
      marginRight: drawerWidth,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  marginTop: 72,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function DashboardPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOnBallClick = (address) => {
    console.log("TODO__handleOnBallClick ");
    if (isValidAddress(address)) {
      dispatch(addressChanged(address));
      navigate({
        search: `?a=${address}`,
      })
    }
  }

  const width = open ? window.innerWidth - 56 - drawerWidth : window.innerWidth - 56;

  console.log("TODO___DashboardPage");

  return (
    <Box sx={{ height: `calc(100vh - 72px)` }}>
      <Main open={open}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ 
              position: 'absolute', 
              top: 72 , 
              right: theme.spacing(4), zIndex: 1,
              ...(open && { display: 'none' }) 
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <BoardAnimationCanvas 
            width={width} 
            height={window.innerHeight - 72}
            topY={64}
            onBallClick={handleOnBallClick}
          />
          {/* <AccountInfoTable onClose={this.handleOnAccountInfoClose} /> */}
          {/* <LeaderboardBox />  */}
      </Main>
      <Drawer
          sx={{
          marginTop: 72,
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
              width: drawerWidth,
          },
          }}
          variant="persistent"
          anchor="right"
          open={open}
      >
          <DrawerHeader >
          <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          </DrawerHeader>
          <Divider />
      </Drawer>
    </Box>
  );
}