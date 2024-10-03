import jwt from "jsonwebtoken"

export const shouldbeLoggedIn = async (req, res) => {
    console.log(req.userId);

    res.status(200).json({ message: "You are authenticated" })
}

export const shouldbeAdmin = async (req, res) => {
    const token = req.cookies.token
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Not Authenticated" })
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ message: "Token is not valid!" })
        if (!payload.isAdmin) {
            return res.status(403).json({ message: "Not Admin Role!" })
        }
    })

    res.status(200).json({ message: "Admin authenticated" })
}