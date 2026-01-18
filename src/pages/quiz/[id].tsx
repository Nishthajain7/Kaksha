import { Box, Card, Button, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios.post("/api/quiz/generate/", {
        file_id: id,
        num_questions: 10,
      })
      .then((res) => {
        setQuestions(res.data.questions);
        setAnswers(Array(10).fill(-1));
      })
      .catch(() => {
        alert("Failed to load quiz");
        navigate("/dashboard");
      });
  }, [id]);

}