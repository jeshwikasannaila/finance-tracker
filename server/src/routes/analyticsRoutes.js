import express from "express";
import {
  getCategoryAnalytics,
  getMonthlyAnalytics,
  getSummary,
  setCategoryLimit,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);
router.get("/monthly", getMonthlyAnalytics);
router.get("/categories", getCategoryAnalytics);
router.put("/categories/limits", setCategoryLimit);

export default router;
