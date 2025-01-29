const mongoose = require("mongoose")
const db_connect = async () =>{    
    await mongoose.connect("mongodb+srv://petoneto00:7XI5Cz4FNkORwDt8@node.28ir6.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Node");
}
db_connect().then(()=>{
    console.log("Database connected successfully");
}).catch((err) => {
    console.error("Database connected successfully");
})