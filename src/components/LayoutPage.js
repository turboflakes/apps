import * as React from 'react';
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Chip from '@mui/material/Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faWaterLadder, faServer } from '@fortawesome/free-solid-svg-icons'
import HubIcon from '@mui/icons-material/Hub';
import SearchSmall from './SearchSmall'
import SessionPerformancePieChartHeader from './SessionPerformancePieChartHeader';
import SessionPieChartHeader from './SessionPieChartHeader';
import SessionBoxHeader from './SessionBoxHeader';
import Footer from './Footer'
import SessionSlider from './SessionSlider';
import SessionSliderRange from './SessionSliderRange';
import ModeSwitch from './ModeSwitch';
import ModeMenu from './ModeMenu';
import { getNetworkIcon } from '../constants'
import polkadotJsSVG from '../assets/polkadot_js_logo.svg';
import onetSVG from '../assets/onet.svg';
import apiSlice from '../features/api/apiSlice'
import {
  pageChanged,
  selectPage,
  selectMode,
  selectIsHistoryMode,
  selectMaxHistorySessions
} from '../features/layout/layoutSlice';
import {
  chainInfoChanged,
  chainChanged,
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  selectAccount,
} from '../features/web3/web3Slice';



function useWeb3ChainInfo(api) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    
    const fetchWeb3ChainInfo = async (api) => {
      return await api.registry.getChainProperties();
    }
    
    if (api) {
      fetchWeb3ChainInfo(api).then((info) => {
				dispatch(chainInfoChanged(info.toHuman()));
			});
		}
  }, [api, dispatch]);

  return [];
}

const drawerWidth = 210;
const drawerWidthClosed = 56;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
  left: theme.spacing(7),
  width: `calc(100% - ${drawerWidthClosed}px)`,
  transition: theme.transitions.create(['width', 'left'], {
	  easing: theme.transitions.easing.sharp,
	  duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
      left: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'left'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),  
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
({ theme, open }) => ({
	'& .MuiDrawer-paper': {
	position: 'relative',
	whiteSpace: 'nowrap',
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	boxSizing: 'border-box',
	...(!open && {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
		width: theme.spacing(5),
		[theme.breakpoints.up('sm')]: {
		  width: theme.spacing(7),
		},
	}),
	},
}),
);

export default function LayoutPage({api}) {
  const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
  
	const [open, setOpen] = React.useState(false);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);
  const selectedPage = useSelector(selectPage);
  const selectedMode = useSelector(selectMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  
  const web3Account = useSelector(selectAccount);
	useWeb3ChainInfo(api);

  const handleChainSelection = (ev, chain) => {
		if (chain === null) {
			return;
		}
		dispatch(chainChanged(chain));
		// Invalidate cached pools so it re-fetchs pools from selected chain
		dispatch(apiSlice.util.invalidateTags(['Pool']));
		navigate(`/${chain}`, {replace: true})
  };

  const handlePageSelection = (page) => {
    dispatch(pageChanged(page));
    navigate(`/${page}`);
    // navigate(`/one-t/${selectedChain}/${page}`)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute" open={open} color="transparent" elevation={0} >
        <Toolbar sx={{ 
          // bgcolor: 'transparent',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          p: 1/2,
          pr: '24px', // keep right padding when drawer closed
          bgcolor: "rgba(255, 255, 255, 0.5)", 
          backdropFilter: 'blur(16px)',
          // borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }} id="top-toolbar">
            <Box sx={{
              display: 'flex', 
              justifyContent: 'center', 
              width: '100%',
              // height: '100%'
            }}>
          
            {/* open/close left drawer */}
            {/* <Box sx={{ }}>
              { open ? 
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton> : 
                
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: '36px',
                    color: 'rgba(0, 0, 0, 0.54)',
                    ...(open && { display: 'none' }),
                  }}
                  >
                  <MenuIcon />
                </IconButton>
              }
            </Box> */}

            {/* network toggle */}
            <ToggleButtonGroup
              value={selectedChain}
              exclusive
              onChange={handleChainSelection}
              sx={{ display: 'flex', alignItems: 'center'	}}
            >
              {!!web3Account ? 
                <Box sx={{ mr: 3, p: 1, mt: 1, display: 'flex', alignItems: 'center', bgcolor: 'background.secondary', borderRadius: 3}}>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 1, pr: 1 }} >{web3Account.meta.name}</Typography>
                  <img src={polkadotJsSVG} style={{ 
                    width: 26,
                    height: 26 }} alt={web3Account.meta.name}/>
                </Box> : null}
              <ToggleButton disabled value="polkadot" aria-label="Polkadot Network" 
                sx={{ mr: 1, border: 0, 
                  '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
                  '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
                <img src={getNetworkIcon("polkadot")}  style={{ 
                  width: 32,
                  height: 32 }} alt={"polkadot"}/>
                {selectedChain === "polkadot" ? <Typography variant='h5' sx={{ paddingLeft: '8px'}}>Polkadot</Typography> : null}
              </ToggleButton>
              <ToggleButton value="kusama" aria-label="Kusama Network" 
                sx={{ border: 0, 
                  '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
                  '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
                <img src={getNetworkIcon("kusama")}  style={{ 
                  width: 32,
                  height: 32 }} alt={"kusama"}/>
                {selectedChain === "kusama" ? <Typography variant='h5' sx={{ paddingLeft: '8px'}}>Kusama</Typography> : null}
              </ToggleButton>
              {/* <ToggleButton value="westend" aria-label="Westend Network" sx={{ mr: 1, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
                <img src={getNetworkIcon("westend")} style={{ 
                  width: 32,
                  height: 32 }} alt={"westend"}/>
                {selected === "westend" ? <Typography variant='h5' sx={{ paddingLeft: '8px'}}>Westend</Typography> : null}
              </ToggleButton> */}
            </ToggleButtonGroup>

            {/* search validator */}
            {/* <Box sx={{ ml: 3, flexGrow: 1, display: 'flex'}}>
              { selectedPage !== 'validators/insights' && selectedPage !== 'dashboard' ? <SearchSmall /> : null }
            </Box> */}
            <Box sx={{ ml: 3, flexGrow: 1, display: 'flex'}}></Box>
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
             <SessionPerformancePieChartHeader />
             <SessionPieChartHeader />
             <SessionBoxHeader />
            </Box>
            {/* mode switch live/history */}
            {/* { selectedPage !== 'dashboard' ? <ModeSwitch mode={selectedMode} /> : null } */}
            
          </Box>
          {/* { selectedPage !== 'dashboard' && isHistoryMode ? 
            <Box sx={{
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                width: '100%',
              }}>
              {selectedPage !== 'validators/insights' ? 
                <SessionSlider maxSessions={maxHistorySessions} /> : <SessionSliderRange />}
            </Box> : null} */}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: open ? 'space-around' : 'flex-end',
                px: [1],
                height: 232
              }}
            >
              {/* open/close left drawer */}
              <Box sx={{ position: 'absolute', left: `8px`, top: `8px` }}>
                <IconButton onClick={toggleDrawer}>
                  {open ? <ChevronLeftIcon /> : <MenuIcon />} 
                </IconButton>
              </Box>

              {/* app logo/name */}
              <Box sx={{display: open ? 'contents': 'none'}}>
                {/* <Box sx={{ m: 2, p: 2, width: 96, height: 96, visibility: open ? 'visible': 'hidden', borderRadius: 30 }}> */}
                  <img src={onetSVG} style={{ 
                    width: 96,
                    height: 96 }} alt={"github"}/>
                {/* </Box> */}
                {/* <Typography sx={{visibility: open ? 'visible': 'hidden'}} variant="h5">ONE·T</Typography> */}
                <Typography sx={{visibility: open ? 'visible': 'hidden'}} variant="caption"><b>ONE·T</b> Insights Space</Typography>
                <Chip sx={{ my: 1 }} label="beta version" color='primary'/>
              </Box>
              <Box sx={{display: !open ? 'contents': 'none'}}>
                <Typography variant="h5">O</Typography>
                <Typography variant="h5">N</Typography>
                <Typography variant="h5">E</Typography>
                <Typography variant="h5">·</Typography>
                <Typography variant="h5" gutterBottom>T</Typography>
              </Box>
            </Toolbar>

            <Divider sx={{ mb: 1 }} />

            {/* menu */}
            <List component="nav" 
              sx={{ '> .MuiListItemButton-root.Mui-selected': {
                bgcolor: "rgba(0, 0, 0, 0.12)"}, '> .MuiListItemButton-root.Mui-selected:hover': { bgcolor: "rgba(0, 0, 0, 0.18)"}
              }}>
              {/* <ListSubheader component="div" sx={{ color: theme.palette.neutrals[300] }}>
                {open ? 'Validators' : 'Val..'}
              </ListSubheader> */}
              
              <ListItemButton selected={selectedPage === 'dashboard'}
                onClick={() => handlePageSelection('dashboard')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
              
              {/* <Divider sx={{ my: 1 }} /> */}

              {/* <ListSubheader component="div" sx={{ color: theme.palette.neutrals[300] }}>
                {open ? 'Validators' : 'Val..'}
              </ListSubheader> */}
              <ListItemButton selected={selectedPage === 'insights'}
                onClick={() => handlePageSelection('insights')}>
                <ListItemIcon sx={{ml: '2px'}}>
                  <FontAwesomeIcon icon={faServer}  />
                </ListItemIcon>
                <ListItemText primary="Validator Insights" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
              
              {/* <Divider sx={{ my: 1 }} /> */}

              {/* <ListSubheader component="div" sx={{ color: theme.palette.neutrals[300] }}>
                {open ? 'Parachains' : 'Par..'}
              </ListSubheader> */}
              <ListItemButton selected={selectedPage === 'parachains'}
                onClick={() => handlePageSelection('parachains')}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faLink} />
                </ListItemIcon>
                <ListItemText primary="Parachains" 
                  sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
              <ListItemButton selected={selectedPage === 'val-groups'}
                onClick={() => handlePageSelection('val-groups')}>
                <ListItemIcon>
                  <HubIcon />
                </ListItemIcon>
                <ListItemText primary="Validator Groups" 
                  sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
              
              {/* <Divider sx={{ my: 1 }} /> */}

              {/* <ListSubheader component="div" sx={{ color: theme.palette.neutrals[300] }}>
                {open ? 'Nomination Pools' : 'Nom..'}
              </ListSubheader> */}

              <ListItemButton  selected={selectedPage === 'pools'}  disabled
                onClick={() => handlePageSelection('pools')}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faWaterLadder} />
                </ListItemIcon>
                <ListItemText primary="Nomination Pools" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
            </List>
          </Drawer>
      <Box
            component="main"
            sx={{
              // backgroundColor: (theme) =>
              //   theme.palette.mode === 'light'
              //     ? theme.palette.grey[100]
              //     : theme.palette.grey[900],
              background: isHistoryMode ? theme.palette.gradients.light180 : theme.palette.gradients.light180,
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >	
        {/*  hidden toolbar */}
        <Toolbar/>
        <Outlet api={api} />
        <Footer small />
      </Box>
    </Box>
  );
}