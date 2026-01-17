import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/dashboard";
import NotesSection from "../components/notes";
import Grid from "@mui/material/Grid";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

interface DashboardData {
  first_name: string;
  photo: string;
  folders: any[];
  calendar_url: string;
}

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/dashboard/")
      .then((res) => {
        console.log("Dashboard Data Received:", res.data);
        console.log("Calendar URL:", res.data.calendar_url);
        console.log("Folders Count:", res.data.folders?.length);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 10,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading Dashboard...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <NotesSection initialNotes={data?.folders || []} />

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Add YouTube Learning Resource
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Paste a YouTube video link to generate notes or quiz questions
              </Typography>

              <TextField
                label="YouTube URL"
                placeholder="https://www.youtube.com/watch?v=xxxx"
                fullWidth
                type="url"
                sx={{ mb: 2 }}
              />

              <Button variant="contained" size="large" fullWidth>
                Generate Quiz
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #eee",
              height: 510,
              bgcolor: "#f9f9f9"
            }}
          >
            {data?.calendar_url ? (
              <iframe
                src={data.calendar_url}
                style={{ border: 0 }}
                width="100%"
                height="100%"
                title="Google Calendar"
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                 <Typography color="text.secondary">Calendar not available</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}