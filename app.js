import express from "express";
import {mainRoute} from "./routes/mainRoute.js"
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(mainRoute);
const PORT = 3010;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})