const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const main = async () =>
// {
//     const user =await User.findById('5e6a0977382158929c960e9f')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

// const pet = 
// {
//     name:'preethy'
// }

//  pet.toJSON = function()
// {
//     return this
    
// }

//  console.log(JSON.stringify(pet))

