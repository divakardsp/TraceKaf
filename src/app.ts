import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import path from "node:path";

import fortifyRoutes from "./modules/auth/auth.routes.js"

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve("../public")));

app.use("/auth", fortifyRoutes)

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Authentication Success</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        h1 {
          color: #333;
          margin: 0 0 20px 0;
        }
        p {
          color: #666;
          margin: 0;
          font-size: 16px;
        }
        .success-icon {
          font-size: 50px;
          color: #28a745;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✓</div>
        <h1>Authentication Successful</h1>
        <p>You have successfully authenticated by Fortify</p>
      </div>
    </body>
    </html>
  `);
});

export { app };
