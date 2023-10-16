import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NominateIcon from '@mui/icons-material/PanToolRounded';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Fingerprint from '@mui/icons-material/NotInterested';
import BoardAnimationCanvas from './BoardAnimationCanvas';
import WeightButtonGroup from './WeightButtonGroup';
import WeightIconButton from './WeightIconButton';
import LeaderboardBox from './LeaderboardBox';
import ExtensionsBox from './ExtensionsBox';
import nominatingSVG from '../../assets/polkadot_icons/Nominating.svg';
import { isValidAddress } from '../../util/crypto'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';

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

export default function DashboardPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = React.useState(true);
  const [filters, setFilters] = React.useState(false);
  const [nominate, setNominate] = React.useState(false);

  // React.useEffect(() => {
  //   if (stash && stash !== selectedAddress) {
  //     dispatch(addressChanged(stash));
  //   }
  // }, [stash, selectedAddress]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleFiltersToggle = () => {
    setFilters(!filters);
  };

  const handleOnBallClick = (address) => {
    console.log("TODO__handleOnBallClick");
    if (isValidAddress(address)) {
      dispatch(addressChanged(address));
      navigate({
        search: `?a=${address}`,
      })
    }
  }

  const handleOnClickNominate = (address) => {
    console.log("TODO__handleOnClickNominate");
    
  }

  const defaultWidth = window.innerWidth - 56;
  const width = open ? ( filters ? defaultWidth - drawerWidth - filtersWidth : defaultWidth - drawerWidth) : defaultWidth;

  console.log("TODO___DashboardPage");

  const totalCandidates = 16

  return (
    <Box sx={{ height: `calc(100vh - 144px)` }}>
      <Main open={open}>
          {/* <IconButton
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
            <TuneIcon />
          </IconButton> */}

          <Button sx={{ 
              position: 'absolute', 
              top: 96 , 
              right: theme.spacing(12),
              zIndex: 1,
              ...(open && { display: 'none' }) 
            }}
            variant="contained"
            color="primary"
            onClick={handleOnClickNominate}
            startIcon={nominate ? <NominateIcon /> : <img src={nominatingSVG} alt={"nominate"}/>}
            >
            Nominate            
          </Button>

          <Fab sx={{ 
              position: 'absolute', 
              top: 96 , 
              right: theme.spacing(4),
              ...(open && { display: 'none' }) 
            }}
            onClick={handleDrawerOpen}
            size="small" color="primary" aria-label="control-panel">
            <TuneIcon />
          </Fab>
          <BoardAnimationCanvas 
            width={window.innerWidth - 56} 
            height={window.innerHeight - 72}
            topY={64}
            onBallClick={handleOnBallClick}
          />
          {/* <Typography> TESTE</Typography> */}
      </Main>
      {/* <Drawer
          sx={{
          marginTop: 72,
          width: filters ? drawerWidth + filtersWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
              width: filters ? drawerWidth + filtersWidth : drawerWidth,
          },
          backgroundColor: "#000"
          }}
          variant="persistent"
          anchor="right"
          open={open}
      >
          <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Button variant="contained"
							color="primary"
							onClick={handleOnClickNominate}
              startIcon={nominate ? <NominateIcon /> : <img src={nominatingSVG} alt={"nominate"}/>}
							// endIcon={<span style={{
              //   backgroundColor: "#FFF",
              //   borderRadius: "50%",
              //   width: 26,
              //   height: 26,
              //   display: "flex",
              //   alignItems: "center",
              //   justifyContent: "center",
              //   margin: `0 ${theme.spacing(1)}px 0px 0`,
              //   color: theme.palette.text.primary,
              //   ...theme.typography.caption
              // }}>{`${totalCandidates}`}</span>}
							// disabled={nominate && (!nominations.length || !account.address)}
							>
							Nominate            
						</Button>
            { nominate ? <ExtensionsBox /> : null}
          </DrawerHeader>
          <Divider />
          <List
              subheader={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <ListSubheader color='primary'>Weights</ListSubheader>
                  <Box sx={{ mr: 1 }}>
                    <IconButton onClick={handleFiltersToggle}>
                        {filters ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                  </Box>
                </Box>
              }
            >
              <ListItem >
                <WeightButtonGroup
                  title="Inclusion rate"
                  description="The inclusion rate is the percentage of eras out of the past 84 that the validator was in the active set." 
                  resultDescription="A higher inclusion rate results on a higher score."
                  unit="%"
                  // limits={isEqual(_limits[0], _intervals[0]) ? parseRateIntervalToPercentage(_limits[0]) : parseRateIntervalToPercentage(_intervals[0])}
                />
              </ListItem>
              <ListItem >
                <WeightButtonGroup
                  title="Commission" 
                  description="The commission fee is a fee charged by a Validator for their service."
                  resultDescription="A lower commission results on a higher score."
                  unit="%"
                  // limits={isEqual(_limits[1], _intervals[1]) ? parseCommissionIntervalToPercentage(_limits[1]) : parseCommissionIntervalToPercentage(_intervals[1])}
                />
              </ListItem>
              <ListItem >
                <WeightButtonGroup
                  title="Nominators"
                  description="The number of nominators backing a validator."
                  scaleDescription="The number of nominator is rescaled using the method min-max normalization. The maximum value is currently 256 (a validator is oversubscribed if more than 256 nominators nominate the same validator). And the minimum value is 0."
                  resultDescription="A lower number of nominators results on a higher score." 
                  // limits={isEqual(_limits[2], _intervals[2]) ? _limits[2] : _intervals[2]}
                />
              </ListItem>
              <ListItem >
                <WeightButtonGroup
                  title="Average points"
                  description="The average reward points is calculated by the mean of reward points a Validator has collected in the last 84 eras. For every era, validators are paid proportionally to the amount of era points they have collected. Era points are reward points earned for payable actions while the Validator is in the active set."
                  scaleDescription="The average reward points is rescaled using the method min-max normalization. The maximum value is the maximum of era points collected from a Validator in one of the last 84 eras. And the minimum value is the minimum of era points collected from a Validator in one of the last 84 eras."
                  resultDescription="A higher average value results on a higher score." 
                  // limits={isEqual(_limits[3], _intervals[3]) ? parsePointsInterval(_limits[3]) : parsePointsInterval(_intervals[3])}
                />
              </ListItem>
              <ListItem >
                <WeightButtonGroup
                  title="Stake rewards"
                  description="The reward destination as 'Staked' is the stash account where the rewards from validating are sent, increasing the amount at stake."
                  scaleDescription="The expression stake rewards has a value of 0 if NOT 'Staked' or 1 if 'Staked'."
                  resultDescription="A reward destination as 'Staked' results on a higher score." 
                  // limits={isEqual(_limits[4], _intervals[4]) ? _limits[4] : _intervals[4]}
                />
              </ListItem>
              <ListItem >
                <WeightButtonGroup
                  title="Active" 
                  description="The Validators that are active are in the active set."
                  scaleDescription="The expression active has a value of 0 if NOT Active or 1 if Active."
                  resultDescription="An active validator results on a higher score." 
                  // limits={isEqual(_limits[5], _intervals[5]) ? _limits[5] : _intervals[5]}
                />
              </ListItem>
          </List>
      </Drawer> */}
    </Box>
  );
}