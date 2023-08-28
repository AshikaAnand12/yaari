const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const chats = require('./data/data');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require("path");

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
connectDB();

const app = express(); // creates an instance of express application

app.use(express.json()); // to accept json data in the body

const PORT = process.env.PORT || 5000;


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/fe/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "fe", "build", "index.html"))
  );
} 
else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('setup',(userData)=>{
        // Create a room for particular user
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('joined chat room: ',room);
    })

    socket.on('typing',(room)=>{
        socket.in(room).emit('typing');
    })

    socket.on('stop typing',(room)=>{
        socket.in(room).emit('stop typing');
    });

    socket.on('new message',(newMessageReceived)=>{
        var chat = newMessageReceived.chat;
        if(!chat.users) return console.log('Chat.users not defined');
        chat.users.forEach((user)=>{
            if(user._id == newMessageReceived.sender._id) return; // don't send to yourself.
            socket.in(user._id).emit('message received',newMessageReceived); // send to other users.
        })
    })
});
