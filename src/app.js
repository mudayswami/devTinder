const express = require("express");

const app = express();

app.use("d",(req,res) =>  {
    res.send("Hello from the server");
});

app.listen(7777, ()=>{
    console.log("Server is successfully listening on 3000");
});