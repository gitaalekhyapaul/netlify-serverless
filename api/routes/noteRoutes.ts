import { Router } from "express";
const router: Router = Router();
import {
  postNotes,
  patchNotes,
  deleteNotes,
  getNotes,
} from "../controllers/noteControllers";
import NotesValidator from "../services/notes.validator";

router.post("/note", NotesValidator, postNotes);
router.patch("/note", NotesValidator, patchNotes);
router.delete("/note", NotesValidator, deleteNotes);
router.get("/note", NotesValidator, getNotes);

export default router;
