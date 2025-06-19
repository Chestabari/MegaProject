import { Router } from "express";
import { UserRolesEnum, AvailableUserRoles } from "../utils/constants";
import { validateProjectPermission } from "../middlewares/auth.middleware";
import { deleteNote, getNoteById, getNotes, updateNote } from "../controllers/note.controllers.js";

const router = Router();

router.route("/:projectId")
    .get(
        validateProjectPermission(AvailableUserRoles),
        getNotes)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createNote);

router
    .route("/:projectId/n/:noteId")
    .get(validateProjectPermission(AvailableUserRoles),
    getNoteById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]),
    updateNote)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteNote)

export default router;