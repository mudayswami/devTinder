const mongoose = require("mongoose")

const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum :{
            values: ["interested","ignored","accepted","rejected"],
            mesage: `Status {VALUE} is not valid for path {PATH}`
        }
    },
}, {timestamps:true});

connectionSchema.pre("save",function(next){
    const connectionRequest =this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserid)){
        throw new Error("Cannot send request to yourself");
    }

    next()
})

connectionSchema.index({fromUserId:1, toUserId: 1});
const ConnectionRequest = mongoose.model("ConnectionRequest",connectionSchema);

module.exports = {ConnectionRequest};