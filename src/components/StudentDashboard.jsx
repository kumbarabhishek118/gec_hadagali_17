import axios from "axios";

import React, { useEffect, useState } from "react";

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

  Tab as BootstrapTab,

  Tabs as BootstrapTabs

} from "react-bootstrap";

import { useNavigate } from "react-router-dom";



const StudentDashboard = () => {

  const [activeTab, setActiveTab] = useState("quizzes");

  const [quizzes, setQuizzes] = useState([]);

  const [aptitudes, setAptitudes] = useState([]);

  const [courses, setCourses] = useState([]);

  const [applications, setApplications] = useState([]);

  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [showCourseModal, setShowCourseModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [modalActiveTab, setModalActiveTab] = useState("overview");

  const navigate = useNavigate();



  // Show alert function

  const showAlert = (message, type = "info") => {

    setAlert({ show: true, message, type });

    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);

  };



  // Fetch all data

  const fetchData = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");



      // Fetch quizzes

      const quizzesRes = await axios.get("http://localhost:5000/api/admin/getAllQuizzes");

      setQuizzes(quizzesRes.data);



      // Fetch aptitudes

      const aptitudesRes = await axios.get("http://localhost:5000/api/admin/getAllAptitudes");

      setAptitudes(aptitudesRes.data);



      // Fetch courses

      const coursesRes = await axios.get("http://localhost:5000/api/admin/allCourses");

      setCourses(coursesRes.data);



      // Fetch job applications if logged in

      if (token) {

        try {

          const applicationsRes = await axios.get("http://localhost:5000/api/student/myApplications", {

            headers: { Authorization: `Bearer ${token}` }

          });

          setApplications(applicationsRes.data.applications || []);

        } catch (error) {

          console.error("Error fetching applications:", error);

        }



        try {

          const interviewsRes = await axios.get("http://localhost:5000/api/student/myInterviews", {

            headers: { Authorization: `Bearer ${token}` }

          });

          setInterviews(interviewsRes.data.interviews || []);

        } catch (error) {

          console.error("Error fetching interviews:", error);

        }

      }

    } catch (error) {

      console.error("❌ Error fetching data:", error);

      showAlert("Error loading dashboard data", "danger");

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchData();

  }, []);



  // Handle View Course Details

  const handleViewCourse = (course) => {

    setSelectedCourse(course);

    setModalActiveTab("overview");

    setShowCourseModal(true);

  };



  // Handle Close Modal

  const handleCloseModal = () => {

    setShowCourseModal(false);

    setSelectedCourse(null);

  };



  // ✅ Logout handler

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/online-training");

  };



  if (loading) {

    return (

      <Container className="text-center py-5" style={{ marginTop: "120px" }}>

        <Spinner animation="border" variant="primary" />

        <p className="mt-2">Loading dashboard...</p>

      </Container>

    );

  }



  return (

    <div style={{ marginTop: '80px' }}>

      {/* Alert Component */}

      {alert.show && (

        <Alert

          variant={alert.type}

          className="position-fixed top-0 start-50 translate-middle-x mt-5 z-3"

          style={{ minWidth: "300px" }}

          dismissible

          onClose={() => setAlert({ show: false, message: "", type: "" })}

        >

          {alert.message}

        </Alert>

      )}



      {/* Hero Section */}

      <div className="bg-gradient-primary text-white p-4" style={{

        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

      }}>

        

          <Row className="align-items-center justify-content-between me-5">
            <Col>
              <h1 className="display-6 fw-bold mb-2">Student Dashboard</h1>
              <p className="lead mb-0">
                Welcome to your learning and career management portal
              </p>
            </Col>

            <Col xs="auto">
              <Button
                variant="outline-light"
                className="fw-semibold px-4 shadow-sm"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </Button>
            </Col>
          </Row>


      

      </div>



      <Container fluid className="py-4">

        <Tabs

          activeKey={activeTab}

          onSelect={(tab) => setActiveTab(tab)}

          className="mb-4 custom-tabs"

          justify

        >

          {/* Quizzes Tab - Unchanged */}

          <Tab eventKey="quizzes" title={

            <span>

              <i className="fas fa-question-circle me-2"></i>

              Quizzes ({quizzes.length})

            </span>

          }>

            <div className="py-3">

              <h4 className="mb-4 text-primary">Available Quizzes</h4>

              {quizzes.length === 0 ? (

                <div className="text-center py-5">

                  <i className="fas fa-question-circle fa-3x text-muted mb-3"></i>

                  <p className="text-muted">No quizzes available at the moment.</p>

                </div>

              ) : (

                <Row className="g-4">

                  {quizzes.map((quiz, index) => (

                    <Col key={quiz._id} md={4}>

                      <Card className="shadow border-0  quiz-card" style={{height:'300px'}}>

                        <Card.Body className="d-flex flex-column">

                          <div className="mb-3">

                            <div className="d-flex justify-content-between align-items-start mb-2">

                              <Card.Title className="text-dark fw-bold mb-0">

                                {quiz.title}

                              </Card.Title>

                              <Badge

                                bg={

                                  quiz.difficulty === 'Easy' ? 'success' :

                                    quiz.difficulty === 'Medium' ? 'warning' : 'danger'

                                }

                              >

                                {quiz.difficulty}

                              </Badge>

                            </div>

                            <Card.Subtitle className="text-muted mb-2">

                              <i className="fas fa-tag me-2"></i>

                              {quiz.category}

                            </Card.Subtitle>

                            <Card.Text className="text-secondary small">

                              {quiz.description || "No description available"}

                            </Card.Text>

                          </div>



                          <div className="mt-auto">

                            <div className="d-flex justify-content-between align-items-center mb-2">

                              <small className="text-muted">

                                <i className="fas fa-user me-1"></i>

                                {quiz.createdBy?.name || "Unknown"}

                              </small>

                              <small className="text-muted">

                                <i className="fas fa-clock me-1"></i>

                                {quiz.timeLimit || 10}m

                              </small>

                            </div>

                            <Button

                              variant="primary"

                              className="w-100 fw-semibold"

                              style={{

                                background: "linear-gradient(135deg, #6f42c1, #007bff)",

                                border: "none"

                              }}

                              onClick={() => navigate(`/quiz/${quiz._id}`)}

                            >

                              <i className="fas fa-play me-2"></i>

                              Start Quiz

                            </Button>

                          </div>

                        </Card.Body>

                      </Card>

                    </Col>

                  ))}

                </Row>

              )}

            </div>

          </Tab>



          {/* Courses Tab - Updated with Modal */}

          <Tab eventKey="courses" title={

            <span>

              <i className="fas fa-graduation-cap me-2"></i>

              Courses ({courses.length})

            </span>

          }>

            <div className="py-3">

              <h4 className="mb-4 text-primary">Available Courses</h4>

              {courses.length === 0 ? (

                <div className="text-center py-5">

                  <i className="fas fa-graduation-cap fa-3x text-muted mb-3"></i>

                  <p className="text-muted">No courses available at the moment.</p>

                </div>

              ) : (

                <Row className="g-4">

                  {courses.map((course, index) => (

                    <Col key={course._id}>

                      <Card className="shadow border-0 h-100 course-card">

                        <Card.Body className="d-flex flex-column">

                          <div className="mb-3">

                            <div className="text-center mb-3">

                              <i className="fas fa-graduation-cap fa-2x text-primary"></i>

                            </div>

                            <Card.Title className="text-dark fw-bold text-center mb-3">

                              {course.title}

                            </Card.Title>

                            <Card.Text className="text-secondary text-center mb-3">

                              {course.description || "No description available"}

                            </Card.Text>



                            <div className="course-meta">

                              <div className="d-flex justify-content-between align-items-center mb-2">

                                <small className="text-muted">

                                  <i className="fas fa-clock me-1"></i>

                                  {course.duration || "Self-paced"}

                                </small>

                                <Badge bg="info" className="ms-2">

                                  <i className="fas fa-play-circle me-1"></i>

                                  {course.relevantVideoLinks?.length || 0} Videos

                                </Badge>

                              </div>



                              {course.departments && course.departments.length > 0 && (

                                <div className="mb-2">

                                  <small className="text-muted d-block mb-1">

                                    <i className="fas fa-building me-1"></i>

                                    Departments:

                                  </small>

                                  <div className="d-flex flex-wrap gap-1">

                                    {course.departments.slice(0, 2).map((dept, idx) => (

                                      <Badge key={idx} bg="outline-primary" className="text-primary border">

                                        {dept}

                                      </Badge>

                                    ))}

                                    {course.departments.length > 2 && (

                                      <Badge bg="light" className="text-muted">

                                        +{course.departments.length - 2} more

                                      </Badge>

                                    )}

                                  </div>

                                </div>

                              )}

                            </div>

                          </div>



                          <div className="mt-auto">

                            <div className="resources-info mb-3">

                              <div className="d-flex justify-content-between">

                                <small className="text-muted">

                                  <i className="fas fa-file-pdf me-1 text-danger"></i>

                                  {course.relevantPdfs?.length || 0} PDFs

                                </small>

                                <small className="text-muted">

                                  <i className="fas fa-calendar me-1"></i>

                                  {new Date(course.createdAt).toLocaleDateString()}

                                </small>

                              </div>

                            </div>

                            <Button

                              variant="success"

                              className="w-100 fw-semibold"

                              style={{

                                background: "linear-gradient(135deg, #43e97b, #38f9d7)",

                                border: "none"

                              }}

                              onClick={() => handleViewCourse(course)}

                            >

                              <i className="fas fa-book-open me-2"></i>

                              View Course Details

                            </Button>

                          </div>

                        </Card.Body>

                      </Card>

                    </Col>

                  ))}

                </Row>

              )}

            </div>

          </Tab>



          {/* Other tabs remain unchanged */}

          <Tab eventKey="aptitudes" title={

            <span>

              <i className="fas fa-brain me-2"></i>

              Aptitude ({aptitudes.length})

            </span>

          }>

            <div className="py-3">

              <h4 className="mb-4 text-primary">Aptitude Questions</h4>

              {aptitudes.length === 0 ? (

                <div className="text-center py-5">

                  <i className="fas fa-brain fa-3x text-muted mb-3"></i>

                  <p className="text-muted">No aptitude questions available.</p>

                </div>

              ) : (

                <Row className="g-4">

                  {aptitudes.map((aptitude, index) => (

                    <Col key={aptitude._id} md={4} >

                      <Card className="shadow border-0 h-100 aptitude-card" style={{height:'250px'}}>

                        <Card.Body>

                          <Card.Title className="text-primary mb-3">

                            <i className="fas fa-puzzle-piece me-2"></i>

                            {aptitude.name}

                          </Card.Title>

                          <Card.Text className="text-dark mb-3">

                            {aptitude.description}

                          </Card.Text>

                          {aptitude.answer && (

                            <div className="bg-light p-3 rounded">

                              <small className="text-muted d-block mb-1">

                                <strong>Solution:</strong>

                              </small>

                              <p className="mb-0 text-dark">{aptitude.answer}</p>

                            </div>

                          )}

                          <div className="mt-3 pt-3 border-top">

                            <small className="text-muted">

                              <i className="fas fa-calendar me-1"></i>

                              Created: {new Date(aptitude.createdAt).toLocaleDateString()}

                            </small>

                          </div>

                        </Card.Body>

                      </Card>

                    </Col>

                  ))}

                </Row>

              )}

            </div>

          </Tab>



          <Tab eventKey="applications" title={

            <span>

              <i className="fas fa-file-alt me-2"></i>

              My Applications ({applications.length})

            </span>

          }>

            <div className="py-3">

              <h4 className="mb-4 text-primary">My Job Applications</h4>

              {applications.length === 0 ? (

                <div className="text-center py-5">

                  <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>

                  <p className="text-muted">You haven't applied to any jobs yet.</p>

                  <Button

                    variant="primary"

                    onClick={() => navigate('/placement')}

                  >

                    Browse Jobs

                  </Button>

                </div>

              ) : (

                <Row className="g-4">

                  {applications.map((application, index) => (

                    <Col key={application._id} md={4}>

                      <Card className="shadow border-0 application-card" style={{height:'250px'}}>

                        <Card.Body>

                          <Row className="align-items-center">

                            <Col md={8}>

                              <h5 className="text-dark mb-1">{application.job?.title}</h5>

                              <p className="text-muted mb-2">

                                <i className="fas fa-building me-2"></i>

                                {application.job?.company} •

                                <i className="fas fa-map-marker-alt ms-2 me-1"></i>

                                {application.job?.location}

                              </p>

                              {application.job?.salary && (

                                <Badge bg="success" className="me-2">

                                  <i className="fas fa-rupee-sign me-1"></i>

                                  {application.job.salary}

                                </Badge>

                              )}

                              <Badge bg={

                                application.status === 'applied' ? 'primary' :

                                  application.status === 'shortlisted' ? 'warning' :

                                    application.status === 'rejected' ? 'danger' : 'success'

                              }>

                                {application.status}

                              </Badge>

                            </Col>

                            <Col md={4} className="text-end">

                              <small className="text-muted d-block">

                                Applied: {new Date(application.appliedAt).toLocaleDateString()}

                              </small>

                              {application.status === 'shortlisted' && (

                                <Badge bg="warning" className="mt-1">

                                  Under Review

                                </Badge>

                              )}

                            </Col>

                          </Row>

                        </Card.Body>

                      </Card>

                    </Col>

                  ))}

                </Row>

              )}

            </div>

          </Tab>



          <Tab eventKey="interviews" title={

            <span>

              <i className="fas fa-calendar-check me-2"></i>

              Interviews ({interviews.length})

            </span>

          }>

            <div className="py-3">

              <h4 className="mb-4 text-primary">My Scheduled Interviews</h4>

              {interviews.length === 0 ? (

                <div className="text-center py-5">

                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>

                  <p className="text-muted">No interviews scheduled yet.</p>

                </div>

              ) : (

                <Row className="g-4">

                  {interviews.map((interview, index) => (

                    <Col key={index}>

                      <Card className={`shadow border-0 interview-card ${interview.status === 'scheduled' ? 'border-warning' :

                          interview.status === 'completed' ? 'border-success' : 'border-primary'

                        }`}>

                        <Card.Body>

                          <div className="d-flex justify-content-between align-items-start mb-3">

                            <h5 className="text-dark mb-0">{interview.jobTitle}</h5>

                            <Badge bg={

                              interview.status === 'scheduled' ? 'warning' :

                                interview.status === 'completed' ? 'success' : 'primary'

                            }>

                              {interview.status}

                            </Badge>

                          </div>



                          <ListGroup variant="flush" className="mb-3">

                            <ListGroup.Item className="px-0">

                              <i className="fas fa-building me-2 text-muted"></i>

                              <strong>Company:</strong> {interview.company}

                            </ListGroup.Item>

                            <ListGroup.Item className="px-0">

                              <i className="fas fa-user-tie me-2 text-muted"></i>

                              <strong>Recruiter:</strong> {interview.recruiterName}

                            </ListGroup.Item>

                            <ListGroup.Item className="px-0">

                              <i className="fas fa-calendar me-2 text-muted"></i>

                              <strong>Date:</strong> {interview.interviewDate}

                            </ListGroup.Item>

                            <ListGroup.Item className="px-0">

                              <i className="fas fa-clock me-2 text-muted"></i>

                              <strong>Time:</strong> {interview.interviewTime}

                            </ListGroup.Item>

                            <ListGroup.Item className="px-0">

                              <i className="fas fa-video me-2 text-muted"></i>

                              <strong>Mode:</strong> {interview.mode}

                            </ListGroup.Item>

                          </ListGroup>



                          {interview.mode === 'offline' && interview.location && (

                            <div className="bg-light p-2 rounded mb-3">

                              <i className="fas fa-map-marker-alt me-2 text-primary"></i>

                              <small>{interview.location}</small>

                            </div>

                          )}

                        </Card.Body>

                      </Card>

                    </Col>

                  ))}

                </Row>

              )}

            </div>

          </Tab>

        </Tabs>

      </Container>



      {/* Course Details Modal */}

      <Modal

        show={showCourseModal}

        onHide={handleCloseModal}

        size="lg"

        centered

        className="course-details-modal"

      >

        <Modal.Header closeButton className="bg-primary text-white">

          <Modal.Title>

            <i className="fas fa-graduation-cap me-2"></i>

            {selectedCourse?.title}

          </Modal.Title>

        </Modal.Header>

        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>

          {selectedCourse && (

            <div>

              {/* Course Overview */}

              <div className="text-center mb-4">

                <i className="fas fa-graduation-cap fa-3x text-primary mb-3"></i>

                <p className="lead text-muted">{selectedCourse.description}</p>

              </div>



              <BootstrapTabs

                activeKey={modalActiveTab}

                onSelect={(tab) => setModalActiveTab(tab)}

                className="mb-3"

              >

                <BootstrapTab eventKey="overview" title="Overview">

                  <div className="p-3">

                    <h6 className="text-primary mb-3">Course Details</h6>

                    <ListGroup variant="flush">

                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">

                        <span className="text-muted">

                          <i className="fas fa-clock me-2"></i>

                          Duration

                        </span>

                        <Badge bg="primary">{selectedCourse.duration || "Self-paced"}</Badge>

                      </ListGroup.Item>

                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">

                        <span className="text-muted">

                          <i className="fas fa-video me-2"></i>

                          Videos

                        </span>

                        <Badge bg="success">{selectedCourse.relevantVideoLinks?.length || 0}</Badge>

                      </ListGroup.Item>

                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">

                        <span className="text-muted">

                          <i className="fas fa-file-pdf me-2"></i>

                          PDF Materials

                        </span>

                        <Badge bg="info">{selectedCourse.relevantPdfs?.length || 0}</Badge>

                      </ListGroup.Item>

                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">

                        <span className="text-muted">

                          <i className="fas fa-calendar me-2"></i>

                          Created Date

                        </span>

                        <small>{new Date(selectedCourse.createdAt).toLocaleDateString()}</small>

                      </ListGroup.Item>

                    </ListGroup>



                    {selectedCourse.departments && selectedCourse.departments.length > 0 && (

                      <div className="mt-4">

                        <h6 className="text-primary mb-2">

                          <i className="fas fa-building me-2"></i>

                          Related Departments

                        </h6>

                        <div className="d-flex flex-wrap gap-2">

                          {selectedCourse.departments.map((dept, index) => (

                            <Badge key={index} bg="outline-primary" className="text-primary border">

                              {dept}

                            </Badge>

                          ))}

                        </div>

                      </div>

                    )}

                  </div>

                </BootstrapTab>



                {/* Videos Tab - DIRECT LINKS */}

                <BootstrapTab eventKey="videos" title={`Videos (${selectedCourse.relevantVideoLinks?.length || 0})`}>

                  <div className="p-3">

                    {selectedCourse.relevantVideoLinks && selectedCourse.relevantVideoLinks.length > 0 ? (

                      <ListGroup variant="flush">

                        {selectedCourse.relevantVideoLinks.map((video, index) => {

                          // Handle both string and object formats

                          const videoUrl = typeof video === 'string' ? video : (video.url || video.link || video);

                          const videoTitle = (typeof video === 'object' && video.title) ? video.title : `Video ${index + 1}`;



                          return (

                            <ListGroup.Item key={index} className="px-0 py-3">

                              <div className="d-flex align-items-center justify-content-between">

                                <div className="d-flex align-items-center">

                                  <i className="fas fa-play-circle text-primary fa-lg me-3"></i>

                                  <div>

                                    <h6 className="mb-1 text-primary" style={{ cursor: 'pointer' }}

                                      onClick={() => window.open(videoUrl, '_blank')}>

                                      {videoTitle}

                                    </h6>

                                    <small className="text-muted d-block">{videoUrl}</small>

                                  </div>

                                </div>

                                <Button

                                  variant="primary"

                                  size="sm"

                                  onClick={() => window.open(videoUrl, '_blank')}

                                  className="ms-3"

                                >

                                  <i className="fas fa-external-link-alt me-1"></i>

                                  Open Video

                                </Button>

                              </div>

                            </ListGroup.Item>

                          );

                        })}

                      </ListGroup>

                    ) : (

                      <div className="text-center py-4">

                        <i className="fas fa-video fa-2x text-muted mb-3"></i>

                        <p className="text-muted">No videos available for this course.</p>

                      </div>

                    )}

                  </div>

                </BootstrapTab>



                {/* PDFs Tab - DIRECT LINKS */}

                <BootstrapTab eventKey="pdfs" title={`PDFs (${selectedCourse.relevantPdfs?.length || 0})`}>

                  <div className="p-3">

                    {selectedCourse.relevantPdfs && selectedCourse.relevantPdfs.length > 0 ? (

                      <ListGroup variant="flush">

                        {selectedCourse.relevantPdfs.map((pdf, index) => {

                          const pdfUrl = pdf.fileUrl || pdf.url || pdf.link || (typeof pdf === "string" ? pdf : "");

                          const pdfTitle = pdf.fileName || pdf.title || `PDF ${index + 1}`;



                          return (

                            <ListGroup.Item key={index} className="px-0 py-3">

                              <div className="d-flex align-items-center justify-content-between">

                                <div className="d-flex align-items-center">

                                  <i className="fas fa-file-pdf text-danger fa-lg me-3"></i>

                                  <div>

                                    <h6

                                      className="mb-1 text-danger"

                                      style={{ cursor: "pointer" }}

                                      onClick={() => window.open(pdfUrl, "_blank")}

                                    >

                                      {pdfTitle}

                                    </h6>

                                    {pdfUrl && (

                                      <small className="text-muted d-block">

                                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">

                                          {pdfUrl}

                                        </a>

                                      </small>

                                    )}

                                  </div>

                                </div>

                                <Button

                                  variant="danger"

                                  size="sm"

                                  onClick={() => window.open(pdfUrl, "_blank")}

                                  className="ms-3"

                                >

                                  <i className="fas fa-download me-1"></i>

                                  Open PDF

                                </Button>

                              </div>

                            </ListGroup.Item>

                          );

                        })}

                      </ListGroup>

                    ) : (

                      <div className="text-center py-4">

                        <i className="fas fa-file-pdf fa-2x text-muted mb-3"></i>

                        <p className="text-muted">No PDF materials available for this course.</p>

                      </div>

                    )}



                  </div>

                </BootstrapTab>

              </BootstrapTabs>

            </div>

          )}

        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={handleCloseModal}>

            Close

          </Button>

        </Modal.Footer>

      </Modal>





    </div>

  );

};



export default StudentDashboard;