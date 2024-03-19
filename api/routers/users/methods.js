import pool from "../../server.js";
import { SignJWT } from "jose";
import  Cookies  from "js-cookie";

//NodeJS MySQL ==> counter SQL Injection 🤖
const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function getAllUsers(req, res, next) {
    const [users] = await pool.query('SELECT * FROM users');
    return res.status(201).send(users);
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Missing email or password");
        }
        const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user[0]) {
            return res.status(404).send("User not found");
        }
        if (user[0].password !== password) {
            return res.status(401).send("Incorrect password");
        }
        
        const token_jwt = await new SignJWT({ email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(key);

        Cookies.set("token_jwt", token_jwt, {httpOnly: true });

        return res.status(200).send({ message: "Login successful", token: token_jwt, user:user[0] });
    } catch (error) {
        next(error);
    }
}

export async function createUser(req, res, next) {
    try {
        const { fullname, email, password, type, company_name } = req.body;
        if (!email) {
            return res.status(400).send("Missing email");
        }
        const [usersWithEmail] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (usersWithEmail.length > 0) {
            return res.status(400).send("User with this email already exists");
        }
        const [newUser] = await pool.query(
            `INSERT INTO users (fullname, email, password, type) VALUES (?, ?, ?, ?)`,
            [fullname, email, password, type]
        );

        const id = newUser.insertId;
        let additionalInfoQuery;
        if (type === 'vendor') {
            additionalInfoQuery = `INSERT INTO vendor (user_id, fullname) VALUES (?, ?)`;
        } else {
            additionalInfoQuery = `INSERT INTO buyer (user_id, fullname, company_name) VALUES (?, ?, ?)`;
        }

        await pool.query(
            additionalInfoQuery,
            [id, fullname, company_name]
        );

        const token_jwt = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .sign(key);

            Cookies.set("token_jwt", token_jwt, {httpOnly: true });

        const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
        return res.status(201).send({ user, token: token_jwt });
    } catch (error) {
        next(error);
    }
}

export async function getUser(req, res, next) {
    try {
        const id = req.params.id;
        const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
        if (!user[0]) {
            return res.status(404).send("User not found");
        }
        return res.send(user);
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const id = req.params.id;
        const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);

        if (!user[0]) {
            return res.status(404).send("User not found");
        }
        await pool.query(`DELETE FROM users WHERE id = ?`, [id]); 
        return res.status(200).send(`User deleted: ${user[0].fullname} (${user[0].email})`); 
    } catch (error) {
        next(error);
    }
}

export async function searchUser(q, next) {
    try {
        const searchTerm = q;
        if (!searchTerm) {
            return res.status(400).send("Missing search term");
        }
        const [search] = await pool.query(`SELECT * FROM users WHERE fullname LIKE ? OR email LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]);
        return res.status(200).send(search);
    } catch (error) {
        next(error);
    }
}
