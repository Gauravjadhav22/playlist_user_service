import express from "express";

const router = express.Router();

router.get("/user/:user_Id");
router.post("/login");
router.post("/signUp");
router.post("/user");
router.get("/users");
router.delete("/user/:user_Id");
router.put("/user/:user_Id");
