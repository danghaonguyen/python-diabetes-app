import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage from './components/pages/home/HomePage';
import PatientForm from './components/pages/prediction/PatientForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import History from './components/pages/history/History';
import ScrollToTop from './ScrollToTop';
import './index.css';

const ProtectedRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem('user_id'));

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const GuestRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem('user_id'));

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/prediction" element={<PatientForm />} />
          <Route path="/history" element={<History />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
