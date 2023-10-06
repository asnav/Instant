import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth_controller";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/refresh", refresh);

router.get("/logout", logout);

export default router;
