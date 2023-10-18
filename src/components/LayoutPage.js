import * as React from 'react';
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import TuneIcon from '@mui/icons-material/Tune';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faWaterLadder, faServer } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'
import SearchSmall from './SearchSmall'
import SessionPerformancePieChartHeader from './SessionPerformancePieChartHeader';
import SessionPieChartHeader from './SessionPieChartHeader';
import SessionBoxHeader from './SessionBoxHeader';
import RightDrawer from './nomi/RightDrawer';
import FiltersFab from './nomi/FiltersFab';
import onetSVG from '../assets/onet.svg';
import nomiSVG from '../assets/nomi.svg';
import apiSlice from '../features/api/apiSlice'
import {
  pageChanged,
  selectPage,
} from '../features/layout/layoutSlice';
import {
  selectApp,
} from '../features/app/appSlice';
import {
  chainInfoChanged,
  // chainChanged,
  selectChain,
} from '../features/chain/chainSlice';
import { 
  getNetworkIcon, 
  getNetworkLogo, 
} from '../constants'

function useWeb3ChainInfo(api, setLoading) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    
    const fetchWeb3ChainInfo = async (api) => {
      return await api.registry.getChainProperties();
    }
    
    if (api) {
      fetchWeb3ChainInfo(api).then((info) => {
        setLoading(false);
        dispatch(chainInfoChanged(info.toHuman()));
        
			}).catch(e => {
        console.log("error: ",e);
      });
		}
  }, [api]);

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
const rightDrawerWidth = 296;

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

const LeftDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
({ theme, open, chain }) => ({
	'& .MuiDrawer-paper': {
	position: 'relative',
	whiteSpace: 'nowrap',
	width: drawerWidth,
  borderRight: 0,
  borderTop: `4px solid ${chain === "polkadot" ? theme.palette.polkadot : theme.palette.background.secondary}`,
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
	const [openLeftDrawer, setOpenLeftDrawer] = React.useState(false);
  const [openRightDrawer, setOpenRightDrawer] = React.useState(false);
  const toggleDrawer = () => {
		setOpenLeftDrawer(!openLeftDrawer);
	};

  const handleRightDrawerToggle = () => {
    setOpenRightDrawer(!openRightDrawer);
  };

  const handleRightDrawerClose = () => {
    setOpenRightDrawer(false);
  }

  const selectedApp = useSelector(selectApp);
	const selectedChain = useSelector(selectChain);
  const selectedPage = useSelector(selectPage);
  const [loading, setLoading] = React.useState(true);
  useWeb3ChainInfo(api, setLoading);

  useScrollTop(ref, selectedPage);

  const handleAppSelection = (appName) => {
		if (appName === null) {
			return;
		}
    var searchParams = new URLSearchParams(document.location.search);
    searchParams.set("app", appName);
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

  // wait for api to be ready
  if (loading) {
    return null
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute" open={openLeftDrawer} color="transparent" elevation={0} >
        <Toolbar sx={{ 
          height: 72,
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          p: 1/2,
          // pr: '24px', // keep right padding when drawer closed
          bgcolor: "rgba(255, 255, 255, 0.5)", 
          backdropFilter: 'blur(16px)',
          }} id="top-toolbar">
            <Box sx={{
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '100%',
              
              // height: '100%'
            }}>
          
            {/* network logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <img src={getNetworkLogo(selectedChain)}  style={{ height: 24 }} alt={selectedChain}/>
              <Divider orientation='vertical' sx={{ 
                mt: 0.5,
                mx: 1, 
                height: 24, 
                bgcolor: theme.palette.text.primary,
                transform: 'rotate(20deg)'
                }} />
              <Divider orientation='vertical' sx={{ 
                mt: 0.5,
                mr: 1, 
                height: 24, 
                bgcolor: theme.palette.text.primary,
                transform: 'rotate(20deg)'
                }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="caption" sx={{mt: 0.5, color: theme.palette.text.primary, fontSize: "0.875rem", lineHeight: 0, fontWeight: 600}}>
                  {selectedApp === "onet" ? `ONE-T` : null }
                  {selectedApp === "nomi" ? `NOMI` : null }
                </Typography>
              </Box>
            </Box>

            {/* search validator */}
            
            {selectedApp === "onet" ? 
              <Box sx={{ ml: 4, flexGrow: 1, display: 'flex'}}>
                <SearchSmall width={openLeftDrawer ? 384 : 512} />
              </Box> : null }
            <Box sx={{ ml: 2, flexGrow: 1, display: 'flex'}}></Box>
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
      <LeftDrawer variant="permanent" open={openLeftDrawer} chain={selectedChain}
        sx={{
          // borderTop: `8px solid ${selectedChain === "polkadot" ? theme.palette.polkadot : theme.palette.background.secondary}`,
        }}>
            <Box
                sx={{
                  my: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 288,
                  position: 'relative',
                }}
              >

              {/* app logo/name */}
              { openLeftDrawer ? 
                <Box sx={{ 
                  width: "100%",
                  height: "100%",
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                  alignItems: 'center', cursor: 'pointer'
                }}
                  onClick={toggleDrawer}>
                  {selectedApp === "onet" ?
                    <img src={onetSVG} style={{ 
                      width: 96,
                      height: 96 }} alt={"one-t"}/> : null }
                  {selectedApp === "nomi" ?
                    <img src={nomiSVG} style={{ 
                      width: 96,
                      height: 96 }} alt={"nomi"}/> : null }
                  <Typography sx={{mt: 2}} variant="h6" color="textPrimary" gutterBottom>
                  {selectedApp === "onet" ? `ONE-T // explorer` : ''}
                  {selectedApp === "nomi" ? `NOMI` : ''}
                  </Typography>
                  <Chip sx={{ my: 2, p: 1}} label="beta version" color='primary'/>
                </Box> : 
                <Box sx={{ 
                  width: "100%",
                  height: "100%",
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                  alignItems: 'center', cursor: 'pointer'}}
                  onClick={toggleDrawer} >
                    {selectedApp === "onet" ? 
                      <React.Fragment>
                        <Typography variant="h5">O</Typography>
                        <Typography variant="h5">N</Typography>
                        <Typography variant="h5">E</Typography>
                        <Typography variant="h5">·</Typography>
                        <Typography variant="h5" gutterBottom>T</Typography>
                      </React.Fragment>
                    : null }
                    {selectedApp === "nomi" ? 
                      <React.Fragment>
                        <Typography variant="h5">N</Typography>
                        <Typography variant="h5">O</Typography>
                        <Typography variant="h5">M</Typography>
                        <Typography variant="h5">I</Typography>
                      </React.Fragment>
                    : null }
                  
                </Box>
              }
            </Box>

            {/* menu */}
            <List component="nav" 
              sx={{ 
                m: 0,
                p: 0,
                height: '100%',
                '> .MuiListItemButton-root.Mui-selected': {
                bgcolor: "rgba(0, 0, 0, 0.12)"}, '> .MuiListItemButton-root.Mui-selected:hover': { bgcolor: "rgba(0, 0, 0, 0.18)"}
              }}>

              <Divider sx={{ 
                opacity: 0.25,
                height: '1px',
                borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                borderBottom: 'none',
                backgroundColor: 'transparent',
                backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                }} />
              
              {selectedApp === "onet" ? 
                <React.Fragment>
                  <ListItemButton selected={selectedPage === 'dashboard'} disableRipple
                    onClick={() => handlePageSelection('dashboard')}>
                    <ListItemIcon>
                      <DashboardIcon sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
                  </ListItemButton>
                
                <Divider sx={{ 
                  opacity: 0.25,
                  height: '1px',
                  borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                  borderBottom: 'none',
                  backgroundColor: 'transparent',
                  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                  }} />

                <ListItemButton selected={selectedPage === 'insights'} disableRipple
                  onClick={() => handlePageSelection('insights')}>
                  <ListItemIcon sx={{ml: '2px'}}>
                    <Box><FontAwesomeIcon icon={faServer} style={{ color: theme.palette.text.primary }} /></Box>
                  </ListItemIcon>
                  <ListItemText primary="Validator Insights" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
                </ListItemButton>
                
                <ListItemButton selected={selectedPage === 'parachains'} disableRipple
                  onClick={() => handlePageSelection('parachains')}>
                  <ListItemIcon>
                    <Box><FontAwesomeIcon icon={faLink} style={{ color: theme.palette.text.primary }} /></Box>
                  </ListItemIcon>
                  <ListItemText primary="Parachains" 
                    sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
                </ListItemButton>
              
                <ListItemButton selected={selectedPage === 'val-groups'} disableRipple
                  onClick={() => handlePageSelection('val-groups')}>
                  <ListItemIcon>
                    <HubIcon sx={{ color: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <ListItemText primary="Validator Groups" 
                    sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
                </ListItemButton>
                
                <Divider sx={{ 
                  opacity: 0.25,
                  height: '1px',
                  borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                  borderBottom: 'none',
                  backgroundColor: 'transparent',
                  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                  }} />

                <ListItemButton  selected={selectedPage === 'pools'} disableRipple
                  onClick={() => handlePageSelection('pools')}>
                  <ListItemIcon >
                    <Box><FontAwesomeIcon icon={faWaterLadder} style={{ color: theme.palette.text.primary }} /></Box>
                  </ListItemIcon>
                  <ListItemText primary="Nomination Pools" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
                </ListItemButton>

                </React.Fragment> : null }

              <Divider sx={{ 
                opacity: 0.25,
                height: '1px',
                borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                borderBottom: 'none',
                backgroundColor: 'transparent',
                backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                }} />

              {selectedChain === "kusama" ? 
                <ListItemButton onClick={() => handleChainSelection('polkadot')} disableRipple>
                  <ListItemIcon sx={{ ml: -0.5, py: 2}}>
                    <img src={getNetworkIcon("polkadot")} style={{ 
                        width: 28,
                        height: 28 }} alt={"polkadot"}/>
                  </ListItemIcon>
                  <ListItemText primary="POLKADOT" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
                </ListItemButton> : null}

              {selectedChain === "polkadot" ? 
                <ListItemButton onClick={() => handleChainSelection('kusama')} disableRipple>
                  <ListItemIcon sx={{ ml: -0.5, py: 2}}>
                    <img src={getNetworkIcon("kusama")} style={{ 
                        width: 28,
                        height: 28 }} alt={"kusama"}/>
                  </ListItemIcon>
                  <ListItemText primary="KUSAMA" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
                </ListItemButton> : null}

                <Divider sx={{ 
                  opacity: 0.25,
                  height: '1px',
                  borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                  borderBottom: 'none',
                  backgroundColor: 'transparent',
                  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                  }} />

              {selectedApp !== "onet" ? 
                <ListItemButton sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                  }} onClick={() => handleAppSelection('onet')} disableRipple>
                  <ListItemIcon sx={{ ml: -0.5, py: 2}}>
                    <img src={onetSVG} style={{ 
                      width: 28,
                      height: 28 }} alt={"one-t"}/>
                  </ListItemIcon>
                  <ListItemText primary="ONE-T" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
                </ListItemButton> : null}

              {selectedApp !== "nomi" ? 
                <ListItemButton sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                  }} onClick={() => handleAppSelection('nomi')} disableRipple>
                  <ListItemIcon sx={{ ml: -0.5, py: 2}}>
                    <img src={nomiSVG} style={{ 
                        width: 28,
                        height: 28 }} alt={"nomi"}/>
                  </ListItemIcon>
                  <ListItemText primary="NOMI" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
                </ListItemButton> : null}

                {/* <Divider sx={{ 
                  opacity: 0.25,
                  height: '1px',
                  borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                  borderBottom: 'none',
                  backgroundColor: 'transparent',
                  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                  }} /> */}
                  
            </List>
          </LeftDrawer>
          {selectedApp === "nomi" ?
            <RightDrawer open={openRightDrawer} width={rightDrawerWidth} /> : null }
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
            width: '100%',
            overflow: 'auto',
            scrollBehavior: "smooth"
          }}
          ref={ref}
          >	
        {/*  hidden toolbar */}
        <Toolbar sx={{ height: 72 }} />
        {/* Nomi open/close drawer */}
        {selectedApp === "nomi" ?
          <FiltersFab right={openRightDrawer ? `calc(${rightDrawerWidth}px + 64px)` : theme.spacing(10)} /> : null }
        {selectedApp === "nomi" ?
          <Fab sx={{ 
                position: 'absolute', 
                top: 96 , 
                right: openRightDrawer ? `calc(${rightDrawerWidth}px + 16px)` : theme.spacing(4),
              }}
              onClick={handleRightDrawerToggle}
              size="small" color="primary" aria-label="control-panel">
              {openRightDrawer ? <ChevronRightIcon /> : <TuneIcon /> }
          </Fab> : null}
        <Outlet context={{ api }} />
        {/* TODO move footer to left drawer */}
        {/* <Footer small /> */}
      </Box>
    </Box>
  );
}

// `calc(${rightDrawerWidth} + ${theme.spacing(4)})`