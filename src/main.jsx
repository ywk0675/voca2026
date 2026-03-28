import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'

const params = new URLSearchParams(window.location.search);
const isTeacher = params.get("teacher") === "pegasus20262026";

ReactDOM.createRoot(document.getElementById('root')).render(
  isTeacher
    ? <TeacherDashboard onExit={() => { window.location.href = "/"; }} />
    : <App />
)
