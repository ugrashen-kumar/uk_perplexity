import 'dotenv/config'
import app from "./src/app.js";
import connectToDatabase from './src/config/database.js';
import { testAi } from './src/services/ai.service.js';
import http from 'http'
import { initSocket } from './src/sockets/server.socket.js';

const httpServer = http.createServer(app)

initSocket(httpServer)

const PORT = process.env.PORT || 8000

connectToDatabase()

testAi()

// app.listen(3000, ()=>{
//     console.log("Server is running on port 3000")
// })
httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})