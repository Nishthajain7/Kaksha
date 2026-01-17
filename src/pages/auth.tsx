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
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type GoogleUser = {
  name: string;
  email: string;
  picture: string;
};

export default function SignIn() {
  const navigate = useNavigate();

  const handleGoogleSuccess = (res: any) => {
    if (!res.credential) return;
    const decoded = jwtDecode<GoogleUser>(res.credential);
    localStorage.setItem("auth_user", JSON.stringify(decoded));
    navigate("/dashboard", { replace: true });
  };

  return (
    <Box sx={{width: "100vw",
        display: "flex",
        justifyContent: "center",}}>
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

          <GoogleLogin onSuccess={handleGoogleSuccess} />
        </Stack>
      </CardContent>
    </Card>
    </Box>
  );
}
