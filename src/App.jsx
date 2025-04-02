import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import Login from './components/pages/Login'
import Dashboard from './components/pages/Dashboard'
import Register from './components/pages/Register'
import ForgotPassword from './components/pages/ForgotPassword'
import ResetPassword from './components/pages/ResetPassword'
import ImageAnalysis from './components/pages/ImageAnalysis'
import VoiceRecognition from './components/pages/VoiceRecognition'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/image-analysis" element={<ImageAnalysis />} />
            <Route path="/voice-recognition" element={<VoiceRecognition />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App