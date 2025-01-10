import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';
import GradesPieChart from './GradesPieChart';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice';
import { 
  selectGradesBySession,
 } from '../features/api/sessionsSlice'

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]

export default function GradesBox({sessionIndex, size}) {
  const theme = useTheme();
  const {isFetching} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority", show_summary: true});
  const rawGrades = useSelector(state => selectGradesBySession(state, sessionIndex));
  const currentGrades = rawGrades.filter(g => !isUndefined(g) && !isNull(g))

  if (isFetching || !rawGrades.length || !currentGrades.length) {
    return (<Box sx={{
        width: "100%",
        height: 320,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spinner size={32}/>
      </Box>
    )
  }

  const gradesData = grades.map(g => {
    const quantity = currentGrades.filter(cg => cg === g).length;
    const percentage = quantity * 100 / currentGrades.length;
    return {
      name: g,
      value: percentage,
      quantity,
    }
  });
  
  return (
    <Box sx={{ 
      // m: 2,
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: "100%",
      height: 320,
      // borderRadius: 3,
      // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' 
      }}>
      <Box sx={{ display: 'flex'}}>
        <GradesPieChart data={gradesData} size={size} showNetworkIcon />
        <Box sx={{ ml: 4, display: 'flex', flexDirection: 'column', width: 144}}>
          <Box sx={{ ml: 1, display: 'flex'}}>
            {/* <Typography variant="caption">validator grades</Typography> */}
            <Tooltip
              disableFocusListener
              placement="bottom-end"
              title={
                <Box sx={{ p: 1}}>
                  <Typography variant="caption" >A grade is calculated as 75% of the Backing Votes Ratio (BVR) combined with 25% of the Bitfields Availability Ratio (BAR) for one or more validators:</Typography>
                  <ul>
                    <li>{"A+ = RATIO > 99%"}</li>
                    <li>{"A = RATIO > 95%"}</li>
                    <li>{"B+ = RATIO > 90%"}</li>
                    <li>{"B = RATIO > 80%"}</li>
                    <li>{"C+ = RATIO > 70%"}</li>
                    <li>{"C = RATIO > 60%"}</li>
                    <li>{"D+ = RATIO > 50%"}</li>
                    <li>{"D = RATIO > 40%"}</li>
                    <li>{"F = RATIO <= 40%"}</li>
                  </ul>
                  <i>RATIO = 0.75*BVR + 0.25*BAR</i><br/>
                  <i>BVR = 1 - MVR</i><br/>
                  <i>Backing Votes Ratio (BVR)</i><br/>
                  <i>Missed Votes Ratio (MVR)</i><br/>
                  <i>Bitfields Availability Ratio (BAR)</i><br/>
                </Box>
              }
              >
              <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300]}}/>
            </Tooltip>
          </Box>
          <List dense >
            {gradesData.map((g, i) => (
              <ListItem key={i} sx={{ 
                  // bgcolor: theme.palette.grade[g],
                  // borderBottom: `1px solid ${theme.palette.divider}`, 
                  // '+ :last-child': { borderBottom: 'none'} 
                }}
                  secondaryAction={
                    <Typography variant="caption">{`${(Math.round(g.value*100)/100) }%`}</Typography>
                  }
                >
                <ListItemIcon sx={{ minWidth: '24px'}}>
                  <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', 
                    bgcolor: theme.palette.grade[g.name], 
                    display: "inline-block" }}>
                  </Box>
                </ListItemIcon>
                <ListItemText sx={{ m: 0 }} primary={`${g.name}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  )
}