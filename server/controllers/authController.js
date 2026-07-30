 const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================
// REGISTER USER
// ======================
const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    const normalizedEmail = email.toLowerCase().trim();


    const existingUser = await User.findOne({
      email: normalizedEmail,
    });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });



    res.status(201).json({
      success: true,
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });



  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// ======================
// LOGIN USER
// ======================
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success:false,
        message:"Email and password required"
      });
    }


 const user = await User.findOne({
  email: email.toLowerCase().trim(),
}).select("+password");


    if (!user) {
      return res.status(404).json({
        success:false,
        message:"User not found",
      });
    }



    const match = await bcrypt.compare(
      password,
      user.password
    );



    if (!match) {
      return res.status(401).json({
        success:false,
        message:"Invalid password",
      });
    }



    const token = jwt.sign(
      {
        id:user._id,
        email:user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn:"7d",
      }
    );



    res.status(200).json({
      success:true,
      message:"Login successful",

      token,

      user:{
        id:user._id,
        name:user.name,
        email:user.email,
      }

    });



  } catch(error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};



module.exports = {
  registerUser,
  loginUser,
};