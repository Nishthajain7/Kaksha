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
    MuiAvatar: {
    styleOverrides: {
      root: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background:
          "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 18,
      },
    },
  },

  MuiList: {
    styleOverrides: {
      root: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        padding: "14px 18px",
        marginBottom: 8,
        color: "rgba(0,0,0,0.6)",

        "& .MuiListItemIcon-root": {
          minWidth: 36,
          color: "rgba(0,0,0,0.45)",
        },

        "&.Mui-selected": {
          backgroundColor: "#eef5fb",
          color: "#1a73e8",
          fontWeight: 600,

          "& .MuiListItemIcon-root": {
            color: "#1a73e8",
          },

          "& .MuiListItemText-primary": {
            fontWeight: 600,
            color: "#1a73e8",
          },

          "&:hover": {
            backgroundColor: "#eef5fb",
          },
        },

        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.04)",
        },
      },
    },
  },

  MuiListItemText: {
    styleOverrides: {
      primary: {
        fontSize: 15,
        fontWeight: 500,
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        height: 26,
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 14,
        backgroundColor: "#ffe0b2",
        color: "#e65100",
      },
    },
  },
  },
});

export default theme;
