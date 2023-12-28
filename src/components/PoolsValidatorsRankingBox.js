import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Identicon from '@polkadot/react-identicon';
import Skeleton from '@mui/material/Skeleton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from './Tooltip';
import Spinner from './Spinner';
import PaginationBox from './PaginationBox';
import {
  useGetValidatorsQuery,
  selectValidatorPoolCounterBySessionAndAddress,
  selectValidatorGradeBySessionAndAddress,
} from '../features/api/validatorsSlice'
import {
  addressChanged,
  selectChainInfo
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import {
  selectValProfileByAddress, 
} from '../features/api/valProfilesSlice';
import {
  chainAddress
} from '../util/crypto';
import { 
  stashDisplay, 
  nameDisplay } from '../util/display'

function ItemButtom({address, sessionIndex}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const counter = useSelector(state => selectValidatorPoolCounterBySessionAndAddress(state, sessionIndex, address));
  const grade = useSelector(state => selectValidatorGradeBySessionAndAddress(state, sessionIndex, address));
  const chainInfo = useSelector(selectChainInfo)

  if (isUndefined(valProfile) || isUndefined(counter)) {
    return (<Skeleton variant="text" sx={{ minWidth: 128, fontSize: '0.825rem' }} />)
  }

  const handleAddressSelected = (address) => {
    dispatch(addressChanged(address));
    dispatch(pageChanged(`validator/${address}`));
    // navigate(`/one-t/${selectedChain}/validator/${address}`)
    navigate(`/validator/${address}`)
  }

  return (
    <ListItemButton sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(address)}>
      <ListItemIcon sx={{minWidth: 0, mr: 1, display: 'flex', alignItems: 'center'}}>
        <span style={{ width: '4px', height: '4px', marginLeft: '-4px', marginRight: '8px', borderRadius: '50%', 
          backgroundColor: theme.palette.grade[grade], 
          display: "inline-block" }}></span>
        <Identicon
          value={chainAddress(address, chainInfo.ss58Format)}
          size={24}
          theme={'polkadot'} />
      </ListItemIcon>
      <ListItemText sx={{whiteSpace: "nowrap"}} 
      // primaryTypographyProps={{ style: {fontWeight: 600}}}
        primary={nameDisplay(!!valProfile ? valProfile._identity : stashDisplay(address, 4), 24)}
      />
      <ListItemText align="right" 
        primary={`${counter}x`}
      />
    </ListItemButton>
  )
}

const RANK_SIZE = 100;
const PAGE_SIZE = 8;

export default function PoolsValidatorsRankingBox({sessionIndex, maxSessions, skip}) {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const params = {ranking: "pools", size: RANK_SIZE, show_profile: true}
  const {data, isSuccess, isFetching} = useGetValidatorsQuery(params, {skip});

  const handlePageChange = (page) => {
    setPage(page)
  }

  let ranking = [];
  if (isSuccess) {
    ranking = data.data;
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        // height: 192,
        borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
          <Typography variant="h6">
            {`Top ${RANK_SIZE} Nominees`}
          </Typography>
          <Typography variant="caption">
            Validators most frequently chosen
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Tooltip
            disableFocusListener
            placement="bottom-end"
            title={
              <Box sx={{ p: 1}}>
                <Typography variant="caption" paragraph>
                  <b>Top Validators in Nomination Pools</b>
                </Typography>
                <Typography component="div" variant="caption" paragraph>
                  Validators that are the most frequently picked by pool operators as nominees
                </Typography>
                <Typography component="div" variant="caption" gutterBottom>
                  <b>sorting:</b> Validators are sorted by pool counter in descending order
                </Typography>
              </Box>
            }
            >
            <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300]}}/>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ height: 308, display: 'flex', flexDirection: 'column'}}>
        {isFetching ?
          <Box sx={{ height:"100%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Spinner size={32}/>
          </Box>
          : (isSuccess ?
            <List dense sx={{
              overflow: 'auto',
            }}>
              {ranking.slice(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE).map((v, i) => 
                (<ItemButtom key={i} address={v.address} sessionIndex={sessionIndex} rank={i + (page * PAGE_SIZE) + 1} />))}
            </List> : null)
        }
      </Box>
      <PaginationBox page={page} totalSize={RANK_SIZE} pageSize={PAGE_SIZE} onChange={handlePageChange} />
    </Paper>
  );
}