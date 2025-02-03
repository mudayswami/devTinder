const express = require("express");
const authRouter = express.Router();

const User = require('../models/user');
const bcrypt = require('bcrypt');


authRouter.post("/signup", async (req, res) => {

    try {
        const { firstName, lastName, emailId, password, gender, age,skills } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            gender,
            age,
            skills
        });
        await user.save();
        res.send("Data saved Successfully")
    } catch (err) {
        res.status(500).send(err.message);
    }
});

authRouter.post("/login", async (req, res) => {


    try {
        const { email, password } = req.body;
        const user = await User.findOne({ emailId: email });
        if (!user) {
            throw new Error("Invalid User Details");
        }
        const isUserVaid = await user.validatePassword(password);

        if (isUserVaid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 900000)});
            res.send("User logged in successfully");
        } else {
            throw new Error("Password is not valid");
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }

});

authRouter.get("/logout",async (req,res) =>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logout Success!!!");
});

module.exports = authRouter;