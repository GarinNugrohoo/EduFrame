import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingAuth from "./pages/OnboardingAuth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  const isAuthenticated = false; // Ganti dengan logika auth sesungguhnya

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />
          <Route path="/onboarding" element={<OnboardingAuth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          {/* Tambahkan route lainnya */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
