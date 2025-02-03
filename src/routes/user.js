const express = require("express");
const router = express.Router();
const {userAuth} = require("../middleware/auth");
const {ConnectionRequest} = require("../models/connectionRequest");


router.get("/user/connections", userAuth, async (req, res) => {
    try { 
        const userId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" }
            ]
        }).populate("fromUserId","firstName lastName age skills").populate("toUserId","firstName lastName age skills");;
        const data = connections.map((key) => {
            if(key.fromUserId.toString() === userId.toString()){
                return key.toUserId;
            }
            return key.fromUserId;
        });
        console.log(data);
        res.send(connections);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const connections = await ConnectionRequest.find(
                { toUserId: userId, status: "interested" }
        ).populate("fromUserId","firstName lastName age skills")
        
        res.send(connections);
    } catch (err) {
        res.status(400).send(err.message);
    }
});



module.exports = router