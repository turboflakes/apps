import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// https://material-ui.com/customization/default-theme/?expend-path=$.palette
let theme = createTheme({
  container: {
    maxWidth: "1140px",
    margin: "0 auto"
  },
  breakpoints: {
    // values: {
    //   xs: 0,
    //   sm: 900,
    //   md: 960,
    //   lg: 1280,
    //   xl: 1920,
    // }
  },
  palette: {
    primary: {
      // dark automatic calculated
      // main: "#ED1C24",
      main: "#0B1317",
      contrastText: '#FFFFFF',
    },
    secondary: {
      // dark automatic calculated
      // main: "#343434",
      main: "#4D4D4D",
      contrastText: '#FFFFFF',
    },
    semantics: {
      red: "#DF2326",
      amber: "#FA6400",
      green: "#44D7B6",
      blue: "#86D3E7",
      purple: "#8B7AB8",
    },
    grade: {
      "A+": "#78C143",
      "A": "#5FC3AD",
      "B+": "#4DC1EF",
      "B": "#4787C7",
      "C+": "#C8C9CB",
      "C": "#EEEEEE",
      "D+": "#F6B519",
      "D": "#F26522",
      "F": "#DF2326",
      "-": "#FFFFFF",
    },
    state: {
      "Open": "#44D7B6",
      "Blocked": "#0B1317",
      "Destroying": "#DF2326",
    },
    neutrals: {
      100: "#F1F1F0",
      200: "#C8C9CC",
      // 200: "#A1A1A1",
      // 200: "#EEEEEE",
      300: "#4D4D4D",
      400: "#343434",
      // 400: "#DFF1FA",
      // 500: "#BBDFF3",
      // 600: "#6F7072",
      // 700: "#021220",
    },
    // neutrals: {
    //   100: "#FFFFFF",
    //   110: "#FCFCFD",
    //   120: "#FAFAF9",
    //   200: "#F7F7FA",
    //   300: "#EEEEEE",
    //   400: "#C8C9CC",
    //   500: "#6F7072",
    //   600: "#021220",
    // },
    polkadot: "rgb(230,0,122)",
    divider: "rgba(0, 0, 0, 0.12)",
    dividerDark: "rgba(0, 0, 0, 0.04)",
    dividerLight: "rgb(255, 255, 255)",
    gradients: {
      light180: "linear-gradient(180deg,#FFFFFF,#F1F1F0)",
      polkadot180: "linear-gradient(180deg,#FFF, rgba(230,0,122,0.1))",
      // polkadot180: "linear-gradient(180deg, rgba(230,0,122,0.1), rgba(230,0,122,0.1))",
      dark0: "linear-gradient(0deg,#FFFFFF,#C8C9CC)",
      // dark0: "linear-gradient(0deg,rgba(0,0,0,0.6),rgba(0,0,0,0.4))",
      // dark90: "linear-gradient(90deg,rgba(0,0,0,0.6),rgba(0,0,0,0.4))",
      // dark180: "linear-gradient(180deg,rgba(0,0,0,0.6),rgba(0,0,0,0.4))",
      // default0: "linear-gradient(0deg,#85BCE4,#F9FDFF)",
      // default90: "linear-gradient(90deg,#85BCE4,#F9FDFF)",
      // default180: "linear-gradient(180deg,#85BCE4,#F9FDFF)",
      // default270: "linear-gradient(270deg,#DFF1FA,#FFF)",
      // secondary0: "linear-gradient(0deg,#85BCE4,#E86866)",
      // secondary90: "linear-gradient(90deg,#85BCE4,#E86866)",
      // secondary180: "linear-gradient(180deg,#85BCE4,#E86866)",
      // trend: "linear-gradient(180deg,#343434,#FFF)",
      onet: "linear-gradient(90deg, #45CDE9, #7A8FD3)",
    },
    text: {
      primary: "#0B1317",
      secondary: "#FFFFFF",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)"
    },
    background: {
      paper: "#FFFFFF",
      primary: "#FFFFFF",
      secondary: "#0B1317",
      default: "#FFFFFF"
    }
  },
  typography: {
    useNextVariants: true,
    h1: {
      fontFamily: "'Gilroy', 'Helvetica Neue', 'Arial', sans-serif",
      fontSize: "6rem",
      fontWeight: 800,
      '@media screen and (max-width: 900px)': {
        fontSize: "3.125rem",
      },
    },
    h2: {
      fontFamily: "'Gilroy', 'Helvetica Neue', 'Arial', sans-serif",
      fontSize: "3.75rem",
      fontWeight: 800,
      '@media screen and (max-width: 900px)': {

      }
    },
    h3: {
      fontFamily: "'Gilroy', 'Helvetica Neue', 'Arial', sans-serif",
      fontSize: "3rem",
      fontWeight: 800,
      '@media screen and (max-width: 900px)': {
        fontSize: "2.5rem",
      }
    },
    h4: {
      fontFamily: "'Gilroy', 'Helvetica Neue', 'Arial', sans-serif",
      fontWeight: 800,
      fontSize: "2.125rem",
    },
    h5: {
      fontFamily: "'Gilroy', 'Helvetica Neue', 'Arial', sans-serif",
      fontWeight: 800,
      fontSize: "1.5rem",
      '@media screen and (max-width: 900px)': {
        fontSize: "1.125rem",
      }
    },
    h6: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1rem",
      fontWeight: 700,
      // lineHeight: 0
    },
    body1: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1.1rem",
      '@media screen and (max-width: 900px)': {
        fontSize: "1rem",
      }
    },
    caption: {
      fontSize: "0.825rem",
      fontFamily: "'Roboto', sans-serif",
      color: '#4D4D4D',
      lineHeight: 1
    },
    caption1: {
      fontSize: "0.8rem",
      fontFamily: "'Roboto', sans-serif",
      color: '#4D4D4D',
      lineHeight: 1
    },
    subtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1.1rem",
      '@media screen and (max-width: 900px)': {
        fontSize: "1rem",
      }
    },
    subtitle1: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1.5rem",
      '@media screen and (max-width: 900px)': {
        fontSize: "1.2rem",
      },
    },
    subtitle2: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "0.825rem",
      // fontStyle: "italic",
      lineHeight: 0.875,
      color: '#4D4D4D',
    }, 
    subtitle3: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "0.775rem",
      lineHeight: 0.675,
      color: '#4D4D4D',
      fontWeight: 500
    }, 
  },
  shape: {
    borderRadius: 8,
    border: 2,
  },
  button: {
    padding: "18px 26px"
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: `8px 16px`
        },
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: `8px 16px`
        },
      }
    },
    MuiInputBase: {
      input: {
        borderRadius: 30,
      },
    },
    MuiOutlinedInput: {
      root: {
        '&.Mui-focused $notchedOutline' :{
          borderColor: "inherit",
          borderWidth: 0,
        },
      },
      notchedOutline: {
        borderWidth: 0,
      }
    },
    MuiSelect: {
      icon: {
        color: "inherit",
      }
    },
    MuiSlider: {
      root: {
        height: 8,
      },
      mark: {
        display: "none"
      },
      markActive: {
        backgroundColor: "inherit"
      },
      markLabel: {
        color: "#DFF1FA"
      },
      markLabelActive: {
        color: "#021220"
      },
      thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        // border: '1px solid currentColor',
        marginTop: -8,
        marginLeft: -10,
        // '&:focus, &:hover, &$active': {
        //   boxShadow: 'inherit',
        // },
        '&.Mui-disabled': {
          height: 24,
          width: 24,
          backgroundColor: '#fff',
          // border: '2px solid currentColor',
          marginTop: -8,
          marginLeft: -10,
        }
      },
      track: {
        height: 8,
        borderRadius: 4,
        // backgroundColor: "#FFF"
      },
      rail: {
        height: 8,
        borderRadius: 4,
      },
      valueLabel: {
        left: 'calc(-50% + 7px)',
        top: 6,
        fontSize: "0.75rem",
        fontWeight: 600,
        '& *': {
          background: 'transparent',
          color: '#000',
        },
      },
    },
    MuiPopover: {
      paper: {
        padding: 16,
        backgroundColor: "#021220",
        color: "#FFFFFF"
      },
    },
    MuiTabs:{
      root:{
        minHeight: 32,
      },
      indicator: {
        display: "none"
      },
      flexContainer: {
        justifyContent: "flex-end"
      }
    },
    MuiTab: {
      root: {
        padding: 0,
        minHeight: 48,
        '&.MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
          marginBottom: 0
        }
      },
      
    },
    MuiPaper: {
      root: {
        '&.MuiTab-elevation.MuiTab-rounded': {
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px !important'
        }
        
      },
    }
    // MuiTab: {
    //   root: {
    //     '@media screen and (min-width: 900px)': {
    //       minWidth: 140,
    //     },
    //     zIndex: 1,
    //     minHeight: 32,
    //     backgroundColor: "#4D4D4D",
    //     marginRight: -32,
    //     borderTopLeftRadius: 16,
    //     borderTopRightRadius: 16,
    //     fontSize: "0.8rem",
    //     '&.Mui-selected' : {
    //       zIndex: 2,
    //       color: "#FFF",
    //       backgroundColor: "#343434",
    //       borderTopLeftRadius: 24,
    //       borderTopRightRadius: 24,
    //       opacity: 1,
    //     },
    //     '&:first-child': {
    //       borderTopLeftRadius: 24,
    //       opacity: 0.8,
    //     },
    //     '&:last-child': {
    //       zIndex: 0,
    //       borderTopRightRadius: 24,
    //       marginRight: 0,
    //       opacity: 0.8,
    //     },
    //     '&:last-child&.Mui-selected': {
    //       zIndex: 2,
    //     }
    //   },
    //   textColorInherit: {
    //     opacity: 1,
    //     color: "#F1F1F0",
    //   }      
    // }
  }
});

export default responsiveFontSizes(theme)