const mongoose = require("mongoose")
const dbConnect = async () =>{    
    await mongoose.connect("mongodb+srv://petoneto00:7XI5Cz4FNkORwDt8@node.28ir6.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Node");
}

module.exports = dbConnect;