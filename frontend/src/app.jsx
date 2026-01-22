import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingAuth from "./pages/OnboardingAuth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/navigations/Navbar";
import BottomNavigation from "./components/navigations/BottomNavigation";
import RoadMap from "./pages/RoadMap";
import QuizPage from "./pages/QuizPage";
import QuizPlayPage from "./components/quiz/QuizPlayPage";
import QuizResultPage from "./components/quiz/QuizResultPage";

function App() {
  const isAuthenticated = !!localStorage.getItem("user");

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
            path="/panduan"
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <div className="p-4">
                    <h1 className="text-xl font-bold mb-4">Panduan</h1>
                    <p className="text-gray-600">
                      Halaman panduan akan segera tersedia.
                    </p>
                  </div>
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

          <Route
            path="/quiz/:quizId/play"
            element={
              isAuthenticated ? (
                <QuizPlayPage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/quiz/:quizId/result"
            element={
              isAuthenticated ? (
                <QuizResultPage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/roadmap/:subjectId"
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <RoadMap />
                  <BottomNavigation />
                </>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
