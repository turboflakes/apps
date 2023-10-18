import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import FilterIcon from '@mui/icons-material/FilterAlt';
import NotApplicapleIcon from '@mui/icons-material/NotInterested';
import Stack from '@mui/material/Stack';
import Fingerprint from '@mui/icons-material/NotInterested';
import BoardAnimationCanvas from './BoardAnimationCanvas';
import WeightButtonGroup from './WeightButtonGroup';
import WeightIconButton from './WeightIconButton';
import LeaderboardBox from './LeaderboardBox';
import FiltersDialog from './FiltersDialog';
import nominatingSVG from '../../assets/polkadot_icons/Nominating.svg';
import { isValidAddress } from '../../util/crypto'
import { 
  parseCommissionIntervalToPercentage,
  parsePercentageArrayToCommission,
  parseIntervalToUnit,
  parseIntervalToPercentage,
  parsePercentageArrayToDecimalsInversed,
  parseUnitArrayToDecimals,
  parseInterval } from '../../util/math';
import { stakeDisplayWeight } from '../../util/display';
import {
  useGetBoardsLimitsQuery,
} from '../../features/api/boardsLimitsSlice';
import {
  selectChainInfo
} from '../../features/chain/chainSlice';
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';

/// Position 0 - Lower Commission is preferrable
/// Position 1 - Higher own stake is preferrable
/// Position 2 - Higher Nominators stake is preferrable (limit to 256 -> oversubscribed)
/// Position 3 - Lower Nominators is preferrable
/// Position 4 - Lower MVR is preferrable (MVR = Missed Votes Ratio)

const DrawerHeader = styled('div')(({ theme }) => ({
  // marginTop: 72,
  marginTop: theme.spacing(1),
  borderTop: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const resetWeights = () => {
  return "0,0,0,0,0"
}

function useInitWeightsSearchParams(searchParams, setSearchParams) {
  React.useEffect(() => {
    if (!searchParams.get("w")) {
      searchParams.set("w", resetWeights())
      setSearchParams(searchParams)
      return
    }
    if (searchParams.get("w").split(",").length !== 5) {
      searchParams.set("w", resetWeights())
      setSearchParams(searchParams)
      return
    }
  }, [searchParams]);

  return [];
}

const resetintervals = () => {
  return "0:1000000000,0:10000000000000000,0:10000000000000000,0:100000000000,0:10000000"
}

function useInitIntervalsSearchParams(searchParams, setSearchParams) {
  React.useEffect(() => {
    if (!searchParams.get("i")) {
      searchParams.set("i", resetintervals())
      setSearchParams(searchParams)
      return
    }
    if (searchParams.get("i").split(",").length !== 5) {
      searchParams.set("i", resetintervals())
      setSearchParams(searchParams)
      return
    }
  }, [searchParams]);

  return [];
}

export default function RightDrawer({open, onClose, width}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chainInfo = useSelector(selectChainInfo)
  let [searchParams, setSearchParams] = useSearchParams();
  useInitWeightsSearchParams(searchParams, setSearchParams);
  useInitIntervalsSearchParams(searchParams, setSearchParams);
  
  const {data, isFetching, isError } = useGetBoardsLimitsQuery({session: "current"}, {refetchOnMountOrArgChange: true});

  const [openFilters, setOpenFilters] = React.useState(false);
  const [nominate, setNominate] = React.useState(false);

  const handleOnClickNominate = (address) => {
    console.log("TODO__handleOnClickNominate");
    
  }

  const handleOnChange = (evt, value, index) => {
    let weights = searchParams.get("w").split(",");
    weights[index] = value
    searchParams.set("w", weights.toString())
    setSearchParams(searchParams)
  }

  const handleOnLimitsChange = (evt, value, index) => {
    let intervals = searchParams.get("i").split(",");
    intervals[index] = value.join(':')

    console.log("__intervals", intervals);
    searchParams.set("i", intervals.toString())
    setSearchParams(searchParams)
  }

  if (isFetching || isError || !searchParams.get("w") || !searchParams.get("i")) {
    return null
  }

  let weights = searchParams.get("w").split(",").map(v => parseInt(v));
  let intervals = searchParams.get("i").split(",").map(v => v.split(":").map(i => parseInt(i)));
  
  return (
    <Drawer
        sx={{
        marginTop: 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width,
            border: 0,
        },
        backgroundColor: "#000"
        }}
        variant="persistent"
        anchor="right"
        open={open}
    >
        <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between'}} />
        <List
            subheader={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <ListSubheader sx={{ ...theme.typography.h6, mb: theme.spacing(3) }} color='primary'>Nomination Criteria</ListSubheader>
                {/* <Box sx={{ mr: 1 }}>
                  <IconButton onClick={onClose} size='small'>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
                </Box> */}
              </Box>
            }
          >
            <Divider />
            <ListItem >
              <WeightButtonGroup
                title="Lower commission"
                description="The commission fee is the cut charged by the Validator for their services."
                resultDescription="A lower commission results on a higher score."
                questionDescription="How much you prioritize a validator with lower commission than one with higher commission?"
                limitsTitle="Commission range"
                limits={parseCommissionIntervalToPercentage(data.limits.commission)}
                limitsLabelFormat={(v) => `${v}%`}
                limitsStep={10}
                onChange={(e, v) => handleOnChange(e, v, 0)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parsePercentageArrayToCommission(v), 0)}
                value={weights[0]}
              />
            </ListItem>
            <Divider />
            <ListItem >
              <WeightButtonGroup
                title="Higher performance"
                description="The performance is measured by the ratio of the amount of points missed by the ones potential to be collected."
                resultDescription="A higher performance is preferable and results on a higher score." 
                questionDescription="How much you prioritize a validator with higher performance than one with lower performance?"
                limitsTitle="Performance range"
                limits={parseIntervalToPercentage(data.limits.mvr)}
                limitsLabelFormat={(v) => `${v}%`}
                limitsStep={1}
                onChange={(e, v) => handleOnChange(e, v, 4)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parsePercentageArrayToDecimalsInversed(v), 4)}
                value={weights[4]}
              />
            </ListItem>
            <Divider />
            <ListItem >
              <WeightButtonGroup
                title="Higher self stake" 
                description="The self stake is the amount of funds the Validator has bonded to their stash account. These funds are put at stake for the security of the network and can be slashed."
                resultDescription="A higher self stake amount results on a higher score."
                questionDescription="How much you prioritize a validator with higher self stake one with lower self stake?"
                limitsTitle="Self Stake range"
                limits={parseIntervalToUnit(data.limits.own_stake)}
                limitsLabelFormat={(v) => stakeDisplayWeight(v, chainInfo)}
                limitsStep={1000}
                onChange={(e, v) => handleOnChange(e, v, 1)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parseUnitArrayToDecimals(v), 1)}
                value={weights[1]}
              />
            </ListItem>
            <Divider />
            <ListItem >
              <WeightButtonGroup
                title="Higher Nominators stake"
                description="The nominators stake is the total stake from ALL the nominators who nominate the validator. Similar to Validators self stake, these funds are used for the security of the network and can be slashed."
                resultDescription="A higher nominators stake amount is preferable and results on a higher score." 
                questionDescription="How much you prioritize a validator with higher nominators stake amount one with lower nominators stake?"
                limitsTitle="Nominators Stake range"
                limits={parseIntervalToUnit(data.limits.nominators_stake)}
                limitsLabelFormat={(v) => stakeDisplayWeight(v, chainInfo)}
                limitsStep={10000}
                onChange={(e, v) => handleOnChange(e, v, 2)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parseUnitArrayToDecimals(v), 2)}
                value={weights[2]}
              />
            </ListItem>
            <Divider />
            <ListItem >
              <WeightButtonGroup
                title="Lower Nominators counter"
                description="The nominators counter is the number of nominators backing a validator."
                resultDescription="A lower number of nominators results on a higher score." 
                questionDescription="How much you prioritize a validator with lower number of nominators with one with a higher number of nominators?"
                limitsTitle="Nominators counter range"
                limits={parseInterval(data.limits.nominators_counter)}
                limitsStep={1}
                onChange={(e, v) => handleOnChange(e, v, 3)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, v, 3)}
                value={weights[3]}
              />
            </ListItem>
        </List>
    </Drawer>
  );
}