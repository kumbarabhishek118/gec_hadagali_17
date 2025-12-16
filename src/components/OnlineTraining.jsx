import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { FaGraduationCap, FaUserTie, FaRocket, FaChartLine, FaLaptopCode } from "react-icons/fa";
import axios from "axios";
import styles from "./OnlineTraining.module.css";

const OnlineTraining = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/admin/allCourses");
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if(userData.role==="student") {
        navigate("/student-dashboard");
      }
    
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className={styles.heroTitle}>
                Welcome to <span className={styles.heroHighlight}>CareerPath</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Transform your career journey with our comprehensive training and placement platform. 
                Get industry-ready with smart learning and placement opportunities.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  className={`${styles.ctaButton} fw-bold shadow`}
                  onClick={handleGetStarted}
                >
                  <FaRocket className="me-2" />
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className={styles.heroIconContainer}>
                <FaGraduationCap size={120} color="#ffd700" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className={styles.sectionTitle}>Why Choose CareerPath Pro?</h2>
              <p className={styles.sectionSubtitle}>
                Comprehensive solutions for students and institutions
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className={styles.featureCard}>
                <Card.Body className="text-center p-4">
                  <div className={styles.featureIcon}>
                    <FaLaptopCode size={30} />
                  </div>
                  <Card.Title className={styles.featureTitle}>
                    Skill Development
                  </Card.Title>
                  <Card.Text className={styles.featureText}>
                    Access curated courses, aptitude training, and technical skill development programs.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className={styles.featureCard}>
                <Card.Body className="text-center p-4">
                  <div className={styles.featureIcon}>
                    <FaUserTie size={30} />
                  </div>
                  <Card.Title className={styles.featureTitle}>
                    Placement Ready
                  </Card.Title>
                  <Card.Text className={styles.featureText}>
                    Mock interviews, resume building, and direct placement opportunities with top companies.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className={styles.featureCard}>
                <Card.Body className="text-center p-4">
                  <div className={styles.featureIcon}>
                    <FaChartLine size={30} />
                  </div>
                  <Card.Title className={styles.featureTitle}>
                    Progress Tracking
                  </Card.Title>
                  <Card.Text className={styles.featureText}>
                    Monitor your learning journey with detailed analytics and performance insights.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Courses Section */}
      <section className={styles.statsSection}>
        <Container fluid className="py-5">
          <h2 className={styles.coursesTitle}>Available Courses</h2>
          
          {loading && (
            <div className={styles.loadingContainer}>
              <Spinner 
                animation="border" 
                variant="warning" 
                className={styles.loadingSpinner}
              />
              <p className="mt-3 text-white">Loading courses...</p>
            </div>
          )}

          {error && (
            <Alert variant="danger" className={`text-center ${styles.errorAlert}`}>
              {error}
            </Alert>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className={styles.noCoursesContainer}>
              <div className={styles.noCoursesIcon}>
                <FaGraduationCap />
              </div>
              <p className="text-white">No courses available right now.</p>
            </div>
          )}

          <Row className="g-4">
            {courses.map((course) => (
              <Col key={course._id} md={4}>
                <Card className={styles.courseCard} style={{height:'250px'}}>
                  <Card.Body>
                    <Card.Title className={styles.courseTitle}>
                      {course.title}
                    </Card.Title>
                    <Card.Subtitle className={styles.courseDate}>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text className={styles.courseDescription}>
                      {course.description.length > 150
                        ? course.description.substring(0, 150) + "..."
                        : course.description
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default OnlineTraining;