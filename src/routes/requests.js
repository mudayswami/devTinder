const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const { ConnectionRequest } = require("../models/connectionRequest");


requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {

    const toUserId = req.params.userId;
    const status = req.params.status;
    const fromUserId = req.user._id;

    try {
        const userExits = await User.findById(toUserId);

        if (!userExits) throw new Error("Invalid User");
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            // throw new Error("Status is not allowed");
            return res.status(400).send("Status is not allowed");
        }
        const connectionExist = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (connectionExist) throw new Error("Connection already exists");

        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });
        const connection = await connectionRequest.save();
        res.json({
            'message': req.user.firstName + ` request is sent to user`,
            "data": connection
        });
    } catch (err) {
        res.status(400).send(err.message);
    }


});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const status = req.params.status;
        const userId = req.user._id;

        const allowedStatus = ["accepted", "rejected"];
        const isStatusAllowed = allowedStatus.includes(status);
        if (!isStatusAllowed) throw new Error(status + "is not allowed");

        const checkRequest = await ConnectionRequest.findOne({ _id: requestId });
        if (!checkRequest) throw new Error("Request Not Found");

        checkRequest.status = status;

        const connection = checkRequest.save();
        res.json({ message: "It's a match", data: checkRequest });

    } catch (err) {
        res.status(400).send(err.message);
    }

});

module.exports = requestRouter;

