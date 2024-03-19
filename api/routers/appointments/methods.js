import pool from "../../server.js";

//NodeJS MySQL ==> counter SQL Injection 🤖
function formatDateTime(dateTimeString) {
    return new Date(dateTimeString).toISOString().slice(0, 19).replace('T', ' ');
}



export async function getAppointmentsByVendor(req, res, next) {
    try {
        const user_id = req.params.id;

        const [vendorResult] = await pool.query(`SELECT vendor_id FROM vendor WHERE user_id = ?`, [user_id]);
        const vendor_id = vendorResult[0].vendor_id;

        const [appointments] = await pool.query(`
        SELECT a.*, ab.buyer_id, u.id AS user_id, u.fullname AS buyer_name, u.email AS buyer_email, b.company_name
        FROM appointment a
        INNER JOIN vendor v ON a.vendor_id = v.vendor_id
        LEFT JOIN appointment_buyer ab ON a.appointment_id = ab.appointment_id
        LEFT JOIN buyer b ON ab.buyer_id = b.buyer_id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE v.vendor_id = ?;        
        `,
            [vendor_id]);


        const groupedAppointments = appointments.reduce((acc, appointment) => {
            if (!acc.has(appointment.appointment_id)) {
                acc.set(appointment.appointment_id, { ...appointment, buyer_names: [appointment.buyer_name] });
            } else {
                const existingAppointment = acc.get(appointment.appointment_id);
                existingAppointment.buyer_names.push(appointment.buyer_name);
                acc.set(appointment.appointment_id, existingAppointment);
            }
            return acc;
        }, new Map());


        const resultGroupedAppointments = [...groupedAppointments.values()];

        // Supprimer buyer_name de chaque rdv
        const result = resultGroupedAppointments.map(appointment => {
            const { buyer_name, ...rest } = appointment;
            return rest;
        });

        const mappedAppointments = result.map(appointment => ({
            appointment_id: appointment.appointment_id,
            title: appointment.title,
            description: appointment.description,
            type: appointment.type,
            location: appointment.location,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            vendor_id: appointment.vendor_id,
            created: appointment.created,
            buyer_names: {
                buyer_id: appointment.buyer_id,
                fullname: appointment.buyer_name,
                company_name: appointment.company_name,
                user_id: appointment.user_id,
                created: appointment.created
            }
        }));

        return res.status(200).send({ appointments: mappedAppointments });
    } catch (error) {
        next(error);
    }
}

export async function getAppointmentsByAppointmentBuyer(req, res, next) {
    try {
        const buyerId = req.params.id;
        const query = `
        SELECT appointment.*, vendor.fullname AS vendor_name
        FROM appointment
        INNER JOIN appointment_buyer ON appointment.appointment_id = appointment_buyer.appointment_id
        INNER JOIN buyer ON appointment_buyer.buyer_id = buyer.buyer_id
        INNER JOIN vendor ON appointment.vendor_id = vendor.vendor_id
        WHERE buyer.buyer_id = ?`;
        const [appointments] = await pool.query(query, [buyerId]);
        return res.status(200).send(appointments);
    } catch (error) {
        next(error);
    }
}

export async function createAppointment(req, res, next) {
    try {
        const { title, description, type, location, start_time, end_time, user_id, buyer_email } = req.body;
        const parseStart_time = formatDateTime(start_time);
        const parseEnd_time = formatDateTime(end_time);

        const [vendorResult] = await pool.query(`SELECT vendor_id FROM vendor WHERE user_id = ?`, [user_id]);
        const vendor_id = vendorResult[0].vendor_id;
        const [buyerResult] = await pool.query(`
        SELECT u.id AS user_id, b.* FROM users u LEFT JOIN buyer b ON u.id = b.user_id WHERE u.email LIKE ?;`, [buyer_email]);
        if (!vendorResult[0]) {
            return res.status(404).send("Your account is ");
        }
        if (!buyerResult[0]) {
            return res.status(404).send("Guest not found");
        }

        const [newAppointment] = await pool.query(
            `INSERT INTO appointment (title, description, type, location, start_time, end_time, vendor_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, type, location, parseStart_time, parseEnd_time, vendor_id]
        );

        const buyer_id = buyerResult[0].buyer_id

        const appointment_id = newAppointment.insertId;

        await pool.query(`INSERT INTO appointment_buyer (appointment_id, buyer_id) VALUES (?, ?)`,
            [appointment_id, buyer_id])

        const [appointments] = await pool.query(`
        SELECT a.*, ab.buyer_id, u.id AS user_id, u.fullname AS buyer_name, u.email AS buyer_email, b.company_name
        FROM appointment a
        INNER JOIN vendor v ON a.vendor_id = v.vendor_id
        LEFT JOIN appointment_buyer ab ON a.appointment_id = ab.appointment_id
        LEFT JOIN buyer b ON ab.buyer_id = b.buyer_id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE v.vendor_id = ?;        
        `,
            [vendor_id]);

        const mappedAppointments = appointments.map(appointment => ({
            appointment_id: appointment.appointment_id,
            title: appointment.title,
            description: appointment.description,
            type: appointment.type,
            location: appointment.location,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            vendor_id: appointment.vendor_id,
            created: appointment.created,
            buyer_names: {
                buyer_id: appointment.buyer_id,
                fullname: appointment.buyer_name,
                company_name: appointment.company_name,
                user_id: appointment.user_id,
                created: appointment.created
            }
        }));

        return res.status(201).send({ appointment: mappedAppointments });
    } catch (error) {
        next(error);
    }
}

export async function getAppointment(req, res, next) {
    try {
        const id = req.params.id;

        const [appointment] = await pool.query(`SELECT * FROM appointment WHERE appointment_id = ?`, [id]);
        if (!appointment[0]) {
            return res.status(404).send("Appointment not found");
        }
        return res.status(201).send(appointment)
    } catch (error) {
        next(error);
    }
}

export async function deleteAppointment(req, res, next) {
    try {
        const user_id = req.body.user_id
        const id = req.params.id;
        const [appointment] = await pool.query(`SELECT * FROM appointment WHERE appointment_id = ?`, [id]);
        console.log(appointment)
        if (!appointment[0]) {
            return res.status(404).send("Appointment not found");
        }
        await pool.query(`DELETE FROM appointment WHERE appointment_id = ?`, [id]);
        console.log(id, "id")
        const [vendorResult] = await pool.query(`SELECT vendor_id FROM vendor WHERE user_id = ?`, [user_id]);
        const vendor_id = vendorResult[0].vendor_id;
        console.log(vendor_id, "vendor_id")
        const [appointments] = await pool.query(`
        SELECT a.*, ab.buyer_id, u.id AS user_id, u.fullname AS buyer_name, u.email AS buyer_email, b.company_name
        FROM appointment a
        INNER JOIN vendor v ON a.vendor_id = v.vendor_id
        LEFT JOIN appointment_buyer ab ON a.appointment_id = ab.appointment_id
        LEFT JOIN buyer b ON ab.buyer_id = b.buyer_id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE v.vendor_id = ?;        
        `,
            [vendor_id]);

        console.log(appointments, "appointments")
        return res.status(200).send(appointments);
    } catch (error) {
        next(error);
    }
}

export async function searchAppointment(req, res, next) {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).send("Missing search term");
        }
        const [search] = await pool.query(`SELECT * FROM appointment WHERE title LIKE ? OR description LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]);
        return res.status(200).send(search);
    } catch (error) {
        next(error);
    }
}



export async function updateAppointment(req, res, next) {
    try {
        const { title, description, type, location, start_time, end_time } = req.body;
        const id = req.params.id;
        const parseStart_time = formatDateTime(start_time);
        const parseEnd_time = formatDateTime(end_time);

        const [appointment] = await pool.query(`SELECT * FROM appointment WHERE appointment_id = ?`, [id]);

        if (!appointment[0]) {
            return res.status(404).send("Appointment not found");
        }

        const i = await pool.query(
            `UPDATE appointment SET title = ?, description = ?, type = ?, location = ?, start_time = ?, end_time = ? WHERE appointment_id = ?`,
            [title, description, type, location, parseStart_time, parseEnd_time, id]
        );

        const [updatedAppointment] = await pool.query(`SELECT * FROM appointment WHERE appointment_id = ?`, [id]); console.log(i)
        return res.status(200).send(updatedAppointment);
    } catch (error) {
        next(error);
    }
}

