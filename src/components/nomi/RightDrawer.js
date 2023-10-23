import * as React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import WeightButtonGroup from './WeightButtonGroup';
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
  useGetBoardsQuery,
} from '../../features/api/boardsSlice';
import {
  useGetBoardsLimitsQuery,
} from '../../features/api/boardsLimitsSlice';
import {
  selectChainInfo
} from '../../features/chain/chainSlice';

/// Position 0 - Lower Commission is preferrable
/// Position 1 - Higher own stake is preferrable
/// Position 2 - Higher Nominators stake is preferrable (limit to 256 -> oversubscribed)
/// Position 3 - Lower Nominators is preferrable
/// Position 4 - Lower MVR is preferrable (MVR = Missed Votes Ratio)

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.background.secondary,
  backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))'
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderTop: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
  backgroundColor: theme.palette.background.primary
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

export default function RightDrawer({open, onClose, width, showDark}) {
  const theme = useTheme();
  const chainInfo = useSelector(selectChainInfo)
  let [searchParams, setSearchParams] = useSearchParams();
  useInitWeightsSearchParams(searchParams, setSearchParams);
  useInitIntervalsSearchParams(searchParams, setSearchParams);
  
  const {data, isFetching, isError } = useGetBoardsLimitsQuery({session: "current"}, {refetchOnMountOrArgChange: true});
  useGetBoardsQuery({
    w: searchParams.get("w"), 
    i: searchParams.get("i"), 
    f: searchParams.get("f"),
    n: 32
  }, {refetchOnMountOrArgChange: true});

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
    searchParams.set("i", intervals.toString())
    setSearchParams(searchParams)
  }

  if (isFetching || isError || !searchParams.get("w")) {
    return null
  }

  let weights = searchParams.get("w").split(",").map(v => parseInt(v));
  
  return (
    <Drawer
        sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width,
            border: 0,
            backgroundColor: showDark ? theme.palette.background.secondary : theme.palette.background.primary,
        },
        }}
        variant="persistent"
        anchor="right"
        open={open}
    >
        <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between'}} />
        <List 
            subheader={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                <ListSubheader sx={{ 
                  ...theme.typography.h6, 
                  mt: theme.spacing(2), 
                  mb: theme.spacing(3), 
                  color: showDark ? theme.palette.text.secondary : theme.palette.text.primary,
                  backgroundColor: 'transparent' 
                  }}>Nomination Criteria</ListSubheader>
              </Box>
            }
          >
            <StyledDivider />
            <ListItem >
              <WeightButtonGroup
                showDark={showDark}
                title="Lower commission"
                description="The commission fee is the cut charged by the Validator for their services."
                resultDescription="A lower commission results on a higher score."
                questionDescription="How much you prioritize a validator with lower commission compared to one with higher commission?"
                limitsTitle="Commission range"
                limits={parseCommissionIntervalToPercentage(data.limits.commission)}
                limitsLabelFormat={(v) => `${v}%`}
                limitsStep={10}
                onChange={(e, v) => handleOnChange(e, v, 0)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parsePercentageArrayToCommission(v), 0)}
                value={weights[0]}
              />
            </ListItem>
            <StyledDivider />
            <ListItem >
              <WeightButtonGroup
                showDark={showDark}
                title="Higher performance"
                description="The performance is assessed by calculating the ratio of missed points to the total points that could have been obtained."
                resultDescription="A higher performance is preferable and results on a higher score." 
                questionDescription="How much you prioritize a validator with higher performance compared to one with lower performance?"
                limitsTitle="Performance range"
                limits={parseIntervalToPercentage(data.limits.mvr)}
                limitsLabelFormat={(v) => `${v}%`}
                limitsStep={1}
                onChange={(e, v) => handleOnChange(e, v, 4)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parsePercentageArrayToDecimalsInversed(v), 4)}
                value={weights[4]}
              />
            </ListItem>
            <StyledDivider />
            <ListItem >
              <WeightButtonGroup
                showDark={showDark}
                title="Higher self stake" 
                description="The self stake is the amount of funds the validator has bonded to their stash account. These funds are put at stake for the security of the network and are subject to potential slashing."
                resultDescription="A higher self stake amount results on a higher score."
                questionDescription="How much you prioritize a validator with higher self stake compared to one with lower self stake?"
                limitsTitle="Self Stake range"
                limits={parseIntervalToUnit(data.limits.own_stake)}
                limitsLabelFormat={(v) => stakeDisplayWeight(v, chainInfo)}
                limitsStep={1000}
                onChange={(e, v) => handleOnChange(e, v, 1)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parseUnitArrayToDecimals(v), 1)}
                value={weights[1]}
              />
            </ListItem>
            <StyledDivider />
            <ListItem >
              <WeightButtonGroup
                showDark={showDark}
                title="Higher Nominators stake"
                description="The nominators stake is the total stake from ALL the nominators who nominate the validator. Similar to Validators self stake, these funds are used for the security of the network and can be slashed."
                resultDescription="A higher nominators stake amount is preferable and results on a higher score." 
                questionDescription="How much you prioritize a validator with higher nominators stake amount compared to one with lower nominators stake?"
                limitsTitle="Nominators Stake range"
                limits={parseIntervalToUnit(data.limits.nominators_stake)}
                limitsLabelFormat={(v) => stakeDisplayWeight(v, chainInfo)}
                limitsStep={10000}
                onChange={(e, v) => handleOnChange(e, v, 2)}
                onLimitsChange={(e, v) => handleOnLimitsChange(e, parseUnitArrayToDecimals(v), 2)}
                value={weights[2]}
              />
            </ListItem>
            <StyledDivider />
            <ListItem >
              <WeightButtonGroup
                showDark={showDark}
                title="Lower Nominators counter"
                description="The nominators counter is the number of nominators backing a validator."
                resultDescription="A lower number of nominators results on a higher score." 
                questionDescription="How much you prioritize a validator with lower number of nominators compared to one with a higher number of nominators?"
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