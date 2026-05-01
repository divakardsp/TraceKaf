import jwt from "jsonwebtoken";
import { createPublicKey } from "crypto";
import "dotenv/config.js";

type RsaJwk = {
    kty: "RSA",
    n: string,
    e: string,
    kid?: string,
    alg?: string,
    use?: string,
};


const getFortifyPublicKey = () => {
    console.log(process.env.FORTIFY_JWK)
    const jwkRaw = process.env.FORTIFY_JWK ;
    if (!jwkRaw) {
        throw new Error(
            "Missing Fortify JWK in env (FORTIFY_JWK or FORTIFY_KEY)",
        );
    }

    const jwk: RsaJwk = JSON.parse(jwkRaw);
    if (!jwk.n || !jwk.e) {
        throw new Error("Invalid Fortify JWK: missing 'n' or 'e'");
    }

    return createPublicKey({ key: jwk, format: "jwk" });
};

export const verifyIDToken = (token: string) => {
    const publicKey = getFortifyPublicKey();
    return jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
    });
};

interface PayloadAccessToken {
    name:string,
    email:string,
}
export const generateAccessToken = (payloadAccessToken: PayloadAccessToken) => {
    const token = jwt.sign(
        payloadAccessToken,
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || "1d",
        },
    );

    return token;
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};
