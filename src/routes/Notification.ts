import express from "express";
import { create, getAll, read } from "../controllers/Notification";

const router= express.Router()

router.get('/notifications',getAll)
router.post('/notifications',create)
router.put('/notifications/:notification_id',read)