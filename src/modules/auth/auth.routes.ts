import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router();

router.get("/", authController.authWithFortify)
router.get("/fortify-code-verification", authController.codeVerification )




export default router