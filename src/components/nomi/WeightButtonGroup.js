import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import WeightIconButton from './WeightIconButton';
import TooltipInfo from './TooltipInfo';
import FilterSliderRange from './FilterSliderRange';


export default function WeightButtonGroup({ title, description, scaleDescription, resultDescription, unit, limits}) {
  const theme = useTheme();
  
  return (
    <Box sx={{ p: 0, m: 0 }}>
      <Box sx={{
        display: "flex",
        ml: 0.5,
        mb: 0.5,
      }}>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="body2" align="left">
            {title}
          </Typography>
          <TooltipInfo 
            title={title} description={description} 
            scaleDescription={scaleDescription} 
            resultDescription={resultDescription} />
        </Box>
          {/* {!!limits.length ?
            <Typography variant="caption" color="textSecondary"
              className={classes.caption}>
              {`[${limits[0]}, ${limits[1]}]`} {unit ? `(${unit})` : null} 
            </Typography> : null} */}

      </Box>
      <Stack direction="row" spacing={1}>
        <WeightIconButton value={1} />
        <WeightIconButton value={2} />
        <WeightIconButton value={3} />
        <WeightIconButton value={4} />
        <WeightIconButton value={5} />
        <WeightIconButton value={6} />
        <WeightIconButton value={7} />
        <WeightIconButton value={8} />
        <WeightIconButton value={9} />
        <WeightIconButton value={0} />
      </Stack>
      <FilterSliderRange unit={unit} limits={limits} />
    </Box>
    
  );
}