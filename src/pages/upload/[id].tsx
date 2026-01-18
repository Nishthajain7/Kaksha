import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboard";
import Grid from "@mui/material/Grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import NotesSection from "../../components/notesupload";
import axios from "axios";

interface FileItem {
  id: number;
  name: string;
}

interface FolderData {
  id: number;
  name: string;
  files: FileItem[];
}

export default function Upload() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<FolderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/folder/${id}/`)
      .then((res) => setData(res.data))
      .catch(() => alert("Failed to load folder"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <Typography color="error">Folder not found</Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        {/* LEFT: FILE LIST */}
        <Grid item xs={12} md={5}>
          {data && (
            <NotesSection
              folderName={data.name}
              initialNotes={data.files.map((file) => ({
                id: String(file.id),
                title: file.name,
                description: "Uploaded file",
                type: "file",
              }))}
            />
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
