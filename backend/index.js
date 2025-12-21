import express, { urlencoded } from 'express';
import { configDotenv } from 'dotenv';
configDotenv();

import requestIp from 'request-ip';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';

import { startAutoAbsentCron } from './cron/autoAbsent.cron.js';

// routes
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import employeeRouter from './routes/employee.routes.js';
import departmentRouter from './routes/department.routes.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "my_secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    },
}));
app.use(requestIp.mw());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/department", departmentRouter);


startAutoAbsentCron(); // start cron

app.listen(PORT, () => {
    console.log("Server is running at PORT:", PORT);
})

