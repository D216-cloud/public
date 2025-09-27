import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ProtectedRoute from '@/components/ProtectedRoute'

// Import pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import OnboardingPage from './pages/OnboardingPage'
import DemoPage from './pages/DemoPage'
import AIWriterPage from './pages/AIWriterPage'
import TwitterSignupPage from './pages/TwitterSignupPage' // Add this import

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="font-sans">
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/twitter-signup" element={<TwitterSignupPage />} /> {/* Add this route */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/onboarding" element={
                <ProtectedRoute requireOnboarding={true}>
                  <OnboardingPage />
                </ProtectedRoute>
              } />
              <Route path="/demo" element={
                <ProtectedRoute>
                  <DemoPage />
                </ProtectedRoute>
              } />
              <Route path="/ai-writer" element={
                <ProtectedRoute>
                  <AIWriterPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
          <Toaster />
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App