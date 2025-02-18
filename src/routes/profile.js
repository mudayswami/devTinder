const express = require("express");
const router = express.Router();

const User = require('../models/user');
const { userAuth } = require("../middleware/auth");
const { editValidaion } = require("../utils/validation");

router.get("/user", async (req, res) => {
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

router.patch("/user", async (req, res) => {
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

router.get("/profile", userAuth, async (req, res) => {
    try {
        console.log(req.user);
        if(!req.user){
            res.status(401).send("Login first");
        }
        res.send(req.user);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const valid = await editValidaion(req.body);

        if (!valid) throw new Error("Update is not allowed");
        
        const user = req.user;
        Object.keys(req.body).forEach((key) => {user[key] = req.body[key]});
        await user.save();
        res.json({message:`${user.firstName} , Porfile Updated`, data: user  });
    }catch(err){
        res.status(400).send(err.message);
    }

});

router.patch("/profile/password",userAuth,async (req, res) => {

});

module.exports = router;