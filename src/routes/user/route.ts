import { Router } from "express";
import User from "../../controllers/user/User";
import { uploadImage } from "../../middleware/file/FirebaseUpload";
import multer, { memoryStorage } from "multer";
import { verifyToken } from "../../middleware/auth/Jwt";

const userRoutes = Router();

const Multer = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

userRoutes.post("/login", User.login);
userRoutes.post("/register-user", User.register);
userRoutes.put(
  "/edit-user",
  verifyToken,
  Multer.single("picture"),
  uploadImage,
  User.editUser
);

userRoutes.patch("/edit-password", verifyToken, User.changePassword);

userRoutes.get("/get-all-users", verifyToken, User.getAllUsers);

export default userRoutes;
