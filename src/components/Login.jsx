import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      const role = res.data.user.role.toLowerCase();
      setTimeout(() => {
        if (role === "student") navigate("/student-dashboard");
        else if (role === "admin") navigate("/admin-dashboard");
        else if (role === "recruiter") navigate("/recruiter-dashboard");
        else navigate("/");
      }, 1500);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setMessage({ type: "danger", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper} style={{ marginTop: '100px' }}>
      <Card className={`${styles.loginCard} shadow-lg border-0`}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <div className={styles.headerIcon}></div>
            <h2 className={`${styles.title} fw-bold`}>Welcome Back</h2>
            <p className={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          {message.text && (
            <Alert
              variant={message.type}
              className={`${styles.alertCustom} py-3 text-center mb-4`}
            >
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className={styles.formLabel}>
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="password">
              <Form.Label className={styles.formLabel}>
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className={styles.formControl}
              />
            </Form.Group>

            {/* Forgot Password Link */}
            <div className="text-end mb-3">
              <Button
                variant="link"
                className={styles.forgotPasswordLink}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className={`${styles.spinnerCustom} me-2`}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted mb-2">
              Don't have an account?{" "}
              <Button
                variant="link"
                className={`${styles.registerLink} p-0 fw-semibold`}
                onClick={() => navigate("/signup")}
              >
                Create account
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
