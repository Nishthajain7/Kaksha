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
    options: ["C++", "Java", "JavaScript", "JavaScript"],
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
    options: ["C++", "Java", "JavaScript", "JavaScript"],
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
    options: ["C++", "Java", "JavaScript", "JavaScript"],
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
    options: ["C++", "Java", "JavaScript", "JavaScript"],
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

  const formatTime = (s: number) =>
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >

      <Box
        sx={{
          top: 12,
          mb: 2,
          bgcolor: "black",
          color: "white",
          px: 2.5,
          py: 0.75,
          borderRadius: 999,
          fontWeight: 600,
        }}
      >
        Time Left: {formatTime(timeLeft)}
      </Box>

      <Card
        sx={{
          width: "100%",
          maxWidth: 820,
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Question {currQ + 1} of {totalQ}
            </Typography>

            <Box display="flex" gap={0.75} mt={1}>
              {questions.map((_, i) => (
                <Button
                  key={i}
                  size="small"
                  variant="contained"
                  color={ans[i] !== null ? "success" : "inherit"}
                  onClick={() => setCurrQ(i)}
                  sx={{
                    minWidth: 36,
                    height: 32,
                    fontSize: 12,
                  }}
                >
                  {i + 1}
                </Button>
              ))}
            </Box>
          </Box>

          <Box ml="auto">
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={progress}
                size={70}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {doneCount}/{totalQ}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Question */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          {qData.question}
        </Typography>

        {/* Options */}
        <Stack spacing={1.5} mb={2}>
          {qData.options.map((opt, i) => (
            <Button
              key={i}
              fullWidth
              variant={ans[currQ] === i ? "contained" : "outlined"}
              onClick={() => {
                const copy = [...ans];
                copy[currQ] = i;
                setAns(copy);
              }}
              sx={{
                justifyContent: "flex-start",
                py: 1.2,
                fontSize: 14,
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </Button>
          ))}
        </Stack>

        {/* Footer */}
        <Box
          mt="auto"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            size="small"
            disabled={currQ === 0}
            onClick={() => setCurrQ(q => q - 1)}
          >
            Prev
          </Button>

          <Button size="small" color="error">
            Exit
          </Button>

          {currQ === totalQ - 1 ? (
            <Button
              color="success"
              variant="contained"
              disabled={currQ != totalQ - 1}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button
              size="small"
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