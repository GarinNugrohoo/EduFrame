const db = require("../config/database");

class RoadmapsDetail {
  static async getCompleteRoadmap(roadmapId, userId = null) {
    try {
      const roadmapQuery = `
        SELECT r.*, s.name as subject_name, s.code as subject_code, s.grade_level, s.semester as subject_semester, s.color
        FROM roadmaps r
        LEFT JOIN subjects s ON r.subject_id = s.id
        WHERE r.id = ?
      `;
      const [roadmapResult] = await db.query(roadmapQuery, [roadmapId]);

      if (roadmapResult.length === 0) {
        return {
          success: false,
          message: "Roadmap tidak ditemukan",
          data: null,
        };
      }

      const roadmap = roadmapResult[0];

      const semestersQuery = `
        SELECT * FROM semesters 
        WHERE roadmap_id = ? 
        AND is_active = TRUE
        ORDER BY order_index, semester_number
      `;
      const [semesters] = await db.query(semestersQuery, [roadmapId]);

      let userStats = null;
      if (userId) {
        const statsQuery = `
          SELECT * FROM user_roadmap_stats 
          WHERE roadmap_id = ? AND user_id = ?
        `;
        const [statsResult] = await db.query(statsQuery, [roadmapId, userId]);
        userStats = statsResult.length > 0 ? statsResult[0] : null;
      }

      let totalMaterials = 0;
      let completedMaterials = 0;
      let inProgressMaterials = 0;

      for (let semester of semesters) {
        const materialsQuery = `
          SELECT m.*, 
            (SELECT COUNT(*) FROM resources r WHERE r.material_id = m.id) as resource_count
          FROM materials m 
          WHERE m.semester_id = ? 
          AND m.is_published = TRUE
          ORDER BY m.order_index
        `;
        const [materials] = await db.query(materialsQuery, [semester.id]);

        totalMaterials += materials.length;

        for (let material of materials) {
          if (userId) {
            const progressQuery = `
              SELECT * FROM user_progress 
              WHERE material_id = ? AND user_id = ?
            `;
            const [progressResult] = await db.query(progressQuery, [
              material.id,
              userId,
            ]);

            if (progressResult.length > 0) {
              const progress = progressResult[0];
              material.user_progress = {
                progress_status: progress.progress_status,
                started_at: progress.started_at,
                completed_at: progress.completed_at,
                time_spent_minutes: progress.time_spent_minutes,
                notes: progress.notes,
              };

              if (progress.progress_status === "completed") {
                completedMaterials++;
              } else if (progress.progress_status === "in_progress") {
                inProgressMaterials++;
              }
            } else {
              material.user_progress = {
                progress_status: "not_started",
                started_at: null,
                completed_at: null,
                time_spent_minutes: 0,
                notes: null,
              };
            }
          }

          if (material.resource_count > 0) {
            const resourcesQuery = `
              SELECT id, resource_type, title, file_url, file_size, download_count
              FROM resources 
              WHERE material_id = ?
              ORDER BY created_at
            `;
            const [resources] = await db.query(resourcesQuery, [material.id]);
            material.resources = resources;
          } else {
            material.resources = [];
          }

          delete material.resource_count;
        }

        semester.materials = materials;
        semester.material_count = materials.length;
      }

      const progressPercentage =
        totalMaterials > 0
          ? Math.round((completedMaterials / totalMaterials) * 100)
          : 0;

      if (userId) {
        if (userStats) {
          const updateStatsQuery = `
            UPDATE user_roadmap_stats 
            SET total_materials = ?, completed_materials = ?, in_progress_materials = ?, 
                last_accessed = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `;
          await db.query(updateStatsQuery, [
            totalMaterials,
            completedMaterials,
            inProgressMaterials,
            userStats.id,
          ]);
        } else {
          const insertStatsQuery = `
            INSERT INTO user_roadmap_stats 
            (user_id, roadmap_id, total_materials, completed_materials, in_progress_materials, last_accessed)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `;
          await db.query(insertStatsQuery, [
            userId,
            roadmapId,
            totalMaterials,
            completedMaterials,
            inProgressMaterials,
          ]);
        }
      }

      const completeRoadmap = {
        ...roadmap,
        semesters: semesters,
        progress: {
          total_materials: totalMaterials,
          completed_materials: completedMaterials,
          in_progress_materials: inProgressMaterials,
          not_started_materials:
            totalMaterials - completedMaterials - inProgressMaterials,
          percentage: progressPercentage,
        },
        user_stats: userStats
          ? {
              total_time_spent: userStats.total_time_spent,
              last_accessed: userStats.last_accessed,
            }
          : null,
      };

      return {
        success: true,
        message: "Berhasil mengambil detail roadmap lengkap",
        data: completeRoadmap,
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateUserProgress(userId, materialId, progressData) {
    try {
      const {
        progress_status = "not_started",
        time_spent_minutes = 0,
        notes = null,
        started_at = null,
        full_reset = false,
      } = progressData;

      const materialCheckQuery = `
      SELECT m.id, s.roadmap_id 
      FROM materials m
      LEFT JOIN semesters s ON m.semester_id = s.id
      WHERE m.id = ?
    `;
      const [materialCheck] = await db.query(materialCheckQuery, [materialId]);

      if (materialCheck.length === 0) {
        return {
          success: false,
          message: "Material tidak ditemukan",
        };
      }

      const roadmapId = materialCheck[0].roadmap_id;
      const completedAt = progress_status === "completed" ? new Date() : null;

      let finalStartedAt = started_at;

      if (full_reset) {
        finalStartedAt = null;
      } else if (progress_status === "not_started") {
        finalStartedAt = null;
      } else if (progress_status === "in_progress") {
        if (started_at === null) {
          finalStartedAt = new Date();
        } else if (started_at) {
          finalStartedAt = started_at;
        } else {
          const checkProgressQuery = `
          SELECT started_at FROM user_progress 
          WHERE user_id = ? AND material_id = ?
        `;
          const [existing] = await db.query(checkProgressQuery, [
            userId,
            materialId,
          ]);

          if (existing.length > 0 && existing[0].started_at) {
            finalStartedAt = existing[0].started_at;
          } else {
            finalStartedAt = new Date();
          }
        }
      } else if (progress_status === "completed") {
        const checkProgressQuery = `
        SELECT started_at FROM user_progress 
        WHERE user_id = ? AND material_id = ?
      `;
        const [existing] = await db.query(checkProgressQuery, [
          userId,
          materialId,
        ]);

        if (existing.length > 0 && existing[0].started_at) {
          finalStartedAt = existing[0].started_at;
        } else if (started_at) {
          finalStartedAt = started_at;
        } else {
          finalStartedAt = new Date(Date.now() - time_spent_minutes * 60000);
        }
      }

      const checkProgressQuery = `
      SELECT id, started_at FROM user_progress 
      WHERE user_id = ? AND material_id = ?
    `;
      const [existingProgress] = await db.query(checkProgressQuery, [
        userId,
        materialId,
      ]);

      let result;
      if (existingProgress.length > 0) {
        const updateQuery = `
        UPDATE user_progress 
        SET progress_status = ?, 
            started_at = ?,  
            completed_at = ?, 
            time_spent_minutes = ?, 
            notes = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
        [result] = await db.query(updateQuery, [
          progress_status,
          finalStartedAt,
          completedAt,
          time_spent_minutes,
          notes,
          existingProgress[0].id,
        ]);
      } else {
        const insertQuery = `
        INSERT INTO user_progress 
        (user_id, material_id, progress_status, started_at, completed_at, time_spent_minutes, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
        [result] = await db.query(insertQuery, [
          userId,
          materialId,
          progress_status,
          finalStartedAt,
          completedAt,
          time_spent_minutes,
          notes,
        ]);
      }

      await this.updateUserRoadmapStats(userId, roadmapId);

      return {
        success: true,
        message: "Progress berhasil disimpan",
        data: {
          user_id: userId,
          material_id: materialId,
          progress_status: progress_status,
          started_at: finalStartedAt,
          completed_at: completedAt,
          time_spent_minutes: time_spent_minutes,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateUserRoadmapStats(userId, roadmapId) {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_materials,
          SUM(CASE WHEN up.progress_status = 'completed' THEN 1 ELSE 0 END) as completed_materials,
          SUM(CASE WHEN up.progress_status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_materials,
          SUM(up.time_spent_minutes) as total_time_spent
        FROM materials m
        LEFT JOIN semesters s ON m.semester_id = s.id
        LEFT JOIN user_progress up ON m.id = up.material_id AND up.user_id = ?
        WHERE s.roadmap_id = ? AND m.is_published = TRUE
      `;
      const [stats] = await db.query(statsQuery, [userId, roadmapId]);

      const checkStatsQuery = `
        SELECT id FROM user_roadmap_stats 
        WHERE user_id = ? AND roadmap_id = ?
      `;
      const [existingStats] = await db.query(checkStatsQuery, [
        userId,
        roadmapId,
      ]);

      if (existingStats.length > 0) {
        const updateQuery = `
          UPDATE user_roadmap_stats 
          SET total_materials = ?, completed_materials = ?, in_progress_materials = ?, 
              total_time_spent = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        await db.query(updateQuery, [
          stats[0].total_materials,
          stats[0].completed_materials || 0,
          stats[0].in_progress_materials || 0,
          stats[0].total_time_spent || 0,
          existingStats[0].id,
        ]);
      } else {
        const insertQuery = `
          INSERT INTO user_roadmap_stats 
          (user_id, roadmap_id, total_materials, completed_materials, in_progress_materials, total_time_spent)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.query(insertQuery, [
          userId,
          roadmapId,
          stats[0].total_materials,
          stats[0].completed_materials || 0,
          stats[0].in_progress_materials || 0,
          stats[0].total_time_spent || 0,
        ]);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async getUserMaterialProgress(userId, materialId) {
    try {
      const query = `
      SELECT * FROM user_progress 
      WHERE user_id = ? AND material_id = ?
    `;
      const [result] = await db.query(query, [userId, materialId]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      return null;
    }
  }

  static async completeMaterial(userId, materialId) {
    try {
      const currentProgress = await this.getUserMaterialProgress(
        userId,
        materialId,
      );

      let time_spent_minutes = 0;
      let startedAt = null;

      if (currentProgress) {
        startedAt = currentProgress.started_at;

        if (startedAt) {
          const startTime = new Date(startedAt);
          const endTime = new Date();
          const diffMs = endTime - startTime;
          const diffMinutes = Math.floor(diffMs / 60000);

          if (diffMinutes < 1) {
            time_spent_minutes = 1;
          } else if (diffMinutes > 480) {
            time_spent_minutes = 480;
          } else {
            time_spent_minutes = diffMinutes;
          }
        } else {
          startedAt = new Date();
          const existingTime = currentProgress.time_spent_minutes || 0;

          if (existingTime > 0 && existingTime <= 480 && existingTime !== 6) {
            time_spent_minutes = existingTime;
          } else {
            time_spent_minutes =
              await this.calculateDefaultTimeForMaterial(materialId);
          }
        }
      } else {
        startedAt = new Date();
        time_spent_minutes =
          await this.calculateDefaultTimeForMaterial(materialId);
      }

      const completedAt = new Date();

      if (currentProgress) {
        const updateQuery = `
        UPDATE user_progress 
        SET progress_status = 'completed',
            started_at = ?,  
            completed_at = ?,
            time_spent_minutes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND material_id = ?
      `;

        await db.query(updateQuery, [
          startedAt,
          completedAt,
          time_spent_minutes,
          userId,
          materialId,
        ]);
      } else {
        const insertQuery = `
        INSERT INTO user_progress 
        (user_id, material_id, progress_status, started_at, completed_at, time_spent_minutes)
        VALUES (?, ?, 'completed', ?, ?, ?)
      `;

        await db.query(insertQuery, [
          userId,
          materialId,
          "completed",
          startedAt,
          completedAt,
          time_spent_minutes,
        ]);
      }

      const materialCheckQuery = `
      SELECT s.roadmap_id 
      FROM materials m
      LEFT JOIN semesters s ON m.semester_id = s.id
      WHERE m.id = ?
    `;
      const [materialCheck] = await db.query(materialCheckQuery, [materialId]);

      if (materialCheck.length > 0) {
        const roadmapId = materialCheck[0].roadmap_id;
        await this.updateUserRoadmapStats(userId, roadmapId);
      }

      return {
        success: true,
        message: "Material berhasil diselesaikan",
        data: {
          user_id: userId,
          material_id: materialId,
          progress_status: "completed",
          started_at: startedAt,
          completed_at: completedAt,
          time_spent_minutes: time_spent_minutes,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Gagal menyelesaikan material",
        error: error.message,
      };
    }
  }

  static async calculateDefaultTimeForMaterial(materialId) {
    try {
      const query = `
      SELECT duration_minutes FROM materials WHERE id = ?
    `;
      const [result] = await db.query(query, [materialId]);

      if (result.length > 0 && result[0].duration_minutes) {
        const materialDuration = parseInt(result[0].duration_minutes) || 0;
        if (materialDuration > 0) {
          const percentage = 0.3;
          const defaultTime = Math.max(
            1,
            Math.floor(materialDuration * percentage),
          );
          return defaultTime;
        }
      }

      return 10;
    } catch (error) {
      return 10;
    }
  }

  static async startMaterial(userId, materialId) {
    try {
      const progressData = {
        progress_status: "in_progress",
        time_spent_minutes: 0,
        started_at: new Date(),
      };

      return await this.updateUserProgress(userId, materialId, progressData);
    } catch (error) {
      throw error;
    }
  }

  static async resetMaterialProgress(userId, materialId) {
    try {
      const progressData = {
        progress_status: "not_started",
        time_spent_minutes: 0,
        started_at: null,
        completed_at: null,
        notes: null,
      };

      return await this.updateUserProgress(userId, materialId, progressData);
    } catch (error) {
      throw error;
    }
  }

  static async getRoadmapLeaderboard(roadmapId, limit = 10) {
    try {
      const query = `
        SELECT 
          urs.user_id,
          u.username,
          u.email,
          urs.completed_materials,
          urs.total_materials,
          urs.total_time_spent,
          ROUND((urs.completed_materials / urs.total_materials) * 100, 1) as completion_rate,
          urs.last_accessed
        FROM user_roadmap_stats urs
        LEFT JOIN users u ON urs.user_id = u.id
        WHERE urs.roadmap_id = ?
        ORDER BY urs.completed_materials DESC, urs.last_accessed DESC
        LIMIT ?
      `;
      const [data] = await db.query(query, [roadmapId, limit]);

      return {
        success: true,
        message: "Berhasil mengambil leaderboard",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getRecentActivity(roadmapId, limit = 20) {
    try {
      const query = `
        SELECT 
          up.user_id,
          u.username,
          m.title as material_title,
          up.progress_status,
          up.started_at,
          up.completed_at,
          up.time_spent_minutes,
          up.updated_at,
          s.semester_number,
          s.title as semester_title
        FROM user_progress up
        LEFT JOIN users u ON up.user_id = u.id
        LEFT JOIN materials m ON up.material_id = m.id
        LEFT JOIN semesters s ON m.semester_id = s.id
        WHERE s.roadmap_id = ?
        ORDER BY up.updated_at DESC
        LIMIT ?
      `;
      const [data] = await db.query(query, [roadmapId, limit]);

      return {
        success: true,
        message: "Berhasil mengambil aktivitas terbaru",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getRoadmapAnalytics(roadmapId) {
    try {
      const completionQuery = `
        SELECT 
          COUNT(DISTINCT urs.user_id) as total_users,
          AVG(urs.completed_materials) as avg_completed,
          MAX(urs.completed_materials) as max_completed,
          MIN(urs.completed_materials) as min_completed,
          AVG(urs.total_time_spent) as avg_time_spent,
          SUM(urs.total_time_spent) as total_time_spent_all_users
        FROM user_roadmap_stats urs
        WHERE urs.roadmap_id = ?
      `;
      const [completionStats] = await db.query(completionQuery, [roadmapId]);

      const difficultyQuery = `
        SELECT 
          m.id,
          m.title,
          COUNT(DISTINCT up.user_id) as total_users,
          SUM(CASE WHEN up.progress_status = 'completed' THEN 1 ELSE 0 END) as completed_users,
          ROUND((SUM(CASE WHEN up.progress_status = 'completed' THEN 1 ELSE 0 END) / COUNT(DISTINCT up.user_id)) * 100, 1) as completion_rate
        FROM materials m
        LEFT JOIN user_progress up ON m.id = up.material_id
        WHERE m.semester_id IN (SELECT id FROM semesters WHERE roadmap_id = ?)
        GROUP BY m.id
        ORDER BY completion_rate ASC
        LIMIT 10
      `;
      const [difficultMaterials] = await db.query(difficultyQuery, [roadmapId]);

      const engagementQuery = `
        SELECT 
          DATE(up.updated_at) as date,
          COUNT(DISTINCT up.user_id) as active_users,
          COUNT(*) as total_activities,
          SUM(CASE WHEN up.progress_status = 'completed' THEN 1 ELSE 0 END) as completed_activities
        FROM user_progress up
        LEFT JOIN materials m ON up.material_id = m.id
        LEFT JOIN semesters s ON m.semester_id = s.id
        WHERE s.roadmap_id = ? 
          AND up.updated_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
        GROUP BY DATE(up.updated_at)
        ORDER BY date DESC
      `;
      const [engagementData] = await db.query(engagementQuery, [roadmapId]);

      return {
        success: true,
        message: "Berhasil mengambil analitik roadmap",
        data: {
          completion_stats: completionStats[0],
          difficult_materials: difficultMaterials,
          engagement_data: engagementData,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoadmapsDetail;
