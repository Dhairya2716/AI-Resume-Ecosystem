const mongoose = require("mongoose")
const dns = require("dns")

dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {

    try{

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected")

    }
    catch(err){
        console.log(err)
    }

}

module.exports = connectDB;