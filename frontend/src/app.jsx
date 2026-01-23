import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OnboardingAuth from "./pages/OnboardingAuth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/navigations/Navbar";
import BottomNavigation from "./components/navigations/BottomNavigation";
import RoadMap from "./pages/RoadMap";
import QuizPage from "./pages/QuizPage";
import QuizPlayPage from "./components/quiz/QuizPlayPage";
import QuizResultPage from "./components/quiz/QuizResultPage";
import HistoryPage from "./pages/History";
import HistoryDetailPage from "./pages/HistoryDetailPage";

const AuthHandler = ({ children, requireAuth = true }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pb-16"> {children}</main>
      <BottomNavigation />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <AuthHandler requireAuth={false}>
                <Navigate to="/home" replace />
              </AuthHandler>
            }
          />

          <Route
            path="/onboarding/*"
            element={
              <AuthHandler requireAuth={false}>
                <OnboardingAuth />
              </AuthHandler>
            }
          />

          <Route
            path="/home"
            element={
              <AuthHandler>
                <MainLayout>
                  <Home />
                </MainLayout>
              </AuthHandler>
            }
          />

          <Route
            path="/profile"
            element={
              <AuthHandler>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </AuthHandler>
            }
          />

          <Route
            path="/history"
            element={
              <AuthHandler>
                <MainLayout>
                  <HistoryPage />
                </MainLayout>
              </AuthHandler>
            }
          />

          <Route
            path="/history/:id"
            element={
              <AuthHandler>
                <MainLayout>
                  <HistoryDetailPage />
                </MainLayout>
              </AuthHandler>
            }
          />

          <Route
            path="/quiz"
            element={
              <AuthHandler>
                <MainLayout>
                  <QuizPage />
                </MainLayout>
              </AuthHandler>
            }
          />

          <Route
            path="/roadmap/:subjectId"
            element={
              <AuthHandler>
                <MainLayout>
                  <RoadMap />
                </MainLayout>
              </AuthHandler>
            }
          />

          <Route
            path="/quiz/:quizId/play"
            element={
              <AuthHandler>
                <QuizPlayPage />
              </AuthHandler>
            }
          />

          <Route
            path="/quiz/:quizId/result"
            element={
              <AuthHandler>
                <QuizResultPage />
              </AuthHandler>
            }
          />

          <Route
            path="*"
            element={
              <AuthHandler requireAuth={false}>
                <Navigate to="/home" replace />
              </AuthHandler>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
