import { kafkaClient } from "./kafkaClient.js";

async function setup(){
    const admin = kafkaClient.admin();

    await admin.connect;

    await admin.createTopics({
        topics: [{topic: "location-updates", numPartitions: 2}]
    })

    await admin.disconnect();
}