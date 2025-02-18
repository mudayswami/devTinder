const User = require("../models/user")
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token Invalid");
        }
        const decodedToken = await jwt.verify(token, "Anubhav@Dev");
        const { _id } = decodedToken;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next()
    }
    catch(err) {
        res.status(401).send(err.message)
    }


};

module.exports = {
    userAuth
}