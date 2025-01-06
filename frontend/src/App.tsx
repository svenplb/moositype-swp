import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TypingTest } from "./components/TypingTest";
import { SignUp } from "./components/Auth/SignUp";
import { Login } from "./components/Auth/Login";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Leaderboard } from "./components/Leaderboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TypingTest />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
