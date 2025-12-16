import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Tab,
  Tabs,
  Badge,
  Alert,
  ListGroup,
  Modal,
  Form
} from "react-bootstrap";
import styles from "./AdminDashboard.module.css";
import { useNavigate } from "react-router-dom";



const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [quizzes, setQuizzes] = useState([]);
  const [aptitudes, setAptitudes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [resumeTips, setResumeTips] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [students, setStudents] = useState([]);


  // Modals/state for creating content
  const [activeModal, setActiveModal] = useState(null);
  const [quiz, setQuiz] = useState({
    title: "", category: "", description: "", difficulty: "", timeLimit: "",
    questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }]
  });
  const [resumeTip, setResumeTip] = useState({ title: "", description: "", keyPoints: [""] });
  const [aptitude, setAptitude] = useState({ name: "", description: "", answer: "" });
  const [course, setCourse] = useState({ title: "", description: "", relevantVideoLinks: [""], duration: "", departments: [""], pdfs: [] });
  const [form, setForm] = useState({
    studentId: "",
    sName: "",
    sEmail: "",
    password: "",
  });
  
  
  const navigate = useNavigate();

  // Helper: show alert
  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 4500);
  };

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setAlert({});

  const token = localStorage.getItem("token");

  if (!token) {
    setAlert({ type: "danger", message: "You must be logged in as admin." });
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:5000/api/admin/createStudent",
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setAlert({ type: "success", message: res.data.message });

    // Reset form
    setForm({
      studentId: "",
      sName: "",
      sEmail: "",
      password: "",
    });

    // Close modal
    setTimeout(() => {
      setShowSignupModal(false);
      setAlert({});
      fetchMyStudents(); // refresh list
    }, 800);

  } catch (error) {
    setAlert({
      type: "danger",
      message:
        error.response?.data?.message || "Error creating student",
    });
  } finally {
    setLoading(false);
  }
};
const fetchMyStudents = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Admin token missing");
      return;
    }

    const res = await axios.get(
      "http://localhost:5000/api/admin/myStudents",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStudents(res.data.students || []); // <-- Make sure you have setStudents state
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};


  // Fetch all admin data
  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [qRes, aRes, cRes, rRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/getAllQuizzes"),
        axios.get("http://localhost:5000/api/admin/getAllAptitudes"),
        axios.get("http://localhost:5000/api/admin/allCourses"),
        axios.get("http://localhost:5000/api/admin/getAllResume")
      ]);

      setQuizzes(qRes.data || []);
      setAptitudes(aRes.data || []);
      setCourses(cRes.data || []);
      setResumeTips(rRes.data || []);

      // optional: admin can view applications if endpoint exists
      if (token) {
        try {
          const apps = await axios.get("http://localhost:5000/api/admin/allApplications", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setApplications(apps.data || []);
        } catch (e) {
          // ignore if endpoint missing
        }
      }
    } catch (err) {
      console.error(err);
      showAlert("Error loading admin data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/online-training");
  };

  // Small helpers for difficulty badge
  const difficultyVariant = (d) => (d === "Easy" ? "success" : d === "Medium" ? "warning" : "danger");

  // Modal helpers (create forms)
  const handleShowModal = (type) => setActiveModal(type);
  const handleCloseModal = () => {
    setActiveModal(null);
    setAlert({ show: false, message: "", type: "" });
  };

  // Quiz form handlers
  const handleQuizChange = (e) => setQuiz({ ...quiz, [e.target.name]: e.target.value });
  const handleQuestionChange = (index, field, value) => {
    const updated = [...quiz.questions];
    updated[index][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quiz.questions];
    updated[qIndex].options[optIndex] = value;
    setQuiz({ ...quiz, questions: updated });
  };
  const addQuestion = () => setQuiz({ ...quiz, questions: [...quiz.questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }] });

  // resume/aptitude/course handlers
  const handleResumeTipChange = (e) => setResumeTip({ ...resumeTip, [e.target.name]: e.target.value });
  const handleKeyPointChange = (i, v) => { const kp = [...resumeTip.keyPoints]; kp[i] = v; setResumeTip({ ...resumeTip, keyPoints: kp }); };
  const addKeyPoint = () => setResumeTip({ ...resumeTip, keyPoints: [...resumeTip.keyPoints, ""] });

  const handleAptitudeChange = (e) => setAptitude({ ...aptitude, [e.target.name]: e.target.value });

  const handleCourseChange = (e) => setCourse({ ...course, [e.target.name]: e.target.value });
  const handleVideoChange = (i, v) => { const vlinks = [...course.relevantVideoLinks]; vlinks[i] = v; setCourse({ ...course, relevantVideoLinks: vlinks }); };
  const addVideoLink = () => setCourse({ ...course, relevantVideoLinks: [...course.relevantVideoLinks, ""] });
  const handleFileChange = (e) => setCourse({ ...course, pdfs: Array.from(e.target.files || []) });

  // Create handlers
  const createQuiz = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/createQuiz", quiz, { headers: { Authorization: `Bearer ${token}` } });
      showAlert("Quiz created successfully!", "success");
      handleCloseModal();
      fetchAll();
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || "Error creating quiz", "danger");
    }
  };

  const createResumeTip = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/createResumeTip", resumeTip, { headers: { Authorization: `Bearer ${token}` } });
      showAlert("Resume tip created successfully!", "success");
      handleCloseModal();
      fetchAll();
    } catch (err) {
      console.error(err);
      showAlert("Error creating resume tip", "danger");
    }
  };

  const createAptitude = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/createAptitude", aptitude, { headers: { Authorization: `Bearer ${token}` } });
      showAlert("Aptitude question created successfully!", "success");
      handleCloseModal();
      fetchAll();
    } catch (err) {
      console.error(err);
      showAlert("Error creating aptitude", "danger");
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("title", course.title);
      fd.append("description", course.description);
      fd.append("duration", course.duration);
      fd.append("relevantVideoLinks", course.relevantVideoLinks.join(","));
      fd.append("departments", course.departments?.join?.(",") || "");
      course.pdfs?.forEach((p) => fd.append("pdfs", p));
      await axios.post("http://localhost:5000/api/admin/createCourse", fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      showAlert("Course created successfully!", "success");
      handleCloseModal();
      fetchAll();
    } catch (err) {
      console.error(err);
      showAlert("Error creating course", "danger");
    }
  };

  // Delete handlers
  const deleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/quiz/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showAlert("Quiz deleted successfully!", "success");
      fetchAll();
    } catch (err) {
      console.error(err);
      showAlert("Error deleting quiz", "danger");
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/deleteCourse/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showAlert("Course deleted successfully!", "success");
      fetchAll();
    } catch (err) { console.error(err); showAlert("Error deleting course", "danger"); }
  };

  if (loading) {
    return (
      <Container className="text-center py-5" style={{ marginTop: 120 }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading admin dashboard...</p>
      </Container>
    );
  }

  return (
    <div className={styles.root} style={{ marginTop: '80px' }}>
      {alert.show && <Alert variant={alert.type} className={`${styles.globalAlert} shadow-sm`} dismissible onClose={() => setAlert({ show: false, message: "", type: "" })}>{alert.message}</Alert>}

      {/* Hero Section */}
      <header className={styles.hero}>
        <Container fluid="lg" className="h-100">
          <Row className="h-100 align-items-center">
            <Col>
              <h1 className={styles.title}>Admin Dashboard</h1>
              <p className={styles.lead}>Manage quizzes, courses, users and content with ease</p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button variant="light" className={styles.primaryBtn} onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2" />Logout
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
          <Button
  variant="success"
  className="fw-semibold"
  onClick={() => setShowSignupModal(true)}
>
  <i className="bi bi-person-plus me-2"></i>
  Create Student
</Button>

      <Button onClick={() => navigate("/mystudents")}>
  View My Students
</Button>

      </header>

      {/* Stats Cards */}
      <Container fluid="lg" className={styles.statsContainer}>
        <Row className="g-4">
          <Col xs={12} md={3}>
            <Card className={`${styles.statCard} ${styles.quizStat}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className={styles.statLabel}>Quizzes</small>
                    <h3 className={styles.statNumber}>{quizzes.length}</h3>
                    <small className={styles.statSubtext}>Created</small>
                  </div>
                  <div className={styles.statIcon}><i className="bi bi-journal-check"></i></div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={3}>
            <Card className={`${styles.statCard} ${styles.courseStat}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className={styles.statLabel}>Courses</small>
                    <h3 className={styles.statNumber}>{courses.length}</h3>
                    <small className={styles.statSubtext}>Published</small>
                  </div>
                  <div className={styles.statIcon}><i className="bi bi-mortarboard"></i></div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={3}>
            <Card className={`${styles.statCard} ${styles.resumeStat}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className={styles.statLabel}>Resume Tips</small>
                    <h3 className={styles.statNumber}>{resumeTips.length}</h3>
                    <small className={styles.statSubtext}>Published</small>
                  </div>
                  <div className={styles.statIcon}><i className="bi bi-file-earmark-text"></i></div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={3}>
            <Card className={`${styles.statCard} ${styles.aptitudeStat}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className={styles.statLabel}>Aptitude</small>
                    <h3 className={styles.statNumber}>{aptitudes.length}</h3>
                    <small className={styles.statSubtext}>Questions</small>
                  </div>
                  <div className={styles.statIcon}><i className="bi bi-lightning-charge"></i></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Tabs Section */}
      <Container fluid="lg" className={styles.tabsContainer}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className={styles.customTabs}
          fill
        >
          {/* Overview Tab */}
          <Tab eventKey="overview" title={<span><i className="bi bi-speedometer2 me-2" />Overview</span>}>
            <div className={styles.section}>
              <h5 className={styles.sectionTitle}>Quick Actions</h5>
              <Row className="g-4">
                <Col xs={12} md={3}>
                  <Card className={`${styles.actionCard} ${styles.quizAction}`} onClick={() => handleShowModal('quiz')}>
                    <Card.Body className="d-flex flex-column align-items-center text-center">
                      <div className={styles.actionIcon}><i className="bi bi-question-circle"></i></div>
                      <h6 className="mt-3 mb-2">Create Quiz</h6>
                      <small className="text-muted">Add new interactive quizzes</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={3}>
                  <Card className={`${styles.actionCard} ${styles.resumeAction}`} onClick={() => handleShowModal('resumeTip')}>
                    <Card.Body className="d-flex flex-column align-items-center text-center">
                      <div className={styles.actionIcon}><i className="bi bi-file-earmark-text"></i></div>
                      <h6 className="mt-3 mb-2">Resume Tip</h6>
                      <small className="text-muted">Publish career tips</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={3}>
                  <Card className={`${styles.actionCard} ${styles.aptitudeAction}`} onClick={() => handleShowModal('aptitude')}>
                    <Card.Body className="d-flex flex-column align-items-center text-center">
                      <div className={styles.actionIcon}><i className="bi bi-lightning-charge"></i></div>
                      <h6 className="mt-3 mb-2">Aptitude</h6>
                      <small className="text-muted">Add aptitude questions</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={3}>
                  <Card className={`${styles.actionCard} ${styles.courseAction}`} onClick={() => handleShowModal('course')}>
                    <Card.Body className="d-flex flex-column align-items-center text-center">
                      <div className={styles.actionIcon}><i className="bi bi-mortarboard"></i></div>
                      <h6 className="mt-3 mb-2">Create Course</h6>
                      <small className="text-muted">Publish new courses</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tab>

          {/* Quizzes Tab */}
          <Tab eventKey="quizzes" title={<span><i className="bi bi-question-circle me-2" />Quizzes ({quizzes.length})</span>}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h5 className={styles.sectionTitle}>All Quizzes</h5>
                <Button variant="primary" size="sm" onClick={() => handleShowModal('quiz')}>
                  <i className="bi bi-plus-circle me-2" />Create Quiz
                </Button>
              </div>
              <Row className="g-4">
                {quizzes.map((q) => (
                  <Col key={q._id} xs={12} md={6} lg={4}>
                    <Card className={styles.contentCard}>
                      <Card.Body className="d-flex flex-column h-100">
                        <div className={styles.cardHeader}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className={styles.cardTitle}>
                              <h6 className="mb-1">{q.title}</h6>
                              <small className="text-muted">{q.category}</small>
                            </div>
                            <Badge bg={difficultyVariant(q.difficulty)} className={styles.difficultyBadge}>
                              {q.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className={`${styles.cardDescription} mb-3`}>{q.description || "No description provided"}</p>
                        <div className="mt-auto">
                          <div className={styles.cardActions}>
                            <Button variant="outline-danger" size="sm" onClick={() => deleteQuiz(q._id)}>
                              <i className="bi bi-trash me-2" />Delete
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => navigate(`/quiz/${q._id}`)}>
                              <i className="bi bi-play me-2" />Preview
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>

          {/* Courses Tab */}
          <Tab eventKey="courses" title={<span><i className="bi bi-mortarboard me-2" />Courses ({courses.length})</span>}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h5 className={styles.sectionTitle}>All Courses</h5>
                <Button variant="primary" size="sm" onClick={() => handleShowModal('course')}>
                  <i className="bi bi-plus-circle me-2" />Create Course
                </Button>
              </div>
              <Row className="g-4">
                {courses.map((c) => (
                  <Col key={c._id} xs={12} md={6} lg={4}>
                    <Card className={styles.contentCard}>
                      <Card.Body className="d-flex flex-column h-100">
                        <div className={styles.cardHeader}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className={styles.cardTitle}>
                              <h6 className="mb-1">{c.title}</h6>
                              <small className="text-muted">{c.duration || "Self-paced"}</small>
                            </div>
                            <i className="bi bi-graduation fs-4 text-primary"></i>
                          </div>
                        </div>
                        <p className={`${styles.cardDescription} mb-3`}>{c.description || "No description provided"}</p>
                        <div className="mt-auto">
                          <div className={styles.cardActions}>
                            <Button variant="outline-danger" size="sm" onClick={() => deleteCourse(c._id)}>
                              Delete
                            </Button>
                            <Button variant="outline-primary" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>

          {/* Resume Tips Tab */}
          <Tab eventKey="resumeTips" title={<span><i className="bi bi-file-earmark-text me-2" />Resume Tips ({resumeTips.length})</span>}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h5 className={styles.sectionTitle}>Resume Tips</h5>
                <Button variant="primary" size="sm" onClick={() => handleShowModal('resumeTip')}>
                  <i className="bi bi-plus-circle me-2" />Create Tip
                </Button>
              </div>
              <Row className="g-4">
                {resumeTips.map((r) => (
                  <Col key={r._id} xs={12} md={6} lg={4}>
                    <Card className={styles.contentCard}>
                      <Card.Body>
                        <h6 className={styles.cardTitle}>{r.title}</h6>
                        <p className={styles.cardDescription}>{r.description}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>

          {/* Aptitude Tab */}
          <Tab eventKey="aptitudes" title={<span><i className="bi bi-lightning-charge me-2" />Aptitude ({aptitudes.length})</span>}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h5 className={styles.sectionTitle}>Aptitude Questions</h5>
                <Button variant="primary" size="sm" onClick={() => handleShowModal('aptitude')}>
                  <i className="bi bi-plus-circle me-2" />Create Question
                </Button>
              </div>
              <Row className="g-4">
                {aptitudes.map((a) => (
                  <Col key={a._id} xs={12} md={6} lg={4}>
                    <Card className={styles.contentCard}>
                      <Card.Body>
                        <h6 className={`${styles.cardTitle} mb-3`}>{a.name}</h6>
                        <p className={`${styles.cardDescription} mb-3`}>{a.description}</p>
                        <div className={styles.answerSection}>
                          <strong>Answer:</strong> {a.answer}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>


        </Tabs>
      </Container>

      {/* Modals remain the same as in your original code */}
      <Modal show={activeModal === 'quiz'} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Create Quiz</Modal.Title></Modal.Header>
        <Form onSubmit={createQuiz}>
          <Modal.Body>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control name="title" value={quiz.title} onChange={handleQuizChange} required /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Control name="category" value={quiz.category} onChange={handleQuizChange} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" value={quiz.description} onChange={handleQuizChange} /></Form.Group>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Difficulty</Form.Label><Form.Select name="difficulty" value={quiz.difficulty} onChange={handleQuizChange}><option value="">Select</option><option>Easy</option><option>Medium</option><option>Hard</option></Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Time Limit</Form.Label><Form.Control type="number" min="1" name="timeLimit" value={quiz.timeLimit} onChange={handleQuizChange} /></Form.Group></Col>
            </Row>

            <h6>Questions</h6>
            {quiz.questions.map((q, qi) => (
              <Card key={qi} className="p-3 mb-2">
                <Form.Group className="mb-2"><Form.Label>Question {qi + 1}</Form.Label><Form.Control value={q.question} onChange={(e) => handleQuestionChange(qi, 'question', e.target.value)} /></Form.Group>
                {q.options.map((opt, oi) => (
                  <Form.Group className="mb-2" key={oi}><Form.Label>Option {oi + 1}</Form.Label><Form.Control value={opt} onChange={(e) => handleOptionChange(qi, oi, e.target.value)} /></Form.Group>
                ))}
                <Form.Group><Form.Label>Correct Answer</Form.Label><Form.Select value={q.correctAnswer} onChange={(e) => handleQuestionChange(qi, 'correctAnswer', e.target.value)}><option value="">Select</option>{q.options.map((o, i) => <option key={i} value={o}>{o || `Option ${i + 1}`}</option>)}</Form.Select></Form.Group>
              </Card>
            ))}
            <Button variant="outline-primary" onClick={addQuestion} className="w-100">+ Add Question</Button>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Cancel</Button><Button variant="primary" type="submit">Create</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={activeModal === 'resumeTip'} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-danger text-white"><Modal.Title>Create Resume Tip</Modal.Title></Modal.Header>
        <Form onSubmit={createResumeTip}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control name="title" value={resumeTip.title} onChange={handleResumeTipChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" value={resumeTip.description} onChange={handleResumeTipChange} required /></Form.Group>
            <h6>Key points</h6>
            {resumeTip.keyPoints.map((kp, i) => <Form.Group key={i} className="mb-2"><Form.Control value={kp} onChange={(e) => handleKeyPointChange(i, e.target.value)} /></Form.Group>)}
            <Button variant="outline-danger" onClick={addKeyPoint} className="w-100">+ Add</Button>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Cancel</Button><Button variant="danger" type="submit">Create</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={activeModal === 'aptitude'} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-info text-white"><Modal.Title>Create Aptitude</Modal.Title></Modal.Header>
        <Form onSubmit={createAptitude}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control name="name" value={aptitude.name} onChange={handleAptitudeChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Question</Form.Label><Form.Control as="textarea" name="description" value={aptitude.description} onChange={handleAptitudeChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Answer</Form.Label><Form.Control as="textarea" name="answer" value={aptitude.answer} onChange={handleAptitudeChange} required /></Form.Group>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Cancel</Button><Button variant="info" type="submit">Create</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={activeModal === 'course'} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white"><Modal.Title>Create Course</Modal.Title></Modal.Header>
        <Form onSubmit={createCourse}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control name="title" value={course.title} onChange={handleCourseChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" value={course.description} onChange={handleCourseChange} required /></Form.Group>
            <Row>
              <Col md={6}><Form.Group><Form.Label>Duration</Form.Label><Form.Control name="duration" value={course.duration} onChange={handleCourseChange} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>PDFs</Form.Label><Form.Control type="file" multiple accept=".pdf" onChange={handleFileChange} /></Form.Group></Col>
            </Row>
            <h6 className="mt-3">Video Links</h6>
            {course.relevantVideoLinks.map((v, i) => (
              <Form.Group key={i} className="mb-2"><Form.Control value={v} onChange={(e) => handleVideoChange(i, e.target.value)} /></Form.Group>
            ))}
            <Button variant="outline-success" onClick={addVideoLink} className="w-100">+ Add Video Link</Button>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Cancel</Button><Button variant="success" type="submit">Create</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal
  show={showSignupModal}
  onHide={() => setShowSignupModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Create Student</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {alert.message && (
      <Alert variant={alert.type}>{alert.message}</Alert>
    )}

    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Student ID</Form.Label>
        <Form.Control
          type="text"
          name="studentId"
          value={form.studentId}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Student Name</Form.Label>
        <Form.Control
          type="text"
          name="sName"
          value={form.sName}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="sEmail"
          value={form.sEmail}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          required
        />
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        className="w-100"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Student"}
      </Button>
    </Form>
  </Modal.Body>
</Modal>


      
    </div>
  );
};

export default AdminDashboard;