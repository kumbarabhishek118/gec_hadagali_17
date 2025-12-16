import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Carousel,
  Card,
  Modal,
  Form,
  Badge,
  Alert,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import styles from "./Alumni.module.css";

const Alumni = () => {
  // ---------------- States ----------------
  const [showLogin, setShowLogin] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    batch: "",
    college: "",
    image: null
  });

  const [alumniMemories, setAlumniMemories] = useState([]);
  const [myMemories, setMyMemories] = useState([]);

  // ---------------- Static Carousel Data ----------------
  const staticAlumni = [
    {
      img: "images/Gemini_Generated_Image_9eamhv9eamhv9eam.png",
      name: "Punith Sharma",
      desc: "Software Engineer at Infosys, CSE Department, 2020 Batch.",
      company: "Infosys",
      role: "Software Engineer",
      batch: "2020"
    },
    {
      img: "images/WhatsApp Image 2025-10-08 at 11.48.04_eda511ce (1).jpg",
      name: "Rahul Mehta",
      desc: "Senior Developer at TCS, ECE Department, 2019 Batch.",
      company: "TCS",
      role: "Senior Developer",
      batch: "2019"
    },
    {
      img: "images/shared image.jpg",
      name: "Tushar Verma",
      desc: "Civil Engineer at L&T, Civil Department, 2021 Batch.",
      company: "L&T",
      role: "Civil Engineer",
      batch: "2021"
    },
    {
      img: "images/home_college_1.jpg",
      name: "Rohit Kumar",
      desc: "Mechanical Engineer at Hyundai, Mech Department, 2020 Batch.",
      company: "Hyundai",
      role: "Mechanical Engineer",
      batch: "2020"
    },
  ];

  // ---------------- Check Authentication on Component Mount ----------------
  useEffect(() => {
    checkAuthentication();
    fetchAlumniMemories();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setLoggedInUser(user);
        setUserRole(user.role);
        
        if (user.role === "student") {
          fetchMyMemories();
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
  };

  const showAlertMessage = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setLoggedInUser(null);
    setUserRole(null);
    setMyMemories([]);
    setAlumniMemories([]);
  };

  // ---------------- API Calls ----------------
  const fetchAlumniMemories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/student/all");
      setAlumniMemories(response.data.memories || []);
    } catch (error) {
      console.error("Error fetching alumni memories:", error);
      showAlertMessage("Error fetching alumni stories", "danger");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAlumniMemories();
  }, []); 

  const fetchMyMemories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlertMessage("Please login to view your memories", "warning");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/student/my", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setMyMemories(response.data.memories || []);
    } catch (error) {
      console.error("Error fetching my memories:", error);
      if (error.response?.status === 401) {
        showAlertMessage("Session expired. Please login again.", "warning");
        logout();
      }
    }
  };

  const createAlumniMemory = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      "http://localhost:5000/api/student/createAlumni",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  };

  const deleteAlumniMemory = async (memoryId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.delete(
      `http://localhost:5000/api/student/${memoryId}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  };

  // ---------------- Handlers ----------------
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const loginResponse = await axios.post(
        "http://localhost:5000/api/auth/login", 
        {
          email: loginData.email,
          password: loginData.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const { token, user } = loginResponse.data;
      
      if (!token || !user) {
        throw new Error("Invalid response from server");
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(user));
      
      setLoggedInUser(user);
      setUserRole(user.role);
      setShowLogin(false);
      setLoginData({ email: "", password: "" });
      
      showAlertMessage(`Welcome ${user.name}!`, "success");
      
      if (user.role === "student") {
        fetchMyMemories();
      }
      fetchAlumniMemories();
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Invalid email or password!";
      showAlertMessage(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    if (!loggedInUser || userRole !== "alumini") {
      showAlertMessage("Only students can create alumni stories. Please login as a student.", "warning");
      return;
    }

    if (!postData.title || !postData.description || !postData.batch || !postData.college) {
      showAlertMessage("Please fill all required fields", "warning");
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("description", postData.description);
      formData.append("batch", postData.batch);
      formData.append("college", postData.college);
      
      if (postData.image) {
        formData.append("image", postData.image);
      }

      const response = await createAlumniMemory(formData);
      
      showAlertMessage("Alumni story created successfully!", "success");
      
      setPostData({ 
        title: "", 
        description: "", 
        batch: "", 
        college: "", 
        image: null 
      });
      setShowPostModal(false);
      
      await fetchAlumniMemories();
      await fetchMyMemories();
      
    } catch (error) {
      console.error("Error creating alumni story:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error creating alumni story";
      showAlertMessage(errorMessage, "danger");
      
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) {
      return;
    }

    try {
      await deleteAlumniMemory(memoryId);
      showAlertMessage("Memory deleted successfully!", "success");
      
      fetchAlumniMemories();
      if (userRole === "student") {
        fetchMyMemories();
      }
    } catch (error) {
      console.error("Error deleting memory:", error);
      const errorMessage = error.response?.data?.message || "Error deleting memory";
      showAlertMessage(errorMessage, "danger");
      
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleLogout = () => {
    logout();
    showAlertMessage("Logged out successfully!", "success");
  };

  // ---------------- Render Logic ----------------
  const canCreateStory = loggedInUser && userRole === "Alumini";
  const canDeleteStory = loggedInUser && (userRole === "admin" || userRole === "student");

  return (
    <div className={styles.container}>
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className={`mb-0 text-center ${styles.alertCustom}`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle' : alert.type === 'danger' ? 'bi-exclamation-triangle' : 'bi-info-circle'} me-2`}></i>
          {alert.message}
        </Alert>
      )}

      {/* Enhanced Header */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
       <Container>
  <div className={`${styles.heroContent} text-center text-white mx-auto`}>
    <div className={styles.heroIcon}>
      <i className="bi bi-mortarboard"></i>
    </div>
    <h1 className={styles.heroTitle}>Alumni Network</h1>
    <p className={styles.heroSubtitle}>
      Connecting generations of achievers. Share your journey and inspire the next wave of talent.
    </p>
    
    {/* Floating Login Button - Only shown when not logged in */}
    {!loggedInUser && (
      <div className={styles.floatingLoginContainer}>
        <Button
          variant="light"
          className={`${styles.floatingLoginBtn} ${styles.btnGlow}`}
          onClick={() => setShowLogin(true)}
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <i className="bi bi-box-arrow-in-right"></i>
          )}
          <span className={styles.floatingBtnText}>
            {loading ? "Signing In..." : "Alumni Login"}
          </span>
        </Button>
      </div>
    )}

    {/* Welcome Section - Shown when logged in */}
    {loggedInUser && (
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeBadge}>
          <h4 className={styles.welcomeText}>
            Welcome {userRole === "admin" ? "Admin" : "back"}, {loggedInUser.name}! 🎓
            <Badge bg={userRole === "admin" ? "danger" : "primary"} className={`ms-2 ${styles.roleBadge}`}>
              {userRole}
            </Badge>
          </h4>
        </div>
        <div className="mt-3">
          {canCreateStory && (
            <Button 
              variant="light" 
              className={`me-3 ${styles.btnGlow}`}
              onClick={() => setShowPostModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Share Your Story
            </Button>
          )}
          <Button variant="outline-light" className={styles.btnGlow} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Button>
        </div>
      </div>
    )}
  </div>
</Container>
      </div>

      {/* My Memories Section - Only for Students */}
      {userRole === "student" && myMemories.length > 0 && (
        <Container className="my-5">
          <div className={`${styles.sectionHeader} text-center mb-5`}>
            <div className={styles.sectionIcon}>
              <i className="bi bi-journal-bookmark"></i>
            </div>
            <h2 className={styles.sectionTitle}>My Alumni Stories</h2>
            <p className={styles.sectionSubtitle}>Stories you've shared with the community</p>
          </div>
          
          <Row className="g-4">
            {myMemories.map((memory) => (
              <Col key={memory._id}  className="mb-4">
                <Card className={`${styles.alumniStoryCard} h-100`}>
                  <div className={styles.cardImageContainer}>
                    <Card.Img 
                      variant="top" 
                      src={memory.imageUrl || "https://via.placeholder.com/400x250/667eea/ffffff?text=Alumni+Story"} 
                      className={styles.storyImage}
                    />
                    <div className={styles.storyDate}>
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </div>
                    {canDeleteStory && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteMemory(memory._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className={styles.storyHeader}>
                      <Card.Title className={styles.storyTitle}>{memory.title}</Card.Title>
                      <div className={styles.storyMeta}>
                        <Badge bg="primary" className={styles.batchBadge}>
                          <i className="bi bi-calendar-week me-1"></i>
                          Batch {memory.batch}
                        </Badge>
                        <Badge bg="secondary" className={styles.collegeBadge}>
                          <i className="bi bi-building me-1"></i>
                          {memory.college}
                        </Badge>
                      </div>
                    </div>
                    <Card.Text className={`${styles.storyText} flex-grow-1`}>
                      {memory.description.length > 120 
                        ? `${memory.description.substring(0, 120)}...` 
                        : memory.description
                      }
                    </Card.Text>
                    <div className={styles.storyFooter}>
                      {memory.createdBy && (
                        <div className={styles.authorInfo}>
                          <div className={styles.authorAvatar}>
                            <i className="bi bi-person-circle"></i>
                          </div>
                          <div className={styles.authorDetails}>
                            <span className={styles.authorName}>{memory.createdBy.name}</span>
                            <span className={styles.authorRole}>Alumni</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* Alumni Memories from API */}
      <Container fluid className={`${styles.alumniStoriesSection} my-5`}>
        <div className={`${styles.sectionHeader} text-center mb-5`}>
          <div className={styles.sectionIcon}>
            <i className="bi bi-stars"></i>
          </div>
          <h2 className={styles.sectionTitle}>
            {userRole === "student" ? "All Alumni Success Stories" : "Alumni Success Stories"}
          </h2>
          <p className={styles.sectionSubtitle}>Inspiring journeys from our alumni community</p>
        </div>
        
        {loading ? (
          <div className={`${styles.loadingContainer} text-center`}>
            <div className={styles.spinnerContainer}>
              <Spinner animation="border" variant="primary" className={styles.largeSpinner} />
            </div>
            <p className={`mt-3 ${styles.loadingText}`}>Loading inspiring stories...</p>
          </div>
        ) : alumniMemories.length > 0 ? (
          <Row className="g-4">
            {alumniMemories.map((memory) => (
              <Col key={memory._id} md={4}  className="mb-4">
                <Card className={`${styles.alumniStoryCard} h-100`}>
                  <div className={styles.cardImageContainer}>
                    <Card.Img 
                      variant="top" 
                      src={memory.imageUrl || "https://via.placeholder.com/400x250/667eea/ffffff?text=Alumni+Story"} 
                      className={styles.storyImage}
                    />
                    <div className={styles.storyDate}>
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </div>
                    {canDeleteStory && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteMemory(memory._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className={styles.storyHeader}>
                      <Card.Title className={styles.storyTitle}>{memory.title}</Card.Title>
                      <div className={styles.storyMeta}>
                        <Badge bg="primary" className={styles.batchBadge}>
                          <i className="bi bi-calendar-week me-1"></i>
                          Batch {memory.batch}
                        </Badge>
                        <Badge bg="secondary" className={styles.collegeBadge}>
                          <i className="bi bi-building me-1"></i>
                          {memory.college}
                        </Badge>
                      </div>
                    </div>
                    <Card.Text className={`${styles.storyText} flex-grow-1`}>
                      {memory.description.length > 120 
                        ? `${memory.description.substring(0, 120)}...` 
                        : memory.description
                      }
                    </Card.Text>
                    <div className={styles.storyFooter}>
                      {memory.createdBy && (
                        <div className={styles.authorInfo}>
                          <div className={styles.authorAvatar}>
                            <i className="bi bi-person-circle"></i>
                          </div>
                          <div className={styles.authorDetails}>
                            <span className={styles.authorName}>{memory.createdBy.name}</span>
                            <span className={styles.authorRole}>Alumni</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className={`${styles.emptyState} text-center py-5`}>
            <div className={styles.emptyIcon}>
              <i className="bi bi-people"></i>
            </div>
            <h4 className="mt-3 text-muted">No alumni stories yet</h4>
            <p className="text-muted">Be the first to share your success story!</p>
            {!loggedInUser && (
              <Button variant="primary" className={styles.btnGlow} onClick={() => setShowLogin(true)}>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login to Share Your Story
              </Button>
            )}
          </div>
        )}
      </Container>

      {/* Featured Alumni Carousel */}
      <div className={styles.featuredAlumniSection}>
        <Container fluid className="my-5">
          <div className={`${styles.sectionHeader} text-center mb-5`}>
            <div className={styles.sectionIcon}>
              <i className="bi bi-award"></i>
            </div>
            <h2 className={styles.sectionTitle}>Featured Alumni</h2>
            <p className={styles.sectionSubtitle}>Success stories from our distinguished alumni community</p>
          </div>
          
          <Carousel interval={4000} pause={'hover'} indicators={true} controls={true} className={styles.featuredCarousel}>
            {staticAlumni.map((alum, index) => (
              <Carousel.Item key={index}>
                <div className={styles.featuredAlumniCard}>
                  <Row className="align-items-center">
                    <Col md={5} className="text-center">
                      <div className={styles.alumniImageContainer}>
                        <div className={styles.imageWrapper}>
                          <img
                            src={alum.img}
                            alt={alum.name}
                            className={styles.alumniFeaturedImg}
                          />
                          <div className={styles.floatingBadge}>
                            <i className="bi bi-award-fill"></i>
                          </div>
                        </div>
                        <div className={styles.alumniBatchBadge}>
                          Batch {alum.batch}
                        </div>
                      </div>
                    </Col>
                    <Col md={7}>
                      <div className={styles.alumniInfo}>
                        <Badge bg="primary" className={styles.companyBadge}>
                          <i className="bi bi-building me-1"></i>
                          {alum.company}
                        </Badge>
                        <h3 className={styles.alumniName}>{alum.name}</h3>
                        <h5 className={styles.alumniRole}>
                          <i className="bi bi-briefcase me-2"></i>
                          {alum.role}
                        </h5>
                        <p className={styles.alumniDesc}>{alum.desc}</p>
                        <div className={styles.alumniAchievements}>
                          <span className={styles.achievementTag}>
                            <i className="bi bi-award me-1"></i>
                            Top Performer
                          </span>
                          <span className={styles.achievementTag}>
                            <i className="bi bi-people me-1"></i>
                            Mentor
                          </span>
                          <span className={styles.achievementTag}>
                            <i className="bi bi-star me-1"></i>
                            Industry Expert
                          </span>
                        </div>
                        <div className={styles.alumniCta}>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <i className="bi bi-linkedin me-1"></i>
                            Connect
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <i className="bi bi-envelope me-1"></i>
                            Message
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div>

      {/* Alumni Team Section */}
      <div className={styles.teamSectionBg}>
        <Container fluid className="py-5">
          <div className={`${styles.sectionHeader} text-center mb-5`}>
            <div className={styles.sectionIcon}>
              <i className="bi bi-person-gear"></i>
            </div>
            <h2 className={styles.sectionTitle}>Alumni Relations Team</h2>
            <p className={styles.sectionSubtitle}>
              Dedicated professionals working to strengthen our alumni community
            </p>
          </div>
          
          <Row className="g-4 justify-content-center">
            <Col className="mb-4" md={4}>
              <Card className={`${styles.teamCard} text-center h-100`}>
                <div className={styles.teamImgContainer}>
                  <Card.Img 
                    src="images/about_1.jpg" 
                    className={styles.teamImage}
                  />
                  <div className={styles.teamSocial}>
                    <Button variant="light" size="sm" className={styles.socialBtn}>
                      <i className="bi bi-linkedin"></i>
                    </Button>
                    <Button variant="light" size="sm" className={styles.socialBtn}>
                      <i className="bi bi-envelope"></i>
                    </Button>
                  </div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className={styles.teamName}>Dr. Neha Kapoor</Card.Title>
                  <Card.Text className={styles.teamRole}>Alumni Relations Head</Card.Text>
                  <div className="mt-auto">
                    <Badge bg="primary" className={styles.roleBadge}>
                      <i className="bi bi-telephone me-1"></i>
                      +91 9876543210
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}  className="mb-4">
              <Card className={`${styles.teamCard} text-center h-100`}>
                <div className={styles.teamImgContainer}>
                  <Card.Img 
                    src="images/about_2.jpg" 
                    className={styles.teamImage}
                  />
                  <div className={styles.teamSocial}>
                    <Button variant="light" size="sm" className={styles.socialBtn}>
                      <i className="bi bi-linkedin"></i>
                    </Button>
                    <Button variant="light" size="sm" className={styles.socialBtn}>
                      <i className="bi bi-envelope"></i>
                    </Button>
                  </div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className={styles.teamName}>Vikas Sharma</Card.Title>
                  <Card.Text className={styles.teamRole}>Event Coordinator</Card.Text>
                  <div className="mt-auto">
                    <Badge bg="success" className={styles.roleBadge}>
                      <i className="bi bi-telephone me-1"></i>
                      +91 9876543211
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Enhanced Post Modal */}
      <Modal show={showPostModal} onHide={() => setShowPostModal(false)}   scrollable centered size="lg" className={styles.postModal}>
        <Modal.Header closeButton className={styles.modalHeaderCustom}>
          <Modal.Title className="w-100 text-center">
            <div className={styles.modalIcon}>
              <i className="bi bi-pencil-square"></i>
            </div>
            Share Your Success Story
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBodyCustom}>
          {!canCreateStory ? (
            <div className={`${styles.accessDenied} text-center py-4`}>
              <i className="bi bi-exclamation-triangle display-4 text-warning"></i>
              <h5 className="mt-3">Access Denied</h5>
              <p>Only students can create alumni stories.</p>
              <Button variant="primary" onClick={() => setShowPostModal(false)}>
                Close
              </Button>
            </div>
          ) : (
            <Form onSubmit={handlePostSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className={styles.formLabelCustom}>Story Title *</Form.Label>
                <Form.Control
                  name="title"
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  placeholder="Enter a captivating title for your story"
                  required
                  className={styles.modernInput}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className={styles.formLabelCustom}>Batch *</Form.Label>
                    <Form.Control
                      name="batch"
                      value={postData.batch}
                      onChange={(e) => setPostData({ ...postData, batch: e.target.value })}
                      placeholder="e.g., 2020"
                      required
                      className={styles.modernInput}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className={styles.formLabelCustom}>College/Department *</Form.Label>
                    <Form.Control
                      name="college"
                      value={postData.college}
                      onChange={(e) => setPostData({ ...postData, college: e.target.value })}
                      placeholder="e.g., Computer Science"
                      required
                      className={styles.modernInput}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className={styles.formLabelCustom}>
                  <i className="bi bi-image me-2"></i>
                  Upload Your Photo
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPostData({ ...postData, image: e.target.files[0] })}
                  className={`${styles.modernInput} ${styles.fileInput}`}
                />
                <Form.Text className="text-muted">
                  Showcase your journey with a professional photo (JPG, PNG, JPEG)
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className={styles.formLabelCustom}>
                  <i className="bi bi-chat-square-text me-2"></i>
                  Your Success Story *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={postData.description}
                  onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                  placeholder="Share your inspiring journey, career achievements, challenges overcome, and valuable advice for current students. Be the inspiration for the next generation!"
                  required
                  className={`${styles.modernInput} ${styles.storyTextarea}`}
                />
                <Form.Text className="text-muted">
                  Your story can inspire thousands of students. Share your authentic journey!
                </Form.Text>
              </Form.Group>

              <Button 
                variant="success" 
                type="submit" 
                className={`w-100 ${styles.postSubmitBtn} ${styles.btnGlow}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Publishing Your Inspiring Story...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Publish Your Success Story
                  </>
                )}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered className={styles.authModal}>
        <Modal.Header closeButton className={styles.modalHeaderCustom}>
          <Modal.Title className="w-100 text-center">
            <div className={styles.modalIcon}>
              <i className="bi bi-box-arrow-in-right"></i>
            </div>
            Welcome Back, Alumni!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBodyCustom}>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className={styles.formLabelCustom}>
                <i className="bi bi-envelope me-2"></i>
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter your registered email"
                required
                className={styles.modernInput}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className={styles.formLabelCustom}>
                <i className="bi bi-lock me-2"></i>
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                required
                className={styles.modernInput}
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className={`w-100 ${styles.authBtn} ${styles.btnGlow}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-mortarboard me-2"></i>
                  Access Alumni Dashboard
                </>
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Alumni;