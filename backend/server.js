// Create the Express server
// Initialize other variables
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // Used to connect with MongoDB
const todoRoutes = express.Router();
const PORT = 4000;

// Attaching the cors, body-parser middleware, and router
app.use(cors());
app.use(bodyParser.json());
app.use('/todos', todoRoutes);

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

mongoose.connect('mongodb://127.0.0.1:27017/todes', {
    useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

// Make serevr listen on port 4000
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});