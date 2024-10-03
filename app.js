import express, { application } from "express"
import postRoutes from './routes/post.route.js'
import authRoutes from './routes/auth.routs.js'
import testRoutes from './routes/test.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import adminRoutes from './routes/admin.route.js'
import messageRoutes from './routes/message.route.js'
import cookieParser from "cookie-parser"
import cors from 'cors'
const app = express()
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/test", testRoutes)
app.use("/api/auth/admin", adminRoutes)

app.listen(8800, () => {
    console.log("Server is running")
})