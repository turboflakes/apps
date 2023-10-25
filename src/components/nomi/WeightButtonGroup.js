import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import WeightIconButton from './WeightIconButton';
import TooltipInfo from './TooltipInfo';
import FilterSliderRange from './FilterSliderRange';

export default function WeightButtonGroup({ 
  showDark,
  size,
  title, description, scaleDescription, resultDescription, questionDescription, 
  rangeSelected, limits, limitsTitle, limitsLabelFormat, limitsStep, showLimitsCaption, onLimitsChange, onChange, value}) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 0, m: 0 }}>
      { !!title ? 
        <Box sx={{ display: "flex", ml: 0, my: 1 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" color={showDark ? 'secondary' : 'primary'} align="left">
              {title}
            </Typography>
            <TooltipInfo 
              title={title} description={description} 
              scaleDescription={scaleDescription} 
              resultDescription={resultDescription}
              questionDescription={questionDescription} />
          </Box>
        </Box> : null}
      <Stack direction="row" spacing={size === "lg" ? 3 : 1}>
        <WeightIconButton value={0} size={size} showDark={showDark} selected={value === 0} onClick={(e) => onChange(e, 0)} />
        <WeightIconButton value={1} size={size} showDark={showDark} selected={value === 1} onClick={(e) => onChange(e, 1)} />
        <WeightIconButton value={2} size={size} showDark={showDark} selected={value === 2} onClick={(e) => onChange(e, 2)} />
        <WeightIconButton value={3} size={size} showDark={showDark} selected={value === 3} onClick={(e) => onChange(e, 3)} />
        <WeightIconButton value={4} size={size} showDark={showDark} selected={value === 4} onClick={(e) => onChange(e, 4)} />
        <WeightIconButton value={5} size={size} showDark={showDark} selected={value === 5} onClick={(e) => onChange(e, 5)} />
        {/* 
        <WeightIconButton value={6} size={size} showDark={showDark} selected={value === 6} onClick={(e) => onChange(e, 6)} />
        <WeightIconButton value={7} size={size} showDark={showDark} selected={value === 7} onClick={(e) => onChange(e, 7)} />
        <WeightIconButton value={8} size={size} showDark={showDark} selected={value === 8} onClick={(e) => onChange(e, 8)} />
        <WeightIconButton value={9} size={size} showDark={showDark} selected={value === 9} onClick={(e) => onChange(e, 9)} /> 
        */}
      </Stack>
      {limitsTitle ?
        <Box sx={{ display: "flex", ml: 0, my: 1 }}>
          <Typography variant="body2" color={showDark ? 'secondary' : 'primary'} align="left">
            {limitsTitle}
          </Typography>
        </Box> : null}
      {limits ? 
        <FilterSliderRange 
          showDark={showDark}
          rangeSelected={rangeSelected} limits={limits} labelFormat={limitsLabelFormat} step={limitsStep} 
          showCaption={showLimitsCaption} onChange={(e, r) => onLimitsChange(e, r)} /> : null}
    </Box>
    
  );
}