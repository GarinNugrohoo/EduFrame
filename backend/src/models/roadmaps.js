const db = require("../config/database");

class roadmaps {
  // Get all roadmaps
  static async getAll() {
    try {
      const query = `
        SELECT r.*, s.name as subject_name, s.code as subject_code 
        FROM roadmaps r
        LEFT JOIN subjects s ON r.subject_id = s.id
        ORDER BY r.created_at DESC
      `;
      const [data] = await db.query(query);

      if (data.length === 0) {
        return {
          success: false,
          message: "Data roadmaps tidak ditemukan",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil data roadmaps",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get roadmap by ID
  static async getById(id) {
    try {
      const query = `
        SELECT r.*, s.name as subject_name, s.code as subject_code 
        FROM roadmaps r
        LEFT JOIN subjects s ON r.subject_id = s.id
        WHERE r.id = ?
      `;
      const [data] = await db.query(query, [id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Roadmap tidak ditemukan",
          data: null,
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil data roadmap",
        data: data[0],
      };
    } catch (error) {
      throw error;
    }
  }

  // Get roadmaps by subject ID
  static async getBySubjectId(subject_id) {
    try {
      const query = `
        SELECT r.*, s.name as subject_name, s.code as subject_code 
        FROM roadmaps r
        LEFT JOIN subjects s ON r.subject_id = s.id
        WHERE r.subject_id = ?
        ORDER BY r.title
      `;
      const [data] = await db.query(query, [subject_id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Roadmap untuk subject ini tidak ditemukan",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil data roadmaps",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  // Create new roadmap
  static async create(roadmapData) {
    try {
      const {
        subject_id,
        title,
        description,
        total_hours = 0,
        is_active = true,
      } = roadmapData;

      // Check if subject exists
      const checkSubjectQuery = "SELECT id FROM subjects WHERE id = ?";
      const [subjectCheck] = await db.query(checkSubjectQuery, [subject_id]);

      if (subjectCheck.length === 0) {
        return {
          success: false,
          message: "Subject tidak ditemukan",
        };
      }

      const query = `
        INSERT INTO roadmaps (subject_id, title, description, total_hours, is_active) 
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(query, [
        subject_id,
        title,
        description,
        total_hours,
        is_active,
      ]);

      return {
        success: true,
        message: "Roadmap berhasil dibuat",
        data: {
          id: result.insertId,
          ...roadmapData,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Update roadmap
  static async update(id, roadmapData) {
    try {
      const { subject_id, title, description, total_hours, is_active } =
        roadmapData;

      // Check if roadmap exists
      const checkQuery = "SELECT id FROM roadmaps WHERE id = ?";
      const [checkResult] = await db.query(checkQuery, [id]);

      if (checkResult.length === 0) {
        return {
          success: false,
          message: "Roadmap tidak ditemukan",
        };
      }

      // Check if subject exists
      if (subject_id) {
        const checkSubjectQuery = "SELECT id FROM subjects WHERE id = ?";
        const [subjectCheck] = await db.query(checkSubjectQuery, [subject_id]);

        if (subjectCheck.length === 0) {
          return {
            success: false,
            message: "Subject tidak ditemukan",
          };
        }
      }

      // Build dynamic update query
      let updateFields = [];
      let values = [];

      if (subject_id !== undefined) {
        updateFields.push("subject_id = ?");
        values.push(subject_id);
      }

      if (title !== undefined) {
        updateFields.push("title = ?");
        values.push(title);
      }

      if (description !== undefined) {
        updateFields.push("description = ?");
        values.push(description);
      }

      if (total_hours !== undefined) {
        updateFields.push("total_hours = ?");
        values.push(total_hours);
      }

      if (is_active !== undefined) {
        updateFields.push("is_active = ?");
        values.push(is_active);
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          message: "Tidak ada data yang diperbarui",
        };
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      const query = `UPDATE roadmaps SET ${updateFields.join(", ")} WHERE id = ?`;

      await db.query(query, values);

      return {
        success: true,
        message: "Roadmap berhasil diperbarui",
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete roadmap
  static async delete(id) {
    try {
      const checkQuery = "SELECT id FROM roadmaps WHERE id = ?";
      const [checkResult] = await db.query(checkQuery, [id]);

      if (checkResult.length === 0) {
        return {
          success: false,
          message: "Roadmap tidak ditemukan",
        };
      }

      const query = "DELETE FROM roadmaps WHERE id = ?";
      await db.query(query, [id]);

      return {
        success: true,
        message: "Roadmap berhasil dihapus",
      };
    } catch (error) {
      throw error;
    }
  }

  // Get active roadmaps only
  static async getActive() {
    try {
      const query = `
        SELECT r.*, s.name as subject_name, s.code as subject_code 
        FROM roadmaps r
        LEFT JOIN subjects s ON r.subject_id = s.id
        WHERE r.is_active = TRUE
        ORDER BY r.title
      `;
      const [data] = await db.query(query);

      if (data.length === 0) {
        return {
          success: false,
          message: "Tidak ada roadmap aktif",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil data roadmaps aktif",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get roadmap with all details (semesters, materials)
  static async getRoadmapWithDetails(id) {
    try {
      // Get roadmap basic info
      const roadmapQuery = `
        SELECT r.*, s.name as subject_name, s.code as subject_code 
        FROM roadmaps r
        LEFT JOIN subjects s ON r.subject_id = s.id
        WHERE r.id = ?
      `;
      const [roadmapResult] = await db.query(roadmapQuery, [id]);

      if (roadmapResult.length === 0) {
        return {
          success: false,
          message: "Roadmap tidak ditemukan",
          data: null,
        };
      }

      // Get semesters
      const semestersQuery = `
        SELECT * FROM semesters 
        WHERE roadmap_id = ? 
        ORDER BY order_index, semester_number
      `;
      const [semesters] = await db.query(semestersQuery, [id]);

      // Get materials for each semester
      for (let semester of semesters) {
        const materialsQuery = `
          SELECT m.*, 
            (SELECT COUNT(*) FROM resources r WHERE r.material_id = m.id) as resource_count
          FROM materials m 
          WHERE m.semester_id = ? 
          ORDER BY m.order_index
        `;
        const [materials] = await db.query(materialsQuery, [semester.id]);
        semester.materials = materials;

        // Get resources for each material
        for (let material of materials) {
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
        }
      }

      const roadmap = roadmapResult[0];
      roadmap.semesters = semesters;

      return {
        success: true,
        message: "Berhasil mengambil detail roadmap",
        data: roadmap,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = roadmaps;
