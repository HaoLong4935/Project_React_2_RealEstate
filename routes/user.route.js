import express from "express"
import { deleteUser, getUser, getUsers, updateUser, savePost, profilePosts, getNotificationNumber } from "../controller/user.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
const router = express.Router()

router.get("/", getUsers)
// router.get("/search/:id", verifyToken, getUser)
router.put("/:id", verifyToken, updateUser)
router.delete("/:id", verifyToken, deleteUser)
router.post("/save", verifyToken, savePost)
router.get("/users/notification", verifyToken, getNotificationNumber)
router.get("/profilePosts", verifyToken, profilePosts)

export default router;