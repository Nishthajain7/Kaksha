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
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { useEffect, useState } from "react";

type Folder = {
  id: number;
  name: string;
};

type NotesSectionProps = CardProps & {
  title?: string;
  initialNotes?: Folder[];
  onFolderClick?: (id: number) => void;
};


export default function NotesSection({
  title = "Notes",
  initialNotes = [],
  onFolderClick,
  ...cardProps
}: NotesSectionProps) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    setFolders(initialNotes);
  }, [initialNotes]);

  return (
    <Card
      sx={{ height: 320, display: "flex", flexDirection: "column" }}
      {...cardProps}
    >
      {/* HEADER — same as your UI */}
      <CardHeader
        title={title}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" disabled>
              File
            </Button>
            <Button size="small" disabled>
              Folder
            </Button>
          </Box>
        }
      />

      {/* LIST */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#e5e7eb transparent",
        }}
      >
        <List disablePadding>
          {folders.map((folder, index) => (
            <Box key={folder.id}>
              <ListItem
                sx={{
                  px: 2,
                  py: 1,
                  gap: 2,
                  cursor: "pointer",
                }}
                onClick={() => onFolderClick?.(folder.id)}
              >
                {/* ICON — EXACT */}
                <Box
                  sx={{
                    width: 40,
                    display: "flex",
                    justifyContent: "center",
                    color: "warning.main",
                  }}
                >
                  <FolderIcon />
                </Box>

                {/* TEXT — EXACT */}
                <ListItemText
                  primary={
                    <Link underline="none" color="inherit" noWrap>
                      {folder.name}
                    </Link>
                  }
                  secondary={`Folder ID: ${folder.id}`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>

              {index < folders.length - 1 && (
                <Divider sx={{ mx: 2, borderStyle: "dashed" }} />
              )}
            </Box>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
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
