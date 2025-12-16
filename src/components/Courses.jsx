import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Courses.css";

const courses = [
  {
    title: "Computer Science and Engineering",
    img: "images/courses_CS.png",
    desc: `The Computer Science department focuses on cutting-edge technologies like Artificial Intelligence, Data Science, Cloud Computing, and Software Engineering. Students are trained to solve real-world problems through coding, projects, and research.`,
    id: "cs",
  },
  {
    title: "Mechanical Engineering",
    img: "images/courses_mechanical.png",
    desc: `Mechanical Engineering involves the design, manufacturing, and maintenance of mechanical systems. Students gain expertise in thermodynamics, machine design, CAD/CAM, robotics, and automotive systems.`,
    id: "mech",
  },
  {
    title: "Electronics and Communication Engineering",
    img: "images/courses_EC.png",
    desc: `The ECE department equips students with knowledge in electronics, signal processing, embedded systems, and telecommunications. It bridges hardware and software, enabling innovation in IoT and chip design.`,
    id: "ec",
  },
  {
    title: "Civil Engineering",
    img: "images/courses_civil.png",
    desc: `Civil Engineering shapes the world we live in — from bridges and buildings to sustainable urban infrastructure. The department emphasizes structural design, surveying, geotechnics, and environmental engineering.`,
    id: "civil",
  },
];

const Courses = () => {
  const location = useLocation();

  // ✅ Scroll to correct section when navigating with hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const section = document.getElementById(id);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100); // small delay ensures images/DOM are loaded
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <section className="courses-section py-5" style={{ marginTop: "80px" }}>
      <Container>
        {/* Header */}
        <div className="courses-header text-center mb-5">
          <h1 className="courses-main-title">Our Engineering Programs</h1>
          <p className="courses-subtitle">
            Comprehensive engineering education with industry-focused curriculum
          </p>
        </div>

        {/* Courses */}
        <div className="courses-list">
          {courses.map((course, index) => (
            <Card
              key={index}
              id={course.id} // ✅ Add section id for scrolling
              className="course-full-card mb-4"
            >
              <Row className="g-0 align-items-center">
                <Col md={4}>
                  <div className="course-image-wrapper">
                    <Card.Img
                      src={course.img}
                      alt={course.title}
                      className="course-full-img"
                    />
                  </div>
                </Col>
                <Col md={8}>
                  <Card.Body className="course-full-content">
                    <Card.Title className="course-full-title">
                      {course.title}
                    </Card.Title>
                    <Card.Text className="course-full-desc">
                      {course.desc}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Courses;
