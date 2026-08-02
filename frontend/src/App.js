import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import PatientForm from './components/pages/PatientForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import History from "./components/pages/History";
import ScrollToTop from "./ScrollToTop";

// src/index.js hoặc src/App.js


/* function App() {
  return (
    <div>
      <HomePage />
    </div>
  );
} */

  function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prediction" element={<PatientForm />} />
        <Route path="/history" element={<History />} />
        <Route path ="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
