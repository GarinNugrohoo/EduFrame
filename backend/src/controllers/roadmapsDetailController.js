const RoadmapsDetail = require("../models/roadmapsDetail");

class RoadmapsDetailController {
  // Get complete roadmap with all details
  static async getCompleteRoadmap(req, res) {
    try {
      const { roadmapId } = req.params;
      const userId = req.user?.id || req.query.user_id || null;

      const data = await RoadmapsDetail.getCompleteRoadmap(roadmapId, userId);

      if (!data.success) {
        return res.status(404).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Update user progress
  static async updateUserProgress(req, res) {
    try {
      const { materialId } = req.params;
      const userId = req.user?.id || req.body.user_id;
      const progressData = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const data = await RoadmapsDetail.updateUserProgress(
        userId,
        materialId,
        progressData,
      );

      if (!data.success) {
        return res.status(400).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Get user progress for roadmap
  static async getUserRoadmapProgress(req, res) {
    try {
      const { roadmapId } = req.params;
      const userId = req.user?.id || req.query.user_id; // Adjust based on your auth system

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const data = await RoadmapsDetail.getUserRoadmapProgress(
        userId,
        roadmapId,
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  static async completeMaterial(req, res) {
    try {
      const { materialId } = req.params;
      const userId = req.user?.id || req.body.user_id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      console.log(`API: Completing material ${materialId} for user ${userId}`);

      // Log request body untuk debugging
      console.log("Request body:", req.body);

      // Panggil model TANPA meneruskan time_spent_minutes dari frontend
      const data = await RoadmapsDetail.completeMaterial(userId, materialId);

      if (!data.success) {
        return res.status(400).json(data);
      }

      // Log response untuk debugging
      console.log("Response data:", data.data);

      return res.status(200).json(data);
    } catch (error) {
      console.error("Controller error in completeMaterial:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Start learning material
  static async startMaterial(req, res) {
    try {
      const { materialId } = req.params;
      const userId = req.user?.id || req.body.user_id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const data = await RoadmapsDetail.startMaterial(userId, materialId);

      if (!data.success) {
        return res.status(400).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Reset material progress
  static async resetMaterialProgress(req, res) {
    try {
      const { materialId } = req.params;
      const userId = req.user?.id || req.body.user_id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const data = await RoadmapsDetail.resetMaterialProgress(
        userId,
        materialId,
      );

      if (!data.success) {
        return res.status(400).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Get roadmap leaderboard
  static async getRoadmapLeaderboard(req, res) {
    try {
      const { roadmapId } = req.params;
      const { limit = 10 } = req.query;

      const data = await RoadmapsDetail.getRoadmapLeaderboard(
        roadmapId,
        parseInt(limit),
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Get recent activity
  static async getRecentActivity(req, res) {
    try {
      const { roadmapId } = req.params;
      const { limit = 20 } = req.query;

      const data = await RoadmapsDetail.getRecentActivity(
        roadmapId,
        parseInt(limit),
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Get roadmap analytics
  static async getRoadmapAnalytics(req, res) {
    try {
      const { roadmapId } = req.params;

      const data = await RoadmapsDetail.getRoadmapAnalytics(roadmapId);

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }
}

module.exports = RoadmapsDetailController;
