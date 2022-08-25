// cors stand for cross origin resource sharing to ensure secure environment. 
// It is a functionality by browser to block any request from the server that I do not recognize.
// It blocks requests that potentially attempt to attack my server by default between different domain.
// To overcome this issue, we have to configure in our server by using middleware to allow resource sharing.

const express = require('express');
const cors = require('cors');
const todoDB = require('./database');

const app = express();
const port = 4000;

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json())

const QUERY = {
    GET_ALL: "select * from todos",
    GET_BY_ID: (id) => {
        return `SELECT * FROM todos WHERE id = ${id}`
    },
    INSERT_TODO: (todo) => {
        return `INSERT INTO todos (content) VALUES ("${todo}")`
    },
    DELETE_BY_ID: (id) => {
        return `DELETE from todos where id = ${id}`
    },
    EDIT_BY_ID: (id, newContent) => {
        return `UPDATE todos SET content = "${newContent}" WHERE id = ${id}`
    }
}

app.get("/todos", (req, res) => {
    todoDB.query(QUERY.GET_ALL, (err, data) => {
        res.send(data);
    })
})

app.get("/todos/:id", (req, res) => {
    todoDB.query(`${QUERY.GET_BY_ID(req.params.id)}`, (err, data) => {
        res.send(data)
    })
})

app.post("/todos", (req, res) => {
    todoDB.query(`${QUERY.INSERT_TODO(req.body.content)}`, (err, data) => {
        res.send({
            id: data.insertId,
            content: req.body.content
        })
    })
})

app.delete("/todos/:id", (req, res) => {
    todoDB.query(`${QUERY.DELETE_BY_ID(req.params.id)}`, (err, data) => {
        res.send({
            message: "success"
        })
    })
})

app.patch("/todos/:id", (req, res) => {
    todoDB.query(`${QUERY.EDIT_BY_ID(req.params.id, req.body.content)}`, (err, data) => {
        res.send({
            id: data.insertId,
            content: req.body.content
        })
    })
})

app.listen(port,() => {
    console.log(`Example app listening on port ${port}`)
})