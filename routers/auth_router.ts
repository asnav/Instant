import express from "express";
import {
  register,
  login,
  authenticate,
  logout,
} from "../controllers/auth_controller";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.get("/logout", authenticate, logout);

export default router;
