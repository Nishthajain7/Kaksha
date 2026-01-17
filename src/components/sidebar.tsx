import React, { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Chip,
} from "@mui/material";


export default function Sidebar() {
  const [active, setActive] = useState("dashboard");
  const user = JSON.parse(localStorage.getItem("auth_user") || "null");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth_user");
    navigate("/signin", { replace: true });
  };


  const navItems = [
    { title: 'Dashboard', icon: DashboardIcon },
    { title: 'Upload', icon: PersonIcon },
    { title: 'Quizzes', icon: ShoppingCartIcon, badge: '+3' },
    { title: 'Log out', icon: LockIcon },
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        bgcolor: "#fafafa",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* User Card */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 1,
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Avatar src={user?.picture} />
        <Typography variant='h6' fontSize={14}>
          {user?.name ?? "Guest"}
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1 }}>
        <ListItemButton
          selected={active === "dashboard"}
          onClick={() => {
            setActive("dashboard");
            navigate("/dashboard");
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          selected={active === "upload"}
          onClick={() => {
            setActive("upload");
            navigate("/upload");
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItemButton>

        <ListItemButton
          selected={active === "quizzes"}
          onClick={() => {
            setActive("quizzes");
            navigate("/quizzes");
          }}
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Quizzes" />
          <Chip label="+3" size="small" color="warning" />
        </ListItemButton>
      </List>

      {/* Logout */}
      <List>
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItemButton>
      </List>
    </Box>
  );
}