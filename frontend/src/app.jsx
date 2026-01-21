import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OnboardingAuth from "./pages/OnboardingAuth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/navigations/Navbar";
import BottomNavigation from "./components/navigations/BottomNavigation";
import RoadMap from "./pages/RoadMap";
import QuizPage from "./pages/QuizPage";
import QuizPlayPage from "./components/quiz/QuizPlayPage";
import QuizResultPage from "./components/quiz/QuizResultPage";
import QuizHistoryPage from "./pages/QuizHistoryPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

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

          <Route
            path="/onboarding/*"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <OnboardingAuth />
              )
            }
          />

          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <Home />
                  <BottomNavigation />
                </>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <Profile />
                  <BottomNavigation />
                </>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/history"
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <QuizHistoryPage />
                  <BottomNavigation />
                </>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/quiz"
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <QuizPage />
                  <BottomNavigation />
                </>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route path="/quiz/:quizId/play" element={<QuizPlayPage />} />
          <Route path="/quiz/:quizId/result" element={<QuizResultPage />} />

          <Route path="/roadmap/:subjectId" element={<RoadMap />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
