const mongoose = require("mongoose");
const validation = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        trim:true,
        minLength:4,
        maxLength:15,
        required:true,
    },
    lastName:{
        type:String,
        trim:true,
        minLength:4,
        maxLength:15,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        Lowercase:true,
        trim:true,
        unique: true,
        validate(value){
            if(!validation.isEmail(value)){
                throw new Error("Email is not valid");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validation.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
        
    },
    age:{
        type:Number,
        minLength:20,
        maxLength:100,
        required:true
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    about:{
        type: String,
        default: "This is the default about section of the user!!",
    },
    photoUrl:{
        type:String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    skills:{
        type:[String]
    }
},{timestamps:true});

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Anubhav@Dev",{expiresIn : "7d"})
    return token;
}

userSchema.methods.validatePassword = async function(pass){
    const user = this;

    const isPasswordValid = await bcrypt.compare(pass,user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);