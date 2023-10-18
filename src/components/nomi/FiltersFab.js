import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import FilterIcon from '@mui/icons-material/FilterAlt';
import FiltersDialog from './FiltersDialog';
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import NotApplicapleIcon from '@mui/icons-material/NotInterested';
import Stack from '@mui/material/Stack';

const filtersDescription = [
  {label: "Active Validators", type: "include"}, 
  {label: "TVP Validators", type: "include"}, 
  {label: "Over Subscribed", type: "exclude"}, 
  {label: "Missing Identity", type: "exclude"}];

const resetFilters = () => {
  return "0,0,0,0"
}
  
function useInitFiltersSearchParams(searchParams, setSearchParams) {
  React.useEffect(() => {
    if (!searchParams.get("f")) {
      searchParams.set("f", resetFilters())
      setSearchParams(searchParams)
      return
    }
    if (searchParams.get("f").split(",").length !== 4) {
      searchParams.set("f", resetFilters())
      setSearchParams(searchParams)
      return
    }
  }, [searchParams]);

  return [];
}

export default function FiltersFab({right}) {
  const theme = useTheme();
  let [searchParams, setSearchParams] = useSearchParams();
  useInitFiltersSearchParams(searchParams, setSearchParams);
  const [openFilters, setOpenFilters] = React.useState(false);
  
  const handleOpenFiltersDialog = () => {
    setOpenFilters(true);
  };

  const handleCloseFiltersDialog = (newFilters) => {
    setOpenFilters(false);

    if (newFilters) {
      searchParams.set("f", newFilters.toString())
      setSearchParams(searchParams)
    }
    
  };

  if (!searchParams.get("f")) {
    return null
  }

  let filters = searchParams.get("f").split(",").map(v => parseInt(v));

  return (
    <Box sx={{ 
      position: 'absolute', 
      top: 96,
      right,
      zIndex: 1
      // ...(openRightDrawer && { display: 'none' }) 
    }}>
      <Stack  direction="row" alignItems="center">
        {filters.map((value, index) => 
          (value === 1 ? <Chip key={index} sx={{ mr: theme.spacing(1) }} 
            label={filtersDescription[index].label} 
            icon={filtersDescription[index].type === "include" ? <CheckIcon /> : <NotApplicapleIcon />} /> : null))}
      
        <Fab onClick={handleOpenFiltersDialog}
            size="small" color="primary" aria-label="control-panel">
            <FilterIcon />
        </Fab>
      </Stack>
      <FiltersDialog
          open={openFilters}
          filters={filters}
          onClose={handleCloseFiltersDialog}    
        />
    </Box>
  );
}