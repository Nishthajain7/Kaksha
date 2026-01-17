import DashboardLayout from "../layouts/dashboard";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Button,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
} from "@mui/material";
import { Icon } from "@iconify/react";

export default function File() {
  const headerCell = {
  fontWeight: 600,
  textAlign: "center",
};

const veryWeak = {
  background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
  color: "#b71c1c",
  fontWeight: 500,
};

const weak = {
  background: "linear-gradient(135deg, #fff8e1, #ffecb3)",
  color: "#f57f17",
  fontWeight: 500,
};

const strong = {
  background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
  color: "#1b5e20",
  fontWeight: 500,
};

const veryStrong = {
  background: "linear-gradient(135deg, #e0f2f1, #b2dfdb)",
  color: "#004d40",
  fontWeight: 600,
};

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
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                "&:focus": { outline: "none", border: "none" },
                "&:focus-visible": { outline: "none" },
              }}
            >
              Take Quiz
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
  <Typography variant="h6" fontWeight={600} mb={2}>
    Topic Strength Analysis
  </Typography>

  <Card>
    <TableContainer>
      <Table>
        <TableHead>
  <TableRow>
    {["Very Weak", "Weak", "Strong", "Very Strong"].map((label, index) => (
      <TableCell
        key={label}
        sx={{
          fontWeight: 600,
          textAlign: "center",
          borderRight: index !== 3 ? "1px solid #e0e0e0" : "none",
        }}
      >
        {label}
      </TableCell>
    ))}
  </TableRow>
</TableHead>


        <TableBody>
          <TableRow>
            <TableCell sx={veryWeak}>Linear Equations</TableCell>
            <TableCell sx={weak}>Polynomials</TableCell>
            <TableCell sx={strong}>Newton’s Laws</TableCell>
            <TableCell sx={veryStrong}>Kinematics</TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={veryWeak}>Trigonometry</TableCell>
            <TableCell sx={weak}>Quadratic Equations</TableCell>
            <TableCell sx={strong}>Work & Energy</TableCell>
            <TableCell sx={veryStrong}>Motion</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
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
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
