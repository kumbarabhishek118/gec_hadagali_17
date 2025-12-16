import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
// import { 
//   PersonFill, 
//   EnvelopeFill, 
//   LockFill, 
//   PersonBadgeFill,
//   ShieldCheckFill 
// } from "react-bootstrap-icons";
import styles from "./Signup.module.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage(response.data.message || "Registration successful!");
      setFormData({ userId: "", name: "", email: "", password: "", role: "" });

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error connecting to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupWrapper} style={{ marginTop: '80px' }}>
      <Container fluid className="mx-auto">
        <Row  className="d-flex justify-content-center align-items-center">

          <Col lg={12} >
            <Card className={`${styles.signupCard} shadow-lg border-0`}>
              {/* Header Section */}
              <div className={`${styles.cardHeader} text-white`}>
                <h2 className={styles.title}>Join Our Community</h2>
                <p className={styles.subtitle}>Create your account and start your journey</p>
              </div>

              <Card.Body className={styles.cardBody}>
                {message && (
                  <Alert
                    variant={message.includes("success") ? "success" : "danger"}
                    className={`${styles.alertCustom} text-center mb-4`}
                  >
                    <i className={`me-2 ${message.includes("success") ? "fas fa-check-circle" : "fas fa-exclamation-triangle"}`}></i>
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className={styles.rowGap}>
                    <Col md={6}>
                      <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                          {/* <PersonBadgeFill className="me-2" /> */}
                          User ID
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="userId"
                          value={formData.userId}
                          onChange={handleChange}
                          placeholder="Enter unique user ID"
                          required
                          className={styles.formControl}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                          {/* <PersonFill className="me-2" /> */}
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className={styles.formControl}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className={styles.formGroup}>
                    <Form.Label className={styles.formLabel}>
                      {/* <EnvelopeFill className="me-2" /> */}
                      Email Address
                    </Form.Label>
                    <div className={styles.inputGroup}>
                      <span className={styles.inputGroupText}>
                        {/* <EnvelopeFill /> */}
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        className={styles.formControl}
                        style={{ borderLeft: 'none', borderRadius: '0 12px 12px 0' }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={styles.formGroup}>
                    <Form.Label className={styles.formLabel}>
                      {/* <LockFill className="me-2" /> */}
                      Password
                    </Form.Label>
                    <div className={styles.inputGroup}>
                      <span className={styles.inputGroupText}>
                        {/* <LockFill /> */}
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        required
                        className={styles.formControl}
                        style={{ borderLeft: 'none', borderRadius: '0 12px 12px 0' }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={styles.formGroup}>
                    <Form.Label className={styles.formLabel}>
                      {/* <PersonBadgeFill className="me-2" /> */}
                      Select Role
                    </Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className={styles.selectControl}
                    >
                      <option value="">Choose your role...</option>
                      <option value="admin">Administrator</option>
                      <option value="student">Student</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="alumini">Alumini</option>

                    </Form.Select>
                  </Form.Group>

                  <div className="d-grid mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className={styles.submitButton}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="text-muted mb-0">
                      Already have an account?{" "}
                      <Button
                        variant="link"
                        className={`${styles.loginLink} p-0`}
                        onClick={() => navigate("/login")}
                      >
                        Sign In Now
                      </Button>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Security Note */}
            <Card className={`mt-4 ${styles.securityNote} border-0 text-center`}>
              <Card.Body className="py-3">
                {/* <ShieldCheckFill className={`${styles.securityIcon} me-2`} /> */}
                <small className="text-muted fw-semibold">
                  Your personal information is securely encrypted and protected
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;