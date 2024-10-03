import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to get users" })
    }
}

export const getUser = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to get users" })
    }
}

export const updateUser = async (req, res) => {
    const userId = req.params.id
    const token = req.userId
    const { password, avatar, ...inputs } = req.body
    if (userId != token) {
        res.status(403).json({ message: "Not Authorized" })
    }
    let updatePassword = null
    try {
        if (password) {
            updatePassword = await bcrypt.hash(password, 10)
        }


        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...inputs,
                ...(updatePassword && { password: updatePassword }),
                ...(avatar && { avatar: avatar })
            },
        });

        const { password: userPassword, ...rest } = updatedUser

        res.status(200).json(rest)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to get users" })
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.id
    const token = req.userId
    if (userId != token) {
        res.status(403).json({ message: "Not Authorized" })
    }
    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to get users" })
    }
}

export const savePost = async (req, res) => {
    const postId = req.body.postId
    const tokenUserId = req.userId
    console.log("The user and post id are:", { postId, tokenUserId })
    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                }
            }
        })

        //Nếu check đã có lưu rồi mà người dùng bấm lại lần nữa thì bỏ lưu
        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                }
            })
            return res.status(200).json({ message: "Post is remove from list" })
        }
        else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                }
            })
            return res.status(200).json({ message: "Post is saved to list" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to save post to list" })
    }
}

export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId
    console.log("User id khi fetch mylist la", tokenUserId);
    try {
        const userPosts = await prisma.post.findMany({
            where: {
                userId: tokenUserId
            }
        })
        const saved = await prisma.savedPost.findMany({
            where: {
                userId: tokenUserId
            },
            include: {
                post: true
            }
        })

        const savePosts = saved.map(item => item.post)
        res.status(200).json({ userPosts, savePosts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to get user profile post info" })
    }
}

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId],
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId],
                    },
                },
            },
        });
        res.status(200).json(number);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get profile posts!" });
    }
}