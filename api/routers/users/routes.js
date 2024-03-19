import express from "express";
import { getAllUsers, createUser, login, getUser, searchUser, deleteUser } from "./methods.js"

const router = express.Router()

router.route("/all")
    .get(getAllUsers)

router.route("/register")
    .post(createUser)

router.route("/login")
    .post(login)

router.route("/:id")
    .get(getUser)

router.route("/delete/:id")
    .delete(deleteUser)

export default router;