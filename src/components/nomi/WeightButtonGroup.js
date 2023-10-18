import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import WeightIconButton from './WeightIconButton';
import TooltipInfo from './TooltipInfo';
import FilterSliderRange from './FilterSliderRange';

export default function WeightButtonGroup({ 
  shwoDark,
  size,
  title, description, scaleDescription, resultDescription, questionDescription, 
  limits, limitsTitle, limitsLabelFormat, limitsStep, showLimitsCaption, onLimitsChange, onChange, value}) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 0, m: 0 }}>
      { !!title ? 
        <Box sx={{ display: "flex", ml: 0, my: 1 }}>
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
        </Box> : null}
      <Stack direction="row" spacing={size === "lg" ? 3 : 1}>
        <WeightIconButton value={0} size={size} shwoDark selected={value === 0} onClick={(e) => onChange(e, 0)} />
        <WeightIconButton value={1} size={size} shwoDark selected={value === 1} onClick={(e) => onChange(e, 1)} />
        <WeightIconButton value={2} size={size} shwoDark selected={value === 2} onClick={(e) => onChange(e, 2)} />
        <WeightIconButton value={3} size={size} shwoDark selected={value === 3} onClick={(e) => onChange(e, 3)} />
        <WeightIconButton value={4} size={size} shwoDark selected={value === 4} onClick={(e) => onChange(e, 4)} />
        <WeightIconButton value={5} size={size} shwoDark selected={value === 5} onClick={(e) => onChange(e, 5)} />
        {/* 
          <WeightIconButton value={6} selected={selected === 6} onClick={handleOnClick} />
          <WeightIconButton value={7} selected={selected === 7} onClick={handleOnClick} />
          <WeightIconButton value={8} selected={selected === 8} onClick={handleOnClick} />
          <WeightIconButton value={9} selected={selected === 9} onClick={handleOnClick} /> 
        */}
      </Stack>
      {limitsTitle ?
        <Box sx={{ display: "flex", ml: 0, my: 1 }}>
          <Typography variant="body2" align="left">
            {limitsTitle}
          </Typography>
        </Box> : null}
      {limits ? 
        <FilterSliderRange 
          limits={limits} labelFormat={limitsLabelFormat} step={limitsStep} 
          showCaption={showLimitsCaption} onChange={(e, r) => onLimitsChange(e, r)} /> : null}
    </Box>
    
  );
}