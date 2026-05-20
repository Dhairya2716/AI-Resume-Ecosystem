import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Auth />}/>
      {/* other routes */}
    </Routes>
  );
}