// Create the Express server
// Initialize other variables
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // Used to connect with MongoDB
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

// Attaching the cors, body-parser middleware, and router
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', {
    useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});


/*
    The function which is passed into the call of the method get
    is used to handle incoming HTTP GET requests on the /todos/ 
    URL path.

    We are calling Todos.find to retrieve a list of all todo items
    from the MongoDB database.  The find method takes one argument:
    a callback function which is executed once the result is available.
    Making sure that the results (available in todos) are added in JSON 
    format to the response body.
*/
todoRoutes.route('/').get(function(req, res){
    Todo.find(function(err, todos){
        if(err){
            console.log(err);
        }else{
            res.json(todos);
        }
    });
});

/*
    We are accepting the URL parameter id which can be accessed 
    through req.params.id.  Id is passed into the call of
    Todo.FindById to retrieve an issue item based on the ID.
    Once the todo object is ready and available, it is attached to 
    the http response in JSON.
*/
todoRoutes.route('/:id').get(function(req, res){
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});


/*
    New todo item is part of the HTTP POST request.
    In order to access it, use req.body and create a new instance
    of Todo.  Then save item to database
*/
todoRoutes.route('/add').post(function(req, res){
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});


/*
    This route is used to update an already existing todo item.
    Path ccontains a paramter:id.  Inside the callback function which
    is passed into the call of post, we retrieve the old todo item
    from the DB based off ID.  Then set todo property values 
    to what is avaiable in the request body.  Then call todo.save
    
*/
todoRoutes.route('/update/:id').post(function(req, res){
    Todo.findById(req.params.id, function(err, todo) {
        if(!todo){
            res.status(404).send("data not found");
        }else{
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

app.use('/todos', todoRoutes);

// Make serevr listen on port 4000
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});