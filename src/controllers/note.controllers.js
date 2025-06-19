import { ApiError } from "../utils/api-error.js";
import { Project } from "../models/project.models.js";
import { ProjectNote } from "../models/note.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/api-response.js";


const getNotes = async (req, res) => {
    // get all notes 
    const {projectId} = req.params 

    const project = await Project.findById(projectId) //  Project -> mongoose

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    const notes = await ProjectNote.find({
    project: new mongoose.Types.ObjectId(projectId)})
    .populate("createBy", "username fullname avatar")

    return res 
    .status(200)
    .json(new ApiResponse(200, notes,"Notes fetched successfully"))
};

const getNoteById = async (req, res) => {
    // get note by id
    const {noteId} = req.params 

    const note = await Project.findById(noteId)
    .populate("createBy", "username fullname avatar")

    if (!note){
        throw new ApiError(404, "Note not found");
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, note,"Note fetched successfully"))

};

const createNote = async (req, res) => {
    // create note
    const {projectId} = req.params 
    const {content} = req.body

    const project = await Project.findById(projectId)

    if (!project){
        throw new ApiError(404, "Project not found");
    }

    const note = ProjectNote.create({
        project: new mongoose.Types.ObjectId(projectId),
        content,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    })

    const populatedNote = await ProjectNote.findById(note._id)
    .populate("createBy", "username fullname avatar")

    return res 
    .status(200)
    .json(new ApiResponse(200, populatedNote,"Note created successfully"))
};

const updateNote = async (req, res) => {
    // update note
    const {noteId} = req.params 
    const {content} = req.body

    const existingNote = await ProjectNote.findById(noteId)

    if (!existingNote){
        throw new ApiError(404, "Note not found");
    }

    const note = await ProjectNote.findByIdAndUpdate(
    noteId, {content}, {new: true})
    .populate("createBy", "username fullname avatar")

    return res 
    .status(200)
    .json(new ApiResponse(200, note,"Note updated successfully"))

};

const deleteNote = async (req, res) => {
    // delete note
    const {noteId} = req.params

    const note = await ProjectNote.findByIdAndDelete(noteId)

    if (!note){
        throw new ApiError(404, "Note not found");
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, note,"Note deleted successfully"))


};

export { createNote, deleteNote, updateNote, getNotes, getNoteById };