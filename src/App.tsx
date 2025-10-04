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
import TwitterPostPage from './pages/TwitterPostPage'
import TwitterSetupPage from './pages/TwitterSetupPage'
import TwitterSignupPage from './pages/TwitterSignupPage'
import XProfilePage from './pages/XProfilePage'
import ContentSchedulerPage from './pages/ContentSchedulerPage'
import ProfilePage from './pages/ProfilePage'

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
              <Route path="/twitter-signup" element={<TwitterSignupPage />} />
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
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/xprofile" element={
                <ProtectedRoute>
                  <XProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/scheduler" element={
                <ProtectedRoute>
                  <ContentSchedulerPage />
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
              <Route path="/post" element={
                <ProtectedRoute>
                  <TwitterPostPage />
                </ProtectedRoute>
              } />
              <Route path="/twitter-setup" element={
                <ProtectedRoute>
                  <TwitterSetupPage />
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