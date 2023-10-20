import * as React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import union from 'lodash/union';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import BoardAnimationCanvas from './BoardAnimationCanvas';
import ValidatorDialog from './ValidatorDialog';
import WelcomeDialog from './WelcomeDialog';
import NominationFab from './NominationFab';
import FiltersFab from './FiltersFab';
import {
  useGetBoardsQuery,
} from '../../features/api/boardsSlice';
import {
  selectCandidates
} from '../../features/api/boardsSlice';
import { isValidAddress } from '../../util/crypto'

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

export default function DashboardPage() {
  const theme = useTheme();
  const {openWelcomeDialog, handleOpenWelcomeDialog,  handleCloseWelcomeDialog, 
    leftDrawerWidth, leftDrawerWidthClosed, openLeftDrawer,
    rightDrawerWidth, openRightDrawer } = useOutletContext();
  const [openValidatorDialog, setOpenValidatorDialog] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState();
  const candidates = useSelector(selectCandidates);
  let [searchParams, setSearchParams] = useSearchParams();
  
  React.useEffect(() => {
    let t = setTimeout(() => {
      handleOpenWelcomeDialog()
    }, 1000);
    return () => {
      clearTimeout(t);
    };
  }, []);

  const { data, isFetching, isError } = useGetBoardsQuery({
    w: searchParams.get("w"), 
    i: searchParams.get("i"), 
    f: searchParams.get("f")}, {refetchOnMountOrArgChange: true});

  const addresses = isFetching ? [] : (!!data ? data.data[0].addresses : []);

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

  const handleCloseValidatorDialog = () => {
    setOpenValidatorDialog(false);
    setSelectedAddress();
  }

  // const handleCloseWelcomeDialog = () => {
  //   // setOpenWelcomeDialog(false);
  //   onCloseWelcomeDialog()
  // }
  
  return (
    <Box sx={{ height: `calc(100vh - 144px)` }}>
      <Main>
          <BoardAnimationCanvas
            addresses={addresses}
            candidates={candidates}
            // selected={selected}
            width={window.innerWidth - 56} 
            height={window.innerHeight - 72}
            topY={64}
            onBallClick={handleOnBallClick}
          />
          {/* left button / menus */}
          <NominationFab onClick={handleOnCandidateClick}
            left={openLeftDrawer ? `calc(${leftDrawerWidth}px + 16px)` : `calc(${leftDrawerWidthClosed}px + 24px)` } />
          {/* right button / menus */}
          <FiltersFab right={openRightDrawer ? `calc(${rightDrawerWidth}px + 64px)` : theme.spacing(10)} />
          <Fab sx={{ 
            position: 'absolute', 
            bottom: theme.spacing(4) , 
            transition: theme.transitions.create(['right'], {
              duration: theme.transitions.duration.shorter,
            }),
            right: openRightDrawer ? `calc(${rightDrawerWidth}px + 16px)` : theme.spacing(4),
            }}
            onClick={handleOpenWelcomeDialog}
            size="small" color="primary" aria-label="control-panel">
            <QuestionMarkIcon />
          </Fab>
      </Main>
      <ValidatorDialog
        address={selectedAddress}
        open={openValidatorDialog}
        onClose={handleCloseValidatorDialog}
      />
      <WelcomeDialog
        open={openWelcomeDialog}
        onClose={handleCloseWelcomeDialog}
        showDark={true}
      />
    </Box>
  );
}