import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import LeftIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import RightIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ControlPanel from './ControlPanel';
import { isValidAddress } from '../../util/crypto'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';

export default function LeaderboardBox() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandLeaderboard, setExpandLeaderboard] = React.useState(false);

  console.log("TODO___LeaderboardBox");

  return (
    <Box sx={{ 
      position: "absolute",
      right: theme.spacing(1),
      // top: "calc(-5vh)", // since nomi board takes 95vh of space
      top: theme.spacing(2),
      borderRadius: theme.spacing(2),
      padding: `${theme.spacing(1)}px 0 0 0`,
     }}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{
            position: "relative",
            display: "flex",
            alignItems: "start",
            marginRight: 1,
          }} >
            <Box align="right" >
              <Box sx={{
                zIndex: 1,
                backgroundColor: "rgba(77,77,77,0.95)",
                borderTopLeftRadius: theme.spacing(3),
                // marginBottom: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                {expandLeaderboard ? 
                  <Typography variant="subtitle2" color="textSecondary" sx={{ padding: `0 ${theme.spacing(2)}px` }}>
                    Highest ranked on top 
                  </Typography> : null}
                <IconButton aria-label="expand/collapse validator name"
                  sx={{
                    zIndex: 1,
		                color: theme.palette.text.secondary,
                  }}
                  onClick={() => setExpandLeaderboard(!expandLeaderboard)}>
                  {!expandLeaderboard ? <LeftIcon /> : <RightIcon /> }
                </IconButton>
              </Box>
              {expandLeaderboard ? 
                <Box sx={{
                  backgroundColor: "rgba(77,77,77,0.95)",
		              padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)/2}px ${theme.spacing(1)}px`,
                }}>
                  {/* <SearchSmall /> */}
                  <Typography>{`--> Search Here <--`}</Typography>
                </Box> : null}
              <Box sx={{
                  backgroundColor: "rgba(77,77,77,0.95)",
                  overflow: "auto",
                  height: 719,
                  borderBottomLeftRadius: theme.spacing(3)
                }} style={{
                  minWidth: !expandLeaderboard ? 48 : 260,
                  height: !expandLeaderboard ? 719 : 678
                }}>
                <List>
                  {/* {addresses.map((address, index) => 
                    <AccountItem address={address} key={index} 
                      expanded={expandLeaderboard}/>)} */}
                </List>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{
            borderTopRightRadius: theme.spacing(3),
          }}>
            <ControlPanel />
          </Box>
        </Box>
    </Box>
  );
}