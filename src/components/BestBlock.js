import * as React from 'react';
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faDiceD6 } from '@fortawesome/free-solid-svg-icons'
import { 
  useGetBlockQuery,
  selectAll,
 } from '../features/api/blocksSlice'

export default function BestBlock() {
  const {isSuccess} = useGetBlockQuery("best");
  const [timer, setTimer] = React.useState(0);
  const blocks = useSelector(selectAll)
  const updateTimer = React.useRef(null);

  const block = blocks[blocks.length-1]
  const ts = !!block ? block._ts : 0;
  
  function setUpdate(ts) {
    updateTimer.current = setTimeout(() => {
        const now = + new Date()
        const diff = now - ts;
        setTimer((Math.round((diff/1000)*10)/10).toFixed(1))
        updateTimer.current = null;
    }, 100);
  }

  React.useEffect(() => {
      return () => {
        if (updateTimer.current) {
            clearTimeout(updateTimer.current);
        }
      };
  }, []);

  React.useEffect(() => {
      if (!updateTimer.current || ts !== 0) setUpdate(ts);
  }, [timer, ts]);

  if (!isSuccess) {
    return null
  }
  
  return (
    <Paper
      sx={{
        p: `16px 24px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 112,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        // background: "#FFF"
      }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
            <Typography variant="h4" sx={{mr: 2}}>#</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
              <Typography variant="caption">best block</Typography>
              <Typography variant="h4">{isSuccess ? `${block.block_number.format()}` : `# -`}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption">last block</Typography>
            <Typography variant="h4" sx={{fontFamily: "'Roboto', sans-serif"}}>{timer}s</Typography>
          </Box>
        </Box>
    </Paper>
  );
}