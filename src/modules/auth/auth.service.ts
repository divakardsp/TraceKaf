import { ApiError } from "../../utils/apiError.js";
import { verifyIDToken } from "../../utils/jwt.js";

export const authWithFortify = async () => {
    const fortifyRoutes = await fetch(
        "http://localhost:5473/.well-known/openid-configuration",
        {
            method: "GET",
        },
    );
    const data: any = await fortifyRoutes.json();

    const redirectURL = `${data.data.authorization_endpoint}/${process.env.CLIENT_ID}`;

    return redirectURL;
};

export const codeVerification = async (code: string) => {
    if (!code) throw ApiError.badRequest("Code was Missing");

    const payload = {
        code,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    };
    const fortifyRoutes = await fetch(
        "http://localhost:5473/.well-known/openid-configuration",
        {
            method: "GET",
        },
    );

    const data: any = await fortifyRoutes.json();

    const tokenURL = `${data.data.token_endpoint}`;

    const idToken = await fetch(tokenURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const idTokenData = await idToken.json();


    // @ts-ignore
    const  decodedIDToken = verifyIDToken(idTokenData.data.idToken);
    

    return decodedIDToken;
};
