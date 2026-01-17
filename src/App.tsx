import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/auth";
import theme from "./theme";
import Quiz from "./pages/quiz";
import File from "./pages/file"

import { AuthProvider, useAuth } from "./Auth"; 

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/signin" />}
      />
      <Route path="/signin" element={<SignIn />} />
      <Route 
        path="/quiz" 
        element={user ? <Quiz /> : <Navigate to="/signin" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}