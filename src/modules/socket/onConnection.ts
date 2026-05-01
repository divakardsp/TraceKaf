import type { Socket } from "socket.io";
import { kafkaProducer } from "../../app.js";

export const onConnection = (socket: Socket) => {
    console.log(`Socket Connected [${socket.id}]`);

    socket.on("client:location-update", (data) => {
        console.log(
            `Location Update |${socket.user?.name}| lat:${data.latitude} | long:${data.longitude}`,
        );

        kafkaProducer.send({
            topic: "location-updates",
            messages: [
                {
                    key: socket.id,
                    value: JSON.stringify({
                        id: socket.id,
                        lat: data.latitude,
                        lon: data.longitude,
                        email: socket.user?.email,
                        name: socket.user?.name,
                    }),
                },
            ],
        });
    });
};
