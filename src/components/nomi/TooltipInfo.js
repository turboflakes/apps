import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '../Tooltip';

export default function TooltipInfo({title, description, scaleDescription, resultDescription, questionDescription}) {
  const theme = useTheme();
  return (
    <Tooltip
      disableFocusListener
      placement="left"
      title={
        <Box sx={{ p: 1, }}>
          <Typography variant="caption"><b>{title}</b></Typography>
          <Box sx={{my: 1, display: 'flex', flexDirection: 'column'}}>
            <Typography variant="caption" paragraph>
              {description}
            </Typography>
            {scaleDescription ? 
              <Typography variant="caption" paragraph>
                {scaleDescription}
              </Typography> : null}
            {resultDescription ? 
              <Typography variant="caption" paragraph>
                {resultDescription}
              </Typography> : null}
            {questionDescription ? 
              <Typography sx={{display: 'flex', justifyContent: 'space-between'}} variant="caption" paragraph>
                <b>Question</b>
                <span>(In a scale of 0 to 5)</span>
              </Typography> : null}
            {questionDescription ? 
              <Typography variant="caption">
                <i>{questionDescription}</i>
              </Typography> : null}
          </Box>
        </Box>
      }
      >
      <InfoOutlinedIcon sx={{ ml: 1, width: theme.spacing(2), height: theme.spacing(2), color: theme.palette.neutrals[200]}}/>
    </Tooltip>
  );
}