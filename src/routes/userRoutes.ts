import { Router } from "express";
import {
  deleteUser,
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/userController";
import { authenicateToken } from "../middlewares/auth";

const router = Router();
router.get("/", authenicateToken, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:userId", deleteUser);
export default router;
