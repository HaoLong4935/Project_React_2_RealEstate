import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken";
export const getPosts = async (req, res) => {
    const query = req.query
    console.log("Query get Post request ", query);
    try {
        const posts = await prisma.post.findMany(
            {
                where: {
                    city: query.city || undefined,
                    type: query.type || undefined,
                    property: query.property || undefined,
                    bedroom: parseInt(query.bedroom) || undefined,
                    price: {
                        gte: parseInt(query.minPrice) || 0,
                        lte: parseInt(query.maxPrice) || 10000000
                    }
                }
            }
            // {
            //     include: {
            //         postDetails: true
            //     }
            // }
        )

        setTimeout(() => {
            res.status(200).json(posts)
        }, 1000)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error failed post" })
    }
}


export const getPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetails: true,
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            }
        })

        let userId
        const token = req.cookies?.token;

        if (!token) {
            userId = null;
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (err) {
                    userId = null
                } else {
                    userId = payload.id
                }
            })
        }

        const saved = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    postId: id,
                    userId
                },
            },
        })
        res.status(200).json({ ...post, isSaved: saved ? true : false });
        // if (token) {
        //     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        //         if (!err) {
        //             const saved = await prisma.savedPost.findUnique({
        //                 where: {
        //                     userId_postId: {
        //                         postId,
        //                         userId: payload.id,
        //                     },
        //                 },
        //             });
        //             res.status(200).json({ ...post, isSaved: saved ? true : false });
        //         }
        //     });
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error failed post" })
    }
}


export const addPost = async (req, res) => {
    const body = req.body
    const tokenUserId = req.userId
    try {
        const postCreate = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetails: {
                    create: body.postDetails
                }
            }
        })
        res.status(200).json(postCreate)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error failed post" })
    }
}


export const updatePost = async (req, res) => {
    const body = req.body
    const tokenUserId = req.userId
    try {
        const post = await prisma.post.create({})
        res.status(200).json("Success")
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error failed post" })
    }
}


export const deletePost = async (req, res) => {
    const id = req.params.id
    const tokenUserId = req.userId
    try {
        // Find the post first 
        const post = await prisma.post.findUnique({
            where: { id }
        })
        // When have the post check it if it belongs to the user
        if (post.userId !== tokenUserId) {
            return res.status(500).json({ message: "Not Authorized!" })
        }
        await prisma.post.delete({
            where: { id }
        })
        res.status(200).json("Delete post Success")
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error failed post" })
    }
}