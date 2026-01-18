const RoadmapsModel = require("../models/roadmaps");

class RoadmapsController {
  // Get all roadmaps
  static async getAll(req, res) {
    try {
      const data = await RoadmapsModel.getAll();

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

  // Get roadmap by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await RoadmapsModel.getById(id);

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

  // Get roadmaps by subject ID
  static async getBySubjectId(req, res) {
    try {
      const { subject_id } = req.params;
      const data = await RoadmapsModel.getBySubjectId(subject_id);

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

  // Create new roadmap
  static async create(req, res) {
    try {
      const roadmapData = req.body;
      const data = await RoadmapsModel.create(roadmapData);

      if (!data.success) {
        return res.status(400).json(data);
      }

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  // Update roadmap
  static async update(req, res) {
    try {
      const { id } = req.params;
      const roadmapData = req.body;
      const data = await RoadmapsModel.update(id, roadmapData);

      if (!data.success) {
        if (data.message === "Roadmap tidak ditemukan") {
          return res.status(404).json(data);
        }
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

  // Delete roadmap
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await RoadmapsModel.delete(id);

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

  // Get active roadmaps only
  static async getActive(req, res) {
    try {
      const data = await RoadmapsModel.getActive();

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

  // Get roadmap with all details
  static async getRoadmapWithDetails(req, res) {
    try {
      const { id } = req.params;
      const data = await RoadmapsModel.getRoadmapWithDetails(id);

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
}

module.exports = RoadmapsController;
