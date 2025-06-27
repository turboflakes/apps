import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { selectVersion } from "../features/api/pkgSlice";
import packageJson from "../../package.json";

const appVersion = packageJson.version;

export default function VersionsBox(props) {
  const pkgVersion = useSelector(selectVersion);
  return (
    <Box>
      <Typography
        sx={{ mr: 1 }}
        variant="caption"
      >{`apps v${appVersion}`}</Typography>
      <Typography variant="caption">{`api v${pkgVersion}`}</Typography>
    </Box>
  );
}
