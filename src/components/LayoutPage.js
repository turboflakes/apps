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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
// import ListSubheader from '@mui/material/ListSubheader';
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
import Tooltip from './Tooltip';
import Footer from './Footer'
import onetSVG from '../assets/onet.svg';
import apiSlice from '../features/api/apiSlice'
import {
  pageChanged,
  selectPage,
  selectIsHistoryMode,
} from '../features/layout/layoutSlice';
import {
  chainInfoChanged,
  // chainChanged,
  selectChain,
} from '../features/chain/chainSlice';
import {
  selectAccount,
} from '../features/web3/web3Slice';
import { 
  getNetworkIcon, 
  getNetworkName 
} from '../constants'

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

function useScrollTop(ref, selectedPage) {
  const [page, setPage] = React.useState(selectedPage);
  React.useEffect(() => {
    if (selectedPage !== page) {
      ref.current.scrollTop = 0;
      setPage(selectedPage)
		}
  }, [selectedPage]);

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
  const ref = React.useRef();
  const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
  
	const [open, setOpen] = React.useState(false);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	const selectedChain = useSelector(selectChain);
  // const selectedAddress = useSelector(selectAddress);
  const selectedPage = useSelector(selectPage);
  // const selectedMode = useSelector(selectMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  // const maxHistorySessions = useSelector(selectMaxHistorySessions);
  
  const web3Account = useSelector(selectAccount);
	useWeb3ChainInfo(api);

  useScrollTop(ref, selectedPage);

  const handleChainSelection = (chain) => {
		if (chain === null) {
			return;
		}
    var searchParams = new URLSearchParams(document.location.search);
    searchParams.set("chain", chain);
    document.location.search = searchParams.toString();

		// Invalidate cache
		dispatch(apiSlice.util.invalidateTags(['Pools']));
    dispatch(apiSlice.util.invalidateTags(['Validators']));
    dispatch(apiSlice.util.invalidateTags(['ValProfiles']));
    dispatch(apiSlice.util.invalidateTags(['Blocks']));
    dispatch(apiSlice.util.invalidateTags(['Parachains']));
    dispatch(apiSlice.util.invalidateTags(['Sessions']));
    
    // dispatch(chainChanged(chain));
  };

  const handlePageSelection = (page) => {
    dispatch(pageChanged(page));
    navigate(`/${page}`);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute" open={open} color="transparent" elevation={0} >
        <Toolbar sx={{ 
          height: 72,
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
              alignItems: 'center',
              width: '100%',
              
              // height: '100%'
            }}>
          
            {/* network and drawer toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <IconButton
                onClick={toggleDrawer}
                size="small"
              >
                <img src={getNetworkIcon(selectedChain)}  style={{ 
                        width: 32,
                        height: 32 }} alt={selectedChain}/>
              </IconButton>
              <Typography variant='h5' sx={{ ml: 1, minWidth: 128, textTransform: 'uppercase' }}>
                {getNetworkName(selectedChain)}
              </Typography>
            </Box>


            {/* <ToggleButtonGroup
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
              <ToggleButton value="polkadot" aria-label="Polkadot Network" 
                sx={{ border: 0, m: 0, p: 1, mr: 1,
                  '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
                  '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
                <img src={getNetworkIcon("polkadot")}  style={{ 
                  width: 32,
                  height: 32 }} alt={"polkadot"}/>
                {selectedChain === "polkadot" ? <Typography variant='h5' sx={{ paddingLeft: '8px'}}>Polkadot</Typography> : null}
              </ToggleButton>
              <ToggleButton value="kusama" aria-label="Kusama Network" 
                sx={{ border: 0, m: 0, p: 1,
                  '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
                  '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
                <img src={getNetworkIcon("kusama")}  style={{ 
                  width: 32,
                  height: 32 }} alt={"kusama"}/>
                {selectedChain === "kusama" ? <Typography variant='h5' sx={{ paddingLeft: '8px'}}>Kusama</Typography> : null}
              </ToggleButton>
            </ToggleButtonGroup> */}

            {/* search validator */}
            <Box sx={{ ml: 4, flexGrow: 1, display: 'flex'}}>
              <SearchSmall width={open ? 384 : 512} />
            </Box>
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
      <Drawer variant="permanent" open={open}
        sx={{
          borderTop: `8px solid ${selectedChain === "polkadot" ? theme.palette.polkadot : theme.palette.background.secondary}`,
        }}>
            <Toolbar
                sx={{
                  my: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 256,
                  
                }}
              >
              {/* open/close left drawer */}
              {/* <Box sx={{ position: 'absolute', left: `8px`, top: `8px` }}>
                <IconButton onClick={toggleDrawer}>
                  {open ? <ChevronLeftIcon /> : <MenuIcon />} 
                </IconButton>
              </Box> */}

              {/* app logo/name */}
              { open ? 
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <img src={onetSVG} style={{ 
                    width: 96,
                    height: 96 }} alt={"github"}/>
                  <Typography sx={{mt: 2}} variant="h6" color="textPrimary" gutterBottom>ONE-T</Typography>
                  <Typography variant="caption" color="textPrimary" gutterBottom>Blockchain Analytics</Typography>
                  <Chip sx={{ my: 2, p: 1}} label="beta version" color='primary'/>
                </Box> : 
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <Typography variant="h5">O</Typography>
                  <Typography variant="h5">N</Typography>
                  <Typography variant="h5">E</Typography>
                  <Typography variant="h5">·</Typography>
                  <Typography variant="h5" gutterBottom>T</Typography>
                </Box>
              }
            </Toolbar>

            {/* menu */}
            <List component="nav" 
              sx={{ 
                m: 0,
                '> .MuiListItemButton-root.Mui-selected': {
                bgcolor: "rgba(0, 0, 0, 0.12)"}, '> .MuiListItemButton-root.Mui-selected:hover': { bgcolor: "rgba(0, 0, 0, 0.18)"}
              }}>

              <Divider sx={{ my: 0 }} />
              
              <ListItemButton selected={selectedPage === 'dashboard'}
                onClick={() => handlePageSelection('dashboard')}>
                <ListItemIcon>
                  <Tooltip
                    disableFocusListener
                    placement="right"
                    title="Dashboard">
                      <DashboardIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
              
              <Divider sx={{ my: 0 }} />

              <ListItemButton selected={selectedPage === 'insights'}
                onClick={() => handlePageSelection('insights')}>
                <ListItemIcon sx={{ml: '2px'}}>
                  <Tooltip
                    disableFocusListener
                    placement="right"
                    title="Validator Insights">
                    <Box><FontAwesomeIcon icon={faServer} /></Box>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Validator Insights" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
              
              <ListItemButton selected={selectedPage === 'parachains'}
                onClick={() => handlePageSelection('parachains')}>
                <ListItemIcon>
                  <Tooltip
                    disableFocusListener
                    placement="right"
                    title="Parachains">
                    <Box><FontAwesomeIcon icon={faLink} /></Box>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Parachains" 
                  sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
            
              <ListItemButton selected={selectedPage === 'val-groups'}
                onClick={() => handlePageSelection('val-groups')}>
                <ListItemIcon>
                  <Tooltip
                    disableFocusListener
                    placement="right"
                    title="Validator Groups">
                    <HubIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Validator Groups" 
                  sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>
              
              <Divider sx={{ my: 0 }} />

              <ListItemButton  selected={selectedPage === 'pools'}
                onClick={() => handlePageSelection('pools')}>
                <ListItemIcon >
                  <Tooltip
                    disableFocusListener
                    placement="right"
                    title="Nomination Pools">
                    <Box><FontAwesomeIcon icon={faWaterLadder} color="textPrimary"/></Box>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Nomination Pools" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
              </ListItemButton>

              <Divider sx={{ my: 0 }} />

              {selectedChain === "kusama" ? 
                <ListItemButton onClick={() => handleChainSelection('polkadot')}>
                  <ListItemIcon sx={{ ml: -0.5, py: 2}}>
                    <img src={getNetworkIcon("polkadot")} style={{ 
                        width: 28,
                        height: 28 }} alt={"polkadot"}/>
                  </ListItemIcon>
                  <ListItemText primary="POLKADOT" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
                </ListItemButton> : null}

              {selectedChain === "polkadot" ? 
                <ListItemButton onClick={() => handleChainSelection('kusama')}>
                  <ListItemIcon sx={{ ml: -0.5, py: 2}}>
                    <img src={getNetworkIcon("kusama")} style={{ 
                        width: 28,
                        height: 28 }} alt={"kusama"}/>
                  </ListItemIcon>
                  <ListItemText primary="KUSAMA" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
                </ListItemButton> : null}

                <Divider sx={{ my: 0 }} />
            </List>
          </Drawer>
      <Box
            component="main"
            sx={{
              // backgroundColor: (theme) =>
              //   theme.palette.mode === 'light'
              //     ? theme.palette.grey[100]
              //     : theme.palette.grey[900],
              background: theme.palette.gradients.light180,
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              scrollBehavior: "smooth"
            }}
            ref={ref}
          >	
        {/*  hidden toolbar */}
        <Toolbar/>
        <Outlet api={api} />
        <Footer small />
      </Box>
    </Box>
  );
}