const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
// Configure CORS globally
app.use(cors());

const router = express.Router();
const userRouter = require('./routes/Weather');

app.use("/api",userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
