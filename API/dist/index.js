"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db = require("../connection/connection");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
let users = [
    {
        id: 1,
        name: "kamu",
    },
    {
        id: 2,
        name: "adriq",
    },
    {
        id: 3,
        name: "dia",
    },
    {
        id: 4,
        name: "adriq",
    },
];
//create
app.post("/users", (req, res) => {
    const newUser = {
        name: req.body.name,
        id: Date.now(),
    };
    users.push(newUser);
    res.json(newUser);
});
//read
app.get("/users", (req, res) => {
    db.query("SELECT * FROM courses", (error, result) => {
        console.log(result);
    });
    res.json(users);
});
//update
app.put("/users", (req, res) => {
    const { id, name } = req.body;
    users = users.map((user) => {
        if (user.id === id) {
            user.name = name;
        }
        return user;
    });
    res.json(users);
});
//delete
app.delete("/users", (req, res) => {
    const { id } = req.body;
    users = users.filter((user) => user.id !== id);
    res.json(users);
});
const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === "kanjut") {
        next();
    }
    else {
        res.status(401);
        res.json({ msg: "nonono" });
    }
};
//get one user
app.get("/users/:id", isAuth, (req, res) => {
    const id = +req.params.id;
    const user = users.find((user) => user.id === id);
    res.json(user);
});
//start
app.listen(port, () => {
    console.log(`Berjalan di link  http://localhost:${port}/users`);
});
//# sourceMappingURL=index.js.map