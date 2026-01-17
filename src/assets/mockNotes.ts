export type NoteItem = {
  id: string;
  title: string;
  description: string;
  type: "folder" | "file";
  updatedAt: string;
};

export const NOTES: NoteItem[] = [
  {
    id: "1",
    title: "Whiteboard Templates",
    description: "The Nagasaki Lander",
    type: "folder",
    updatedAt: "2 years",
  },
  {
    id: "2",
    title: "Tesla",
    description: "New range of formal shirts",
    type: "folder",
    updatedAt: "2 years",
  },
  {
    id: "3",
    title: "Designify Agency",
    description: "Andy shoes are designed",
    type: "folder",
    updatedAt: "2 years",
  },
  {
    id: "4",
    title: "What is Donene",
    description: "The Football Is Good For Training",
    type: "folder",
    updatedAt: "2 years",
  },
  {
    id: "5",
    title: "Fresh Prince",
    description: "New ABC 13 9370, 13.3",
    type: "file",
    updatedAt: "2 years",
  },
];