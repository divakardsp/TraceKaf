import {createServer} from "node:http";


import { app, io } from "./app.js";
import "dotenv/config.js"

const PORT = process.env.PORT

const server = createServer(app);

io.attach(server);

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})

