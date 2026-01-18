import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Stack,
} from "@mui/material";
import axios from "axios";

interface Folder {
  id: number;
  name: string;
}

interface DashboardData {
  first_name: string;
  photo: string;
  folders: Folder[];
  calendar_url: string;
}

/* Axios global config */
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  /* Fetch dashboard data */
  const fetchDashboard = () => {
    axios
      .get("/api/dashboard/")
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* Create folder (backend expects name only) */
  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;

    setCreating(true);
    try {
      await axios.post(`/api/folderUpload/${encodeURIComponent(name)}/`);
      // Hard reload to guarantee fresh state from backend
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error creating folder");
    } finally {
      setCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateFolder();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={6}>
          {/* CREATE FOLDER */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Create New Folder
              </Typography>

              <Stack direction="row" spacing={1}>
                <TextField
                  label="Folder Name"
                  size="small"
                  fullWidth
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={creating}
                />
                <Button
                  variant="contained"
                  onClick={handleCreateFolder}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* FOLDERS LIST */}
          <NotesSection
            initialNotes={data?.folders || []}
            onFolderClick={(id: number) => navigate(`/upload/${id}`)}
          />

          {/* YOUTUBE CARD */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={1}>
                YouTube Resource
              </Typography>
              <TextField
                label="YouTube URL"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth>
                Generate Quiz
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT SIDE – GOOGLE CALENDAR (UNCHANGED) */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #eee",
              height: 510,
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography color="text.secondary">
                  Calendar not available
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
