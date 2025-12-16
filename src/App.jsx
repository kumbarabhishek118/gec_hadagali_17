import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CollegeNavbar from "./components/CollegeNavbar";
import Home from "./components/Home";
import About from "./components/About";
import Courses from "./components/Courses";
import Placement from "./components/Placement";
import Alumini from "./components/Alumini";
import ContactUs from "./components/ContactUs";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";
import OnlineTraining from "./components/OnlineTraining";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";

import Quiz from "./components/Quiz.Jsx";
import QuizDetails from "./components/QuizDetails";
import "bootstrap-icons/font/bootstrap-icons.css";
import MyStudents from "./components/MyStudent";
import ForgotPassword from "./components/ForgotPassword";





function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <CollegeNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/online-training" element={<OnlineTraining />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/alumini" element={<Alumini />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/mystudents" element={<MyStudents />} />
        <Route path='/quiz' element={<Quiz/>}/>
        <Route path="/quiz/:id" element={<QuizDetails/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
     
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
