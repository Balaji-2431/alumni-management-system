const User = require("../models/User")
const jwt = require("jsonwebtoken")
const asyncHandler = require("../middleware/asyncHandler")
const sendResponse = require("../utils/sendResponse")

const register = asyncHandler(async(req,res)=>{
    const { name, registerNumber, department, batch, email, password } = req.body;

    const requireFields = {
      name:"Name is required",
      registerNumber:"Register number is required",
      department:"Department is required",
      batch:"Batch is required",
      email:"Email is required",
      password:"Password is required",
    }

    for (const field in requireFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          field,
          message: requireFields[field],
        });
      }
    }

    const emailNormalized = email.toLowerCase();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(409).json({
        success: false,
        field: "email",
        message: "User already exists",
      });
    }
    await User.create({
        name,
        registerNumber,
        email,
        password,
        department,
        batch,
        role: "alumni",
        isApproved : false
    })

    sendResponse(res, 201, {
      message: "Registration successful. Await admin approval."
    });

})


const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

if (!email) {
  return res.status(400).json({
    success: false,
    field: "email",
    message: "Email is required"
  });
}

if (!password) {
  return res.status(400).json({
    success: false,
    field: "password",
    message: "Password is required"
  });
}

  if (!email || !password || !role) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

if (!user) {
  return res.status(401).json({
    success: false,
    field: "email",
    message: "Email not registered"
  });
}
const isMatch = await user.matchPassword(password);

if (!isMatch) {
  return res.status(401).json({
    success: false,
    field: "password",
    message: "Incorrect password"
  });
}

  if (user.role !== role) {
    res.status(403);
    throw new Error("Unauthorized role");
  }

  if (!user.isApproved) {
    res.status(403);
    throw new Error("Account pending admin approval");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  sendResponse(res, 200, {
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    },
  });


});

module.exports = { register, login };