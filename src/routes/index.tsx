import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import Jobs from '../pages/Jobs';
import Achievements from '../pages/Achievements';
import Feedback from '../pages/Feedback';
import Reviews from '../pages/Reviews';
import Teams from '../pages/Teams';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthRedirect } from '../lib/auth/AuthRedirect';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/teams" element={<Teams />} />
      </Route>
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}