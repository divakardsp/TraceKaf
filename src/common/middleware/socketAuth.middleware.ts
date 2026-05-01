import {parse} from "cookie"
import type { Socket } from "socket.io"
import type { NextFunction } from "express"
import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../utils/jwt.js";



export const socketMiddleware = (socket:Socket , next:any) => {
    try{
        const cookieHeader = socket.handshake.headers.cookie;
        if(!cookieHeader){
            throw ApiError.badRequest("No Cookies found")
        }

        const cookies = parse(cookieHeader);

        const token = cookies.accessToken;

        if(!token){
            throw ApiError.badRequest("Access Token is Missing")
        }

        const decodedAccessToken = verifyAccessToken(token) as {name: string, email: string}

        socket.user = {
            name: decodedAccessToken.name,
            email: decodedAccessToken.email,
        }

        next();
    }catch(error){
        if(error instanceof Error) console.log(error.message)

        console.log(error)
    }
}