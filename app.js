
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const crypto = require("crypto");
const dotenv = require("dotenv");
const path = require("path");
const { Server } = require("socket.io");
const Room = require("./models/roomModel");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log("Database connection successful"))
    .catch(err => console.error(err));

const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));
app.set("view engine", "ejs");

io.on("connection", socket => {
    console.log("New user joined");

    socket.on('join_room', roomid => {
        Room.findOne({ roomcode: roomid })
            .then((docs) => {
                if(docs) {
                    let code = docs.roomcode;
                    socket.join(code);
                    let roomUsers = io.sockets.adapter.rooms.get(code).size;
                    io.sockets.in(code).emit('room_joined', {roomcode: code, size: roomUsers});
                }else {
                    socket.emit('no_room', 'error');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });

    socket.on('alert_room_joined', data => {
        io.sockets.in(data.roomId).emit('alert_username', data.clientName);
    });

    socket.on('send_msg', data => {
        io.sockets.in(data.roomId).emit('recieve_msg', {sentBy: data.sender, sms: data.message});
    });
});

console.log(crypto.randomBytes(5).toString('hex'));

app.get('/', (req, res) => {
    res.render('index');
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
});

