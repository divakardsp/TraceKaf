import { Router } from "express";
import * as locationController from "../location-tracker/location.controller.js"
import { locationMiddleware } from "./location.middleware.js";

const router = Router();

router.get("/", locationMiddleware ,locationController.liveLocationMap );



export default router;