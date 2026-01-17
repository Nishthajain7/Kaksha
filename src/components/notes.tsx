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
import AddIcon from "@mui/icons-material/Add";
import { NoteItem } from "../assets/mockNotes";

type NotesSectionProps = CardProps & {
  title?: string;
  notes: NoteItem[];
};

export default function NotesSection({
  title = "Notes",
  notes,
}: NotesSectionProps) {
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const file = files[0];

    console.log({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };
  const handleFolderSelect = (files: FileList | null) => {
    if (!files) return;

    const folderFiles = Array.from(files);

    console.log(
      folderFiles.map((file) => ({
        name: file.name,
        path: (file as any).webkitRelativePath,
      }))
    );
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
              />
            </Button>
          </Box>
        }
      />

      <Box
    sx={{
      flexGrow: 1,
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "#e5e7eb transparent",
    }}
  >
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

                <Typography variant="caption" color="text.disabled">
                  {note.updatedAt}
                </Typography>
              </ListItem>

              {index < notes.length - 1 && (
                <Divider sx={{ mx: 2, borderStyle: "dashed" }} />
              )}
            </Box>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button size="small" color="inherit">
          View all
        </Button>
      </Box>
    </Card>
  );
}