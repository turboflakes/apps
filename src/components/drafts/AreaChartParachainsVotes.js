import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ComposedChart, Area, Bar, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

// import Title from './Title';

// Generate Sales Data
function createData(parachain, implicit, explicit, missed) {
  return { parachain, implicit, explicit, missed };
}

const data = [
  createData('1000',300,798,162),
createData('1001',265,660,115),
createData('2000',314,742,134),
createData('2001',318,734,148),
createData('2004',275,700,195),
createData('2007',312,721,167),
createData('2011',0,0,0),
createData('2012',287,633,145),
createData('2015',293,748,164),
createData('2016',292,709,144),
createData('2023',339,664,232),
createData('2024',303,670,162),
createData('2048',269,822,179),
createData('2084',283,734,163),
createData('2085',276,705,164),
createData('2086',301,745,169),
createData('2087',261,659,140),
createData('2088',77,225,53),
createData('2090',315,561,294),
createData('2092',260,652,143),
createData('2095',276,635,164),
createData('2096',245,658,147),
createData('2100',310,736,169),
createData('2101',329,731,155),
createData('2102',0,0,0),
createData('2105',191,523,131),
createData('2106',200,572,123),
createData('2107',253,681,156),
createData('2108',0,0,0),
createData('2110',262,611,127),
createData('2111',0,0,0),
createData('2114',297,754,149),
createData('2115',218,616,151),
createData('2120',0,0,0),
];

export default function AreaChartParachainsVotes() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <Typography variant="caption">Validators Backing votes grouped by</Typography>
        <Typography variant="h5">Validators Backing votes grouped by Parachains</Typography>
      </Box>
      <Typography variant="subtitle2">(+4%) than previous session</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFE29D" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#FFE29D" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis style={{ fontSize: '0.8rem' }} dataKey="parachain" stroke="#6F7072" />
          <YAxis style={{ fontSize: '0.8rem' }} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6F7072" />
          <Tooltip />
          <Area type="monotone" dataKey="explicit" stroke="#FFE29D" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
          <Line type="monotone" dataKey="implicit" stroke="#C8C9CC" strokeWidth={3} dot={false}  />
          {/* <Line type="monotone" dataKey="explicit" stroke="#335073" strokeWidth={2} /> */}
          <Bar dataKey="missed" barSize={5} fill="#ED1C24" />
        </ComposedChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}