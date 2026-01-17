import {
  Box,
  Card,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";

const questions = [
  {
    question: "Which language runs in the browser?",
    options: ["C++", "Java", "JavaScript","JavaScript"],
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "Hyper Text Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyperlink Text Transmission Process",
      "Home Tool Transfer Protocol",
    ],
  },
  {
    question: "Which language runs in the browser?",
    options: ["C++", "Java", "JavaScript","JavaScript"],
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "Hyper Text Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyperlink Text Transmission Process",
      "Home Tool Transfer Protocol",
    ],
  },
  {
    question: "Which language runs in the browser?",
    options: ["C++", "Java", "JavaScript","JavaScript"],
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "Hyper Text Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyperlink Text Transmission Process",
      "Home Tool Transfer Protocol",
    ],
  },
  {
    question: "Which language runs in the browser?",
    options: ["C++", "Java", "JavaScript","JavaScript"],
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "Hyper Text Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyperlink Text Transmission Process",
      "Home Tool Transfer Protocol",
    ],
  },
];

export default function Quiz() {
  const totalQ = questions.length;

  const [currQ, setCurrQ] = useState(0);
  const [ans, setAns] = useState(Array(totalQ).fill(null));
  const [timeLeft, setTimeLeft] = useState(totalQ * 60);

  const doneCount = ans.filter(a => a !== null).length;
  const progress = (doneCount / totalQ) * 100;
  const qData = questions[currQ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = s =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const handleSubmit = () => {
    if (!window.confirm("Submit test?")) return;
    console.log("Submitted answers:", ans);
  
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
  
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "black",
          color: "white",
          px: 3,
          py: 1,
          borderRadius: 999,
          fontWeight: 600,
        }}
      >
        Time Left: {formatTime(timeLeft)}
      </Box>

      <Card
        sx={{
          width: "70vw",
          maxWidth: 900,
          maxHeight: "85vh",
          p: 4,
          borderRadius: 3,
          position: "relative",
        }}
      >
      <Box
        display="flex"
        flexDirection="row" 
      >
      <Box
        display="flex"
        flexDirection="column"     
        alignItems="flex-start"     
        gap={2}
        mb={3}
      >
      <Typography color="text.secondary">
          Question {currQ + 1} of {totalQ}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1}>
          {questions.map((_, i) => (
            <Button
              key={i}
              size="small"
              variant="contained"
              color={ans[i] !== null ? "success" : "inherit"}
              onClick={() => setCurrQ(i)}
              sx={{ px: 2 }}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
      </Box>
      <Box sx={{ ml: "auto" }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          value={progress}
          variant="determinate"
          size={100}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
          }}
        >
          {doneCount}/{totalQ}
        </Box>
      </Box>
    </Box>



      </Box>
      
       <Typography variant="h5" fontWeight={600} mb={3}>
          {qData.question}
        </Typography>

        <Stack spacing={2} mb={4}>
          {qData.options.map((opt, i) => (
            <Button
              key={i}
              variant={ans[currQ] === i ? "contained" : "outlined"}
              onClick={() => {
                const copy = [...ans];
                copy[currQ] = i;
                setAns(copy);
              }}
              sx={{ justifyContent: "flex-start", py: 2 }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </Button>
          ))}
        </Stack>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            disabled={currQ === 0}
            onClick={() => setCurrQ(q => q - 1)}
          >
            Prev
          </Button>

          <Button color="error">Exit</Button>

          {currQ === totalQ - 1 ? (
            <Button
              color="success"
              variant="contained"
              disabled={currQ != totalQ-1}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button
            sx={{
              '&:focus': {
                outline: 'none',
                border: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
              },
            }}
              variant="contained"
              onClick={() => setCurrQ(q => q + 1)}
            >
              Next
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}
