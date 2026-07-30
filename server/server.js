 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");


// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const interviewRoutes = require("./routes/interviewRoutes");


const app = express();


// ======================
// Database Connection
// ======================
connectDB();


// ======================
// Middleware
// ======================

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


app.use(
  express.json({
    limit: "10mb",
  })
);


// ======================
// Routes
// ======================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/user",
  userRoutes
);


app.use(
  "/api/interview",
  interviewRoutes
);



// ======================
// Home Route
// ======================

app.get("/", (req,res)=>{

  res.status(200).json({

    success:true,

    message:
    "AI Mock Interview Backend Running 🚀"

  });

});



// ======================
// 404 Route
// ======================

app.use((req,res)=>{

  res.status(404).json({

    success:false,

    message:"API route not found"

  });

});



// ======================
// Global Error Handler
// ======================

app.use((err,req,res,next)=>{

  console.error(err.stack);


  res.status(500).json({

    success:false,

    message:"Something went wrong"

  });

});




// ======================
// Server Start
// ======================

const PORT =
process.env.PORT || 5000;


app.listen(PORT,()=>{

 console.log(
  `🚀 Server running on port ${PORT}`
 );

});