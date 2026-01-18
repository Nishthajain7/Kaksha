import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboard";
import NotesSection from "../../components/notesupload";
import Grid from "@mui/material/Grid";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";

export default function Upload() {
  const { id } = useParams<{ id: string }>();

  const [notes, setNotes] = useState<any[]>([]);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 🔁 Vue's onMounted → React's useEffect
  useEffect(() => {
    if (!id) return;

    console.log("Folder ID:", id);

    setLoading(true);
    axios
      .get(`/api/folder/${id}/`)
      .then((res) => {
        setFolderName(res.data.folder_name);

        const fetchedNotes = res.data.files.map((file: any) => ({
          id: String(file.file_id),
          title: file.file_name,
          description: `${file.concepts.length} concepts`,
          type: "file",
        }));

        setNotes(fetchedNotes);
      })
      .finally(() => setLoading(false));
  }, [id]);

const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", file.name);
  formData.append("path", file.name);

  try {
    const res = await axios.post(
      `/api/fileUpload/${folderName}/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.status === 201) {
      setTimeout(() => {
        window.location.reload();
      }, 5000); // cooldown
    }

  } catch (err) {
    alert("Upload failed");
  }
};


  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        {/* LEFT */}
        <Grid item xs={12} md={5}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <NotesSection
                folderName={folderName}
                initialNotes={notes}
              />

              <Box mt={2}>
                <Button
                  variant="contained"
                  component="label"
                  disabled={uploading}
                >
                  {uploading ? "Processing..." : "Upload File"}
                  <input
                    hidden
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
              </Box>
            </>
          )}
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              borderRadius: 2,
              border: "1px solid #eee",
              height: "100%",
            }}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
