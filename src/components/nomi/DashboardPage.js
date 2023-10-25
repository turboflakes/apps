import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import isNull from 'lodash/isNull';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import TuneIcon from '@mui/icons-material/Tune';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BoardAnimationCanvas from './BoardAnimationCanvas';
import ValidatorDialog from './ValidatorDialog';
import WelcomeDialog from './WelcomeDialog';
import NominationBox from './NominationBox';
import FiltersFab from './FiltersFab';
import {
  selectBoardProfilesBySessionAndHash,
  selectSyncedSession,
} from '../../features/api/boardsSlice';
import {
  selectCandidates,
  candidatesAdded,
  candidatesCleared,
} from '../../features/api/boardsSlice';
import {
  selectChain,
  selectAddress,
  addressChanged
} from '../../features/chain/chainSlice';
import { isValidAddress, getCriteriasHash } from '../../util/crypto'
import { getMaxValidators } from '../../constants';

const drawerWidth = 448;
const filtersWidth = 256;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, filters }) => ({
    flexGrow: 1,
    padding: 0,
    margin: "0 auto",
    width: window.innerWidth - 56,
    marginRight: 0,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && filters && {
      width: window.innerWidth - 56 - drawerWidth - filtersWidth,
      marginLeft: -filtersWidth/2,
      marginRight: drawerWidth + filtersWidth,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
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

const getHashFromParams = (searchParams) => {
  if (isNull(searchParams.get("w")) || isNull(searchParams.get("i")) || isNull(searchParams.get("f"))) {
    return undefined
  }
  const weights = searchParams.get("w").toString();
  const intervals = searchParams.get("i").toString();
  const filters = searchParams.get("f").toString();
  return getCriteriasHash(weights, intervals, filters)
}

export default function DashboardPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { 
    api,
    leftDrawerWidth, leftDrawerWidthClosed, openLeftDrawer, 
    rightDrawerWidth, openRightDrawer, onRightDrawerToggle } = useOutletContext();
  const selectedChain = useSelector(selectChain);
  const [openValidatorDialog, setOpenValidatorDialog] = React.useState(false);
  const [openWelcomeDialog, setOpenWelcomeDialog] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState();
  const featureAddress = useSelector(selectAddress);
  const candidates = useSelector(selectCandidates);
  let [searchParams, setSearchParams] = useSearchParams();
  const session = useSelector(selectSyncedSession);

  const temp =  useSelector((state) => selectBoardProfilesBySessionAndHash(state, session, getHashFromParams(searchParams)));
  const profiles = temp.map(a => {
    return {
      ...a,
      isCandidate: candidates.includes(a.stash),
    }
  })

  // Welcome dialog
  React.useEffect(() => {
    let t = setTimeout(() => {
      if (!localStorage.getItem('nomi_welcome')) {
        setOpenWelcomeDialog(true);
        localStorage.setItem('nomi_welcome', true)
      }
    }, 1000);
    return () => {
      clearTimeout(t);
    };
  }, []);

  // TurboFlakes dialog clicked
  React.useEffect(() => {
    if (featureAddress) {
      setSelectedAddress(featureAddress)
      setOpenValidatorDialog(true)
    }

    return () => dispatch(addressChanged(''));
  }, [featureAddress]);


  const handleRightDrawerToggle = () => {
    onRightDrawerToggle();
  };

  const handleOnBallClick = (address, options) => {
    if (isValidAddress(address)) {
      setSelectedAddress(address)
      setOpenValidatorDialog(true)
    }
  }

  const handleOnCandidateClick = (address) => {
    if (isValidAddress(address)) {
      setSelectedAddress(address)
      setOpenValidatorDialog(true)
    }
  }

  const handleOnAddAllClick = () => {
    // Reset first the candidates
    dispatch(candidatesCleared())
    const addresses = profiles.slice(0, getMaxValidators(selectedChain)).map(a => a.stash)
    dispatch(candidatesAdded(addresses))
  }

  const handleOnCloseValidatorDialog = () => {
    setOpenValidatorDialog(false);
    setSelectedAddress();
  }

  const handleOnNext = () => {
    const i = profiles.findIndex(p => p.stash === selectedAddress)
    if (i !== -1 && i < profiles.length - 1) {
      const next = profiles[i+1].stash
      handleOnBallClick(next)
    } else {
      const next = profiles[0].stash
      handleOnBallClick(next)
    }
  }

  const handleOnBack = () => {
    const i = profiles.findIndex(p => p.stash === selectedAddress)
    if (i !== -1 && i > 0) {
      const next = profiles[i-1].stash
      handleOnBallClick(next)
    } else {
      const next = profiles[profiles.length-1].stash
      handleOnBallClick(next)
    }
  }

  const handleOnOpenWelcomeDialog = () => {
    setOpenWelcomeDialog(true);
  };

  const handleOnCloseWelcomeDialog = () => {
    setOpenWelcomeDialog(false);
  };
  
  return (
    <Box sx={{ height: `calc(100vh - 144px)` }}>
      <Main>
        <BoardAnimationCanvas
          profiles={profiles}
          // selected={selected}
          width={window.innerWidth - 56} 
          height={window.innerHeight - 72}
          topY={64}
          onBallClick={handleOnBallClick}
        />
        {/* left button / menus */}
        <NominationBox api={api} onClick={handleOnCandidateClick} onAddAllClick={handleOnAddAllClick}
          left={openLeftDrawer ? `calc(${leftDrawerWidth}px + 16px)` : `calc(${leftDrawerWidthClosed}px + 24px)` } />
        {/* right button / menus */}
        <Fab sx={{ 
            position: 'absolute', 
            top: 96 , 
            transition: theme.transitions.create(['right'], {
              duration: theme.transitions.duration.shorter,
            }),
            right: openRightDrawer ? `calc(${rightDrawerWidth}px + 16px)` : theme.spacing(4),
          }}
          onClick={onRightDrawerToggle}
          size="small" color="primary" aria-label="control-panel">
          {openRightDrawer ? <ChevronRightIcon /> : <TuneIcon /> }
        </Fab>
        <FiltersFab right={openRightDrawer ? `calc(${rightDrawerWidth}px + 64px)` : theme.spacing(10)} />
        <Fab sx={{ 
          position: 'absolute', 
          bottom: theme.spacing(4) , 
          transition: theme.transitions.create(['right'], {
            duration: theme.transitions.duration.shorter,
          }),
          right: openRightDrawer ? `calc(${rightDrawerWidth}px + 16px)` : theme.spacing(4),
          }}
          onClick={handleOnOpenWelcomeDialog}
          size="small" color="primary" aria-label="control-panel">
          <QuestionMarkIcon />
        </Fab>
        <Typography sx={{ 
          position: 'absolute', ml: theme.spacing(2),  bottom: theme.spacing(1), color: theme.palette.neutrals[200]}} 
          color='secondary' variant='caption' gutterBottom>
            Disclaimer: NOMI is a complementary tool, always DYOR: Do Your Own Research.
        </Typography>
      </Main>
      <ValidatorDialog
        address={selectedAddress}
        open={openValidatorDialog}
        onClose={handleOnCloseValidatorDialog} 
        onNext={handleOnNext}
        onBack={handleOnBack}
        showDark={true}
      />
      <WelcomeDialog
        open={openWelcomeDialog}
        onClose={handleOnCloseWelcomeDialog}
        showDark={true}
      />
    </Box>
  );
}