import express from "express";
import { getOttReleases } from "../controllers/ottController.js";
import { validateQueryParams } from "../middleware/validateQuery.js";

const router = express.Router();

router.get("/releases", validateQueryParams, getOttReleases);

export default router;
