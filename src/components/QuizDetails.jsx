import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button, Spinner, Form, Alert } from "react-bootstrap";

const QuizDetails = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/getQuizById/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error("❌ Error fetching quiz:", err);
        alert("Error loading quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctCount = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount++;
    });

    setScore(correctCount);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading quiz...</p>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container className="text-center py-5" style={{marginTop:'100px'}}>
        <p className="text-muted">Quiz not found.</p>
        <Link to="/student-dashboard">
          <Button variant="secondary">Back to All Quizzes</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{marginTop:'100px'}}>
      <Card className="shadow-lg border-0 p-4">
        <h2 className="text-primary fw-bold mb-2 text-center">{quiz.title}</h2>
        <p className="text-center text-muted">
          Category: {quiz.category} | Difficulty: {quiz.difficulty || "N/A"} | Time:{" "}
          {quiz.timeLimit ? `${quiz.timeLimit} min` : "Unlimited"}
        </p>
        <hr />

        <Form onSubmit={handleSubmit}>
          {quiz.questions.map((q, qIndex) => (
            <Card key={qIndex} className="mb-3 border-0 shadow-sm p-4">
              <h6 className="fw-bold">
                {qIndex + 1}. {q.question}
              </h6>

              {q.options.map((opt, optIndex) => {
                const isCorrect = submitted && opt === q.correctAnswer;
                const isWrong = submitted && answers[qIndex] === opt && opt !== q.correctAnswer;

                return (
                  <Form.Check
                    key={optIndex}
                    type="radio"
                    name={`question-${qIndex}`}
                    label={opt}
                    value={opt}
                    checked={answers[qIndex] === opt}
                    onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                    disabled={submitted}
                    className={`p-2 rounded ${
                      isCorrect ? "bg-success bg-opacity-25" : isWrong ? "bg-danger bg-opacity-25" : ""
                    }`}
                  />
                );
              })}

              {submitted && (
                <div className="mt-2">
                  {answers[qIndex] === q.correctAnswer ? (
                    <span className="text-success fw-semibold">✅ Correct!</span>
                  ) : (
                    <span className="text-danger fw-semibold">
                      ❌ Wrong. Correct Answer: {q.correctAnswer}
                    </span>
                  )}
                </div>
              )}
            </Card>
          ))}

          {!submitted ? (
            <div className="text-center mt-4">
              <Button
                type="submit"
                variant="primary"
                className="fw-bold px-4"
                style={{
                  background: "linear-gradient(135deg, #6f42c1, #007bff)",
                  border: "none",
                }}
              >
                Submit Quiz
              </Button>
            </div>
          ) : (
            <div className="text-center mt-4">
              <Alert variant="info" className="fw-bold fs-5">
                You scored {score} / {quiz.questions.length}
              </Alert>
              <Link to="/student-dashboard">
                <Button variant="secondary">Back to Quizzes</Button>
              </Link>
            </div>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default QuizDetails;
