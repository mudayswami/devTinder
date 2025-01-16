const express = require("express");

const app = express();


app.get('/us+er', (req, res) =>{
    res.send ({firstName:"Anubhav"})
});

app.post("/user", (req,res) => {
    res.send("Data saved successfully");
});


app.patch("/user", (req,res) => {
    res.send("patch success");
})

app.delete("/user", (req,res) => {
    res.send("Update");
});

app.use("d",(req,res) =>  {
    res.send("Hello from the server");
});

app.listen(7777, ()=>{
    console.log("Server is successfully listening on 3000");
});