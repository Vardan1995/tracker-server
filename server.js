var express = require('express');
var app = express();
const fs = require("fs")
const cors = require('cors');
const mongoose = require("mongoose")
const server = require("http").Server(app)
const io = require("socket.io")(server)
const config = require('config');
// const admin = require('./middleware/admin');
const auth = require("./middleware/auth")
// const dashboardController = require("./controllers/dashboardController")
const userController = require("./controllers/userController")
// const isAuth = require("./controllers/isAuth")

app.use(express.static(__dirname));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}
const corsOptions = {
    exposedHeaders: 'x-auth-token',
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/trackerAPI', { useNewUrlParser: true, useUnifiedTopology: true })/////
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile("./login.html")
})
app.post("/login", userController.login)
app.post("/create", auth, userController.create)




io.on("connection", (socket) => {
    console.log("someone connected");
    socket.on("sendd", (data) => {
        // console.log(data.buf);
        socket.broadcast.emit('image', { image: true, buffer: data.buf.toString('base64'), info: data.info });
    })
    socket.on("alert", (message) => {
        // console.log("sok alert", message.message);
        socket.broadcast.emit("message", message)
    })
})


let PORT = process.env.PORT || 8080;

server.listen(PORT, function () {
    console.log('Server is listening on ', PORT);
});