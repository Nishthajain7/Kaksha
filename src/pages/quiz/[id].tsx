import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Quiz() {
  const { id } = useParams();

  return (
    <Box p={4}>
      <Typography>Quiz placeholder</Typography>
      <Typography>ID: {id}</Typography>
    </Box>
  );
}
