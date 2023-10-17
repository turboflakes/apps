import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import WeightIconButton from './WeightIconButton';
import TooltipInfo from './TooltipInfo';
import FilterSliderRange from './FilterSliderRange';

export default function WeightButtonGroup({ 
  title, description, scaleDescription, resultDescription, questionDescription, 
  limits, limitsLabelFormat, limitsStep, showLimitsCaption, onChange, value}) {
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
            resultDescription={resultDescription}
            questionDescription={questionDescription} />
        </Box>
          {/* {!!limits.length ?
            <Typography variant="caption" color="textSecondary"
              className={classes.caption}>
              {`[${limits[0]}, ${limits[1]}]`} {unit ? `(${unit})` : null} 
            </Typography> : null} */}
      </Box>
      <Stack direction="row" spacing={1}>
        <WeightIconButton value={0} selected={value === 0} onClick={(e) => onChange(e, 0)} />
        <WeightIconButton value={1} selected={value === 1} onClick={(e) => onChange(e, 1)} />
        <WeightIconButton value={2} selected={value === 2} onClick={(e) => onChange(e, 2)} />
        <WeightIconButton value={3} selected={value === 3} onClick={(e) => onChange(e, 3)} />
        <WeightIconButton value={4} selected={value === 4} onClick={(e) => onChange(e, 4)} />
        <WeightIconButton value={5} selected={value === 5} onClick={(e) => onChange(e, 5)} />
        
        {/* <WeightIconButton value={6} selected={selected === 6} onClick={handleOnClick} />
        <WeightIconButton value={7} selected={selected === 7} onClick={handleOnClick} />
        <WeightIconButton value={8} selected={selected === 8} onClick={handleOnClick} />
        <WeightIconButton value={9} selected={selected === 9} onClick={handleOnClick} /> */}
      </Stack>
      {limits ? <FilterSliderRange limits={limits} labelFormat={limitsLabelFormat} step={limitsStep} showCaption={showLimitsCaption}/> : null}
    </Box>
    
  );
}