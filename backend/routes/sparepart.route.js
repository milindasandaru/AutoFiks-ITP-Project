import express from "express";
import {
  createSparePart,
  updateSparePart,
  getSpareParts,
  getSparePartById,
  deleteSparePart,
} from "../controllers/sparepart.controller.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/create", upload.single("image"), createSparePart);
router.put("/update/:id", upload.single("image"), updateSparePart);
router.get("/get-spareparts", getSpareParts);
router.get("/get-sparepart/:id", getSparePartById);
router.delete("/delete/:id", deleteSparePart);

export default router;
