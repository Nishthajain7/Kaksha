import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
        <Box
        sx={{
          px: 3,
          pt: 2,
          minWidth:0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Kaksha
        </Typography>
      </Box>
    </AppBar>
  );
}
