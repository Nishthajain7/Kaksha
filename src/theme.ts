import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#2563EB",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    body1: {
      fontSize: 14,
      fontWeight: 500,
      color: "rgba(0, 0, 0, 0.6)",
    },

    body2: {
      fontSize: 13,
      color: "rgba(0, 0, 0, 0.6)",
    },

    h6: {
      fontSize: 20,
      fontWeight: 600,
      color: "#212121",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
          borderRadius: 20,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingBottom: 10,
        },
        title: {
          fontSize: 18,
          fontWeight: 600,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: 500,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            fontWeight: 600,
          },
        },
      },
    },
  },
});

export default theme;
