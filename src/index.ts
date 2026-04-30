import {createServer} from "node:http";


import { app } from "./app.js";
import "dotenv/config.js"

const PORT = process.env.PORT

const server = createServer(app);



server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})

