import * as React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/material/styles';
import GradesPieChart from './GradesPieChart';
import { 
  selectMVRsBySession
 } from '../features/api/sessionsSlice'
import { grade } from '../util/grade'

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default function GradesBox({sessionIndex}) {
  const theme = useTheme();
  const mvrs = useSelector(state => selectMVRsBySession(state, sessionIndex));
  
  if (!mvrs.length) {
    return null
  }

  const gradesPercentages = grades.map(g => mvrs.filter(mvr => grade(1 - mvr) === g).length * 100 / mvrs.length);
  const pieChartData = grades.map((g, i) => ({name: g, value: gradesPercentages[i]}))
  
  return (
    <Paper sx={{ 
      // m: 2,
      // p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 320,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{p: 2}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6">Grades</Typography>
          <CustomTooltip
            disableFocusListener
            placement="bottom-end"
            title={
              <Box>
                <Typography variant="caption" color="inherit" >A grade reflects the backing votes ratio (BVR) of one or a set of validators:</Typography>
                <ul>
                  <li>{"A+ = BVR > 99%"}</li>
                  <li>{"A = BVR > 95%"}</li>
                  <li>{"B+ = BVR > 90%"}</li>
                  <li>{"B = BVR > 80%"}</li>
                  <li>{"C+ = BVR > 70%"}</li>
                  <li>{"C = BVR > 60%"}</li>
                  <li>{"D+ = BVR > 50%"}</li>
                  <li>{"D = BVR > 40%"}</li>
                  <li>{"F = BVR <= 40%"}</li>
                </ul>
                <i>Note: BVR = 1 - MVR</i>
              </Box>
            }
            >
            <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300]}}/>
          </CustomTooltip>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <GradesPieChart data={pieChartData} size="md" />
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%'}}>
            <List dense >
              {grades.map((g, i) => (
                <ListItem key={i} sx={{ 
                    // bgcolor: theme.palette.grade[g],
                    borderBottom: `1px solid ${theme.palette.divider}`, 
                    '+ :last-child': { borderBottom: 'none'} 
                  }}
                    secondaryAction={
                      <Typography variant="caption">{`${gradesPercentages[i]}%`}</Typography>
                    }
                  >
                  <ListItemIcon sx={{ minWidth: '24px'}}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', 
                      bgcolor: theme.palette.grade[g], 
                      display: "inline-block" }}></Box>
                  </ListItemIcon>
                  <ListItemText sx={{ m: 0 }} primary={g} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}