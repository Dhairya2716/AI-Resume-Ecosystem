import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Register";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Auth />}/>
      <Route path="/dashboard" element={<Dashboard />} />
      {/* other routes */}
    </Routes>
  );
}