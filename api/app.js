import express from "express"
import bodyParser from 'body-parser';
import cors from 'cors'
/* Routers */
import usersRoutes from './routers/users/routes.js';
import usersAppointments from './routers/appointments/routes.js';

// Middleware to parse JSON request body
const app = express()

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true)
        }
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.'
            return callback(new Error(msg), false)
        }

        return callback(null, true)
    },
    credentials: true
}))

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
app.use('/api/appointments', usersAppointments);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})





export default app;