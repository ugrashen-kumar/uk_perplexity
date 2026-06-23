
import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import chatRouter from './routes/chat.routs.js'
import morgan from 'morgan'
import cors from "cors";
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: true,
    credentials: true,
    methods : [ "GET", "POST", "PUT", "DELETE" ],
  })
);


// health chech 
// app.get('/', (req, res)=>{
//     res.send(
//         {
//             message : "Server is running"
//         }
//     )
// })

app.use('/api/auth', authRouter)
app.use('/api/chats', chatRouter)

app.use(
  express.static(
    path.join(__dirname, "../public")
  )
);
// React SPA fallback
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public", "index.html")
  );
});
console.log(path.join(__dirname, "../public"));


export default app