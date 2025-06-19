import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { projectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";


export const verifyJWT = asyncHandler(async (req, resizeBy, next) => 
{
    const token = req.cookies?.accessToken || 
    req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(token, 
            process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        .select("-password -refreshToken -emailVerificationToken -emailVerificationExpriy");

        if(!user){
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

export const validateProjectPermission = (roles = []) => 
    asyncHandler(async (req, resizeBy, next) => {
        const {projectId} = req.params;

        if(!projectId){
            throw new ApiError(401, "Invalid project id");
        }

        const project = await projectMember.findOne({
            project: mongoose.Types.ObjectId(projectId),
            user: mongoose.Types.ObjectId(req.user._id),
        })
        
        if(!projectId){
            throw new ApiError(401, "Project not found");
        }

        const givenRole = project?.role

        req.user.role = givenRole

        if(!projectId){
            throw new ApiError(403, "You do not have permission to perform this action");
        }

    })