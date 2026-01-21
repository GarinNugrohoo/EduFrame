import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMotivationQuote } from "../hooks/useMotivationQuote";
import { useSubjectsData } from "../hooks/useSubjectsData";
import { BackgroundElements } from "../components/sections/BackgroundElements";
import { Header } from "../components/sections/Header";
import { CategoryCard } from "../components/sections/CategoryCard";
import { LoadingSpinner } from "../components/sections/LoadingSpinner";
import { ErrorDisplay } from "../components/sections/ErrorDisplay";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showLoading, setShowLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const motivationQuote = useMotivationQuote();
  const { categories, loading, error, refreshData } = useSubjectsData();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);

          if (user.username) {
            setUserName(user.username);
          } else if (user.email) {
            const nameFromEmail = user.email.split("@")[0];
            setUserName(nameFromEmail);
          }
        } else {
          setTimeout(() => {
            navigate("/onboarding/login");
          }, 1000);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    loadUserData();
  }, [navigate]);

  useEffect(() => {
    if (initialLoad) {
      const timer = setTimeout(() => {
        setShowLoading(loading);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(loading);
    }
  }, [loading, initialLoad]);

  useEffect(() => {
    if (!loading && categories.length > 0) {
      setInitialLoad(false);
    }
  }, [loading, categories]);

  const handleStartLearning = useCallback(
    (subjectId) => {
      navigate(`/roadmap/${subjectId}`);
    },
    [navigate],
  );

  const handleRetry = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const categoryCards = useMemo(() => {
    if (categories.length === 0 && !loading && !error) {
      return (
        <div className="text-center py-12 text-gray-500">
          Belum ada mata pelajaran tersedia
        </div>
      );
    }

    return categories.map((category, index) => (
      <CategoryCard
        key={category.id}
        category={category}
        index={index}
        onStartLearning={handleStartLearning}
      />
    ));
  }, [categories, loading, error, handleStartLearning]);

  const sectionTitle = useMemo(
    () => (
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Struktur Belajar
        </h2>
      </div>
    ),
    [userName],
  );

  if (!userName && showLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-2 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (showLoading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-2">
        <BackgroundElements />
        <Header userName={userName} motivationQuote={motivationQuote} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-2">
        <BackgroundElements />
        <Header userName={userName} motivationQuote={motivationQuote} />
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-2 relative overflow-hidden">
      <BackgroundElements />

      <Header userName={userName} motivationQuote={motivationQuote} />

      <div className="relative mb-6">
        {sectionTitle}

        {loading && categories.length > 0 && (
          <div className="flex justify-center mb-4">
            <div className="w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {categoryCards}
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default Home;
