import dotenv from "dotenv";

dotenv.config();

import express, { Router } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./routes/route";


import { connectDB, db } from "./config/db";

const app = express();
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", router);

connectDB().then(() => {
    app.listen(8080, () => console.log("Server running on port 8080"));
}).catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
});