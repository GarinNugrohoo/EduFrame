import { useCallback, useRef } from "react";

export const useTimeTracking = (userId) => {
  const sessionTimers = useRef({});
  const activeMaterials = useRef(new Set());
  const DATA_VERSION = "2.0";

  const stopTrackingTime = useCallback(
    (materialId) => {
      if (!materialId || !userId) return 0;

      const timer = sessionTimers.current[materialId];
      if (!timer || !timer.isActive) {
        return 0;
      }

      const elapsedSeconds = Math.floor((Date.now() - timer.startTime) / 1000);
      const savedMinutes = saveElapsedTime(materialId, userId, elapsedSeconds);

      timer.totalSeconds += elapsedSeconds;
      timer.isActive = false;
      activeMaterials.current.delete(materialId);

      setTimeout(() => {
        if (
          sessionTimers.current[materialId] &&
          !sessionTimers.current[materialId].isActive
        ) {
          delete sessionTimers.current[materialId];
        }
      }, 1000);

      return savedMinutes;
    },
    [userId],
  );

  const saveElapsedTime = useCallback((materialId, userId, elapsedSeconds) => {
    if (elapsedSeconds < 5) {
      return 0;
    }

    const progressKey = `progress_${materialId}_${userId}`;
    const existingProgress = localStorage.getItem(progressKey);

    let existingData = {
      version: DATA_VERSION,
      progress_status: "in_progress",
      time_spent_minutes: 0,
      sessions: [],
      total_seconds: 0,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingProgress) {
      try {
        const parsed = JSON.parse(existingProgress);

        if (!parsed.version || parsed.version === "1.0") {
          existingData.time_spent_minutes =
            parseInt(parsed.time_spent_minutes) || 0;
          existingData.progress_status =
            parsed.progress_status || "in_progress";
          existingData.total_seconds = existingData.time_spent_minutes * 60;

          if (parsed.completed_at) {
            existingData.completed_at = parsed.completed_at;
          }
          if (parsed.started_at) {
            existingData.started_at = parsed.started_at;
          }
        } else {
          existingData = parsed;
        }
      } catch (e) {
        // Silent error
      }
    }

    const newSession = {
      start_time: Date.now() - elapsedSeconds * 1000,
      end_time: Date.now(),
      duration_seconds: elapsedSeconds,
    };

    if (!existingData.sessions) {
      existingData.sessions = [];
    }

    existingData.sessions.push(newSession);

    let totalSeconds = 0;
    existingData.sessions.forEach((session) => {
      totalSeconds += session.duration_seconds;
    });

    existingData.version = DATA_VERSION;
    existingData.total_seconds = totalSeconds;
    existingData.time_spent_minutes = Math.floor(totalSeconds / 60);
    existingData.updated_at = new Date().toISOString();
    existingData.last_activity = new Date().toISOString();

    if (
      !existingData.progress_status ||
      existingData.progress_status === "not_started"
    ) {
      existingData.progress_status = "in_progress";
    }

    localStorage.setItem(progressKey, JSON.stringify(existingData));

    return existingData.time_spent_minutes;
  }, []);

  const startTrackingTime = useCallback(
    (materialId) => {
      if (!materialId || !userId) {
        return;
      }

      if (sessionTimers.current[materialId]) {
        stopTrackingTime(materialId);
      }

      sessionTimers.current[materialId] = {
        startTime: Date.now(),
        totalSeconds: 0,
        isActive: true,
      };

      activeMaterials.current.add(materialId);

      const progressKey = `progress_${materialId}_${userId}`;
      const existingProgress = localStorage.getItem(progressKey);
      let progressData = existingProgress
        ? JSON.parse(existingProgress)
        : {
            version: DATA_VERSION,
            sessions: [],
            total_seconds: 0,
            time_spent_minutes: 0,
          };

      progressData.started_at =
        progressData.started_at || new Date().toISOString();
      progressData.last_activity = new Date().toISOString();
      progressData.progress_status = "in_progress";
      progressData.updated_at = new Date().toISOString();

      localStorage.setItem(progressKey, JSON.stringify(progressData));
    },
    [userId, stopTrackingTime],
  );

  const getTotalTimeSpent = useCallback(
    (materialId) => {
      if (!materialId || !userId) {
        return 0;
      }

      const progressKey = `progress_${materialId}_${userId}`;
      const existingProgress = localStorage.getItem(progressKey);

      if (!existingProgress) {
        return 0;
      }

      try {
        const progressData = JSON.parse(existingProgress);
        let minutes = 0;

        if (
          progressData.version === DATA_VERSION &&
          progressData.total_seconds
        ) {
          minutes = Math.floor(progressData.total_seconds / 60);
        } else {
          minutes = parseInt(progressData.time_spent_minutes) || 0;
        }

        const timer = sessionTimers.current[materialId];
        if (timer && timer.isActive) {
          const activeSeconds = Math.floor(
            (Date.now() - timer.startTime) / 1000,
          );
          const activeMinutes = Math.floor(activeSeconds / 60);
          return minutes + activeMinutes;
        }

        return minutes;
      } catch (e) {
        return 0;
      }
    },
    [userId],
  );

  const resetTimeTracking = useCallback(
    (materialId, forceCompleteReset = false) => {
      if (materialId) {
        if (sessionTimers.current[materialId]) {
          stopTrackingTime(materialId);
        }

        delete sessionTimers.current[materialId];
        activeMaterials.current.delete(materialId);

        const progressKey = `progress_${materialId}_${userId}`;

        if (forceCompleteReset) {
          localStorage.removeItem(progressKey);
        } else {
          const resetData = {
            version: DATA_VERSION,
            progress_status: "not_started",
            time_spent_minutes: 0,
            total_seconds: 0,
            sessions: [],
            started_at: null,
            completed_at: null,
            updated_at: new Date().toISOString(),
            reset_flag: true,
          };

          localStorage.setItem(progressKey, JSON.stringify(resetData));
        }
      }
    },
    [userId, stopTrackingTime],
  );

  const cleanupAllTimers = useCallback(() => {
    Object.keys(sessionTimers.current).forEach((materialId) => {
      if (sessionTimers.current[materialId]?.isActive) {
        stopTrackingTime(materialId);
      }
    });

    sessionTimers.current = {};
    activeMaterials.current.clear();
  }, [stopTrackingTime]);

  return {
    startTrackingTime,
    stopTrackingTime,
    getTotalTimeSpent,
    resetTimeTracking,
    cleanupAllTimers,
  };
};
