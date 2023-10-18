import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import BoardAnimationCanvas from './BoardAnimationCanvas';
import ValidatorDialog from './ValidatorDialog';
import { getCriteriasHash } from '../../util/crypto'
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

const DrawerHeader = styled('div')(({ theme }) => ({
  marginTop: 72,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const getHashFromParams = (searchParams) => {
  const weights = searchParams.get("w").toString();
  const intervals = searchParams.get("i").toString();
  const filters = searchParams.get("f").toString();
  return getCriteriasHash(weights, intervals, filters)
}

export default function DashboardPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openValidatorDialog, setOpenValidatorDialog] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState();
  let [searchParams, setSearchParams] = useSearchParams();
  
  const { data, isFetching, isError } = useGetBoardsQuery({
    w: searchParams.get("w"), 
    i: searchParams.get("i"), 
    f: searchParams.get("f")}, {refetchOnMountOrArgChange: true});

  const addresses = isFetching ? [] : data.data[0].addresses;

  const handleOnBallClick = (address, options) => {
    if (isValidAddress(address)) {
      console.log("__options", options);
      setSelectedAddress(address)
      setOpenValidatorDialog(true)
    }
  }

  const handleCloseValidatorDialog = () => {
    setOpenValidatorDialog(false);
    setSelectedAddress();
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
    </Box>
  );
}