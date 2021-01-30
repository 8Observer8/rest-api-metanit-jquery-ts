import * as express from "express";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const app = express();
const jsonParser = express.json();

console.log("hello server!");
app.use(express.static(path.join(__dirname, "../../public")));

const filePath = path.join(__dirname, "../assets/users.json");

app.get("/api/users", function (req, res)
{
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    res.send(users);
});

app.get("/api/users/:id", function (req, res)
{
    const id = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    let user = null;
    for (var i = 0; i < users.length; i++)
    {
        if (users[i].id == id)
        {
            user = users[i];
            break;
        }
    }
    if (user)
    {
        res.send(user);
    }
    else
    {
        res.status(404).send();
    }
});

app.post("/api/users", jsonParser, function (req, res)
{
    if (!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userAge = req.body.age;
    console.log("name: ", req.body);

    let user = { id: -1, name: userName, age: userAge };

    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);

    // Look for a maximum id
    const id = Math.max.apply(Math, users.map(function (o) { return o.id; }))
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
app.delete("/api/users/:id", function (req, res)
{
    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    let index = -1;
    // Looking for index of user in an array
    for (var i = 0; i < users.length; i++)
    {
        if (users[i].id == id)
        {
            index = i;
            break;
        }
    }
    if (index > -1)
    {
        // Delete a user from an array using index
        const user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        // Sent a deleted user
        res.send(user);
    }
    else
    {
        res.status(404).send();
    }
});

app.put("/api/users", jsonParser, function (req, res)
{

    if (!req.body) return res.sendStatus(400);

    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;

    let data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    let user;
    for (var i = 0; i < users.length; i++)
    {
        if (users[i].id == userId)
        {
            user = users[i];
            break;
        }
    }
    // Change a user data
    if (user)
    {
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        res.send(user);
    }
    else
    {
        res.status(404).send(user);
    }
});

const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
httpServer.listen(port, () => { console.log(`Server started at port: ${port}`); });
