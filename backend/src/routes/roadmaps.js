/*
(KREDIT JANGAN DIHAPUS!!!)
EDUFRAME WEB APP
VERSION : 1.0
DEV BY : GARIN NUGROHO
*/

const router = require("express").Router();
const roadmapsController = require("../controllers/roadmapsController");
const roadmapsDetailController = require("../controllers/roadmapsDetailController");
const apikey = require("../middleware/apikey");

router.use(apikey.validasiApi);

router.get("/", roadmapsController.getAll);
router.get("/active", roadmapsController.getActive);
router.get("/:id", roadmapsController.getById);
router.get("/:id/details", roadmapsController.getRoadmapWithDetails);
router.get("/subject/:subject_id", roadmapsController.getBySubjectId);
router.post("/", roadmapsController.create);
router.put("/:id", roadmapsController.update);
router.delete("/:id", roadmapsController.delete);
router.get("/:roadmapId/complete", roadmapsDetailController.getCompleteRoadmap);
router.get(
  "/:roadmapId/progress",
  roadmapsDetailController.getUserRoadmapProgress,
);
router.get(
  "/:roadmapId/leaderboard",
  roadmapsDetailController.getRoadmapLeaderboard,
);
router.get("/:roadmapId/activity", roadmapsDetailController.getRecentActivity);
router.get(
  "/:roadmapId/analytics",
  roadmapsDetailController.getRoadmapAnalytics,
);
router.post(
  "/materials/:materialId/progress",
  roadmapsDetailController.updateUserProgress,
);
router.post(
  "/materials/:materialId/start",
  roadmapsDetailController.startMaterial,
);
router.post(
  "/materials/:materialId/complete",
  roadmapsDetailController.completeMaterial,
);
router.post(
  "/materials/:materialId/reset",
  roadmapsDetailController.resetMaterialProgress,
);

module.exports = router;
