const express = require("express");
const router = express.Router();
const {userAuth} = require("../middleware/auth");
const {ConnectionRequest} = require("../models/connectionRequest");
const User = require("../models/user")



router.get("/user/connections", userAuth, async (req, res) => {
    try { 
        const userId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" }
            ]
        }).populate("fromUserId","firstName lastName age skills about photoUrl gender").populate("toUserId","firstName lastName age skills gender about photoUrl");;
        const data = connections.map((key) => {
            if(key.fromUserId.equals(userId)){
                return key.toUserId;
            }
            return key.fromUserId;
        });
        res.send(data);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const connections = await ConnectionRequest.find(
                { toUserId: userId, status: "interested" }
        ).populate("fromUserId","firstName lastName age skills photoUrl gender about")
        res.send(connections);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/user/feed", userAuth , async (req,res) => {
    const user = req.user;
    const exception = await ConnectionRequest.find(
        {$or:[
            {fromUserId : user._id}, {toUserId: user._id}
        ]}
    );
    const exceptionIds = new Set();
    exception.map((val) => {
        exceptionIds.add(val.fromUserId.toString());
        exceptionIds.add(val.toUserId.toString());
    });

    const feed = await User.find({
        $and:[
            {_id:{$nin:Array.from(exceptionIds)}}
            ,{_id:{$ne:user._id}}
        ]}).select('_id firstName lastName age gender photoUrl skills').limit(2);

    res.send(feed)
});

module.exports = router 