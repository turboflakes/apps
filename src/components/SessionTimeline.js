import * as React from 'react';
import Paper from '@mui/material/Paper';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';

const data = [
  {session: 22335, era: 3840},
  {session: 22334, era: 3840},
  {session: 22333, era: 3840},
  {session: 22332, era: 3840},
  {session: 22331, era: 3840},
  {session: 22330, era: 3840},
  {session: 22329, era: 3839},
  {session: 22328, era: 3839},
  {session: 22327, era: 3839},
  {session: 22326, era: 3839},
  {session: 22326, era: 3839},
  {session: 22326, era: 3839},
]
export default function SessionTimeline() {

  return (
    <Paper
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          // height: 140,
          borderRadius: 3,
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
    <Timeline>
      {data.map(d => (
        <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>{d.session}</TimelineContent>
      </TimelineItem>
      ))}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
    </Timeline>
    </Paper>
  );
}
