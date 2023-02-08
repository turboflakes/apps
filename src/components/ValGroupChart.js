import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { BarChart, Area, Bar, LabelList, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  selectChain
} from '../features/chain/chainSlice';
import { isChainSupported, getChainNameShort, getChainColor } from '../constants'

function createData(x, y, m, b, i, e, mvr, pp, tp) {
  return { x, y, m, b, i, e, mvr, pp, tp };
}

// const data = [
//   createData('*',58,70,5,0.0376),
//   createData('A',0,132,1,0.0075),
//   createData('B',1,131,1,0.0075),
//   createData('C',73,27,33,0.2481),
//   createData('D',30,101,2,0.015),
// ];
const data = [
  createData(1,128,5,1,58,70,0.0376,2680,2700),
  createData(2,132,1,0,0,132,0.0075,2760,2760),
  createData(3,132,1,0,1,131,0.0075,2760,2760),
  createData(4,100,33,2,73,27,0.2481,2060,2100),
  createData(5,131,2,0,30,101,0.015,2740,2740),
] 


const names = [
  {code: '*', identity: 'turboflakes.io/MOMO'}, 
  {code: 'A', identity: 'Caz16n...E9BNuf'},
  {code: 'B', identity: 'POLKACHU.COM/04'},
  {code: 'C', identity: 'Zug_Capital/38'},
  {code: 'D', identity: 'RYABINA/_[6]_T.ME/KUSAMA'},
  
]

const renderTooltip = (props) => {
  const { active, payload } = props;
  // console.log("_renderTooltip", active, payload);
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    const unit = payload[2] && payload[2].unit;
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          // color: '#fff',
          p: 2,
          m: 0,
          borderRadius: 1,
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}

      >
        <Typography component="div" variant="caption" color="inherit" gutterBottom>
          <b>{names[data.x-1].identity}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          accepted votes: {data.y} ({data.i}i+{data.e}e)
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          missed votes: {data.m}
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          authored blocks: {data.b}
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          p/v points: {data.pp}
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          total points: {data.tp}
        </Typography>
      </Box>
    );
  }

  return null;
};

const renderLegend = (props) => {
  const { payload } = props;
  if (payload[1]) {
    return (
      <Box sx={{
        bgcolor: "#ccc",
        // ml: '20px'
      }}
      margin={{
        left: -40
      }}
      >
        {
          names.map((entry, index) => (
            <Typography key={`item-${index}`} variant="caption">{entry.code}</Typography>
          ))
        }
      </Box>
    );
  }
  return null;
}

const renderXAxis = (index) => { 
  return names[index-1].code
}

export default function ValGroupChart() {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 400,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Typography variant="h5">Backing votes</Typography>
        <Typography variant="subtitle2">Val. Group 5</Typography>
        {/* <Identicon
                  style={{marginRight: 8}}
                  value={"GA7j1FHWXpEU4kavowEte6LWR3NgZ8bkv4spWa9joiQF5R2"}
                  size={24}
                  theme={'polkadot'} /> */}
        <ResponsiveContainer width="100%" >
          <BarChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 0
            }}
            barSize={20}
          >
            <XAxis style={{ fontSize: '0.8rem' }} dataKey="x" stroke="#6F7072" 
              tickFormatter={renderXAxis}
              tickLine={false} 
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1}}
            />
            <YAxis style={{ fontSize: '0.8rem' }} 
              tickLine={false}
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1}}
               />
            {/* <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6F7072" /> */}
            <Tooltip 
              cursor={{fill: 'transparent'}}
              // cursor={{ strokeDasharray: '3 3' }} 
              wrapperStyle={{ zIndex: 100 }} 
              content={renderTooltip} />
            <Bar dataKey="y" stackId="stack" >
            {
              data.map((entry, index) => {
                const ratio = (entry.i + entry.e === 0 ? 0 : entry.e / (entry.i + entry.e))
                const fill=`hsl(200, 35%, ${(ratio*86)+7}%)`
                return (
                  <Cell key={`cell-${index}`} fill={fill} />
              )})
            }
            </Bar>
            <Bar dataKey="m" stackId="stack" fill={`hsl(360, 100%, 62%)`} />
          </BarChart>
        </ResponsiveContainer>
    </Paper>
  );
}