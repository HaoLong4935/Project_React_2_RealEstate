import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js';
// ---- ADMIN ---- //
export const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const newAdmin = await prisma.admin.create({
            data: {
                username,
                email,
                password: hashPassword
            },
        })
        console.log(newAdmin)
        res.status(201).json({ message: "Admin create successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create admin!" })
    }
}

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body
    try {
        // CHECK IF USER EXISTS
        const adminRes = await prisma.admin.findUnique({
            where: { username },
        })
        if (!adminRes) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        // CHECK THE EMAIL AND PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, adminRes.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        // GENERATE COOKIE TOKEN AND SEND TO THE USER
        // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
        const age = 1000 * 60 * 60 * 24 * 7 // 1 Week

        const token = jwt.sign({
            id: adminRes.id,
            isAdmin: true
        }, process.env.JWT_SECRET_KEY, { expiresIn: age })

        const { password: adminPassword, ...adminInfo } = adminRes

        res.cookie("admin-token", token, {
            httpOnly: true,
            maxAge: age
            // secure: true
        }).status(200).json(adminInfo)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Login!" })
    }
}

export const logout = (req, res) => {
    res.clearCookie("admin-token").status(200).json({ message: "Logout Successfully!" });
}
