import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const CollegeNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState("");
    const [user, setUser] = useState(null);
  const navigate = useNavigate();

 

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

   useEffect(() => {
    // Automatically highlight current route on refresh or navigation
    setActiveLink(location.pathname);
  }, [location]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  

  const handleNavClick = (path) => {
     setActiveLink(path);
    setExpanded(false);
    navigate(path);
  };

  const handleBrandClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expand="lg" 
      className="college-navbar navbar-dark py-2" 
      fixed="top"
      expanded={expanded}
      onToggle={handleToggle}
    >
      <Container>
        {/* Brand with logo on the far left */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="brand-section me-auto" 
          onClick={handleBrandClick}
        >
          <div className="brand-content">
            <div className="logo-container">
              <img
                src="/images/logo.jpeg"
                alt="College Logo"
                className="college-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="brand-text">
              <span className="gec-bold">GEC</span>
              <span className="college-full-name">Huvinahadagali</span>
            </div>
          </div>
        </Navbar.Brand>

        {/* Toggler for mobile */}
        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          className="navbar-toggler-custom"
          aria-expanded={expanded}
        />

        {/* Navigation links aligned to the end */}
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="nav-links-container">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${activeLink === "/" ? "active-link" : ""}`}
              onClick={() => handleNavClick("/")}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
             className={`nav-link-custom ${activeLink === "/about" ? "active-link" : ""}`}
              onClick={() => handleNavClick("/about")}
              
            >
              About 
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/courses" 
               className={`nav-link-custom ${activeLink === "/courses" ? "active-link" : ""}`}
              onClick={() => handleNavClick("/courses")}
            >
              Branches
            </Nav.Link>
             <Nav.Link 
              as={Link} 
              to="/online-training" 
               className={`nav-link-custom ${activeLink === "/online-training" ? "active-link" : ""}`}
              onClick={() => handleNavClick("/online-training")}
            >
              Online Training
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/placement" 
              className={`nav-link-custom ${activeLink === "/placement" ? "active-link" : ""}`}
              onClick={() => handleNavClick("/placement")}
            >
             Placement
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/alumini" 
             className={`nav-link-custom ${activeLink === "/alumini" ? "active-link" : ""}`}
              onClick={() => handleNavClick("/alumini")}
            >
              Alumni
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={`nav-link-custom ${activeLink === "/contact" ? "active-link" : ""}`}
              onClick={() => handleNavClick("/contact")}
            >
              Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CollegeNavbar;