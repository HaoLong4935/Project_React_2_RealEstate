import express from "express"
import { loginAdmin, logout, registerAdmin } from "../controller/admin.controller.js"
const router = express.Router()

router.post("/register", registerAdmin)
router.post("/login", loginAdmin)
router.post("/logout", logout)

export default router;