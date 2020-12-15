app=require("./app.js");
app.listen(app.get("puerto"),()=>{
    console.log(`servidor express ejecutandose en el puerto: ${app.get("puerto")}`)
});
