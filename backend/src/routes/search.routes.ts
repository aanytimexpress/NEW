import { Router } from "express";
import {
  authorSearchController,
  categorySearchController,
  globalSearchController
} from "../controllers/search.controller.js";

const router = Router();

router.get("/", globalSearchController);
router.get("/category/:categoryId", categorySearchController);
router.get("/author/:authorId", authorSearchController);

export default router;
