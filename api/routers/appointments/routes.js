import express from "express";
import {
    getAppointmentsByVendor,
    getAppointmentsByAppointmentBuyer,
    createAppointment,
    getAppointment,
    searchAppointment,
    deleteAppointment,
    updateAppointment
} from "./methods.js"

const router = express.Router()

router.route("/vendor/:id")
    .get(getAppointmentsByVendor)

router.route("/ab/:id")
    .get(getAppointmentsByAppointmentBuyer)

router.route("/create")
    .post(createAppointment)

router.route("/search")
    .get(searchAppointment)

router.route("/:id")
    .post(updateAppointment)

router.route("/delete/:id")
    .post(deleteAppointment)


export default router;