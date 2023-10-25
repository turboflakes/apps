import * as React from 'react';
import { useNavigate, useSearchParams, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/EmailRounded';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faWaterLadder, faServer } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'
import SearchSmall from './SearchSmall'
import SessionPerformancePieChartHeader from './SessionPerformancePieChartHeader';
import SessionPieChartHeader from './SessionPieChartHeader';
import SessionBoxHeader from './SessionBoxHeader';
import RightDrawer from './nomi/RightDrawer';
import onetSVG from '../assets/onet.svg';
import nomiSVG from '../assets/nomi.svg';
import crunchSVG from '../assets/crunchbot.svg';
import scoutySVG from '../assets/scouty.svg';
import polkadotSVG from '../assets/polkadot_icon.svg';
import kusamaSVG from '../assets/kusama_icon.svg';
import turboflakesSVG from '../assets/logo/logo_mark_black_subtract_turboflakes_.svg';
import twitterSVG from '../assets/twitter_black.svg';
import githubSVG from '../assets/github_black.svg';
import apiSlice from '../features/api/apiSlice';
import { getTurboValidators } from '../constants/index';
import Identicon from '@polkadot/react-identicon';
import {
  pageChanged,
  selectPage,
} from '../features/layout/layoutSlice';
import {
  selectApp,
} from '../features/app/appSlice';
import {
  chainInfoChanged,
  addressChanged,
  selectChain,
} from '../features/chain/chainSlice';
import { 
  getNetworkIcon, 
  getNetworkLogo, 
} from '../constants'
import { addressSS58 } from '../util/crypto';

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

const leftDrawerWidth = 210;
const leftDrawerWidthClosed = 56;
const rightDrawerWidth = 296;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
  left: theme.spacing(7),
  width: `calc(100% - ${leftDrawerWidthClosed}px)`,
  transition: theme.transitions.create(['width', 'left'], {
	  easing: theme.transitions.easing.sharp,
	  duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
      left: leftDrawerWidth,
      width: `calc(100% - ${leftDrawerWidth}px)`,
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
	width: leftDrawerWidth,
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

function AppsOptions({openLeftDrawer, onToolClicked, onAppChanged}) {
  const theme = useTheme();
  const selectedApp = useSelector(selectApp);

  return (
    <React.Fragment>

      <ListSubheader sx={{ m: 0, p: 0, pl: theme.spacing(3/2), color: theme.palette.neutrals[300] }}>
        { openLeftDrawer ? `Apps & Tools` : `Apps`}
      </ListSubheader>

      { selectedApp !== 'nomi' ?
        <ListItemButton onClick={() => onAppChanged('nomi')} disableRipple>
          <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(1/2) }}>
            <img src={nomiSVG} style={{ 
                width: 32,
                height: 32 }} alt={"nomi"}/>
          </ListItemIcon>
          <ListItemText primary="NOMI" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton> : null }

      { selectedApp !== 'onet' ?
        <ListItemButton onClick={() => onAppChanged('onet')} disableRipple>
          <ListItemIcon sx={{ml: theme.spacing(-1/2), py: theme.spacing(1/2) }}>
            <img src={onetSVG} style={{ 
              width: 32,
              height: 32 }} alt={"one-t"}/>
          </ListItemIcon>
          <ListItemText primary="ONE-T" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton> : null }

      <ListItemButton onClick={() => onToolClicked('crunch')} disableRipple>
        <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(1/2) }}>
          <img src={crunchSVG} style={{ 
            width: 32,
            height: 32 }} alt={"crunch"}/>
        </ListItemIcon>
        <ListItemText primary="CRUNCH" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
      </ListItemButton>

      <ListItemButton onClick={() => onToolClicked('scouty')} disableRipple>
        <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(1/2) }}>
          <img src={scoutySVG} style={{ 
            width: 32,
            height: 32 }} alt={"scouty"}/>
        </ListItemIcon>
        <ListItemText primary="SCOUTY" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
      </ListItemButton>

    </React.Fragment>
  )
}

function ValidatorOptions({openLeftDrawer, onValidatorClicked}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);

  return (
    <React.Fragment>

      <ListSubheader sx={{ m: 0, p: 0, pl: theme.spacing(3/2), color: theme.palette.neutrals[300] }}>
        { openLeftDrawer ? `TurboFlakes Validators` : `Vals`}
      </ListSubheader>

      {getTurboValidators(selectedChain).map((v, i) => (
        <ListItemButton key={i} onClick={() => onValidatorClicked(v.stash)}>
          <ListItemIcon sx={{ 
            ml: theme.spacing(-1/2), py: theme.spacing(0),
            display: 'flex', alignItems: 'center' }}>
              <img src={v.svg} 
                style={{ 
                  width: 32,
                  height: 32 }} alt={v.name}/>
          </ListItemIcon>
          <ListItemText primary={v.name} sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton>
      ))}

      {/* {getTurboValidators(selectedChain).map((v, i) => (
        <ListItemButton key={i} onClick={() => onValidatorClicked(v.stash)}>
          <ListItemIcon sx={{ 
            ml: theme.spacing(-1/2), py: theme.spacing(0),
            display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative'}}>
              <img src={selectedChain === 'polkadot' ? polkadotSVG : kusamaSVG } 
                style={{ 
                  position: 'absolute', 
                  border: '1px solid #FFF', borderRadius: '50%', 
                  height: 20, right: -8, bottom: 2 }} alt={"github"}/>
              <Identicon
                value={v.stash}
                size={28}
                theme={'polkadot'} />
            </Box>
          </ListItemIcon>
          <ListItemText primary={v.name} sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton>
      ))} */}
      
    </React.Fragment>
  )
}

function OnetOptions({openLeftDrawer, onOptionChanged, onChainChanged, onAppChanged, onToolClicked, onValidatorClicked}) {
  const theme = useTheme();
	const selectedApp = useSelector(selectApp);
	const selectedChain = useSelector(selectChain);
  const selectedPage = useSelector(selectPage);
  
  if (selectedApp !== "onet") {
    return null
  }

  return (
    <Box component="span">

      <Divider />

      {selectedChain === "kusama" ? 
        <ListItemButton sx={{  }} onClick={() => onChainChanged('polkadot')} disableRipple>
          <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(2) }}>
            <img src={getNetworkIcon("polkadot")} style={{ 
                width: 28,
                height: 28 }} alt={"polkadot"}/>
          </ListItemIcon>
          <ListItemText primary="POLKADOT" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton> : null}

      {selectedChain === "polkadot" ? 
        <ListItemButton onClick={() => onChainChanged('kusama')} disableRipple>
          <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(2) }}>
            <img src={getNetworkIcon("kusama")} style={{ 
                width: 28,
                height: 28 }} alt={"kusama"}/>
          </ListItemIcon>
          <ListItemText primary="KUSAMA" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton>
          : null}

      <Divider />

      <ListSubheader sx={{ m: 0, p: 0, pl: theme.spacing(3/2), color: theme.palette.neutrals[300] }}>
        { `Pages`}
      </ListSubheader>

      <ListItemButton selected={selectedPage === 'dashboard'} disableRipple
        onClick={() => onOptionChanged('dashboard')}>
        <ListItemIcon>
          <DashboardIcon sx={{ color: theme.palette.text.primary }} />
        </ListItemIcon>
        <ListItemText primary="Dashboard" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
      </ListItemButton>

      <ListItemButton selected={selectedPage === 'insights'} disableRipple
        onClick={() => onOptionChanged('insights')}>
        <ListItemIcon sx={{ml: '2px'}}>
          <Box><FontAwesomeIcon icon={faServer} style={{ color: theme.palette.text.primary }} /></Box>
        </ListItemIcon>
        <ListItemText primary="Validator Insights" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
      </ListItemButton>
      
      <ListItemButton selected={selectedPage === 'parachains'} disableRipple
        onClick={() => onOptionChanged('parachains')}>
        <ListItemIcon>
          <Box><FontAwesomeIcon icon={faLink} style={{ color: theme.palette.text.primary }} /></Box>
        </ListItemIcon>
        <ListItemText primary="Parachains" 
          sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
      </ListItemButton>
    
      <ListItemButton selected={selectedPage === 'val-groups'} disableRipple
        onClick={() => onOptionChanged('val-groups')}>
        <ListItemIcon>
          <HubIcon sx={{ color: theme.palette.text.primary }} />
        </ListItemIcon>
        <ListItemText primary="Validator Groups" 
          sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
      </ListItemButton>

      <ListItemButton  selected={selectedPage === 'pools'} disableRipple
        onClick={() => onOptionChanged('pools')}>
        <ListItemIcon >
          <Box><FontAwesomeIcon icon={faWaterLadder} style={{ color: theme.palette.text.primary }} /></Box>
        </ListItemIcon>
        <ListItemText primary="Nomination Pools" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem'} }} />
      </ListItemButton>

      <Divider />

      <Box sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: 320,
      }}>
        
        <AppsOptions openLeftDrawer={openLeftDrawer} onAppChanged={onAppChanged} onToolClicked={onToolClicked} />

        <Divider />

        <ValidatorOptions openLeftDrawer={openLeftDrawer} onValidatorClicked={onValidatorClicked} />
      </Box>

    </Box>
  )
}

function NomiOptions({openLeftDrawer, onChainChanged, onAppChanged, onToolClicked, onValidatorClicked}) {
  const theme = useTheme();
	const selectedApp = useSelector(selectApp);
	const selectedChain = useSelector(selectChain);
  
  if (selectedApp !== "nomi") {
    return null
  }

  return (
    <Box component="span">

      <Divider />

      {selectedChain === "kusama" ? 
        <ListItemButton onClick={() => onChainChanged('polkadot')} disableRipple>
          <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(2) }}>
            <img src={getNetworkIcon("polkadot")} style={{ 
                width: 28,
                height: 28 }} alt={"polkadot"}/>
          </ListItemIcon>
          <ListItemText primary="POLKADOT" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton> : null}

      {selectedChain === "polkadot" ? 
        <ListItemButton onClick={() => onChainChanged('kusama')} disableRipple>
          <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(2) }}>
            <img src={getNetworkIcon("kusama")} style={{ 
                width: 28,
                height: 28 }} alt={"kusama"}/>
          </ListItemIcon>
          <ListItemText primary="KUSAMA" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton>
          : null}

      <Divider />

      <Box sx={{

      }}>

        <AppsOptions openLeftDrawer={openLeftDrawer} onAppChanged={onAppChanged} onToolClicked={onToolClicked} />

        <Divider />

        <ValidatorOptions openLeftDrawer={openLeftDrawer} onValidatorClicked={onValidatorClicked} />

      </Box>

      {/* {selectedChain === "polkadot" ?
        <ListItemButton onClick={() => onValidatorClicked('raiden')} disableRipple>
          <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: theme.spacing(1) }}>
            <img src={raidenSVG} style={{ 
              width: 28,
              height: 28 }} alt={"raiden"}/>
          </ListItemIcon>
          <ListItemText primary="RAIDEN" sx={{ '> .MuiTypography-root': {fontSize: '0.875rem', fontWeight: 600 } }} />
        </ListItemButton> : null } */}

    </Box>
  )
}

function FooterLeftDrawer({openLeftDrawer}) {
  const theme = useTheme();

  const handleOnClick = () => {
    window.open(`https://www.turboflakes.io`, '_blank')
  }
	
  return (
    <Box component="span" sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }}>
      <Divider />
        
      <ListItem disableRipple>
        <ListItemIcon sx={{ ml: theme.spacing(-1/2), py: 0, 
        '&:hover': {
          cursor: 'pointer'
        }}} onClick={handleOnClick} >
          <img src={turboflakesSVG}  
            style={{ 
              width: 28,
              height: 28 }} alt={"turboflakes"}/>
        </ListItemIcon>
        <ListItemText primary="TurboFlakes © 2023" secondary="Supported by Kusama Treasury"
          variant="caption" 
          sx={{ 
            ml: theme.spacing(-2), 
            visibility: openLeftDrawer ? 'visible' : 'hidden',
            '> .MuiTypography-root': {
              ...theme.typography.caption,
              },
            '> .MuiListItemText-secondary': {
              ...theme.typography.caption,
              fontSize: "0.625rem",
            }
          }} />
      </ListItem> 

    </Box>
    
  )
}

function SocialIcons() {
  const theme = useTheme();

  const handleTwitter = () => {
		window.open('https://twitter.com/turboflakes', '_blank')
	}
	
	const handleGithub = () => {
		window.open('https://github.com/turboflakes', '_blank')
	}

	const handleEmail = () => {
		window.location.href = "mailto:support@turboflakes.io"
	}
  return (
    <Box>
      <IconButton size="small" sx={{ 
        margin: '0 8px', 
        border: '1px solid #FFF',
        width: 30,
        height: 30,
        color: theme.palette.text.primary
        }} onClick={handleEmail}>
        <EmailIcon sx={{ width: 20 , height: 20 }}/>
      </IconButton>
      <IconButton color="secondary" size="small" sx={{ 
        margin: '0 8px', 
        border: '1px solid #FFF', 
        color: 'text.secondary',
        width: 30,
        height: 30 }} onClick={handleTwitter}>
        <img src={twitterSVG}  style={{ 
          width: 18,
          height: 18 }} alt={"github"}/>
      </IconButton>
      <IconButton color="secondary" size="small" sx={{ 
        ml: 1, 
        border: '1px solid #FFF', 
        color: 'text.secondary',
        width: 30,
        height: 30 }} onClick={handleGithub}>
        <img src={githubSVG} style={{ 
          width: 18,
          height: 18 }} alt={"github"}/>
      </IconButton>
    </Box>
  )
}

export default function LayoutPage({api}) {
  const ref = React.useRef();
  const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [openLeftDrawer, setOpenLeftDrawer] = React.useState(false);
  const [openRightDrawer, setOpenRightDrawer] = React.useState(false);
  const selectedApp = useSelector(selectApp);
	const selectedChain = useSelector(selectChain);
  const selectedPage = useSelector(selectPage);
  const [loading, setLoading] = React.useState(true);
  let [searchParams, setSearchParams] = useSearchParams();
  useWeb3ChainInfo(api, setLoading);

  useScrollTop(ref, selectedPage);

  const toggleDrawer = () => {
		setOpenLeftDrawer(!openLeftDrawer);
	};

  const onRightDrawerToggle = () => {
    setOpenRightDrawer(!openRightDrawer);
  };

  const handleAppSelection = (appName) => {
		if (appName === null) {
			return;
		}

    // change path to dashboard and delete app specific query params
    for (const key of searchParams.keys()) {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
    dispatch(pageChanged('dashboard'));
    navigate(`/dashboard`);
    
    // hard reload
    var urlSearchParams = new URLSearchParams(document.location.search);
    urlSearchParams.set("app", appName);
    document.location.search = urlSearchParams.toString();

		// Invalidate cache
		dispatch(apiSlice.util.invalidateTags(['Pools']));
    dispatch(apiSlice.util.invalidateTags(['Validators']));
    dispatch(apiSlice.util.invalidateTags(['ValProfiles']));
    dispatch(apiSlice.util.invalidateTags(['Blocks']));
    dispatch(apiSlice.util.invalidateTags(['Parachains']));
    dispatch(apiSlice.util.invalidateTags(['Sessions']));
    
  };

  const handleChainSelection = (chain) => {
		if (chain === null) {
			return;
		}
    var urlSearchParams = new URLSearchParams(document.location.search);
    urlSearchParams.set("chain", chain);
    document.location.search = urlSearchParams.toString();

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

  const handleToolClicked = (tool) => {
    switch (tool) {
      case 'crunch':
        window.open('https://github.com/turboflakes/crunch', '_blank')
        break;
      case 'scouty':
        window.open('https://github.com/turboflakes/scouty', '_blank')
        break;
    }
  }

  // const handleValidatorClicked = (name) => {
  //   if (name === null) {
	// 		return;
	// 	}
  //   window.open(`https://www.turboflakes.io/#/${name}`, '_blank')
  // }

  const handleValidatorClicked = (stash) => {
    const defaultSS58 = addressSS58(stash)
    dispatch(addressChanged(defaultSS58))
    if (selectedApp === 'onet') {
      console.log("___selectedApp", selectedApp);
      dispatch(addressChanged(defaultSS58));
      dispatch(pageChanged(`validator/${defaultSS58}`));
      navigate(`/validator/${stash}`)
    }
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
      <LeftDrawer variant="permanent" open={openLeftDrawer} chain={selectedChain} >
        <Box
            sx={{
              my: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >

          {/* app logo/name */}
          { openLeftDrawer ? 
            <Box sx={{ 
              width: "100%",
              height: 224,
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

              <Chip sx={{ mb: theme.spacing(2), p: theme.spacing(1)}} label="beta version" color='primary'/>

              <SocialIcons />
            </Box> : 
            <Box sx={{ 
              width: "100%",
              height: 224,
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            '> .MuiListItemButton-root.Mui-selected': {
            bgcolor: "rgba(0, 0, 0, 0.12)"}, '> .MuiListItemButton-root.Mui-selected:hover': { bgcolor: "rgba(0, 0, 0, 0.18)"}
          }}>

          <OnetOptions 
            openLeftDrawer={openLeftDrawer}
            onOptionChanged={handlePageSelection} 
            onChainChanged={handleChainSelection} 
            onAppChanged={handleAppSelection}
            onToolClicked={handleToolClicked} 
            onValidatorClicked={handleValidatorClicked} />

          <NomiOptions 
            openLeftDrawer={openLeftDrawer}
            onChainChanged={handleChainSelection} 
            onAppChanged={handleAppSelection}
            onToolClicked={handleToolClicked} 
            onValidatorClicked={handleValidatorClicked} />
                              
          <FooterLeftDrawer openLeftDrawer={openLeftDrawer} />
              
        </List>
      </LeftDrawer>
          {selectedApp === "nomi" ?
            <RightDrawer open={openRightDrawer} width={rightDrawerWidth} showDark={true} /> : null }
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
        <Outlet context={{ 
          api, 
          leftDrawerWidth, leftDrawerWidthClosed, openLeftDrawer,
          rightDrawerWidth, openRightDrawer, onRightDrawerToggle }} />
        {/* TODO move footer to left drawer */}
        {/* <Footer small /> */}
      </Box>
    </Box>
  );
}