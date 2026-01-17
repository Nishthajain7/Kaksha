import { Box } from "@mui/material";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box display="flex" width="100vw">
      <Sidebar />
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Header />
        <Box component="main" p={3} bgcolor="#f5f7fb">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
