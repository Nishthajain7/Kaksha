export type NoteItem = {
  id: string;
  title: string;
  description: string;
  type: "folder" | "file";
};

export const NOTES: NoteItem[] = [
  {
    id: "1",
    title: "Whiteboard Templates",
    description: "The Nagasaki Lander",
    type: "folder",
  },
  {
    id: "2",
    title: "Tesla",
    description: "New range of formal shirts",
    type: "folder",
  },
  {
    id: "3",
    title: "Designify Agency",
    description: "Andy shoes are designed",
    type: "folder",
  },
  {
    id: "4",
    title: "What is Donene",
    description: "The Football Is Good For Training",
    type: "folder",
  },
  {
    id: "5",
    title: "Fresh Prince",
    description: "New ABC 13 9370, 13.3",
    type: "file",
  },
];