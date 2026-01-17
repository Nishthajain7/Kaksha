import DashboardLayout from "../layouts/dashboard";
import NotesSection from "../components/notes";
import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import { NOTES } from "../assets/mockNotes";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <NotesSection initialNotes={NOTES} />

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

              <Button
                variant="contained"
                size="large"
                fullWidth
              >
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
            }}
          >
            <iframe
              src="https://calendar.google.com/calendar/embed?src=am5pc2h0aGEzMDVAZ21haWwuY29t&ctz=Asia/Kolkata"
              style={{ border: 0 }}
              width="100%"
              height="510"
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}