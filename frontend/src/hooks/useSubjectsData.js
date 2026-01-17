// src/hooks/useSubjectsData.js
import { useState, useCallback, useEffect, useRef } from "react";
import { getSubjects } from "../api/subjects";
import { transformSubjectsData } from "../utils/subjectTransformer";

const CACHE_KEY = "subjects_cache";
const CACHE_DURATION = 1 * 60 * 1000;

export const useSubjectsData = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gunakan useRef untuk menyimpan apakah sudah ada data
  const hasData = useRef(false);

  const fetchData = useCallback(async (force = false) => {
    // 1. Jika sudah ada data di state dan tidak force refresh, skip
    if (hasData.current && !force) {
      return;
    }

    // 2. Cek cache di localStorage
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();

          if (now - timestamp < CACHE_DURATION && data && data.length > 0) {
            setCategories(data);
            hasData.current = true;
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Cache corrupt, fetching fresh data");
        }
      }
    }

    // 3. Jika tidak ada cache atau cache expired, fetch dari API
    try {
      setLoading(true);
      setError(null);

      const apiData = await getSubjects();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const transformedData = transformSubjectsData(apiData);

        // Simpan ke cache
        const cacheData = {
          data: transformedData,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        // Update state
        setCategories(transformedData);
        hasData.current = true;
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat data pelajaran. Silakan coba lagi.");

      // Coba gunakan cache meski expired sebagai fallback
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          if (data && data.length > 0) {
            setCategories(data);
            hasData.current = true;
          }
        } catch (e) {
          // Ignore cache error
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch - hanya sekali
  useEffect(() => {
    if (!hasData.current) {
      fetchData();
    }
  }, [fetchData]);

  // Function untuk manual refresh
  const refreshData = useCallback(() => {
    hasData.current = false; // Reset flag
    fetchData(true);
  }, [fetchData]);

  // Function untuk clear cache
  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    hasData.current = false;
    setCategories([]);
    fetchData(true);
  }, [fetchData]);

  return {
    categories,
    loading,
    error,
    refreshData,
    clearCache,
    hasData: hasData.current,
  };
};
