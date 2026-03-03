const mongoose = require("mongoose")
const User = require("../models/User")
const dbConnect = require("../config/dbConnect")
const asyncHandler = require("../middleware/asyncHandler")
dbConnect()

const seedAdmin =asyncHandler(async() => {

    const adminEmail = ""

    const adminExists = await User.findOne({email: adminEmail})

    if(adminExists){
        process.exit()
    }

    await User.create({
        name: "",
        email: "",
        password: "",
        role: "admin",
        isApproved: true
    })

    process.exit()
})

seedAdmin()