import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Row, Col, Tabs, Tab, Badge, Container, Alert, Spinner, ListGroup } from "react-bootstrap";
import axios from "axios";
import FloatingButton from "./FloatingButton";
import "./Placement.css";
import { useNavigate } from "react-router-dom";

const Placement = () => {
  // Auth
  const [showAuth, setShowAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Job Posting
  const [showJobForm, setShowJobForm] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [pendingJobApplication, setPendingJobApplication] = useState(null);
   
  
  const [errorMessage, setErrorMessage] = useState("");
 

  // Add appliedJobs state to track which jobs the user has applied for
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "Remote",
    salary: "",
    company: "",
    skillsRequired: "",
    departments: {
      cse: false,
      mech: false,
      civil: false,
      ece: false,
      all: false,
    },
  });

  const [scheduleForm, setScheduleForm] = useState({
    applicantId: "",
    jobId: "",
    scheduledDate: "",
    mode: "online",
    location: ""
  });

  // Jobs state
  const [jobs, setJobs] = useState([]);

  // Auth form state
  const [authForm, setAuthForm] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    role: "student" // Default to student for better UX
  });

  const [applyForm, setApplyForm] = useState({
   
    resume: null
  });

  // Show alert function
  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setCurrentUser(user);
      
      // If user is student, fetch their applications
      if (user.role === "student") {
        fetchStudentApplications(token);
      }
    }
    fetchJobs();
  }, []);

  // Fetch student applications
  const fetchStudentApplications = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/student/myApplications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const appliedJobIds = response.data.applications?.map(app => app.job?._id || app.job) || [];
      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // const handleApplyChange = (e) => {
  //   setApplyForm({ ...applyForm, [e.target.name]: e.target.value });
  // };
  

const handleFileChange = (e) => {
  const file = e.target.files[0];
  console.log("📄 File selected:", file);
  
  if (file) {
    console.log("📋 File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    if (file.type !== 'application/pdf') {
      showAlert("Please upload a PDF file only", "danger");
      e.target.value = '';
      return;
    }
    
    // Use functional update to ensure state is updated
    setApplyForm(prev => ({ ...prev, resume: file }));
    console.log("✅ File set in state");
  } else {
    console.log("❌ No file selected");
  }
};

const handleApplySubmit = async (e) => {
  e.preventDefault();
  console.log("✅ handleApplySubmit triggered");

  if (!applyForm.resume) {
    console.log("❌ No resume file selected");
    showAlert("Please select a PDF resume to upload.", "danger");
    return;
  }

  if (!applyJobId) {
    console.log("❌ No applyJobId:", applyJobId);
    showAlert("No job selected for application", "danger");
    return;
  }

  console.log("📁 File details:", {
    name: applyForm.resume.name,
    type: applyForm.resume.type,
    size: applyForm.resume.size
  });
  console.log("🎯 Job ID:", applyJobId);

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("resume", applyForm.resume);
    
    // Debug FormData
    console.log("📦 FormData created");
    for (let [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    const token = localStorage.getItem("token");
    console.log("🔑 Token exists:", !!token);
    if (token) {
      console.log("🔑 Token length:", token.length);
    }

    console.log("🚀 Making API call...");
    const response = await axios.post(
      `http://localhost:5000/api/student/applyJob/${applyJobId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ API Response:", response);
    showAlert("Job applied successfully!", "success");
    setShowApplyModal(false);
    setPendingJobApplication(null);

    // Reset apply form
    setApplyForm({
      resume: null
    });

    // Update applied jobs list
    setAppliedJobs(prev => [...prev, applyJobId]);

    // Update applied count on the job card
    setJobs((prev) =>
      prev.map((job) =>
        (job._id === applyJobId || job.jobId === applyJobId || job.id === applyJobId)
          ? { ...job, appliedCount: (job.appliedCount || 0) + 1 }
          : job
      )
    );
  } catch (error) {
    console.error("❌ Apply error:", error);
    console.error("❌ Error response:", error.response);
    showAlert(error.response?.data?.message || "Failed to apply", "danger");
  } finally {
    setLoading(false);
    console.log("🏁 Loading set to false");
  }
};


  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const user = JSON.parse(userData);

        if (user.role === "recruiter") {
          // Fetch only recruiter's posted jobs with applicants
          const response = await axios.get("http://localhost:5000/api/recruiter/jobs/applicants", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const recruiterJobs = response.data.jobs || [];
          setJobs(recruiterJobs);

        } else {
          // For students and non-logged in users, fetch all jobs
          const response = await axios.get("http://localhost:5000/api/recruiter/getAllJobs");
          setJobs(response.data || []);

          // Also fetch user's applications if logged in as student
          if (user.role === "student") {
            await fetchStudentApplications(token);
          }
        }
      } else {
        // For non-logged in users, fetch all jobs
        const response = await axios.get("http://localhost:5000/api/recruiter/getAllJobs");
        setJobs(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      showAlert("Failed to load jobs", "danger");
      const savedJobs = localStorage.getItem('placementJobs');
      if (savedJobs) {
        setJobs(JSON.parse(savedJobs));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle auth form changes
  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  // Handle login/signup
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";

      const payload = isSignup
        ? authForm
        : {
            email: authForm.email,
            password: authForm.password,
          };

      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload
      );

      // Signup success
      if (isSignup && response.data.message) {
        showAlert("Account created successfully! Please login.", "success");
        setShowAuth(false);
        
        setAuthForm({
          userId: "",
          name: "",
          email: "",
          password: "",
          role: "student"
        });

        setTimeout(() => {
          setIsSignup(false);
          setShowAuth(true);
        }, 800);
        return;
      }

      // Login success
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setIsLoggedIn(true);
        setCurrentUser(response.data.user);
        setShowAuth(false);

        showAlert(`Welcome ${response.data.user.name}!`, "success");

        // Check if we need to show apply modal after student login
        if (response.data.user.role === "student" && pendingJobApplication) {
          setApplyJobId(pendingJobApplication);
          setShowApplyModal(true);
        }

        if (response.data.user.role === "recruiter") {
          setShowJobForm(true);
        }

        fetchJobs();
      }

    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage =
        error.response?.data?.message ||
        (isSignup ? "Failed to create account" : "Login failed");
      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAppliedJobs([]);
    setPendingJobApplication(null);
    showAlert("Logged out successfully", "info");
    fetchJobs();
  };

  // Handle job form changes
  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };

  const handleDeptChange = (e) => {
    const { name, checked } = e.target;
    if (name === "all") {
      setJobForm({
        ...jobForm,
        departments: {
          cse: checked,
          mech: checked,
          civil: checked,
          ece: checked,
          all: checked,
        },
      });
    } else {
      setJobForm({
        ...jobForm,
        departments: { ...jobForm.departments, [name]: checked, all: false },
      });
    }
  };

  // Handle schedule form changes
  const handleScheduleChange = (e) => {
    setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value });
  };

  // Handle job posting
  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const selectedDepartments = Object.keys(jobForm.departments).filter(
        (d) => jobForm.departments[d] && d !== "all"
      );

      const jobData = {
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        salary: jobForm.salary,
        company: currentUser?.name || "Tech Corp",
        skillsRequired: jobForm.skillsRequired.split(',').map(skill => skill.trim()),
        departments: jobForm.departments.all ? ["all"] : selectedDepartments,
      };

      const response = await axios.post(
        "http://localhost:5000/api/recruiter/createJob",
        jobData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchJobs();

      setJobForm({
        title: "",
        description: "",
        location: "Remote",
        salary: "",
        company: "",
        skillsRequired: "",
        departments: {
          cse: false,
          mech: false,
          civil: false,
          ece: false,
          all: false,
        },
      });

      setShowJobForm(false);
      showAlert("Job posted successfully!", "success");
    } catch (error) {
      console.error("Error posting job:", error);
      const errorMessage = error.response?.data?.message || "Failed to post job";
      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  // Fetch applicants for a job
  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (currentUser?.role === "recruiter") {
        const job = jobs.find(j => (j._id || j.jobId) === jobId);
        if (job && job.applicants) {
          setApplicants(job.applicants);
          setShowApplicantsModal(true);
          return;
        }
      }

      const response = await axios.get(
        `http://localhost:5000/api/recruiter/job/${jobId}/applicants`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setApplicants(response.data.applicants || []);
      setShowApplicantsModal(true);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      showAlert(error.response?.data?.message || "Failed to fetch applicants", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Handle interview scheduling
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const scheduleData = {
        jobId: scheduleForm.jobId,
        applicantId: scheduleForm.applicantId,
        scheduledDate: scheduleForm.scheduledDate,
        mode: scheduleForm.mode,
        location: scheduleForm.mode === "online" ? "Online" : scheduleForm.location
      };

      const response = await axios.post(
        "http://localhost:5000/api/recruiter/schedule",
        scheduleData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showAlert("Interview scheduled successfully!", "success");
      setShowScheduleModal(false);
      setScheduleForm({
        applicantId: "",
        jobId: "",
        scheduledDate: "",
        mode: "online",
        location: ""
      });

      fetchJobs();

      if (selectedJob) {
        fetchApplicants(selectedJob._id || selectedJob.id);
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      showAlert(error.response?.data?.message || "Failed to schedule interview", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Open schedule modal for specific applicant
  const openScheduleModal = (job, applicantId) => {
    console.log("applicant Id",applicantId);
    console.log("job ",job);
    setSelectedJob(job);
    setScheduleForm({
      ...scheduleForm,
      applicantId: applicantId,
      jobId: job._id || job.jobId || job.id
    });
    setShowScheduleModal(true);
  };

  // Handle job application (for students)
  const handleApplyJob = (jobId) => {
    if (!isLoggedIn || currentUser?.role !== "student") {
      showAlert("Please login as student to apply for jobs", "warning");
      setPendingJobApplication(jobId);
      setApplyJobId(jobId);
      setIsSignup(false);
      setShowAuth(true);
      return;
    }

    setApplyJobId(jobId);
    setShowApplyModal(true);
  };

  // Check if user has applied for a specific job
  const hasApplied = (jobId) => {
    return appliedJobs.includes(jobId);
  };

  // Filter jobs by department
  const filterJobs = (dept) => {
    if (dept === "all") return jobs;

    return jobs.filter((job) => {
      const jobDepts = job.departments || [];
      return jobDepts.includes(dept) || jobDepts.includes("all");
    });
  };

  // Department colors for badges
  const deptColors = {
    cse: "primary",
    mech: "warning",
    civil: "success",
    ece: "info",
    all: "secondary"
  };

  return (
    <div className="placement-page">
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
      <div className="placement-hero bg-gradient-primary text-white py-5" style={{ marginTop: '80px' }}>
        <div className="container-fluid px-0">
          <div className="hero-content full-width-content text-center">
            <div className="container">
              <h1 className="hero-title mx-auto display-4 fw-bold mb-4">
                {currentUser?.role === "recruiter" ? "Manage Your Job Postings" : "Discover Your Dream Career"}
              </h1>
              <p className="hero-subtitle lead mb-4">
                {currentUser?.role === "recruiter"
                  ? "Manage your job postings, view applicants, and schedule interviews all in one place."
                  : "Connect with top companies and kickstart your professional journey. Explore exciting job opportunities tailored for engineering students across all disciplines."}
              </p>

              <div className="hero-stats d-flex justify-content-center mt-4 mx-auto">
                <div className="stat-item mx-4">
                  <h3 className="display-6 fw-bold">{jobs.length}+</h3>
                  <p className="mb-0">
                    {currentUser?.role === "recruiter" ? "Your Jobs" : "Active Jobs"}
                  </p>
                </div>
                {currentUser?.role === "recruiter" && (
                  <div className="stat-item mx-4">
                    <h3 className="display-6 fw-bold">
                      {jobs.reduce((total, job) => total + (job.applicantsCount || 0), 0)}+
                    </h3>
                    <p className="mb-0">Total Applicants</p>
                  </div>
                )}
                <div className="stat-item mx-4">
                  <h3 className="display-6 fw-bold">50+</h3>
                  <p className="mb-0">Partner Companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button for Recruiters */}
      {isLoggedIn && currentUser?.role === "recruiter" && (
        <div className="container-fluid px-4 mt-3">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        {!isLoggedIn ? (
          <FloatingButton
            onClick={() => {
              setIsSignup(false);
              setShowAuth(true);
            }}
            icon="bi bi-person-badge"
            text="Recruiter Login"
            variant="primary"
          />
        ) : currentUser?.role === "recruiter" && (
          <FloatingButton
            onClick={() => setShowJobForm(true)}
            icon="bi bi-plus-circle"
            text="Post Job"
            variant="success"
          />
        )}
      </div>

      {/* Apply Job Modal */}
      {/* Apply Job Modal */}
<Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Apply for Job</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

    <Form onSubmit={handleApplySubmit} encType="multipart/form-data">
      <Form.Group controlId="formResume">
        <Form.Label>Upload Resume (PDF)</Form.Label>
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <Form.Text className="text-muted">
          {applyForm.resume ? `Selected: ${applyForm.resume.name}` : "No file chosen"}
        </Form.Text>
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        className="mt-3 w-100"
        disabled={loading}
        onClick={() => console.log("🖱️ Submit button clicked")}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Submit Application"}
      </Button>
    </Form>
  </Modal.Body>
</Modal>

      {/* Auth Modal */}
      <Modal show={showAuth} onHide={() => setShowAuth(false)} centered className="auth-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <div className="modal-icon">
              <i className="bi bi-person-badge"></i>
            </div>
            {isSignup ? "Student Sign Up" : "Student Login"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <Form onSubmit={handleAuthSubmit}>
            {isSignup && (
              <>
                <Form.Group className="mb-3" controlId="userId">
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="userId"
                    placeholder="Enter your Student ID"
                    value={authForm.userId}
                    onChange={handleAuthChange}
                    required
                    className="form-control-modern"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={authForm.name}
                    onChange={handleAuthChange}
                    required
                    className="form-control-modern"
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={authForm.email}
                onChange={handleAuthChange}
                required
                className="form-control-modern"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={authForm.password}
                onChange={handleAuthChange}
                required
                className="form-control-modern"
              />
            </Form.Group>

            {isSignup && (
              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={authForm.role}
                  onChange={handleAuthChange}
                  className="form-control-modern"
                >
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            )}

            <Button
              type="submit"
              className="w-100 auth-btn"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isSignup ? "Creating Account..." : "Logging in..."}
                </>
              ) : (
                isSignup ? "Create Account" : "Login"
              )}
            </Button>

            <div className="text-center mt-3">
              {isSignup ? (
                <p className="auth-switch">
                  Already have an account?{" "}
                  <Button variant="link" onClick={() => setIsSignup(false)} className="p-0 ms-1">
                    Sign In
                  </Button>
                </p>
              ) : (
                <p className="auth-switch">
                  Don't have an account?{" "}
                  <Button variant="link" onClick={() => setIsSignup(true)} className="p-0 ms-1">
                    Sign Up
                  </Button>
                </p>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Job Posting Modal (Only for Recruiters) */}
      <Modal show={showJobForm} onHide={() => setShowJobForm(false)} centered size="lg" className="job-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <div className="modal-icon">
              <i className="bi bi-briefcase"></i>
            </div>
            Post a Job Opportunity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <Form onSubmit={handlePostJob}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="e.g., Frontend Developer, Data Analyst..."
                    value={jobForm.title}
                    onChange={handleJobChange}
                    required
                    className="form-control-modern"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="company">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    placeholder="Company name"
                    value={jobForm.company}
                    onChange={handleJobChange}
                    required
                    className="form-control-modern"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="e.g., Remote, Bangalore, etc."
                    value={jobForm.location}
                    onChange={handleJobChange}
                    required
                    className="form-control-modern"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="salary">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    type="text"
                    name="salary"
                    placeholder="e.g., ₹6-8 LPA, Negotiable, etc."
                    value={jobForm.salary}
                    onChange={handleJobChange}
                    className="form-control-modern"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Describe the role, requirements, and benefits..."
                value={jobForm.description}
                onChange={handleJobChange}
                required
                className="form-control-modern"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="skillsRequired">
              <Form.Label>Skills Required (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="skillsRequired"
                placeholder="e.g., JavaScript, React, Node.js, MongoDB"
                value={jobForm.skillsRequired}
                onChange={handleJobChange}
                className="form-control-modern"
                disabled={loading}
              />
            </Form.Group>

            <div className="dept-selection">
              <h6 className="section-title">Eligible Departments</h6>
              <div className="dept-checkboxes">
                {["cse", "mech", "civil", "ece", "all"].map((dept) => (
                  <div key={dept} className="dept-checkbox-item">
                    <Form.Check
                      type="checkbox"
                      label={
                        dept === "all" ? "All Departments" :
                          dept === "cse" ? "Computer Science" :
                            dept === "mech" ? "Mechanical Engineering" :
                              dept === "civil" ? "Civil Engineering" :
                                "Electronics & Communication"
                      }
                      name={dept}
                      checked={jobForm.departments[dept]}
                      onChange={handleDeptChange}
                      className="modern-checkbox"
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="success"
              type="submit"
              className="w-100 post-job-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Posting Job...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Publish Job Post
                </>
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Applicants Modal (Only for Recruiters) */}
    <Modal show={showApplicantsModal} onHide={() => setShowApplicantsModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>
      <i className="bi bi-people me-2"></i>
      Applicants for {selectedJob?.title}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {applicants.length === 0 ? (
      <div className="text-center py-4">
        <i className="bi bi-person-x fs-1 text-muted"></i>
        <p className="mt-3">No applicants yet</p>
      </div>
    ) : (
      <ListGroup variant="flush">
        {applicants.map((applicant, index) => (
          <ListGroup.Item key={index} className="applicant-item">
            <div className="d-flex justify-content-between align-items-start">
              <div className="applicant-info flex-grow-1">
                <h6 className="mb-1">{applicant.name}</h6>
                <p className="mb-1 text-muted">{applicant.email}</p>
                <small className="text-muted">User ID: {applicant.userId}</small>
                <br />
                <small className="text-muted">Applied: {new Date(applicant.appliedAt).toLocaleDateString()}</small>
                {console.log("applicant",applicants)}
                {console.log("selected job",selectedJob)}
                
                {/* Resume Link - Updated to match backend structure */}
                <div className="resume-link mt-2">
                  <small>
                    <strong>Resume: </strong>
                    {applicant.resume ? (
                      <span 
                        className="text-primary text-decoration-underline cursor-pointer"
                        onClick={() => window.open(applicant.resume, '_blank')}
                        style={{ cursor: 'pointer' }}
                        title="Click to open resume"
                      >
                        
                        {applicant.resume}
                      </span>
                    ) : (
                      <span className="text-muted">No resume uploaded</span>
                    )}
                  </small>
                </div>
                
                <Badge bg={applicant.status === "applied" ? "warning" : "success"} className="mt-2">
                  {applicant.status}
                </Badge>
              </div>
              <div>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => openScheduleModal(selectedJob, applicant._id)}
                >
                  Schedule Interview
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </Modal.Body>
</Modal>

      {/* Schedule Interview Modal (Only for Recruiters) */}
      <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleScheduleInterview}>
            <Form.Group className="mb-3">
              <Form.Label>Job ID</Form.Label>
              <Form.Control
                type="text"
                name="jobId"
                value={scheduleForm.jobId}
                onChange={handleScheduleChange}
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Applicant ID</Form.Label>
              <Form.Control
                type="text"
                name="applicantId"
                value={scheduleForm.applicantId}
                onChange={handleScheduleChange}
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Interview Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="scheduledDate"
                value={scheduleForm.scheduledDate}
                onChange={handleScheduleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Interview Mode</Form.Label>
              <Form.Select
                name="mode"
                value={scheduleForm.mode}
                onChange={handleScheduleChange}
                required
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </Form.Select>
            </Form.Group>

            {scheduleForm.mode === "offline" && (
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter interview location"
                  value={scheduleForm.location}
                  onChange={handleScheduleChange}
                  required={scheduleForm.mode === "offline"}
                />
              </Form.Group>
            )}

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Schedule Interview"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Job Listing Section */}
      <div className="jobs-section-fullwidth py-5">
        <Container fluid className="px-4">
          {loading && jobs.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 fs-5 text-muted">Loading career opportunities...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-section">
              <div className="section-header text-center mb-5">
                <h2 className="section-title display-5 fw-bold text-primary mb-3">
                  {currentUser?.role === "recruiter" ? "Your Job Postings" : "Available Positions"}
                </h2>
                <p className="section-subtitle lead text-muted">
                  {currentUser?.role === "recruiter"
                    ? `Manage your ${jobs.length} job postings and applicants`
                    : `Browse through ${jobs.length} exciting job opportunities from top companies`}
                </p>
              </div>

              <Tabs defaultActiveKey="all" className="custom-tabs mb-4 justify-content-center">
                <Tab eventKey="all" title={
                  <span className="d-flex align-items-center">
                    <i className="bi bi-grid me-2"></i>
                    All Jobs ({jobs.length})
                  </span>
                }>
                  <JobList
                    jobs={filterJobs("all")}
                    deptColors={deptColors}
                    isRecruiter={isLoggedIn && currentUser?.role === "recruiter"}
                    isStudent={isLoggedIn && currentUser?.role === "student"}
                    hasApplied={hasApplied}
                    onViewApplicants={(job) => {
                      setSelectedJob(job);
                      fetchApplicants(job._id || job.jobId || job.id);
                    }}
                    onApplyJob={handleApplyJob}
                    currentUserRole={currentUser?.role}
                  />
                </Tab>
                <Tab eventKey="cse" title={
                  <span className="d-flex align-items-center">
                    <i className="bi bi-laptop me-2"></i>
                    CSE ({filterJobs("cse").length})
                  </span>
                }>
                  <JobList
                    jobs={filterJobs("cse")}
                    deptColors={deptColors}
                    isRecruiter={isLoggedIn && currentUser?.role === "recruiter"}
                    isStudent={isLoggedIn && currentUser?.role === "student"}
                    hasApplied={hasApplied}
                    onViewApplicants={(job) => {
                      setSelectedJob(job);
                      fetchApplicants(job._id || job.jobId || job.id);
                    }}
                    onApplyJob={handleApplyJob}
                    currentUserRole={currentUser?.role}
                  />
                </Tab>
                <Tab eventKey="mech" title={
                  <span className="d-flex align-items-center">
                    <i className="bi bi-gear me-2"></i>
                    Mechanical ({filterJobs("mech").length})
                  </span>
                }>
                  <JobList
                    jobs={filterJobs("mech")}
                    deptColors={deptColors}
                    isRecruiter={isLoggedIn && currentUser?.role === "recruiter"}
                    isStudent={isLoggedIn && currentUser?.role === "student"}
                    hasApplied={hasApplied}
                    onViewApplicants={(job) => {
                      setSelectedJob(job);
                      fetchApplicants(job._id || job.jobId || job.id);
                    }}
                    onApplyJob={handleApplyJob}
                    currentUserRole={currentUser?.role}
                  />
                </Tab>
                <Tab eventKey="civil" title={
                  <span className="d-flex align-items-center">
                    <i className="bi bi-building me-2"></i>
                    Civil ({filterJobs("civil").length})
                  </span>
                }>
                  <JobList
                    jobs={filterJobs("civil")}
                    deptColors={deptColors}
                    isRecruiter={isLoggedIn && currentUser?.role === "recruiter"}
                    isStudent={isLoggedIn && currentUser?.role === "student"}
                    hasApplied={hasApplied}
                    onViewApplicants={(job) => {
                      setSelectedJob(job);
                      fetchApplicants(job._id || job.jobId || job.id);
                    }}
                    onApplyJob={handleApplyJob}
                    currentUserRole={currentUser?.role}
                  />
                </Tab>
                <Tab eventKey="ece" title={
                  <span className="d-flex align-items-center">
                    <i className="bi bi-cpu me-2"></i>
                    E & C ({filterJobs("ece").length})
                  </span>
                }>
                  <JobList
                    jobs={filterJobs("ece")}
                    deptColors={deptColors}
                    isRecruiter={isLoggedIn && currentUser?.role === "recruiter"}
                    isStudent={isLoggedIn && currentUser?.role === "student"}
                    hasApplied={hasApplied}
                    onViewApplicants={(job) => {
                      setSelectedJob(job);
                      fetchApplicants(job._id || job.jobId || job.id);
                    }}
                    onApplyJob={handleApplyJob}
                    currentUserRole={currentUser?.role}
                  />
                </Tab>
              </Tabs>
            </div>
          ) : (
            <div className="no-jobs text-center py-5">
              <div className="no-jobs-icon mb-4">
                <i className="bi bi-briefcase display-1 text-muted"></i>
              </div>
              <h3 className="text-dark mb-3">
                {currentUser?.role === "recruiter" ? "No Jobs Posted Yet" : "No Jobs Available"}
              </h3>
              <p className="text-muted mb-4">
                {currentUser?.role === "recruiter"
                  ? "Be the first to post a job opportunity and help students find their dream careers!"
                  : "Check back later for new job opportunities from top companies."}
              </p>
              {isLoggedIn && currentUser?.role === "recruiter" && (
                <Button variant="primary" size="lg" onClick={() => setShowJobForm(true)}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Post First Job
                </Button>
              )}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

// Enhanced JobList component with role-based features
const JobList = ({ jobs, deptColors, isRecruiter, isStudent, hasApplied, onViewApplicants, onApplyJob, currentUserRole }) => {
  if (jobs.length === 0) return (
    <div className="no-jobs-tab text-center py-5">
      <i className="bi bi-search display-1 text-muted mb-3"></i>
      <h4 className="text-dark">No jobs found in this category</h4>
      <p className="text-muted">Check back later for new opportunities</p>
    </div>
  );

  return (
    <Row className="g-4">
      {jobs.map((job) => (
        <Col xl={4} lg={6} md={6} key={job.id || job._id || job.jobId}>
          <Card className="job-card h-100 shadow-sm border-0">
            <Card.Body className="d-flex flex-column p-4">
              <div className="job-header mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="job-title text-dark fw-bold mb-0">{job.title}</Card.Title>
                  <Badge bg="light" text="dark" className="job-date">
                    <i className="bi bi-calendar me-1"></i>
                    {job.postedDate || new Date(job.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="company-badge mb-2">
                  <Badge bg="outline-primary" className="company-name">
                    <i className="bi bi-building me-1"></i>
                    {job.company || "Tech Company"}
                  </Badge>
                </div>
                {job.location && (
                  <div className="location-badge mb-2">
                    <Badge bg="outline-secondary" className="location">
                      <i className="bi bi-geo-alt me-1"></i>
                      {job.location}
                    </Badge>
                  </div>
                )}
                {job.salary && (
                  <div className="salary-badge mb-2">
                    <Badge bg="outline-success" className="salary">
                      <i className="bi bi-currency-rupee me-1"></i>
                      {job.salary}
                    </Badge>
                  </div>
                )}
                {isRecruiter && job.applicantsCount !== undefined && (
                  <div className="applicants-badge mb-2">
                    <Badge bg="outline-info" className="applicants-count">
                      <i className="bi bi-people me-1"></i>
                      {job.applicantsCount} Applicants
                    </Badge>
                  </div>
                )}
                <div className="department-tags">
                  {job.departments?.includes("all") ? (
                    <Badge bg={deptColors.all} className="me-1">
                      All Departments
                    </Badge>
                  ) : (
                    job.departments?.map(dept => (
                      <Badge key={dept} bg={deptColors[dept]} className="me-1 mb-1">
                        {dept === 'cse' ? 'CSE' :
                          dept === 'mech' ? 'Mechanical' :
                            dept === 'civil' ? 'Civil' :
                              'E & C'}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <Card.Text className="job-description flex-grow-1 text-muted">
                {job.description && job.description.length > 150
                  ? `${job.description.substring(0, 150)}...`
                  : job.description || "No description available"
                }
              </Card.Text>

              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="skills-section mb-3">
                  <small className="text-muted">
                    <strong>Skills:</strong> {Array.isArray(job.skillsRequired) ? job.skillsRequired.join(', ') : job.skillsRequired}
                  </small>
                </div>
              )}

              <div className="job-actions mt-auto">
                {isRecruiter ? (
                  <>
                    <Button
                      variant="info"
                      className="w-100 mb-2 fw-semibold"
                      onClick={() => onViewApplicants(job)}
                    >
                      <i className="bi bi-people me-2"></i>
                      View Applicants ({job.applicantsCount || 0})
                    </Button>
                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" size="sm">
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </Button>
                    </div>
                  </>
                ) : isStudent ? (
                  <>
                    {hasApplied(job._id || job.jobId || job.id) ? (
                      <Button
                        variant="success"
                        className="w-100 apply-btn fw-semibold"
                        disabled
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Applied
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-100 apply-btn fw-semibold"
                        onClick={() => onApplyJob(job._id || job.jobId || job.id)}
                      >
                        <i className="bi bi-send-check me-2"></i>
                        Apply Now
                      </Button>
                    )}
                    <div className="d-flex justify-content-between mt-2">
                      <Button variant="outline-info" size="sm">
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline-primary"
                      className="w-100 fw-semibold"
                      onClick={() => onApplyJob(job._id || job.jobId || job.id)}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login to Apply
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Placement;