const express = require('express');
const cors = require('cors');
const connectDB = require('./connection/db');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000', // specify the allowed origin
  credentials: true, // enable credentials (cookies, authorization headers, etc.)
};
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
console.log("Hello");

app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
