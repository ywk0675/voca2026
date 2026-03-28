import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'

const params = new URLSearchParams(window.location.search);
const teacherPw = import.meta.env.VITE_TEACHER_PASSWORD ?? "pegasus20262026";
const isTeacher = params.get("teacher") === teacherPw;

ReactDOM.createRoot(document.getElementById('root')).render(
  isTeacher
    ? <TeacherDashboard onExit={() => { window.location.href = "/"; }} />
    : <App />
)
