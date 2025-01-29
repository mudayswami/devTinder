require("./config/database");
const express = require("express");
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {

    // console.log(req.body);

    try {
        const { firstName, lastName, emailId, password, gender, age } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            gender,
            age
        });
        await user.save();
        res.send("Data saved Successfully")
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/user", async (req, res) => {
    try {
        const data = await User.find({ "emailId": req.body.emailId });
        if (data.length === 0) {
            res.status(404).send("User not found");
        } else {

            res.send(data);
        }
        console.log(req.body.emailId);
        console.log(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.patch("/user", async (req, res) => {
    const user = req.body;
    const allowedUpdates = ["_id", "photoUrl", "about", "age", "skills", "firstName", "lastName", "gender"];

    // console.log(userId);
    try {
        const isUpdateAllowed = Object.keys(user).every((k) => allowedUpdates.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        const userData = await User.findByIdAndUpdate({ _id: user._id }, user, {
            returnDocument: "before",
            returnDocument: "after",
            runValidators: true,
        });
        console.log(userData);
        if (userData.length == 0) throw new Error("No user found");
        res.send(userData);

    } catch (err) {
        res.status(500).send("Error:" + err);
    }

});

app.post("/login", async (req, res) => {


    try {
        const { email, password } = req.body;
        const user = await User.findOne({ emailId: email });
        if (!user) {
            throw new Error("Invalid User Details");
        }
        const passHash = user.password;


        const isUserVaid = await bcrypt.compare(password, passHash);

        if (isUserVaid) {
            const token = await jwt.sign({ _id: user._id }, "Anubhav@Dev");
            res.cookie("token", token);
            res.send("User logged in successfully");
        } else {
            throw new Error("Password is not valid");
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }

});

app.get("/profile", userAuth, async (req, res) => {
    try {
        
        res.send(req.user);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
app.listen(7777, () => {
    console.log("Server is successfully listening on 3000");
});