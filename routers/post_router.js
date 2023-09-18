import express from "express";
import { get_posts, add_new_post, get_post_by_id } from "../controllers/post_controller.js";

const router = express.Router();
router.get("/", get_posts);
router.get("/:id", get_post_by_id);
router.post("/", add_new_post);

export default router;
