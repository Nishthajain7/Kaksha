export type NoteItem = {
  id: number | string;
  title: string;
  description: string;
  type: "folder" | "file";
};