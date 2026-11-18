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
import IconButton from '@mui/material/IconButton';
import PieChartIcon from '@mui/icons-material/PieChart';
import ListIcon from '@mui/icons-material/List';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import GradesPieChart from './GradesPieChart';
import Tooltip from './Tooltip';
import GradesInfoBox from './GradesInfoBox';
import {
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'
import {
  selectIdentityFilter,
  selectSubsetFilter
 } from '../features/layout/layoutSlice'
import {
  selectSessionHistoryRangeIds,
} from '../features/api/sessionsSlice'
import { gradeByRatios } from '../util/grade'

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]

export default function GradesWithFilterBox({sessionIndex, isHistoryMode}) {
  const theme = useTheme();
  const [showPie, setShowPie] = React.useState(true);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);
  const historySessionRangeIds = useSelector(selectSessionHistoryRangeIds);
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, isHistoryMode ? historySessionRangeIds : [sessionIndex], isHistoryMode, identityFilter, subsetFilter));

  if (!rows.length) {
    return null
  }

  const currentGrades = rows.map(v => gradeByRatios(v.mvr, v.bur, v.mcr)).filter(g => g !== "-")

  if (!currentGrades.length) {
    return null
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

  const handleView = () => {
    setShowPie(!showPie);
  }

  return (
    <Paper sx={{ position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      // width: 352,
      height: 368,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6" sx={{ overflow: "hidden", textOverflow: "ellipsis" }} title="Distribution by grade">
          Distribution by grade
          </Typography>
        </Box>
        <Typography variant="subtitle2" sx={{ height: 16, overflow: "hidden", textOverflow: "ellipsis" }}>
          {subsetFilter !== '' ? <span>Only for subset {subsetFilter}</span> : 'Only para-validators'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          { showPie ?

            <GradesPieChart data={gradesData} size="md"  /> :

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '256px'}}>
              <List dense >
                {gradesData.map((g, i) => (
                  <ListItem key={i} sx={{
                      // bgcolor: theme.palette.grade[g],
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '+ :last-child': { borderBottom: 'none'}
                    }}
                      secondaryAction={
                        <Typography variant="caption">{`${(Math.round(g.value*100)/100)}%`}</Typography>
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
          }
        </Box>
      </Box>
      {/* top right corner of the box */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton aria-label="grade-details" onClick={handleView}>
          { !showPie ? <PieChartIcon fontSize="small" /> : <ListIcon fontSize="small" /> }
        </IconButton>
      </Box>
      {/* bottom left corner of the box */}
      <Box sx={{ position: 'absolute', left: 16, bottom: 12 }}>
          <Tooltip
            disableFocusListener
            placement="top-start"
            componentsProps={{ tooltip: { sx: { maxWidth: 480 } } }}
            title={
              <GradesInfoBox />
            }
            >
            <InfoOutlinedIcon fontSize="small" sx={{ color: theme.palette.action.active }} />
          </Tooltip>
      </Box>
    </Paper>
  )
}
