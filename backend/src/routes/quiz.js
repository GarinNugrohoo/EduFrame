const router = require("express").Router();
const quizController = require("../controllers/quizController");
const questionController = require("../controllers/questionController");
const resultController = require("../controllers/resultsController");
const apikey = require("../middleware/apikey");

router.use(apikey.validasiApi);

// Public routes
router.get("/", quizController.getAllQuizzes);
router.get("/popular", quizController.getPopularQuizzes);
router.get("/search", quizController.searchQuizzes);
router.get("/:id", quizController.getQuizById);
router.get("/subject/:subject_id", quizController.getQuizzesBySubject);
router.get("/:id/with-questions", quizController.getQuizWithQuestions);
router.get("/:id/leaderboard", quizController.getQuizLeaderboard);
router.post("/:id/start", quizController.startQuiz);

// Result routes
router.post("/results/submit", resultController.submitResult);
router.get("/results/user/:user_id", resultController.getUserResults);
router.get("/results/quiz/:quiz_id", resultController.getQuizResults);
router.get("/results/:id", resultController.getResultById);
router.get("/results/quiz/:quiz_id/stats", resultController.getQuizStats);
router.get(
  "/results/quiz/:quiz_id/user-result",
  resultController.getUserQuizResult,
);
router.get("/results/user/:user_id/stats", resultController.getUserStats);
router.get("/results/user/:user_id/recent", resultController.getRecentAttempts);
router.get("/results/leaderboard/:quiz_id", resultController.getLeaderboard);
router.delete("/results/:id", resultController.deleteResult);
// Admin routes
// const adminRouter = express.Router();
// adminRouter.post("/", quizController.createQuiz);
// adminRouter.put("/:id", quizController.updateQuiz);
// adminRouter.delete("/:id", quizController.deleteQuiz);
// adminRouter.post("/:quiz_id/questions", questionController.createQuestion);
// adminRouter.post(
//   "/:quiz_id/questions/batch",
//   questionController.createBatchQuestions,
// );
// adminRouter.put("/questions/:id", questionController.updateQuestion);
// adminRouter.delete("/questions/:id", questionController.deleteQuestion);

module.exports = router;
