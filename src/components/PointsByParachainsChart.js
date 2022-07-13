import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
// import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Text, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import {
  selectChain
} from '../features/chain/chainSlice';
import { isChainSupported, getChainNameShort, getChainColor } from '../constants'

function createData(paraId, points) {
  return { paraId, points };
}

const dataRaw = [
  createData(2120,20),
  createData(2011,1580),
  createData(2102,2320),
  createData(2111,2440),
  createData(2108,3060),
  createData(2088,10740),
  createData(2105,14160),
  createData(2110,16260),
  createData(2107,18060),
  createData(2106,18360),
  createData(2115,18400),
  createData(2090,18600),
  createData(2087,18780),
  createData(2092,19900),
  createData(1001,20060),
  createData(2004,20120),
  createData(2096,20220),
  createData(2084,20480),
  createData(2095,20660),
  createData(2023,20800),
  createData(2012,20940),
  createData(2024,21080),
  createData(2101,21540),
  createData(2016,21740),
  createData(2085,21740),
  createData(2114,22000),
  createData(2086,22160),
  createData(1000,22220),
  createData(2007,22320),
  createData(2100,22320),
  createData(2015,22360),
  createData(2001,23080),
  createData(2048,23340),
  createData(2000,23500),
];

export default function PointsByParachainsChart() {
  const theme = useTheme();

  const selectedChain = useSelector(selectChain);
  const data = dataRaw.map(chain => {
    return {
      name: isChainSupported(selectedChain, chain.paraId) ? getChainNameShort(selectedChain, chain.paraId) : chain.paraId,
      points: chain.points
    }
  })

  const colors = dataRaw.map(chain => isChainSupported(selectedChain, chain.paraId) ? getChainColor(selectedChain, chain.paraId) : '#FCFCFD')

  return (
    <React.Fragment>
      <Typography variant="h5">Total Points by ParaId</Typography>
      <Typography variant="subtitle2">(+4%) than previous session</Typography>
      <ResponsiveContainer width="100%" >
        <BarChart
          // width={500}
          // height={400}
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#6F7072" />
          <XAxis style={{ fontSize: '0.8rem' }} stroke="#6F7072" />
          <YAxis style={{ fontSize: '0.8rem' }} dataKey="name" type="category" stroke="#6F7072" />
          <Tooltip />
          <Legend />
          <Bar dataKey="points" barSize={8}>
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

// fill={getChainColor(selectedChain, entry.text)}