import DashboardLayout from "../layouts/dashboard";
import NotesSection from "../components/notes";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { NOTES } from "../assets/mockNotes";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Grid container spacing={3} >
        <Grid item xs={12} md={6}>
          <NotesSection initialNotes={NOTES} />
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
