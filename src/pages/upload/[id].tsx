import DashboardLayout from "../../layouts/dashboard";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { NOTES } from "../../assets/mockNotes";
import NotesSection from "../../components/notesupload";
import {useParams} from 'react-router-dom'

function geturl(){
  const {folderid} = useParams();

// `    useEffect(()=>{

//     }

//     ))`

}

export default function Upload() {
  return (
    <DashboardLayout>
      <Grid container spacing={2} >
        <Grid item xs={12} md={5}>
          <NotesSection initialNotes={NOTES} />
        </Grid>

        <Grid item xs={12} md={7}>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #eee",
            }}
          >
          </Box>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}