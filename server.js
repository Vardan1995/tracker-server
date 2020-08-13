var express = require('express');
var app = express();
const fs = require("fs")
const cors = require('cors');
const mongoose = require("mongoose")
const server = require("http").Server(app)
const io = require("./soket/soket").listen(server)
const config = require('config');
const auth = require("./middleware/auth")
const userController = require("./controllers/userController")
const isAuth = require("./controllers/isAuth")
// const admin = require('./middleware/admin');
// const dashboardController = require("./controllers/dashboardController")
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
/////////
// io.use((socket, next) => {
//     let token = socket.handshake.query.token;
//     // console.log(token);
//     if (isAuth(token)) {
//         return next();
//     }
//     return next(new Error('authentication error'));

// });
//////
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/trackerAPI', { useNewUrlParser: true, useUnifiedTopology: true })/////
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile("./login.html")
})
app.post("/login", userController.login)
app.post("/create", auth, userController.create)



let PORT = process.env.PORT || 8080;

server.listen(PORT, function () {
    console.log('Server is listening on ', PORT);
});