import type { Request, Response } from "express"
import path from "node:path";

export const liveLocationMap = async (req: Request, res: Response) => {
    const filePath = path.resolve(process.cwd(), "public", "index.html");
    return res.sendFile(filePath);
}
