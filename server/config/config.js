const mongoose= require("mongoose")

const connectDb= mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("mongodb is connected"))
.catch(()=>console.log("database not connected"))

module.exports= connectDb