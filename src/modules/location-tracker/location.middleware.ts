import type {Request, Response, NextFunction} from "express"
import { ApiError } from "../../common/utils/apiError.js";
import { verifyAccessToken } from "../../common/utils/jwt.js";


export const locationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if(!accessToken) throw ApiError.badRequest("Access Token is missing")

    const decodedToken = verifyAccessToken(accessToken);

    if(!decodedToken) throw ApiError.unauthorized("Invalid Access Token")

    next();
}