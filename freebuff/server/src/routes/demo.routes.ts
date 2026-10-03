import { Router } from "express";
import { seedDemoCohort, resetDemoCohort } from "../controllers/demo.controller.js";

const router = Router();

router.post("/seed", seedDemoCohort);
router.post("/reset", resetDemoCohort);

export default router;
