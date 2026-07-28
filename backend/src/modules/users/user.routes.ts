import { Router } from "express";
import { userController } from "./user.controller";
import { validate } from "../../middlewares/validate";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "./user.schema";

const router = Router();

router.get("/current-user", userController.getCurrentUser);

router.patch(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile,
);

router.patch(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword,
);

router.delete(
  "/account",
  validate(deleteAccountSchema),
  userController.deleteAccount,
);

export default router;
