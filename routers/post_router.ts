import express from "express";
import {
  get_posts,
  add_new_post,
  get_post_by_id,
  update_post,
} from "../controllers/post_controller.js";
import { authenticate } from "../controllers/auth_controller.js";

const router = express.Router();

router.get("/", get_posts);

router.get("/:id", get_post_by_id);

router.post("/", authenticate, add_new_post);

router.put("/:id", authenticate, update_post);

export default router;
