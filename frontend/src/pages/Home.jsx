// src/pages/Home.jsx
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Hooks
import { useMotivationQuote } from "../hooks/useMotivationQuote";
import { useSubjectsData } from "../hooks/useSubjectsData";

// Components
import { BackgroundElements } from "../components/sections/BackgroundElements";
import { Header } from "../components/sections/Header";
import { CategoryCard } from "../components/sections/CategoryCard";
import { LoadingSpinner } from "../components/sections/LoadingSpinner";
import { ErrorDisplay } from "../components/sections/ErrorDisplay";

const Home = ({ userName = "Garin Nugroho" }) => {
  const navigate = useNavigate();

  // State untuk kontrol UI (mencegah flash loading)
  const [showLoading, setShowLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Custom hooks
  const motivationQuote = useMotivationQuote();
  const { categories, loading, error, refreshData } = useSubjectsData();

  // Kontrol kapan menampilkan loading spinner
  useEffect(() => {
    if (initialLoad) {
      // Initial load: tunggu 100ms baru tampilkan loading
      const timer = setTimeout(() => {
        setShowLoading(loading);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Subsequent loads: langsung tampilkan loading
      setShowLoading(loading);
    }
  }, [loading, initialLoad]);

  // Set initialLoad menjadi false setelah data pertama kali dimuat
  useEffect(() => {
    if (!loading && categories.length > 0) {
      setInitialLoad(false);
    }
  }, [loading, categories]);

  // Memoized handlers
  const handleStartLearning = useCallback(
    (subjectId) => {
      navigate(`/roadmap/${subjectId}`);
    },
    [navigate]
  );

  const handleRetry = useCallback(() => {
    refreshData();
  }, [refreshData]);

  // Memoized JSX elements
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
      <div className="flex items-center justify-between mb-8 relative">
        <div className="flex items-center">
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Struktur Belajar
            </h2>
          </div>
        </div>
      </div>
    ),
    []
  );

  // Render loading state (hanya jika showLoading true)
  if (showLoading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-2">
        <BackgroundElements />
        <Header userName={userName} motivationQuote={motivationQuote} />
        <LoadingSpinner />
      </div>
    );
  }

  // Render error state
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

        {/* Loading indicator ringan jika ada data cache tapi sedang refresh */}
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

Home.propTypes = {
  userName: PropTypes.string,
};

Home.defaultProps = {
  userName: "Garin Nugroho",
};

export default Home;
