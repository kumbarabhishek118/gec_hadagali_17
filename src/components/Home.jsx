import React from "react";
import './Home.css'


function Home() {
 const departments = [
    {
      title: "Electronics & Communication Engineering (ECE)",
      color: "primary",
      icon: "bi-cpu",
      description: "Communication systems, VLSI design, embedded systems and signal processing"
    },
    { 
      title: "Computer Science & Engineering (CSE)", 
      color: "success", 
      icon: "bi-laptop",
      description: "Software development, AI, machine learning and data science"
    },
    { 
      title: "Civil Engineering", 
      color: "warning", 
      icon: "bi-building",
      description: "Infrastructure development, construction technology and environmental engineering"
    },
    { 
      title: "Mechanical Engineering", 
      color: "info", 
      icon: "bi-gear",
      description: "Design, manufacturing, thermal engineering and automation systems"
    },
  ];

  return (
  <>
  <div className="home-page">
    <section className="home-hero-section">
     

    

    </section>

     <section id="departments" className="departments-section py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">Our Departments</h2>
              <p className="section-subtitle">Comprehensive Engineering Programs</p>
            </div>
          </div>
          
          <div className="row g-4">
            {departments.map((dept, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className={`department-card department-${dept.color}`}>
                  <div className="department-icon">
                    <i className={`bi ${dept.icon}`}></i>
                  </div>
                  <h5 className="department-title">{dept.title}</h5>
                  <p className="department-description">{dept.description}</p>
                  <div className="department-badge">
                    {dept.title.split(' ')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  </div>
  </>
   
  );
}

export default Home;