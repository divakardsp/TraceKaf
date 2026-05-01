import express from "express";
import type { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";


import { Server } from "socket.io";

import fortifyRoutes from "./modules/auth/auth.routes.js";
import locationRoutes from "./modules/location-tracker/location.routes.js";
import { kafkaClient } from "./common/utils/kafkaClient.js";
import { socketMiddleware } from "./common/middleware/socketAuth.middleware.js";
import { onConnection } from "./modules/socket/onConnection.js";


const app: Express = express();

export const io = new Server();

export const kafkaProducer = kafkaClient.producer();

await kafkaProducer.connect();

const kafkaConsumer = kafkaClient.consumer({ groupId: `socket-server` });

await kafkaConsumer.connect();
await kafkaConsumer.subscribe({
    topics: ["location-updates"],
    fromBeginning: true,
});

kafkaConsumer.run({
    //@ts-ignore
    eachMessage: async ({ topic, partition, message }) => {
        //@ts-ignore
        const data = JSON.parse(message.value.toString());
        io.emit("server:location-updates", {
            id: data.id,
            name: data.name,
            email: data.email,
            latitude: data.lat,
            longitude: data.lon,
        });

        console.log(`KafkaConsumer Data Received`, { data });
    },
});
io.use((socket, next)=> socketMiddleware(socket,next))
io.on("connection", onConnection);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use("/", fortifyRoutes);
app.use("/auth",fortifyRoutes)


app.use("/live-location", locationRoutes);

export { app };
