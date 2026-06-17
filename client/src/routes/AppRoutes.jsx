import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Home         from "../pages/Home";
import Register     from "../pages/Register";
import Dashboard    from "../pages/Dashboard";
import CreateResume from "../pages/resume/CreateResume";
import MyResume     from "../pages/resume/MyResume";
import EditResume   from "../pages/resume/EditResume";

// Placeholder pages (will be built next)
import ATSChecker   from "../pages/ATSChecker";
import JDMatcher    from "../pages/JDMatcher";
import CoverLetter  from "../pages/CoverLetter";
import Templates    from "../pages/Templates";
import Profile      from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ──────────────────────────────────────────────── */}
      <Route path="/"         element={<Home />} />
      <Route path="/register" element={<Register />} />

      {/* ── Protected ───────────────────────────────────────────── */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      <Route path="/create-resume" element={
        <ProtectedRoute><CreateResume /></ProtectedRoute>
      } />

      <Route path="/my-resume" element={
        <ProtectedRoute><MyResume /></ProtectedRoute>
      } />

      <Route path="/edit-resume/:id" element={
        <ProtectedRoute><EditResume /></ProtectedRoute>
      } />

      <Route path="/ats-checker" element={
        <ProtectedRoute><ATSChecker /></ProtectedRoute>
      } />

      <Route path="/jd-matcher" element={
        <ProtectedRoute><JDMatcher /></ProtectedRoute>
      } />

      <Route path="/cover-letter" element={
        <ProtectedRoute><CoverLetter /></ProtectedRoute>
      } />

      <Route path="/templates" element={
        <ProtectedRoute><Templates /></ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
    </Routes>
  );
}