import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  Box,
} from "@mui/material";

export default function SignIn() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/accounts/google/login/";
  };

  return (
    <Box sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }}>
    <Card sx={{ width: 420 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={600} mb={1}>
          Sign in
        </Typography>

        <Typography variant="body2" mb={3}>
          Don’t have an account? <b>Get started</b>
        </Typography>

        <Stack spacing={2}>
          <TextField label="Email address" fullWidth />
          <TextField label="Password" type="password" fullWidth />

          <Button variant="contained" size="large" sx={{ bgcolor: "black" }}>
            Sign in
          </Button>

          <Divider>or</Divider>

          <Button 
            variant="outlined" 
            fullWidth 
            size="large" 
            onClick={handleGoogleLogin}
            sx={{ textTransform: 'none', color: 'black', borderColor: '#ccc' }}
          >
            Sign in with Google
          </Button>
        </Stack>
      </CardContent>
    </Card>
    </Box>
  );
}