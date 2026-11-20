import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import isUndefined from "lodash/isUndefined";
import AvgBlockTime, { useAvgBlockTime } from "./AvgBlockTime";

export default function AvgBlockTimeBoxHeader({ dark, chain_key = "rc" }) {
  const theme = useTheme();
  const avgBlockTime = useAvgBlockTime(chain_key);

  if (isUndefined(avgBlockTime)) {
    return null;
  }

  return (
    <Box
      sx={{
        mx: 2,
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          mx: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          variant="caption1"
          color={dark ? theme.palette.text.secondary : "default"}
          sx={{ whiteSpace: "nowrap" }}
        >
          avg block time
        </Typography>
        <Typography
          variant="h6"
          color={
            dark ? theme.palette.text.secondary : theme.palette.text.primary
          }
        >
          <AvgBlockTime chainKey={chain_key} />
        </Typography>
      </Box>
    </Box>
  );
}
