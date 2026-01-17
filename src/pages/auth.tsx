import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";

export default function SignIn() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
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

            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: "black" }}
            >
              Sign in
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}