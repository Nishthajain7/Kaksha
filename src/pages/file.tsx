import DashboardLayout from "../layouts/dashboard";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import { Icon } from "@iconify/react";

export default function File() {
  return (
    <DashboardLayout>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <NextQuizCard
              title="Polynomials"
              time="2d 10h"
              color="#E3F2FD"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <NextQuizCard
              title="Newton's Laws"
              time="3d 4h"
              color="#F3E5F5"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <NextQuizCard
              title="Atomic Structure"
              time="5d 1h"
              color="#FFF3E0"
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

function NextQuizCard({
  title,
  time,
  color,
}: {
  title: string;
  time: string;
  color: string;
}) {
  return (
    <Card
      sx={{
        bgcolor: color,
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography fontWeight={600}>{title}</Typography>
          <Box sx={{display: "flex", flexDirection: "row", justifyContent:"space-between", alignItems: "center"}}>
            <Typography variant="h4" fontWeight={700}>
              {time}
            </Typography>
            <Icon
              icon="solar:clock-circle-outline"
              width={30}
              height={30}
            />

          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
