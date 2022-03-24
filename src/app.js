const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task');
const cors = require('cors');


const app = express();


app.use(express.json())
app.use(userRouter)
app.use(taskRouter);
app.use(cors());

module.exports = app
