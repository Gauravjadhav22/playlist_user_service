import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { errorHandler } from "./middleware/ErrorHandler";
import session from "express-session";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SESSSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, 
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use("/home", (req, res) => res.send("welcome to the home page"));

app.use(errorHandler);
app.listen(port, () => console.log("server is up and running on " + port));
