import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BoardAnimationCanvas from './BoardAnimationCanvas';
import ValidatorDialog from './ValidatorDialog';
import WelcomeDialog from './WelcomeDialog';
import {
  useGetBoardsQuery,
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
  const [openValidatorDialog, setOpenValidatorDialog] = React.useState(false);
  const [openWelcomeDialog, setOpenWelcomeDialog] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState();
  let [searchParams, setSearchParams] = useSearchParams();
  
  React.useEffect(() => {
    let t = setTimeout(() => {
        setOpenWelcomeDialog(true)
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

  const handleCloseValidatorDialog = () => {
    setOpenValidatorDialog(false);
    setSelectedAddress();
  }

  const handleCloseWelcomeDialog = () => {
    setOpenWelcomeDialog(false);
  }
  
  return (
    <Box sx={{ height: `calc(100vh - 144px)` }}>
      <Main>
          <BoardAnimationCanvas
            // network={network}
            addresses={addresses}
            // selected={selected}
            width={window.innerWidth - 56} 
            height={window.innerHeight - 72}
            topY={64}
            onBallClick={handleOnBallClick}
          />
      </Main>
      <ValidatorDialog
        address={selectedAddress}
        open={openValidatorDialog}
        onClose={handleCloseValidatorDialog}
      />
      <WelcomeDialog
        open={openWelcomeDialog}
        onClose={handleCloseWelcomeDialog}
      />
    </Box>
  );
}