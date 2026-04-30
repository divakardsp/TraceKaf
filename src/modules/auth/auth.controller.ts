import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const authWithFortify = async (req: Request, res: Response) => {
    const fortifyRedirectURL = await authService.authWithFortify();

    res.redirect(fortifyRedirectURL);
};

export const codeVerification = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const idToken = await authService.codeVerification(code);
    console.log(idToken)
    res.redirect("http://localhost:8000/");
};
