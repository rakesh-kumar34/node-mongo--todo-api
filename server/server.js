const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const mongoose = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//POST from Client
app.post('/todos', (req, res) => {
    let newtodo = new Todo({
        task: req.body.task
    });

    newtodo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET All Todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send(todos);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET indivdual todo
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    });
});

//DELETE a Todo
app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    });
});

//UPDATE a Todo
app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['task', 'completed']);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    });
});
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


