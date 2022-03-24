const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne =
{
    _id:userOneId,
    name:'Malkareddy Jithender',
    age:20,
    email:'jithender@gmail.com',
    password:'10082000',
    tokens:[{
        token: jwt.sign({_id:userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo =
{
    _id: userTwoId,
    name:'Javvaji Madhu',
    age:45,
    email:'madhu@gmail.com',
    password:'123456789@!',
    tokens:[{
        token: jwt.sign({_id:userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = 
{
    _id: new mongoose.Types.ObjectId(),
    description:'First Task!',
    completed:false,
    owner:userOne._id
}

const taskTwo= 
{
    _id: new mongoose.Types.ObjectId(),
    description:'Second Task!',
    completed:true,
    owner:userOne._id
}

const taskThree = 
{
    _id: new mongoose.Types.ObjectId(),
    description:'Third Task!',
    completed:true,
    owner:userTwo._id
}

const Setupdatabase = async () =>
{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()  
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = 
{
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    Setupdatabase
}