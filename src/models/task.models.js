import mongoose, { Schema } from "mongoose";
import {AvailableTaskStatues, TaskStatusEnum} from "../utils/constants.js";

const taskSchema = new Schema(
    {
        tittle: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: AvailableTaskStatues,
            default: TaskStatusEnum.TODO,
        },
        attachments: {
            type: [
                {
                    url: String,
                    mimetype: String,
                    size: Number
                }
            ],
            default: []
        }
        
    }, 
    {timestamps: true}
);

export const Task = mongoose.model("Task", taskSchema);