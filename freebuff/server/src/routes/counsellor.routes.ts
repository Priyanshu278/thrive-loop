import { Router } from "express";
import { getCounsellorOverview } from "../controllers/counsellor.controller.js";

const router = Router();

router.get("/overview", getCounsellorOverview);

export default router;
