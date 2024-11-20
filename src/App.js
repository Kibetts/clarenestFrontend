
import {React, useEffect} from 'react';
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
import SubmittedPage from '../src/components/SubmittedPage';
import AccountCreation from '../src/components/AccountCreation'
import EmailVerification from '../src/components/EmailVerification';
import ContactUs from '../src/components/ContactUs'
import MeetTheTeam from "./components/MeetTheTeam";
import CreateAssignment from "./components/CreateAssignment"
import ScheduleAssessment from "./components/ScheduleAssessment"
import MarkAttendance  from "./components/MarkAttendance"
import Messages  from "./components/Messages"


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

  useEffect(() => {
    const updateStatus = async () => {
      try {
        await fetch('http://localhost:5000/api/users/heartbeat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (err) {
        console.error('Error updating status:', err);
      }
    };
  
    const interval = setInterval(updateStatus, 30000); // Every 30 seconds
  
    return () => clearInterval(interval);
  }, []);
  
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
        <Route path="/create-account/:role/:token" element={<AccountCreation />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/team" element={<MeetTheTeam />} />
        <Route path="/tutor/create-assignment" element={<CreateAssignment />} />
        <Route path="/tutor/schedule-assessment" element={<ScheduleAssessment />} />
        <Route path="/tutor/mark-attendance" element={<MarkAttendance />} />
        <Route path="/tutor/messages" element={<Messages />} />
      </Routes>
    </Router>
    </LocalizationProvider>
     </ThemeProvider>
  );
}

export default App;