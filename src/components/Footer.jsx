import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  // 👇 Function to go to section smoothly
  const goToSection = (id) => {
    navigate(`/courses#${id}`);
  };

  return (
    <footer className="footer-section text-white pt-5 pb-3">
      <Container>
        <Row className="gy-4">
          {/* ===== Brand Section ===== */}
          <Col md={3} sm={6}>
            <h4 className="footer-brand mb-3">GEC Hadagali</h4>
            <p className="footer-desc">
              Government Engineering College, Hadagali — empowering education,
              innovation, and excellence in engineering.
            </p>
            <div className="social-icons mt-3">
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
            </div>
          </Col>

          {/* ===== Quick Links ===== */}
          <Col md={3} sm={6}>
            <h5 className="footer-title mb-3">Quick Links</h5>
            <ul className="footer-links list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/online-training">Online-Training</a></li>
              <li><a href="/placement">Placement</a></li>
              <li><a href="/alumini">Alumini</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </Col>

          {/* ===== Departments ===== */}
          <Col md={3} sm={6}>
            <h5 className="footer-title mb-3">Departments</h5>
            <ul className="footer-links list-unstyled">
              {/* 💡 Use onClick and remove href to avoid reload */}
              <li><button className="footer-link-btn" onClick={() => goToSection("cs")}>Computer Science</button></li>
              <li><button className="footer-link-btn" onClick={() => goToSection("ec")}>Electronics & Communication</button></li>
              <li><button className="footer-link-btn" onClick={() => goToSection("civil")}>Civil Engineering</button></li>
              <li><button className="footer-link-btn" onClick={() => goToSection("mech")}>Mechanical Engineering</button></li>
            </ul>
          </Col>

          {/* ===== Address ===== */}
          <Col md={3} sm={6}>
            <h5 className="footer-title mb-3">Address</h5>
            <p className="footer-text mb-1">
              <i className="bi bi-geo-alt-fill me-2"></i> GEC Hadagali Campus,
              Vijayanagara District, Karnataka, India
            </p>
            <p className="footer-text mb-1">
              <i className="bi bi-telephone-fill me-2"></i> +91  08399-240525
            </p>
            <p className="footer-text mb-0">
              <i className="bi bi-envelope-fill me-2"></i>  <a
                href="mailto:gechadagali@gmail.com"
                className="text-light text-decoration-none"
              >
                gechadagali@gmail.com
              </a>
            </p>
          </Col>
        </Row>

        <hr className="footer-divider my-4" />

        <Row>
          <Col className="text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} <strong>GEC Hadagali</strong>. All
              Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
