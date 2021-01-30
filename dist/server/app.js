"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var fs = require("fs");
var path = require("path");
var app = express();
var jsonParser = express.json();
console.log("hello server!");
app.use(express.static(path.join(__dirname, "../../public")));
var filePath = path.join(__dirname, "../assets/users.json");
app.get("/api/users", function (req, res) {
    var content = fs.readFileSync(filePath, "utf8");
    var users = JSON.parse(content);
    res.send(users);
});
app.get("/api/users/:id", function (req, res) {
    var id = req.params.id;
    var content = fs.readFileSync(filePath, "utf8");
    var users = JSON.parse(content);
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});
app.post("/api/users", jsonParser, function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var userName = req.body.name;
    var userAge = req.body.age;
    console.log("name: ", req.body);
    var user = { id: -1, name: userName, age: userAge };
    var data = fs.readFileSync(filePath, "utf8");
    var users = JSON.parse(data);
    // Look for a maximum id
    var id = Math.max.apply(Math, users.map(function (o) { return o.id; }));
    // Increase id by 1
    user.id = id + 1;
    // Add a new user to array
    users.push(user);
    data = JSON.stringify(users);
    // Rewrite a file with a new data
    fs.writeFileSync(filePath, data);
    res.send(user);
});
// Delete user using an id
app.delete("/api/users/:id", function (req, res) {
    var id = req.params.id;
    var data = fs.readFileSync(filePath, "utf8");
    var users = JSON.parse(data);
    var index = -1;
    // Looking for index of user in an array
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // Delete a user from an array using index
        var user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        // Sent a deleted user
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});
app.put("/api/users", jsonParser, function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var userId = req.body.id;
    var userName = req.body.name;
    var userAge = req.body.age;
    var data = fs.readFileSync(filePath, "utf8");
    var users = JSON.parse(data);
    var user;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            user = users[i];
            break;
        }
    }
    // Change a user data
    if (user) {
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        res.send(user);
    }
    else {
        res.status(404).send(user);
    }
});
var port = process.env.PORT || 3000;
var httpServer = http.createServer(app);
httpServer.listen(port, function () { console.log("Server started at port: " + port); });
