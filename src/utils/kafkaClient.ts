import { Kafka } from "kafkajs";

export const kafkaClient = new Kafka({
    clientId: "divakarlocal",
    brokers: ["localhost:9092"]
})