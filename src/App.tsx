import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/auth";
import theme from "./theme";
import ProtectedRoute from "./auth/ProtectedRoute";
import { getUser } from "./auth/auth";
import Quiz from "./pages/quiz";
import File from "./pages/file"


export default function App() {
  const user = getUser();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/quiz" element={<Quiz/>}/>
          <Route path="/file" element={<File />} />
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}