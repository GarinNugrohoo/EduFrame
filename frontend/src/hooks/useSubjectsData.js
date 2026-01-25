import { useState, useCallback, useEffect, useRef } from "react";
import { getSubjects } from "../api/subjects";
import { transformSubjectsData } from "../utils/subjectTransformer";

const CACHE_KEY = "subjects_cache";
const CACHE_DURATION = 60 * 60 * 1000;

export const useSubjectsData = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasData = useRef(false);

  const fetchData = useCallback(async (force = false) => {
    if (hasData.current && !force) {
      return;
    }

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

    try {
      setLoading(true);
      setError(null);

      const apiData = await getSubjects();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const transformedData = transformSubjectsData(apiData);
        const cacheData = {
          data: transformedData,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        setCategories(transformedData);
        hasData.current = true;
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat data pelajaran. Silakan coba lagi.");

      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          if (data && data.length > 0) {
            setCategories(data);
            hasData.current = true;
          }
        } catch (e) {
          throw e;
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasData.current) {
      fetchData();
    }
  }, [fetchData]);

  const refreshData = useCallback(() => {
    hasData.current = false;
    fetchData(true);
  }, [fetchData]);

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
