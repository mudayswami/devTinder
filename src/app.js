const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/",authRouter);
app.use("/",profileRouter);
// app.use("/",requestRouter);

connectDB().then(()=>{
    app.listen(7777, () => {
        console.log("Database Connected");
        console.log("Server is successfully listening on 3000");
    });
}).catch((err) => {
    console.error("Database cannot be connected");
})