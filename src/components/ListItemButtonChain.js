import React from "react";
import { useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { getNetworkIcon } from "../constants";

const ListItemButtonChain = ({ onChainChanged, chain }) => {
  const theme = useTheme();
  return (
    <ListItemButton onClick={() => onChainChanged(chain)} disableRipple>
      <ListItemIcon sx={{ ml: theme.spacing(-1 / 2), py: theme.spacing(1) }}>
        <img
          src={getNetworkIcon(chain)}
          style={{
            width: 28,
            height: 28,
          }}
          alt={chain}
        />
      </ListItemIcon>
      <ListItemText
        primary={chain.toUpperCase()}
        sx={{
          "> .MuiTypography-root": {
            fontSize: "0.875rem",
            fontWeight: 600,
          },
        }}
      />
    </ListItemButton>
  );
};

export default ListItemButtonChain;
