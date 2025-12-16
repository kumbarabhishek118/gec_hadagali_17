import React, { useEffect, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from './About.module.css';

const About = () => {
  const animationRefs = useRef([]);

  const features = [
    {
      icon: "bi-award",
      title: "VTU Affiliated",
      description: "Approved by AICTE, New Delhi"
    },
    {
      icon: "bi-building",
      title: "Modern Campus",
      description: "State-of-the-art infrastructure"
    },
    {
      icon: "bi-briefcase",
      title: "Industry Ready",
      description: "Strong industry partnerships"
    },
    {
      icon: "bi-globe",
      title: "Global Exposure",
      description: "International collaborations"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animationRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el, animationClass) => {
    if (el && !animationRefs.current.includes(el)) {
      el.classList.add(animationClass);
      animationRefs.current.push(el);
    }
  };

  return (
    <div className={styles.aboutPage}>
      {/* ===================== Hero Section ===================== */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className="container">
          <div className="row justify-content-start text-center">
            <div className="col-12 col-lg-10">
              <div className={styles.heroContent}>
              
                <h1 className={styles.heroTitle}>
                  Government Engineering College
                  <span className={styles.highlight}> Huvinahadagali</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  Empowering Students. Enriching Knowledge. Engineering the Future.
                </p>
                <div className={styles.scrollIndicator}>
                  <div className={styles.scrollArrow}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== About Section ===================== */}
      <section id="about" className={styles.aboutSection}>
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>About Our College</h2>
                <div className={styles.titleUnderline}></div>
                <p className={styles.sectionSubtitle}>Excellence in Engineering Education Since Inception</p>
              </div>
            </div>
          </div>
          
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <div className={styles.imageWrapper}>
                <img
                  src="images/about_1.jpg"
                  alt="College Campus"
                  className={styles.mainImage}
                  ref={(el) => addToRefs(el, styles.fadeRight)}
                />
                <div className={styles.floatingStats}>
                  <div className={styles.statItem}>
                    <h4 className={styles.statNumber}>4+</h4>
                    <span className={styles.statLabel}>Branches</span>
                  </div>
                  <div className={styles.statItem}>
                    <h4 className={styles.statNumber}>50+</h4>
                    <span className={styles.statLabel}>Faculty</span>
                  </div>
                  <div className={styles.statItem}>
                    <h4 className={styles.statNumber}>1000+</h4>
                    <span className={styles.statLabel}>Students</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={styles.aboutContent}>
                <div className={styles.textWrapper}>
                  <p className={styles.aboutText}>
                    <strong>Government Engineering College, Huvinahadagali (GEC
                    Huvinahadagali)</strong> is a premier institution dedicated to
                    fostering technical excellence and innovation in higher
                    education. Established with the vision of providing quality
                    engineering education to rural and semi-urban students, the
                    college is affiliated to <strong>Visvesvaraya Technological
                    University (VTU), Belagavi</strong> and approved by the{" "}
                    <strong>All India Council for Technical Education (AICTE),
                    New Delhi</strong>.
                  </p>
                  <p className={styles.aboutText}>
                    The college offers undergraduate programs in four major
                    disciplines — <strong>Electronics and Communication Engineering (ECE)</strong>,
                    {" "}<strong>Computer Science and Engineering (CSE)</strong>, {" "}
                    <strong>Civil Engineering</strong>, and {" "}
                    <strong>Mechanical Engineering</strong>. Each department is
                    backed by qualified faculty, modern labs, and a strong academic
                    curriculum aligned with industry standards.
                  </p>
                </div>

                <div className={styles.featuresGrid}>
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className={styles.featureItem}
                      ref={(el) => addToRefs(el, styles.fadeUp)}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className={styles.featureIconWrapper}>
                        <i className={`bi ${feature.icon} ${styles.featureIcon}`}></i>
                      </div>
                      <div className={styles.featureContent}>
                        <h6 className={styles.featureTitle}>{feature.title}</h6>
                        <small className={styles.featureDescription}>{feature.description}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Facilities Section ===================== */}
      <section id="facilities" className={styles.facilitiesSection}>
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Campus Highlights</h2>
                <div className={styles.titleUnderline}></div>
                <p className={styles.sectionSubtitle}>Modern Infrastructure for Comprehensive Learning</p>
              </div>
            </div>
          </div>
          
          <div className="row g-5 mb-5">
            <div className="col-md-6">
              <div 
                className={styles.facilityCard}
                ref={(el) => addToRefs(el, styles.fadeRight)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src="images/labs.png"
                    alt="Labs and Workshops"
                    className={styles.facilityImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
                <div className={styles.facilityContent}>
                  <div className={styles.facilityIcon}>
                    <i className="bi bi-cpu"></i>
                  </div>
                  <h4 className={styles.facilityTitle}>
                    Well-Equipped Labs & Workshops
                  </h4>
                  <p className={styles.facilityText}>
                    Modern infrastructure and advanced laboratories provide
                    practical exposure and hands-on training to prepare students
                    for real-world engineering challenges. Our labs are equipped
                    with the latest technology and equipment.
                  </p>
                  <ul className={styles.featuresList}>
                    <li><i className="bi bi-check-circle"></i> Advanced computing labs</li>
                    <li><i className="bi bi-check-circle"></i> Electronics and communication labs</li>
                    <li><i className="bi bi-check-circle"></i> Mechanical workshops</li>
                    <li><i className="bi bi-check-circle"></i> Civil engineering testing facilities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div 
                className={styles.facilityCard}
                ref={(el) => addToRefs(el, styles.fadeLeft)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src="images/aboutt_3.jpg"
                    alt="Campus Life"
                    className={styles.facilityImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
                <div className={styles.facilityContent}>
                  <div className={styles.facilityIcon}>
                    <i className="bi bi-people"></i>
                  </div>
                  <h4 className={styles.facilityTitle}>Vibrant Campus Life</h4>
                  <p className={styles.facilityText}>
                    A blend of academics, innovation, and extracurricular
                    activities ensures holistic student development and a
                    memorable campus experience. Our campus fosters creativity
                    and leadership.
                  </p>
                  <ul className={styles.featuresList}>
                    <li><i className="bi bi-check-circle"></i> Technical clubs and chapters</li>
                    <li><i className="bi bi-check-circle"></i> Cultural and sports events</li>
                    <li><i className="bi bi-check-circle"></i> Innovation and incubation center</li>
                    <li><i className="bi bi-check-circle"></i> Library with digital resources</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row g-5">
            <div className="col-md-6">
              <div 
                className={styles.facilityCard}
                ref={(el) => addToRefs(el, styles.fadeRight)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src="images/library..png"
                    alt="Library"
                    className={styles.facilityImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
                <div className={styles.facilityContent}>
                  <div className={styles.facilityIcon}>
                    <i className="bi bi-book"></i>
                  </div>
                  <h4 className={styles.facilityTitle}>
                    Well Structured Library
                  </h4>
                  <p className={styles.facilityText}>
                    The college library serves as the intellectual hub of the campus, providing students, faculty, and staff with access to a wide range of learning resources, research materials, and study spaces.
                  </p>
                  <ul className={styles.featuresList}>
                    <li><i className="bi bi-check-circle"></i> Extensive Book Collection</li>
                    <li><i className="bi bi-check-circle"></i> Journals and Periodicals</li>
                    <li><i className="bi bi-check-circle"></i> Digital Resources</li>
                    <li><i className="bi bi-check-circle"></i> Comfortable Study Spaces</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div 
                className={styles.facilityCard}
                ref={(el) => addToRefs(el, styles.fadeLeft)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src="images/hostel..png"
                    alt="Hostel"
                    className={styles.facilityImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
                <div className={styles.facilityContent}>
                  <div className={styles.facilityIcon}>
                    <i className="bi bi-house-door"></i>
                  </div>
                  <h4 className={styles.facilityTitle}>Comfortable Hostel</h4>
                  <p className={styles.facilityText}>
                    The college hostel provides safe, comfortable, and well-maintained accommodation for students, creating a supportive environment that fosters academic growth and personal development.
                  </p>
                  <ul className={styles.featuresList}>
                    <li><i className="bi bi-check-circle"></i> Secure Accommodation</li>
                    <li><i className="bi bi-check-circle"></i> Quality Food and Dining</li>
                    <li><i className="bi bi-check-circle"></i> Safety and Security</li>
                    <li><i className="bi bi-check-circle"></i> Conducive Living Environment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About;