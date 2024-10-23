
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/css/App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';


import Home from '../src/components/Home'
import About from '../src/components/About';
import Login from '../src/components/Login';
import StudentDashboard from '../src/components/StudentDashboard';
import TutorDashboard from '../src/components/TutorDashboard';
import ParentDashboard from '../src/components/ParentDashboard';
import AdminDashboard from '../src/components/AdminDashboard';
import StudentApplicationForm from '../src/components/StudentApplicationForm';
import TutorApplicationForm from '../src/components/TutorApplicationForm';
import AssessmentTaking from '../src/components/AssessmentTaking';
import LessonView from '../src/components/LessonView';
import FeePayment from '../src/components/FeePayment';
import SubmittedPage from './components/SubmittedPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#0d47a1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
       <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/tutor" element={<TutorDashboard />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/apply/student" element={<StudentApplicationForm />} />
        <Route path="/apply/tutor" element={<TutorApplicationForm />} />
        <Route path="/assessment/:id" element={<AssessmentTaking />} />
        <Route path="/lesson/:id" element={<LessonView />} />
        <Route path="/fee-payment" element={<FeePayment />} />
        <Route path="/application-submitted" element={<SubmittedPage />} />


      </Routes>
    </Router>
    </LocalizationProvider>
     </ThemeProvider>
  );
}

export default App;