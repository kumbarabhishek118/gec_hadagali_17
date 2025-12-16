import React, { useRef } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import emailjs from "emailjs-com";
import "./Contact.css";

const ContactUs = () => {
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_gsz9brs",   // Replace with your EmailJS Service ID
        "template_i0uccx7",  // Replace with your EmailJS Template ID
        form.current,
        "4AY0EN2k2vw7bK7Ik"    // Replace with your EmailJS Public Key
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          e.target.reset();
        },
        (error) => {
          alert("❌ Failed to send message. Please try again.");
          console.error(error.text);
        }
      );
  };

  return (
    <section className="contact-section py-5" style={{marginTop:'80px'}}>
      <Container>
        <h2 className="text-center fw-bold mb-5 text-primary text-uppercase">
          Contact Us
        </h2>
        <Row className="align-items-stretch">
          {/* LEFT SIDE */}
          <Col md={6} className="d-flex flex-column justify-content-between">
            <Row className="g-3">
              <Col md={12}>
                <Card className="contact-card h-100">
                  <Card.Body className="text-center">
                    <i className="bi bi-geo-alt-fill contact-icon"></i>
                    <h5 className="fw-bold">Address</h5>
                    <p>
                      Government Engineering College, Hadagali <br />
                      Vijayanagara, Karnataka - 583219
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="contact-card h-100">
                  <Card.Body className="text-center">
                    <i className="bi bi-envelope-fill contact-icon"></i>
                    <h5 className="fw-bold">Email</h5>
                    <p>gechadagali@gmail.com</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="contact-card h-100">
                  <Card.Body className="text-center">
                    <i className="bi bi-telephone-fill contact-icon"></i>
                    <h5 className="fw-bold">Phone</h5>
                    <p>+91 08399-240525</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="contact-card h-100 ">
                  <Card.Body className="text-center">
                    <i className="bi bi-clock-fill contact-icon"></i>
                    <h5 className="fw-bold">Timings</h5>
                    <p>Mon - Sat: 9:00 AM - 5:00 PM</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* RIGHT SIDE */}
          <Col md={6}>
            <Card className="contact-form-card h-100">
              <Card.Body>
                <h4 className="fw-bold mb-4 text-center text-primary">
                  Send Us a Message
                </h4>
                <Form ref={form} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Enter your phone number"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      placeholder="Type your message..."
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactUs;
