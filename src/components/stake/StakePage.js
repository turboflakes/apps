import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Identicon from '@polkadot/react-identicon';
import raidenSVG from '../../assets/raiden.svg';
import polkadotSVG from '../../assets/Polkadot_Logo_Horizontal_White.svg';
import backgroundSVG from '../../assets/background_dots.svg';
import { stashDisplay } from '../../util/display'
import { getTurboValidators } from '../../constants/index';

export default function StakePage({name}) {
  const theme = useTheme();
  
  return (
    
      <Box sx={{
        width: '100%',
        display: 'flex', alignItems: 'center',
        backgroundImage: "linear-gradient(90deg, #E6E86A, #F15A29, #E6E86A)",
        position: "relative",
        minHeight: window.innerHeight - 72,
        zIndex: 1,
        margin: `${theme.spacing(16)}px 0 0 0`,
        padding: `${theme.spacing(8)}px 0`,
        '&:after': {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          display: "block",
          background: `url(${backgroundSVG}) repeat center`,
        },
      }}>
        <Grid container sx={{
          ...theme.container
        }}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ 
              display: "flex",
              alignItems: "center",
              flexDirection: "column" }}>
              <Box sx={{
                // marginBottom: theme.spacing(4),
                maxWidth: "max-content",
              }}>
                <Typography
                    variant="h1"
                    color="textPrimary"
                    align="left"
                  >RAIDEN
                </Typography>
                <Box sx={{
                  marginBottom: theme.spacing(4),
                  maxWidth: "max-content",
                }} />
              </Box>
              <Box>
                <img src={raidenSVG} sx={{
                  width: 448,
                  [theme.breakpoints.down('sm')]: {
                    width: 256,
                  }}} alt={"Raiden Polkadot Validator"}/>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ 
            display: "flex",
            justifyContent: "center"}}> 
            <Box sx={{
              position: "relative",
              // backgroundImage: "linear-gradient(90deg, #F15A29, #E6E86A)",
              backgroundColor: theme.palette.text.primary,
              borderRadius: theme.spacing(1)/2,
              margin: `${theme.spacing(10)} 0`,
              padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(8)} ${theme.spacing(3)}`,
              [theme.breakpoints.down('sm')]: {
                margin: `${theme.spacing(4)} ${theme.spacing(2)}`,
              }
            }}>
              <Typography
                  variant="h4"
                  color="textSecondary"
                  align="left"
                  paragraph
                >Stake with TurboFlakes
              </Typography>
              <Typography
                  variant="body1"
                  color="textSecondary"
                  align="left"
                  gutterBottom
                ><b>Raiden</b> is our supra-sumo Validator running in the Polkadot Network.
              </Typography>
              <Typography
                  variant="body1"
                  color="textSecondary"
                  align="left"
                  paragraph
                ><b>Raiden's</b> commission is <b>1%</b> and you get instant rewards every era - payouts are ensured by <b>CRUNCH</b>.
              </Typography>
              <Typography
                  variant="body1"
                  color="textSecondary"
                  align="left"
                >Nominate <b>Raiden</b>.
              </Typography>
              {getTurboValidators("polkadot").map((v, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center'}}>
                    <Box sx={{ position: 'relative'}}>
                      <Identicon
                        value={v.stash}
                        size={32}
                        theme={'polkadot'} />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        marginLeft: theme.spacing(2)
                      }}
                      color="textSecondary"
                      align="left"
                    >{stashDisplay(v.stash)} <br/>TURBOFLAKES.IO/<b>RAIDEN</b>
                    </Typography>
                  </Box>
                ))}   
              <Box sx={{
                position: "absolute",
                bottom: theme.spacing(2),
                right: theme.spacing(3),
              }}>
                <img src={polkadotSVG} style={{ width: 128 }} alt={"Polkadot Network"}/>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box> 
    
  );
}