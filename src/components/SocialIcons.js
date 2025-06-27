import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/EmailRounded";
import twitterSVG from "../assets/twitter_black.svg";
import githubSVG from "../assets/github_black.svg";

export default function SocialIcons(props) {
  const theme = useTheme();

  const handleTwitter = () => {
    window.open("https://twitter.com/turboflakes", "_blank");
  };

  const handleGithub = () => {
    window.open("https://github.com/turboflakes", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@turboflakes.io";
  };
  return (
    <Box>
      <IconButton
        size="small"
        sx={{
          margin: "0 8px",
          border: "1px solid #FFF",
          width: 30,
          height: 30,
          color: theme.palette.text.primary,
        }}
        onClick={handleEmail}
      >
        <EmailIcon sx={{ width: 20, height: 20 }} />
      </IconButton>
      <IconButton
        color="secondary"
        size="small"
        sx={{
          margin: "0 8px",
          border: "1px solid #FFF",
          color: "text.secondary",
          width: 30,
          height: 30,
        }}
        onClick={handleTwitter}
      >
        <img
          src={twitterSVG}
          style={{
            width: 18,
            height: 18,
          }}
          alt={"github"}
        />
      </IconButton>
      <IconButton
        color="secondary"
        size="small"
        sx={{
          ml: 1,
          border: "1px solid #FFF",
          color: "text.secondary",
          width: 30,
          height: 30,
        }}
        onClick={handleGithub}
      >
        <img
          src={githubSVG}
          style={{
            width: 18,
            height: 18,
          }}
          alt={"github"}
        />
      </IconButton>
    </Box>
  );
}
