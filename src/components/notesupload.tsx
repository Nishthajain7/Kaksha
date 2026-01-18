import {
  Box,
  Card,
  CardHeader,
  CardProps,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { NoteItem } from "../assets/mockNotes";
import { useState } from "react";
import axios from "axios";

type NotesSectionProps = CardProps & {
  title?: string;
  initialNotes?: NoteItem[];
  folderName: string;
};


type NoteWithDate = NoteItem & {
  nextQuizDate?: string;
};

export default function NotesSection({
  initialNotes = [], folderName
}: NotesSectionProps) {
  const now = () => new Date().toLocaleDateString();

  const [notes, setNotes] = useState<NoteWithDate[]>(
    initialNotes.map((n) => ({
      ...n,
      nextQuizDate: now(),
    }))
  );

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    if (!folderName) {
      alert("Folder not loaded yet");
      return;
    }

    const file = files[0];

    try {
      await uploadFileToBackend(file);

      const newNote: NoteWithDate = {
        id: crypto.randomUUID(),
        title: file.name,
        description: `${(file.size / 1024).toFixed(1)} KB`,
        type: "file",
        nextQuizDate: now(),
      };

      setNotes((prev) => [newNote, ...prev]);
    } catch (err) {
      alert("File upload failed");
    }
  };


  const uploadFileToBackend = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("file_name", file.name);
    formData.append("path", file.webkitRelativePath || file.name);

    await axios.post(
      `/api/fileUpload/${encodeURIComponent(folderName)}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };


  return (
    <Card
      sx={{
        height: "80vh",
        width: "75vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" startIcon="+" component="label">
              File
              <input
                hidden
                type="file"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </Button>
          </Box>
        }
      />


      <Box
        sx={{
          display: "flex",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e5e7eb",
          fontSize: 12,
          fontWeight: 600,
          color: "text.secondary",
        }}
      >
        <Box sx={{ width: 40 }} />
        <Box sx={{ flexGrow: 1 }}>Name</Box>
        <Box sx={{ width: 120, textAlign: "center" }}>Next Quiz</Box>
        <Box sx={{ width: 110 }} />
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
          {notes.map((note, index) => (
            <Box key={note.id}>
              <ListItem
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 40,
                    display: "flex",
                    justifyContent: "center",
                    color:
                      note.type === "folder"
                        ? "warning.main"
                        : "info.main",
                  }}
                >
                  {note.type === "folder" ? (
                    <FolderIcon />
                  ) : (
                    <InsertDriveFileIcon />
                  )}
                </Box>


                <ListItemText
                  primary={
                    <Link underline="none" color="inherit" noWrap>
                      {note.title}
                    </Link>
                  }
                  secondary={note.description}
                />


                <Box sx={{ width: 120, textAlign: "center" }}>
                  <Typography variant="body2">
                    {note.nextQuizDate}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  sx={{ ml: "auto" }}
                >
                  Start Quiz
                </Button>
              </ListItem>

              {index < notes.length - 1 && (
                <Divider sx={{ mx: 2, borderStyle: "dashed" }} />
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Card>
  );
}