const express = require('express');
const connectDb = require('./config/db');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');


connectDb();

const _dirname = path.resolve();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/food', require('./routes/foodRouter'));
app.use('/api/profile', require('./routes/profileRouter'));
app.use('/api/chat',require('./routes/chatBotRouter'))

app.use(express.static(path.join(_dirname , "/frontend/dist")));

app.get("*",(_,res)=>{
  res.sendFile(path.resolve(_dirname , "frontend" , "dist" , "index.html"));
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});