var express = require("express");
var app = express();
var path = require("path");
var cors = require("cors")
const PORT = 3000;

var longpoll = require("express-longpoll")(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('static'));
app.use(cors())

longpoll.create("/poll");

app.post("/grzyb", function (req, res) {
    console.log(req.body)
    var data = req.body;
    longpoll.publish("/poll", data);
    res.end();
})


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"));
});

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
});