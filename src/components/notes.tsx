import { Box, Card, CardHeader, CardProps, Button, List, ListItem, ListItemText, Divider, Link } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { NoteItem } from "../assets/mockNotes";
import { useState } from "react";

type NotesSectionProps = CardProps & {
  title?: string;
  initialNotes?: NoteItem[];
};

export default function NotesSection({
  title = "Notes",
  initialNotes = [],
}: NotesSectionProps) {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);

  const now = () => new Date().toLocaleDateString();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const file = files[0];

    const newNote: NoteItem = {
      id: crypto.randomUUID(),
      title: file.name,
      description: `${(file.size / 1024).toFixed(1)} KB`,
      type: "file",
    };

    setNotes((prev) => [newNote, ...prev]);
  };

  const handleFolderSelect = (files: FileList | null) => {
    if (!files) return;
    const folderName =
      (files[0] as any).webkitRelativePath?.split("/")[0] || "Folder";
    const newNote: NoteItem = {
      id: crypto.randomUUID(),
      title: folderName,
      description: `${files.length} items`,
      type: "folder",
    };

    setNotes((prev) => [newNote, ...prev]);
  };

  return (
    <Card sx={{ height: 320, display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={title}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" startIcon="+" component="label"
            >
              File
              <input
                hidden
                type="file"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </Button>

            <Button
              size="small"
              startIcon="+"
              component="label"
            >
              Folder
              <input
                hidden
                type="file"
                multiple
                onChange={(e) => handleFolderSelect(e.target.files)}
                {...({ webkitdirectory: "", directory: "" } as any)}
              />
            </Button>
          </Box>
        }
      />

      <Box sx={{ flexGrow: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent", }}>
        <List disablePadding>
          {notes.map((note, index) => (
            <Box key={note.id}>
              <ListItem sx={{ px: 2, py: 1, gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    display: "flex",
                    justifyContent: "center",
                    color: note.type === "folder" ? "warning.main" : "info.main",
                  }}
                >
                  {note.type === "folder" ? <FolderIcon /> : <InsertDriveFileIcon />}
                </Box>

                <ListItemText
                  primary={
                    <Link underline="none" color="inherit" noWrap>
                      {note.title}
                    </Link>
                  }
                  secondary={note.description}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>

              {index < notes.length - 1 && (
                <Divider sx={{ mx: 2, borderStyle: "dashed" }} />
              )}
            </Box>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          // size="small"
          color="inherit"
          disableRipple
          disableFocusRipple
          sx={{
            "&:focus": { outline: "none" },
            "&.Mui-focusVisible": { outline: "none" },
          }}
        >
          View all
        </Button>

      </Box>
    </Card>
  );
}