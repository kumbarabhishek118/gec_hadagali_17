import React, { useState } from "react";
import { Container, Card, Button, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";

const Quiz = () => {
  const questions = [
    {
      id: 1,
      question: "Which data structure uses the LIFO principle?",
      options: ["Queue", "Stack", "Array", "Tree"],
      answer: "Stack",
    },
    {
      id: 2,
      question: "What is 12 + 8 ÷ 2?",
      options: ["10", "16", "20", "8"],
      answer: "16",
    },
    {
      id: 3,
      question: "Which keyword is used to declare a constant in JavaScript?",
      options: ["var", "let", "const", "static"],
      answer: "const",
    },
    {
      id: 4,
      question: "The OSI model has how many layers?",
      options: ["5", "6", "7", "8"],
      answer: "7",
    },
    {
      id: 5,
      question: "Which of the following is NOT a programming language?",
      options: ["Python", "Java", "HTML", "C++"],
      answer: "HTML",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setCompleted(false);
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <Container className="py-5 text-center">
      {!completed ? (
        <>
          <h2 className="text-primary mb-4">🧠 Placement Practice Quiz</h2>
          <ProgressBar now={progress} className="mb-4" label={`${Math.round(progress)}%`} />

          <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
            <h5 className="mb-3">
              Question {current + 1} of {questions.length}
            </h5>
            <p className="fw-semibold">{questions[current].question}</p>

            {questions[current].options.map((option) => (
              <Button
                key={option}
                variant={selected === option ? "primary" : "outline-primary"}
                className="d-block w-100 mb-2"
                onClick={() => setSelected(option)}
              >
                {option}
              </Button>
            ))}

            <div className="mt-3">
              <Button
                onClick={handleNext}
                disabled={selected === null}
                variant="success"
              >
                {current === questions.length - 1 ? "Finish Quiz" : "Next"}
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
            <h3 className="text-success mb-3">🎉 Quiz Completed!</h3>
            <p>
              You scored <strong>{score}</strong> out of {questions.length}
            </p>
            <ProgressBar
              now={(score / questions.length) * 100}
              label={`${Math.round((score / questions.length) * 100)}%`}
              variant="info"
              className="mb-4"
            />

            {score >= 3 ? (
              <p className="text-success fw-bold">Excellent work! Keep it up 💪</p>
            ) : (
              <p className="text-danger fw-bold">Keep practicing to improve 🚀</p>
            )}

            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button variant="secondary" onClick={restartQuiz}>
                Retry Quiz
              </Button>
              <Button as={Link} to="/student-dashboard" variant="primary">
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Quiz;
