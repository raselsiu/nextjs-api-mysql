const express = require('express')
const bycrypt = require('bcrypt');
const crs = require('cors');
const port = 3000;
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');

const corsOptions = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionSuccessStatus: 200
}
app.use(crs(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.post("/api/adduser", async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');

    const sql = "INSERT INTO users (name,email,username,password) VALUES (?, ?, ?, ?)";

    const hashedPassword = await bycrypt.hash(req.body.password, 10);


    const values = [req.body.name, req.body.email, req.body.username, hashedPassword];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json({ message: "Something unexpected has occured" + err });
        }

        return res.json({ success: "New User added successfully" });
    });
});


app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) res.json({ message: "Server error" });
        return res.json(result);
    });
});


app.delete("/api/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM users WHERE id=?";
    const values = [id];
    db.query(sql, values, (err, result) => {
        if (err)
            return res.json({ message: "Something unexpected has occured" + err });
        return res.json({ success: "Student successfully Deleted" });
    });
});


app.get("/api/getuser/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM users WHERE id= ?";
    const values = [id];
    db.query(sql, values, (err, result) => {
        if (err) res.json({ message: "Server error" });
        return res.json(result);
    });
});



app.put("/api/edit/:id", async (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE users SET name=?, email=?, username=? WHERE id=?";

    const values = [
        req.body.name,
        req.body.email,
        req.body.username,
        id,
    ];
    db.query(sql, values, (err, result) => {
        if (err)
            return res.json({ message: "Something unexpected has occured" + err });
        return res.json({ success: "User updated successfully" });
    });
});








app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});